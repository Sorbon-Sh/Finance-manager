import { useContext } from "react";
import CryptoContext from "../context/cryptoContext";

export const useCrypto = () => {
  return useContext(CryptoContext);
};
