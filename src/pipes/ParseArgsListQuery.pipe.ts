import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class ParseArgsListQuery implements PipeTransform {
  transform(value: string | string[] | undefined) {
    if (typeof value === 'string') {
      return value.split(',');
    }
    return value;
  }
}
