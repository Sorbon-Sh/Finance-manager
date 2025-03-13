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

const TransferModal = () => {
  const { data: accounts, refetch: accountRefetch } =
    useGetAccountQuery("accounts");
  const { refetch: tranRefetch, data: transactions } =
    useGetSumQuery("transactions");
  const [transferRequest] = useTransferRequestMutation();
  const [getAccount] = useLazyGetAccountQuery();
  const tranId = useAppSelector((state) => state.stateAndData.transactionId);
  const dispatch = useAppDispatch();
  const { register, handleSubmit, control, reset, getValues, setValue } =
    useForm<Inputs>();
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
  };

  const tranData = tranId
    ? transactions && transactions.find((elem) => elem.id === tranId)
    : null;

  setValue(
    "fromAccount",
    (tranData?.tranCategory === "transfer" &&
      JSON.parse(tranData.account).fromAccount) ||
      ""
  );
  setValue(
    "toAccount",
    (tranData?.tranCategory === "transfer" &&
      JSON.parse(tranData.account).toAccount) ||
      ""
  );
  setValue(
    "amount",
    (tranData?.tranCategory === "transfer" && tranData.amount) || 0
  );

  return (
    <SwitchModal
      handleClick={onClose}
      modalID="transfer"
      className="bg-white rounded-4xl h-[535px] w-[480px]   pt-6 pb-6  px-8 min-w-md"
    >
      <div className="flex justify-between items-center mb-4 ">
        <h2 className="text-3xl font-bold">Новый перевод</h2>
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
            {...register("fromAccount")}
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
            {...register("toAccount")}
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

        <div className="">
          <input
            type="number"
            placeholder="Сумма, TJS"
            className="w-full p-3 bg-gray-200 rounded-lg border border-gray-300 mb-4"
            {...register("amount", { valueAsNumber: true })}
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
          Добавить перевод
        </button>
      </form>
    </SwitchModal>
  );
};

export default TransferModal;
