import { configureStore } from "@reduxjs/toolkit";
import stateAndDataReducer from "./slices/StateAndData";
import { supabaseApi } from "../api/rtk-query/insertTranData";
export const store = configureStore({
  reducer: {
    stateAndData: stateAndDataReducer,
    [supabaseApi.reducerPath]: supabaseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(supabaseApi.middleware),
});

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
