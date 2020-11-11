import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/users.service';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageEntity } from './entity/message.entity';

@Injectable()
export class MessagesService {
  public push: (message: MessageEntity) => void;

  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    private readonly usersService: UsersService,
  ) {}

  public attachSender(sender: (message: MessageEntity) => void) {
    this.push = sender;
  }

  findAll(options?: FindManyOptions<MessageEntity>) {
    return this.messageRepository.find({
      relations: ['user', 'toUser'],
      ...options,
    });
  }

  async create(
    user: UserDto,
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
        user,
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
