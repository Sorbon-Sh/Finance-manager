import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import supabase from "../supabaseClient";
import { IAccounts, ICompnay, ITransactions } from "../../types/types";

export const supabaseApi = createApi({
  reducerPath: "supabaseApi",
  baseQuery: fetchBaseQuery({}),
  tagTypes: ["Accounts"],
  endpoints: (builder) => ({
    //* Переиспользуемый
    insertTransaction: builder.mutation({
      queryFn: async (formData) => {
        const [table, insertData, category] = formData;
        const { data, error } = await supabase.from(table).insert({
          ...insertData,
          tranCategory: category,
          date: {
            day: insertData.date.day,
            month: insertData.date.month,
            year: insertData.date.year,
            hour: insertData.date.hour,
            minute: insertData.date.minute,
            weekDay: insertData.date.weekDay,
          },
        });
        if (error) {
          console.log(error.message);
          throw new Error(error.message);
        }

        return { data: data || [] };
      },
    }),
    //* Переиспользуемый
    //! Нужно переименовать!
    getSum: builder.query<ITransactions[], string>({
      queryFn: async (table) => {
        const { data: sumData, error } = await supabase.from(table).select("*");
        if (error) {
          console.log(error.message);
          throw new Error(error.message);
        }

        return { data: sumData || [] };
      },
    }),
    getTransactions: builder.query<ITransactions[], void>({
      queryFn: async () => {
        const { data: sumData, error } = await supabase
          .from("transactions")
          .select("*");
        if (error) {
          console.log(error.message);
          throw new Error(error.message);
        }

        return { data: sumData || [] };
      },
    }),
    createAccount: builder.mutation<IAccounts[], [string, object]>({
      queryFn: async (formData) => {
        const [table, account] = formData;
        const { data, error } = await supabase.from(table).insert(account);

        if (error) {
          console.log(error.message);
          throw new Error(error.message);
        }

        return { data: data || [] };
      },
      invalidatesTags: [{ type: "Accounts" }],
    }),
    getAccount: builder.query<IAccounts[], string>({
      queryFn: async (table) => {
        const { data: accounts, error } = await supabase
          .from(table)
          .select("*");
        if (error) {
          console.log(error.message);
          throw new Error(error.message);
        }

        return { data: accounts || [] };
      },
      providesTags: [{ type: "Accounts" }],
    }),
    getSingleDataTransactions: builder.query({
      queryFn: async (sqlFn) => {
        const { data: uniqueData, error } = await supabase.rpc(sqlFn);

        if (error) {
          console.log(error.message);
          throw new Error(error.message);
        }

        return { data: uniqueData || [] };
      },
    }),
    getCompanyData: builder.query<ICompnay[], string>({
      queryFn: async (table) => {
        if (!table) {
          throw new Error("Table name is undefined");
        }
        const { data: company, error } = await supabase.from(table).select("*");
        if (error) {
          console.log(error.message);
          throw new Error(error.message);
        }

        return { data: company || [] };
      },
    }),
  }),
});

export const {
  useInsertTransactionMutation,
  useGetSumQuery,
  useLazyGetTransactionsQuery,
  useGetAccountQuery,
  useGetCompanyDataQuery,
  useGetSingleDataTransactionsQuery,
  useCreateAccountMutation,
  useLazyGetAccountQuery,
} = supabaseApi;
