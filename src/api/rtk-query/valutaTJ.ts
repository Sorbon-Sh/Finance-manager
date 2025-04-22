import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CurrencyRate } from "../../types/valutaTJTypes";

export const valutaApiTJ = createApi({
  reducerPath: "valutaApiTJ",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://valuta.tj/parser/",
  }),
  endpoints: (builder) => ({
    valutatj: builder.query<CurrencyRate[], void>({
      query: () => "echokurs.php",
      transformResponse: (
        response: Record<string, CurrencyRate>,
      ): CurrencyRate[] => {
        return Object.values(response);
      },
      keepUnusedDataFor: 3600,
    }),
  }),
});

export const { useValutatjQuery } = valutaApiTJ;
