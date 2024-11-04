import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { TipoVenda } from '../models/TipoVenda';

import { environment } from '../../environments/environment.development';

interface ApiResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class TipovendasService {

  baseURL = `${environment.UrlApi}/TipoVendas`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<TipoVenda[]> {
    return this.http.get<TipoVenda[]>(this.baseURL + "/GetAll");
  }

  post(tipoVenda: TipoVenda): Observable<ApiResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<ApiResponse>(`${this.baseURL}`, tipoVenda, { headers })
      .pipe(
        map((response: ApiResponse) => response),
        catchError((error: HttpErrorResponse) => {
          console.error('Erro ao enviar dados:', error);
          throw error;
        })
      );
  }

  put(tipoVenda: TipoVenda) {

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.put<ApiResponse>(`${this.baseURL}/${tipoVenda.codTv}`, tipoVenda, { headers })
      .pipe(
        map((response: ApiResponse) => response),
        catchError((error: HttpErrorResponse) => {
          console.error('Erro ao enviar dados:', error);
          throw error;
        })
      );
  }

  delete(id: Number) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.delete<ApiResponse>(`${this.baseURL}/${id}`, { headers })
      .pipe(
        map((response: ApiResponse) => response),
        catchError((error: HttpErrorResponse) => {
          console.error('Erro ao enviar dados:', error);
          throw error;
        })
      );
  }
}

