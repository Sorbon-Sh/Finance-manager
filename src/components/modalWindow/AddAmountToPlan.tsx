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
import { Inputs } from "../../types/indexTypes";
import {
  useGetPlanTransactionsQuery,
  usePlanTransactionsMutation,
  useUpdatePlanTransactionsMutation,
} from "../../api/rtk-query/finPlanTransactions";
import { useGetFinPlanQuery } from "../../api/rtk-query/finPlanRequest";
import { useParams } from "react-router";
import Button from "../buttons/Button";
import { useEffect, useState } from "react";
import { numberValid } from "../../utility/numberValid";
import { toast } from "react-toastify";
import { safeToString } from "../../utility/safeToString";
import { parseDateFromServer } from "../../utility/parseDateFromServer";

const AddAmountToPlanModal = () => {
  const [isButtonClicked, setIsButtonClicked] = useState<boolean>(false);
  const { id: urlPlanId } = useParams();
  const planTranRowsId = useAppSelector(
    (state) => state.stateAndData.planTranId,
  );
  const { refetch: refetchPlanTran, data: dataTran } =
    useGetPlanTransactionsQuery();
  const [planTransactions] = usePlanTransactionsMutation();
  const [updatePlanTransactions] = useUpdatePlanTransactionsMutation();
  const { data: finPlans } = useGetFinPlanQuery();
  const planTranDataById = dataTran?.find((plan) => plan.id === planTranRowsId);
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<Inputs>();
  const watchedAmount = watch("amount");
  const amount = parseFloat(watchedAmount || "0");
  const watchedDate = watch("date");
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const toastId = toast.loading("Сохранение данных...");
    dispatch(openModal(["addAmountPlan", false]));
    try {
      const planTran = dataTran
        ? dataTran.find((plan) => plan.id === planTranRowsId)
        : null;

      const plans = finPlans
        ? finPlans.find((plan) => plan.id === urlPlanId)
        : null;

      if (planTranRowsId) {
        await updatePlanTransactions([
          data,
          planTranDataById,
          amount,
          watchedDate,
          planTran,
        ]).unwrap();
        toast.update(toastId, {
          render: "Сумма успешно обновлен!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      } else {
        await planTransactions([data, amount, plans]).unwrap();
        toast.update(toastId, {
          render: "Сумма успешно добавлена!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      }
      refetchPlanTran();
      reset();
    } catch (err) {
      toast.update(toastId, {
        render: (
          <span className="text-red-600">Ошибка при сохранении данных!</span>
        ),
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      console.log("Error", err);
      throw new Error(`Error to sending data to DataBase`);
    }
  };

  const onClose = () => {
    dispatch(openModal(["addAmountPlan", false]));
    dispatch(setTransactionId(""));
    dispatch(setPlanTranID(""));
    reset();
  };

  useEffect(() => {
    if (planTranDataById) {
      setValue("amount", safeToString(planTranDataById.amount));
      setValue("date", parseDateFromServer(planTranDataById.date));
    }
  }, [planTranDataById, setValue]);

  useEffect(() => {
    (async () => {
      const formsError = await trigger();
      if (!formsError) {
        if (errors.date || errors.amount) {
          toast(
            <div className="text-red-600">
              <span>Заполните все поля </span>
            </div>,
          );
        }

        if (errors.amount?.message)
          toast(<span className="text-red-600">{errors.amount.message}</span>);

        return;
      }
    })();
  }, [isButtonClicked]);

  return (
    <SwitchModal
      handleClick={onClose}
      modalID="addAmountPlan"
      className="bg-white rounded-4xl min-h-[350px]  pt-6  px-8 min-w-md"
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
          type="text"
          placeholder="Сумма"
          className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
          {...register("amount", {
            setValueAs: (value) => value?.trim(),
            required: true,
            validate: (value) => {
              const isNumberValid = numberValid(value || "0");
              return isNumberValid || true;
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

        <Button
          submitHandler={() => setIsButtonClicked((prev) => !prev)}
          className="w-full mt-2 py-2 bg-gradient-to-r from-blue-400 to-green-400 text-white font-semibold rounded-lg cursor-pointer"
        >
          Создать план
        </Button>
      </form>
    </SwitchModal>
  );
};

export default AddAmountToPlanModal;
