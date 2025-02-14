import { useGetAccountQuery } from "../api/rtk-query/insertToDataBase";
import { AccountAmountOnly, IAccounts } from "../types/types";

export const useGetAccountsAmount = () => {
  const { data: accounts } = useGetAccountQuery();

  const allAmount = (check: string) => {
    if (!accounts) return;
    return accounts
      .filter((acc) => (acc.account === check ? acc.allAmount : 0))
      .map((amount) => amount.allAmount);
  };

  const accountAmountSliced = (
    accounts: IAccounts[] | undefined,
    amounts: AccountAmountOnly[] | undefined
  ) => {
    if (accounts && amounts) {
      const result = [];
      for (const account of accounts) {
        for (const amount of amounts) {
          if (account.id === amount.id) {
            result.push({
              id: account.id,
              account: account.account,
              amount: amount.allAmount,
            });
          }
        }
      }

      return result;
    }
  };
  return { allAmount, accountAmountSliced };
};
