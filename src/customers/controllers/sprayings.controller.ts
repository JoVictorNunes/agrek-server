import {
  Body,
  Controller,
  Delete,
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
import { CreateSprayingDTO } from 'customers/dto/create.dto';
import { UpdateSprayingDTO } from 'customers/dto/update.dto';
import { SprayingsService } from 'customers/services/sprayings.service';

@Controller('sprayings')
@ApiTags('sprayings')
@ApiBearerAuth()
export class SprayingsController {
  constructor(private sprayingsService: SprayingsService) {}

  @Post(':areaId')
  @ApiOperation({ summary: 'Create a new spraying for an area.' })
  @ApiCreatedResponse({ description: 'Spraying created.' })
  @ApiNotFoundResponse({ description: 'Area does not exist.' })
  async createSpraying(
    @Body() dto: CreateSprayingDTO,
    @Param('areaId', ParseUUIDPipe) areaId: string,
  ) {
    const spraying = await this.sprayingsService.create(areaId, dto);
    return { spraying };
  }

  @Delete(':sprayingId')
  @ApiOperation({ summary: 'Delete a spraying.' })
  @ApiOkResponse({ description: 'Spraying deleted.' })
  @ApiNotFoundResponse({
    description: 'Either area or spraying does not exist.',
  })
  async deleteSpraying(
    @Param('areaId', ParseUUIDPipe) areaId: string,
    @Param('sprayingId', ParseUUIDPipe) sprayingId: string,
  ) {
    const spraying = await this.sprayingsService.delete(sprayingId);
    return { spraying };
  }

  @Put(':sprayingId')
  @ApiOperation({ summary: 'Update a spraying.' })
  @ApiOkResponse({ description: 'Spraying updated.' })
  @ApiNotFoundResponse({ description: 'Spraying does not exist.' })
  async updateSpraying(
    @Param('sprayingId', ParseUUIDPipe) sprayingId: string,
    @Body() dto: UpdateSprayingDTO,
  ) {
    const spraying = this.sprayingsService.update(sprayingId, dto);
    return { spraying };
  }
}
