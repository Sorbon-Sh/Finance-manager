import {
  useGetAccountQuery,
  useGetCompanyDataQuery,
} from "./api/rtk-query/insertTranData";
import AppLayout from "./components/layout/AppLayout";
import cashIcon from "./assets/cash-icon.gif";
import { getErrorMessage } from "./utility/reduxErrorsCheck";
const App: React.FC = () => {
  const { isLoading: isCompanyLoading, error: companyError } =
    useGetCompanyDataQuery("company");
  const { isLoading: isAccountsLoading, error: accountsError } =
    useGetAccountQuery("accounts");

  if (isCompanyLoading || isAccountsLoading) {
    return (
      <>
        <div className="h-screen w-full grid place-content-center bg-white">
          <img src={cashIcon} className="size-14" />
        </div>
      </>
    );
  }

  if (companyError || accountsError) {
    return (
      <div className="h-screen w-full flex justify-center items-center bg-white">
        <div className="font-medium">
          <span className="bg-green-500 p-2">Ошибка запроса на сервер</span>
          <span className=" bg-red-500 p-2 text-slate-950">
            {getErrorMessage(accountsError || companyError)}
          </span>
        </div>
      </div>
    );
  }

  return <AppLayout />;
};

export default App;
