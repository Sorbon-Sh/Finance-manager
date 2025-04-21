type IModalKeys = Record<string, unknown>;

type initData = {
  accountId: string;
  choosedAccount: string[];
  transationAccount: string;
  transactionId: string;
  planId: string;
  planTranId: string;
  depositId: string;
};

export interface ICurrencySlices {
  currencyTable: boolean;
  currency: {
    namekurs: string;
    namebank: string;
    kurs: string;
    comments: string;
  };
}

export type initTypes = initData & IModalKeys;
