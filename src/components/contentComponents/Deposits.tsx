import { useAppDispatch } from "../../hooks/useReduxTypedHooks";
import {
  openModal,
  setDepositId,
  setPlanID,
} from "../../redux/slices/StateAndData";
import { createPortal } from "react-dom";
import { useCapitalize } from "../../hooks/useCapitalize";
import { ChangeEvent, useState } from "react";
import loadingIcon from "../../assets/cash-icon.gif";
import {
  useDeleteDepositMutation,
  useGetDepositsQuery,
} from "../../api/rtk-query/depositsRequest";
import CreateDeposit from "../modalWindow/CreateDeposit";
import Button from "../buttons/Button";

const Deposits = () => {
  const { data: deposits } = useGetDepositsQuery();
  const [deleteDeposit] = useDeleteDepositMutation();
  const [selectedPlans, setSelectedPlans] = useState<{
    [key: string]: boolean;
  }>({});
  const [rowsId, setRowsId] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  const { toLowerCase } = useCapitalize();
  console.log("RowsID: ", rowsId);
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

  const handleClickDelete = () => {
    deleteDeposit(rowsId);
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

  const truncateDecimal = (num: number, decimalPlaces: number) => {
    const factor = Math.pow(10, decimalPlaces);
    return Math.trunc(num * factor) / factor;
  };

  const handleAddDeposit = () => {
    dispatch(setDepositId([]));
    dispatch(openModal(["createDeposit", true]));
  };

  return (
    <div className=" rounded-lg  w-full max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex justify-between w-full">
          <h2 className="text-xl font-semibold">Deposits</h2>
          <Button
            submitHandler={handleAddDeposit}
            className="px-3 py-2 cursor-pointer rounded-xl bg-green-600 text-white font-medium"
          >
            Добавить
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
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
        <div className="w-full  rounded-lg ">
          <div className="flex py-2 text-center border-b-gray-400 border-b text-gray-500">
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
                className="flex border-b-gray-400 border-b items-center hover:bg-[#edf4f7] cursor-pointer "
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
                    <div className="w-1/5 text-green-600">
                      {deposit.investment}{" "}
                      <span className="text-gray-500">{deposit.currency}</span>
                    </div>
                    <div className=" w-1/5 text-green-600  flex flex-col">
                      <span>
                        +
                        {truncateDecimal(
                          (deposit.investment * deposit.annualInterest) /
                            100 /
                            12,
                          2
                        )}
                      </span>
                      <span
                        className="text-gray-500"
                        title={`${deposit.annualInterest / 12}`}
                      >
                        {truncateDecimal(deposit.annualInterest / 12, 1)}%
                      </span>
                    </div>
                    <div className=" flex flex-col w-1/5 text-green-600 ">
                      <span>
                        +
                        {truncateDecimal(
                          (deposit.investment * deposit.annualInterest) / 100,
                          2
                        )}
                      </span>
                      <span className="text-gray-500">
                        {truncateDecimal(deposit.annualInterest, 1)}%
                      </span>
                    </div>
                    <div className=" w-1/5 text-red-600  flex flex-col">
                      <span>
                        -
                        {truncateDecimal(
                          (((deposit.investment * deposit.annualInterest) /
                            100) *
                            deposit.taxes) /
                            100,
                          2
                        )}
                      </span>
                      <span className="text-gray-500">
                        {truncateDecimal(deposit.taxes, 1)}%
                      </span>
                    </div>
                    <div className="w-1/5 text-green-600">
                      +
                      {truncateDecimal(
                        (deposit.investment * deposit.annualInterest) / 100 -
                          (((deposit.investment * deposit.annualInterest) /
                            100) *
                            deposit.taxes) /
                            100,
                        2
                      )}
                    </div>
                    <div className=" w-1/5">{deposit.category}</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <img src={loadingIcon} className="mx-auto" />
          )}
        </div>
      </div>
      {createPortal(<CreateDeposit />, document.body)}
    </div>
  );
};

export default Deposits;
