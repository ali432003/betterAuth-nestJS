import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { connectDB, disconnectDB } from './lib/prisma';
import morgan from 'morgan';
import { cloudinaryConfig, envConfig } from './lib/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  try {
    await connectDB();
    await cloudinaryConfig();
    const app = await NestFactory.create(AppModule, {
      bodyParser: false,
      logger: false,
    });
    // app.enableCors({
    //   origin: envConfig.BETTER_AUTH_URL as string,
    //   credentials: true,
    // });
    app.use(morgan('dev'));
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,              
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.listen(process.env.PORT ?? 3000);

    console.log(`Server is running on port http://localhost:${process.env.PORT ?? 3000}`);
  } catch (error) {
    console.error(error);
    await disconnectDB();
    process.exit(1);
  }
}
bootstrap();
