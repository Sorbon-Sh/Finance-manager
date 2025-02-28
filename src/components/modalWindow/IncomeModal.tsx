import { useAppDispatch, useAppSelector } from "../../hooks/useReduxTypedHooks";
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
} from "../../api/rtk-query/insertToDataBase";
import { Inputs, ITransactions } from "../../types/types";

import TimePicker from "react-multi-date-picker/plugins/time_picker";
import DatePicker from "react-multi-date-picker";
import {
  useUpdateAmountAccountMutation,
  useUpdateTransactionMutation,
} from "../../api/rtk-query/updateData";
const IncomeModal = () => {
  const { data: accounts, refetch: accountRefetch } =
    useGetAccountQuery("accounts");
  const { data: transactions, refetch: tranRefetch } =
    useGetSumQuery("transactions");
  const { data: uniqueData } =
    useGetSingleDataTransactionsQuery("get_unique_data");
  const [insertTransaction] = useInsertTransactionMutation();
  const [updateTransaction] = useUpdateTransactionMutation();
  const [getTransactions] = useLazyGetTransactionsQuery();
  const [getAccount] = useLazyGetAccountQuery();
  const [updateAmountAccount] = useUpdateAmountAccountMutation();
  const tranId = useAppSelector((state) => state.stateAndData.transactionId);
  const dispatch = useAppDispatch();
  const { register, handleSubmit, control, reset, setValue } =
    useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    dispatch(openModal(["income", false]));
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
        const tranLastData = tranData
          ? tranData.findLast((elem) => elem.account === elem.account)
          : null;
        console.log("Последние данные массива: ", tranLastData);

        if (tranLastData) {
          console.log("✅ Отправка данных на обновление:", tranLastData);
          await updateAmountAccount([
            tranLastData,
            accData,
            tranId,
            tranData,
            data,
          ]);
        }
      };
      //*===========================================================================

      if (tranId) {
        //* Обработаывать страные данные журнала и отправить их в accounts перед изменить их в transactions
        await updateAccount();
        await updateTransaction([data, tranId]);
      }
      //* Суммировать последние  данные если не редактируем транзакции
      //*
      if (!tranId) {
        await insertTransaction(["transactions", data]).unwrap();
        await updateAccount();
      }

      // if (!accounts || accounts.length === 0)
      //   throw new Error("Ошибка: Данные аккаунта пустые");

      // const allUserAmount = accounts.reduce(
      //   (acc, item) => acc + item.allAmount,
      //   0
      // );

      tranRefetch();
      accountRefetch();
      dispatch(setTransactionId(""));
      console.log("tranId Пустой?: ", tranId);
      reset();
    } catch (err) {
      console.log("Error", err);
      throw new Error(`Error to sending data to DataBase`);
    }
  };
  const tranData = tranId
    ? transactions && transactions.find((elem) => elem.id === tranId)
    : null;

  setValue("account", (tranData && tranData.account) || "");
  setValue("amount", (tranData && tranData.amount) || 0);
  setValue("category", (tranData && tranData.category) || "");
  setValue("counterParty", (tranData && tranData.counterParty) || "");

  const onClose = () => {
    dispatch(openModal(["income", false]));
    dispatch(setTransactionId(""));
  };

  return (
    <SwitchModal
      handleClick={onClose}
      modalID="income"
      className="bg-white rounded-4xl h-[535px] w-[480px]   pt-6 pb-6  px-8 min-w-md"
    >
      <div className="flex justify-between items-center mb-4 ">
        <h2 className="text-3xl font-bold">Новый доход</h2>
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
            {...register("account")}
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
            {...register("amount")}
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
            {...register("category")}
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
            {...register("counterParty")}
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
    </SwitchModal>
  );
};

export default IncomeModal;
