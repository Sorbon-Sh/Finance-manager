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
    getSum: builder.query({
      queryFn: async (table) => {
        const { data: sumData, error } = await supabase.from(table).select("*");
        if (error) {
          console.log(error.message);
          throw new Error(`Some think went wrong with Fetch: ${error.message}`);
        }

        return { data: sumData || [] };
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
    getAccount: builder.query<IAccounts[], string>({
      queryFn: async () => {
        const { data: accounts, error } = await supabase
          .from("accounts")
          .select("*");
        if (error) {
          console.log(error.message);
          throw new Error(`Some think went wrong with Fetch: ${error.message}`);
        }

        return { data: accounts || [] };
      },
    }),
  }),
});

const getAccount = async () => {
  const { data: sumData, error } = await supabase.from("accounts").select("*");
  if (error) {
    console.log(error.message);
    throw new Error(`Some think went wrong with Fetch: ${error.message}`);
  }

  return { data: sumData || [] };
};

export { getAccount };

export const {
  useInsertTransactionMutation,
  useGetSumQuery,
  useGetAccountQuery,
  useCreateAccountMutation,
} = supabaseApi;
