import { Injectable } from '@angular/core';
import { HttpClient, HttpParams   } from '@angular/common/http';
import Transaction from '../models/Transaction';
import { Observable } from 'rxjs';
import { TransactionHistory } from '../models/TransactionHistory';
import {CONFIG} from '../config/config'

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  readonly API_URL = CONFIG.apiUrlTransaction;
  transacction: Transaction[];
  
  constructor(private http: HttpClient) 
  {
    this.transacction = [];
  }

  createTransaction(data: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.API_URL}`, data);
  }

  getTransactionHistory(startDate: string, endDate: string, transactionType: string): Observable<TransactionHistory[]> {
    let params = new HttpParams()
      .set('fechaInicio', startDate)
      .set('fechaFin', endDate)
      .set('tipo', transactionType);
    console.log(params);
    return this.http.get<TransactionHistory[]>(`${this.API_URL}/historial`, { params });
    //return this.http.get<any>(`${this.API_URL}/history`, { params });
  }
}
