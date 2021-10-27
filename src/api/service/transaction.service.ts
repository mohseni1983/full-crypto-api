import { Injectable, NotFoundException } from "@nestjs/common";
import { BtcService } from "../../btcltcdoge/btc.service";
import { SendTransactionDto } from "../../shared/dto/send-transaction.dto";
import { NetworkEnum } from "../../shared/enums/network.enum";
import { BtcltcdogeService } from "../../btcltcdoge/btcltcdoge.service";
import { CheckTransactionDto } from "../../shared/dto/check-transaction.dto";

@Injectable()
export class TransactionService {
  constructor(
    private readonly btcService:BtcService,
    private readonly btcDogeLtcService:BtcltcdogeService
  ) {
  }

  async checkTransaction(checkTransDto:CheckTransactionDto):Promise<any>{
    return await this.btcDogeLtcService.checkTransaction(checkTransDto)
  }

  async sendTransaction(sendTransactionDto:SendTransactionDto):Promise<any>{
    switch (sendTransactionDto.network) {
      case NetworkEnum.BTCTEST:
      case NetworkEnum.BTC:
        return await this.btcService.sendTransaction(sendTransactionDto)
      default:
        throw new NotFoundException('This network is not support yet.')

    }
  }
}