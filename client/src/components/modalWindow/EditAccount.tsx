import { useAppDispatch, useAppSelector } from "../../hooks/useReduxTypedHooks";
import { openModal, setAccountId } from "../../redux/slices/StateAndData";
import SwitchModal from "./SwitchModal";
import closeIcon from "../../assets/closeIcon.svg";
import { useForm, SubmitHandler } from "react-hook-form";
import { Inputs } from "../../types/indexTypes";
import AccountList from "../contentComponents/AccountList";
import Button from "../buttons/Button";
import { useEffect,useState } from "react";
import {
  useDeleteAccountMutation,
  useGetAccountQuery,
  useUpdateAccountMutation,
} from "../../api/rtk-query/accountRequest";
import { toast } from "react-toastify";
import { numberValid } from "../../utility/numberValid";

const EditAccount = () => {
  const [isButtonClicked, setIsButtonClicked] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const [deleteAccount] = useDeleteAccountMutation();
  const [updateAccount] = useUpdateAccountMutation();
  const { data: account } = useGetAccountQuery("accounts");
  const accountId = useAppSelector((state) => state.stateAndData.accountId);
  const accountName =
  account && account.find((account) => account.id === accountId);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    dispatch(openModal(["editAccount", false]));
    const toastId = toast.loading("Сохранение данных...");
    try {
      const amountToNumber = parseFloat(getValues("allAmount") || "0");
      await updateAccount([data,amountToNumber, accountId]).unwrap();
            toast.update(toastId, {
              render: "Аккаунт успешно обновлен!",
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
    setValue("account", accountName ? accountName.account : null);
  }, [accountName, setValue]);

    useEffect(() => {
      (async () => {
        const formsError = await trigger();
        if (!formsError) {
          if (errors.account || errors.allAmount) {
            toast(
                <span className="text-red-600">Заполните все поля </span>
             
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
    dispatch(openModal(["editAccount", false]));
    dispatch(setAccountId(""));
    reset();
  };

  const onDelete = async () => {
    const toastId = toast.loading("Сохранение данных...");
    dispatch(openModal(["editAccount", false]));
    dispatch(setAccountId(""));
   await deleteAccount([accountId]);
   toast.update(toastId, {
    render: "Аккаунт успешно удален",
    type: "success",
    isLoading: false,
    autoClose: 2000,
  });
  };

  return (
    <SwitchModal
      handleClick={onClose}
      modalID="editAccount"
      className="bg-white rounded-4xl h-96 min-w-md pt-6 px-8"
    >
      {accountId ? (
        <section>
          <div className="flex justify-between items-center mb-4 ">
            <h2 className="text-3xl font-bold">Редактирование</h2>
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
            </div>
            <Button className="text-red-400 cursor-pointer" submitHandler={onDelete}>
              Удалить
            </Button>
            <Button submitHandler={() => setIsButtonClicked((prev) => !prev)} className="w-full  py-4 bg-gradient-to-r from-blue-400 to-green-400  font-semibold rounded-lg cursor-pointer">
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
