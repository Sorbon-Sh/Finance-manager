import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import supabase from "../supabaseClient";
import { IAccounts } from "../../types/types";

export const supabaseApi = createApi({
  reducerPath: "supabaseApi",
  baseQuery: fetchBaseQuery({}),
  endpoints: (builder) => ({
    //* Переиспользуемый
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
        if (error) {
          console.log(error.message);
          throw new Error(
            `Some think went wrong with with Fetch: ${error.message}`
          );
        }

        return { data: data || [] };
      },
    }),
    //* Переиспользуемый
    getSum: builder.query<IAccounts[], string>({
      queryFn: async (table) => {
        const { data: accountsData, error } = await supabase
          .from(table)
          .select("*");
        if (error) {
          console.log(error.message);
          throw new Error(
            `Some think went wrong with with Fetch: ${error.message}`
          );
        }

        return { data: (accountsData as IAccounts[]) || [] };
      },
    }),
    createAccount: builder.mutation({
      queryFn: async (formData) => {
        const [table, account] = formData;
        const { data, error } = await supabase.from(table).insert(account);
        if (error) {
          console.log(error.message);
          throw new Error(
            `Some think went wrong with with Fetch: ${error.message}`
          );
        }

        return { data: data || [] };
      },
    }),
  }),
});

export const {
  useInsertTransactionMutation,
  useGetSumQuery,
  useCreateAccountMutation,
} = supabaseApi;
