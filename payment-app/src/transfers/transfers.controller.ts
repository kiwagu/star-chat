import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Render,
  Res,
} from '@nestjs/common';

import { Response } from 'express';

import { TransfersService } from './transfers.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('transfers')
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createTransferDto: CreateTransferDto) {
    return this.transfersService.create(createTransferDto);
  }

  @Post('pin')
  @UseGuards(AuthGuard)
  pin(@Body() body, @Res() res: Response) {
    /* CONSOLE DEBUG TOREMOVE */ /* prettier-ignore */ console.log("==LOG==\n", "body:", typeof body, "↴\n", body, "\n==END==\n")

    return res.render('success');
  }

  @Get()
  findAll() {
    return this.transfersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transfersService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransferDto: UpdateTransferDto,
  ) {
    return this.transfersService.update(+id, updateTransferDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transfersService.remove(+id);
  }
}
