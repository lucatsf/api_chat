import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { IDateProvider } from "../IDateProvider";

dayjs.extend(utc);

class DayjsDateProvider implements IDateProvider {
  addDays(days: number): Date {
    return dayjs().add(days, "day").toDate();
  }

  compareInHours(start_date: Date, end_date: Date): number {
    const end_date_utc = this.convertToUTC(end_date);
    const start_date_utc = this.convertToUTC(start_date);
    return dayjs(start_date_utc).diff(dayjs(end_date_utc), "minutes");
  }

  convertToUTC(date: Date): string {
    return dayjs(date).utc().local().format();
  }

  convertToLocalRootString(date: Date): string {
    return dayjs(date).local().format("YYYY-MM-DD");
  }

  dateNow(): Date {
    const date = dayjs().toDate();
    let dateFormat = this.convertToUTC(date);

    return new Date(dateFormat);
  }

  formatHours(minutes: number): string {
    const horas = Math.floor(minutes / 60);
    const min = minutes % 60;
    const textHours = `00${horas}`.slice(-2);
    const textMinutes = `00${min}`.slice(-2);

    return `${textHours}:${textMinutes}`;
  };
}

export { DayjsDateProvider };
