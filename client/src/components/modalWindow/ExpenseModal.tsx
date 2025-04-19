import { useAppDispatch, useAppSelector } from "../../hooks/useReduxTypedHooks";
import { openModal, setTransactionId } from "../../redux/slices/StateAndData";
import SwitchModal from "./SwitchModal";
import closeIcon from "../../assets/closeIcon.svg";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import {
  useGetSingleDataTransactionsQuery,
  useGetSumQuery,
  useInsertTransactionMutation,
  useLazyGetTransactionsQuery,
} from "../../api/rtk-query/insertTranData";
import { Inputs, ITransactions } from "../../types/indexTypes";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import DatePicker from "react-multi-date-picker";
import Button from "../buttons/Button";
import {
  useExpenseAmountAccountMutation,
  useGetAccountQuery,
  useLazyGetAccountQuery,
} from "../../api/rtk-query/accountRequest";
import SelectCurrency from "../contentComponents/SelectCurrency";
import ChooseBankModal from "./ChooseBankModal";
import { ChangeEvent, useEffect, useState } from "react";
import {
  currencyTableModal,
  setCurrencyData,
} from "../../redux/slices/currencySlice";
import { isObjectValid } from "../../utility/isObjectValid";
import useMainCurrency from "../../hooks/useMainCurrency";
import { toast } from "react-toastify";
import { useUpdateTransactionMutation } from "../../api/rtk-query/updateTranData";
import { safeToString } from "../../utility/safeToString";
import { numberValid } from "../../utility/numberValid";
import { parseDateFromServer } from "../../utility/parseDateFromServer";
const ExpenseModal = () => {
  const [selectBank, setSelectBank] = useState<string>("");
  const [isButtonClicked, setIsButtonClicked] = useState<boolean>(false);
  const { data: accounts, refetch: accountRefetch } =
    useGetAccountQuery("accounts");
  const { refetch: tranRefetch, data: transactions } =
    useGetSumQuery("transactions");
  const { data: uniqueData } =
    useGetSingleDataTransactionsQuery("get_unique_data");
  const [insertTransaction] = useInsertTransactionMutation();
  const [expenseAmountAccount] = useExpenseAmountAccountMutation();
  const [getTransactions] = useLazyGetTransactionsQuery();
  const [updateTransaction] = useUpdateTransactionMutation();
  const [getAccount] = useLazyGetAccountQuery();
  const mainCurrency = useMainCurrency();
  const dispatch = useAppDispatch();
  const tranId = useAppSelector((state) => state.stateAndData.transactionId);
  const tranData = tranId
    ? transactions?.find((elem) => elem.id === tranId)
    : null;

  const currencyTableData = useAppSelector(
    (state) => state.currencySlice.currency,
  );
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<Inputs>();
  const watchedAmount = watch("amount");
  const watchedDate = watch("date");
  const amount = parseFloat(watchedAmount || "0");
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    dispatch(openModal(["expense", false]));
    const toastId = toast.loading("Сохранение данных...");
    try {
      const amountToNumber = parseFloat(data.amount || "0");
      const updateAccount = async () => {
        const { data: tranData } = await getTransactions();
        const { data: accData } = await getAccount("accounts");
        await expenseAmountAccount([accData, tranId, tranData, data]).unwrap();
      };
      if (tranId) {
        await updateAccount();
        await updateTransaction([
          data,
          watchedDate,
          tranData,
          tranId,
          amountToNumber,
          currencyTableData,
        ]).unwrap();
        toast.update(toastId, {
          render: "Транзакция успешно обновлена!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      }

      if (!tranId) {
        await insertTransaction([
          "transactions",
          currencyTableData,
          data,
          amountToNumber,
          "expense",
        ]).unwrap();
        await updateAccount();

        toast.update(toastId, {
          render: "Новая транзакция создана!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      }
      tranRefetch();
      accountRefetch();
      dispatch(setCurrencyData({ currency: null }));
      dispatch(setTransactionId(""));
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

  useEffect(() => {
    if (tranData) {
      setValue("account", tranData.account);
      setValue("amount", safeToString(tranData.amount));
      setValue("category", tranData.category);
      setValue("counterParty", tranData.counterParty);
      setValue("date", parseDateFromServer(tranData.date));
    }
  }, [tranData, setValue]);

  useEffect(() => {
    if (isObjectValid(currencyTableData) && amount) {
      const convertedAmount =
        mainCurrency === currencyTableData.namekurs
          ? amount
          : amount * +currencyTableData.kurs;
      const toString = String(convertedAmount);
      setValue("amount", toString);
    }
  }, [currencyTableData.kurs, setValue]);

  useEffect(() => {
    (async () => {
      const formsError = await trigger();
      if (!formsError) {
        if (errors.account || errors.amount || errors.date) {
          toast(
            <div className="text-red-600">
              <span>Заполните обязательные поля: </span>
              <div>(Счет, Сумма, Дата и время)</div>
            </div>,
          );
        }

        if (errors.account?.message)
          toast(
            <span className="text-red-600">{errors.account?.message}</span>,
          );
        if (errors.amount?.message)
          toast(<span className="text-red-600">{errors.amount?.message}</span>);
        if (errors.category?.message || errors.counterParty?.message)
          toast(
            <span className="text-red-600">
              {errors.category?.message ?? errors.counterParty?.message}
            </span>,
          );

        return;
      }
    })();
  }, [isButtonClicked]);

  const handleClickBankName = (select: ChangeEvent<HTMLSelectElement>) => {
    setSelectBank(select.target.value);
    dispatch(currencyTableModal(true));
  };

  const onClose = () => {
    dispatch(openModal(["expense", false]));
    dispatch(setCurrencyData({ currency: null }));
    dispatch(setTransactionId(""));
    reset();
  };

  return (
    <SwitchModal
      handleClick={onClose}
      modalID="expense"
      className="bg-white rounded-4xl min-h-[535px] w-[480px]   pt-6 pb-6  px-8 min-w-md"
    >
      <div className="flex justify-between items-center mb-4 ">
        <h2 className="text-3xl font-bold">
          {tranId ? "Редактировать" : "Новый рассход"}
        </h2>
        <Button className="cursor-pointer" submitHandler={onClose}>
          <img src={closeIcon} />
        </Button>
      </div>
      <form
        className="space-y-4"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <div>
          <input
            type="text"
            placeholder="Со счет"
            list="accounts"
            id="country"
            className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
            {...register("account", {
              setValueAs: (value) => value?.trim(),
              required: true,
              validate: (value) => {
                const isAccount = accounts?.some(
                  (item) => value?.trim() === item.account,
                );

                return isAccount || "Аккаунт не найден";
              },
            })}
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

        <div>
          <input
            type="text"
            placeholder={`Сумма, ${mainCurrency}`}
            className="w-full p-3 bg-gray-200 rounded-lg border border-gray-300 mb-4"
            {...register("amount", {
              setValueAs: (value) => value?.trim(),
              required: true,
              validate: (value) => {
                const isNumberValid = numberValid(value || "0");
                const account = accounts?.find(
                  (item) => item.account === getValues("account"),
                );
                const isNumberToMatch = account
                  ? amount > account?.allAmount
                  : null;

                if (isNumberToMatch) {
                  return "Сумма вычетания больше чем сумма аккаунта!";
                } else {
                  return isNumberValid || true;
                }
              },
            })}
          />

          <SelectCurrency
            handleClickBankName={handleClickBankName}
            tranId={tranId}
            tranData={tranData}
            amount={amount}
          />
        </div>

        <div>
          <input
            type="text"
            list="category"
            placeholder="Категория"
            className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
            {...register("category", {
              setValueAs: (value) => value?.trim(),
              maxLength: {
                value: 15,
                message: "Максимум 15 символов",
              },
              validate: (value) => {
                return (value && value.length >= 15) || true;
              },
            })}
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
            {...register("counterParty", {
              setValueAs: (value) => value?.trim(),
              maxLength: {
                value: 15,
                message: "Максимум 15 символов",
              },
              validate: (value) => {
                return (value && value.length >= 15) || true;
              },
            })}
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

        <Button
          submitHandler={() => setIsButtonClicked((prev) => !prev)}
          className="w-full  py-2 bg-gradient-to-r from-blue-400 to-green-400 text-white font-semibold rounded-lg cursor-pointer"
        >
          Добавить доход
        </Button>
      </form>
      <ChooseBankModal selectedBank={selectBank} />
    </SwitchModal>
  );
};

export default ExpenseModal;
