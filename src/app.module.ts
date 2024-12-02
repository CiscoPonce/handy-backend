import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const config = {
          type: 'postgres' as const,
          url: 'postgresql://handyman_owner:h8BJOiTxtP6d@ep-patient-fog-a2kjx4by.eu-central-1.aws.neon.tech/handyman',
          entities: [User],
          synchronize: process.env.NODE_ENV !== 'production',
          ssl: {
            rejectUnauthorized: true,
          },
          logging: true,
          logger: "advanced-console" as const
        };

        // Log database configuration (excluding sensitive data)
        console.log('Database Configuration:', {
          type: config.type,
          entities: config.entities,
          ssl: config.ssl,
        });

        return config;
      },
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
