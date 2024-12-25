import { Observable } from 'rxjs';
import { AcquUserEntity } from '../models/acqu-user-entity';
import { AcquUserEntitySearchParams } from '../models/acqu-user-entity-search-params';

export abstract class AcquUserEntityServiceBase {
  abstract getUsers(acquUserEntitySearchParams: AcquUserEntitySearchParams): Observable<AcquUserEntity[]>;
  abstract createUser(user: Partial<AcquUserEntity>): Observable<AcquUserEntity>;
  abstract updateUser(user: AcquUserEntity): Observable<AcquUserEntity>;
  abstract deleteUser(id: number): Observable<void>;
  abstract getPhoneModels(): Observable<string[]>;
  abstract updatePhoneModel(user: AcquUserEntity): Observable<AcquUserEntity>;
  abstract updateBulkStatus(users: AcquUserEntity[], bulkStatus: string): Observable<any>;
  abstract deleteDeletedRecords(): Observable<any>;
  abstract exportToExcel(): Observable<Blob>;
  abstract getAuditTrail(userId: number): Observable<any[]>;
}
