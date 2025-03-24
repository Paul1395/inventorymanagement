import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Product from '../models/Product';
import { Observable } from 'rxjs';
import {CONFIG} from '../config/config'

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  readonly API_URL = CONFIG.apiUrlProduct;
  product: Product[];

  constructor(private http: HttpClient) 
  {
    this.product = [];
  }

  getProduct():Observable<Product[]> {
    return this.http.get<Product []>(this.API_URL);
  }

  createProduct(data: Product): Observable<Product> {
    return this.http.post<Product>(`${this.API_URL}`, data);
  }

  editProduct(data: Product): Observable<Product> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.put<Product>(`${this.API_URL}/update`, data,  { headers });
  }

  deleteProduct(idProduct: number): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/${idProduct}`);
  }
}
