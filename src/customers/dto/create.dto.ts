import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import states from 'utils/states';
import {
  Length,
  IsNumberString,
  IsIn,
  Matches,
  IsOptional,
  ValidateNested,
  IsPostalCode,
  IsPhoneNumber,
  IsNumber,
  IsHexColor,
  IsArray,
  IsLatitude,
  IsLongitude,
  IsUUID,
  Min,
  Max,
} from 'class-validator';

class PointDTO {
  @IsNumber()
  @IsLatitude()
  @ApiProperty()
  lat: number;

  @IsNumber()
  @IsLongitude()
  @ApiProperty()
  lng: number;
}

class AddressDTO {
  @Length(2, 40)
  @ApiProperty()
  address: string;

  @Length(2, 40)
  @ApiProperty()
  neighborhood: string;

  @IsNumberString()
  @ApiProperty()
  number: string;

  @Length(2, 20)
  @ApiProperty()
  city: string;

  @IsIn(states)
  @ApiProperty()
  state: string;

  @IsPostalCode('BR')
  @ApiProperty()
  cep: string;
}

export class CreateCustomerDTO {
  @Length(2, 40)
  @ApiProperty()
  name: string;

  @Matches(/^[0-9]{3}.[0-9]{3}.[0-9]{3}-[0-9]{2}$/)
  @ApiProperty()
  cpf: string;

  @IsPhoneNumber('BR')
  @ApiProperty()
  phone: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDTO)
  @ApiPropertyOptional()
  address?: AddressDTO;
}

export class CreateAreaDTO {
  @Length(2, 40)
  @ApiProperty()
  name: string;

  @IsNumber()
  @ApiProperty()
  area: number;

  @IsHexColor()
  @ApiProperty()
  color: string;

  @IsArray()
  @ValidateNested()
  @Type(() => Array<PointDTO>)
  @ApiProperty()
  path: Array<PointDTO>;
}

export class CreateSprayingDTO {
  @IsNumber()
  @ApiProperty()
  date: number;

  @IsUUID(4)
  @ApiProperty()
  droneId: string;

  @IsNumber()
  @Min(0)
  @Max(1)
  @IsOptional()
  @ApiProperty()
  percentage?: number;
}
