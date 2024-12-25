// user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AcquUserEntity } from '../models/acqu-user-entity';
import { AcquUserEntityServiceBase } from './acqu-user-entity-service-base'; 
import { AcquUserEntitySearchParams } from '../models/acqu-user-entity-search-params';

@Injectable({
  providedIn: 'root'
})
export class AcquUserEntityHttpService extends AcquUserEntityServiceBase {
  private readonly baseUrl = '/api/users';

  constructor(private http: HttpClient) {
    super();
  }

  getUsers(acquUserEntitySearchParams: AcquUserEntitySearchParams): Observable<AcquUserEntity[]> {
    let params = new HttpParams();
   
    return this.http.get<AcquUserEntity[]>(`${this.baseUrl}`, { params }).pipe(
      map(users => users.map(user => ({
        ...user,
        createdDate: new Date(user.createdDate),
        updatedDate: new Date(user.updatedDate)
      })))
    );
  }

  createUser(user: Partial<AcquUserEntity>): Observable<AcquUserEntity> {
    return this.http.post<AcquUserEntity>(`${this.baseUrl}`, user);
  }

  updateUser(user: AcquUserEntity): Observable<AcquUserEntity> {
    return this.http.put<AcquUserEntity>(`${this.baseUrl}/${user.userEntityId}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getPhoneModels(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/phone-models`);
  }

  updatePhoneModel(user: AcquUserEntity): Observable<AcquUserEntity> {
    return this.http.patch<AcquUserEntity>(
      `${this.baseUrl}/${user.userEntityId}/phone-model`,
      { phoneModel: user.phoneModel }
    );
  }

  updateBulkStatus(users: AcquUserEntity[], status: string): Observable<any> {
    const userIds = users.map(user => user.userEntityId);
    return this.http.patch<AcquUserEntity[]>(`${this.baseUrl}/bulk-status`, {
      userIds,
      status
    });
  }

  
  deleteDeletedRecords(): Observable<any> {
    return this.http.delete<void>(`${this.baseUrl}/deleted`);
  }

  exportToExcel(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/export`, {
      responseType: 'blob'
    });
  }

  getAuditTrail(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${userId}/audit`);
  }
}