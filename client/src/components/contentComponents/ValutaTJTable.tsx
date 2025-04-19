import { v4 as uuidv4 } from "uuid"; 
import { CurrencyRate } from "../../types/valutaTJTypes";
import MultiCurrencyCategory from "./MultiCurrencyCategory";
import SingleCurrencyCategory from "./SingleCurrencyCategory";

interface IProps {
  valutaDetails: CurrencyRate[];
}

const ValutaTJTable = ({ valutaDetails }: IProps) => {
  const isMultiNameKurse =
    new Set(valutaDetails.map((currency) => currency.namekurs)).size !==
    valutaDetails.length;

  // Добавим uuid каждому элементу
  const enrichedDetails = valutaDetails.map((item) => ({
    ...item,
    uuid: uuidv4(),
  }));

  const groupedByCurrency = enrichedDetails.reduce(
    (
      acc: Record<string, (CurrencyRate & { uuid: string })[]>,
      item
    ) => {
      const currency = item.namekurs ?? "unknown"; // подстраховка
      if (!acc[currency]) acc[currency] = [];
      acc[currency].push(item);
      return acc;
    },
    {}
  );

  return (
    <>
      {!isMultiNameKurse ? (
        <SingleCurrencyCategory currencyDetails={enrichedDetails} />
      ) : (
        <MultiCurrencyCategory
          groupedData={groupedByCurrency}
          currencyDetails={enrichedDetails}
        />
      )}
    </>
  );
};

export default ValutaTJTable;
