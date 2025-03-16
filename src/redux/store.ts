import { configureStore } from "@reduxjs/toolkit";
import stateAndDataReducer from "./slices/StateAndData";
import { insertTranData } from "../api/rtk-query/insertTranData";
import { deleteTranData } from "../api/rtk-query/deleteTranData";
import { updateTranData } from "../api/rtk-query/updateTranData";
import { finplanApi } from "../api/rtk-query/finPlanRequest";
import { finPlanTransactionsApi } from "../api/rtk-query/finPlanTransactions";
import { transferRequest } from "../../transferRequest";
import { depositsApi } from "../api/rtk-query/depositsRequest";
export const store = configureStore({
  reducer: {
    stateAndData: stateAndDataReducer,
    [insertTranData.reducerPath]: insertTranData.reducer,
    [updateTranData.reducerPath]: updateTranData.reducer,
    [deleteTranData.reducerPath]: deleteTranData.reducer,
    [finplanApi.reducerPath]: finplanApi.reducer,
    [finPlanTransactionsApi.reducerPath]: finPlanTransactionsApi.reducer,
    [transferRequest.reducerPath]: transferRequest.reducer,
    [depositsApi.reducerPath]: depositsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      insertTranData.middleware,
      finplanApi.middleware,
      finPlanTransactionsApi.middleware,
      transferRequest.middleware,
      updateTranData.middleware,
      deleteTranData.middleware,
      depositsApi.middleware
    ),
});

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
