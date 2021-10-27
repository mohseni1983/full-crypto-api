import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { WalletService } from "../service/wallet.service";
import { NetworkEnum } from '../../shared/enums/network.enum';
import { ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import * as net from "net";
import { ChargeTestnetWalletDto } from "../../shared/dto/charge-testnet-wallet.dto";

@ApiTags('Wallet endpoints')
@Controller('wallet')
export class WalletController{
    constructor(private walletService:WalletService){
    }
  @ApiParam({required:false,name:'mnemonics',allowEmptyValue:true,description:'12 or 24 words of mnemonics'})
  @Get('generate/:mnemonics?')
     async generate(@Param('mnemonics') mnemonics?:string):Promise<any>{
        return await this.walletService.generateWallets(mnemonics);
    }

    @Get('balance/:network/:address')
    async getBalance(@Param('network') network: NetworkEnum, @Param('address') address: string): Promise<any> {
      return await this.walletService.getBalance(network,address)
    }

    @Get('testnet/generateWallet/:network')
    async generateTestNetWallet(@Param('network') network:NetworkEnum):Promise<any>{
      return await this.walletService.generateTestWallet(network)
    }

    //@Get('testnet/charge/:network/:amount')
  @Post('testnet/charge')
  async chargeTestNetWallet(@Body() chargeTestnetDto:ChargeTestnetWalletDto):Promise<any>{
      return await this.walletService.chargeTestNetWallet(chargeTestnetDto)
  }


}