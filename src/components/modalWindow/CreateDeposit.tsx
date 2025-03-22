import { useAppDispatch, useAppSelector } from "../../hooks/useReduxTypedHooks";
import { openModal, setDepositId } from "../../redux/slices/StateAndData";
import SwitchModal from "./SwitchModal";
import closeIcon from "../../assets/closeIcon.svg";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import DatePicker from "react-multi-date-picker";
import { Inputs } from "../../types/types";
import Button from "../buttons/Button";
import {
  useCreateDepositMutation,
  useGetDepositsQuery,
  useUpdateDepositMutation,
} from "../../api/rtk-query/depositsRequest";
import { useEffect } from "react";

const CreateDeposit = () => {
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
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    dispatch(openModal(["createDeposit", false]));
    try {
      if (depositId.length !== 0) {
        updateDeposit([data, depositId]);
      } else {
        createDeposit(data);
      }
      dispatch(setDepositId([]));
      reset();
    } catch (err) {
      reset();
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
    setValue("investment", depositDataById?.investment || null);
    setValue("currency", depositDataById?.currency || null);
    setValue("annualInterest", depositDataById?.annualInterest || null);
    setValue("taxes", depositDataById?.taxes || null);
    setValue("category", depositDataById?.category || null);
  }, [depositDataById, setValue]);
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
          type="number"
          placeholder="Сумма"
          className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
          {...register("investment", {
            required: true,
            valueAsNumber: true,
            validate: (value) => {
              const isNumPlus = value && value < 0 ? true : false;
              return !isNumPlus || false;
            },
          })}
        />

        <select
          className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
          {...(register("currency"), { required: true })}
        >
          <option selected>Валюта</option>
          <option value="TJS">TJS</option>
        </select>

        <input
          type="number"
          placeholder="В год"
          className="w-full p-3 bg-gray-200 rounded-lg border border-gray-300 mb-4"
          {...register("annualInterest", {
            required: true,
            valueAsNumber: true,
            validate: (value) => {
              const isNumPlus = value && value < 0 ? true : false;
              return !isNumPlus || false;
            },
          })}
        />

        <input
          type="number"
          placeholder="Налог"
          className="w-full p-3 bg-gray-200 rounded-lg border border-gray-300 mb-4"
          {...register("taxes", {
            required: true,
            valueAsNumber: true,
            validate: (value) => {
              const isNumPlus = value && value < 0 ? true : false;
              return !isNumPlus || false;
            },
          })}
        />

        <input
          type="text"
          placeholder="Категория"
          className="w-full p-3 bg-gray-200 rounded-lg border border-gray-300 mb-4"
          {...register("category", {
            required: true,
            maxLength: {
              value: 15,
              message: "Максимум 15 символов",
            },
            validate: (value) => {
              return (value && value.length >= 15) || true;
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
        <div className="flex flex-col text-center  text-red-600">
          {errors.investment ||
          errors.annualInterest ||
          errors.taxes ||
          errors.category ||
          errors.currency ||
          errors.date ? (
            <span>Заполните все поля</span>
          ) : null}

          <span>{errors.category?.message}</span>
          <span>
            {errors.investment?.type === "validate" ||
            errors.annualInterest?.type === "validate" ||
            errors.taxes?.type === "validate" ||
            errors.category?.type === "validate"
              ? "Число не должно быть отрицательным"
              : null}
          </span>
        </div>
        <Button className="w-full  py-2 bg-gradient-to-r from-blue-400 to-green-400 text-white font-semibold rounded-lg cursor-pointer">
          Создать план
        </Button>
      </form>
    </SwitchModal>
  );
};

export default CreateDeposit;
