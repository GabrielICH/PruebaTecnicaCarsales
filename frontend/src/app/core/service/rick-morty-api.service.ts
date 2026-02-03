import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment' //'environments/environment';
import { Observable } from 'rxjs';
import { PagedResult } from '../models/paged-result.model';
import { Character } from '../models/character.model';
import { Episode } from '../models/episode.model';

@Injectable({ providedIn: 'root' })
export class RickMortyApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getCharacters(query: {
    page?: number;
    name?: string;
    status?: string;
    species?: string;
  }): Observable<PagedResult<Character>> {
    let params = new HttpParams();
    if (query.page) params = params.set('page', query.page);
    if (query.name) params = params.set('name', query.name);
    if (query.status) params = params.set('status', query.status);
    if (query.species) params = params.set('species', query.species);

    return this.http.get<PagedResult<Character>>(`${this.baseUrl}/api/characters`, { params });
  }

  getEpisodes(query: { page?: number; name?: string }): Observable<PagedResult<Episode>> {
    let params = new HttpParams();
    if (query.page) params = params.set('page', query.page);
    if (query.name) params = params.set('name', query.name);

    return this.http.get<PagedResult<Episode>>(`${this.baseUrl}/api/episodes`, { params });
  }
}
