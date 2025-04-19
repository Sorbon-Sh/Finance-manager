import { ChangeEvent } from "react";
import { useCapitalize } from "../../hooks/useCapitalize";
import { ITransactions } from "../../types/indexTypes";
import { isObjectValid } from "../../utility/isObjectValid";
import { useValutatjQuery } from "../../api/rtk-query/valutaTJ";
import { useAppSelector } from "../../hooks/useReduxTypedHooks";
import { toast } from "react-toastify";
import { getUniqueByProperty } from "../../utility/getUniqueByProperty";

interface IProps {
  handleClickBankName: (arg: ChangeEvent<HTMLSelectElement>) => void;
  tranId?: string;
  tranData?: ITransactions | null | undefined;
  amount: number;
}

const SelectCurrency = ({
  handleClickBankName,
  tranId,
  tranData,
  amount,
}: IProps) => {
  const { data: valutaTJ } = useValutatjQuery();
  const bankName = valutaTJ ? getUniqueByProperty(valutaTJ, "namebank") : [];
  const { toUpperCase } = useCapitalize();
  const currencyTableData = useAppSelector(
    (state) => state.currencySlice.currency,
  );
  return (
    <select
      value=""
      className="py-3 w-full  bg-gray-100 rounded-lg border outline-none border-gray-300"
      onChange={(event) => {
        if (!amount) {
          toast(<span className="text-red-600">Сначала введите сумму!</span>);
          return;
        }
        handleClickBankName(event);
      }}
    >
      <option value="" disabled>
        {tranId
          ? (isObjectValid(tranData?.currency) &&
              `(${tranData?.currency.namekurs} - ${tranData?.currency.kurs})  ${tranData?.currency.namebank} - ${tranData?.currency.comments}`) ||
            "Выбрать валюту банка"
          : isObjectValid(currencyTableData)
            ? `(${currencyTableData.namekurs} - ${currencyTableData.kurs})  ${currencyTableData.namebank} - ${currencyTableData.comments}`
            : "Выбрать валюту банка"}
      </option>

      {valutaTJ
        ? bankName.map((items, index) => (
            <option key={index} value={items.namebank}>
              {toUpperCase(items.namebank)}
            </option>
          ))
        : "No banks currency data"}
    </select>
  );
};

export default SelectCurrency;
