import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { map } from 'rxjs/operators';

@Injectable()
export class PasswordInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data) => {
        if (!data) return;
        const key = Object.keys(data)[0];
        const value = Object.values(data)[0];

        if (key === 'user') {
          const user = value as User;
          const { avatarId, email, id, name } = user;
          return {
            user: {
              avatarId,
              email,
              id,
              name,
            },
          };
        }

        if (key === 'users') {
          const users = value as User[];
          const usersMapped = users.map(({ avatarId, email, id, name }) => ({
            avatarId,
            email,
            id,
            name,
          }));
          return { users: usersMapped };
        }

        return data;
      }),
    );
  }
}
