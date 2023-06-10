import { OmitType, PartialType } from '@nestjs/mapped-types';
import { SignUpDTO } from './signUp.dto';

export class UpdateDTO extends PartialType(
  OmitType(SignUpDTO, ['password', 'email']),
) {}
