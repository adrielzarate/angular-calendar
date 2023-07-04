import { Reminder } from "./reminder";

export interface DateItem {
  date: number;
  month: number;
  year: number;
  id: string;
  isCurrentMonth?: boolean;
  isCurrentDate?: boolean;
  isWeekend?: boolean;
  reminders?: {[key:string]: Reminder};
}
