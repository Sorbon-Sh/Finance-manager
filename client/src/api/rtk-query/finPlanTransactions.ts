import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import supabase from "../supabaseClient";
import { IFinPlanTransaction } from "../../types/indexTypes";
import { prepareDateWithOriginalParts } from "../../utility/prepareDateToServer";

export const finPlanTransactionsApi = createApi({
  reducerPath: "finplanTransactionsApi",
  baseQuery: fetchBaseQuery({}),
  endpoints: (builder) => ({
    getPlanTransactions: builder.query<IFinPlanTransaction[], void>({
      queryFn: async () => {
        const { data: data, error } = await supabase
          .from("finplanTransactions")
          .select("*");
        if (error) {
          console.log(error.message);
          throw new Error(error.message);
        }

        return { data: data || [] };
      },
    }),

    planTransactions: builder.mutation({
      queryFn: async (data) => {
        const [amountData, amount, planData] = data;
        const planId = planData.id;
        const planName = planData.plan;

        const { data: Supadata, error } = await supabase
          .from("finplanTransactions")
          .insert({
            ...amountData,
            amount,
            planId: planId,
            fromPlan: planName,
            date: {
              day: amountData.date.day,
              month: amountData.date.month,
              year: amountData.date.year,
              hour: amountData.date.hour,
              minute: amountData.date.minute,
              weekDay: amountData.date.weekDay,
            },
          });
        if (error) {
          console.log(error.message);
          throw new Error(error.message);
        }

        return { data: Supadata || [] };
      },
    }),
    deletePlanTransactions: builder.mutation({
      queryFn: async (rowsId) => {
        const { data, error } = await supabase
          .from("finplanTransactions")
          .delete()
          .in("id", rowsId);

        if (error) {
          console.log(error.message);
          throw new Error(error.message);
        }

        return { data: data || [] };
      },
    }),
    updatePlanTransactions: builder.mutation({
      queryFn: async (formData) => {
        const [amountData, planData, amount, dateIsString, rowId] = formData;
        const date = prepareDateWithOriginalParts(planData, dateIsString);
        console.log(date);
        console.log(amountData);
        const { data, error } = await supabase
          .from("finplanTransactions")
          .update({
            ...amountData,
            amount,
            date,
          })
          .eq("id", rowId.id);

        if (error) {
          console.log(error.message);
          throw new Error(error.message);
        }

        return { data: data || [] };
      },
    }),
  }),
});

export const {
  useDeletePlanTransactionsMutation,
  useUpdatePlanTransactionsMutation,
  usePlanTransactionsMutation,
  useGetPlanTransactionsQuery,
} = finPlanTransactionsApi;
