import { useAppDispatch } from "../../hooks/useReduxTypedHooks";
import { openModal } from "../../redux/slices/StateAndData";
import SwitchModal from "./SwitchModal";
import closeIcon from "../../assets/closeIcon.svg";
import attentionIcon from "../../assets/attention-icon.svg";
import { useForm, SubmitHandler } from "react-hook-form";
import { useCreateAccountMutation } from "../../api/rtk-query/insertToDataBase";
import { Inputs } from "../../types/types";

const CreateAccount = () => {
  const dispatch = useAppDispatch();
  const [createAccount] = useCreateAccountMutation();
  const { register, handleSubmit } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      await createAccount(["accounts", data]).unwrap();
    } catch (err) {
      console.log("Error: ", err);
      throw new Error(`Error to sending data to DataBase`);
    }
  };

  return (
    <SwitchModal
      modalID="createAccount"
      className="bg-white rounded-4xl h-[463px] w-[480px]  pt-6 px-8"
    >
      <div className="flex justify-between items-center mb-4 ">
        <h2 className="text-3xl font-bold">Добавление нового счета</h2>
        <button
          className="cursor-pointer"
          onClick={() => dispatch(openModal(["createAccount", false]))}
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
          <input
            placeholder="Валюта"
            className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
            {...register("currency")}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Имя счета"
            className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
            {...register("account")}
          />
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Стратовый баланс"
            className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
            {...register("allAmount")}
          />
        </div>

        <div className="flex items-baseline gap-x-2">
          <img src={attentionIcon} />
          <span className="text-gray-400">
            Это сумма, которая есть на счете на момент его добавления в Fin
            manager
          </span>
        </div>
        <button
          onClick={() => dispatch(openModal(["createAccount", false]))}
          className="w-full  py-4 bg-gradient-to-r from-blue-400 to-green-400  font-semibold rounded-lg cursor-pointer"
        >
          Добавить счет
        </button>
      </form>
    </SwitchModal>
  );
};

export default CreateAccount;
