import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { User } from '../users/user.entity';
import { Job } from '../jobs/job.entity';

config();

const configService = new ConfigService();

const AppDataSource = new DataSource({
  type: 'postgres',
  url: configService.get('DATABASE_URL'), // We'll update .env to use DATABASE_URL
  ssl: true,
  entities: [User, Job],
  migrations: ['src/migrations/*.ts'],
  connectTimeoutMS: 10000,
  extra: {
    ssl: {
      rejectUnauthorized: false
    }
  }
});

export default AppDataSource;
