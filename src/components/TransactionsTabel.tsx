import {
  useGetAccountQuery,
  useGetSumQuery,
} from "../api/rtk-query/insertToDataBase";
import { ITransactions } from "../types/types";
import cashIcon from "../assets/cash-icon.gif";
import { useCapitalize } from "../hooks/useCapitalize";
import { useAppDispatch } from "../hooks/useReduxTypedHooks";
import { openModal, setTransactionId } from "../redux/slices/StateAndData";
import { useDeleteTransactionMutation } from "../api/rtk-query/deleteData";
import { useState } from "react";
import GridExample from "./AgGrids";

const TransactionsTabel = () => {
  const [isId, setIsId] = useState<string[]>([]);
  const [count, setCount] = useState<number>(0);
  const {
    data: transactions,
    isFetching,
    isSuccess: tranisSuccess,
    refetch: tranRefetch,
  } = useGetSumQuery("transactions");
  const { refetch: accountRefetch, isSuccess: accountisSuccess } =
    useGetAccountQuery("accounts");
  const { toLowerCase, toUpperCase } = useCapitalize();
  const [deleteTransaction] = useDeleteTransactionMutation();
  const dispatch = useAppDispatch();
  const editTable = (id: string) => {
    dispatch(setTransactionId(id));
    dispatch(openModal(["income", true]));
  };

  const onCheckRow = (event, id: string) => {
    event.stopPropagation();
    setIsId((prev) => {
      const newState = prev.includes(id)
        ? prev.filter((elem) => elem !== id)
        : [...prev, id];
      return newState;
    });
    setCount((prev) => (event.target.checked ? prev + 1 : prev - 1));
    console.log("Row is checked!", "id: ", id);
    console.log("Count: ", count);
    console.log("Ids: ", isId);
  };

  const deleteTran = () => {
    deleteTransaction(isId);
  };

  const refetchData = async () => {
    await tranRefetch();
    accountRefetch();
  };

  return (
    <article className="">
      {/* {isFetching ? (
        <img src={cashIcon} className="mx-auto" />
      ) : !tranisSuccess || !accountisSuccess ? (
        <div className="grid place-content-center">
          <span>Ошибка запроса</span>
          <div onClick={() => refetchData()} className="bg-green-400">
            Повторите попытку
          </div>
        </div>
      ) : (
        <section>
          <div>
            {count !== 0 && (
              <div className="bg-[#00b28e] py-2 font-bold text-xs text-white flex justify-between">
                <div>
                  {count <= 1 && (
                    <span onClick={() => dispatch(openModal(["income", true]))}>
                      Изменить данные,
                    </span>
                  )}
                  <span onClick={() => deleteTran()}>Удалить, </span>
                </div>
                <span>Доход * {count}платежа * Сумма, валюта</span>
              </div>
            )}
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">
                  <input type="checkbox" className="h-5 w-5" />
                </th>
                <th className="p-2 text-left">
                  {count !== 0 ? (
                    <div onClick={() => deleteTran()}>
                      <span>Удалить,</span>
                      {count <= 1 && (
                        <span
                          onClick={() => dispatch(openModal(["income", true]))}
                        >
                          Изменить данные,
                        </span>
                      )}
                    </div>
                  ) : (
                    <span>Дата</span>
                  )}
                </th>
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
      )} */}
      <GridExample />
    </article>
  );
};

export default TransactionsTabel;
