import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from 'src/app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${process.env.RABBITMQ_URL}:5672`],
        queue: 'jobs_queue',
        queueOptions: {
          durable: false,
        },
        prefetchCount: 1,
        noAck: false,
      },
    },
  );
  await app.listen();
}
bootstrap();
