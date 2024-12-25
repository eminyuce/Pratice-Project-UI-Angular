// user.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AcquUserEntityServiceBase } from './acqu-user-entity-service-base'; // Adjust the path as necessary
import { AcquUserEntity } from '../models/acqu-user-entity';
import { AcquUserEntitySearchParams } from '../models/acqu-user-entity-search-params';

@Injectable({
  providedIn: 'root',
})
export class AcquUserEntityStaticService extends AcquUserEntityServiceBase {
  private staticPhoneModels: string[] = [
    'iPhone 13',
    'Samsung Galaxy S22',
    'Google Pixel 7',
    'OnePlus 9',
    'Nokia XR20',
  ];

  constructor() {
    super();
  }

  // Method to generate 300 static users
  private generateStaticUsers(): AcquUserEntity[] {
    const users: AcquUserEntity[] = [];
    for (let i = 1; i <= 500; i++) {
      users.push({
        userEntityId: i,
        userName: `User ${i}`,
        userEmail: `user${i}@example.com`,
        phoneModel: this.staticPhoneModels[i % this.staticPhoneModels.length],
        userDescription: `This is a description for User ${i}.`,
        status: i % 4 === 0 ? 'DELETED' : i % 3 === 0 ? 'FROZEN' : 'LIVE',
        createdDate: new Date(2023, 0, i),
        updatedDate: new Date(2023, 0, (i + 1)% 30),
      });
    }
    return users;
  }

  private staticUsers = this.generateStaticUsers();

  getUsers(acquUserEntitySearchParams: AcquUserEntitySearchParams): Observable<AcquUserEntity[]> {
    let filteredUsers = this.staticUsers;
    return of(filteredUsers);
  }

  createUser(user: Partial<AcquUserEntity>): Observable<AcquUserEntity> {
    const newUser: AcquUserEntity = {
      ...user,
      userEntityId: this.staticUsers.length + 1,
      status: 'LIVE',
      createdDate: new Date(),
      updatedDate: new Date(),
    } as AcquUserEntity;
    this.staticUsers.push(newUser);
    return of(newUser);
  }

  updateUser(user: AcquUserEntity): Observable<AcquUserEntity> {
    const index = this.staticUsers.findIndex((u) => u.userEntityId === user.userEntityId);
    if (index !== -1) {
      this.staticUsers[index] = { ...user, updatedDate: new Date() };
    }
    return of(this.staticUsers[index]);
  }

  deleteUser(id: number): Observable<void> {
    this.staticUsers = this.staticUsers.filter((user) => user.userEntityId !== id);
    return of();
  }

  getPhoneModels(): Observable<string[]> {
    return of(this.staticPhoneModels);
  }

  updatePhoneModel(user: AcquUserEntity): Observable<AcquUserEntity> {
    const index = this.staticUsers.findIndex((u) => u.userEntityId === user.userEntityId);
    if (index !== -1) {
      this.staticUsers[index].phoneModel = user.phoneModel;
    }
    return of(this.staticUsers[index]);
  }

  updateBulkStatus(users: AcquUserEntity[], bulkStatus: string): Observable<any> {
    users.forEach((user) => {
      const index = this.staticUsers.findIndex((u) => u.userEntityId === user.userEntityId);
      if (index !== -1) {
        this.staticUsers[index].status = bulkStatus as 'DELETED' | 'FROZEN' | 'LIVE' | 'TEST';
      }
    });
    return of(users).pipe(
      catchError((error) => {
        console.error('Error in updateBulkStatus:', error);
        return of();
      })
    );
  }

  deleteDeletedRecords(): Observable<any> {
    this.staticUsers = this.staticUsers.filter((user) => user.status !== 'DELETED');
    return of(this.staticUsers).pipe( // Emit the updated list of users
      catchError((error) => {
        console.error('Error in deleteDeletedRecords:', error);
        return of(); // Return an empty observable in case of error
      })
    );
  }

  exportToExcel(): Observable<Blob> {
    const blob = new Blob(['Static Excel Data'], { type: 'application/vnd.ms-excel' });
    return of(blob).pipe(
      catchError((error) => {
        console.error('Error in exportToExcel:', error);
        return of();
      })
    );
  }

  getAuditTrail(userId: number): Observable<any[]> {
    const auditTrail = [
      { action: 'Created', timestamp: new Date('2023-01-01T10:00:00Z') },
      { action: 'Updated', timestamp: new Date('2023-01-15T15:00:00Z') },
    ];
    return of(auditTrail).pipe(
      catchError((error) => {
        console.error('Error in getAuditTrail:', error);
        return of();
      })
    );
  }
}
