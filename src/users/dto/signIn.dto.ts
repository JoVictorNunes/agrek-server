import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsAlphanumeric, Length } from 'class-validator';

export class SignInDTO {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsAlphanumeric()
  @Length(8, 32)
  @ApiProperty()
  password: string;
}
