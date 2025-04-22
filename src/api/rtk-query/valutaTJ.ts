import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CurrencyRate } from "../../types/valutaTJTypes";

export const valutaApiTJ = createApi({
  reducerPath: "valutaApiTJ",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://finance-manager-three-lake.vercel.app/api/",
  }),
  endpoints: (builder) => ({
    valutatj: builder.query<CurrencyRate[], void>({
      query: () => "proxy-valuta",
      transformResponse: (
        response: Record<string, CurrencyRate> | CurrencyRate[],
      ) => {
        return Array.isArray(response) ? response : Object.values(response);
      },
      keepUnusedDataFor: 3600,
    }),
  }),
});

export const { useValutatjQuery } = valutaApiTJ;
