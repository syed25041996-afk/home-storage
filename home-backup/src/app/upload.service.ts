import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient) { }

  uploadFiles(files: File[]): Observable<HttpEvent<any>> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    const credentials = localStorage.getItem('credentials');
    let headers = new HttpHeaders();
    if (credentials) {
      headers = headers.set('Authorization', `Basic ${credentials}`);
    }

    return this.http.post(`${environment.apiUrl}/upload-files`, formData, {
      headers,
      reportProgress: true,
      observe: 'events'
    });
  }
}