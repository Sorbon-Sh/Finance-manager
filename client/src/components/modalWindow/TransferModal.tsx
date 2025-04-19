import { useAppDispatch, useAppSelector } from "../../hooks/useReduxTypedHooks";
import { openModal, setTransactionId } from "../../redux/slices/StateAndData";
import SwitchModal from "./SwitchModal";
import closeIcon from "../../assets/closeIcon.svg";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useGetSumQuery } from "../../api/rtk-query/insertTranData";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import DatePicker from "react-multi-date-picker";
import { useTransferRequestMutation } from "../../api/rtk-query/transferRequest";
import { Inputs } from "../../types/indexTypes";
import Button from "../buttons/Button";
import { ChangeEvent, useEffect, useState } from "react";
import {
  useGetAccountQuery,
  useLazyGetAccountQuery,
} from "../../api/rtk-query/accountRequest";
import SelectCurrency from "../contentComponents/SelectCurrency";
import {
  currencyTableModal,
  setCurrencyData,
} from "../../redux/slices/currencySlice";
import { toast } from "react-toastify";
import { isObjectValid } from "../../utility/isObjectValid";
import useMainCurrency from "../../hooks/useMainCurrency";
import ChooseBankModal from "./ChooseBankModal";
import { safeToString } from "../../utility/safeToString";
import { numberValid } from "../../utility/numberValid";
import { parseDateFromServer } from "../../utility/parseDateFromServer";

const TransferModal = () => {
  const [isButtonClicked, setIsButtonClicked] = useState<boolean>(false);
  const [selectBank, setSelectBank] = useState<string>("");
  const { data: accounts, refetch: accountRefetch } =
    useGetAccountQuery("accounts");
  const { refetch: tranRefetch, data: transactions } =
    useGetSumQuery("transactions");
  const [transferRequest] = useTransferRequestMutation();
  const [getAccount] = useLazyGetAccountQuery();
  const mainCurrency = useMainCurrency();
  const tranId = useAppSelector((state) => state.stateAndData.transactionId);
  const tranData = tranId
    ? transactions?.find((elem) => elem.id === tranId)
    : null;
  // const accountData = tranId
  //   ? accounts?.find((elem) => elem.account === tranData?.account)
  //   : null;
  const dispatch = useAppDispatch();
  const currencyTableData = useAppSelector(
    (state) => state.currencySlice.currency,
  );
  const {
    register,
    handleSubmit,
    control,
    reset,
    getValues,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<Inputs>();
  const watchedAmount = watch("amount");
  const watchedDate = watch("date");
  const watchedFromAccount = watch("fromAccount");
  const watchedToAccount = watch("toAccount");
  const amount = parseFloat(watchedAmount || "0");
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    dispatch(openModal(["transfer", false]));
    const toastId = toast.loading("Сохранение данных...");
    try {
      const amountToNumber = parseFloat(data.amount || "0");
      const { data: accData } = await getAccount("accounts");

      await transferRequest([
        accData,
        data,
        watchedDate,
        tranData,
        amountToNumber,
        "transfer",
      ]);
      toast.update(toastId, {
        render: "Сумма успешно переведена!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      tranRefetch();
      accountRefetch();
      dispatch(setCurrencyData({ currency: null }));
      dispatch(setTransactionId(""));
      reset();
    } catch (err) {
      console.log("Error", err);
      throw new Error(`Error to sending data to DataBase`);
    }
  };

  useEffect(() => {
    if (tranData) {
      setValue(
        "fromAccount",
        (tranData.tranCategory === "transfer" &&
          JSON.parse(tranData.account).fromAccount) ||
          null,
      );
      setValue(
        "toAccount",
        (tranData.tranCategory === "transfer" &&
          JSON.parse(tranData.account).toAccount) ||
          null,
      );
      setValue(
        "amount",
        safeToString(
          tranData?.tranCategory === "transfer" ? tranData.amount : null,
        ),
      );

      setValue("date", parseDateFromServer(tranData.date));
    }
  }, [tranData, setValue]);

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

        if (errors.fromAccount?.type === "validate")
          toast(
            <span className="text-red-600">{errors.fromAccount.message}</span>,
          );
        if (errors.toAccount?.type === "validate")
          toast(
            <span className="text-red-600">{errors.toAccount?.message}</span>,
          );
        if (errors.amount?.type === "validate")
          toast(<span className="text-red-600">{errors.amount.message}</span>);

        return;
      }
    })();
  }, [isButtonClicked]);

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

  const handleClickBankName = (select: ChangeEvent<HTMLSelectElement>) => {
    setSelectBank(select.target.value);
    dispatch(currencyTableModal(true));
  };

  const onClose = () => {
    dispatch(openModal(["transfer", false]));
    dispatch(setCurrencyData({ currency: null }));
    dispatch(setTransactionId(""));
    reset();
  };

  return (
    <SwitchModal
      handleClick={onClose}
      modalID="transfer"
      className="bg-white rounded-4xl min-h-[500px] w-[480px]   pt-6 pb-6  px-8 min-w-md"
    >
      <div className="flex justify-between items-center mb-4 ">
        <h2 className="text-3xl font-bold">
          {tranId ? "Редактировать" : "Новый перевод"}
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
            placeholder="Со счета"
            list="fromAccount"
            id="country"
            className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
            {...register("fromAccount", {
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
          <datalist className=" bg-white w-16 p-2" id="fromAccount">
            {accounts &&
              accounts
                .filter(
                  (fromAccount) => fromAccount.account !== watchedToAccount,
                )
                .map((fromAccount) => (
                  <option key={fromAccount.id} value={fromAccount.account} />
                ))}
          </datalist>
        </div>
        <div>
          <input
            type="text"
            list="toAccount"
            placeholder="На счет"
            className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
            {...register("toAccount", {
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
          <datalist className="bg-white w-16 p-2" id="toAccount">
            {accounts &&
              accounts
                .filter((toAccount) => toAccount.account !== watchedFromAccount)
                .map((toAccount) => (
                  <option key={toAccount.id} value={toAccount.account} />
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
                  (item) => item.account === getValues("fromAccount"),
                );
                const isNumberToMatch = account
                  ? amount > account.allAmount
                  : null;

                const fromAccount =
                  account?.account === getValues("fromAccount");

                if (fromAccount && isNumberToMatch) {
                  return "Сумма превышает сумму аккаунта!";
                } else {
                  return isNumberValid || true;
                }
              },
            })}
          />

          <SelectCurrency
            handleClickBankName={handleClickBankName}
            amount={amount}
          />
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
          Добавить перевод
        </Button>
      </form>
      <ChooseBankModal selectedBank={selectBank} />
    </SwitchModal>
  );
};

export default TransferModal;
