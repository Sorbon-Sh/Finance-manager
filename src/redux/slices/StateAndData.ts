import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initTypes } from "../../types/sliceStateAndDataTypes";

const initialState: initTypes = {
  accountId: "",
  choosedAccount: [],
  transationAccount: "",
  transactionId: "",
  planId: "",
  planTranId: "",
  depositId: [],
};

// ? Аналог если TypeScript из лишне будет проверять Redux
// const initialState = {
//     value: 0
//   } as CounterState

export const modalState = createSlice({
  name: "stateAndData",
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<[string, boolean]>) => {
      //* Деструктуризировать из аргумета action.payload
      const [id, open] = action.payload;
      //* Создаём динамическый ключ и значение для модалок
      state[id] = open;
    },
    setAccountId: (state, action: PayloadAction<string>) => {
      state.accountId = action.payload;
    },

    setTransactionAccount: (state, action: PayloadAction<string>) => {
      state.transactionAccount = action.payload;
    },

    isIncomeButtonClicked: (state, action: PayloadAction<boolean>) => {
      state.incomeButton = action.payload;
    },
    setTransactionId: (state, action: PayloadAction<string>) => {
      state.transactionId = action.payload;
    },
    choosedAccount: (state, action: PayloadAction<string[]>) => {
      state.choosedAccount = action.payload;
    },
    setPlanID: (state, action: PayloadAction<string>) => {
      state.planId = action.payload;
    },
    setPlanTranID: (state, action: PayloadAction<string>) => {
      state.planTranId = action.payload;
    },
    setDepositId: (state, action: PayloadAction<string[]>) => {
      state.depositId = action.payload;
    },
  },
});

export const {
  openModal,
  setAccountId,
  setTransactionId,
  setTransactionAccount,
  isIncomeButtonClicked,
  choosedAccount,
  setPlanID,
  setPlanTranID,
  setDepositId,
} = modalState.actions;

export default modalState.reducer;
