import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from 'src/app.module';
import * as dotenv from 'dotenv';

const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
dotenv.config({ path: envFile });
console.log(envFile);
console.log(process.env.RABBITMQ_URL);

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
