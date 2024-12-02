import { createConnection } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  try {
    console.log('Attempting to connect to database...');
    console.log(`Host: ${process.env.DB_HOST}`);
    console.log(`Database: ${process.env.DB_NAME}`);
    console.log(`Username: ${process.env.DB_USERNAME}`);
    
    const connection = await createConnection({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: {
        rejectUnauthorized: false
      },
      extra: {
        ssl: {
          rejectUnauthorized: false
        }
      }
    });

    console.log('✅ Database connection was successful!');
    
    // Test query
    const result = await connection.query('SELECT NOW()');
    console.log('Database time:', result[0].now);

    await connection.close();
    console.log('Connection closed successfully.');
  } catch (error) {
    console.error('❌ Error connecting to the database:');
    console.error('Error details:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
    if (error.detail) {
      console.error('Error detail:', error.detail);
    }
  }
}

testConnection();
