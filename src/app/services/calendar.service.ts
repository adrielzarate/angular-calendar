import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AmountOfDays } from '../interfaces/amountDays';
import { DateItem } from '../interfaces/dateitem';
import { Reminder } from '../interfaces/reminder';


@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  getDateId(date: number, month: number, year: number): string {
    const monthId = month < 10 ? `0${month}` : month;
    const dateId = date < 10 ? `0${date}` : date;
    return `${year}-${monthId}-${dateId}`;
  }

  getMapOfTimes(date, i) {
    const hour = i < 10 ? `0${i}:00` : `${i}:00`;
    const dateString = `${date}T${hour}:00`;
    const dateInSeconds = new Date(dateString).getTime();

    return { [`${hour}`]: dateInSeconds };
  }

  getPrevMonthIndex(monthIndex) {
    return monthIndex === 1 ? 12 : monthIndex - 1;
  }

  getNextMonthIndex(monthIndex) {
    return monthIndex === 12 ? 1 : monthIndex + 1; 
  }

  getMonthDays(monthIndex, year, currentDayId): DateItem[] {
    const prevMonthIndex = this.getPrevMonthIndex(monthIndex);
    const nextMonthIndex = this.getNextMonthIndex(monthIndex);
    const amountOfDays = {
      prevMonth: this.getNumberOfDays(year, prevMonthIndex),
      currentMonth: this.getNumberOfDays(year, monthIndex),
      nextMonth: this.getNumberOfDays(year, nextMonthIndex),
    };

    return this.datesList(year, monthIndex, amountOfDays, currentDayId);
  }

  private getNumberOfDays(year: number, month: number) {
    return new Date(year, month, 0).getDate();
  }

  private datesList(year: number, monthIndex: number, amountOfDays: AmountOfDays, currentDayId: string) {
    const startDate = new Date(`${monthIndex} 1, ${year}`);
    const firstDayIndex = startDate.getDay();

    let datesList = Array.from({length: amountOfDays.currentMonth}, (_, i) => {
      const date = i + 1;
      const month = monthIndex;
      const id = this.getDateId(date, month, year);
      const isCurrentMonth = true;
      const isCurrentDate = id === currentDayId;
      return { date, month, year, isCurrentMonth, isCurrentDate, id };
    });

    if (firstDayIndex !== 0) {
      datesList = this.addPrevMonthDates(datesList, firstDayIndex, amountOfDays.prevMonth, monthIndex, year);
    }

    if (datesList.length % 7 !== 0) {
      datesList = this.addNextMonthDates(datesList, monthIndex, year);
    }

    datesList = this.setWeekends(datesList);

    return datesList;
  }

  private addPrevMonthDates(datesList, firstDayIndex, daysPrevMonth, monthIndex, currentYear) {
    const dates = [...datesList];
    const month = this.getPrevMonthIndex(monthIndex);
    const year = monthIndex === 1 ? currentYear - 1 : currentYear;

    for (let i = 0; i < firstDayIndex; i++) {
      const date = daysPrevMonth - i;
      const isCurrentMonth = false;
      const id = this.getDateId(date, month, year);
      dates.unshift({date, month, year, isCurrentMonth, id});
    }

    return dates;
  }

  private addNextMonthDates(datesList, monthIndex, currentYear) {
    const dates = [...datesList];
    const month = this.getNextMonthIndex(monthIndex);
    const year = monthIndex === 12 ? currentYear + 1 : currentYear;
    const daysToNextMonth = 7 - dates.length % 7;

    for (let i = 0; i < daysToNextMonth; i++) {
      const date = i + 1;
      const isCurrentMonth = false;
      const id = this.getDateId(date, month, year);
      dates.push({date, month, year, isCurrentMonth, id});
    }

    return dates;
  }

  private setWeekends(datesList) {
    return datesList.map((date, index) => {
      date.isWeekend = index % 7 === 0 || (index + 1) % 7 === 0;
      return date;
    });
  }
}
