import { createPortal } from "react-dom";
import editAccount from "../../assets/edit-account.svg";
import plusAccount from "../../assets/plus-account.svg";
import plus from "../../assets/plus-gray.svg";
import Button from "../buttons/Button";
import CreateAccount from "../modalWindow/CreateAccount";
import { useAppDispatch } from "../../hooks/useReduxTypedHooks";
import { openModal } from "../../redux/slices/StateAndData";
import { IAccounts } from "../../types/indexTypes";
import EditAccount from "../modalWindow/EditAccount";
import useMainCurrency from "../../hooks/useMainCurrency";
import { useGetAccountQuery } from "../../api/rtk-query/accountRequest";
import { truncateDecimal } from "../../utility/truncateDecimal";
import Tooltip from "../contentComponents/Tooltip";
import { useState } from "react";

const AppSider = () => {
  //* Хук useState обновляется Асинхронно
  const [id, setId] = useState<{ colId?: string; boxId: string } | null>(null);
  const { data: accountsData, isSuccess } = useGetAccountQuery("accounts");
  const mainCurrency = useMainCurrency();
  const dispatch = useAppDispatch();

  return (
    <aside className=" col-start-1 col-end-4 bg-[#edf4f7] rounded-tl-3xl">
      <article className="w-64 mx-auto">
        <div className="flex justify-between flex-col mt-[22px] ">
          <span className="mb-1 text-sm text-gray-500">Всего на счетах</span>
          <div className="text-3xl font-bold flex gap-1.5">
            <span>{mainCurrency}</span>
            <span>
              {accountsData ? (
                <div className="relative">
                  <Tooltip
                    number={accountsData.reduce(
                      (acc, item) => acc + item.allAmount,
                      0,
                    )}
                    isActive={id?.boxId === "allAmounts"}
                    className="absolute top-12 right-12"
                  />
                  <span
                    onMouseEnter={() => setId({ boxId: "allAmounts" })}
                    onMouseLeave={() => setId(null)}
                  >
                    {truncateDecimal(
                      accountsData.reduce(
                        (acc, item) => acc + item.allAmount,
                        0,
                      ),
                    )}
                  </span>
                </div>
              ) : (
                0
              )}
            </span>
          </div>
        </div>
        <hr className="border-gray-400  mt-5" />
        <div>
          <ul className="[&>*]:flex [&>*]:justify-between mt-[18px] ">
            <li className="mb-6 font-bold text-sm">
              <div>Мои счета</div>
              <div className="flex gap-x-2">
                <img
                  src={plusAccount}
                  className="cursor-pointer"
                  onClick={() => dispatch(openModal(["createAccount", true]))}
                />
                <img
                  src={editAccount}
                  className="cursor-pointer"
                  onClick={() => dispatch(openModal(["editAccount", true]))}
                />
              </div>
            </li>

            <div className="flex-col [&>li]:flex  [&>li]:justify-between [&]:gap-y-5 text-sm text-gray-500">
              {isSuccess
                ? accountsData.map((account: IAccounts) => (
                    <li key={account.id}>
                      <span>{account.account}</span>
                      <div
                        onMouseEnter={() =>
                          setId({ boxId: account.account, colId: account.id })
                        }
                        onMouseLeave={() => setId(null)}
                        className="relative flex gap-1"
                      >
                        <span>{mainCurrency}</span>
                        <span>{truncateDecimal(account.allAmount)}</span>
                        <Tooltip
                          number={account.allAmount}
                          className={"absolute bottom-10 left-0"}
                          isActive={
                            id?.boxId === account.account &&
                            id?.colId === account.id
                          }
                        />
                      </div>
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
      </article>
      {createPortal(<CreateAccount />, document.body)}
      {createPortal(<EditAccount />, document.body)}
    </aside>
  );
};

export default AppSider;
