import { Body, Controller, Post, Render, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthPostGuard } from './auth/auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  @UseGuards(AuthPostGuard)
  @Render('index')
  loadForm(@Body() body: Record<string, unknown>) {
    const { paymentSessionKey } = body as { paymentSessionKey: string };
    return this.appService.loadForm(paymentSessionKey);
  }
}
