import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AcquUserEntity } from '../models/acqu-user-entity';

@Injectable({
  providedIn: 'root',
})
export class AcquUserEntityService {
  private apiUrl = 'http://localhost:8080/api/acqu-user-entities'; // Replace with your API URL

  constructor(private http: HttpClient) {}

  getEntities(): Observable<AcquUserEntity[]> {
    return this.http.get<AcquUserEntity[]>(this.apiUrl);
  }

  getEntityById(id: string): Observable<AcquUserEntity> {
    return this.http.get<AcquUserEntity>(`${this.apiUrl}/${id}`);
  }

  createEntity(entity: AcquUserEntity): Observable<AcquUserEntity> {
    return this.http.post<AcquUserEntity>(this.apiUrl, entity);
  }

  updateEntity(id: string, entity: AcquUserEntity): Observable<AcquUserEntity> {
    return this.http.put<AcquUserEntity>(`${this.apiUrl}/${id}`, entity);
  }

  deleteEntity(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
