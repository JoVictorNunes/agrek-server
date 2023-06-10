import { OmitType, PartialType } from '@nestjs/mapped-types';
import {
  CreateCustomerDTO,
  CreateAreaDTO,
  CreateSprayingDTO,
} from './create.dto';

export class UpdateCustomerDTO extends PartialType(CreateCustomerDTO) {}

export class UpdateAreaDTO extends PartialType(CreateAreaDTO) {}

export class UpdateSprayingDTO extends PartialType(
  OmitType(CreateSprayingDTO, ['droneId']),
) {}
