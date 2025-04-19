import { IDate, ITransactions } from "../types/indexTypes";

export const prepareDateWithOriginalParts = (
  tranData: ITransactions,
  date: string | IDate,
) => {
  if (typeof date !== "string") {
    return {
      day: date.day,
      month: date.month,
      year: date.year,
      hour: date.hour,
      minute: date.minute,
      second: date.second,
      weekDay: date.weekDay,
    };
  }

  const [datePart, timePart] = date.split(", ");

  const [, day, year] = datePart.split(".").map(Number);

  const [hour, minute, second] = timePart.split(":").map(Number);

  return {
    day,
    month: tranData.date.month,
    year,
    hour,
    minute,
    second,
    weekDay: tranData.date.weekDay,
  };
};
