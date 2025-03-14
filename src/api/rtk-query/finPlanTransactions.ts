import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import supabase from "../supabaseClient";
import { IFinPlanTransaction } from "../../types/types";

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
        const [formData, planData] = data;

        const planId = planData.id;
        const planName = planData.plan;
        console.log("PlanID: ", planId);
        console.log("PlanName: ", planName);

        const { data: Supadata, error } = await supabase
          .from("finplanTransactions")
          .insert({
            ...formData,
            planId: planId,
            fromPlan: planName,
            date: {
              day: formData.date.day,
              month: formData.date.month,
              year: formData.date.year,
              hour: formData.date.hour,
              minute: formData.date.minute,
              weekDay: formData.date.weekDay,
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
        console.log("RowsID planTran: ", rowsId);

        const deleteRequest = supabase
          .from("finplanTransactions")
          .delete()
          .in("id", rowsId);

        Promise.all([deleteRequest])
          .then((results) => {
            const isError = results.find((result) => result.error);
            if (isError) {
              throw new Error(`${isError.error?.message}`);
            } else {
              console.log(
                "✅ Данные успешно удалены из базы данных!: ",
                results
              );
            }
          })
          .catch((error) => {
            throw new Error(`❌ Ошибка: ${error.message}`);
          });

        return { data: deleteRequest || [] };
      },
    }),
    updatePlanTransactions: builder.mutation({
      queryFn: async (data) => {
        const [formData, rowId] = data;

        const updateRequest = supabase
          .from("finplanTransactions")
          .update({
            ...formData,
            date: {
              day: formData.date.day,
              month: formData.date.month,
              year: formData.date.year,
              hour: formData.date.hour,
              minute: formData.date.minute,
              weekDay: formData.date.weekDay,
            },
          })
          .eq("id", rowId.id);

        Promise.all([updateRequest])
          .then((results) => {
            const isError = results.find((result) => result.error);
            if (isError) {
              throw new Error(`${isError.error?.message}`);
            } else {
              console.log(
                "✅ Данные успешно обновлены из базы данных!: ",
                results
              );
            }
          })
          .catch((error) => {
            throw new Error(`❌ Ошибка: ${error.message}`);
          });

        return { data: updateRequest || [] };
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
