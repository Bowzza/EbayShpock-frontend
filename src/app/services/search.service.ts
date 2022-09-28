import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../model/product';
import { environment } from '../../environments/environment';


// const SEARCH_API = 'http://localhost:3000/api/search';
const SEARCH_API = 'https://ebayshpockscraper-backend.herokuapp.com/api/search';


@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient) { }

  search(searchTerm: string | null): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.api}api/search/${searchTerm}`);
  }

  loadMoreProducts(searchTerm: string | null, ebay: number, shpock: number): Observable<Product[]> {
    return this.http.post<Product[]>(`${environment.api}api/search/${searchTerm}`, {ebay, shpock});
  }
}
