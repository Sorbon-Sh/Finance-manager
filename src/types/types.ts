export interface Inputs {
  account: string | null;
  amount: number | null;
  allAmount: number | null;
  category: string | null;
  counterParty: string | null;
  date: string | null;
  currency: string | null;
  mainCurrency: string | null;
  companyName: string | null;
  fromAccount: string | null;
  toAccount: string | null;
  plan: string | null;
  monthlyAmount: number | null;
  annualAmount: number | null;
  annualInterest: number | null;
  maxAmount: number | null;
  investment: number | null;
  taxes: number | null;
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
  account: string & { fromAccount: string; toAccount: string };
  counterParty: string;
  category: string;
  date: IDate;
  tranCategory: string;
}

export type AccountAndTransations = IAccounts & ITransactions;

interface IOlympicData {
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

export type GridAndTransaction = IOlympicData & ITransactions;

export interface IFinPlan {
  id: string;
  plan: string;
  monthlyAmount: number;
  annualAmount: number;
  maxAmount: number;
  date: IDate;
}

export interface IFinPlanTransaction {
  id: string;
  planId: string;
  amount: number;
  fromPlan: string;
  date: IDate;
}

export interface IDeposits {
  id: string;
  date: IDate;
  investment: number;
  annualInterest: number;
  taxes: number;
  category: string;
  currency: string;
}
