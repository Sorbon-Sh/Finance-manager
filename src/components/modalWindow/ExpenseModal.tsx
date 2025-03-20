import { useAppDispatch } from "../../hooks/useReduxTypedHooks";
import { openModal, setTransactionId } from "../../redux/slices/StateAndData";
import SwitchModal from "./SwitchModal";
import closeIcon from "../../assets/closeIcon.svg";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import {
  useGetAccountQuery,
  useGetSingleDataTransactionsQuery,
  useGetSumQuery,
  useInsertTransactionMutation,
  useLazyGetAccountQuery,
  useLazyGetTransactionsQuery,
} from "../../api/rtk-query/insertTranData";
import { Inputs, ITransactions } from "../../types/types";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import DatePicker from "react-multi-date-picker";
import { useUpdateExpenseAmountAccountMutation } from "../../api/rtk-query/updateTranData";
import Button from "../buttons/Button";
import { useState } from "react";
const ExpenseModal = () => {
  const [amountError, setAmountError] = useState<string>("");
  const { data: accounts, refetch: accountRefetch } =
    useGetAccountQuery("accounts");
  const { refetch: tranRefetch } = useGetSumQuery("transactions");
  const { data: uniqueData } =
    useGetSingleDataTransactionsQuery("get_unique_data");
  const [insertTransaction] = useInsertTransactionMutation();
  const [getTransactions] = useLazyGetTransactionsQuery();
  const [getAccount] = useLazyGetAccountQuery();
  const [updateExpenseAmountAccount] = useUpdateExpenseAmountAccountMutation();
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    dispatch(openModal(["expense", false]));
    try {
      const updateAccount = async () => {
        const { data: tranData } = await getTransactions();
        const { data: accData } = await getAccount("accounts");
        //* Для дебага
        if (!tranData || tranData.length === 0)
          console.error("❌ Ошибка: данные транзакций пустые!");
        //* Для дебага
        if (!accData || accData.length === 0)
          console.error("❌ Ошибка: данные аккаунтов пустые!");

        console.log("Modal Data Amount: ", data.amount);

        //*========================================================================

        await updateExpenseAmountAccount([accData, data]);
      };
      //*===========================================================================

      await insertTransaction(["transactions", data, "expense"]).unwrap();
      await updateAccount();

      tranRefetch();
      accountRefetch();

      reset();
    } catch (err) {
      reset();
      console.log("Error", err);
      throw new Error(`Error to sending data to DataBase`);
    }
  };

  const onClose = () => {
    dispatch(openModal(["expense", false]));
    dispatch(setTransactionId(""));
    setAmountError("");
  };

  return (
    <SwitchModal
      handleClick={onClose}
      modalID="expense"
      className="bg-white rounded-4xl min-h-[535px] w-[480px]   pt-6 pb-6  px-8 min-w-md"
    >
      <div className="flex justify-between items-center mb-4 ">
        <h2 className="text-3xl font-bold">Новый рассход</h2>
        <button className="cursor-pointer" onClick={onClose}>
          <img src={closeIcon} />
        </button>
      </div>
      <form
        className="space-y-4"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <div>
          <input
            type="text"
            placeholder="На счет"
            list="accounts"
            id="country"
            className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
            {...register("account", { required: true })}
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
          <input
            type="number"
            placeholder="Сумма, TJS"
            className="w-full p-3 bg-gray-200 rounded-lg border border-gray-300 mb-4"
            {...register("amount", {
              required: true,
              valueAsNumber: true,
              validate: (value) => {
                const isNumPlus = value && +value < 0 ? true : false;
                if (isNumPlus) {
                  setAmountError("Число не может быть отрецательным");
                  return false;
                } else {
                  setAmountError("");
                }

                return true;
              },
            })}
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
          <input
            type="text"
            list="category"
            placeholder="Категория"
            className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
            {...register("category", { required: true })}
          />
          <datalist className=" bg-white w-16 p-2" id="category">
            {uniqueData &&
              uniqueData.map((unique: ITransactions) => (
                <option
                  key={unique.category}
                  value={unique.category}
                  className="bg-green-300 p-1"
                />
              ))}
          </datalist>
        </div>
        <div>
          <input
            type="text"
            placeholder="Мой контрагент"
            list="counterParty"
            className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
            {...register("counterParty", { required: true })}
          />
          <datalist className=" bg-white w-16 p-2" id="counterParty">
            {uniqueData &&
              uniqueData.map((unique: ITransactions) => (
                <option
                  value={unique.counterParty}
                  key={unique.counterParty}
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
          {errors.account ||
          errors.amount ||
          errors.category ||
          errors.counterParty ||
          errors.date ? (
            <span>Заполните все поля</span>
          ) : null}

          <span>{amountError && amountError}</span>
        </div>
        <Button className="w-full  py-2 bg-gradient-to-r from-blue-400 to-green-400 text-white font-semibold rounded-lg cursor-pointer">
          Добавить доход
        </Button>
      </form>
    </SwitchModal>
  );
};

export default ExpenseModal;
