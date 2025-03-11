import { Link } from "react-router";
import { useAppDispatch } from "../../hooks/useReduxTypedHooks";
import { openModal, setPlanID } from "../../redux/slices/StateAndData";
import { createPortal } from "react-dom";
import FinPlanModal from "../modalWindow/FinPlanModal";
import { useGetFinPlanQuery } from "../../api/rtk-query/finPlanRequest";
import { useCapitalize } from "../../hooks/useCapitalize";
import { useState } from "react";

const FinPlans = () => {
  const [selectedPlans, setSelectedPlans] = useState<{
    [key: string]: boolean;
  }>({});
  const [checkAll, setCheckAll] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { toLowerCase } = useCapitalize();
  const { data: finPlans } = useGetFinPlanQuery();
  const handleClickSelect = (id: string) => {
    console.log(id);

    setSelectedPlans((prev) => {
      const newState = { ...prev, [id]: !prev[id] };
      const allSelected = Object.values(newState).every((value) => value);
      setCheckAll(allSelected);
      return newState;
    });
  };

  const handleSelectAll = () => {
    const newAllChecked = !checkAll;
    setCheckAll(newAllChecked);

    const newSelectedPlans: Record<string, boolean> = {};

    finPlans?.forEach((plan) => {
      newSelectedPlans[plan.id] = newAllChecked;
      if (newAllChecked !== selectedPlans[plan.id]) {
        handleClickSelect(plan.id);
      }
    });
    setSelectedPlans(newSelectedPlans);
  };

  return (
    <div className=" rounded-lg  w-full max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex justify-between w-full">
          <h2 className="text-xl font-semibold">Plans</h2>
          <span
            onClick={() => dispatch(openModal(["finplan", true]))}
            className="px-3 py-2 cursor-pointer rounded-xl bg-green-600 text-white font-medium"
          >
            Создать
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-full bg-white border  border-gray-200 rounded-lg">
          <div className="flex py-2  border-b">
            <input
              type="checkbox"
              className="size-5 mx-4"
              onChange={handleSelectAll}
            />
            <span className="w-1/5 font-semibold">Date</span>
            <span className="w-1/5 font-semibold">Moth</span>
            <span className="w-1/5 font-semibold">Annual</span>
            <span className="w-1/5 font-semibold">Max plan</span>
            <span className="w-1/5 font-semibold">Plan</span>
          </div>
          {finPlans
            ? finPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="flex border-b items-center hover:bg-[#edf4f7] cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="size-5 mx-4"
                    checked={selectedPlans[plan.id] || false}
                    onChange={() => handleClickSelect(plan.id)}
                  />
                  <Link
                    to={`/finplans/${plan.id}`}
                    className="w-full"
                    onClick={() => dispatch(setPlanID(plan.id))}
                  >
                    <div className="flex items-center h-[74px]">
                      <div className="w-1/5">
                        <div>
                          {plan.date.day}.
                          {toLowerCase(plan.date.month.shortName)}.
                          {plan.date.year}
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
            : "loading"}
        </div>
      </div>
      {createPortal(<FinPlanModal />, document.body)}
    </div>
  );
};

export default FinPlans;
