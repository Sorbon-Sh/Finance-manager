import { useAppDispatch } from "../../hooks/useReduxTypedHooks";
import { openModal, setTransactionId } from "../../redux/slices/StateAndData";
import SwitchModal from "./SwitchModal";
import closeIcon from "../../assets/closeIcon.svg";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import DatePicker from "react-multi-date-picker";
import { Inputs } from "../../types/types";
import { useCreateFinPlanMutation } from "../../api/rtk-query/finPlanRequest";
import { useId } from "react";

const FinPlanModal = () => {
  const planId = useId();
  const [createFinPlan] = useCreateFinPlanMutation();

  const dispatch = useAppDispatch();
  const { register, handleSubmit, control, reset, getValues, setValue } =
    useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    dispatch(openModal(["finplan", false]));
    try {
      await createFinPlan([data, planId]);

      reset();
    } catch (err) {
      console.log("Error", err);
      throw new Error(`Error to sending data to DataBase`);
    }
  };

  const onClose = () => {
    dispatch(openModal(["finplan", false]));
    dispatch(setTransactionId(""));
  };

  return (
    <SwitchModal
      handleClick={onClose}
      modalID="finplan"
      className="bg-white rounded-4xl h-[535px] w-[480px]   pt-6 pb-6  px-8 min-w-md"
    >
      <div className="flex justify-between items-center mb-4 ">
        <h2 className="text-3xl font-bold">Создать план</h2>
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
          type="text"
          placeholder="План"
          className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
          {...register("plan")}
        />

        <input
          type="number"
          placeholder="За месяц"
          className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
          {...register("monthlyAmount", { valueAsNumber: true })}
        />

        <input
          type="number"
          placeholder="За год"
          className="w-full p-3 bg-gray-200 rounded-lg border border-gray-300 mb-4"
          {...register("annualAmount", { valueAsNumber: true })}
        />

        <input
          type="number"
          placeholder="Всего"
          className="w-full p-3 bg-gray-200 rounded-lg border border-gray-300 mb-4"
          {...register("maxAmount", { valueAsNumber: true })}
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
        <button className="w-full mt-4 py-2 bg-gradient-to-r from-blue-400 to-green-400 text-white font-semibold rounded-lg cursor-pointer">
          Создать план
        </button>
      </form>
    </SwitchModal>
  );
};

export default FinPlanModal;
