export interface IAssetsItems {
  id: string;
  amount: number;
  price: number;
  date: Date;
}
export interface CryptoContextType {
  assets: IAssetsItems[];
  crypto: CryptoResultItem[];
  loading: boolean;
  addAsset: (arg: IAssetsItems) => void;
}

export interface ICryptoAssets extends IAssetsItems {
  grow: number;
  growPercent: number;
  totalAmount: number;
  totalProfit: number;
  name: string;
}

export interface CryptoResultItem {
  id: string;
  icon: string;
  name: string;
  symbol: string;
  rank: number;
  price: number;
  priceBtc: number;
  volume: number;
  marketCap: number;
  availableSupply: number;
  totalSupply: number;
  priceChange1h: number;
  priceChange1d: number;
  priceChange1w: number;
  redditUrl?: string;
  websiteUrl?: string;
  twitterUrl?: string;
  contractAddress?: string;
  decimals?: number;
  explorers?: string[];
}

export interface IBitCryptoData {
  result: CryptoResultItem[];
  meta?: {
    page: number;
    limit: number;
    itemCount: number;
    pageCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}
