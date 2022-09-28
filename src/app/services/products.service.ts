import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../model/product';
import { environment } from '../../environments/environment';


// const PRODUCT_API = 'http://localhost:3000/api/users';
const PRODUCT_API = 'https://ebayshpockscraper-backend.herokuapp.com/api/users';


@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.api}api/users/product`);
  }

  addProduct(product: Product) {
    return this.http.post(`${environment.api}api/users/addProduct`, {product});
  }

  removeProduct(id: string) {
    return this.http.delete(`${environment.api}api/users/${id}`);
  }
}
