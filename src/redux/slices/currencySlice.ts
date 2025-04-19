import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICurrencySlices } from "../../types/sliceStateAndDataTypes";

const initialState: ICurrencySlices = {
  currencyTable: false,
  currency: {
    namebank: "",
    namekurs: "",
    kurs: "",
    comments: "",
  },
};

export const currencySlice = createSlice({
  name: "currencySlice",
  initialState,
  reducers: {
    setCurrencyData: (state, action) => {
      state.currency = action.payload;
    },
    currencyTableModal: (state, action: PayloadAction<boolean>) => {
      state.currencyTable = action.payload;
    },
  },
});

export const { setCurrencyData, currencyTableModal } = currencySlice.actions;

export default currencySlice.reducer;
