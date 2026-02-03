import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RickMortyApiService } from '../../core/service/rick-morty-api.service';
import { Character } from '../../core/models/character.model';
import { PagedResult } from '../../core/models/paged-result.model';
import { PaginationBarComponent } from '../../shared/components/pagination-bar/pagination-bar.component';
import { ErrorBannerComponent } from '../../shared/components/error-banner/error-banner.component'    //'/shared/components/error-banner/error-banner.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, 
    PaginationBarComponent,
    ErrorBannerComponent
  ],
  template: `
    <h2>Personajes</h2>

    <app-error-banner *ngIf="hasSearched()" [message]="error()" />

  <div class="card filters">

  <div>
    <label>Nombre</label>
    <input class="input" type="text" [(ngModel)]="name" placeholder="Ej: Morty"/>
  </div>

  <div>
    <label>Estado</label>
    <select class="select" [(ngModel)]="status">
      <option value="">Todos</option>
      <option value="alive">Vivo</option>
      <option value="dead">Muerto</option>
      <option value="unknown">Desconocido</option>
    </select>
  </div>

  <div>
    <label>Especie</label>
    <input class="input" type="text" [(ngModel)]="species" placeholder="Ej: Human" />
  </div>

  <div class="actions">
    <button class="btn primary" (click)="applyFilters()">
      Buscar
    </button>

    <button class="btn" (click)="clearFilters()">
      Limpiar
    </button>
  </div>
</div>
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
    .filters { display: grid; gap: 8px; grid-template-columns: 1fr 1fr 1fr; align-items: end; margin: 12px 0; }
    input, select { width: 100%; padding: 8px; border-radius: 8px; border: 1px solid #1d0808; }
    .pagination { display:flex; gap:12px; align-items:center; margin: 12px 0; }
    .grid { display: grid; gap: 12px; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); }
    .card { border: 1px solid #eee; border-radius: 12px; overflow: hidden; }
    img { width: 100%; height: 220px; object-fit: cover; }
    .meta { padding: 10px; }
    .name { font-weight: 700; }
    .char-card{ overflow:hidden; }
    .thumb{ height: 220px; background: rgba(255,255,255,.04); }
    .thumb img{ width:100%; height:100%; object-fit:cover; display:block; }
    
    .body{ padding: 12px 12px 14px; }
    .name{ font-weight: 900; font-size: 16px; margin-bottom: 10px; }
    
    .chips{ display:flex; gap:8px; flex-wrap:wrap; }
    .chip{
      padding: 6px 10px;
      border-radius: 999px;
      border: 1px solid var(--border);
      background: rgba(255,255,255,.05);
      font-weight: 700;
      font-size: 12px;
    }
    .chip.alive{ border-color: rgba(0,255,160,.28); background: rgba(0,255,160,.10); }
    .chip.dead{ border-color: rgba(255,92,122,.35); background: rgba(255,92,122,.14); }
    .chip.ghost{ opacity: .9; }
      `]
})
export class CharactersPage {
  private api = inject(RickMortyApiService);

  // filtros
  name = signal<string>('');
  status = signal<string>('');
  species = signal<string>('');
  page = signal<number>(1);
  hasSearched = signal(false);

  // data state
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  result = signal<PagedResult<Character> | null>(null);

  items = computed(() => this.result()?.items ?? []);
  totalPages = computed(() => this.result()?.totalPages ?? 1);

  constructor() {
    effect(() => {
      // cuando cambian filtros, volvemos a la página 1 (pero evita loop)
      this.page.set(1);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      this.name(); this.status(); this.species();
      this.fetch();
    });

    effect(() => {
      // cuando cambia page, solo fetch
      this.page();
      this.fetch();
    });
  }

  fetch() {
  this.loading.set(true);
  this.error.set(null);

  this.api.getCharacters({
    page: this.page(),
    name: this.name().trim() || undefined,
    status: this.status().trim() || undefined,
    species: this.species().trim() || undefined,
  }).subscribe({
    next: (res) => {
      this.result.set(res);
      this.loading.set(false);
    },
    error: (err) => {
      this.error.set(err?.error?.title ?? err?.error?.message ?? 'Error consultando personajes');
      this.loading.set(false);
    }
  });
}

 applyFilters() {
  this.hasSearched.set(true);
  this.page.set(1);
  this.fetch();
}

clearFilters() {
  this.name.set('');
  this.status.set('');
  this.species.set('');
  this.page.set(1);
  this.hasSearched.set(false);
  this.error.set(null);
 // this.result.set({ items: [], page: 1, totalPages: 1, totalCount: 0 }); // opcional
}

  prev() { if (this.page() > 1) this.page.set(this.page() - 1); }
  next() { if (this.page() < this.totalPages()) this.page.set(this.page() + 1); }
}
