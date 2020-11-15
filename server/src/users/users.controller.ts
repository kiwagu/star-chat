import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Not } from 'typeorm';
import { Request as Req } from 'express';

import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';

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
