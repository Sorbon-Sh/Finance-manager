import AppContent from "./AppContent";
import AppSider from "./AppSider";
import AppHeader from "./AppHeader";

const AppLayout = () => {
  // const { loading } = use(CryptoContext);
  // if (loading) {
  //   return <Spin fullscreen />;
  // }

  return (
    <div className="container mx-auto">
      <AppHeader />
      <div className="grid grid-cols-12 h-svh ">
        <AppSider />
        <AppContent />
      </div>
    </div>
  );
};

export default AppLayout;
