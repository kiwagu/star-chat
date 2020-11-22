import { Module } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { TransfersController } from './transfers.controller';

@Module({
  controllers: [TransfersController],
  exports: [TransfersService],
  providers: [TransfersService],
})
export class TransfersModule {}
