import AppContent from "./AppContent";
import AppSider from "./AppSider";
import AppHeader from "./AppHeader";

const AppLayout = () => {
  // const { loading } = useContext(CryptoContext);
  // if (loading) {
  //   return <Spin fullscreen />;
  // }

  return (
    <div className="w-[1320px] mx-auto">
      <AppHeader />
      <div className="grid grid-cols-12 h-96 bg-white">
        <AppSider />
        <AppContent />
      </div>
    </div>
  );
};

export default AppLayout;
