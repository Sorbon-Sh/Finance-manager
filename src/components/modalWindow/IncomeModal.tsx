import { useAppDispatch } from "../../hooks/useReduxTypedHooks";
import { openModal } from "../../redux/slices/StateAndData";
import SwitchModal from "./SwitchModal";
import closeIcon from "../../assets/closeIcon.svg";
import history from "../../assets/history.svg";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import {
  useGetAccountQuery,
  useGetSingleDataTransactionsQuery,
  useInsertTransactionMutation,
} from "../../api/rtk-query/insertToDataBase";
import { Inputs, ITransactions } from "../../types/types";

import TimePicker from "react-multi-date-picker/plugins/time_picker";
import DatePicker from "react-multi-date-picker";
const IncomeModal = () => {
  const { data: accounts } = useGetAccountQuery("accounts");
  const { data: uniqueData } =
    useGetSingleDataTransactionsQuery("get_unique_data");
  const [insertTransaction] = useInsertTransactionMutation();
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log("Data: ", data);
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
      <form
        className="space-y-4"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <div>
          <span>{errors.account && errors.account.message}</span>
          <input
            type="text"
            placeholder="На счет"
            list="accounts"
            id="country"
            className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
            {...register("account", { required: "Choose your account" })}
          />
          <datalist className=" bg-white w-16 p-2" id="accounts">
            {accounts &&
              accounts.map((account) => (
                <option
                  key={account.id}
                  value={account.account}
                  className="bg-green-300 p-1"
                />
              ))}
          </datalist>
        </div>

        <div className="">
          <span>{errors.amount && errors.amount.message}</span>
          <input
            type="text"
            placeholder="Сумма, TJS"
            className="w-full p-3 bg-gray-200 rounded-lg border border-gray-300 mb-4"
            {...register("amount", { required: "Inter amount" })}
          />

          {/* <select
            value="TJS (TJS)"
            className="p-3 bg-gray-100 rounded-lg border border-gray-300"
          >
            <option>TJS (TJS)</option>
            <option>USD (USD)</option>
          </select> */}
        </div>

        <div>
          <span> {errors.category && errors.category.message}</span>
          <input
            type="text"
            list="category"
            placeholder="Категория"
            className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
            {...register("category", { required: "Create category" })}
          />
          <datalist className=" bg-white w-16 p-2" id="category">
            {uniqueData &&
              uniqueData.map((unique: ITransactions) => (
                <option value={unique.category} className="bg-green-300 p-1" />
              ))}
          </datalist>
        </div>
        <div>
          <span>{errors.counterParty && errors.counterParty.message}</span>
          <input
            type="text"
            placeholder="Мой контрагент"
            list="counterParty"
            className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
            {...register("counterParty", { required: "Creeate counterparty" })}
          />
          <datalist className=" bg-white w-16 p-2" id="counterParty">
            {uniqueData &&
              uniqueData.map((unique: ITransactions) => (
                <option
                  value={unique.counterParty}
                  className="bg-green-300 p-1"
                />
              ))}
          </datalist>
        </div>

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
    </SwitchModal>
  );
};

export default IncomeModal;
