import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment.development';
@Injectable({
  providedIn: 'root'
})
export class RelatoriosService {
  baseURL = `${environment.UrlApi}/Relatorio`;
  constructor(private http: HttpClient) { }

  getRelatorioPdf(): Observable<Blob> {
    return this.http.get(`${this.baseURL}/GetRelatorioPDF`, { responseType: 'blob' });
  }

}
