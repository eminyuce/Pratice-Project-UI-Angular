import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MaterialModule } from './shared/material.module';
import { AcquUserEntityModule } from './acqu-user-entity/acqu-user-entity.module';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, 
    CommonModule,
    MaterialModule,
    AcquUserEntityModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'practive-project-ui-angular';
}
