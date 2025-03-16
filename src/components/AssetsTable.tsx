import { useAppDispatch } from "../hooks/useReduxTypedHooks";
import { openModal, setPlanID } from "../redux/slices/StateAndData";
import { createPortal } from "react-dom";
import { useCapitalize } from "../hooks/useCapitalize";
import { ChangeEvent, useState } from "react";
import loadingIcon from "../assets/cash-icon.gif";
import { useGetDepositsQuery } from "../api/rtk-query/depositsRequest";
import CreateDeposit from "./modalWindow/CreateDeposit";
import Button from "./buttons/Button";

const FinPlans = () => {
  const { data: deposits } = useGetDepositsQuery();
  const [selectedPlans, setSelectedPlans] = useState<{
    [key: string]: boolean;
  }>({});
  const [rowsId, setRowsId] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  const { toLowerCase } = useCapitalize();
  console.log("ddeposits: ", deposits ? deposits : "Loading");
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
    setRowsId([]);
  };

  return (
    <div className=" rounded-lg  w-full max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex justify-between w-full">
          <h2 className="text-xl font-semibold">Deposits</h2>
          <Button
            submitHandler={() => dispatch(openModal(["createDeposit", true]))}
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
              onClick={() => dispatch(openModal(["finplan", true]))}
              className={`cursor-pointer ${
                rowsId.length !== 0 ? "visible" : "hidden"
              } hover:bg-slate-50/30 px-2 py-1 rounded-xl`}
            >
              Изменить
            </span>
          )}
        </div>
        <div className="min-w-full  rounded-lg ">
          <div className="flex py-2  border-b-gray-400 border-b text-gray-500">
            <input
              type="checkbox"
              className=" mx-4 size-5"
              onChange={(event) => handleSelectAll(event)}
            />
            <span className="w-1/6 font-semibold">Дата</span>
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
                <div className="w-full">
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
                    <div className="w-1/5 ">{deposit.investment}</div>
                    <div className=" w-1/5 text-green-600  flex flex-col">
                      <span title={`${deposit.annualAmount / 12}`}>
                        {Math.floor((deposit.annualAmount / 12) * 100) / 100}%
                      </span>
                      <span>
                        +
                        {(deposit.investment * deposit.annualAmount) / 100 / 12}
                      </span>
                    </div>
                    <div className=" w-1/5 text-green-600 ">
                      {deposit.annualAmount}%
                      <div>
                        +{(deposit.investment * deposit.annualAmount) / 100}
                      </div>
                    </div>
                    <div className=" w-1/5 text-red-600  flex flex-col">
                      <span>{deposit.taxes}%</span>
                      <span>
                        -
                        {(((deposit.investment * deposit.annualAmount) / 100) *
                          deposit.taxes) /
                          100}
                      </span>
                    </div>
                    <div className="w-1/5 text-green-600">
                      +
                      {(deposit.investment * deposit.annualAmount) / 100 -
                        (((deposit.investment * deposit.annualAmount) / 100) *
                          deposit.taxes) /
                          100}
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

export default FinPlans;
