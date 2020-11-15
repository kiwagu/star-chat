import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { RegistrationStatus } from './interfaces/regisration-status.interface';
import { LoginStatus } from './interfaces/login-status.interface';
import { LoginUserDto } from '../users/dto/user-login.dto';
import { JwtPayload } from './interfaces/payload.interface';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserDto } from '../users/dto/user.dto';
import { VkLoginUserDto } from '../users/dto/user-vk-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(userDto: CreateUserDto): Promise<RegistrationStatus> {
    let status: RegistrationStatus = {
      success: true,
      message: 'user registered',
    };

    try {
      await this.usersService.create(userDto);
    } catch (err) {
      status = {
        success: false,
        message: err.message,
      };
    }

    return status;
  }

  async login(loginUserDto: LoginUserDto): Promise<LoginStatus> {
    // find user in db
    const user = await this.usersService.findByLogin(loginUserDto);
    // generate and sign token
    const token = this._createToken(user);

    return {
      username: user.username,
      ...token,
    };
  }

  async vklogin(vkLoginUserDto: VkLoginUserDto): Promise<LoginStatus> {
    // find user in db
    const user = await this.usersService.findOrCreateLoginByVk(vkLoginUserDto);
    // generate and sign token
    const token = this._createToken(user);

    return {
      username: user.username,
      ...token,
    };
  }

  async validateUser(payload: JwtPayload): Promise<UserDto> {
    const user = await this.usersService.findByPayload(payload);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  private _createToken({ username }: UserDto): any {
    const expiresIn = process.env.EXPIRESIN;

    const user: JwtPayload = { username };
    const accessToken = this.jwtService.sign(user);
    return {
      expiresIn,
      accessToken,
    };
  }
}
