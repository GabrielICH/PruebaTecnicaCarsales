
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'episodes', pathMatch: 'full' },
  { path: 'characters', loadComponent: () => import('./features/characters/characters.page').then(m => m.CharactersPage) },
  { path: 'episodes', loadComponent: () => import('./features/episodes/episodes.page').then(m => m.EpisodesPage) },
];