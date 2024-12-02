import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const usersService = app.get(UsersService);

  // Test users data
  const users = [
    {
      email: 'john.doe@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe'
    },
    {
      email: 'jane.smith@example.com',
      password: 'password123',
      firstName: 'Jane',
      lastName: 'Smith'
    },
    {
      email: 'bob.wilson@example.com',
      password: 'password123',
      firstName: 'Bob',
      lastName: 'Wilson'
    }
  ] as Partial<User>[];

  console.log('Starting to seed users...');

  try {
    for (const userData of users) {
      // Hash the password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Create user with hashed password
      const user = await usersService.create({
        ...userData,
        password: hashedPassword
      });
      console.log(`Created user: ${user.email}`);
    }

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
