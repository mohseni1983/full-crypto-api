import { NetworkEnum } from "../enums/network.enum";
import { ApiProperty } from "@nestjs/swagger";

export class ChargeTestnetWalletDto {
  @ApiProperty()
  amount:number
  @ApiProperty()
  testnet_address_wallet:string
  @ApiProperty()
  network:NetworkEnum
}