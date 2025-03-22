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
import { useEffect } from "react";

const EditAccount = () => {
  const dispatch = useAppDispatch();
  const [updateAccount] = useUpdateAccountMutation();
  const { data: account } = useGetAccountQuery("accounts");
  const accountId = useAppSelector((state) => state.stateAndData.accountId);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Inputs>();
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
  useEffect(() => {
    setValue("account", accountName ? accountName.account : "");
  }, [accountName, setValue]);

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
                {...register("account", {
                  setValueAs: (value) => value?.trim(),
                  required: true,
                  maxLength: {
                    value: 15,
                    message: "Максимум 15 символов",
                  },
                  validate: (value) => {
                    return (value && value.length >= 15) || true;
                  },
                })}
              />
            </div>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Стратовый баланс"
                className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
                {...register("allAmount", {
                  required: true,
                  validate: (value) => {
                    const isNumPlus = value && value < 0 ? true : false;
                    return !isNumPlus || "Число не может быть отрецательным";
                  },
                })}
              />
            </div>
            <p className="text-red-400 ">Скрыть</p>
            <p className="text-red-400">Удалить</p>
            <div className="text-center flex flex-col text-red-600">
              {errors.account || errors.allAmount ? (
                <span>Заполните все поля</span>
              ) : null}

              <span>{errors.account?.message}</span>
              <span>
                {errors.allAmount?.type === "validate"
                  ? errors.allAmount.message
                  : null}
              </span>
            </div>
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
