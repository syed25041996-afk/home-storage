import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';

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

    return this.http.post('/api/upload-files', formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
}