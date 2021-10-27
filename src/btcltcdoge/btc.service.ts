import { BadGatewayException, BadRequestException, Injectable } from "@nestjs/common";
import { ChargeTestnetWalletDto } from "../shared/dto/charge-testnet-wallet.dto";
import * as axios from "axios";
import { CreateBtcTestnetHotWalletType } from "../shared/types/create-btc-testnet-hot-wallet.type";
import { SendTransactionDto } from "../shared/dto/send-transaction.dto";
import * as bitcore from 'bitcore-lib'
import { NetworkEnum } from "../shared/enums/network.enum";
import { UnspentBtcType } from "./type/unspent-btc.type";
import { UtxoType } from "./type/utxo.type";
@Injectable()
export class BtcService {
  sigleSpondApiKey="2ym7gfkddyi2ehkha3kpjmmyzcy"



  async btcTestnetChargeWallet(chargeDto:ChargeTestnetWalletDto):Promise<any>{

    const {testnet_address_wallet,amount,network}=chargeDto
    const {xpub,xprv,password}=await this.createBTCTestnetHotWallet()
    try{
      const result=await axios.default.get(`https://singlespend.com/api/tbtc/v1/send?xpub=${xpub}&password=${password}&to=${testnet_address_wallet}-9000000&apikey=${this.sigleSpondApiKey}&feetarget=6
`);
      if(result.status!==200 || result.data.error!==null){
        throw new BadGatewayException(`Error in sending transaction`)
      }
      return {
        txId:result.data.txId,
        error:result.data.error
      }
    }catch (e) {
      throw new BadGatewayException(`Error in sending transaction : ${e}`)

    }


  }

  async createBTCTestnetHotWallet():Promise<CreateBtcTestnetHotWalletType>{
    const result=await axios.default.get(`https://singlespend.com/api/tbtc/v1/createwallet?apikey=${this.sigleSpondApiKey}`)
    if(result.status!==200 || result.data.error !==null){
      throw new BadGatewayException('Error in creating BTC hot wallet')
    }
    const hotWallet:CreateBtcTestnetHotWalletType={
      password:result.data.password,
      xprv:result.data.xprv,
      xpub:result.data.xpub
    }
    return hotWallet

  }

  async sendTransaction(sendTransactionDto:SendTransactionDto):Promise<any>{
    const signedTransaction=await this.signTransaction(sendTransactionDto)
    try{
      const result=await axios.default.post(`https://chain.so//api/v2/send_tx/${sendTransactionDto.network}`
        ,{
        tx_hex:signedTransaction
        }
      )
      if(result.status!==200){
        throw new BadRequestException('Error is transfer')
      }
      return result.data
    }catch (e) {
      throw new BadRequestException(e)
    }

  }

  async signTransaction(sendTransactionDto:SendTransactionDto):Promise<any>{
    const {fromAddress,toAddress,amount,privateKeyOrWIF}=sendTransactionDto
    const txs= await this.getUnspentBtc(sendTransactionDto.network,sendTransactionDto.fromAddress)
    const satoshiToSend=Math.floor(amount*100000000);
    const fee=this.calculateFee(txs)
    const availableAmount=this.calculateTotalAmountAvailable(txs)
    this.checkAmountIsEnough(satoshiToSend,fee,availableAmount)
    const inputs=this.generateUtxo(txs,fromAddress)
    const transaction=new bitcore.Transaction();
    try{
      transaction.from(inputs)
      transaction.to(toAddress,satoshiToSend);
      transaction.change(fromAddress);
      transaction.fee(fee)
      transaction.sign(privateKeyOrWIF);
      const serialized= transaction.serialize()
      return serialized

    }catch (e) {
      throw new BadGatewayException(e)
    }
  }


  calculateFee(txs:UnspentBtcType[]):number{
    const outputCount=2;
    let fee=0;
    const inputCount=txs.length;
    const transactionSize=inputCount*146+outputCount*34+10-inputCount;
    const transactionFee=transactionSize*20
    return transactionFee
  }

  calculateTotalAmountAvailable(txs:UnspentBtcType[]):number{
    let satoshiToSend=0;
    txs.forEach(x=>{
      satoshiToSend+=Math.floor(Number(x.value)*100000000)
    })
    return satoshiToSend
  }

  checkAmountIsEnough(satoshiToSend:number,fee:number,totalAmountAvailable:number){
    const resultOfCalculate:number=totalAmountAvailable-satoshiToSend-fee
    if(resultOfCalculate<0){
      throw new BadRequestException(`Balance too low for this transaction. You need ${-1*resultOfCalculate/100000000} more.`)
    }
  }

  generateUtxo(txs:UnspentBtcType[],fromAddress:string):any{
    let inputs=[]
    txs.forEach(item=>{
      const utxo:UtxoType={
        satoshis:Math.floor(Number(item.value)*100000000),
        address:fromAddress,
        outputIndex:item.output_no,
        script:item.script_hex,
        txId:item.txid
      }
      inputs.push(utxo)
    })
    return inputs;

  }

/*
  async signTransaction(sendTransactionDto:SendTransactionDto):Promise<string>{
    const {amount,network,fromAddress,privateKeyOrWIF,toAddress}=sendTransactionDto
    let networkStr='testnet'
    switch (network) {
      case NetworkEnum.BTC:
        networkStr='mainnet'
        break;
      case NetworkEnum.BTCTEST:
        networkStr='testnet'
        break;
    }

  }
*/

  async getUnspentBtc(network:NetworkEnum,sourceAddress:string):Promise<UnspentBtcType[]>{

    try{
      const result=await axios.default.get(`https://chain.so//api/v2/get_tx_unspent/${network}/${sourceAddress}`)
      if(result.status!==200 )
        throw new BadGatewayException('Gateway error')
      if(result.data.status!=="success")
        throw new BadRequestException(result.data.data)
      const txs=result.data.data.txs
      let unspents:UnspentBtcType[]=[]
      txs.forEach(item=>{
        const v:UnspentBtcType={
          txid:item.txid,
          script_hex:item.script_hex,
          script_asm:item.script_asm,
          output_no:item.output_no,
          time:item.time,
          confirmations:item.confirmations,
          value:item.value
        }
        unspents.push(v)
      })
      return  unspents
    }
    catch (e) {
      throw e
    }
  }





}