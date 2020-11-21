import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserEntity } from './users/entity/user.entity';
import { AuthModule } from './auth/auth.module';
import { MessagesModule } from './messages/messages.module';
import { MessageEntity } from './messages/entity/message.entity';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './tmp/db',
      entities: [UserEntity, MessageEntity],
      synchronize: true,
    }),
    AuthModule,
    MessagesModule,
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
