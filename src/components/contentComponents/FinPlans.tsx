import { Link } from "react-router";
import { useAppDispatch, useAppSelector } from "../../hooks/useReduxTypedHooks";
import { openModal, setPlanID } from "../../redux/slices/StateAndData";
import { createPortal } from "react-dom";
import {
  useDeletePlanMutation,
  useGetFinPlanQuery,
} from "../../api/rtk-query/finPlanRequest";
import { useCapitalize } from "../../hooks/useCapitalize";
import { ChangeEvent, useEffect, useState } from "react";
import {
  useDeletePlanTransactionsMutation,
  useGetPlanTransactionsQuery,
} from "../../api/rtk-query/finPlanTransactions";
import Button from "../buttons/Button";
import { Loading } from "../Loading";
import CreateFinPlan from "../modalWindow/CreateFinPlan";
import useMainCurrency from "../../hooks/useMainCurrency";
import { truncateDecimal } from "../../utility/truncateDecimal";
import { toast } from "react-toastify";
import { NoTransactions } from "../NoTransactions";
import Tooltip from "./Tooltip";
const FinPlans = () => {
  const [id, setId] = useState<{ colId: string; boxId: string } | null>(null);
  const planID = useAppSelector((state) => state.stateAndData.planId);
  const mainCurrency = useMainCurrency();
  const [deletePlan] = useDeletePlanMutation();
  const { data: planTransactions } = useGetPlanTransactionsQuery();
  const [deletePlanTransactions] = useDeletePlanTransactionsMutation();
  const [selectedPlans, setSelectedPlans] = useState<{
    [key: string]: boolean;
  }>({});
  const [rowsId, setRowsId] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  const { toLowerCase } = useCapitalize();
  const { data: finPlans, refetch: refetchPlan, error } = useGetFinPlanQuery();

  const handleClickSelect = (
    event: ChangeEvent<HTMLInputElement>,
    id: string,
  ) => {
    const isChecked = event.target.checked;

    setRowsId((prev) => {
      const updated = isChecked
        ? [...prev, id]
        : prev.filter((item) => item !== id);

      // если чекбокс ставим, обновляем planID
      if (isChecked) {
        dispatch(setPlanID(id));
      } else {
        // если убираем галочку, и остался хотя бы один — выбираем его как новый planID
        if (updated.length > 0) {
          dispatch(setPlanID(updated[0]));
        } else {
          dispatch(setPlanID(""));
        }
      }

      return updated;
    });

    setSelectedPlans((prev) => {
      const newState = { ...prev, [id]: isChecked };
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
    const toastId = toast.loading("Удаление данных...");
    const planTranId =
      rowsId?.filter((id) => planTransactions?.some((t) => t.planId === id)) ||
      null;

    if (planTranId) {
      await deletePlan(rowsId);
      await deletePlanTransactions(planTranId);
      toast.update(toastId, {
        render: "План успешно удален!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      refetchPlan();
      setRowsId([]);
      dispatch(setPlanID(""));
    }
  };

  const handleClickCreate = () => {
    if (rowsId.length !== 0) {
      toast.error(
        <span className="text-red-500">
          Удалите или измените планы перед созданием нового
        </span>,
      );
      return;
    }
    dispatch(openModal(["finplan", true]));
  };

  useEffect(() => {
    if (!planID) {
      setSelectedPlans({});
      setRowsId([]);
    }
  }, [planID]);

  return (
    <div className=" rounded-lg  w-full max-w-4xl ">
      <div className="flex justify-between items-center mb-6">
        <div className="flex justify-between w-full">
          <h2 className="text-xl font-semibold">Планы</h2>
          <Button
            submitHandler={handleClickCreate}
            className="px-3 py-2 cursor-pointer rounded-xl bg-green-500 text-white font-medium"
          >
            Создать
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
            onClick={() => dispatch(openModal(["finplan", true]))}
            className={`cursor-pointer ${
              rowsId.length !== 0 ? "visible" : "hidden"
            } hover:bg-slate-50/30 px-2 py-1 rounded-xl`}
          >
            Изменить
          </span>
        )}
      </div>
      <div className="h-[500px] overflow-y-auto">
        <div className="min-w-full  rounded-lg ">
          <div className="flex py-2  border-b-gray-400 border-b text-gray-500">
            <input
              type="checkbox"
              className="size-5 mx-4"
              onChange={(event) => handleSelectAll(event)}
            />
            <span className="w-1/5 font-semibold">Дата</span>
            <span className="w-1/5 font-semibold">Весь план</span>
            <span className="w-1/5 font-semibold">В месяц</span>
            <span className="w-1/5 font-semibold">В год</span>
            <span className="w-1/5 font-semibold">План</span>
          </div>

          {finPlans ? (
            finPlans.map((plan) => (
              <div
                key={plan.id}
                className="flex border-b-gray-400 border-b items-center hover:bg-[#edf4f7] cursor-pointer "
              >
                <input
                  type="checkbox"
                  className="size-5 mx-4"
                  checked={selectedPlans[plan.id]}
                  onChange={(event) => handleClickSelect(event, plan.id)}
                />
                <Link to={`/finplans/${plan.id}`} className="w-full">
                  <div className="flex items-center h-[70px] ">
                    <div className="w-1/5">
                      <div>
                        {plan.date.day}.{toLowerCase(plan.date.month.shortName)}
                        .{plan.date.year}
                      </div>
                      <div className="text-gray-500 ">
                        {plan.date.weekDay.shortName} {plan.date.hour}:
                        {plan.date.minute}
                      </div>
                    </div>
                    <div className=" w-1/5 text-green-600 flex gap-1 relative">
                      <Tooltip
                        number={plan.maxAmount}
                        className={"left-10 top-7"}
                        isActive={
                          id?.boxId === "maxAmount" && id?.colId === plan.id
                        }
                      />
                      <span
                        onMouseEnter={() =>
                          setId({ colId: plan.id, boxId: "maxAmount" })
                        }
                        onMouseLeave={() => setId(null)}
                      >
                        {truncateDecimal(plan.maxAmount)}
                      </span>
                      <span className="text-gray-500">{mainCurrency}</span>
                    </div>
                    <div className="w-1/5 text-green-600 flex gap-1 relative">
                      <Tooltip
                        number={plan.monthlyAmount}
                        className={"left-10 top-7"}
                        isActive={
                          id?.boxId === "monthlyAmount" && id?.colId === plan.id
                        }
                      />
                      <span
                        onMouseEnter={() =>
                          setId({ colId: plan.id, boxId: "monthlyAmount" })
                        }
                        onMouseLeave={() => setId(null)}
                      >
                        {truncateDecimal(plan.monthlyAmount)}
                      </span>
                      <span className="text-gray-500">{mainCurrency}</span>
                    </div>
                    <div className=" w-1/5 text-green-600 flex gap-1 relative">
                      <Tooltip
                        number={plan.annualAmount}
                        className={"  left-10 top-7"}
                        isActive={
                          id?.boxId === "annualAmount" && id?.colId === plan.id
                        }
                      />
                      <span
                        onMouseEnter={() =>
                          setId({ colId: plan.id, boxId: "annualAmount" })
                        }
                        onMouseLeave={() => setId(null)}
                      >
                        {truncateDecimal(plan.annualAmount)}
                      </span>
                      <span className="text-gray-500">{mainCurrency}</span>
                    </div>
                    <div className=" w-1/5">{plan.plan}</div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <Loading error={error} onReload={refetchPlan} />
          )}
          {finPlans
            ? finPlans.length === 0 && (
                <div className="w-full min-h-96 grid place-items-center ">
                  <NoTransactions
                    header="Создайте свои планы!"
                    btnText="Создать"
                    modal={["finplan", true]}
                  />
                </div>
              )
            : null}
        </div>
      </div>
      {createPortal(<CreateFinPlan />, document.body)}
    </div>
  );
};

export default FinPlans;
