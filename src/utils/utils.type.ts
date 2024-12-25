export interface JobInfoInterface {
  indeedId: string;
  jobTypeId: string;
  name: string;
  description: string;
  pay: string;
  location: string;
  companyName: string;
}

export interface ReturnPayloadInterface {
  jobTypeId: string;
  jobs: JobInfoInterface[];
}
