import { useGetCompanyDataQuery } from "../api/rtk-query/companyRequest";

const useMainCurrency = () => {
  const { data: currency } = useGetCompanyDataQuery("company");

  return currency && currency[0].currency;
};

export default useMainCurrency;
