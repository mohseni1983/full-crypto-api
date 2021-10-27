import { Injectable, NotFoundException } from '@nestjs/common';
import { BtcltcdogeService } from '../../btcltcdoge/btcltcdoge.service';
import { NetworkEnum } from '../../shared/enums/network.enum';

@Injectable()
export class NetworkService {
constructor(private readonly btcDogeLtcService:BtcltcdogeService) {
}

async getNetworkInfo(network:NetworkEnum):Promise<any>{
  switch (network) {
    case NetworkEnum.ZEC:
    case NetworkEnum.LTC:
    case NetworkEnum.DOGE:
    case NetworkEnum.BTCTEST:
    case NetworkEnum.BTC:
    case NetworkEnum.LTCTEST:
    case NetworkEnum.ZECTEST:
    case NetworkEnum.DOGETEST:
    case NetworkEnum.DASHTEST:
    case NetworkEnum.DASH:
      return await this.btcDogeLtcService.getNetworkInfo(network);
    default:
      throw new NotFoundException('This network not supported yet')

  }
}
}