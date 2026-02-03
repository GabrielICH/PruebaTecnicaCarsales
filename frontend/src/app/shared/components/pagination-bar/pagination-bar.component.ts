import { Component, EventEmitter, Input, Output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bar">
      <button class="btn" (click)="go(page - 1)" [disabled]="page <= 1 || disabled || totalPages <= 1">←</button>

      <div class="center">
        <span class="pill">Página</span>

        <select class="select" [value]="page" (change)="go(toNumber($any($event.target).value))"[disabled]="disabled || totalPages <= 1">
          <option *ngFor="let p of pages()" [value]="p">{{ p }}</option>
        </select>

        <span class="muted">de {{ totalPages }}</span>
      </div>

      <button class="btn" (click)="go(page + 1)" [disabled]="page >= totalPages || disabled || totalPages <= 1">→</button>
    </div>
  `,
  styles: [`
    .bar{
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:12px;
      padding: 12px 14px;
      border: 1px solid rgba(255,255,255,.08);
      background: rgba(17,26,46,.7);
      border-radius: 14px;
      margin: 14px 0;
      backdrop-filter: blur(10px);
    }
    .btn{
      border: 1px solid rgba(255,255,255,.10);
      background: rgba(255,255,255,.06);
      color: #e8f0ff;
      border-radius: 12px;
      padding: 10px 12px;
      cursor:pointer;
      min-width: 44px;
    }
    .btn[disabled]{ opacity:.5; cursor:not-allowed; }
    .center{
      display:flex;
      align-items:center;
      gap:10px;
      justify-content:center;
      flex:1;
    }
    .pill{
      padding: 6px 10px;
      border-radius: 999px;
      background: rgba(124,92,255,.18);
      border: 1px solid rgba(124,92,255,.28);
      font-weight: 600;
    }
    .select{
      padding: 8px 10px;
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,.10);
      background: rgba(255,255,255,.05);
      color: #e8f0ff;
      outline: none;
    }
    .muted{ color: rgba(232,240,255,.75); }
  `]
})
export class PaginationBarComponent {
  @Input() page = 1;
  @Input() totalPages = 1;
  @Input() disabled = false;

  @Output() pageChange = new EventEmitter<number>();

  pages = computed(() => Array.from({ length: this.totalPages }, (_, i) => i + 1));

  go(next: number) {
    if (next < 1 || next > this.totalPages) return;
    this.pageChange.emit(next);
  }

  toNumber(v: string) {
    return Number(v);
  }
}
