import { useAppDispatch } from "../../hooks/useReduxTypedHooks";
import { openModal, setAccountId } from "../../redux/slices/StateAndData";
import SwitchModal from "./SwitchModal";
import closeIcon from "../../assets/closeIcon.svg";
import attentionIcon from "../../assets/attention-icon.svg";
import { useForm, SubmitHandler } from "react-hook-form";
import { useCreateAccountMutation } from "../../api/rtk-query/insertTranData";
import { Inputs } from "../../types/types";
import Button from "../buttons/Button";
import { useCapitalize } from "../../hooks/useCapitalize";
import { useState } from "react";

const CreateAccount = () => {
  const [amountError, setAmountError] = useState<string>("");
  const dispatch = useAppDispatch();
  const [createAccount] = useCreateAccountMutation();
  const { toUpperCase } = useCapitalize();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const currency = toUpperCase(data.currency || "");
      await createAccount([data, currency]).unwrap();
      dispatch(setAccountId(""));
      reset();
    } catch (err) {
      reset();
      console.log("Error: ", err);
      throw new Error(`Error to sending data to DataBase`);
    }
  };

  const onClose = () => {
    dispatch(openModal(["createAccount", false]));
    dispatch(setAccountId(""));
    setAmountError("");
    reset();
  };

  return (
    <SwitchModal
      handleClick={onClose}
      modalID="createAccount"
      className="bg-white rounded-4xl min-h-[463px] w-[480px]  pt-6 px-8 pb-5"
    >
      <div className="flex justify-between items-center mb-4 ">
        <h2 className="text-3xl font-bold">Добавление счета</h2>
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
            placeholder="Валюта"
            className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
            {...register("currency", { required: true })}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Имя счета"
            className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
            {...register("account", { required: true })}
          />
        </div>
        <div className="flex space-x-2">
          <input
            type="number"
            placeholder="Стратовый баланс"
            className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
            {...register("allAmount", {
              required: true,
              valueAsNumber: true,
              validate: (value) => {
                const isNumPlus = value && value < 0 ? true : false;
                if (isNumPlus) {
                  setAmountError("Число не может быть отрецательным");
                  return false;
                } else {
                  setAmountError("");
                }

                return true;
              },
            })}
          />
        </div>

        <div className="flex items-baseline gap-x-2">
          <img src={attentionIcon} />
          <span className="text-gray-400">
            Это сумма, которая есть на счете на момент его добавления в Fin
            manager
          </span>
        </div>
        <div className="flex flex-col text-center gap-y-2 text-red-600">
          {errors.account || errors.allAmount || errors.currency ? (
            <span>Заполните все поля</span>
          ) : null}

          <span>{amountError && amountError}</span>
        </div>

        <Button className="w-full  py-4 bg-gradient-to-r from-blue-400 to-green-400  font-semibold rounded-lg cursor-pointer">
          Добавить счет
        </Button>
      </form>
    </SwitchModal>
  );
};

export default CreateAccount;
