import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Upload {
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

  // Get the files count for the authenticated user
  getFilesCount(): Observable<number> {
    const credentials = localStorage.getItem('credentials');
    let headers = new HttpHeaders();
    if (credentials) {
      headers = headers.set('Authorization', `Basic ${credentials}`);
    }

    return this.http.get<number>(`${environment.apiUrl}/upload-files/count`, { headers });
  }

  // Get recent uploaded files for the authenticated user
  getRecentUploads(): Observable<any> {
    const credentials = localStorage.getItem('credentials');
    let headers = new HttpHeaders();
    if (credentials) {
      headers = headers.set('Authorization', `Basic ${credentials}`);
    }

    return this.http.get<any>(`${environment.apiUrl}/upload-files/recent`, { headers });
  }

  //Get total storage used by the authenticated user
  getStorageUsed(): Observable<any> {
    const credentials = localStorage.getItem('credentials');
    let headers = new HttpHeaders();
    if (credentials) {
      headers = headers.set('Authorization', `Basic ${credentials}`);
    }

    return this.http.get<any>(`${environment.apiUrl}/upload-files/storage`, { headers });
  }

  // Download a file by ID
  downloadFile(fileId: number): Observable<Blob> {
    const credentials = localStorage.getItem('credentials');
    let headers = new HttpHeaders();
    if (credentials) {
      headers = headers.set('Authorization', `Basic ${credentials}`);
    }

    return this.http.get(`${environment.apiUrl}/upload-files/${fileId}/download`, {
      headers,
      responseType: 'blob'
    });
  }

  // Delete a file by ID
  deleteFile(fileId: number): Observable<any> {
    const credentials = localStorage.getItem('credentials');
    let headers = new HttpHeaders();
    if (credentials) {
      headers = headers.set('Authorization', `Basic ${credentials}`);
    }

    return this.http.delete(`${environment.apiUrl}/upload-files/${fileId}`, { headers });
  }
}
