export interface Inputs {
  account: string;
  amount: number;
  allAmount: number;
  category: string;
  counterParty: string;
  date: string;
  currency: string;
  mainCurrency: string;
  companyName: string;
}

export interface IAccounts {
  id: string;
  account: string;
  allAmount: number;
  currency: string;
}

export interface ICompnay {
  id: string;
  name: string;
  currency: string;
  allAmount: number;
}

export interface IDate {
  day: number;
  month: {
    name: string;
    shortName: string;
    length: number;
    index: number;
    number: number;
  };
  year: number;
  hour: number;
  minute: number;
  weekDay: {
    name: string;
    shortName: string;
    index: number;
    number: number;
  };
}

export interface ITransactions {
  id: string;
  amount: number;
  account: string;
  counterParty: string;
  category: string;
  date: IDate;
}

export type AccountAndTransations = IAccounts & ITransactions;

export interface IOlympicData {
  athlete: string;
  age: number;
  country: string;
  year: number;
  date: string;
  sport: string;
  gold: number;
  silver: number;
  bronze: number;
  total: number;
  id: string;
}
