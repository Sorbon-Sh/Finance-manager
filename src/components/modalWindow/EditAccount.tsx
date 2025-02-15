import { useAppDispatch, useAppSelector } from "../../hooks/useReduxTypedHooks";
import { openModal } from "../../redux/slices/StateAndData";
import SwitchModal from "./SwitchModal";
import closeIcon from "../../assets/closeIcon.svg";
import { useForm, SubmitHandler } from "react-hook-form";
import { useGetAccountQuery } from "../../api/rtk-query/insertToDataBase";
import { Inputs } from "../../types/types";
import { useUpdateAccountMutation } from "../../api/rtk-query/updateData";
import AccountList from "../AccountItems";

const EditAccount = () => {
  const dispatch = useAppDispatch();
  const [updateAccount] = useUpdateAccountMutation();
  const { data: account } = useGetAccountQuery();
  const accountId = useAppSelector((state) => state.stateAndData.accountId);
  console.log(accountId);

  const accountName = () => {
    if (account) {
      return account
        .filter((account) => account.id === accountId)
        .map((name) => name.account);
    }
  };

  const { register, handleSubmit } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      await updateAccount([data, accountId]);
    } catch (err) {
      console.log("Error: ", err);
      throw new Error(`Error to sending data to DataBase`);
    }
  };

  return (
    <SwitchModal
      modalID="editAccount"
      className="bg-white rounded-4xl h-[463px] w-[480px]  pt-6 px-8"
    >
      {accountId ? (
        <section>
          <div className="flex justify-between items-center mb-4 ">
            <h2 className="text-3xl font-bold">Редактирование</h2>
            <button
              className="cursor-pointer"
              onClick={() => dispatch(openModal(["editAccount", false]))}
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
                type="text"
                placeholder="Имя счета"
                value={accountName()}
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
            <p className="text-red-400 ">Скрыть</p>
            <p className="text-red-400">Удалить</p>
            <button className="w-full  py-4 bg-gradient-to-r from-blue-400 to-green-400  font-semibold rounded-lg cursor-pointer">
              Изменить счет
            </button>
          </form>
        </section>
      ) : (
        <AccountList />
      )}
    </SwitchModal>
  );
};

export default EditAccount;
