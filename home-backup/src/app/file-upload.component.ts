import { Component, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadService } from './upload.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  selectedFiles: WritableSignal<File[]> = signal([]);
  uploadProgress: WritableSignal<number> = signal(0);
  uploadStatus: WritableSignal<string> = signal('');
  isDragOver: WritableSignal<boolean> = signal(false);
  isUploading: WritableSignal<boolean> = signal(false);

  constructor(private uploadService: UploadService) {}

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

    this.uploadService.uploadFiles(files).subscribe({
      next: (event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress) {
          if (event.total) {
            this.uploadProgress.set(Math.round((100 * event.loaded) / event.total));
          }
        } else if (event.type === HttpEventType.Response) {
          this.uploadStatus.set('success');
          this.selectedFiles.set([]);
        }
      },
      error: (error) => {
        this.uploadStatus.set('error');
        console.error('Upload error:', error);
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