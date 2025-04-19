export type CurrencyCode =
  | "USD"
  | "EUR"
  | "RUB"
  | "KZT"
  | "GBP"
  | "CNY"
  | "CHF"
  | "UZS"
  | "KGS"
  | "BYN"
  | "IRR";



export interface CurrencyRate {
  namebank: string;
  namekurs: string;
  kurs: string; 
  comments: string;
  nominal: string;
  url: string;
}

export interface SendenCurrencyData extends Record<string, unknown> {
  namekurs: string;
  namebank: string;
  kurs: string;
  comments: string;
}
