import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DateItem } from 'src/app/interfaces/dateitem';
import { Reminder } from 'src/app/interfaces/reminder';
import { ReminderFormComponent } from '../reminder-form/reminder-form.component';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss']
})
export class DateComponent implements OnInit {
  @Input() dateInfo: DateItem;
  @Output() updateReminder = new EventEmitter<{[key: string]: Reminder}>();
  private dateId: string;

  constructor(
    private matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.dateId = this.dateInfo.id;
  }

  openReminderForm(data: Reminder = {} as Reminder) {
    data.dateId = this.dateId;
    const dialogRef = this.matDialog.open(ReminderFormComponent, {data});
    dialogRef.afterClosed().subscribe(value => {
      const updatedReminders = {...this.dateInfo.reminders, ...value};
      if (Object.values(updatedReminders).length) {
        this.updateReminder.emit({[this.dateInfo.id]: updatedReminders});
      } else {
        this.updateReminder.emit(null);
      }
    });
  }

  openAddReminder() {
    this.openReminderForm();
  }

  openEditReminder(event, reminderId, reminder) {
    reminder.id = reminderId;
    event.stopPropagation();
    this.openReminderForm(reminder);
  }
}
