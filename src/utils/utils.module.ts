import { Module } from '@nestjs/common';
import { UtilsService } from 'src/utils/utils.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [UtilsService],
  exports: [UtilsService],
})
export class UtilsModule { }
