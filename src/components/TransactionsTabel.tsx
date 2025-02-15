import {
  useGetAccountQuery,
  useGetSumQuery,
} from "../api/rtk-query/insertToDataBase";
import { ITransactions } from "../types/types";
import cashIcon from "../assets/cash-icon.gif";
import { useGetAccountsAmount } from "../hooks/useGetAccountsAmount";
import { useCapitalize } from "../hooks/useCapitalize";

const TransactionsTabel = () => {
  const { data: transactions, isFetching } = useGetSumQuery("transactions");
  const { allAmount } = useGetAccountsAmount();

  const { toLowerCase, toUpperCase } = useCapitalize();

  //! Проблема с задержкой загрузки данных!
  const accountAmount = (accountName: string) => {
    //? Записать такой метод Деструктуризации
    const [data] = allAmount(accountName);

    return data;
  };
  return (
    <article className="">
      {isFetching ? (
        <img src={cashIcon} className="mx-auto" />
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">
                <input type="checkbox" className="h-5 w-5" />
              </th>
              <th className="p-2 text-left">Дата</th>
              <th className="p-2 text-left">Сумма</th>
              <th className="p-2 text-left">Счет/остаток</th>
              <th className="p-2 text-left">Контрагент</th>
              <th className="p-2 text-left">Категория</th>
            </tr>
          </thead>
          <tbody>
            {transactions &&
              transactions.map((transaction: ITransactions) => (
                <tr className="border-b" key={transaction.id}>
                  <td className="p-2">
                    <input type="checkbox" className="h-5 w-5" />
                  </td>
                  <td className="p-2">
                    <div>
                      {transaction.date.day}{" "}
                      {toLowerCase(transaction.date.month.shortName)}.{" "}
                      {transaction.date.year}
                    </div>
                    <div className="text-gray-500">
                      {transaction.date.weekDay.shortName},
                      {transaction.date.hour}:{transaction.date.minute}
                    </div>
                  </td>
                  <td className="p-2 text-green-500">
                    +{transaction.amount}TJS
                  </td>
                  <td className="p-2">
                    <div>{transaction.account}</div>
                    <div className="text-gray-500">
                      {accountAmount(transaction.account).amount}{" "}
                      {accountAmount(transaction.account).currency}
                    </div>
                  </td>
                  <td className="p-2">
                    {toUpperCase(transaction.counterParty)}
                  </td>
                  <td className="p-2">{toUpperCase(transaction.category)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </article>
  );
};

export default TransactionsTabel;
