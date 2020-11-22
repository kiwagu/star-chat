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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly httpService: HttpService) {}

  @Post()
  @UseGuards(AuthGuard())
  async create(@Body() { amount }: CreatePaymentDto) {
    let paymentGatewayRawResponse: AxiosResponse = null;
    try {
      paymentGatewayRawResponse = await this.httpService
        .post(
          `${process.env.PAYMENT_SERVER}/transfers`,
          {
            // TODO: find users by id from User service
            from: 'alice@email.com',
            to: 'bob@email.com',
            amount: Number(amount),
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.BANK_SECRET_KEY}`,
            },
          },
        )
        .toPromise();
    } catch (error) {
      console.error(error.response.data.message);
      throw new HttpException(
        error.response.data.message,
        HttpStatus.BAD_GATEWAY,
      );
    }
    const paymentData = paymentGatewayRawResponse.data;

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
