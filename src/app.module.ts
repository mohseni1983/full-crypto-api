import { Module } from '@nestjs/common';
import { ApiModule } from "./api/api.module";
import { BtcltcdogeModule } from "./btcltcdoge/btcltcdoge.module";
import { SharedModule } from "./shared/shared.module";

@Module({
  imports: [ApiModule, BtcltcdogeModule, SharedModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
