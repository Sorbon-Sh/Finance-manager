import { useAppDispatch } from "../../hooks/useReduxTypedHooks";
import { openModal } from "../../redux/slices/StateAndData";
import SwitchModal from "./SwitchModal";
import closeIcon from "../../assets/closeIcon.svg";
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
      className="bg-white rounded-4xl h-[535px] w-[480px]  pt-6 pb-6  px-8 min-w-md"
    >
      <div className="flex justify-between items-center mb-4 ">
        <h2 className="text-3xl font-bold">Новый аккаунт</h2>
        <button
          className="cursor-pointer"
          onClick={() => dispatch(openModal(["createAccount", false]))}
        >
          <img src={closeIcon} />
        </button>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="relative dropdown">
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
            className="w-full p-3 bg-gray-200 rounded-lg border border-gray-300"
            {...register("sum")}
          />
        </div>

        <div className="flex items-center space-x-2"></div>
        <button className="w-full mt-4 py-2 bg-gradient-to-r from-blue-400 to-green-400 text-white font-semibold rounded-lg cursor-pointer">
          Создать аккаунт
        </button>
      </form>
    </SwitchModal>
  );
};

export default CreateAccount;
