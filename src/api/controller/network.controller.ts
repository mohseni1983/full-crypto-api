import { Controller, Get, Param } from '@nestjs/common';
import { NetworkService } from '../service/network.service';
import { NetworkEnum } from '../../shared/enums/network.enum';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
@ApiTags('Network endpoints')
@Controller('network')
export class NetworkController {
constructor(private networkService:NetworkService) {
}
@Get('info/:network')
async getNetworkInfo(@Param('network') network:NetworkEnum):Promise<any>{
  return this.networkService.getNetworkInfo(network)
}
}