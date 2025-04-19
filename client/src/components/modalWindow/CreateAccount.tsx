import { useAppDispatch } from "../../hooks/useReduxTypedHooks";
import { openModal, setAccountId } from "../../redux/slices/StateAndData";
import SwitchModal from "./SwitchModal";
import closeIcon from "../../assets/closeIcon.svg";
import attentionIcon from "../../assets/attention-icon.svg";
import { useForm, SubmitHandler } from "react-hook-form";
import { Inputs } from "../../types/indexTypes";
import Button from "../buttons/Button";
import { useCapitalize } from "../../hooks/useCapitalize";
import { useCreateAccountMutation } from "../../api/rtk-query/accountRequest";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { numberValid } from "../../utility/numberValid";

const CreateAccount = () => {
  const [isButtonClicked, setIsButtonClicked] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const [createAccount] = useCreateAccountMutation();
  const { toUpperCase } = useCapitalize();
  const {
    register,
    handleSubmit,
    reset,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    dispatch(openModal(["createAccount", false]));
    const toastId = toast.loading("Сохранение данных...");
    try {
      const amountToNumber = parseFloat(getValues("allAmount") || "0");
      const accountName = toUpperCase(data.account || "");
      await createAccount([data, amountToNumber, accountName]).unwrap();
      toast.update(toastId, {
        render: "Аккаунт успешно создан!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      dispatch(setAccountId(""));
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
      console.log("Error: ", err);
      throw new Error(`Error to sending data to DataBase`);
    }
  };

  useEffect(() => {
    (async () => {
      const formsError = await trigger();
      if (!formsError) {
        if (errors.account || errors.allAmount) {
          toast(<span className="text-red-600">Заполните все поля</span>
          );
        }

        if (errors.account?.message)
          toast(
            <span className="text-red-600">{errors.account?.message}</span>
          );
        if (errors.allAmount?.type === "validate")
          toast(
            <span className="text-red-600">{errors.allAmount.message}</span>
          );

        return;
      }
    })();
  }, [isButtonClicked]);

  const onClose = () => {
    dispatch(openModal(["createAccount", false]));
    dispatch(setAccountId(""));
    reset();
  };

  return (
    <SwitchModal
      handleClick={onClose}
      modalID="createAccount"
      className="bg-white rounded-4xl h-96 max-w-md  pt-6 px-8 pb-5"
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

        <input
          type="text"
          placeholder="Стартовый баланс"
          className="w-full p-3 bg-gray-200 rounded-lg border border-gray-300 mb-4"
          {...register("allAmount", {
            setValueAs: (value) => value?.trim(),
            required: true,
            validate: (value) => {
              if (!value) return;
              const isNumberValid = numberValid(value)
               return isNumberValid || true;

            },
          })}
        />

        <div className="flex items-baseline gap-x-2">
          <img src={attentionIcon} />
          <span className="text-gray-400">
            Это сумма, которая есть на счете на момент его добавления в Fin
            manager
          </span>
        </div>

        <Button
          submitHandler={() => setIsButtonClicked((prev) => !prev)}
          className="w-full  py-4 bg-gradient-to-r from-blue-400 to-green-400  font-semibold rounded-lg cursor-pointer"
        >
          Добавить счет
        </Button>
      </form>
    </SwitchModal>
  );
};

export default CreateAccount;
