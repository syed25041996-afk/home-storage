import { CommonModule } from '@angular/common';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { Upload } from '../../services/upload';
import { AppEvents } from '../../shared/app-events';
import { HeaderComponent } from '../header/header';
import { ErrorModalService } from '../../shared/error-modal.service';
import { SuccessModalService } from '../../shared/success-modal.service';
import { finalize } from 'rxjs';

interface FileItem {
  original_name: string;
  size: number;
  uploaded_at: string;
  type: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent {
  currentUser = signal(this.getCurrentUser());

  totalFiles = signal(0);
  storageUsed = signal(0);
  remainingStorage = signal(10240); // in MB, assuming 10 GB total storage

  recentUploads = signal<FileItem[]>([]);

  familyMembers = signal([
    { name: 'John Doe', role: 'Admin' },
    { name: 'Jane Doe', role: 'Member' },
    { name: 'Alice Smith', role: 'Member' },
    { name: 'Bob Johnson', role: 'Member' },
  ]);

  selectedFiles: WritableSignal<File[]> = signal([]);
  uploadProgress: WritableSignal<number> = signal(0);
  uploadStatus: WritableSignal<string> = signal('');
  isDragOver: WritableSignal<boolean> = signal(false);
  isUploading: WritableSignal<boolean> = signal(false);

  constructor(private router: Router, private uploadService: Upload, private appEvents: AppEvents, private errorModalService: ErrorModalService, private successModalService: SuccessModalService) { }

  ngOnInit() {

    this.getFilesCount();
    this.getRecentUploads();
    this.getStorageUsed();

    this.appEvents.refreshDashboard$.subscribe(() => {
      this.getFilesCount();
      this.getRecentUploads();
      this.getStorageUsed();
    });
  }

  getCurrentUser(): string {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const userObj = JSON.parse(user);
      return userObj.username;
    }
    return 'Guest';
  }

  // Call getfiles count from UploadService to update totalFiles
  getFilesCount() {
    this.uploadService.getFilesCount().subscribe({
      next: (res: any) => {
        this.totalFiles.set(res.count);
      },
      error: (err) => {
        this.errorModalService.showError('Error', 'Failed to fetch files count. Please try again.');
      }
    });
  }

  // Call getRecentUploads from UploadService to update recentUploads
  getRecentUploads() {
    this.uploadService.getRecentUploads().subscribe({
      next: (res: any) => {
        this.recentUploads.set(res.files);
      },
      error: (err) => {
        this.errorModalService.showError('Error', 'Failed to fetch recent uploads. Please try again.');
      }
    });
  }

  // Call getStorageUsed from UploadService to update storageUsed
  getStorageUsed() {
    this.uploadService.getStorageUsed().subscribe({
      next: (res: any) => {
        this.storageUsed.set(res.storageUsed);
        this.remainingStorage.set(res.remainingStorage);
      },
      error: (err) => {
        this.errorModalService.showError('Error', 'Failed to fetch storage information. Please try again.');
      }
    });
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('credentials');
    this.router.navigate(['/login']);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);

    const files = event.dataTransfer?.files;
    if (files) {
      this.addFiles(Array.from(files));
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.addFiles(Array.from(input.files));
    }
  }

  addFiles(files: File[]): void {
    const existingNames = this.recentUploads().map(f => f.original_name);
    const duplicates = files.filter(file => existingNames.includes(file.name));
    if (duplicates.length > 0) {
      this.errorModalService.showError('Duplicate Files', `The following file(s) already exist: ${duplicates.map(d => d.name).join(', ')}`);
      return;
    }
    const currentFiles = this.selectedFiles();
    this.selectedFiles.set([...currentFiles, ...files]);
  }

  removeFile(index: number): void {
    const currentFiles = this.selectedFiles();
    this.selectedFiles.set(currentFiles.filter((_, i) => i !== index));
  }

  uploadFiles(): void {
    const files = this.selectedFiles();
    if (files.length === 0) return;

    this.isUploading.set(true);
    this.uploadProgress.set(0);
    this.uploadStatus.set('');

    this.uploadService.uploadFiles(files).pipe(
      finalize(() => {
        this.isUploading.set(false);
        this.uploadStatus.set('');
        this.selectedFiles.set([]);
      })
    ).subscribe({
      next: (event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress) {
          if (event.total) {
            this.uploadProgress.set(Math.round((100 * event.loaded) / event.total));
          }
        } else if (event.type === HttpEventType.Response) {
          this.uploadStatus.set('success');
          this.selectedFiles.set([]);
          this.successModalService.showSuccess('Upload Successful', 'Your files have been uploaded successfully!');

          // 🔥 THIS is the only new line that matters
          this.appEvents.notifyDashboardRefresh();
        }
      },
      error: (error) => {
        this.uploadStatus.set('error');
        this.errorModalService.showError('Upload Failed', error.error.details.suggestion);
      },
      complete: () => {
        this.isUploading.set(false);
      }
    });
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
