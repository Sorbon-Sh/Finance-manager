import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import supabase from "../supabaseClient";
import { ITransactions } from "../../types/indexTypes";

export const insertTranData = createApi({
  reducerPath: "insertTranData",
  baseQuery: fetchBaseQuery({}),
  endpoints: (builder) => ({
    insertTransaction: builder.mutation({
      queryFn: async (formData) => {
        const [table, currencyData, insertData, amount, category] = formData;
        
      
        const { data, error } = await supabase.from(table).insert({
          ...insertData,
          amount,
          tranCategory: category,
          currency: currencyData,
          date: {
              day: insertData.date.day,
              month: insertData.date.month,
              year: insertData.date.year,
              hour: insertData.date.hour,
              minute: insertData.date.minute,
              second: insertData.date.second,
              weekDay: insertData.date.weekDay,
            }
          
        });
        if (error) {
          console.log(error.message);
          throw new Error(error.message);
        }

        return { data: data || [] };
      },
    }),
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
  }),
});

export const {
  useInsertTransactionMutation,
  useGetSumQuery,
  useLazyGetTransactionsQuery,
  useGetSingleDataTransactionsQuery,
} = insertTranData;
