import { Link } from "react-router";
import { useAppDispatch } from "../../hooks/useReduxTypedHooks";
import { openModal } from "../../redux/slices/StateAndData";
import { createPortal } from "react-dom";
import FinPlanModal from "../modalWindow/FinPlanModal";
import { useGetFinPlanQuery } from "../../api/rtk-query/finPlanRequest";

const FinPlans = () => {
  const dispatch = useAppDispatch();
  const { data: finPlans } = useGetFinPlanQuery();
  const handleClickSelect = (id: string) => {
    console.log("ID", id);
  };

  return (
    <div className=" rounded-lg  w-full max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex justify-between w-full">
          <h2 className="text-xl font-semibold">Plans</h2>
          <span
            onClick={() => dispatch(openModal(["finplan", true]))}
            className="px-3 py-2 cursor-pointer rounded-xl bg-green-400"
          >
            Create plan
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-full bg-white border  border-gray-200 rounded-lg">
          <div className="flex py-2 px-4 border-b">
            <span className="w-1/5 font-semibold">Date</span>
            <span className="w-1/5 font-semibold">Plan</span>
            <span className="w-1/5 font-semibold">Month</span>
            <span className="w-1/5 font-semibold">Year</span>
            <span className="w-1/5 font-semibold">Max plan</span>
          </div>
          {finPlans
            ? finPlans.map((plan) => (
                <div key={plan.id} className="flex border-b items-center">
                  <input
                    type="checkbox"
                    onClick={() => handleClickSelect(plan.id)}
                    className="ml-2 size-4"
                  />
                  <Link to={`/finplans/${plan.id}`} className="w-full">
                    <div className="flex py-2 cursor-pointer px-4 items-center">
                      <span className="w-1/6">
                        {plan.date.day}.{plan.date.month.shortName}.
                        {plan.date.year}
                        <div>
                          {plan.date.hour}:{plan.date.minute}
                        </div>
                      </span>
                      <span className="w-1/5">{plan.plan}</span>
                      <span className="w-1/5">{plan.monthlyAmount}</span>
                      <span className="w-1/5">{plan.annualAmount}</span>
                      <span className="w-1/5">{plan.maxAmount}</span>
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
