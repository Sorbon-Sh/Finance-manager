import { cryptoData, cryptoAssets } from "./data";
import { IAssetsItems, IBitCryptoData } from "./types/types";

export function fakeFetchCrypto(): Promise<IBitCryptoData> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(cryptoData);
    }, 1000);
  });
}

export function fetchAssets(): Promise<IAssetsItems[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(cryptoAssets);
    }, 1000);
  });
}
