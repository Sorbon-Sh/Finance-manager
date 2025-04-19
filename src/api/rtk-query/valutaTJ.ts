import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CurrencyRate } from "../../types/valutaTJTypes";

export const valutaApiTJ = createApi({
  reducerPath: "valutaApiTJ",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001/",
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
