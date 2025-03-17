type IModalKeys = Record<string, unknown>;

type initData = {
  accountId: string;
  choosedAccount: string[];
  transationAccount: string;
  transactionId: string;
  incomeButton: boolean;
  planId: string;
  planTranId: string;
  depositId: string[];
};

export type initTypes = initData & IModalKeys;
