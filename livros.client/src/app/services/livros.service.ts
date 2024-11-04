import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Livro } from '../models/Livro';

import { environment } from '../../environments/environment.development';

interface ApiResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class LivrosService {

  baseURL = `${environment.UrlApi}/Livros`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Livro[]> {
    return this.http.get<Livro[]>(this.baseURL + "/GetAll");
  }

  post(Livro: Livro): Observable<ApiResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<ApiResponse>(`${this.baseURL}`, Livro, { headers })
      .pipe(
        map((response: ApiResponse) => response),
        catchError((error: HttpErrorResponse) => {
          console.error('Erro ao enviar dados:', error);
          throw error;
        })
      );
  }

  put(Livro: Livro) {

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.put<ApiResponse>(`${this.baseURL}/${Livro.codl}`, Livro, { headers })
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

