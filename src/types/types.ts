export interface Inputs {
  account: string;
  amount: number;
  allAmount: number;
  category: string;
  counterParty: string;
  date: string;
}

export interface IAccounts {
  id: string;
  account: string;
  allAmount: number;
}

interface IDate {
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
