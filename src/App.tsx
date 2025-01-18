import AppLayout from "./components/layout/AppLayout";
import { CryptoContextProvider } from "./context/cryptoContext";

const App: React.FC = () => {
  return (
    <CryptoContextProvider>
      <AppLayout />
    </CryptoContextProvider>
  );
};

export default App;
