import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/user-login.dto';
import { UserDto } from './dto/user.dto';
import { UserEntity } from './entity/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findOne(options?: FindOneOptions<UserEntity>): Promise<UserDto> {
    const user = await this.userRepository.findOne(options);

    if (!user) return null;

    const { hashPassword, password, ...userDTO } = user;

    return userDTO;
  }

  async findAll(options?: FindManyOptions<UserEntity>): Promise<UserDto[]> {
    return await this.userRepository.find({
      select: ['id', 'username', 'email'],
      ...options,
    });
  }
  async findByLogin({ username, password }: LoginUserDto): Promise<UserDto> {
    const user = await this.userRepository.findOne({
      select: ['id', 'email', 'password', 'username'],
      where: { username },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }
    const areEqual = await bcrypt.compare(password, user.password);

    if (!areEqual) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const { password: pass, ...userDto } = user;

    return userDto;
  }

  async findByPayload({ username }: any): Promise<UserDto> {
    return await this.findOne({
      where: { username },
    });
  }

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const { username, password, email } = createUserDto;
    // check if the user exists in the db
    const userInDb = await this.userRepository.findOne({
      where: { username },
    });

    if (userInDb) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const user: UserEntity = this.userRepository.create({
      username,
      password,
      email,
    });

    await this.userRepository.save(user);

    const { password: pass, hashPassword, ...userDto } = user;

    return userDto;
  }
}
