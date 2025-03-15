import { Link, useParams } from "react-router";
import { useAppDispatch } from "../../hooks/useReduxTypedHooks";
import {
  openModal,
  setPlanID,
  setPlanTranID,
} from "../../redux/slices/StateAndData";
import { createPortal } from "react-dom";
import FinPlanModal from "../modalWindow/FinPlanModal";
import {
  useDeletePlanMutation,
  useGetFinPlanQuery,
} from "../../api/rtk-query/finPlanRequest";
import { useCapitalize } from "../../hooks/useCapitalize";
import { ChangeEvent, useState } from "react";
import loadingIcon from "../../assets/cash-icon.gif";
import {
  useDeletePlanTransactionsMutation,
  useGetPlanTransactionsQuery,
} from "../../api/rtk-query/finPlanTransactions";
const FinPlans = () => {
  const { id: urlPlanID } = useParams<{ id: string }>();
  const [deletePlan] = useDeletePlanMutation();
  const { data: planTransactions } = useGetPlanTransactionsQuery();
  const [deletePlanTransactions] = useDeletePlanTransactionsMutation();
  const [selectedPlans, setSelectedPlans] = useState<{
    [key: string]: boolean;
  }>({});
  const [rowsId, setRowsId] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  const { toLowerCase } = useCapitalize();
  const { data: finPlans, refetch: refetchPlan } = useGetFinPlanQuery();
  console.log(rowsId);

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
    finPlans?.forEach((plan) => {
      newSelectedPlans[plan.id] = isSelected;

      //* Если нужно выбрать все, добавляем ID в массив
      if (isSelected) {
        newRowsId.push(plan.id);
      }
    });

    //* Обновляем состояние выбранных планов
    setSelectedPlans(newSelectedPlans);

    //* Обновляем массив ID выбранных строк
    setRowsId(newRowsId);
  };

  const handleClickDelete = async () => {
    //? Фильтруем ID метод some в этом поможет
    const planTranId =
      rowsId?.filter((id) => planTransactions?.some((t) => t.planId === id)) ||
      null;
    console.log("planTranId:", planTranId);
    console.log("planTranId:", planTranId);

    if (planTranId) {
      await deletePlan(rowsId);
      await deletePlanTransactions(planTranId);
      refetchPlan();
      setRowsId([]);
    }
  };

  const handleClickCreate = () => {
    if (!urlPlanID) dispatch(setPlanID(""));
    dispatch(openModal(["finplan", true]));
  };

  return (
    <div className=" rounded-lg  w-full max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex justify-between w-full">
          <h2 className="text-xl font-semibold">Plans</h2>
          <span
            onClick={handleClickCreate}
            className="px-3 py-2 cursor-pointer rounded-xl bg-green-600 text-white font-medium"
          >
            Создать
          </span>
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
        <div className="min-w-full bg-white border  border-gray-200 rounded-lg">
          <div className="flex py-2  border-b">
            <input
              type="checkbox"
              className="size-5 mx-4"
              onChange={(event) => handleSelectAll(event)}
            />
            <span className="w-1/5 font-semibold">Date</span>
            <span className="w-1/5 font-semibold">Month</span>
            <span className="w-1/5 font-semibold">Annual</span>
            <span className="w-1/5 font-semibold">Max plan</span>
            <span className="w-1/5 font-semibold">Plan</span>
          </div>
          {finPlans ? (
            finPlans.map((plan) => (
              <div
                key={plan.id}
                className="flex border-b items-center hover:bg-[#edf4f7] cursor-pointer "
              >
                <input
                  type="checkbox"
                  className="size-5 mx-4"
                  checked={selectedPlans[plan.id] || false}
                  onChange={() => handleClickSelect(plan.id)}
                />
                <Link to={`/finplans/${plan.id}`} className="w-full">
                  <div className="flex items-center h-[74px]">
                    <div className="w-1/5">
                      <div>
                        {plan.date.day}.{toLowerCase(plan.date.month.shortName)}
                        .{plan.date.year}
                      </div>
                      <div className="text-gray-500">
                        {plan.date.weekDay.shortName} {plan.date.hour}:
                        {plan.date.minute}
                      </div>
                    </div>
                    <div className="w-1/5">{plan.monthlyAmount}</div>
                    <div className=" w-1/5">
                      <div>{plan.annualAmount}</div>
                    </div>
                    <div className=" w-1/5">{plan.maxAmount}</div>
                    <div className=" w-1/5">{plan.plan}</div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <img src={loadingIcon} className="mx-auto" />
          )}
        </div>
      </div>
      {createPortal(<FinPlanModal />, document.body)}
    </div>
  );
};

export default FinPlans;
