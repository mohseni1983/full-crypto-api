import { Module } from '@nestjs/common';
import { WalletController } from './controller/wallet.controller';
import { WalletService } from './service/wallet.service';
import { BtcltcdogeModule } from '../btcltcdoge/btcltcdoge.module';
import { NetworkController } from './controller/network.controller';
import { NetworkService } from './service/network.service';
import { TransactionController } from "./controller/transaction.controller";
import { TransactionService } from "./service/transaction.service";
import { TestController } from "./controller/test.controller";

@Module({
    providers:[
        WalletService,NetworkService,TransactionService
    ],
    controllers:[
        WalletController,NetworkController,TransactionController,TestController
    ],
    imports:[
        BtcltcdogeModule
    ]
})
export class ApiModule {}
