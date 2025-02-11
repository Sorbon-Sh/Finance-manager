import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type IData = Record<string, unknown>;

const initialState: IData = {
  accounts: [],
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
    //? Вариант с Передачей через Redux (обдумать) можно или нет
    // allAmount: (state, action) => {
    //   state.accounts = action.payload;
    // },
  },
});

export const { openModal } = modalState.actions;

export default modalState.reducer;
