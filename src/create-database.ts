import { createConnection } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

async function createDatabase() {
  try {
    console.log('Connecting to postgres database to create handyman_db...');
    
    const connection = await createConnection({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: 'postgres', // Connect to default database
      ssl: {
        rejectUnauthorized: false
      },
      extra: {
        ssl: {
          rejectUnauthorized: false
        }
      }
    });

    console.log('Connected to postgres database');
    
    // Create the database
    await connection.query(`CREATE DATABASE handyman_db`);
    console.log('✅ Database handyman_db created successfully!');

    await connection.close();
    console.log('Connection closed successfully.');
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
    if (error.detail) {
      console.error('Error detail:', error.detail);
    }
  }
}

createDatabase();
