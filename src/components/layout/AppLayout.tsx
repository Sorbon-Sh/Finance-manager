import AppContent from "./AppContent";
import AppSider from "./AppSider";
import AppHeader from "./AppHeader";
import { BrowserRouter } from "react-router";
import { useGetCompanyDataQuery } from "../../api/rtk-query/insertToDataBase";
const AppLayout: React.FC = () => {
  const { data: company } = useGetCompanyDataQuery();
  // const { loading } = use(CryptoContext);
  // if (loading) {
  //   return <Spin fullscreen />;
  // }

  return (
    <div className="container mx-auto">
      <AppHeader companyData={company} />
      <div className="grid grid-cols-12 h-svh ">
        <AppSider companyData={company} />
        {/* In this app all routes doings  in AppContent Component */}
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </div>
    </div>
  );
};

export default AppLayout;
