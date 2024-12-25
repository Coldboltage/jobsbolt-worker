import { Module } from '@nestjs/common';
import { JobSearchService } from 'src/job-search/job-search.service';
import { JobSearchController } from 'src/job-search/job-search.controller';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  imports: [UtilsModule],
  controllers: [JobSearchController],
  providers: [JobSearchService],
})
export class JobSearchModule { }
