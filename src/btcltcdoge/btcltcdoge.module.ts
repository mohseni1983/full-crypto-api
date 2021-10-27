import { Module } from '@nestjs/common';
import { BtcltcdogeService } from './btcltcdoge.service';
import { SharedModule } from '../shared/shared.module';
import { BtcService } from "./btc.service";

@Module({
  providers: [BtcltcdogeService,BtcService],
  imports:[SharedModule],
  exports:[BtcltcdogeService,BtcService]
})
export class BtcltcdogeModule {}
