import { ApiProperty } from "@nestjs/swagger";
import { NetworkEnum } from "../enums/network.enum";

export class SendTransactionDto {
  @ApiProperty()
  fromAddress:string
  @ApiProperty()
  toAddress:string
  @ApiProperty()
  amount:number
  @ApiProperty()
  privateKeyOrWIF:string
  @ApiProperty()
  network:NetworkEnum
}