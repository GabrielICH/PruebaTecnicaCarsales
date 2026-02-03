import { Component, Input, Output, EventEmitter, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pager" *ngIf="totalPages > 1">

  <button
    class="btn"
    (click)="emit(page - 1)"
    [disabled]="disabled || page <= 1">
    Anterior
  </button>

  <span class="pill">
    Página <b>{{ page }}</b> de <b>{{ totalPages }}</b>
  </span>

  <button
    class="btn"
    (click)="emit(page + 1)"
    [disabled]="disabled || page >= totalPages">
    Siguiente
  </button>

</div>
  `,
})
export class PaginationBarComponent {
  @Input() page = 1;
  @Input() totalPages = 1;
  @Input() disabled = false;

  @Output() pageChange = new EventEmitter<number>();

  pages = computed(() => Array.from({ length: this.totalPages }, (_, i) => i + 1));

  emit(p: number) {
    if (this.disabled) return;
    const next = Math.max(1, Math.min(this.totalPages, p));
    this.pageChange.emit(next);
  }
}
