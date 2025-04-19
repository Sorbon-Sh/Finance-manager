import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CurrencyRate } from "../../types/valutaTJTypes";

export const valutaApiTJ = createApi({
  reducerPath: "valutaApiTJ",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.PROD
      ? "https://https://fin-manager-j6keaai35-sorbon-workspace-admins-projects.vercel.app.replit.app/"
      : "http://localhost:3001/",
  }),
  endpoints: (builder) => ({
    valutatj: builder.query<CurrencyRate[], void>({
      query: () => ({
        url: "exchange-rates",
        method: "GET",
      }),
      transformResponse: async (response: CurrencyRate[]) => response,
    }),
  }),
});

export const { useValutatjQuery } = valutaApiTJ;
