import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../users/user.entity';
import { Job } from '../jobs/job.entity';
import { CleanupAndRecreate1701527000000 } from '../migrations/1701527000000-CleanupAndRecreate';

config();

async function runMigration() {
  const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    ssl: true,
    entities: [User, Job],
    migrations: [CleanupAndRecreate1701527000000],
    extra: {
      ssl: {
        rejectUnauthorized: false
      }
    }
  });

  try {
    console.log('Initializing connection...');
    await dataSource.initialize();
    console.log('Running migration...');
    await dataSource.runMigrations();
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Error running migration:', error);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

runMigration();
