import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReminderFormComponent } from './reminder-form.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CitySelectorComponent } from '../city-selector/city-selector.component';

@NgModule({
  declarations: [ReminderFormComponent, CitySelectorComponent],
  exports: [ReminderFormComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
  ]
})
export class ReminderFormModule { }
