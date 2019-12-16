import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string, url: string): any {
    console.log(value);
    return this.sanitizer.bypassSecurityTrustResourceUrl(url + value);
  }

}
