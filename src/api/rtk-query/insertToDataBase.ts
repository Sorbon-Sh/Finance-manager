import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import supabase from "../supabaseClient";

export const supabaseApi = createApi({
  reducerPath: "supabaseApi",
  baseQuery: fetchBaseQuery({}),
  endpoints: (builder) => ({
    insertTransaction: builder.mutation({
      queryFn: async (formData) => {
        const [table, insertData] = formData;
        const { data, error } = await supabase.from(table).insert({
          ...insertData,
          date: {
            day: insertData.date.day,
            month: insertData.date.month,
            year: insertData.date.year,
            hour: insertData.date.hour,
            minute: insertData.date.minute,
          },
        });
        if (error) console.log(error.message);

        return { data: data || [] };
      },
    }),
    getTransaction: builder.query({
      queryFn: async (table) => {
        const { data, error } = await supabase.from(table).select("*");
        if (error) console.log(error.message);

        return { data: data || [] };
      },
    }),
  }),
});

export const { useInsertTransactionMutation, useGetTransactionQuery } =
  supabaseApi;
