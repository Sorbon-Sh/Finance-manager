import { createPortal } from "react-dom";
import {
  useGetAccountQuery,
  useGetCompanyDataQuery,
} from "../../api/rtk-query/insertToDataBase";
import editAccount from "../../assets/edit-account.svg";
import plus from "../../assets/plus-gray.svg";
import Button from "../buttons/Button";
import CreateAccount from "../modalWindow/CreateAccount";
import { useAppDispatch } from "../../hooks/useReduxTypedHooks";
import { openModal } from "../../redux/slices/StateAndData";
import { IAccounts } from "../../types/types";
import EditAccount from "../modalWindow/EditAccount";
import { useState } from "react";

const AppSider = () => {
  //* Хук useState обновляется Асинхронно
  const { data: company } = useGetCompanyDataQuery("company");
  const [clicked, setClicked] = useState<string>();
  const { data: accountsData, isSuccess } = useGetAccountQuery("accounts");
  const dispatch = useAppDispatch();
  const handleClickAccount = (account: string) => {
    setClicked(account);
  };

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
                      onClick={() => handleClickAccount(account.account)}
                    >
                      <span>{account.account}</span>
                      <span>
                        {account.currency} {account.allAmount}
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
