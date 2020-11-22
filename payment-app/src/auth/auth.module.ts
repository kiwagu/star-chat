import { Module } from '@nestjs/common';
import { AuthPostGuard, AuthHeaderGuard } from './auth.guard';

@Module({
  providers: [AuthPostGuard, AuthHeaderGuard],
})
export class AuthModule {}
