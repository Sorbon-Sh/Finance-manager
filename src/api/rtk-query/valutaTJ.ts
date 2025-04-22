import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CurrencyRate } from "../../types/valutaTJTypes";

export const valutaApiTJ = createApi({
  reducerPath: "valutaApiTJ",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://valuta.tj/parser/",
  }),
  endpoints: (builder) => ({
    valutatj: builder.query<CurrencyRate[], void>({
      query: () => ({
        url: "echokurs.php",
        method: "GET",
      }),
      transformResponse: async (response: CurrencyRate[]) => {
        const result = response;

        return result;
      },
    }),
  }),
});

export const { useValutatjQuery } = valutaApiTJ;
