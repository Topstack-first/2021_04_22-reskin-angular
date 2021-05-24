import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private data = new BehaviorSubject(false);
  data$ = this.data.asObservable();

  changeData(data: boolean): any {
    this.data.next(data);
  }
}
