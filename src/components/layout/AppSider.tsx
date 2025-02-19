import { createPortal } from "react-dom";
import {
  useGetAccountQuery,
  useGetCompanyDataQuery,
  useGetSumQuery,
} from "../../api/rtk-query/insertToDataBase";
import editAccount from "../../assets/edit-account.svg";
import plus from "../../assets/plus-gray.svg";
import Button from "../buttons/Button";
import CreateAccount from "../modalWindow/CreateAccount";
import { useAppDispatch, useAppSelector } from "../../hooks/useReduxTypedHooks";
import { openModal, setAccountAmount } from "../../redux/slices/StateAndData";
import { IAccounts } from "../../types/types";
import EditAccount from "../modalWindow/EditAccount";
import { useEffect, useState } from "react";
import { useUpdateAmountAccountMutation } from "../../api/rtk-query/updateData";

const AppSider = () => {
  type TranSummary = {
    [key: string]: number;
  };

  const { data: company } = useGetCompanyDataQuery("company");
  const [clicked, setClicked] = useState<string>();
  const {
    data: accountsData,
    isSuccess,
    refetch: accountRefetch,
  } = useGetAccountQuery("accounts");
  const dispatch = useAppDispatch();
  const [updateAmountAccount] = useUpdateAmountAccountMutation();
  const incomeButton = useAppSelector(
    (state) => state.stateAndData.incomeButton
  );
  const transactionAccount = useAppSelector(
    (state) => state.stateAndData.transactionAccount
  );

  console.log("Tran Account: ", transactionAccount);

  const selectAccount = (id: string) => {
    setClicked(id);
  };

  //*==================================================================
  const { data: transactions, refetch } = useGetSumQuery("transactions");
  // const reduceAmount = (accountData: IAccounts[]) => {
  //   if (!amountData || amountData.length === 0)
  //     return accountData.map((acc) => ({ ...acc, allAmount: 0 }));

  //   // Группируем транзакции по аккаунту и суммируем
  //   const transactionsSummary: TranSummary = amountData.reduce((acc, tran) => {
  //     acc[tran.account] = (acc[tran.account] || 0) + tran.amount;
  //     return acc;
  //   }, {} as TranSummary);

  //   // Обновляем аккаунты с новыми суммами
  //   return accountData.map((acc) => ({
  //     ...acc,
  //     allAmount: acc.allAmount + (transactionsSummary[acc.account] || 0),
  //   }));
  // };

  //*=============================================================================
  // * Триггер для запуска функции
  const reduceAmount = (accountData) => {
    const account: IAccounts[] = [accountData];
    if (!transactions) return account.map((acc) => ({ ...acc, allAmount: 0 }));

    // Найти последние транзакции для каждого аккаунта
    const lastTransactions: Record<string, any> = {};

    transactions.forEach((tran) => {
      lastTransactions[tran.account] = tran; // Перезаписываем, остаётся последняя запись
    });

    // Группируем суммы только последних транзакций
    const transactionsSummary: TranSummary = Object.values(
      lastTransactions
    ).reduce((acc, tran) => {
      acc[tran.account] = (acc[tran.account] || 0) + tran.amount;
      return acc;
    }, {} as TranSummary);

    // Обновляем аккаунты с новыми суммами
    const data = account.map((acc) => ({
      ...acc,
      allAmount: (acc.allAmount || 0) + (transactionsSummary[acc.account] || 0),
    }));

    return data;
  };

  const updatedAccounts =
    accountsData &&
    accountsData.flatMap((account) => reduceAmount(account, transactions));
  // console.log("Data Update: ", updatedAccounts);

  useEffect(() => {
    const send = async () => {
      if (isSuccess) {
        await refetch();
        await accountRefetch();
        // Собираем все amounts в один массив
        const allAmounts = () => {
          return updatedAccounts
            ? updatedAccounts.filter(
                (elem) => elem.account === transactionAccount
              )
            : null;
        };

        const data = allAmounts();
        console.log("allAmounts", data && data.map((elem) => elem.allAmount));

        // console.log("Data: ", data);

        await updateAmountAccount(data);
      }
    };
    send();
  }, [incomeButton]);

  return (
    <aside className=" col-start-1 col-end-4 bg-[#edf4f7] rounded-tl-3xl">
      <article className="w-64 mx-auto">
        <div className="flex justify-between flex-col mt-[22px] ">
          <span className="mb-1 text-sm text-gray-500">Всего на счетах </span>
          {company
            ? company.map((company) => (
                <span className="text-3xl font-bold" key={company.id}>
                  {company.currency} {company.allAmount}
                </span>
              ))
            : 0}
        </div>
        <hr className="border-gray-400  mt-5" />
        <div>
          <ul className="[&>*]:flex [&>*]:justify-between mt-[18px] ">
            <li className="mb-6 font-bold text-sm">
              <div>Мои счета</div>
              <div>
                <img
                  src={editAccount}
                  className="cursor-pointer"
                  onClick={() => dispatch(openModal(["editAccount", true]))}
                />
              </div>
            </li>

            <div className="flex-col [&>li]:flex [&>li]:cursor-pointer [&>li]:justify-between [&]:gap-y-5 text-sm text-gray-500">
              {isSuccess
                ? accountsData.map((account: IAccounts) => (
                    <li
                      key={account.id}
                      className={`${
                        clicked === account.id &&
                        "border-l-2 border-l-green-400"
                      }`}
                      onClick={() => selectAccount(account.id)}
                    >
                      <span>{account.account}</span>
                      <span>
                        {account.currency}{" "}
                        {reduceAmount(account).map((elem) => elem.allAmount)}
                        .0
                      </span>
                    </li>
                  ))
                : "No accounts found"}
            </div>
          </ul>
          <Button
            submitHandler={() => dispatch(openModal(["createAccount", true]))}
            className="text-sm text-gray-500 border-dotted border-1 rounded-sm cursor-pointer  py-3 w-full flex items-center justify-center mt-5 "
          >
            <img src={plus} className="mr-2" />
            <span>Добавить интеграцию</span>
          </Button>
        </div>
        <hr className=" bg-gray-400 mt-5 border-gray-400" />
        <div className="mt-5 text-sm text-gray-500">
          Здесь будут отображаться <br /> платежи с датой в будущем 👇
        </div>
      </article>
      {createPortal(<CreateAccount />, document.body)}
      {createPortal(<EditAccount />, document.body)}
    </aside>
  );
};

export default AppSider;
