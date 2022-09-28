import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  private ebayFilterListener = new Subject<boolean>();
  private shpockFilterListener = new Subject<boolean>();

  getEbayFilterListener(): Observable<boolean> {
      return this.ebayFilterListener.asObservable();
  }

  getShpockFilterListener(): Observable<boolean> {
    return this.shpockFilterListener.asObservable();
  }

  changeEbayFilter(value: boolean) {
    this.ebayFilterListener.next(value);
  }
  
  changeShpockFilter(value: boolean) {
    this.shpockFilterListener.next(value);
  }
}
