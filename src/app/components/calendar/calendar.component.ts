import { Component, OnInit } from '@angular/core';
import { DateItem } from 'src/app/interfaces/dateitem';
import { Reminder } from 'src/app/interfaces/reminder';
import { CalendarService } from 'src/app/services/calendar.service';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  readonly dayNames = [
    'Sunday', 
    'Monday', 
    'Tuesday', 
    'Wednesday', 
    'Thursday', 
    'Friday', 
    'Saturday'
  ];
  datesList: DateItem[];
  monthName: string;
  year: number;
  reminders: {[key: string]: {[key: string]: Reminder}};

  private readonly monthNames = [
    'January', 
    'February', 
    'March', 
    'April', 
    'May', 
    'June', 
    'July', 
    'August', 
    'September', 
    'October', 
    'November', 
    'December'
  ];
  private selectedMonthIndex: number;
  private selectedYear: number;
  private currentDayId: string;

  constructor(
    private calendarService: CalendarService,
  ) { }

  ngOnInit(): void {
    const date = new Date();
    const currentDay = date.getDate();
    const currentMonthIndex = date.getMonth() + 1;
    const currentYear = date.getFullYear();
    this.currentDayId = this.calendarService.getDateId(currentDay,currentMonthIndex,currentYear);
    this.year = currentYear;
    this.updateCalendar(currentMonthIndex, currentYear);
  }

  goPrevMonth() {
    const monthIndex = this.calendarService.getPrevMonthIndex(this.selectedMonthIndex);
    this.year = (monthIndex === 12) ? this.selectedYear -= 1 : this.selectedYear;
    this.updateCalendar(monthIndex, this.year);
  }

  goNextMonth() {
    const monthIndex = this.calendarService.getNextMonthIndex(this.selectedMonthIndex);
    this.year = (monthIndex === 1) ? this.selectedYear += 1 : this.selectedYear;
    this.updateCalendar(monthIndex, this.year);
  }

  updateCalendar(monthIndex: number, year: number) {
    this.selectedMonthIndex = monthIndex;
    this.selectedYear = year;
    this.monthName = this.monthNames[monthIndex - 1];
    this.datesList = this.calendarService.getMonthDays(this.selectedMonthIndex, this.selectedYear, this.currentDayId);
    this.datesList = this.mergeRemindersAndDates();
  }

  updateEvents(reminder) {
    if (reminder) {
      this.reminders = {...this.reminders, ...reminder};
      this.mergeRemindersAndDates();
    }
  }

  private mergeRemindersAndDates() {
    if (this.reminders) {
      return this.datesList.map(date => {
        if (!date.reminders) date.reminders = {};
        if (this.reminders[date.id]) {
          date.reminders = {...date.reminders, ...this.reminders[date.id]};
        }
        return date;
      });
    }
    return this.datesList;
  }
}
