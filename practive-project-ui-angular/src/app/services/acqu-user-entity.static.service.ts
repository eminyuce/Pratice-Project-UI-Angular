// user.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AcquUserEntityServiceBase } from './acqu-user-entity-service-base'; // Adjust the path as necessary
import { AcquUserEntity } from '../models/acqu-user-entity';
import { FilterCriteria } from '../models/filter-criteria';

@Injectable({
  providedIn: 'root',
})
export class AcquUserEntityStaticService extends AcquUserEntityServiceBase {

  private staticUsers: AcquUserEntity[] = [
    {
      userEntityId: 1,
      userName: 'John Doe',
      userEmail: 'john.doe@example.com',
      phoneModel: 'iPhone 13',
      userDescription: 'A regular user for testing purposes.',
      status: 'LIVE',
      createdDate: new Date('2023-01-01T10:00:00Z'),
      updatedDate: new Date('2023-01-15T15:00:00Z'),
    },
    {
      userEntityId: 2,
      userName: 'Jane Smith',
      userEmail: 'jane.smith@example.com',
      phoneModel: 'Samsung Galaxy S22',
      userDescription: 'Another test user with specific preferences.',
      status: 'FROZEN',
      createdDate: new Date('2023-02-01T11:00:00Z'),
      updatedDate: new Date('2023-02-10T16:00:00Z'),
    },
  ];

  private staticPhoneModels: string[] = [
    'iPhone 13',
    'Samsung Galaxy S22',
    'Google Pixel 7',
  ];

 constructor() {
    super();
  }

  getUsers(filters?: FilterCriteria): Observable<AcquUserEntity[]> {
    let filteredUsers = this.staticUsers;

    if (filters) {
      filteredUsers = this.staticUsers.filter((user) => {
        return Object.entries(filters).every(([key, value]) =>
          value
            ? user[key as keyof AcquUserEntity]?.toString().includes(value.toString())
            : true
        );
      });
    }

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

  updateBulkStatus(users: AcquUserEntity[], bulkStatus: string): Observable<void> {
    users.forEach((user) => {
      const index = this.staticUsers.findIndex((u) => u.userEntityId === user.userEntityId);
      if (index !== -1) {
        this.staticUsers[index].status = bulkStatus as 'DELETED' | 'FROZEN' | 'LIVE' | 'TEST';
      }
    });
    return of();
  }

  deleteDeletedRecords(): Observable<void> {
    this.staticUsers = this.staticUsers.filter((user) => user.status !== 'DELETED');
    return of();
  }

  exportToExcel(): Observable<Blob> {
    const blob = new Blob(['Static Excel Data'], { type: 'application/vnd.ms-excel' });
    return of(blob);
  }

  searchGlobal(searchTerm: string): Observable<AcquUserEntity[]> {
    const filteredUsers = this.staticUsers.filter((user) =>
      Object.values(user).some((value) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    return of(filteredUsers);
  }

  getAuditTrail(userId: number): Observable<any[]> {
    const auditTrail = [
      { action: 'Created', timestamp: new Date('2023-01-01T10:00:00Z') },
      { action: 'Updated', timestamp: new Date('2023-01-15T15:00:00Z') },
    ];
    return of(auditTrail);
  }
}
