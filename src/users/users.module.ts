import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersController } from 'users/controllers/users.controller';
import { UsersService } from 'users/services/users.service';
import { PrismaService } from 'prisma.service';

@Module({
  imports: [ConfigModule, JwtModule.register({ global: true })],
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
})
export class UsersModule {}
