import { useCapitalize } from "../../hooks/useCapitalize";
import { useAppDispatch } from "../../hooks/useReduxTypedHooks";
import {
  currencyTableModal,
  setCurrencyData,
} from "../../redux/slices/currencySlice";
import { CurrencyRate } from "../../types/valutaTJTypes";

interface IProps {
  groupedData: Record<string, (CurrencyRate & { uuid: string })[]>;
  currencyDetails: CurrencyRate[];
}

const MultiCurrencyCategory = ({ groupedData, currencyDetails }: IProps) => {
  const dispatch = useAppDispatch();
  const { toUpperCase } = useCapitalize();
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
    <section className="container mx-auto p-4">
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
            Посетить сайт {toUpperCase(currencyDetails[0]?.namebank)}
          </a>
        </span>
      </div>
      {Object.keys(groupedData).map((currency) => (
        <div key={currency} className="mb-4">
          <h1 className="text-xl font-bold mb-4">{currency}</h1>
          <div className="w-full border border-gray-300">
            <div className="flex bg-blue-500 text-white">
              <div className="w-1/3 border border-gray-300 p-2">Валюта</div>
              <div className="w-1/3 border border-gray-300 p-2">Категория</div>
              <div className="w-1/3 border border-gray-300 p-2">Курс</div>
            </div>
            {groupedData[currency].map(
              (item: CurrencyRate & { uuid: string }) => (
                <div
                  key={item.uuid}
                  className="flex hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleClickCurrencyData(item)}
                >
                  <div className="w-1/3 border border-gray-300 p-2 flex items-center">
                    <span>{item.namekurs}</span>
                  </div>
                  <div className="w-1/3 border border-gray-300 p-2">
                    {item.comments}
                  </div>
                  <div className="w-1/3 border border-gray-300 p-2">
                    {item.kurs === null || +item.kurs === 0 ? "Н/Д" : item.kurs}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      ))}
    </section>
  );
};

export default MultiCurrencyCategory;
