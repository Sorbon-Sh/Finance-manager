import { useAppDispatch } from "../../hooks/useReduxTypedHooks";
import { openModal } from "../../redux/slices/modalStateSlice";
import SwitchModal from "./SwitchModal";
import closeIcon from "../../assets/closeIcon.svg";
import history from "../../assets/history.svg";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import { useInsertTransactionMutation } from "../../api/rtk-query/insertToDataBase";
import { Inputs } from "../../types/types";

const IncomeModal = () => {
  const dispatch = useAppDispatch();
  const [insertTransaction] = useInsertTransactionMutation();
  const { register, handleSubmit, control } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      await insertTransaction(["transactions", data]).unwrap();
    } catch (err) {
      console.log("Error", err);
      throw new Error(`Error to sending data to DataBase`);
    }
  };

  return (
    <SwitchModal
      modalID="income"
      className="bg-white rounded-4xl h-[535px] w-[480px]  overflow-y-scroll pt-6 pb-6  px-8 min-w-md"
    >
      <div className="flex justify-between items-center mb-4 ">
        <h2 className="text-3xl font-bold">Новый доход</h2>
        <button
          className="cursor-pointer"
          onClick={() => dispatch(openModal(["income", false]))}
        >
          <img src={closeIcon} />
        </button>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="relative dropdown">
          <input
            type="text"
            placeholder="На счет"
            className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
            {...register("account")}
          />
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Сумма, TJS"
            className="w-full p-3 bg-gray-200 rounded-lg border border-gray-300"
            {...register("sum")}
          />

          <select
            value="TJS (TJS)"
            className="p-3 bg-gray-100 rounded-lg border border-gray-300"
          >
            <option>TJS (TJS)</option>
            <option>USD (USD)</option>
          </select>
        </div>
        <div className="relative dropdown">
          <input
            type="text"
            placeholder="Категория"
            className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
            {...register("category")}
          />
        </div>
        <div className="relative dropdown">
          <input
            type="text"
            placeholder="Мой контрагент"
            className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
            {...register("counterParty")}
          />
        </div>
        {/* <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Дата поступления денег</p>
            <p className="text-sm font-medium">Сегодня, 31.01.2025, 17:08</p>
          </div>
          <i className="far fa-calendar-alt text-gray-500"></i>
        </div> */}
        <Controller
          control={control}
          name="date"
          rules={{ required: true }} //optional
          render={({
            field: { onChange, name, value },

            formState: { errors },
          }) => (
            <>
              <DatePicker
                value={value || ""}
                onChange={(date) => {
                  onChange(date?.isValid ? date : "");
                }}
                format="MM/DD/YYYY HH:mm:ss"
                plugins={[<TimePicker position="bottom" />]}
                containerClassName="w-full text-center text-xl bg-green-200"
              />
              {errors && errors[name] && errors[name].type === "required" && (
                //if you want to show an error message
                <span>your error message !</span>
              )}
            </>
          )}
        />

        <div className="flex items-center space-x-2"></div>
        <button className="w-full mt-4 py-2 bg-gradient-to-r from-blue-400 to-green-400 text-white font-semibold rounded-lg cursor-pointer">
          Добавить доход
        </button>
      </form>
      <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-between">
        <div className="flex gap-x-2">
          <img src={history} alt="" />
          <p className="text-sm font-medium">Сделать повторяющим</p>
          <p className="text-sm font-medium text-red-500">Под вопросом!</p>
        </div>
        <i className="far fa-calendar-alt text-gray-500"></i>
      </div>
      {/* <DatePicker
     format="MM/DD/YYYY HH:mm:ss"
     plugins={[<TimePicker position="bottom" />]}/> */}
    </SwitchModal>
  );
};

export default IncomeModal;
