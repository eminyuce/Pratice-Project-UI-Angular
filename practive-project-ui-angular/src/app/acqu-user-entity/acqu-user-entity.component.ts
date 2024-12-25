import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { AcquUserEntity } from '../models/acqu-user-entity';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { AcquUserEntityService } from './acqu-user-entity.service';

@Component({
  selector: 'app-acqu-user-entity',
  templateUrl: './acqu-user-entity.component.html',
  styleUrls: ['./acqu-user-entity.component.scss']
})
export class AcquUserEntityComponent implements OnInit {
  showForm = false;
  infoMessage = '';
  acquUserForm: FormGroup;
  dataSource: MatTableDataSource<AcquUserEntity> = new MatTableDataSource();
  selection = new SelectionModel<AcquUserEntity>(true, []);
  displayedColumns: string[] = ['select', 'userName', 'userEmail', 'phoneModel', 'status', 'createdDate', 'updatedDate', 'actions'];
  phoneModels = ['MODEL1', 'MODEL2', 'MODEL3'];  // Assume these are fetched from backend

  constructor(private fb: FormBuilder, public dialog: MatDialog, private entityService: AcquUserEntityService) {
    this.acquUserForm = this.fb.group({
      userName: [''],
      userEmail: ['', [Validators.email, Validators.required]],
      phoneModel: ['', [Validators.required, Validators.pattern(/^[A-Z]+$/)]],
      userDescription: [''],
      fromDate: [null],
      toDate: [null],
      newStatus: ['']
    });
  }

  ngOnInit() {
    // Fetch initial data from backend
    // this.dataSource.data = ...

    this.entityService.getEntities().subscribe((data) => {
      this.dataSource.data = data;
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  toUpper(controlName: string) {
    this.acquUserForm.controls[controlName].setValue(this.acquUserForm.controls[controlName].value?.toUpperCase());
  }

  onSubmit() {
    if (this.acquUserForm.valid) {
      // Save to backend
      this.infoMessage = 'User saved successfully!';
      this.showForm = false;
      this.acquUserForm.reset();
    }
  }

  cancelForm() {
    this.showForm = false;
    this.acquUserForm.reset();
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyDateFilter() {
    // Filter based on date range
  }

  updatePhoneModel(row: AcquUserEntity, newModel: string) {
    // Update the model in backend and update the UI accordingly
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'DELETED': return 'red';
      case 'FROZEN': return 'blue';
      case 'LIVE': return 'green';
      case 'TEST': return 'yellow';
      default: return 'white';
    }
  }

  editRow(row: AcquUserEntity) {
    this.acquUserForm.patchValue(row);
    this.showForm = true;
  }

  showDetails(row: AcquUserEntity) {
    // Open a dialog with more details
  }

  changeStatus() {
    const status = this.acquUserForm.get('newStatus')?.value;
    if (status) {
      this.selection.selected.forEach(item => {
        // Change status in backend
      });
      this.infoMessage = 'Status changed successfully!';
    } else {
      this.infoMessage = 'Please select a new status.';
    }
  }

  deleteDeleted() {
    // Confirm deletion and then delete from backend
  }

  exportData() {
    // Export to Excel
  }
}