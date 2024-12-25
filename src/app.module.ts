import { Module } from '@nestjs/common';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { JobSearchModule } from 'src/job-search/job-search.module';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  imports: [JobSearchModule, UtilsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
