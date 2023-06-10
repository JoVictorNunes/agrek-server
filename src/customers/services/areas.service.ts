import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma.service';
import { CreateAreaDTO } from 'customers/dto/create.dto';
import { UpdateAreaDTO } from 'customers/dto/update.dto';

@Injectable()
export class AreasService {
  constructor(private prisma: PrismaService) {}

  async findByCustomer(customerId: string) {
    return this.prisma.area.findMany({
      where: {
        customerId,
      },
      include: {
        path: true,
        sprayings: true,
      },
    });
  }

  async findById(areaId: string) {
    return this.prisma.area.findUnique({
      where: {
        id: areaId,
      },
      include: {
        path: true,
        sprayings: true,
      },
    });
  }

  async create(customerId: string, dto: CreateAreaDTO) {
    const { path: pathDTO, ...AreaDTO } = dto;
    return this.prisma.area.create({
      data: {
        ...AreaDTO,
        area: Number(AreaDTO.area),
        customer: {
          connect: {
            id: customerId,
          },
        },
        path: {
          create: pathDTO,
        },
      },
    });
  }

  async update(areaId: string, dto: UpdateAreaDTO) {
    if (dto.path) {
      await this.prisma.point.deleteMany({
        where: {
          areaId,
        },
      });
    }

    return this.prisma.area.update({
      where: {
        id: areaId,
      },
      data: {
        area: dto.area,
        color: dto.color,
        name: dto.name,
        path: {
          create: dto.path,
        },
      },
    });
  }

  async delete(areaId: string) {
    return this.prisma.area.delete({
      where: {
        id: areaId,
      },
    });
  }
}
