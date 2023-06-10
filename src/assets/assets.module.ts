import { Module } from '@nestjs/common';
import { DronesController } from 'assets/controllers/drones.controller';
import { DronesService } from 'assets/services/drones.service';
import { PrismaService } from 'prisma.service';

@Module({
  controllers: [DronesController],
  providers: [DronesService, PrismaService],
})
export class AssetsModule {}
