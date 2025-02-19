import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type IData = Record<string, unknown>;

const initialState: IData = {
  accountId: "",
  transationAccount: "",
  incomeButton: false,
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
  },
});

export const {
  openModal,
  setAccountId,

  setTransactionAccount,
  isIncomeButtonClicked,
} = modalState.actions;

export default modalState.reducer;
