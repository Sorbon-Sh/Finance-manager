import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import supabase from "../supabaseClient";
import { prepareDateWithOriginalParts } from "../../utility/prepareDateToServer";

export const updateTranData = createApi({
  reducerPath: "updateTranData",
  baseQuery: fetchBaseQuery({}),
  endpoints: (builder) => ({
    updateTransaction: builder.mutation({
      queryFn: async (tranById) => {
        const [formData,dateIsString,tranData,tranId,amount, currency] = tranById;
        const date = prepareDateWithOriginalParts(tranData,dateIsString)

        const { data, error } = await supabase
          .from("transactions")
          .update({
            ...formData,
            amount,
            currency,
            date
          })
          .eq("id", tranId);

        if (error) {
          console.log(error.message);
          throw new Error(error.message);
        }

        return { data: data || [] };
      },
    }),
 
  }),
});

export const { useUpdateTransactionMutation } = updateTranData;
