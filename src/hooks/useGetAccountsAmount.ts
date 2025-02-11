import { useGetAccountQuery } from "../api/rtk-query/insertToDataBase";

export const useGetAccountsAmount = () => {
  const { data: accounts } = useGetAccountQuery();

  const allAmount = (check: string) => {
    if (!accounts) return;
    return accounts
      .filter((acc) => (acc.account === check ? acc.allAmount : 0))
      .map((amount) => amount.allAmount);
  };
  return allAmount;
};
