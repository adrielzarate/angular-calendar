import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';import { City } from 'src/app/interfaces/city';
import { Reminder } from 'src/app/interfaces/reminder';
import { CalendarService } from 'src/app/services/calendar.service';
import { WeatherService } from 'src/app/services/weather.service';
;

@Component({
  selector: 'app-reminder-form',
  templateUrl: './reminder-form.component.html',
  styleUrls: ['./reminder-form.component.scss']
})
export class ReminderFormComponent implements OnInit {
  times: {[key: string]: number};
  reminderData: Reminder = {} as Reminder;

  constructor(
    private weatherService: WeatherService,
    private calendarService: CalendarService,
    public dialogRef: MatDialogRef<ReminderFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Reminder,
  ) { }

  ngOnInit(): void {
    this.reminderData.text = this.data.text || '';
    this.reminderData.city = this.data.city || null;
    this.reminderData.dateTime = this.data.dateTime;
    this.reminderData.forecast = this.data.forecast;

    for (let i = 0; i < 24; i++) {
      const time = this.calendarService.getMapOfTimes(this.data.dateId, i);
      this.times = {...this.times, ...time};
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onCitySelected(city: City) {
    this.reminderData.city = city;
  }

  onSave() {
    const cityData = this.reminderData.city;
    const lat = cityData.lat;
    const lon = cityData.lon;
    const dt = this.reminderData.dateTime || Object.values(this.times)[0];

    this.weatherService.getCityWeather(lat, lon, dt).subscribe({
      next: data => {
        const reminder = this.formatReminderData(data);
        this.dialogRef.close(reminder);
      }
    });
  }

  private formatReminderData(data) {
    const reminderKey = this.data.id || new Date().getTime();
    this.reminderData.forecast = this.selectWeather(data);
    return {[reminderKey]: {...this.reminderData}};
  }

  private selectWeather(data) {
    const forecast = data.list.find(forecast => {
      return forecast.dt_txt.includes(this.data.dateId);
    });

    if (forecast) {
      return forecast.weather[0].description;
    };

    return 'No Forecast available';
  }
}
