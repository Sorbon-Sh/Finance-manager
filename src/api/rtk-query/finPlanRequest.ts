import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import supabase from "../supabaseClient";
import { IFinPlan, IFinPlanTransaction } from "../../types/types";

export const finplanApi = createApi({
  reducerPath: "finplanApi",
  baseQuery: fetchBaseQuery({}),
  endpoints: (builder) => ({
    createFinPlan: builder.mutation({
      queryFn: async (data) => {
        const [formData, planId] = data;
        console.log("FormData: ", formData);

        console.log("PlanId:", planId);

        const postRequest = await supabase.from("finplans").insert({
          ...formData,
          planId: planId,
          date: {
            day: formData.date.day,
            month: formData.date.month,
            year: formData.date.year,
            hour: formData.date.hour,
            minute: formData.date.minute,
            weekDay: formData.date.weekDay,
          },
        });

        Promise.all([postRequest])
          .then((results) => {
            const isError = results.find((result) => result.error);
            if (isError) {
              throw new Error(`${isError.error?.message}`);
            } else {
              console.log(
                "✅ Данные успешно отправлены в базу данных!: ",
                results
              );
            }
          })
          .catch((error) => {
            throw new Error(`❌ Ошибка: ${error.message}`);
          });

        return { data: postRequest || [] };
      },
    }),
    getFinPlan: builder.query<IFinPlan[], void>({
      queryFn: async () => {
        const { data: data, error } = await supabase
          .from("finplans")
          .select("*");
        if (error) {
          console.log(error.message);
          throw new Error(error.message);
        }

        return { data: data || [] };
      },
    }),
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

        const planId = planData.planId;
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
  }),
});

export const {
  useCreateFinPlanMutation,
  useGetFinPlanQuery,
  useGetPlanTransactionsQuery,
  usePlanTransactionsMutation,
} = finplanApi;
