import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  private requestsCount = 0;

  show() {
    this.requestsCount++;

    if (this.requestsCount === 1) {
      setTimeout(() => {
        if (this.requestsCount > 0) {
          this.loadingSubject.next(true);
        }
      }, 0);
    }
  }

  hide() {
    if (this.requestsCount > 0) {
      this.requestsCount--;
    }

    if (this.requestsCount === 0) {
      setTimeout(() => {
        if (this.requestsCount === 0) {
          this.loadingSubject.next(false);
        }
      }, 0);
    }
  }
}