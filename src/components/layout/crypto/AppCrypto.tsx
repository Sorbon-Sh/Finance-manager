import { Layout, Spin } from "antd";

import { useContext } from "react";
import CryptoHeader from "./CryptoHeader";
import CryptoSider from "./CryptoSider";
import CryptoContext from "../../../context/cryptoContext";
import CryptoContent from "./CryptoContent";
const AppCrypto = () => {
  const { loading } = useContext(CryptoContext);
  if (loading) {
    return <Spin fullscreen />;
  }

  return (
    <Layout>
      <CryptoHeader />
      <Layout>
        <CryptoSider />
        <CryptoContent />
      </Layout>
    </Layout>
  );
};

export default AppCrypto;
