import { useAppDispatch } from "../../hooks/useReduxTypedHooks";
import {
  openModal,
  setDepositId,
  setPlanID,
} from "../../redux/slices/StateAndData";
import { createPortal } from "react-dom";
import { useCapitalize } from "../../hooks/useCapitalize";
import { ChangeEvent, useState } from "react";
import {
  useDeleteDepositMutation,
  useGetDepositsQuery,
} from "../../api/rtk-query/depositsRequest";
import CreateDeposit from "../modalWindow/CreateDeposit";
import Button from "../buttons/Button";
import { truncateDecimal } from "../../utility/truncateDecimal";
import { Loading } from "../Loading";
import useMainCurrency from "../../hooks/useMainCurrency";
import { NoTransactions } from "../NoTransactions";
import Tooltip from "./Tooltip";
import { toast } from "react-toastify";

const Deposits = () => {
  const [id, setId] = useState<{ colId: string; boxId: string } | null>(null);
  const mainCurrency = useMainCurrency();
  const { data: deposits, error, refetch } = useGetDepositsQuery();
  const [deleteDeposit] = useDeleteDepositMutation();
  const [selectedPlans, setSelectedPlans] = useState<{
    [key: string]: boolean;
  }>({});
  const [rowsId, setRowsId] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  const { toLowerCase } = useCapitalize();
  const handleClickSelect = (id: string) => {
    dispatch(setPlanID(id));
    setRowsId((prev) => {
      const rowsId = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      return rowsId;
    });
    setSelectedPlans((prev) => {
      const newState = { ...prev, [id]: !prev[id] };

      return newState;
    });
  };

  const handleSelectAll = (event: ChangeEvent<HTMLInputElement>) => {
    const isSelected = event.target.checked;

    //* Создаем новый объект для состояний всех планов
    const newSelectedPlans: Record<string, boolean> = {};

    //* Создаем новый массив для ID выбранных строк
    const newRowsId: string[] = [];

    //* Устанавливаем все планы в одинаковое состояние
    deposits?.forEach((deposit) => {
      newSelectedPlans[deposit.id] = isSelected;

      //* Если нужно выбрать все, добавляем ID в массив
      if (isSelected) {
        newRowsId.push(deposit.id);
      }
    });

    //* Обновляем состояние выбранных планов
    setSelectedPlans(newSelectedPlans);

    //* Обновляем массив ID выбранных строк
    setRowsId(newRowsId);
  };

  const handleClickDelete = async () => {
    const toastId = toast.loading("Удаление данных...");
    await deleteDeposit(rowsId);
    toast.update(toastId, {
      render: "Депозит успешно удален!",
      type: "success",
      isLoading: false,
      autoClose: 2000,
    });
    setRowsId([]);
  };

  const handleClickCheckBox = () => {
    dispatch(setDepositId(rowsId));
    dispatch(openModal(["createDeposit", true]));
  };

  const handleClickRow = (id: string[]) => {
    dispatch(setDepositId(id));
    dispatch(openModal(["createDeposit", true]));
  };

  const handleAddDeposit = () => {
    dispatch(setDepositId([]));
    dispatch(openModal(["createDeposit", true]));
  };

  return (
    <div className=" rounded-lg  w-full max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex justify-between w-full">
          <h2 className="text-xl font-semibold">Депозиты</h2>
          <Button
            submitHandler={handleAddDeposit}
            className="px-3 py-2 cursor-pointer rounded-xl bg-green-500 text-white font-medium"
          >
            Добавить
          </Button>
        </div>
      </div>
      <div
        className={`bg-[#00b28e] w-full px-5  ease-in-out transition-all duration-700 ${
          rowsId.length !== 0 ? "h-9" : "h-0"
        } font-bold text-[15px] text-slate-100 flex justify-between  items-center rounded-xl`}
      >
        <span
          onClick={handleClickDelete}
          className={`cursor-pointer  ${
            rowsId.length !== 0 ? "visible" : "hidden"
          } hover:bg-slate-50/30 px-2 py-1 rounded-xl`}
        >
          Удалить запись
        </span>
        {rowsId.length <= 1 && (
          <span
            onClick={handleClickCheckBox}
            className={`cursor-pointer ${
              rowsId.length !== 0 ? "visible" : "hidden"
            } hover:bg-slate-50/30 px-2 py-1 rounded-xl`}
          >
            Изменить
          </span>
        )}
      </div>
      <div className="max-h-[500px] overflow-y-auto">
        <div className="min-w-full  rounded-lg ">
          <div className="flex  py-2 text-center border-b-gray-400 border-b text-gray-500">
            <input
              type="checkbox"
              className="size-7 mx-4 "
              onChange={(event) => handleSelectAll(event)}
            />
            <span className="w-1/5 font-semibold">Дата</span>
            <span className="w-1/5 font-semibold">Инвеститция</span>
            <span className="w-1/5 font-semibold">В месяц</span>
            <span className="w-1/5 font-semibold">В год</span>
            <span className="w-1/5 font-semibold">Налог</span>
            <span className="w-1/5 font-semibold">Всего</span>
            <span className="w-1/5 font-semibold">Категория</span>
          </div>
          {deposits ? (
            deposits.map((deposit) => (
              <div
                key={deposit.id}
                className="flex border-b-gray-400 border-b items-center  hover:bg-[#edf4f7] cursor-pointer "
              >
                <input
                  type="checkbox"
                  className="size-5 mx-4"
                  checked={selectedPlans[deposit.id] || false}
                  onChange={() => handleClickSelect(deposit.id)}
                />
                <div
                  className="w-full text-center"
                  onClick={() => handleClickRow([deposit.id])}
                >
                  <div className="flex items-center h-[70px] ">
                    <div className="w-1/5">
                      <div>
                        {deposit.date.day}.
                        {toLowerCase(deposit.date.month.shortName)}.
                        {deposit.date.year}
                      </div>
                      <div className="text-gray-500 ">
                        {deposit.date.weekDay.shortName} {deposit.date.hour}:
                        {deposit.date.minute}
                      </div>
                    </div>
                    <div className="w-1/5 text-green-600 relative">
                      <Tooltip
                        number={deposit.investment}
                        className={"  left-15 top-7"}
                        isActive={
                          id?.boxId === "Investment" && id?.colId === deposit.id
                        }
                      />
                      <span
                        onMouseEnter={() =>
                          setId({ colId: deposit.id, boxId: "Investment" })
                        }
                        onMouseLeave={() => setId(null)}
                      >
                        {truncateDecimal(deposit.investment)}
                      </span>{" "}
                      <span className="text-gray-500">{mainCurrency}</span>
                    </div>
                    <div className=" w-1/5 text-green-600 relative  flex flex-col">
                      <Tooltip
                        number={
                          (deposit.investment * deposit.annualInterest) /
                          100 /
                          12
                        }
                        className={" left-15 top-7"}
                        isActive={
                          id?.boxId === "mounthly" && id?.colId === deposit.id
                        }
                      />
                      <span
                        onMouseEnter={() =>
                          setId({ colId: deposit.id, boxId: "mounthly" })
                        }
                        onMouseLeave={() => setId(null)}
                        className="w-fit mx-auto"
                      >
                        {`+${truncateDecimal(
                          (deposit.investment * deposit.annualInterest) /
                            100 /
                            12,
                        )}`}
                      </span>
                    </div>
                    <div className=" flex flex-col relative w-1/5 text-green-600 ">
                      <Tooltip
                        number={
                          (deposit.investment * deposit.annualInterest) / 100
                        }
                        className={" left-15 top-7"}
                        isActive={
                          id?.boxId === "annualInterest" &&
                          id?.colId === deposit.id
                        }
                      />
                      <span
                        onMouseEnter={() =>
                          setId({ colId: deposit.id, boxId: "annualInterest" })
                        }
                        onMouseLeave={() => setId(null)}
                        className="w-fit mx-auto"
                      >
                        {`+${truncateDecimal(
                          (deposit.investment * deposit.annualInterest) / 100,
                        )}`}
                      </span>
                    </div>
                    <div className=" w-1/5 text-red-600 relative flex flex-col">
                      <Tooltip
                        number={
                          (((deposit.investment * deposit.annualInterest) /
                            100) *
                            deposit.taxes) /
                          100
                        }
                        className={" left-15 top-7"}
                        isActive={
                          id?.boxId === "taxesAmount" &&
                          id?.colId === deposit.id
                        }
                      />
                      <span
                        onMouseEnter={() =>
                          setId({ boxId: "taxesAmount", colId: deposit.id })
                        }
                        onMouseLeave={() => setId(null)}
                        className="w-fit mx-auto"
                      >
                        {`-${truncateDecimal(
                          (((deposit.investment * deposit.annualInterest) /
                            100) *
                            deposit.taxes) /
                            100,
                        )}`}
                      </span>
                      <span
                        title={`${deposit.taxes}%`}
                        className="text-gray-500 w-fit mx-auto"
                      >
                        {`${truncateDecimal(deposit.taxes)}%`}
                      </span>
                    </div>
                    <div className="w-1/5 relative text-green-600">
                      <Tooltip
                        number={
                          (deposit.investment * deposit.annualInterest) / 100 -
                          (((deposit.investment * deposit.annualInterest) /
                            100) *
                            deposit.taxes) /
                            100
                        }
                        className={" left-15 top-7"}
                        isActive={
                          id?.boxId === "allAmount" && id?.colId === deposit.id
                        }
                      />
                      <span
                        onMouseEnter={() =>
                          setId({ boxId: "allAmount", colId: deposit.id })
                        }
                        onMouseLeave={() => setId(null)}
                        className="w-fit mx-auto"
                      >
                        {`+${truncateDecimal(
                          (deposit.investment * deposit.annualInterest) / 100 -
                            (((deposit.investment * deposit.annualInterest) /
                              100) *
                              deposit.taxes) /
                              100,
                        )}`}
                      </span>
                    </div>
                    <div className=" w-1/5">{deposit.category}</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <Loading error={error} onReload={refetch} />
          )}
          <div className="w-full min-h-96 grid place-items-center ">
            {deposits
              ? deposits.length === 0 && (
                  <NoTransactions
                    header="Добавьте свой депозит!"
                    btnText="Добавить"
                    modal={["createDeposit", true]}
                  />
                )
              : null}
          </div>
        </div>
      </div>
      {createPortal(<CreateDeposit />, document.body)}
    </div>
  );
};

export default Deposits;
