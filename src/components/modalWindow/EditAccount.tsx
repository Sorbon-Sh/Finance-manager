import { useAppDispatch, useAppSelector } from "../../hooks/useReduxTypedHooks";
import { openModal, setAccountId } from "../../redux/slices/StateAndData";
import SwitchModal from "./SwitchModal";
import closeIcon from "../../assets/closeIcon.svg";
import { useForm, SubmitHandler } from "react-hook-form";
import { useGetAccountQuery } from "../../api/rtk-query/insertTranData";
import { Inputs } from "../../types/types";
import { useUpdateAccountMutation } from "../../api/rtk-query/updateTranData";
import AccountList from "../contentComponents/AccountList";
import Button from "../buttons/Button";

const EditAccount = () => {
  const dispatch = useAppDispatch();
  const [updateAccount] = useUpdateAccountMutation();
  const { data: account } = useGetAccountQuery("accounts");
  const accountId = useAppSelector((state) => state.stateAndData.accountId);
  const { register, handleSubmit, reset, setValue } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      await updateAccount([data, accountId]);
      dispatch(setAccountId(""));
      dispatch(openModal(["editAccount", false]));
      reset();
    } catch (err) {
      console.log("Error: ", err);

      throw new Error(`Error to sending data to DataBase`);
    }
  };

  const accountName =
    account && account.find((account) => account.id === accountId);
  setValue("account", accountName ? accountName.account : "");

  const onClose = () => {
    dispatch(openModal(["editAccount", false]));
    dispatch(setAccountId(""));
    reset();
  };

  return (
    <SwitchModal
      handleClick={onClose}
      modalID="editAccount"
      className="bg-white rounded-4xl h-[463px] w-[480px]  pt-6 px-8"
    >
      {accountId ? (
        <section>
          <div className="flex justify-between items-center mb-4 ">
            <h2 className="text-3xl font-bold">Редактирование</h2>
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
            <p className="text-red-400 ">Скрыть</p>
            <p className="text-red-400">Удалить</p>
            <Button className="w-full  py-4 bg-gradient-to-r from-blue-400 to-green-400  font-semibold rounded-lg cursor-pointer">
              Изменить счет
            </Button>
          </form>
        </section>
      ) : (
        <AccountList />
      )}
    </SwitchModal>
  );
};

export default EditAccount;
