import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { BtcService } from "../../btcltcdoge/btc.service";
import { NetworkEnum } from "../../shared/enums/network.enum";
@ApiTags('For testing endpoins')
@Controller('test')
export class TestController {
  constructor(
    private readonly btcService:BtcService
  ) {

  }

  @Get('/unspent/:network/:address')
  async getUnspent(@Param('network') network:NetworkEnum,@Param('address') address:string):Promise<any>{
    return await this.btcService.getUnspentBtc(network,address)
  }
}