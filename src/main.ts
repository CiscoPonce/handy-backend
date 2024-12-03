import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { DataSource } from 'typeorm';

// Import the ExceptionFilter class
import { AllExceptionsFilter } from './exception.filter';

async function bootstrap() {
  try {
    // Create the NestJS application
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'debug', 'log', 'verbose'],
    });
    
    console.log('Starting NestJS application...');
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Working directory:', process.cwd());

    // Test database connection
    try {
      const dataSource = app.get(DataSource);
      await dataSource.query('SELECT 1');
      console.log('Database connection successful');
    } catch (dbError) {
      console.error('Database connection failed:', dbError);
      throw dbError;
    }
    
    // Enable CORS with specific options
    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: '*',
      credentials: true,
    });
    
    console.log('CORS enabled');
    
    // Set global API prefix
    app.setGlobalPrefix('api');
    
    console.log('Global API prefix set');
    
    // Security with custom configuration
    app.use(helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: false,
      crossOriginResourcePolicy: false,
    }));
    
    console.log('Helmet security configured');
    
    // Validation with detailed error messages
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      enableDebugMessages: true,
      stopAtFirstError: false,
    }));
    
    console.log('Validation pipe configured');

    // Global exception filter for detailed error messages
    app.useGlobalFilters(new AllExceptionsFilter());

    // Swagger documentation
    const config = new DocumentBuilder()
      .setTitle('Handy API')
      .setDescription('The Handy API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    
    console.log('Swagger documentation configured');

    const port = process.env.PORT || 3000;
    const host = '0.0.0.0';
    
    console.log(`Attempting to start server on ${host}:${port}`);
    
    await app.listen(port, host, () => {
      console.log(`Application is running on port ${port}`);
      console.log(`Swagger documentation: http://${host}:${port}/api`);
      console.log(`Try accessing the API at: http://localhost:${port}/api/users`);
      console.log(`Local network access: http://192.168.1.246:${port}/api/users`);
    });

    // Add signal handlers for graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('SIGTERM received. Closing application...');
      await app.close();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      console.log('SIGINT received. Closing application...');
      await app.close();
      process.exit(0);
    });

  } catch (error) {
    console.error('Failed to start the application:', error);
    process.exit(1);
  }
}

bootstrap().catch(err => {
  console.error('Unhandled error during bootstrap:', err);
  process.exit(1);
});
