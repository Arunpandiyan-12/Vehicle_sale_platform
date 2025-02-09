import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatEstimate',
  standalone: true
})
export class FormatEstimatePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    
    // Replace newlines with <br> tags
    return value.replace(/\n/g, '<br>');
  }
} 