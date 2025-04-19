import { useAppDispatch, useAppSelector } from "../../hooks/useReduxTypedHooks";
import { openModal, setDepositId } from "../../redux/slices/StateAndData";
import SwitchModal from "./SwitchModal";
import closeIcon from "../../assets/closeIcon.svg";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import DatePicker from "react-multi-date-picker";
import { Inputs } from "../../types/indexTypes";
import Button from "../buttons/Button";
import {
  useCreateDepositMutation,
  useGetDepositsQuery,
  useUpdateDepositMutation,
} from "../../api/rtk-query/depositsRequest";
import { useEffect, useState } from "react";
import { numberValid } from "../../utility/numberValid";
import { safeToString } from "../../utility/safeToString";
import { toast } from "react-toastify";
import { parseDateFromServer } from "../../utility/parseDateFromServer";

const CreateDeposit = () => {
  const [isButtonClicked, setIsButtonClicked] = useState<boolean>(false);
  const { data: deposits } = useGetDepositsQuery();
  const [createDeposit] = useCreateDepositMutation();
  const [updateDeposit] = useUpdateDepositMutation();
  const depositId = useAppSelector((state) => state.stateAndData.depositId);
  const [id] = depositId;
  const depositDataById = deposits?.find((deposit) => deposit.id === id);
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
  const watchedInvestment = watch("investment");
  const watchedAnnualInterest = watch("annualInterest");
  const watchedTaxes = watch("taxes");
  const dateIsString = watch("date");
  const investmentToNumber = parseFloat(watchedInvestment || "0");
  const annualInterestToNumber = parseFloat(watchedAnnualInterest || "0");
  const taxesToNumber = parseFloat(watchedTaxes || "0");
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const toastId = toast.loading("Сохранение данных...");
    dispatch(openModal(["createDeposit", false]));
    try {
      if (depositId.length !== 0) {
        await updateDeposit([
          data,
          depositDataById,
          dateIsString,
          investmentToNumber,
          annualInterestToNumber,
          taxesToNumber,
          depositId,
        ]).unwrap();
        toast.update(toastId, {
          render: "Депозит успешно обновлен!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      } else {
        await createDeposit([
          data,
          investmentToNumber,
          annualInterestToNumber,
          taxesToNumber,
        ]).unwrap();
        toast.update(toastId, {
          render: "Депозит успешно создан!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      }
      dispatch(setDepositId([]));
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
    dispatch(openModal(["createDeposit", false]));
    dispatch(setDepositId([]));
    reset();
  };

  useEffect(() => {
    if (depositDataById) {
      setValue("investment", safeToString(depositDataById.investment));
      setValue("annualInterest", safeToString(depositDataById.annualInterest));
      setValue("taxes", safeToString(depositDataById.taxes));
      setValue("category", depositDataById?.category || null);
      setValue("date", parseDateFromServer(depositDataById.date));
    }
  }, [depositDataById, setValue]);

  useEffect(() => {
    (async () => {
      const formsError = await trigger();
      if (!formsError) {
        if (
          errors.investment ||
          errors.annualInterest ||
          errors.taxes ||
          errors.category ||
          errors.date
        ) {
          toast(
            <div className="text-red-600">
              <span>Заполните все поля </span>
            </div>,
          );
        }

        if (errors.category?.message)
          toast(
            <span className="text-red-600">{errors.category?.message}</span>,
          );

        if (
          errors.investment?.message ||
          errors.annualInterest?.message ||
          errors.taxes?.message
        ) {
          toast(
            <span className="text-red-600">
              {errors.investment?.message ||
                errors.annualInterest?.message ||
                errors.taxes?.message}
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
      modalID="createDeposit"
      className="bg-white rounded-4xl h-auto w-[480px]   pt-6 pb-6  px-8 min-w-md"
    >
      <div className="flex justify-between items-center mb-4 ">
        <h2 className="text-3xl font-bold">
          {id ? "Редактировать" : "Добавить вклад"}
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
          {...register("investment", {
            setValueAs: (value) => value?.trim(),
            required: true,
            validate: (value) => {
              if (!value) return;
              const isNumberValid = numberValid(value);
              return isNumberValid || true;
            },
          })}
        />

        <input
          type="text"
          placeholder="В год"
          className="w-full p-3 bg-gray-200 rounded-lg border border-gray-300 mb-4"
          {...register("annualInterest", {
            setValueAs: (value) => value?.trim(),
            required: true,
            validate: (value) => {
              if (!value) return;
              const isNumberValid = numberValid(value);
              return isNumberValid || true;
            },
          })}
        />

        <input
          type="text"
          placeholder="Налог"
          className="w-full p-3 bg-gray-200 rounded-lg border border-gray-300 mb-4"
          {...register("taxes", {
            setValueAs: (value) => value?.trim(),
            required: true,
            validate: (value) => {
              if (!value) return;
              const isNumberValid = numberValid(value);
              return isNumberValid || true;
            },
          })}
        />

        <input
          type="text"
          placeholder="Категория"
          className="w-full p-3 bg-gray-200 rounded-lg border border-gray-300 mb-4"
          {...register("category", {
            setValueAs: (value) => value?.trim(),
            required: true,
            maxLength: {
              value: 7,
              message: "Максимум 7 символов",
            },
            validate: (value) => {
              return (value && value.length >= 7) || true;
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
          className="w-full  py-2 bg-gradient-to-r from-blue-400 to-green-400 text-white font-semibold rounded-lg cursor-pointer"
        >
          Создать план
        </Button>
      </form>
    </SwitchModal>
  );
};

export default CreateDeposit;
