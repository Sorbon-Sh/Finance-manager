import { useAppDispatch, useAppSelector } from "../../hooks/useReduxTypedHooks";
import {
  openModal,
  setPlanTranID,
  setTransactionId,
} from "../../redux/slices/StateAndData";
import SwitchModal from "./SwitchModal";
import closeIcon from "../../assets/closeIcon.svg";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import DatePicker from "react-multi-date-picker";
import { Inputs } from "../../types/types";
import {
  useGetPlanTransactionsQuery,
  usePlanTransactionsMutation,
  useUpdatePlanTransactionsMutation,
} from "../../api/rtk-query/finPlanTransactions";
import { useGetFinPlanQuery } from "../../api/rtk-query/finPlanRequest";
import { useParams } from "react-router";
import Button from "../buttons/Button";
import { useState } from "react";

const AddAmountToPlanModal = () => {
  const [amountError, setAmountError] = useState<string>("");
  const { id: urlPlanId } = useParams();
  const planTranRowsId = useAppSelector(
    (state) => state.stateAndData.planTranId
  );
  const { refetch: refetchPlanTran, data: dataTran } =
    useGetPlanTransactionsQuery();
  const [planTransactions] = usePlanTransactionsMutation();
  const [updatePlanTransactions] = useUpdatePlanTransactionsMutation();
  const { data: finPlans } = useGetFinPlanQuery();
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    dispatch(openModal(["addAmountPlan", false]));
    try {
      const planTran = dataTran
        ? dataTran.find((plan) => plan.id === planTranRowsId)
        : null;
      console.log("planTranRowsId", planTranRowsId);
      console.log("plan", planTran);

      const plans = finPlans
        ? finPlans.find((plan) => plan.id === urlPlanId)
        : null;

      if (planTranRowsId) {
        await updatePlanTransactions([data, planTran]);
      } else {
        await planTransactions([data, plans]);
      }
      refetchPlanTran();
      reset();
    } catch (err) {
      console.log("Error", err);
      throw new Error(`Error to sending data to DataBase`);
    }
  };

  const onClose = () => {
    dispatch(openModal(["addAmountPlan", false]));
    dispatch(setTransactionId(""));
    dispatch(setPlanTranID(""));
  };

  const planTranDataById = dataTran?.find((plan) => plan.id === planTranRowsId);

  console.log("planTranDataById :", planTranDataById);

  setValue("amount", planTranDataById?.amount || null);

  return (
    <SwitchModal
      handleClick={onClose}
      modalID="addAmountPlan"
      className="bg-white rounded-4xl min-h-[350px]    pt-6  px-8 min-w-md"
    >
      <div className="flex justify-between items-center mb-4 ">
        <h2 className="text-3xl font-bold">
          {planTranRowsId ? "Редактировать" : "Добавить сумму"}
        </h2>
        <Button className="cursor-pointer" submitHandler={onClose}>
          <img src={closeIcon} />
        </Button>
      </div>
      <form
        className="space-y-4 flex flex-col"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <input
          type="number"
          placeholder="Сумма"
          className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
          {...register("amount", {
            required: true,
            valueAsNumber: true,
            validate: (value) => {
              const isNumPlus = value && +value < 0 ? true : false;
              if (isNumPlus) {
                setAmountError("Число не должно быть отрицательным");
              } else {
                setAmountError("");
              }

              return true;
            },
          })}
        />

        <div>
          <Controller
            control={control}
            name="date"
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <div className="bg-gray-100 rounded-lg ">
                <p className="text-xs text-gray-500">Дата поступления денег</p>
                <DatePicker
                  value={value || new Date()}
                  onChange={(date) => {
                    onChange(date?.isValid ? date : "");
                  }}
                  format="MM.DD.YYYY, HH:mm:ss"
                  plugins={[<TimePicker position="bottom" />]}
                  style={{ border: "0", width: "100%" }}
                  inputClass="p-4 flex items-center justify-between"
                  containerClassName="w-full "
                />
              </div>
            )}
          />
        </div>
        <div className="text-center text-red-600 flex flex-col">
          <span>
            {errors.date || errors.amount ? "Заполните все поля" : null}
          </span>
          <span>{amountError && amountError}</span>
        </div>
        <button className="w-full mt-2 py-2 bg-gradient-to-r from-blue-400 to-green-400 text-white font-semibold rounded-lg cursor-pointer">
          Создать план
        </button>
      </form>
    </SwitchModal>
  );
};

export default AddAmountToPlanModal;
