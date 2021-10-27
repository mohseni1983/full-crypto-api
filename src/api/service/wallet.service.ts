import {  Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import * as Mnemonic from 'multicore-mnemonic';
import * as axios from 'axios';
import { NetworkEnum } from '../../shared/enums/network.enum';
import { BtcltcdogeService } from '../../btcltcdoge/btcltcdoge.service';
import { ChargeTestnetWalletDto } from "../../shared/dto/charge-testnet-wallet.dto";
import { BtcService } from "../../btcltcdoge/btc.service";
//import * as btcwallet from '@nodeberry/node-wallet-generator'
@Injectable()
export class WalletService{
  constructor(
    private readonly btcDogeLtcService:BtcltcdogeService,
    private readonly btcService:BtcService
  ) {
  }
     generateMnemonics():string{
        const code=new Mnemonic(Mnemonic.Words.ENGLISH)
        return code.toString()
    }
    async generateWallets(mnemonic?:string):Promise<any>{
    let  mnemonics=""
    if(!mnemonic)
       mnemonics=this.generateMnemonics()
      else
        mnemonics=mnemonic

      const result=await axios.default.get(`http://pf.barexbit.com:10000/w/${mnemonics}`)
      if(result.status==200){
        if(result.data){
          return {
            mnemonics:mnemonics,
            wallets:result.data,
            //btc_testnet_wallet:"c"
          }
        }
      }

    }

    async getBalance(network:NetworkEnum,address:string):Promise<any>{
       switch (network) {
         case NetworkEnum.BTC:
         case NetworkEnum.BTCTEST:
         case NetworkEnum.DOGE:
         case NetworkEnum.LTC:
         case NetworkEnum.ZEC:
         case NetworkEnum.DASH:
         case NetworkEnum.DASHTEST:
         case NetworkEnum.DOGETEST:
         case NetworkEnum.LTCTEST:
         case NetworkEnum.ZECTEST:
           return await this.btcDogeLtcService.getBalance(network, address);
         default:
           throw new NotFoundException('This network not supported yet.')

       }
    }

    async generateTestWallet(network:NetworkEnum):Promise<any>{
      switch (network) {
        case NetworkEnum.BTCTEST:
          return await this.btcDogeLtcService.generateBtcTestnetWallet()
        default:
          throw new NotFoundException('This network is not supported of you choice a main crypto symbol.')

      }

    }

    async chargeTestNetWallet(chargeTestnetDto:ChargeTestnetWalletDto):Promise<any>{
    switch (chargeTestnetDto.network) {
      case NetworkEnum.BTCTEST:
        return await this.btcService.btcTestnetChargeWallet(chargeTestnetDto)
      default:
        throw new NotFoundException('This network is not supported yet.')

    }
    }


}