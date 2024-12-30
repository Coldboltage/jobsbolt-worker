import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { JobInfoInterface, ReturnPayloadInterface } from 'src/utils/utils.type';

// const puppeteer = require('puppeteer-extra')
// const StealthPlugin = require('puppeteer-extra-plugin-stealth')
// puppeteer.use(StealthPlugin())

@Injectable()
export class UtilsService {
  constructor(private httpService: HttpService) { }

  async getJobSearchPage(
    jobTypeId: string,
    name: string,
    location: string,
  ): Promise<ReturnPayloadInterface> {
    // add stealth plugin and use defaults (all evasion techniques)
    const url = `https://uk.indeed.com/jobs?q=${name}${location !== null ? `&l=${location}` : ''}&fromage=1`;
    console.log(url);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // const browser = await puppeteer.launch({
    //   headless: false,
    //   targetFilter: (target) => target.type() !== 'other',
    // });
    // await browser.close();

    const { connect } = await import('puppeteer-real-browser');

    const { page, browser } = await connect({
      headless: 'auto',
      args: [],
      customConfig: {},
      skipTarget: [],
      fingerprint: false,
      turnstile: true,
      connectOption: {},
      fpconfig: {},
    });

    const indeedJobList: JobInfoInterface[] = [];
    let continueLoop = true;

    // const page = await browser.newPage();
    const getJobs = async (counter: number) => {
      console.log(url);
      await page.goto(`${url}&start=${counter}`, {
        waitUntil: 'domcontentloaded',
        setTimeout: 60000,
      });

      try {
        await page.waitForSelector('#mosaic-jobResults');
      } catch (error) {
        console.log("Page should be loaded with no jobs")
        continueLoop = false
        return
      }

      const indeedIds = await page.evaluate(() => {
        const elements = document.querySelectorAll(`[data-jk]`);
        return Array.from(elements).map((element) => {
          return element.getAttribute('data-jk');
        });
      });

      const nextPagination: boolean = await page.evaluate(() => {
        const element = document.querySelector(
          '[data-testid=pagination-page-next]',
        );
        if (element) return true;
        return false;
      });

      console.log(indeedIds);

      for (const job of indeedIds) {
        await page.goto(`https://www.indeed.com/viewjob?jk=${job}&spa=1`, {
          waitUntil: 'domcontentloaded',
        });

        const pageContent = await page.evaluate(() => {
          return document.body.innerText;
        });

        let data;

        try {
          data = JSON.parse(pageContent);
        } catch (error) {
          console.log('Activated');
          await new Promise((r) => setTimeout(r, 8000));
          continue;
        }

        if (data) console.log(data.body.jobTitle);

        console.log(job);

        const jobInfo: JobInfoInterface = {
          indeedId: job,
          jobTypeId,
          name: data.body.jobTitle,
          description:
            data.body.hostQueryExecutionResult.data.jobData.results[0].job
              .description.text,
          pay: data.body.salaryInfoModel?.salaryText
            ? data.body.salaryInfoModel.salaryText
            : 'null',
          location: data.body.jobLocation,
          companyName:
            data.body.jobInfoWrapperModel.jobInfoModel.jobInfoHeaderModel
              .companyName,
        };

        const isUniqueJob = (): boolean => {
          return indeedJobList.some(
            (job) =>
              job.indeedId === jobInfo.indeedId &&
              job.jobTypeId === jobInfo.jobTypeId,
          );
        };

        if (!isUniqueJob()) {
          indeedJobList.push(jobInfo);
        }
      }

      if (!nextPagination) continueLoop = false;
    };

    for (let counter = 0; continueLoop; counter += 10) {
      await getJobs(counter);
    }

    await browser.close();

    const returnPayload: ReturnPayloadInterface = {
      jobTypeId,
      jobs: indeedJobList,
    };

    return returnPayload;
  }
}
