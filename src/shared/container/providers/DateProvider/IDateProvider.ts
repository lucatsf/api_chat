interface IDateProvider {
  compareInHours(start_date: Date, end_date: Date): number;
  convertToUTC(date: Date): string;
  dateNow(): Date;
  formatHours(minutes: number): string;
  addDays(days: number): Date;
}

export { IDateProvider };
