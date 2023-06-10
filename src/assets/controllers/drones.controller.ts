import { Body, Controller, Get, Post } from '@nestjs/common';
import { DronesService } from 'assets/services/drones.service';
import { CreateDroneDTO } from 'assets/dto/create.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

@Controller('drones')
export class DronesController {
  constructor(private readonly service: DronesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new drone.' })
  @ApiCreatedResponse({ description: 'Drone created.' })
  async create(@Body() dto: CreateDroneDTO) {
    const drone = await this.service.create(dto);
    return { drone };
  }

  @Get()
  @ApiOperation({ summary: 'Get all drones.' })
  @ApiOkResponse({ description: 'Returns all drones.' })
  async readAll() {
    const drones = await this.service.readAll();
    return { drones };
  }
}
