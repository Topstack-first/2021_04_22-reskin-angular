import {Pipe, PipeTransform} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {CookieService} from 'ngx-cookie-service';

@Pipe({
  name: 'secure'
})
export class SecurePipe implements PipeTransform {

  constructor(private http: HttpClient, private sanitizer: DomSanitizer, private cookieService: CookieService) {
  }

  transform(url): Observable<SafeUrl> {
    const access = this.cookieService.get('access');
    return this.http.get(url, {responseType: 'blob', headers: {'agora-sec-token': access}}).pipe(
      map(val => this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(val))));
  }

  // transform(url: string): Observable<any> {
  //
  //   return new Observable<string>((observer) => {
  //     // This is a tiny blank image
  //     observer.next('data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');
  //
  //     // The next and error callbacks from the observer
  //     const {next, error} = observer;
  //
  //     this.http.get(url, {responseType: 'blob'}).subscribe(response => {
  //       const reader = new FileReader();
  //       reader.readAsDataURL(response);
  //       reader.onloadend = () => {
  //         observer.next(reader.result.toString());
  //       };
  //     });
  //
  //     return {
  //       unsubscribe() {
  //       }
  //     };
  //   });
  // }

}
