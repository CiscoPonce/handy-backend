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
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [User, Job],
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
        ssl: {
          rejectUnauthorized: false
        },
        logging: true,
        logger: "advanced-console"
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
