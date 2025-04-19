import { useGetAccountQuery } from "../api/rtk-query/accountRequest";

export const useGetAccountsAmount = () => {
  const { data: accounts } = useGetAccountQuery("accounts");

  const allAmount = (check: string) => {
    try {
      //* Возврашаем пустой массив если undefined для безопасности в TypeScript
      if (!accounts) return [];

      return accounts
        .filter((acc) => acc.account === check)
        .map((amount) => {
          return {
            amount: amount.allAmount,
            currency: amount.currency,
          };
        });
    } catch (err) {
      console.log(err);

      throw new Error("Error fetch account amount");
    }
  };

  return { allAmount };
};
