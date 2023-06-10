import { Module } from '@nestjs/common';
import { CustomersController } from 'customers/controllers/customers.controller';
import { AreasController } from 'customers/controllers/areas.controller';
import { CustomersService } from 'customers/services/customers.service';
import { AreasService } from 'customers/services/areas.service';
import { SprayingsController } from 'customers/controllers/sprayings.controller';
import { SprayingsService } from 'customers/services/sprayings.service';
import { PrismaService } from 'prisma.service';

@Module({
  controllers: [CustomersController, AreasController, SprayingsController],
  providers: [CustomersService, AreasService, SprayingsService, PrismaService],
  exports: [CustomersService],
})
export class CustomersModule {}
