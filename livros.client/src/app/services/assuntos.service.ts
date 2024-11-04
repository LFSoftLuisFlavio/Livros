import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Assunto } from '../models/Assunto';

import { environment } from '../../environments/environment.development';

interface ApiResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AssuntosService {

  baseURL = `${environment.UrlApi}/Assuntos`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Assunto[]> {
    return this.http.get<Assunto[]>(this.baseURL + "/GetAll");
  }

  post(assunto: Assunto): Observable<ApiResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<ApiResponse>(`${this.baseURL}`, assunto, { headers })
      .pipe(
        map((response: ApiResponse) => response),
        catchError((error: HttpErrorResponse) => {
          console.error('Erro ao enviar dados:', error);
          throw error;
        })
      );
  }

  put(assunto: Assunto) {

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.put<ApiResponse>(`${this.baseURL}/${assunto.codAs}`, assunto, { headers })
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

