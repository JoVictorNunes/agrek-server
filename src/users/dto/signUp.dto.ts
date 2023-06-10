import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsAlphanumeric,
  Length,
  IsString,
  IsOptional,
} from 'class-validator';

export class SignUpDTO {
  @IsString()
  @IsOptional()
  @ApiProperty()
  avatarId?: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @Length(2, 50)
  @IsOptional()
  @ApiProperty()
  name?: string;

  @IsAlphanumeric()
  @Length(8, 32)
  @ApiProperty()
  password: string;
}
