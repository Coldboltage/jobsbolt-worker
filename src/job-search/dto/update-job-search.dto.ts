import { PartialType } from '@nestjs/mapped-types';
import { CreateJobSearchDto } from 'src/job-search/dto/create-job-search.dto';

export class UpdateJobSearchDto extends PartialType(CreateJobSearchDto) {
  id: number;
}
