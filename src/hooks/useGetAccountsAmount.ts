import { useGetAccountQuery } from "../api/rtk-query/insertToDataBase";

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

  // const accountAmountSliced = (
  //   accounts: IAccounts[] | undefined,
  //   amounts: AccountAmountOnly[] | undefined
  // ) => {
  //   if (accounts && amounts) {
  //     const result = [];
  //     for (const account of accounts) {
  //       for (const amount of amounts) {
  //         if (account.id === amount.id) {
  //           result.push({
  //             id: account.id,
  //             account: account.account,
  //             amount: amount.allAmount,
  //           });
  //         }
  //       }
  //     }

  //     return result;
  //   }
  // };
  return { allAmount };
};
