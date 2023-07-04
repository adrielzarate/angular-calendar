import { City } from "./city";

export interface Reminder {
  city?: City;
  dateId?: string;
  id?: string;
  dateTime: number;
  forecast: string;
  text: string;
}
