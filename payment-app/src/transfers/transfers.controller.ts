import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Res,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

import { TransfersService } from './transfers.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { PinDto } from './dto/pin.dto';
import { AuthPostGuard, AuthHeaderGuard } from '../auth/auth.guard';

@Controller('transfers')
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @Post()
  @UseGuards(AuthHeaderGuard)
  create(@Body() createTransferDto: CreateTransferDto) {
    return this.transfersService.create(createTransferDto);
  }

  @Post('pin')
  @UseGuards(AuthPostGuard)
  pin(@Body() pinDto: PinDto, @Res() res: Response) {
    const { pin, paymentSessionKey } = pinDto;
    const checkSum = this.transfersService.calcChecksum(paymentSessionKey);

    if (pin === checkSum.substr(checkSum.length - 4, 4)) {
      this.transfersService.setStatus(paymentSessionKey, 'success');
      return res.render('success');
    }
    this.transfersService.setStatus(paymentSessionKey, 'failed');
    return res.render('error');
  }

  @Get('check-status')
  @UseGuards(AuthHeaderGuard)
  checkStatus(@Query('paymentSessionKey') paymentSessionKey: string) {
    if (!paymentSessionKey) {
      throw new HttpException(
        'paymentSessionKey not present',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const transfer = this.transfersService.getStatus(paymentSessionKey);

    if (!transfer) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return {
      paymentSessionKey: transfer.paymentSessionKey,
      transferStatus: transfer.status,
    };
  }
}
