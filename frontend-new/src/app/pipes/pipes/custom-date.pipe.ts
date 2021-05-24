import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'customDate'
})
export class CustomDatePipe implements PipeTransform {

  transform(value: string): string | null {
    const date = new Date(value + ' UTC');
    return date.toString();
  }

}
