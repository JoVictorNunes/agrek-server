import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { CreateAreaDTO } from 'customers/dto/create.dto';
import { UpdateAreaDTO } from 'customers/dto/update.dto';
import { AreasService } from 'customers/services/areas.service';
import { CustomersService } from 'customers/services/customers.service';

@Controller('areas')
@ApiTags('areas')
@ApiBearerAuth()
export class AreasController {
  constructor(
    private areasService: AreasService,
    private customersService: CustomersService,
  ) {}

  @Get(':areaId')
  @ApiOperation({ summary: 'Get an area by its ID.' })
  @ApiOkResponse({ description: 'Area found.' })
  @ApiNotFoundResponse({ description: 'Area does not exist.' })
  async readById(@Param('areaId', ParseUUIDPipe) areaId: string) {
    const area = await this.areasService.findById(areaId);
    if (area) {
      return { area };
    }
    throw new NotFoundException('Area does not exist.');
  }

  @Get('customer/:customerId')
  @ApiOperation({ summary: 'Get all areas of a customer.' })
  @ApiOkResponse({ description: 'Areas found.' })
  @ApiNotFoundResponse({ description: 'Customer does not exist.' })
  async readByCustomer(@Param('customerId', ParseUUIDPipe) customerId: string) {
    const customer = await this.customersService.findById(
      customerId,
      false,
      false,
    );
    if (customer) {
      const areas = await this.areasService.findByCustomer(customerId);
      return { areas };
    }
    throw new NotFoundException('Customer does not exist.');
  }

  @Post(':customerId')
  @ApiOperation({ summary: 'Create a new area for a customer.' })
  @ApiCreatedResponse({ description: 'Area created.' })
  @ApiNotFoundResponse({ description: 'Customer does not exist' })
  async createArea(
    @Body() dto: CreateAreaDTO,
    @Param('customerId', ParseUUIDPipe) customerId: string,
  ) {
    const customer = await this.customersService.findById(
      customerId,
      false,
      false,
    );

    if (!customer) {
      throw new NotFoundException('Customer does not exist.');
    }

    const area = await this.areasService.create(customerId, dto);

    return { area };
  }

  @Put(':areaId')
  @ApiOperation({ summary: 'Update an area.' })
  @ApiOkResponse({ description: 'Area updated.' })
  @ApiNotFoundResponse({ description: 'Area does not exist.' })
  async updateArea(
    @Param('areaId', ParseUUIDPipe) areaId: string,
    @Body() dto: UpdateAreaDTO,
  ) {
    const area = await this.areasService.update(areaId, dto);
    return { area };
  }

  @Delete(':areaId')
  @ApiOperation({ summary: 'Delete an area.' })
  @ApiOkResponse({ description: 'Area deleted.' })
  @ApiNotFoundResponse({ description: 'Area does not exist.' })
  async deleteArea(@Param('areaId', ParseUUIDPipe) areaId: string) {
    const area = await this.areasService.delete(areaId);
    return { area };
  }
}
