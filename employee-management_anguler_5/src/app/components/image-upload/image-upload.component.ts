import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';  // Import HttpClientModule

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css'],
  standalone: true,
  imports: [CommonModule, HttpClientModule]  // Include HttpClientModule here
})
export class ImageUploadComponent {
  selectedFile: File | null = null;
  uploadUrl: string | null = null;
  showAlert: boolean = false;

  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onUpload() {
    if (!this.selectedFile) {
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post<{ url: string }>('http://localhost:8080/upload', formData)
      .subscribe(response => {
        this.uploadUrl = response.url;
        this.showAlert = true;
      }, error => {
        console.error('Upload failed', error);
      });
  }

  clearAlert() {
    this.showAlert = false;
  }
}
