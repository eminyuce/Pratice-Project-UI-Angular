import { Observable } from 'rxjs';
import { AcquUserEntity } from '../models/acqu-user-entity';
import { FilterCriteria } from '../models/filter-criteria';

export abstract class AcquUserEntityServiceBase {
  abstract getUsers(filters?: FilterCriteria): Observable<AcquUserEntity[]>;
  abstract createUser(user: Partial<AcquUserEntity>): Observable<AcquUserEntity>;
  abstract updateUser(user: AcquUserEntity): Observable<AcquUserEntity>;
  abstract deleteUser(id: number): Observable<void>;
  abstract getPhoneModels(): Observable<string[]>;
  abstract updatePhoneModel(user: AcquUserEntity): Observable<AcquUserEntity>;
  abstract updateBulkStatus(users: AcquUserEntity[], bulkStatus: string): Observable<void>;
  abstract deleteDeletedRecords(): Observable<void>;
  abstract exportToExcel(): Observable<Blob>;
  abstract searchGlobal(searchTerm: string): Observable<AcquUserEntity[]>;
  abstract getAuditTrail(userId: number): Observable<any[]>;
}
