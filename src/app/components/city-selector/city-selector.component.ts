import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { City } from 'src/app/interfaces/city';
import { WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-city-selector',
  templateUrl: './city-selector.component.html',
  styleUrls: ['./city-selector.component.scss']
})
export class CitySelectorComponent implements OnInit {
  @Input() preloadedCity;
  @Output() city = new EventEmitter<City>();

  filteredOptions: Observable<City[]>;
  myControl = new FormControl();

  private initialInputValue = '';

  constructor( private weatherService: WeatherService ) { }  

  ngOnInit(): void {
    if (this.preloadedCity) {
      this.myControl.setValue(this.preloadedCity);
      this.initialInputValue = `${this.preloadedCity.name}, ${this.preloadedCity.state}, ${this.preloadedCity.country}`;
    }

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(this.initialInputValue),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap( (cityName: string) => {
        if (cityName) return this.filter(cityName);
        this.onSelectCity(null);
        return of(null);
      }) 
    )
  }

  filter(cityName: string): Observable<City[]> {
    return this.weatherService.getCityPredictions(cityName).pipe(
      map(response => response.filter(option => { 
        return option.name.toLowerCase().indexOf(cityName.toLowerCase()) === 0;
      }))
    );
  }

  onSelectCity(city: City): void {
    this.city.emit(city);
  }

  displayFn(city: City): string {
    return city ? `${city.name}, ${city.state}, ${city.country}` : '';
  }
}
