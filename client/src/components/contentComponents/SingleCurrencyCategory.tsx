import { useAppDispatch } from "../../hooks/useReduxTypedHooks";
import {
  currencyTableModal,
  setCurrencyData,
} from "../../redux/slices/currencySlice";
import { CurrencyRate } from "../../types/valutaTJTypes";

interface IProps {
  currencyDetails: CurrencyRate[];
}

const SingleCurrencyCategory = ({ currencyDetails }: IProps) => {
  const dispatch = useAppDispatch();
  const handleClickCurrencyData = (item: CurrencyRate) => {
    const currencyData = {
      namekurs: item.namekurs,
      namebank: item.namebank,
      kurs: item.kurs,
      comments: item.comments,
    };
    dispatch(setCurrencyData(currencyData));
    dispatch(currencyTableModal(false));
  };
  return (
    <section>
      <div className="flex flex-col items-center gap-y-2 font-medium">
        <span className="text-red-500">
          Оффицианльные данные с сайта{" "}
          <a
            href="https://valuta.tj/"
            target="_blank"
            className="text-blue-500"
          >
            VALUTA.TJ
          </a>
        </span>
        <span className="text-green-600 mb-4">
          <a href={currencyDetails[0]?.url} target="_blank">
            Посетить сайт {currencyDetails[0]?.namebank}
          </a>
        </span>
      </div>
      <div className="flex bg-blue-500 text-white">
        <div className="w-1/3 border border-gray-300 p-2">Валюта</div>
        <div className="w-1/3 border border-gray-300 p-2">Категория</div>
        <div className="w-1/3 border border-gray-300 p-2">Курс</div>
      </div>
      {currencyDetails.map((item) => (
        <div className="container">
          <div className="w-full border border-gray-300 ">
            <div
              className="flex hover:bg-gray-200 cursor-pointer"
              onClick={() => handleClickCurrencyData(item)}
            >
              <div className="w-1/3 border border-gray-300 p-2 flex items-center ">
                <span>{item.namekurs}</span>
              </div>
              <div className="w-1/3 border border-gray-300 p-2">
                {item.comments}
              </div>
              <div className="w-1/3 border border-gray-300 p-2">
                {item.kurs}
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default SingleCurrencyCategory;
