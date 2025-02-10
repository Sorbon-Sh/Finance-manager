import {
  useGetAccountQuery,
  useGetSumQuery,
} from "../api/rtk-query/insertToDataBase";

import { ITransactions } from "../types/types";

const TransactionsTabel = () => {
  const { data: transactions } = useGetSumQuery("transactions");
  const { data: accounts } = useGetAccountQuery();

  const allAmount = (check: string) => {
    if (!accounts) return;
    return accounts
      .filter((acc) => (acc.account === check ? acc.allAmount : 0))
      .map((amount) => amount.allAmount);
  };

  return (
    <article>
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
          {/* <tr className="border-b">
            <td className="p-2">
              <input type="checkbox" className="h-5 w-5" />
            </td>
            <td className="p-2">
              <div>25 янв. 2025</div>
              <div className="text-gray-500">10:51</div>
            </td>
            <td className="p-2 text-green-500">+100 TJS</td>
            <td className="p-2">
              <div>Crypto</div>
              <div className="text-gray-500">200 TJS</div>
            </td>
            <td className="p-2">bank</td>
            <td className="p-2">Инвестиции</td>
          </tr> */}
          {transactions &&
            transactions.map((transaction: ITransactions) => (
              <tr className="border-b" key={transaction.id}>
                <td className="p-2">
                  <input type="checkbox" className="h-5 w-5" />
                </td>
                <td className="p-2">
                  <div>25 янв. 2025</div>
                  <div className="text-gray-500">10:51</div>
                </td>
                <td className="p-2 text-green-500">+100 TJS</td>
                <td className="p-2">
                  {/* <div>{account?.filter((acc) => acc)}</div> */}
                  <div>{transaction.account}</div>
                  <div className="text-gray-500">
                    {allAmount(transaction.account)}
                    TJS
                  </div>
                </td>
                <td className="p-2">bank</td>
                <td className="p-2">Инвестиции</td>
              </tr>
            ))}
          {/* <tr className="border-b">
            <td className="p-2">
              <input type="checkbox" className="h-5 w-5" />
            </td>
            <td className="p-2">
              <div>23 янв. 2025</div>
              <div className="text-gray-500">19:24</div>
            </td>
            <td className="p-2 text-green-500">+1 093.62 TJS</td>
            <td className="p-2">
              <div>Bank account</div>
              <div className="text-gray-500">1 093.62 TJS</div>
            </td>
            <td className="p-2">bank</td>
            <td className="p-2">Инвестиции</td>
          </tr> */}
        </tbody>
      </table>
    </article>
  );
};

export default TransactionsTabel;
