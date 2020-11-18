import {
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';

import { MessagesService } from './messages.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway(3001)
export class MessagesGateway implements OnGatewayDisconnect {
  private clientSocketsMap = new Map<
    string,
    { username: string; socket: Socket }
  >();

  constructor(private readonly messagesService: MessagesService) {
    this.messagesService.attachSender(message => {
      this.clientSocketsMap.forEach(({ username, socket }) => {
        if (
          username === message.user.username ||
          username === message.toUser.username
        ) {
          socket.emit('message', message);
        }
      });
    });
  }

  private logger: Logger = new Logger('MessagesGateway');

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
    try {
      const { username, exp } = jwt.verify(
        payloud?.accessToken,
        process.env.SECRETKEY,
      ) as { username: string; exp: number };

      if (exp * 1000 < Date.now()) {
        throw new Error('Token expired');
      }

      this.clientSocketsMap.set(socket.client.id, { username, socket });

      this.logger.warn(
        `Connected and stored client: ${socket.client.id}`,
        'MessagesGateway',
      );
    } catch (error) {
      return {
        event: 'authenticated',
        data: {
          success: false,
          message: error.message,
        },
      };
    }

    return {
      event: 'authenticated',
      data: {
        success: true,
      },
    };
  }
}
