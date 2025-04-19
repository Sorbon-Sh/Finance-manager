import { useValutatjQuery } from "../../api/rtk-query/valutaTJ";
import closeIcon from "../../assets/closeIcon.svg";
import { useAppDispatch, useAppSelector } from "../../hooks/useReduxTypedHooks";
import { currencyTableModal } from "../../redux/slices/currencySlice";
import { filterArr } from "../../utility/filterArr";
import Button from "../buttons/Button";
import ValutaTJTable from "../contentComponents/ValutaTJTable";

interface IProps {
  selectedBank: string;
}

const ChooseBankModal = ({ selectedBank }: IProps) => {
  const dispatch = useAppDispatch();
  const { data: valutaTJ } = useValutatjQuery();

  const valutaDetails = valutaTJ
    ? filterArr(valutaTJ, "namebank", selectedBank)
    : [];

  const onClose = () => {
    dispatch(currencyTableModal(false));
  };
  const isOpen = useAppSelector((state) => state.currencySlice.currencyTable);
  return (
    <div
      className={`grid place-content-center h-screen bg-black/40 fixed z-10 top-0 left-0 w-full ${
        !isOpen && "hidden"
      }`}
      onClick={onClose}
    >
      <div
        className="bg-white  max-h-lvh overflow-y-scroll  min-w-3xl  pt-6 px-8"
        onClick={(event) => event.stopPropagation()}
      >
        <section>
          <div className="flex justify-between items-center mb-4 ">
            <h2 className="text-3xl font-bold">Выбрать валюту</h2>
            <Button className="cursor-pointer" submitHandler={onClose}>
              <img src={closeIcon} />
            </Button>
          </div>
          <div>
            <ValutaTJTable valutaDetails={valutaDetails} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default ChooseBankModal;
