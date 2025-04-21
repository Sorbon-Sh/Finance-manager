import { useAppDispatch, useAppSelector } from "../../hooks/useReduxTypedHooks";
import { openModal, setTransactionId } from "../../redux/slices/StateAndData";
import SwitchModal from "./SwitchModal";
import { toast } from "react-toastify";
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
import { useUpdateTransactionMutation } from "../../api/rtk-query/updateTranData";
import Button from "../buttons/Button";
import { ChangeEvent, useEffect, useState } from "react";
import ChooseBankModal from "./ChooseBankModal";
import {
  currencyTableModal,
  setCurrencyData,
} from "../../redux/slices/currencySlice";
import useMainCurrency from "../../hooks/useMainCurrency";
import SelectCurrency from "../contentComponents/SelectCurrency";
import { isObjectValid } from "../../utility/isObjectValid";
import {
  useGetAccountQuery,
  useIncomeAmountAccountMutation,
  useLazyGetAccountQuery,
} from "../../api/rtk-query/accountRequest";
import { numberValid } from "../../utility/numberValid";
import { safeToString } from "../../utility/safeToString";
import { parseDateFromServer } from "../../utility/parseDateFromServer";

const IncomeModal = () => {
  const dispatch = useAppDispatch();
  const [isButtonClicked, setIsButtonClicked] = useState<boolean>(false);
  const [selectBank, setSelectBank] = useState<string>("");
  const mainCurrency = useMainCurrency();
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
  const [incomeAmountAccount] = useIncomeAmountAccountMutation();
  const tranId = useAppSelector((state) => state.stateAndData.transactionId);
  const tranData = tranId
    ? transactions?.find((elem) => elem.id === tranId)
    : null;
  const accountData = tranId
    ? accounts?.find((elem) => elem.account === tranData?.account)
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
    getValues,
    watch,
    formState: { errors },
    trigger,
  } = useForm<Inputs>();
  const watchedAmount = watch("amount");
  const amount = parseFloat(watchedAmount || "0");
  const watchedDate = watch("date");
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    dispatch(openModal(["income", false]));
    const toastId = toast.loading("Сохранение данных...");
    try {
      const amountToNumber = parseFloat(data.amount || "0");
      const updateAccount = async () => {
        const { data: tranData } = await getTransactions();
        const { data: accData } = await getAccount("accounts");
        await incomeAmountAccount([accData, tranId, tranData, data]).unwrap();
      };

      if (tranId) {
        //* Обработаывать страные данные журнала и отправить их в accounts перед изменить их в transactions
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
      //* Суммировать последние  данные если не редактируем транзакции
      //*
      if (!tranId) {
        await insertTransaction([
          "transactions",
          currencyTableData,
          data,
          amountToNumber,
          "income",
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
    if (!tranId) reset();
  }, [tranData, setValue]);

  useEffect(() => {
    if (isObjectValid(currencyTableData) && amount) {
      const convertedAmount =
        mainCurrency === currencyTableData.namekurs
          ? amount
          : amount * +currencyTableData.kurs;

      setValue("amount", safeToString(convertedAmount));
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
    dispatch(openModal(["income", false]));
    dispatch(setTransactionId(""));
    dispatch(setCurrencyData({ currency: null }));
    reset();
  };

  return (
    <SwitchModal
      handleClick={onClose}
      modalID="income"
      className="bg-white rounded-4xl min-h-[535px] w-[480px]   pt-6 pb-6  px-8 min-w-md"
    >
      <div className="flex justify-between items-center mb-4 ">
        <h2 className="text-3xl font-bold">
          {tranId ? "Редактировать" : "Новый доход"}
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
            placeholder="На счет"
            list="accounts"
            id="country"
            className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
            {...register("account", {
              required: true,
              setValueAs: (value) => value?.trim(),
              validate: (value) => {
                const isAccount = accounts?.some(
                  (item) => value?.trim() === item.account,
                );

                return isAccount || "Аккаунт не найден";
              },
            })}
          />
          <datalist className="bg-white w-16 p-2" id="accounts">
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
                const isAccountChange =
                  tranId && accountData?.account !== getValues("account");
                const isNumberToMatch = accountData
                  ? accountData?.allAmount < amount
                  : null;

                if (isAccountChange && isNumberToMatch) {
                  return "Сумма превышает сумму предыдущего аккаунта!";
                }

                const isNumberValid = numberValid(value || "0");
                return isNumberValid || true;
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
                value: 10,
                message: "Максимум 10 символов",
              },
              validate: (value) => {
                return (value && value.length >= 10) || true;
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
                value: 10,
                message: "Максимум 10 символов",
              },
              validate: (value) => {
                return (value && value.length >= 10) || true;
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
            rules={{ required: true }}
            name="date"
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

export default IncomeModal;
