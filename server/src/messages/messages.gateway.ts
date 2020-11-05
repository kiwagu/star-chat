import { Logger, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsResponse,
} from '@nestjs/websockets';

import { Socket, Server } from 'socket.io';

@WebSocketGateway(3001)
export class MessagesGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger('MessagesGateway');

  afterInit(server: Server) {
    this.logger.warn(
      `WS initialized. Has ${server.listenerCount(
        'messageToServer',
      )} connections`,
    );
  }
  handleConnection(client: Socket, ...args: any[]) {
    this.logger.warn(
      `Connected client: ${client.client.id}`,
      'MessagesGateway',
    );
  }
  handleDisconnect(client: Socket) {
    this.logger.warn(
      `Disconnected client: ${client.client.id}`,
      'MessagesGateway',
    );
  }

  // @UseGuards(AuthGuard())
  @SubscribeMessage('messageToServer')
  handleMessage(client: Socket, text: string): WsResponse<string> {
    this.logger.warn(text);

    // client.emit('messageToClient', text);
    return { event: 'messageToClient', data: `ECHO: ${text}` };
  }
}
