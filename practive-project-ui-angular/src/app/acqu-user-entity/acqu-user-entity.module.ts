import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/material.module';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class AcquUserEntityModule { }