import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../model/product';
import { environment } from 'src/environments/environment';


// const API = 'http://localhost:3000/api/notify';
const API = 'https://ebayshpockscraper-backend.herokuapp.com/api/notify';


@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  constructor(private http: HttpClient) { }

  addProductToNotifyList(product: Product) {
    return this.http.post(`${API}/addToNotifyProduct`, {product});
  }

  removeProductFromNotifyList(id: string) {
    return this.http.delete(`${API}/deleteFromNotifyProduct/${id}`);
  }

  addingSub(sub: any) {
    return this.http.post(`${API}/addSub`, {sub});
  }

  getNotifyProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${API}/notifyProducts`);
  }

  getNotifyStatus(): Observable<boolean> {
    return this.http.get<boolean>(`${API}/`);
  }

  postNotifyStatus(): Observable<boolean> {
    return this.http.post<boolean>(`${API}/enableNotify`, {});
  }

  testNotification(): Observable<any> {
    return this.http.get(`${environment.api}api/notify/testNotify`);
  }
}
