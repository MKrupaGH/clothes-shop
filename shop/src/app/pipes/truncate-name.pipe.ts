import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateName',
  standalone: true,
})
export class TruncateNamePipe implements PipeTransform {
  transform(
    value: string,
    maxLength: number = 16,
    ellipsis: string = '...'
  ): string {
    if (value.length > maxLength) {
      console.log(value);

      return value.slice(0, maxLength) + ellipsis;
    }
    return value;
  }
}
