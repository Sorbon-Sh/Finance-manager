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

const CreateDeposit = () => {
  const { data: deposits } = useGetDepositsQuery();
  const [createDeposit] = useCreateDepositMutation();
  const [updateDeposit] = useUpdateDepositMutation();
  const depositId = useAppSelector((state) => state.stateAndData.depositId);
  const [id] = depositId;
  const dispatch = useAppDispatch();
  const { register, handleSubmit, control, reset, setValue } =
    useForm<Inputs>();
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
      console.log("Error", err);
      throw new Error(`Error to sending data to DataBase`);
    }
  };

  const onClose = () => {
    dispatch(openModal(["createDeposit", false]));
    dispatch(setDepositId([]));
  };

  const depositDataById = deposits?.find((deposit) => deposit.id === id);
  setValue("investment", depositDataById?.investment || null);
  setValue("currency", depositDataById?.currency || null);
  setValue("annualInterest", depositDataById?.annualInterest || null);
  setValue("taxes", depositDataById?.taxes || null);
  setValue("category", depositDataById?.category || null);

  return (
    <SwitchModal
      handleClick={onClose}
      modalID="createDeposit"
      className="bg-white rounded-4xl h-auto w-[480px]   pt-6 pb-6  px-8 min-w-md"
    >
      <div className="flex justify-between items-center mb-4 ">
        <h2 className="text-3xl font-bold">Добавить вклад</h2>
        <button className="cursor-pointer" onClick={onClose}>
          <img src={closeIcon} />
        </button>
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
          {...register("investment", { valueAsNumber: true })}
        />

        <select
          className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
          {...register("currency")}
        >
          <option selected>Валюта</option>
          <option value="TJS" selected>
            TJS
          </option>
        </select>

        <input
          type="number"
          placeholder="В год"
          className="w-full p-3 bg-gray-200 rounded-lg border border-gray-300 mb-4"
          {...register("annualInterest", {
            valueAsNumber: true,
            validate: (value) => {
              // Проверка на корректность формата числа с двумя знаками после запятой
              const regex = /^\d+(\.\d{1,2})?$/;
              return (
                regex.test(String(value)) ||
                "Введите число с не более чем двумя знаками после запятой"
              );
            },
          })}
        />

        <input
          type="number"
          placeholder="Налог"
          className="w-full p-3 bg-gray-200 rounded-lg border border-gray-300 mb-4"
          {...register("taxes", { valueAsNumber: true })}
        />

        <input
          type="text"
          placeholder="Категория"
          className="w-full p-3 bg-gray-200 rounded-lg border border-gray-300 mb-4"
          {...register("category")}
        />

        <div>
          <Controller
            control={control}
            name="date"
            rules={{ required: true }}
            render={({
              field: { onChange, name, value },
              formState: { errors },
            }) => (
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

                {errors && errors[name] && errors[name].type === "required" && (
                  //if you want to show an error message
                  <span>Введите дата и время</span>
                )}
              </div>
            )}
          />
        </div>
        <div className="flex items-center space-x-2"></div>
        <Button className="w-full  py-2 bg-gradient-to-r from-blue-400 to-green-400 text-white font-semibold rounded-lg cursor-pointer">
          Создать план
        </Button>
      </form>
    </SwitchModal>
  );
};

export default CreateDeposit;
