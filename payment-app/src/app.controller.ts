import { Body, Controller, Post, Render, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './auth/auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Render('index')
  load(@Body() body: Record<string, unknown>) {
    /* CONSOLE DEBUG TOREMOVE */ /* prettier-ignore */ console.log("==LOG==\n", "body:", typeof body, "↴\n", body, "\n==END==\n")

    return this.appService.getHello();
  }
}
