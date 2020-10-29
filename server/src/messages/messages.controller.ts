import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from 'src/users/dto/user.dto';

import { CreateMessageDto } from './dto/create-message.dto';
import { MessageEntity } from './entity/message.entity';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  @UseGuards(AuthGuard())
  public async messages(@Req() req: any) {
    const user = req.user as UserDto;

    return this.messagesService.findAll(user.id);
  }

  @Post()
  @UseGuards(AuthGuard())
  public async create(
    @Req() req: any,
    @Body() createMessageDto: CreateMessageDto,
  ): Promise<MessageEntity> {
    const user = req.user as UserDto;

    return await this.messagesService.create(user.id, createMessageDto);
  }
}
