import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Query,
  NotFoundException,
  ParseUUIDPipe,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiQuery,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { CreateCustomerDTO } from 'customers/dto/create.dto';
import { UpdateCustomerDTO } from 'customers/dto/update.dto';
import { CustomersService } from 'customers/services/customers.service';
import { ParseArgsListQuery } from 'pipes/ParseArgsListQuery.pipe';

@Controller('customers')
@ApiTags('customers')
@ApiBearerAuth()
export class CustomersController {
  constructor(private service: CustomersService) {}

  @Get()
  @ApiQuery({
    name: 'include',
    enum: ['address', 'areas', 'sprayings'],
    isArray: true,
    required: false,
  })
  @ApiOperation({ summary: 'Get all customers.' })
  @ApiOkResponse({ description: 'Returns all customers.' })
  async readAll(@Query('include', ParseArgsListQuery) include?: string[]) {
    const withAddress = !!include && include.includes('address');
    const withAreas = !!include && include.includes('areas');
    const withSprayings = !!include && include.includes('sprayings');
    const customers = await this.service.findAll(
      withAddress,
      withAreas,
      withSprayings,
    );
    return { customers };
  }

  @Get(':customerId')
  @ApiOperation({ summary: 'Get a specific customer.' })
  @ApiOkResponse({ description: 'Customer found.' })
  @ApiNotFoundResponse({ description: 'Customer does not exist.' })
  @ApiQuery({
    name: 'include',
    enum: ['address', 'areas', 'sprayings'],
    isArray: true,
    required: false,
  })
  async read(
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @Query('include', ParseArgsListQuery) include?: string[],
  ) {
    const withAddress = !!include && include.includes('address');
    const withAreas = !!include && include.includes('areas');
    const withSprayings = !!include && include.includes('sprayings');
    const customer = await this.service.findById(
      customerId,
      withAddress,
      withAreas,
      withSprayings,
    );
    if (customer) {
      return { customer };
    }
    throw new NotFoundException('Customer does not exist.');
  }

  @Post()
  @ApiOperation({ summary: 'Create a customer.' })
  @ApiCreatedResponse({ description: 'Customer created.' })
  @ApiConflictResponse({ description: 'CPF already registered.' })
  async create(@Body() dto: CreateCustomerDTO) {
    const customer = await this.service.create(dto);
    return { customer };
  }

  @Put(':customerId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a specific customer.' })
  @ApiNotFoundResponse({ description: 'Customer does not exist.' })
  @ApiOkResponse({ description: 'Customer updated successfully.' })
  async update(
    @Body() dto: UpdateCustomerDTO,
    @Param('customerId', ParseUUIDPipe) customerId: string,
  ) {
    const customer = await this.service.update(customerId, dto);
    return { customer };
  }

  @Delete(':customerId')
  @ApiOperation({ summary: 'Delete a specific customer.' })
  @ApiOkResponse({ description: 'Customer deleted.' })
  @ApiNotFoundResponse({ description: 'Customer does not exist.' })
  async deleteCustomer(@Param('customerId', ParseUUIDPipe) customerId: string) {
    const customer = await this.service.delete(customerId);
    return { customer };
  }
}
