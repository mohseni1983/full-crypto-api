import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { TransactionService } from "../service/transaction.service";
import { SendTransactionDto } from "../../shared/dto/send-transaction.dto";
import { CheckTransactionDto } from "../../shared/dto/check-transaction.dto";
@ApiTags('Transaction Utils')
@Controller('transaction')
export class TransactionController{
  constructor(
    private transactionService:TransactionService
  ) {
  }

  @Post('send')
  async sendTransaction(@Body() sendTransactionDto:SendTransactionDto):Promise<any>{
    return await this.transactionService.sendTransaction(sendTransactionDto)
  }

  @Post('checkTransactionStatus')
  async checkTransactionStatus(@Body() checkTransDto:CheckTransactionDto):Promise<any>{
    return await this.transactionService.checkTransaction(checkTransDto)
  }
}