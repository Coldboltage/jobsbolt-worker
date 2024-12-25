import { Test, TestingModule } from '@nestjs/testing';
import { JobSearchController } from './job-search.controller';
import { JobSearchService } from './job-search.service';

describe('JobSearchController', () => {
  let controller: JobSearchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobSearchController],
      providers: [JobSearchService],
    }).compile();

    controller = module.get<JobSearchController>(JobSearchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
