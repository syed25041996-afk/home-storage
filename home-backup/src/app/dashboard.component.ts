import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FileUploadComponent } from './file-upload.component';

interface FileItem {
  name: string;
  size: string;
  uploadedAt: string;
  type: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FileUploadComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  currentUser = signal(this.getCurrentUser());

  totalFiles = signal(42);
  storageUsed = signal('2.4 GB');

  recentUploads = signal<FileItem[]>([
    { name: 'family_photo.jpg', size: '2.1 MB', uploadedAt: '2 hours ago', type: 'Image' },
    { name: 'vacation_video.mp4', size: '45.8 MB', uploadedAt: '1 day ago', type: 'Video' },
    { name: 'recipe_document.pdf', size: '1.2 MB', uploadedAt: '3 days ago', type: 'Document' },
    { name: 'birthday_card.png', size: '850 KB', uploadedAt: '1 week ago', type: 'Image' },
  ]);

  familyMembers = signal([
    { name: 'John Doe', role: 'Admin' },
    { name: 'Jane Doe', role: 'Member' },
    { name: 'Alice Smith', role: 'Member' },
    { name: 'Bob Johnson', role: 'Member' },
  ]);

  constructor(private router: Router) {}

  getCurrentUser(): string {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const userObj = JSON.parse(user);
      return userObj.username;
    }
    return 'Guest';
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('credentials');
    this.router.navigate(['/login']);
  }
}