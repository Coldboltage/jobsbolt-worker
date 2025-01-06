import { IsBoolean, IsString } from 'class-validator';

export class CreateJobSearchDto {
  @IsString()
  jobTypeId: string;

  @IsString()
  name: string;

  @IsString()
  location: string;

  @IsBoolean()
  firstTime: boolean;
}
