import AppContent from "./AppContent";
import AppSider from "./AppSider";
import AppHeader from "./AppHeader";
import { BrowserRouter } from "react-router";

const AppLayout: React.FC = () => {
  // const { loading } = use(CryptoContext);
  // if (loading) {
  //   return <Spin fullscreen />;
  // }

  return (
    <div className="container mx-auto">
      <AppHeader />
      <div className="grid grid-cols-12 h-svh ">
        <AppSider />
        {/* In this app all routes doings  in AppContent Component */}
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </div>
    </div>
  );
};

export default AppLayout;
