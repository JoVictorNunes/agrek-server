import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const unprotected = this.reflector.get<boolean>(
      'unprotected',
      context.getHandler(),
    );

    if (unprotected) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authorization: string = request.headers.authorization;

    if (!authorization) {
      throw new BadRequestException('You must provide an authorization header');
    }

    const [type, token] = authorization.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new BadRequestException('Invalid authorization header');
    }

    const SECRET: string | undefined = this.config.get('SECRET');

    try {
      const payload = await this.jwt.verifyAsync(token, { secret: SECRET });
      request['user'] = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
