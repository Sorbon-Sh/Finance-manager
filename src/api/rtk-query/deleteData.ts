import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import supabase from "../supabaseClient";

export const supabaseApi = createApi({
  reducerPath: "supabaseApi",
  baseQuery: fetchBaseQuery({}),
  endpoints: (builder) => ({
    deleteTransaction: builder.mutation({
      queryFn: async (ids) => {
        console.log("deleteTransaction ids: ", ids);

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

export const { useDeleteTransactionMutation } = supabaseApi;
