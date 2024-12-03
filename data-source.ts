import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from './src/users/user.entity';
import { Job } from './src/jobs/job.entity';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: true,
  entities: [User, Job],
  migrations: ['src/migrations/*.ts'],
  extra: {
    ssl: {
      rejectUnauthorized: false
    }
  }
});

export default AppDataSource;
