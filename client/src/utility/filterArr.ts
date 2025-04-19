import { IFinPlanTransaction } from "../types/indexTypes";
import { CurrencyRate } from "../types/valutaTJTypes";

export const filterArr = <T extends CurrencyRate | IFinPlanTransaction>(
  data: T[],
  key: keyof T,
  bankName: string
): T[] => {
  const result: T[] = [];

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (item && item[key] === bankName) {
      result.push(item);
    }
  }

  return result;
};
