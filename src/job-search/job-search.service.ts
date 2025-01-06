import { Injectable } from '@nestjs/common';
import { CreateJobSearchDto } from 'src/job-search/dto/create-job-search.dto';
import { UpdateJobSearchDto } from 'src/job-search/dto/update-job-search.dto';
import { UtilsService } from 'src/utils/utils.service';

@Injectable()
export class JobSearchService {
  constructor(private utilsService: UtilsService) { }
  async create(createJobSearchDto: CreateJobSearchDto) {
    const { jobTypeId, name, location, firstTime } = createJobSearchDto;
    const result = await this.utilsService.getJobSearchPage(
      jobTypeId,
      name,
      location,
      firstTime,
    );
    console.log(result);
    try {
      const response = await fetch(
        `http://${process.env.API_URL}:3000/api/job/by-worker/${result.jobTypeId}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.JWT_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(result),
        },
      );
      console.log(response.statusText);
      console.log(response.status);
    } catch (error) {
      console.log(error);
      console.log('An issue occured when sending jobs to by-worker');
    }
  }

  findAll() {
    return `This action returns all jobSearch`;
  }

  findOne(id: number) {
    return `This action returns a #${id} jobSearch`;
  }

  update(id: number, updateJobSearchDto: UpdateJobSearchDto) {
    return `This action updates a #${id} jobSearch`;
  }

  remove(id: number) {
    return `This action removes a #${id} jobSearch`;
  }
}
