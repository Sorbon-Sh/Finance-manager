import { createContext, ReactNode, useEffect, useState } from "react";
import { fakeFetchCrypto, fetchAssets } from "../api";
import {
  CryptoContextType,
  CryptoResultItem,
  IAssetsItems,
  ICryptoAssets,
} from "../types/types";
import { percentDifference } from "../utility/percentDefference";

interface IProps {
  children: ReactNode;
}

const CryptoContext = createContext<CryptoContextType>({
  assets: [],
  crypto: [],
  loading: false,
  addAsset: () => {},
});

export const CryptoContextProvider = ({ children }: IProps) => {
  //* эмулятор загрузки в секунадх из promise (написать лучше)
  const [loading, setLoading] = useState(false);
  //? crypto data
  const [crypto, setCrypto] = useState<CryptoResultItem[]>([]);
  //? assets data
  //? Изменить типы
  const [assets, setAssets] = useState<ICryptoAssets[]>([]);

  const mapAssets = (assets: IAssetsItems[], result: CryptoResultItem[]) => {
    return assets.map((asset: IAssetsItems) => {
      const coins = result.find((coin) => coin.id === asset.id);

      if (coins) {
        return {
          grow: asset.price < coins.price,
          growPercent: percentDifference(asset.price, coins.price),
          totalAmount: asset.amount + coins.price,
          totalProfit: asset.amount + coins.price - asset.amount * asset.price,
          ...asset,
          name: coins.name,
        };
      } else {
        console.log("Data coins is undefined");
      }
    });
  };
  // console.log(assets);

  //* Временный запрос для data.ts
  //* Потом поменять созданый эмулятор api на настояший
  //* Использовать useQuery или RTK Query или Axios
  //? Всё типитизировать
  useEffect(() => {
    try {
      async function preload() {
        setLoading(true);
        const { result } = await fakeFetchCrypto();
        const assets = await fetchAssets();
        setAssets(mapAssets(assets, result));
        // console.log(mapAssets);

        setCrypto(result);
        setLoading(false);
      }
      preload();
    } catch (err) {
      console.log(err);
    }
  }, []);

  const addAsset = (newAsset: IAssetsItems) => {
    setAssets((prev) => mapAssets([...prev, newAsset], crypto));
    console.log(newAsset);
  };

  return (
    <CryptoContext.Provider value={{ assets, loading, crypto, addAsset }}>
      {children}
    </CryptoContext.Provider>
  );
};

export default CryptoContext;
