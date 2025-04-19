import { useAppDispatch } from "../../hooks/useReduxTypedHooks";
import { openModal } from "../../redux/slices/StateAndData";
import SwitchModal from "./SwitchModal";
import closeIcon from "../../assets/closeIcon.svg";
import { useForm, SubmitHandler } from "react-hook-form";
import { Inputs } from "../../types/indexTypes";
import Button from "../buttons/Button";
import {
  useGetCompanyDataQuery,
  useUpdateCompanyMutation,
} from "../../api/rtk-query/companyRequest";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const EditCompany = () => {
  const [isButtonClicked, setIsButtonClicked] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const [updateCompany] = useUpdateCompanyMutation();
  const { data: companyId } = useGetCompanyDataQuery("company");
  const id = companyId && companyId.map((company) => company.id);
  const {
    register,
    handleSubmit,
    reset,
    trigger,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const currency = data.currency?.toUpperCase();
      await updateCompany([data, id, currency]);
      dispatch(openModal(["editCompany", false]));
      window.location.reload();
    } catch (err) {
      console.log("Error: ", err);
      throw new Error(`Error to sending data to DataBase`);
    }
  };

   useEffect(() => {
      (async () => {
        const formsError = await trigger();
        if (!formsError) {
          if (errors.companyName || errors.currency ) {
            toast(
                <span className="text-red-600">Заполните все поля </span>
             
            );
          }
  
          if (errors.companyName?.message)
            toast(
              <span className="text-red-600">{errors.companyName?.message}</span>
            );
          if (errors.currency?.message)
            toast(
              <span className="text-red-600">{errors.currency?.message}</span>
            );
  
          return;
        }
      })();
    }, [isButtonClicked]);

  const onClose = () => {
    dispatch(openModal(["editCompany", false]));
    reset();
  };

  return (
    <SwitchModal
      handleClick={onClose}
      modalID="editCompany"
      className="bg-white rounded-4xl h-80 min-w-md  pt-6 px-8"
    >
      <div className="flex justify-between items-center mb-4 ">
        <h2 className="text-3xl font-bold">Редактировать</h2>
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
            placeholder="Название компании"
            className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
            {...register("companyName", {
              setValueAs: (value) => value?.trim(),
              required: true,
              maxLength: {
                value: 7,
                message: "Максимум 7 символов",
              },
              validate: (value) => {
                return (value && value.length >= 7) || true;
              },
            })}
          />
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Основная валюта"
            className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
            {...register("currency", {
              setValueAs: (value) => value?.trim(), 
              required: true,    
              minLength: {
                value: 3,
                message: "Минимум 3 символа",
              },
              maxLength: {
                value: 3,
                message: "Максимум 3 символа",
              },
              validate: (value) => value && value.length === 3 || "Должно быть ровно 3 символа",
            })}
          />
        </div>
        <Button submitHandler={() => setIsButtonClicked((prev) => !prev)} className="w-full  py-4 bg-gradient-to-r from-blue-400 to-green-400  font-semibold rounded-lg cursor-pointer">
          Изменить
        </Button>
      </form>
    </SwitchModal>
  );
};

export default EditCompany;
