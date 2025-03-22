import { useAppDispatch, useAppSelector } from "../../hooks/useReduxTypedHooks";
import { openModal, setTransactionId } from "../../redux/slices/StateAndData";
import SwitchModal from "./SwitchModal";
import closeIcon from "../../assets/closeIcon.svg";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import {
  useGetAccountQuery,
  useGetSumQuery,
  useLazyGetAccountQuery,
} from "../../api/rtk-query/insertTranData";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import DatePicker from "react-multi-date-picker";
import { useTransferRequestMutation } from "../../../transferRequest";
import { Inputs } from "../../types/types";
import Button from "../buttons/Button";
import { useEffect } from "react";

const TransferModal = () => {
  const { data: accounts, refetch: accountRefetch } =
    useGetAccountQuery("accounts");
  const { refetch: tranRefetch, data: transactions } =
    useGetSumQuery("transactions");
  const [transferRequest] = useTransferRequestMutation();
  const [getAccount] = useLazyGetAccountQuery();
  const tranId = useAppSelector((state) => state.stateAndData.transactionId);
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    control,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    dispatch(openModal(["transfer", false]));
    try {
      const { data: accData } = await getAccount("accounts");
      //* Для дебага
      if (!accData || accData.length === 0)
        console.error("❌ Ошибка: данные аккаунтов пустые!");

      await transferRequest([accData, data, "transfer"]);

      tranRefetch();
      accountRefetch();
      console.log("tranId Пустой?: ", tranId);
      reset();
    } catch (err) {
      console.log("Error", err);
      throw new Error(`Error to sending data to DataBase`);
    }
  };

  const onClose = () => {
    dispatch(openModal(["transfer", false]));
    dispatch(setTransactionId(""));
    reset();
  };

  const tranData = tranId
    ? transactions && transactions.find((elem) => elem.id === tranId)
    : null;

  useEffect(() => {
    setValue(
      "fromAccount",
      (tranData?.tranCategory === "transfer" &&
        JSON.parse(tranData.account).fromAccount) ||
        null
    );
    setValue(
      "toAccount",
      (tranData?.tranCategory === "transfer" &&
        JSON.parse(tranData.account).toAccount) ||
        null
    );
    setValue(
      "amount",
      (tranData?.tranCategory === "transfer" && tranData.amount) || null
    );
  }, [tranData, setValue]);

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
            placeholder="Со счета"
            list="accounts"
            id="country"
            className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
            {...register("fromAccount", {
              required: true,
              setValueAs: (value) => value?.trim(),
              validate: (value) => {
                const isAccount = accounts?.some(
                  (item) => value?.trim() === item.account
                );
                console.log(isAccount);

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
            list="toAccount"
            placeholder="На счет"
            className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
            {...register("toAccount", {
              required: true,
              setValueAs: (value) => value?.trim(),
              validate: (value) => {
                const isAccount = accounts?.some(
                  (item) => value?.trim() === item.account
                );
                console.log(isAccount);

                return isAccount || "Аккаунт не найден";
              },
            })}
          />
          <datalist className=" bg-white w-16 p-2" id="toAccount">
            {accounts &&
              accounts
                .filter(
                  (toAccount) => toAccount.account !== getValues("fromAccount")
                )
                .map((toAccount) => (
                  <option
                    key={toAccount.id}
                    value={toAccount.account}
                    className="bg-green-300 p-1"
                  />
                ))}
          </datalist>
        </div>

        <div>
          <input
            type="number"
            placeholder="Сумма, TJS"
            className="w-full p-3 bg-gray-200 rounded-lg border border-gray-300 mb-4"
            {...register("amount", {
              valueAsNumber: true,
              required: true,
              validate: (value) => {
                const isNumPlus = value && value < 0 ? true : false;
                return !isNumPlus || "Число не может быть отрецательным";
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
        <div className="flex flex-col text-red-600 text-center">
          {errors.account ||
          errors.amount ||
          errors.category ||
          errors.counterParty ||
          errors.date ? (
            <span>Заполните все поля</span>
          ) : null}
          <span>
            {errors.fromAccount?.type === "validate"
              ? errors.fromAccount.message
              : errors.toAccount?.type === "validate"
              ? errors.toAccount?.message
              : null}
          </span>
          <span>
            {errors.amount?.type === "validate" ? errors.amount.message : null}
          </span>
        </div>
        <Button className="w-full  py-2 bg-gradient-to-r from-blue-400 to-green-400 text-white font-semibold rounded-lg cursor-pointer">
          Добавить перевод
        </Button>
      </form>
    </SwitchModal>
  );
};

export default TransferModal;
