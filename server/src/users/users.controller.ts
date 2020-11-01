import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request as Req } from 'express';
import { Not } from 'typeorm';

import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard())
  users(@Request() req: Req) {
    const currentUser = req.user as UserDto;

    return this.usersService.findAll({
      where: {
        id: Not(currentUser.id),
      },
    });
  }
}
