import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AcquUserEntity } from '../models/acqu-user-entity';
import { AcquUserEntityStaticService } from '../services/acqu-user-entity.static.service';
import { AcquUserEntityHttpService } from '../services/acqu-user-entity.http.service';
import { AcquUserEntityServiceBase } from '../services/acqu-user-entity-service-base';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../shared/material.module';
import { AcquUserEntityModule } from './acqu-user-entity.module';

@Component({
  selector: 'app-acqu-user-entity',
  templateUrl: './acqu-user-entity.component.html',
  styleUrls: ['./acqu-user-entity.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatCheckboxModule,
    MatSortModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    ConfirmDialogComponent,MaterialModule,AcquUserEntityModule
  ],
  providers: [
    { provide: AcquUserEntityServiceBase, useClass: AcquUserEntityStaticService }
  ]
})
export class AcquUserEntityComponent implements OnInit {
  displayedColumns = [
    'select', 'userEntityId', 'userName', 'userEmail', 'phoneModel',
    'userDescription', 'status', 'createdDate', 'updatedDate', 'actions'
  ];
  dataSource!: MatTableDataSource<AcquUserEntity>;
  selection = new SelectionModel<AcquUserEntity>(true, []);
  userForm!: FormGroup;
  showForm = false;
  editMode = false;
  message = '';
  messageClass = '';
  filterField = '';
  filterOperator = '';
  filterValue = '';
  createdDateStart: Date | null = null;
  createdDateEnd: Date | null = null;
  phoneModels: string[] = [];
  bulkStatus: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private acquUserEntityService: AcquUserEntityServiceBase
  ) {
    this.initDataSource();
  }

  ngOnInit() {
    this.loadData();
    this.loadPhoneModels();
    this.initForm();
  }

  private initForm() {
    this.userForm = this.fb.group({
      userEntityId: [null],
      userName: ['', Validators.required],
      userEmail: ['', [Validators.required, Validators.email]],
      phoneModel: ['', [Validators.required, Validators.pattern(/^[A-Z]+$/)]],
      userDescription: [''],
    });
  }

  private initDataSource() {
    this.dataSource = new MatTableDataSource<AcquUserEntity>();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadData() {
    this.acquUserEntityService.getUsers().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.showMessage('Data loaded successfully', 'success');
      },
      error: (error) => this.showMessage('Error loading data', 'error')
    });
  }

  loadPhoneModels() {
    this.acquUserEntityService.getPhoneModels().subscribe({
      next: (models) => this.phoneModels = models,
      error: (error) => this.showMessage('Error loading phone models', 'error')
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      const userData = this.userForm.value;
      const operation = this.editMode ? 
        this.acquUserEntityService.updateUser(userData) :
        this.acquUserEntityService.createUser(userData);

      operation.subscribe({
        next: () => {
          this.showMessage(
            `User ${this.editMode ? 'updated' : 'created'} successfully`,
            'success'
          );
          this.loadData();
          this.resetForm();
        },
        error: (error) => this.showMessage('Error saving user', 'error')
      });
    }
  }

  updatePhoneModel(element: AcquUserEntity) {
    this.acquUserEntityService.updatePhoneModel(element).subscribe({
      next: () => this.showMessage('Phone model updated successfully', 'success'),
      error: (error) => this.showMessage('Error updating phone model', 'error')
    });
  }

  updateBulkStatus() {
    const selectedUsers = this.selection.selected;
    this.acquUserEntityService.updateBulkStatus(selectedUsers, this.bulkStatus).subscribe({
      next: () => {
        this.showMessage('Status updated successfully', 'success');
        this.loadData();
        this.selection.clear();
      },
      error: (error) => this.showMessage('Error updating status', 'error')
    });
  }

  deleteDeletedRecords() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delete all DELETED records?' }
    });

    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result) {
          this.acquUserEntityService.deleteDeletedRecords().subscribe({
            next: value => {
              console.log('Next value:', value); // Debugging statement
              this.showMessage('Deleted records removed successfully', 'success');
              this.loadData();
            },
            error: (error) => {
              console.error('Error:', error); // Debugging statement
              this.showMessage('Error deleting records', 'error');
            },
            complete: () => {
              console.log('Complete'); // Debugging statement
              // handle completion
            }
          });
        }
      },
      error: (error) => {
        console.error('Error:', error); // Debugging statement
        this.showMessage('Error closing dialog', 'error');
      }
    });
  }

  exportToExcel() {
    this.acquUserEntityService.exportToExcel().subscribe({
      next: (data: Blob) => {
        const url = window.URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'users.xlsx';
        link.click();
        window.URL.revokeObjectURL(url);
        this.showMessage('Export successful', 'success');
      },
      error: (error) => this.showMessage('Error exporting data', 'error')
    });
  }

  private resetForm() {
    this.userForm.reset();
    this.editMode = false;
    this.showForm = false;
  }

  private showMessage(message: string, type: 'success' | 'error') {
    this.message = message;
    this.messageClass = type === 'success' ? 
      'bg-green-100 text-green-800' : 
      'bg-red-100 text-red-800';
    setTimeout(() => this.message = '', 3000);
  }

  readonly colors = {
    'DELETED': '#ffebee',
    'FROZEN': '#e3f2fd',
    'LIVE': '#e8f5e9',
    'TEST': '#fff3e0'
  };
  // Helper methods for data grid
  getStatusColor(status: 'DELETED' | 'FROZEN' | 'LIVE' | 'TEST'): string {
    return this.colors[status] || '';
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ? 
      this.selection.clear() : 
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  editRecord(element: AcquUserEntity) {
    this.showForm = true;
    this.editMode = true;
    this.userForm.patchValue(element);
  }

  viewDetails(element: AcquUserEntity) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: `Details of ${element.userName}` }
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  reloadData() {
    this.loadData();
  }
}
