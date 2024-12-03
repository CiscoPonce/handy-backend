import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { User } from './users/user.entity';
import { Job } from './jobs/job.entity';

config();

const configService = new ConfigService();

const AppDataSource = new DataSource({
  type: 'postgres',
  url: configService.get('DATABASE_URL'),
  ssl: true,
  entities: [User, Job],
  extra: {
    ssl: {
      rejectUnauthorized: false
    }
  }
});

async function testConnection() {
  try {
    console.log('Attempting to connect to database...');
    const connection = await AppDataSource.initialize();
    console.log('Successfully connected to database');
    
    console.log('Checking database tables...');
    const tables = await connection.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('Tables in database:', tables);
    
    console.log('Checking job table structure...');
    const jobTableInfo = await connection.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'job'
    `);
    console.log('Job table structure:', jobTableInfo);
    
    console.log('Testing user repository...');
    const usersRepo = connection.getRepository(User);
    const users = await usersRepo.find();
    console.log('Users in database:', users.length, 'found');
    
    console.log('Testing job repository...');
    const jobsRepo = connection.getRepository(Job);
    const jobs = await jobsRepo.find();
    console.log('Jobs in database:', jobs.length, 'found');
    
    await connection.destroy();
    console.log('Connection closed successfully');
  } catch (error) {
    console.error('Database connection error:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      syscall: error.syscall,
      address: error.address,
      port: error.port
    });
  }
}

testConnection();
