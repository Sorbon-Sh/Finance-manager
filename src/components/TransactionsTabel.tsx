import { useGetSumQuery } from "../api/rtk-query/insertToDataBase";
import { ITransactions } from "../types/types";
import cashIcon from "../assets/cash-icon.gif";
import { useCapitalize } from "../hooks/useCapitalize";
import { useAppDispatch } from "../hooks/useReduxTypedHooks";
import { setTransactionAccount } from "../redux/slices/StateAndData";

const TransactionsTabel = () => {
  const {
    data: transactions,
    isFetching,
    isSuccess,
  } = useGetSumQuery("transactions");
  const { toLowerCase, toUpperCase } = useCapitalize();
  const dispatch = useAppDispatch();
  return (
    <article className="">
      {isFetching ? (
        <img src={cashIcon} className="mx-auto" />
      ) : !isSuccess ? (
        <div>{"Ошибка запроса"}</div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">
                <input type="checkbox" className="h-5 w-5" />
              </th>
              <th className="p-2 text-left">Дата</th>
              <th className="p-2 text-left">Сумма</th>
              <th className="p-2 text-left">Счет</th>
              <th className="p-2 text-left">Контрагент</th>
              <th className="p-2 text-left">Категория</th>
            </tr>
          </thead>
          <tbody>
            {transactions &&
              transactions.map((transaction: ITransactions) => (
                <tr
                  className="border-b"
                  key={transaction.id}
                  onClick={() =>
                    dispatch(setTransactionAccount(transaction.account))
                  }
                >
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
