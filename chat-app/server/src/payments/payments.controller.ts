import { Request } from 'express';
import { AxiosResponse } from 'axios';
import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpService,
  HttpException,
  HttpStatus,
  Query,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CreatePaymentDto } from './dto/create-payment.dto';
import { UsersService } from '../users/users.service';
import { UserDto } from '../users/dto/user.dto';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly httpService: HttpService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @UseGuards(AuthGuard())
  async create(
    @Body() { amount, toUserId }: CreatePaymentDto,
    @Req() req: Request,
  ) {
    const currentUser = req.user as UserDto;
    const toUser = await this.usersService.findOne({
      where: {
        id: toUserId,
      },
    });
    const paymentGatewayRawResponse: AxiosResponse = await this.httpService
      .post(
        `${process.env.PAYMENT_SERVER}/transfers`,
        {
          to: toUser.email,
          amount: Number(amount),
          from: currentUser.email,
          cardNumber: currentUser.cardNumber,
          cardName: currentUser.cardName,
          cardExpiry: currentUser.cardExpiry,
          cardCvc: currentUser.cardCvc,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.BANK_SECRET_KEY}`,
          },
        },
      )
      .toPromise()
      .catch(error => {
        console.error(error.response.data.message);
        throw new HttpException(
          error.response.data.message.join(', \n'),
          HttpStatus.BAD_GATEWAY,
        );
      });
    const paymentData = paymentGatewayRawResponse?.data;

    return {
      paymentSessionKey: paymentData?.paymentSessionKey,
    };
  }

  @UseGuards(AuthGuard())
  @Get('check-status')
  async checkPayment(@Query('paymentSessionKey') paymentSessionKey: string) {
    if (!paymentSessionKey) {
      throw new HttpException(
        'paymentSessionKey not present',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    const checkPaymentStatusResponse: AxiosResponse = await this.httpService
      .get(`${process.env.PAYMENT_SERVER}/transfers/check-status`, {
        headers: {
          Authorization: `Bearer ${process.env.BANK_SECRET_KEY}`,
        },
        params: {
          paymentSessionKey,
        },
      })
      .toPromise()
      .catch(error => {
        console.error(error.message);
        throw error;
      });
    const checkPaymentStatusData = checkPaymentStatusResponse.data;

    if (checkPaymentStatusData?.paymentSessionKey !== paymentSessionKey) {
      throw new HttpException(
        'Bad paymentSessionKey from payment gateway',
        HttpStatus.BAD_GATEWAY,
      );
    }

    return {
      paymentStatus: checkPaymentStatusData.transferStatus,
    };
  }
}
