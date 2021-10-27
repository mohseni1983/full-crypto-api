import { NetworkEnum } from "../enums/network.enum";
import { ApiProperty } from "@nestjs/swagger";

export class CheckTransactionDto {
  @ApiProperty()
  txId:string
  @ApiProperty()
  network:NetworkEnum
}