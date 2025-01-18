import { Table } from "antd";
import { useCrypto } from "../../../hooks/useCrypto";
import { IAssetsItems, ICryptoAssets } from "../../../types/types";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    sorter: (a: ICryptoAssets, b: ICryptoAssets) =>
      a.name.length - b.name.length,
    sortDirections: ["descend"],
  },
  {
    title: "Price, $",
    dataIndex: "price",
    defaultSortOrder: "descend",
    sorter: (a: IAssetsItems, b: IAssetsItems) => a.price - b.price,
  },
  {
    title: "Amount",
    dataIndex: "amount",
    defaultSortOrder: "descend",
    sorter: (a: IAssetsItems, b: IAssetsItems) => a.amount - b.amount,
  },
];

export default function AssetsTable() {
  const { assets } = useCrypto();

  const data = assets.map((a) => ({
    key: a.id,
    name: a.name,
    price: a.price,
    amount: a.amount,
  }));

  return <Table pagination={false} columns={columns} dataSource={data} />;
}
