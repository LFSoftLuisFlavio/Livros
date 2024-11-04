import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Autor } from '../models/Autor';

import { environment } from '../../environments/environment.development';

interface ApiResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AutorService {

  baseURL = `${environment.UrlApi}/Autors`;  

  constructor(private http: HttpClient) { }

  getAll(): Observable<Autor[]> {
    return this.http.get<Autor[]>(this.baseURL +"/GetAll");
  }

  post(autor: any): Observable<ApiResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<ApiResponse>(`${this.baseURL}`, autor, { headers })
      .pipe(
        map((response: ApiResponse) => response),
        catchError((error: HttpErrorResponse) => {
          console.error('Erro ao enviar dados:', error);
          throw error;
        })
      );
  }

  put(autor: Autor) {
    
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.put<ApiResponse>(`${this.baseURL}/${autor.codAu}`, autor, { headers })
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
