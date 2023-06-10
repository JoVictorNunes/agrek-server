import {
  Module,
  ValidationPipe,
  CacheModule,
  CacheInterceptor,
} from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE, APP_FILTER } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AppController } from 'app.controller';
import { AppService } from 'app.service';
import { CustomersModule } from 'customers/customers.module';
import { UsersModule } from 'users/users.module';
import { AuthGuard } from 'guards/auth.guard';
import { PrismaExceptionsFilter } from 'filters/prisma.filter';
import { AssetsModule } from 'assets/assets.module';

@Module({
  imports: [
    CustomersModule,
    UsersModule,
    AssetsModule,
    ConfigModule.forRoot(),
    CacheModule.register({
      ttl: 2000,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_PIPE, useClass: ValidationPipe },
    { provide: APP_INTERCEPTOR, useClass: CacheInterceptor },
    { provide: APP_FILTER, useClass: PrismaExceptionsFilter },
  ],
})
export class AppModule {}
