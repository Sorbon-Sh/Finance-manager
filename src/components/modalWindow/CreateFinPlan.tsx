import { useAppDispatch, useAppSelector } from "../../hooks/useReduxTypedHooks";
import { openModal, setPlanID } from "../../redux/slices/StateAndData";
import SwitchModal from "./SwitchModal";
import closeIcon from "../../assets/closeIcon.svg";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import DatePicker from "react-multi-date-picker";
import { Inputs } from "../../types/indexTypes";

import {
  useCreateFinPlanMutation,
  useGetFinPlanQuery,
  useUpdatePlanMutation,
} from "../../api/rtk-query/finPlanRequest";
import Button from "../buttons/Button";
import { useEffect, useState } from "react";
import { numberValid } from "../../utility/numberValid";
import { toast } from "react-toastify";
import { safeToString } from "../../utility/safeToString";
import { parseDateFromServer } from "../../utility/parseDateFromServer";

const CreateFinPlan = () => {
  const [isButtonClicked, setIsButtonClicked] = useState<boolean>(false);
  const [createFinPlan] = useCreateFinPlanMutation();
  const [updatePlan] = useUpdatePlanMutation();
  const { data: finPlans } = useGetFinPlanQuery();
  const planRowsId = useAppSelector((state) => state.stateAndData.planId);
  const planDataById = finPlans?.find((plan) => plan.id === planRowsId);
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    trigger,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const annualAmount = watch("annualAmount");
  const monthlyAmount = watch("monthlyAmount");
  const maxAmount = watch("maxAmount");
  const dateIsString = watch("date");
  const annualToNumber = parseFloat(annualAmount || "0");
  const monthlyAmountNumber = parseFloat(monthlyAmount || "0");
  const maxAmountNumber = parseFloat(maxAmount || "0");
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const toastId = toast.loading("Сохранение данных...");
    dispatch(openModal(["finplan", false]));
    try {
      if (planRowsId) {
        await updatePlan([
          data,
          planDataById,
          dateIsString,
          annualToNumber,
          monthlyAmountNumber,
          maxAmountNumber,
          planRowsId,
        ]).unwrap();
        toast.update(toastId, {
          render: "План успешно обновлен!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      } else {
        await createFinPlan([
          data,
          annualToNumber,
          monthlyAmountNumber,
          maxAmountNumber,
        ]).unwrap();
        toast.update(toastId, {
          render: "План успешно создан!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      }
      dispatch(setPlanID(""));
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
    dispatch(openModal(["finplan", false]));
    dispatch(setPlanID(""));
    reset();
  };

  useEffect(() => {
    if (planDataById) {
      setValue("plan", planDataById.plan || null);
      setValue("monthlyAmount", safeToString(planDataById.monthlyAmount));
      setValue("annualAmount", safeToString(planDataById.annualAmount));
      setValue("maxAmount", safeToString(planDataById.maxAmount));
      setValue("date", parseDateFromServer(planDataById.date));
    }
    if (!planRowsId) reset();
  }, [planDataById, setValue]);

  useEffect(() => {
    (async () => {
      const formsError = await trigger();
      if (!formsError) {
        if (
          errors.plan ||
          errors.monthlyAmount ||
          errors.annualAmount ||
          errors.maxAmount ||
          errors.date
        ) {
          toast(
            <div className="text-red-600">
              <span>Заполните все поля </span>
            </div>,
          );
        }

        if (errors.plan?.message)
          toast(<span className="text-red-600">{errors.plan?.message}</span>);

        if (
          errors.monthlyAmount?.message ||
          errors.annualAmount?.message ||
          errors.maxAmount?.message
        ) {
          toast(
            <span className="text-red-600">
              {errors.monthlyAmount?.message ||
                errors.annualAmount?.message ||
                errors.maxAmount?.message}
            </span>,
          );
        }

        return;
      }
    })();
  }, [isButtonClicked]);

  return (
    <SwitchModal
      handleClick={onClose}
      modalID="finplan"
      className="bg-white rounded-4xl min-h-[535px] w-[480px]   pt-6 pb-6  px-8 min-w-md"
    >
      <div className="flex justify-between items-center mb-4 ">
        <h2 className="text-3xl font-bold">
          {planRowsId ? "Редактировать" : "Создать план"}
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
          placeholder="План"
          className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
          {...register("plan", {
            required: true,
            setValueAs: (value) => value?.trim(),
            maxLength: {
              value: 10,
              message: "Максимум 10 символов",
            },
            validate: (value) => {
              return (value && value.length >= 10) || true;
            },
          })}
        />

        <input
          type="text"
          placeholder="За месяц"
          className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
          {...register("monthlyAmount", {
            setValueAs: (value) => value?.trim(),
            required: true,
            validate: (value) => {
              const isNumberValid = numberValid(value || "0");
              return isNumberValid || true;
            },
          })}
        />

        <input
          type="text"
          placeholder="За год"
          className="w-full p-3 bg-gray-200 rounded-lg border border-gray-300 mb-4"
          {...register("annualAmount", {
            setValueAs: (value) => value?.trim(),
            required: true,
            validate: (value) => {
              const isNumberValid = numberValid(value || "0");
              return isNumberValid || true;
            },
          })}
        />

        <input
          type="text"
          placeholder="Всего"
          className="w-full p-3 bg-gray-200 rounded-lg border border-gray-300 mb-4"
          {...register("maxAmount", {
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
          className="w-full mt-4 py-2 bg-gradient-to-r from-blue-400 to-green-400 text-white font-semibold rounded-lg cursor-pointer"
        >
          Создать план
        </Button>
      </form>
    </SwitchModal>
  );
};

export default CreateFinPlan;
