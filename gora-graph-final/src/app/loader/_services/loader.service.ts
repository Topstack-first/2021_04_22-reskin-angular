import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {LoaderState} from '../_models/loader.model';


@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private loaderSubject = new Subject<LoaderState>();

  loaderState = this.loaderSubject.asObservable();

  constructor() {
  }

  show(): any {
    this.loaderSubject.next({show: true} as LoaderState);
  }

  hide(): any {
    this.loaderSubject.next({show: false} as LoaderState);
  }

}

