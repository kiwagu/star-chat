import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageEntity } from './entity/message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    private readonly usersService: UsersService,
  ) {}

  findAll(userId?: string) {
    return this.messageRepository.find({
      where: {
        user: userId,
      },
      relations: ['user', 'toUser'],
    });
  }

  async create(
    userId: string,
    createMessageDto: CreateMessageDto,
  ): Promise<MessageEntity> {
    const toUser = await this.usersService.findOne({
      where: { id: createMessageDto.toUserId },
    });

    if (!toUser) {
      throw new HttpException(
        `User ${createMessageDto.toUserId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      const message: MessageEntity = this.messageRepository.create({
        user: {
          id: userId,
        },
        toUser,
        body: createMessageDto.body,
      });
      return await this.messageRepository.save(message);
    } catch (error) {
      switch (error.code) {
        case 'SQLITE_CONSTRAINT':
          throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        default:
          throw new HttpException(error.message, HttpStatus.NOT_IMPLEMENTED);
      }
    }
  }
}
