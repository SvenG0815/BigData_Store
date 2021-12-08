import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import {  Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Advertisment } from './advertisment';

@Injectable({
  providedIn: 'root'
})
export class AdvertismentService {
  // TODO: Switch from localhost to service
  private apiURL = "http://localhost:3000";
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<any>{
    return this.httpClient.get(this.apiURL + '/advertisments')
  }

  get(id: string): Observable<Object>{
    return this.httpClient.get(this.apiURL + '/advertisments/' + id);
  }

  create(advertisment: Advertisment): Observable<Object>{
    return this.httpClient.post(this.apiURL + '/advertisments', JSON.stringify(advertisment), this.httpOptions);
  }

  update(advertisment: Advertisment): Observable<Object>{
    return this.httpClient.put(this.apiURL + '/advertisments/' + advertisment.id, advertisment, this.httpOptions);
  }

  delete(advertisent: Advertisment): Observable<Object>{
    return this.httpClient.delete(this.apiURL + '/advertisments/' + advertisent.id);
  }

  getProducts(): Observable<any>{
    return this.httpClient.get(this.apiURL + '/products');
  }
}
