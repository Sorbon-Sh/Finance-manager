import { DateObject } from "react-multi-date-picker";
import { IDate } from "../types/indexTypes";


export const parseDateFromServer = (rawDate: IDate, format = "MM.DD.YYYY, HH:mm:ss") => {
  if (!rawDate) return null;

  const {
    year,
    month,
    day,
    hour,
    minute,
    second,
  } = rawDate;

  const dateObj = new DateObject({
    year,
    month: month.number,
    day,
    hour,
    minute,
    second,
  });

  return dateObj.format(format)


};