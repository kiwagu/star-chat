import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const secretKey = request.body['secretKey'];

    if (!secretKey) {
      throw new HttpException(
        'Secret key missing or invalid',
        HttpStatus.UNAUTHORIZED,
      );
    }
    delete request.body['secretKey'];

    try {
      // Store the user on the request object if we want to retrieve it from the controllers
      return true;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.UNAUTHORIZED);
    }
  }
}
