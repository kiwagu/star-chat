import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthPostGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const paymentSessionKey = request.body['paymentSessionKey'];

    if (!paymentSessionKey) {
      throw new HttpException(
        'Secret key missing or invalid',
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      // Store the user on the request object if we want to retrieve it from the controllers
      return true;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.UNAUTHORIZED);
    }
  }
}

@Injectable()
export class AuthHeaderGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const authHeaderValue: string =
      request.headers['Authorization'] || request.headers['authorization'];

    if (!authHeaderValue) {
      throw new HttpException(
        'Authorization header missing',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const [bearer, bankSecretKey] = authHeaderValue.split(' ');
    if (bearer !== 'Bearer' && bankSecretKey) {
      throw new HttpException(
        'Authorization Bearer or token missing',
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      // Store the user on the request object if we want to retrieve it from the controllers
      return true;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.UNAUTHORIZED);
    }
  }
}
