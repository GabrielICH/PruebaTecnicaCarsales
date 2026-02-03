import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RickMortyApiService } from '../../core/service/rick-morty-api.service';
import { Episode } from '../../core/models/episode.model';
import { PagedResult } from '../../core/models/paged-result.model';
import { PaginationBarComponent } from '../../shared/components/pagination-bar/pagination-bar.component';
import { ErrorBannerComponent } from '../../shared/components/error-banner/error-banner.component';


@Component({
  selector: 'app-episodes-page',
  standalone: true,
  imports: [CommonModule, ErrorBannerComponent, PaginationBarComponent],
  template: `
  <h2 class="page-title">Episodios</h2>

    <app-error-banner *ngIf="hasSearched()" [message]="error()"> </app-error-banner>
    
    <!-- Panel de filtros -->
    <div class="card filters">
      <div class="field">
        <label class="label">Nombre</label>
        <input
          class="input"
          [value]="name()"
          (input)="onNameInput($any($event.target).value)"
          placeholder="Ej: Morty"
        />
      </div>
    
      <div class="actions">
        <button class="btn primary" (click)="applyFilters()">Buscar</button>
        <button class="btn" (click)="clearFilters()">Limpiar</button>
      </div>
    </div>
    
    
    

    
    <!-- Cards -->
    <div class="grid" *ngIf="items().length">
      <article class="card ep-card" *ngFor="let e of items()">
        <div class="ep-head">
          <div class="ep-title">{{ e.name }}</div>
          <span class="ep-badge">{{ e.episodeCode }}</span>
        </div>
    
        <div class="ep-meta">
          <span class="dot"></span>
          <span>{{ e.airDate }}</span>
        </div>
      </article>
</div>

<!-- Empty state -->
<div class="empty card" *ngIf="items().length === 0 && error()">
  <div class="empty-title">Sin resultados</div>
  <div class="empty-sub">Prueba con otro nombre o limpia el filtro.</div>
</div>

<!-- Paginación en banner -->
    <app-pagination-bar
      [page]="page()"
      [totalPages]="totalPages()"
      [disabled]="loading()"
      (pageChange)="page.set($event)">
    </app-pagination-bar>
  `,
  styles: [`
   .page-title{
  font-size: 26px;
  font-weight: 900;
  margin: 8px 0 14px;
  letter-spacing: .2px;
}

.filters{
  padding: 14px;
  display:flex;
  gap: 12px;
  align-items: end;
  justify-content: space-between;
  flex-wrap: wrap;
  margin: 12px 0 14px;
}

.field{
  display:flex;
  flex-direction: column;
  gap: 8px;
  min-width: 260px;
  flex: 1;
}

.label{
  font-weight: 800;
  color: rgba(232,240,255,.85);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: .6px;
}

.actions{
  display:flex;
  gap: 10px;
}

.hint{
  margin: 10px 0 0;
  color: rgba(232,240,255,.75);
}

.ep-card{
  padding: 14px;
  transition: transform .12s ease, border-color .12s ease, background .12s ease;
}

.ep-card:hover{
  transform: translateY(-2px);
  border-color: rgba(124,92,255,.35);
  background: rgba(17,26,46,.86);
}

.ep-head{
  display:flex;
  align-items:flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.ep-title{
  font-weight: 900;
  line-height: 1.2;
  font-size: 16px;
}

.ep-badge{
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(0,200,255,.14);
  border: 1px solid rgba(0,200,255,.28);
  font-weight: 800;
  font-size: 12px;
  white-space: nowrap;
}

.ep-meta{
  display:flex;
  align-items:center;
  gap: 10px;
  color: rgba(232,240,255,.75);
  font-weight: 600;
}

.dot{
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(124,92,255,.9);
  box-shadow: 0 0 0 4px rgba(124,92,255,.15);
}

.empty{
  padding: 18px;
  text-align: center;
  margin-top: 14px;
}

.empty-title{
  font-weight: 900;
  font-size: 16px;
  margin-bottom: 6px;
}

.empty-sub{
  color: rgba(232,240,255,.75);
}

.card { border: 1px solid #eee; border-radius: 12px; overflow: hidden; }
  `]
})
export class EpisodesPage {
  private api = inject(RickMortyApiService);

  // UI state
  loading = signal(false);
  error = signal<string | null>(null);
  hasSearched = signal(false);

  // query state
  name = signal<string>('');
  page = signal<number>(0);

  // data
  result = signal<PagedResult<Episode>>({
        items: [],
        page: 1,
        totalPages: 1,
        totalCount: 0
      });

 items = computed(() => this.result().items);
 totalPages = computed(() => this.result().totalPages);

  private nameApplied = signal<string>('');

  constructor() {
    // cada vez que cambia page -> fetch
   // effect(() => {
    //  this.page();
    //  this.fetch();
    //});
  }

  onNameInput(value: string) {
    this.name.set(value);
  }

applyFilters() {
  this.nameApplied.set(this.name().trim());
  this.page.set(1);
  this.hasSearched.set(true);
  this.fetch();
}

clearFilters() {
  this.name.set('');
  //this.page.set(1);
  this.error.set(null);
  this.hasSearched.set(false);
}

  fetch() {
  this.loading.set(true);
  this.error.set(null);

  this.api.getEpisodes({
    page: this.page(),
    name: this.nameApplied().trim() || undefined,
  }).subscribe({
    next: (res) => {
      this.result.set(res);
      this.loading.set(false);
    },
    error: (err) => {
      this.error.set(err?.error?.title ?? err?.error?.message ?? 'Error consultando episodios');
      this.loading.set(false);
    }
  });
}

  prev() {
    if (this.page() > 1) this.page.set(this.page() - 1);
  }

  next() {
    if (this.page() < this.totalPages()) this.page.set(this.page() + 1);
  }
}
