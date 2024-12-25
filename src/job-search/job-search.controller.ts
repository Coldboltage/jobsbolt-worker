import { Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { JobSearchService } from 'src/job-search/job-search.service';
import { CreateJobSearchDto } from 'src/job-search/dto/create-job-search.dto';
import { UpdateJobSearchDto } from 'src/job-search/dto/update-job-search.dto';

@Controller()
export class JobSearchController {
  constructor(private readonly jobSearchService: JobSearchService) { }

  @EventPattern('createJobSearch')
  async create(
    @Payload() createJobSearchDto: CreateJobSearchDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      console.log('Processing job:', createJobSearchDto);
      await this.jobSearchService.create(createJobSearchDto);
      channel.ack(originalMessage);
    } catch (error) {
      console.error('Job processing failed:', error);
    }
  }

  @MessagePattern('findAllJobSearch')
  findAll() {
    return this.jobSearchService.findAll();
  }

  @MessagePattern('findOneJobSearch')
  findOne(@Payload() id: number) {
    return this.jobSearchService.findOne(id);
  }

  @MessagePattern('updateJobSearch')
  update(@Payload() updateJobSearchDto: UpdateJobSearchDto) {
    return this.jobSearchService.update(
      updateJobSearchDto.id,
      updateJobSearchDto,
    );
  }

  @MessagePattern('removeJobSearch')
  remove(@Payload() id: number) {
    return this.jobSearchService.remove(id);
  }
}
