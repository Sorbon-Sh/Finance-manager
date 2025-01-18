import { Layout, Typography } from "antd";
import PortfolioChart from "./crypto/PortfolioChart";
import AssetsTable from "./crypto/AssetsTable";
import { useCrypto } from "../../hooks/useCrypto";
import { CryptoResultItem, IAssetsItems } from "../../types/types";
import { CSSProperties } from "react";

const contentStyle: CSSProperties = {
  textAlign: "center",
  minHeight: "calc(100vh - 60px)",
  color: "#fff",
  backgroundColor: "#001529",
  padding: "1rem",
};

export default function AppContent() {
  const { assets, crypto } = useCrypto();

  const cryptoPriceMap = crypto.reduce(
    (acc: Record<string, number>, c: CryptoResultItem) => {
      acc[c.id] = c.price;
      return acc;
    },
    {}
  );

  return (
    <Layout.Content style={contentStyle}>
      <Typography.Title level={3} style={{ textAlign: "left", color: "#fff" }}>
        Portfolio:
        {assets
          .map((asset: IAssetsItems) => asset.amount * cryptoPriceMap[asset.id])
          .reduce((acc, v) => (acc += v), 0)
          .toFixed(2)}
        $
      </Typography.Title>
      <PortfolioChart />
      <AssetsTable />
    </Layout.Content>
  );
}
