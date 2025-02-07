import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ModalState = Record<string, boolean | string>;

const initialState: ModalState = {};

// ? Аналог если TypeScript из лишне будет проверять Redux
// const initialState = {
//     value: 0
//   } as CounterState

export const modalState = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<[string, boolean]>) => {
      //* Деструктуризировать из аргумета action.payload
      const [id, open] = action.payload;
      //* Создаём динамическый ключ и значение для модалок
      state[id] = open;
    },
  },
});

export const { openModal } = modalState.actions;

export default modalState.reducer;
