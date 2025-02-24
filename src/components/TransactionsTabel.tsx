import {
  useGetAccountQuery,
  useGetSumQuery,
} from "../api/rtk-query/insertToDataBase";
import { ITransactions } from "../types/types";
import cashIcon from "../assets/cash-icon.gif";
import { useCapitalize } from "../hooks/useCapitalize";
import { useAppDispatch } from "../hooks/useReduxTypedHooks";
import { openModal, setTransactionId } from "../redux/slices/StateAndData";
import deleteTransaction from "../api/rtk-query/deleteData";
import { useState } from "react";

const TransactionsTabel = () => {
  const [isId, setIsId] = useState<string>("");
  const [count, setCount] = useState<number>(0);
  const {
    data: transactions,
    isFetching,
    isSuccess,
  } = useGetSumQuery("transactions");
  const account = useGetAccountQuery("accounts");
  const { toLowerCase, toUpperCase } = useCapitalize();
  const dispatch = useAppDispatch();
  const editTable = (id: string) => {
    dispatch(setTransactionId(id));
    dispatch(openModal(["income", true]));
  };

  const onCheckRow = (event, id: string) => {
    event.stopPropagation();
    setCount((prev) => (event.target.checked ? prev + 1 : prev - 1));
    console.log("Row is checked!", "id: ", id);
    console.log("Count: ", count);
  };

  return (
    <article className="">
      {isFetching ? (
        <img src={cashIcon} className="mx-auto" />
      ) : !isSuccess ? (
        <div>{"Ошибка запроса"}</div>
      ) : (
        <section>
          <div>
            {count !== 0 && (
              <div
                onClick={() => deleteTransaction(isId)}
                className="bg-green-300 p-2 font-bold"
              >
                {count <= 1 && <span>Изменить,</span>}
                <span>Удалить, </span>
                <span>Выбрано {count},</span>
              </div>
            )}
          </div>
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
                    className="border-b cursor-pointer hover:bg-gray-100"
                    key={transaction.id}
                    onClick={() => editTable(transaction.id)}
                  >
                    <td className="p-2">
                      <input
                        type="checkbox"
                        className="h-5 w-5"
                        onClick={(event) => onCheckRow(event, transaction.id)}
                      />
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
        </section>
      )}
    </article>
  );
};

export default TransactionsTabel;
