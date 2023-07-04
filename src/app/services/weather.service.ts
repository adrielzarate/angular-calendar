import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { City } from '../interfaces/city';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private readonly openWeatherAPI_URL = 'http://api.openweathermap.org/';

  constructor( private httpClient: HttpClient ) {}

	getCityPredictions(cityName: string): Observable<City[]> {
    const url = `${this.openWeatherAPI_URL}/geo/1.0/direct`;
    let params = new HttpParams().set('q', cityName);
    params = params.set('limit', '5');
    params = params.set('appid', environment.OPEN_WEATHER_KEY);
    return this.httpClient.get<City[]>(url, { params });
	}

  getCityWeather(lat: number, lon: number, dt: number): Observable<City[]> {
    const url = `${this.openWeatherAPI_URL}data/2.5/forecast`;
    let params = new HttpParams().set('lat', `${lat}`);
    params = params.set('lon', `${lon}`);
    params = params.set('dt', `${dt}`);
    params = params.set('appid', environment.OPEN_WEATHER_KEY);
    return this.httpClient.get<City[]>(url, { params });
  }
}