import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'percentageFormat',
  standalone: true,
})
export class PercentageFormatPipe implements PipeTransform {
  transform(percentageString: string, ...args: unknown[]): unknown {
    const num = parseFloat(percentageString.slice(0, -1));
    return num.toFixed(0) + '%';
  }
}
