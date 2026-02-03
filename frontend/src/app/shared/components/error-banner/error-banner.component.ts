import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-banner',
  standalone: true,
  imports: [CommonModule],  
  template: `
    <div *ngIf="message" class="error">
      <strong>Error:</strong> {{ message }}
    </div>
  `,
  styles: [`
    .error { padding: 12px; border-radius: 8px; background: #e50808; }
  `]
})
export class ErrorBannerComponent {
  @Input() message: string | null = null;
}

