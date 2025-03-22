import { useAppDispatch } from "../../hooks/useReduxTypedHooks";
import { openModal } from "../../redux/slices/StateAndData";
import SwitchModal from "./SwitchModal";
import closeIcon from "../../assets/closeIcon.svg";
import { useForm, SubmitHandler } from "react-hook-form";
import { Inputs } from "../../types/types";
import { useUpdateCompanyMutation } from "../../api/rtk-query/updateTranData";
import { useGetCompanyDataQuery } from "../../api/rtk-query/insertTranData";
import Button from "../buttons/Button";
import { useCapitalize } from "../../hooks/useCapitalize";

const EditCompany = () => {
  const dispatch = useAppDispatch();
  const { toUpperCase } = useCapitalize();
  const [updateCompany] = useUpdateCompanyMutation();
  const { data: companyId } = useGetCompanyDataQuery("company");
  const id = companyId && companyId.map((company) => company.id);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const currency = toUpperCase(data.mainCurrency || "");
      await updateCompany([data, id, currency]);
      reset();
    } catch (err) {
      console.log("Error: ", err);
      throw new Error(`Error to sending data to DataBase`);
    }
  };

  const onClose = () => {
    dispatch(openModal(["editCompany", false]));
    reset();
  };

  return (
    <SwitchModal
      handleClick={onClose}
      modalID="editCompany"
      className="bg-white rounded-4xl h-[463px] w-[480px]  pt-6 px-8"
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
            placeholder="Основная валюта"
            className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
            {...register("mainCurrency", { required: true })}
          />
        </div>

        <div className="text-center flex flex-col text-red-600">
          {errors.companyName || errors.mainCurrency ? (
            <span>Заполните все поля</span>
          ) : null}

          <span>{errors.companyName?.message}</span>
        </div>

        <Button className="w-full  py-4 bg-gradient-to-r from-blue-400 to-green-400  font-semibold rounded-lg cursor-pointer">
          Изменить
        </Button>
      </form>
    </SwitchModal>
  );
};

export default EditCompany;
