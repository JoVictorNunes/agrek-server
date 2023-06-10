import { IsNumber, Length } from 'class-validator';

export class CreateDroneDTO {
  @Length(2, 20)
  name: string;

  @Length(2, 20)
  model: string;

  @Length(2, 20)
  manufacturer: string;

  @Length(4)
  year: string;

  @IsNumber()
  price: number;

  @IsNumber()
  date: number;
}
