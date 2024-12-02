import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { User } from './users/user.entity';
import { Job } from './jobs/job.entity';

config();

const configService = new ConfigService();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  entities: [User, Job],
  ssl: {
    rejectUnauthorized: false
  }
});

async function testConnection() {
  try {
    const connection = await AppDataSource.initialize();
    console.log('Successfully connected to database');
    
    // Test querying the users table
    const usersRepo = connection.getRepository(User);
    const users = await usersRepo.find();
    console.log('Users in database:', users);
    
    // Test querying the jobs table
    const jobsRepo = connection.getRepository(Job);
    const jobs = await jobsRepo.find();
    console.log('Jobs in database:', jobs);
    
    await connection.destroy();
    console.log('Connection closed');
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
}

testConnection();
