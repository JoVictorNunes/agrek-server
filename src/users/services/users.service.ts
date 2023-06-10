import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma.service';
import { createHash } from 'node:crypto';
import { SignUpDTO } from 'users/dto/signUp.dto';
import { UpdateDTO } from 'users/dto/update.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(signUpDTO: SignUpDTO) {
    const { email, password, avatarId, name } = signUpDTO;

    const hash = createHash('sha256');
    hash.update(password);
    const hashedPassword = hash.digest('hex');

    const user = await this.prisma.user.create({
      data: {
        email,
        avatarId,
        name,
        password: hashedPassword,
      },
    });

    return user;
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async delete(userId: string) {
    const user = await this.prisma.user.delete({
      where: {
        id: userId,
      },
    });
    return user;
  }

  async update(userId: string, updateDTO: UpdateDTO) {
    const user = this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        avatarId: updateDTO.avatarId,
        name: updateDTO.name,
      },
    });
    return user;
  }

  async findByEmailAndPassword(email: string, password: string) {
    const hash = createHash('sha256');
    hash.update(password);
    const hashedPassword = hash.digest('hex');
    const user = await this.prisma.user.findFirst({
      where: {
        email,
        password: hashedPassword,
      },
    });
    return user;
  }

  async findById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    return user;
  }
}
