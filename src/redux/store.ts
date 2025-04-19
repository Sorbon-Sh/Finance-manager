import { configureStore } from "@reduxjs/toolkit";
import stateAndDataReducer from "./slices/StateAndData";
import { insertTranData } from "../api/rtk-query/insertTranData";
import { deleteTranData } from "../api/rtk-query/deleteTranData";
import { updateTranData } from "../api/rtk-query/updateTranData";
import { finplanApi } from "../api/rtk-query/finPlanRequest";
import { finPlanTransactionsApi } from "../api/rtk-query/finPlanTransactions";
import { transferRequest } from "../api/rtk-query/transferRequest";
import { depositsApi } from "../api/rtk-query/depositsRequest";
import { valutaApiTJ } from "../api/rtk-query/valutaTJ";
import currencySliceReducer from "./slices/currencySlice";
import { accountRequest } from "../api/rtk-query/accountRequest";
import { companyRequest } from "../api/rtk-query/companyRequest";

export const store = configureStore({
  reducer: {
    stateAndData: stateAndDataReducer,
    currencySlice: currencySliceReducer,
    [insertTranData.reducerPath]: insertTranData.reducer,
    [updateTranData.reducerPath]: updateTranData.reducer,
    [deleteTranData.reducerPath]: deleteTranData.reducer,
    [accountRequest.reducerPath]: accountRequest.reducer,
    [finplanApi.reducerPath]: finplanApi.reducer,
    [finPlanTransactionsApi.reducerPath]: finPlanTransactionsApi.reducer,
    [transferRequest.reducerPath]: transferRequest.reducer,
    [depositsApi.reducerPath]: depositsApi.reducer,
    [valutaApiTJ.reducerPath]: valutaApiTJ.reducer,
    [companyRequest.reducerPath]: companyRequest.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      insertTranData.middleware,
      finplanApi.middleware,
      finPlanTransactionsApi.middleware,
      transferRequest.middleware,
      updateTranData.middleware,
      deleteTranData.middleware,
      depositsApi.middleware,
      valutaApiTJ.middleware,
      accountRequest.middleware,
      companyRequest.middleware,
    ),
});

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
