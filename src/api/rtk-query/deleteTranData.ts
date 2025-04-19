import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import supabase from "../supabaseClient";

export const deleteTranData = createApi({
  reducerPath: "deleteTranData",
  baseQuery: fetchBaseQuery({}),
  endpoints: (builder) => ({
    deleteTransaction: builder.mutation({
      queryFn: async (ids) => {
        const { data, error } = await supabase
          .from("transactions")
          .delete()
          .in("id", ids);

        if (error) {
          console.log(error.message);
          throw new Error(error.message);
        }

        return { data: data || [] };
      },
    }),
  }),
});

export const { useDeleteTransactionMutation } = deleteTranData;
