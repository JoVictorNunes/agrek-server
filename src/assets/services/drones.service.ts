import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma.service';
import { CreateDroneDTO } from 'assets/dto/create.dto';

@Injectable()
export class DronesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateDroneDTO) {
    const { date, manufacturer, model, name, price, year } = dto;
    const dateObj = new Date(date);
    const drone = await this.prisma.drone.create({
      data: {
        date: dateObj,
        manufacturer,
        model,
        name,
        price,
        year,
      },
    });

    return drone;
  }

  async readAll() {
    const drones = await this.prisma.drone.findMany();
    return drones;
  }
}
