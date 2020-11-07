import { Logger } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsResponse,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import * as jwt from 'jsonwebtoken';

import { MessagesService } from './messages.service';
import { UsersService } from 'src/users/users.service';
import { UserDto } from 'src/users/dto/user.dto';

@WebSocketGateway(3001)
export class MessagesGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private WsServer: Server;
  private clientSocketsMap = new Map<
    string,
    { username: string; socket: Socket }
  >();

  constructor(
    private readonly messagesService: MessagesService,
    private readonly userService: UsersService,
  ) {
    this.messagesService.attachSender(message => {
      if (this.WsServer) {
        this.clientSocketsMap.forEach(({ username, socket }) => {
          if (
            username === message.user.username ||
            username === message.toUser.username
          ) {
            socket.emit('message', message);
          }
        });
      }
    });
  }

  private logger: Logger = new Logger('MessagesGateway');

  afterInit(server: Server) {
    this.WsServer = server;
    this.logger.warn(
      `WS initialized. Has ${server.listenerCount(
        'messageToServer',
      )} connections`,
    );
  }

  handleConnection(socket: Socket, ...args: any[]) {
    this.logger.warn(
      `Connected client: ${socket.client.id}`,
      'MessagesGateway',
    );
  }

  handleDisconnect(socket: Socket) {
    this.clientSocketsMap.delete(socket.client.id);
    this.logger.warn(
      `Disconnected client: ${socket.client.id}`,
      'MessagesGateway',
    );
  }

  @SubscribeMessage('authenticate')
  async handleMessage(
    socket: Socket,
    payloud: { accessToken: string },
  ): Promise<WsResponse<{ success: boolean; message?: string }>> {
    if (payloud && payloud?.accessToken) {
      try {
        const { username, exp } = jwt.verify(
          payloud?.accessToken,
          process.env.SECRETKEY,
        ) as { username: string; exp: number };
        if (exp * 1000 < Date.now()) {
          throw new Error('Token expired');
        }

        const userDto: UserDto = await this.userService.findByPayload({
          username,
        });
        if (!userDto) throw new Error('User not found');

        this.clientSocketsMap.set(socket.client.id, { username, socket });
      } catch (err) {
        return {
          event: 'authenticated',
          data: {
            success: false,
            message: err.message,
          },
        };
      }
    }

    // client.emit('messageToClient', text);
    return {
      event: 'authenticated',
      data: {
        success: true,
      },
    };
  }
}
