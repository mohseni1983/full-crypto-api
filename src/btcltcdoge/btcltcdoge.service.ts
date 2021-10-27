import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { NetworkEnum } from '../shared/enums/network.enum';
import * as axios from 'axios';
import * as btc_utils from "btc-utils"
import { ChargeTestnetWalletDto } from "../shared/dto/charge-testnet-wallet.dto";
import * as Charger from 'testnet-charger'
import { CreateBtcTestnetHotWalletType } from "../shared/types/create-btc-testnet-hot-wallet.type";
import { CheckTransactionDto } from "../shared/dto/check-transaction.dto";

@Injectable()
export class BtcltcdogeService {

  async checkTransaction(checkTransDto:CheckTransactionDto):Promise<any>{
    try{
      const result=await axios.default.get(`https://chain.so//api/v2/is_tx_confirmed/${checkTransDto.network}/${checkTransDto.txId}`)
      if(result.status!==200){
        throw new BadGatewayException('Error in push transaction data ')
      }
      return result.data
    }catch (e) {
      throw new BadGatewayException('Error in push transaction data ')
    }
  }

  async getBalance(network:NetworkEnum,address:string):Promise<any>{
    try{
      const result = await axios.default.get(`https://chain.so/api/v2/get_address_balance/${network.toUpperCase()}/${address}`);
      if (result.status !== 200 || !result.data.status) {
        throw new BadRequestException(result.status);
      }
      return result.data;
    }catch (e) {
      throw new BadGatewayException(e);
    }

  }

  async getNetworkInfo(network:NetworkEnum):Promise<any>{
    try{
      const result = await axios.default.get(`https://chain.so/api/v2/get_info/${network}`);
      if(result.status!==200){
        throw new BadRequestException(result.data.status)
      }
      return result.data
    } catch (e) {
      throw new BadGatewayException(e)
    }
  }

  async generateBtcTestnetWallet():Promise<any>{
    return await btc_utils.generateTestAccounts();
  }

  // 2ym7gfkddyi2ehkha3kpjmmyzcy
}
