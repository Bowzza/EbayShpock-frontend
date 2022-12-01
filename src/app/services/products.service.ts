import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Product } from '../model/product';
import { environment } from '../../environments/environment';


const PRODUCT_API = 'http://localhost:3000/api/users';
// const PRODUCT_API = 'https://ebayshpock-backend.onrender.com/api/users';
 

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private addProductFrontendListener = new Subject<number>();

    getAddProductFrontendListener(): Observable<number> {
        return this.addProductFrontendListener.asObservable();
    }

    addProductFrontend(value: number) {
        this.addProductFrontendListener.next(value);
    }

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${PRODUCT_API}/product`);
  }

  addProduct(product: Product) {
    return this.http.post(`${PRODUCT_API}/addProduct`, {product});
  }

  removeProduct(id: string) {
    return this.http.delete(`${PRODUCT_API}/${id}`);
  }

}
