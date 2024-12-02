import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JobsModule } from './jobs/jobs.module';
import { User } from './users/user.entity';
import { Job } from './jobs/job.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres' as const,
        url: 'postgresql://handyman_owner:h8BJOiTxtP6d@ep-patient-fog-a2kjx4by.eu-central-1.aws.neon.tech/handyman',
        entities: [User, Job],
        synchronize: process.env.NODE_ENV !== 'production',
        ssl: {
          rejectUnauthorized: true,
        },
        logging: true,
        logger: "advanced-console" as const
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    JobsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
