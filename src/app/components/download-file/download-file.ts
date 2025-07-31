import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-download-file',
  imports: [MatButtonModule,MatIconModule],
  templateUrl: './download-file.html',
  styleUrl: './download-file.scss'
})
export class DownloadFile {
  
  constructor(private snackBar: MatSnackBar) {}
  
  downloadCV(): void {
    // Check if file ID exists
    const fileId = environment.googleDriveFileId;
    
    if (!fileId || fileId.trim() === '') {
      this.snackBar.open('CV not available at the moment', 'Close', {
        duration: 4000,
        panelClass: ['error-snackbar'],
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }
    
    // Convert Google Drive share link to direct download link
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    
    try {
      // Create a temporary link element and trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'Alfredo_Diomangay_CV.pdf'; // Optional: set filename
      link.target = '_blank'; // Open in new tab as fallback
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show success message
      this.snackBar.open('CV download started', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar'],
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    } catch (error) {
      this.snackBar.open('Error downloading CV', 'Close', {
        duration: 4000,
        panelClass: ['error-snackbar'],
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    }
  }
}
