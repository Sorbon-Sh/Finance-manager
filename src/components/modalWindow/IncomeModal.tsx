import { useAppDispatch } from "../../hooks/useReduxTypedHooks";
import { openModal } from "../../redux/slices/modalStateSlice";
import SwitchModal from "./SwitchModal";
import closeIcon from "../../assets/closeIcon.svg";
import history from "../../assets/history.svg";
import { useForm, SubmitHandler } from "react-hook-form";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";

const IncomeModal = () => {
  interface Inputs {
    account: string;
    sum: number;
    category: string;
    counterParty: string;
  }
  const dispatch = useAppDispatch();
  const { register, handleSubmit } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
  };

  return (
    <SwitchModal
      modalID="income"
      className="bg-white rounded-4xl h-[535px] w-[480px]  overflow-y-scroll pt-6 pb-6  px-8 min-w-md"
    >
      <div className="flex justify-between items-center mb-4 ">
        <h2 className="text-3xl font-bold">Новый доход</h2>
        <button
          className="cursor-pointer"
          onClick={() => dispatch(openModal(["income", false]))}
        >
          <img src={closeIcon} />
        </button>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="relative dropdown">
          <input
            type="text"
            placeholder="На счет"
            className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
            {...register("account")}
          />
          <i className="fas fa-caret-down absolute right-3 top-3 text-gray-500"></i>
          <div className="dropdown-content">
            <div>Банк</div>
            <div>Наличный</div>
          </div>
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Сумма, TJS"
            className="w-full p-3 bg-gray-200 rounded-lg border border-gray-300"
            {...register("sum")}
          />

          <select
            value="TJS (TJS)"
            className="p-3 bg-gray-100 rounded-lg border border-gray-300"
          >
            <option>TJS (TJS)</option>
            <option>USD (USD)</option>
          </select>
        </div>
        <div className="relative dropdown">
          <input
            type="text"
            placeholder="Категория"
            className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
            {...register("category")}
          />
          <i className="fas fa-caret-down absolute right-3 top-3 text-gray-500"></i>
          <div className="dropdown-content">
            <div>Зарплата</div>
            <div>Продажа</div>
          </div>
        </div>
        <div className="relative dropdown">
          <input
            type="text"
            placeholder="Мой контрагент"
            className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
            {...register("counterParty")}
          />
          <i className="fas fa-caret-down absolute right-3 top-3 text-gray-500"></i>
          <div className="dropdown-content">
            <div>Контрагент 1</div>
            <div>Контрагент 2</div>
          </div>
        </div>
        {/* <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Дата поступления денег</p>
            <p className="text-sm font-medium">Сегодня, 31.01.2025, 17:08</p>
          </div>
          <i className="far fa-calendar-alt text-gray-500"></i>
        </div> */}
        <DatePicker
          format="MM/DD/YYYY HH:mm:ss"
          plugins={[<TimePicker position="bottom" />]}
        />
        <div className="flex items-center space-x-2"></div>
        <button className="w-full mt-4 py-2 bg-gradient-to-r from-blue-400 to-green-400 text-white font-semibold rounded-lg">
          Добавить доход
        </button>
      </form>
      <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-between">
        <div className="flex gap-x-2">
          <img src={history} alt="" />
          <p className="text-sm font-medium">Сделать повторяющим</p>
          <p className="text-sm font-medium text-red-500">Под вопросом!</p>
        </div>
        <i className="far fa-calendar-alt text-gray-500"></i>
      </div>
    </SwitchModal>
  );
};

export default IncomeModal;
