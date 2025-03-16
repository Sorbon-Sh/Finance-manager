import { useAppDispatch } from "../../hooks/useReduxTypedHooks";
import { openModal } from "../../redux/slices/StateAndData";
import SwitchModal from "./SwitchModal";
import closeIcon from "../../assets/closeIcon.svg";
import { useForm, SubmitHandler } from "react-hook-form";
import { Inputs } from "../../types/types";
import { useUpdateCompanyMutation } from "../../api/rtk-query/updateTranData";
import { useGetCompanyDataQuery } from "../../api/rtk-query/insertTranData";
import Button from "../buttons/Button";

const EditCompany = () => {
  const dispatch = useAppDispatch();
  const [updateCompany] = useUpdateCompanyMutation();
  const { data: companyId } = useGetCompanyDataQuery("company");
  const id = companyId && companyId.map((company) => company.id);
  const { register, handleSubmit } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      await updateCompany([data, id]);
    } catch (err) {
      console.log("Error: ", err);
      throw new Error(`Error to sending data to DataBase`);
    }
  };

  return (
    <SwitchModal
      modalID="editCompany"
      className="bg-white rounded-4xl h-[463px] w-[480px]  pt-6 px-8"
    >
      <div className="flex justify-between items-center mb-4 ">
        <h2 className="text-3xl font-bold">Редактировать</h2>
        <button
          className="cursor-pointer"
          onClick={() => dispatch(openModal(["editCompany", false]))}
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
            placeholder="Название компании"
            className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
            {...register("companyName")}
          />
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Основная валюта"
            className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
            {...register("mainCurrency")}
          />
        </div>

        <Button className="w-full  py-4 bg-gradient-to-r from-blue-400 to-green-400  font-semibold rounded-lg cursor-pointer">
          Изменить
        </Button>
      </form>
    </SwitchModal>
  );
};

export default EditCompany;
