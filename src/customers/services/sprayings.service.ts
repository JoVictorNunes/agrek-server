import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma.service';
import { CreateSprayingDTO } from 'customers/dto/create.dto';
import { UpdateSprayingDTO } from 'customers/dto/update.dto';

@Injectable()
export class SprayingsService {
  constructor(private prisma: PrismaService) {}

  async create(areaId: string, dto: CreateSprayingDTO) {
    const { date, droneId, percentage } = dto;
    const sprayingDate = new Date(date);
    return this.prisma.spraying.create({
      data: {
        date: sprayingDate,
        percentage,
        drone: {
          connect: {
            id: droneId,
          },
        },
        area: {
          connect: {
            id: areaId,
          },
        },
      },
    });
  }

  async update(sprayingId: string, dto: UpdateSprayingDTO) {
    let date: Date | undefined;

    if (dto.date) {
      date = new Date(dto.date);
    }

    const spraying = this.prisma.spraying.update({
      where: {
        id: sprayingId,
      },
      data: {
        date,
        percentage: dto.percentage,
      },
    });

    return { spraying };
  }

  async delete(sprayingId: string) {
    return this.prisma.spraying.delete({
      where: {
        id: sprayingId,
      },
    });
  }
}
