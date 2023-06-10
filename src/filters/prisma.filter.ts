import {
  Catch,
  ArgumentsHost,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';

@Catch(
  Prisma.PrismaClientKnownRequestError,
  Prisma.PrismaClientUnknownRequestError,
  Prisma.PrismaClientRustPanicError,
  Prisma.PrismaClientInitializationError,
  Prisma.PrismaClientValidationError,
)
export class PrismaExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === 'P2002') {
        return super.catch(new ConflictException('Duplicated resource.'), host);
      }

      if (exception.code === 'P2025') {
        return super.catch(new NotFoundException('Resource not found.'), host);
      }
    }

    return super.catch(new InternalServerErrorException(), host);
  }
}
