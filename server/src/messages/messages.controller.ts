import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
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
  public async messages(
    @Req() req: any,
    @Query('selectedUser') selectedUser: string,
  ) {
    const user = req.user as UserDto;

    return this.messagesService.findAll({
      where: [
        {
          user: user.id,
          toUser: selectedUser,
        },
        {
          user: selectedUser,
          toUser: user.id,
        },
      ],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  @Post()
  @UseGuards(AuthGuard())
  public async create(
    @Req() req: any,
    @Body() createMessageDto: CreateMessageDto,
  ): Promise<MessageEntity> {
    const user = req.user as UserDto;

    const message = await this.messagesService.create(user, createMessageDto);

    this.messagesService.push(message);

    return message;
  }
}
