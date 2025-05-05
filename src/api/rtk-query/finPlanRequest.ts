import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import supabase from "../supabaseClient";
import { IFinPlan } from "../../types/indexTypes";
import { prepareDateWithOriginalParts } from "../../utility/prepareDateToServer";

export const finplanApi = createApi({
  reducerPath: "finplanApi",
  baseQuery: fetchBaseQuery({}),
  tagTypes: ["finPlans"],
  endpoints: (builder) => ({
    createFinPlan: builder.mutation({
      queryFn: async (formData) => {
        const [planData, annualAmount, monthlyAmount, maxAmount] = formData;
        const { data, error } = await supabase.from("finplans").insert({
          ...planData,
          annualAmount,
          monthlyAmount,
          maxAmount,
          date: {
            day: planData.date.day,
            month: planData.date.month,
            year: planData.date.year,
            hour: planData.date.hour,
            minute: planData.date.minute,
            weekDay: planData.date.weekDay,
          },
        });

        if (error) {
          console.log(error.message);
          throw new Error(error.message);
        }

        return { data: data || [] };
      },
      invalidatesTags: [{ type: "finPlans" }],
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
      providesTags: [{ type: "finPlans" }],
    }),
    updatePlan: builder.mutation({
      queryFn: async (form) => {
        const [
          formData,
          planData,
          dateIsString,
          annualAmount,
          monthlyAmount,
          maxAmount,
          rowsId,
        ] = form;
        const date = prepareDateWithOriginalParts(planData, dateIsString);
        const { data, error: planError } = await supabase
          .from("finplans")
          .update({
            ...formData,
            annualAmount,
            monthlyAmount,
            maxAmount,
            date,
          })
          .eq("id", rowsId);

        const { data: updatePlanTran, error: planTranError } = await supabase
          .from("finplanTransactions")
          .update({
            fromPlan: formData.plan,
          })
          .eq("planId", rowsId);

        Promise.all([data, updatePlanTran]).catch(() => {
          if (planError || planTranError) {
            console.log(planError?.message || planTranError?.message);
            throw new Error(planError?.message || planTranError?.message);
          }
        });

        return { data: data || [] };
      },

      invalidatesTags: [{ type: "finPlans" }],
    }),
    deletePlan: builder.mutation({
      queryFn: async (rowsId) => {
        const deletePlan = await supabase
          .from("finplans")
          .delete()
          .in("id", rowsId);

        const deletePlanTransactions = await supabase
          .from("finplanTransactions")
          .delete()
          .in("planId", rowsId);

        const data = Promise.all([deletePlan, deletePlanTransactions])
          .then((results) => {
            const isError = results.find((result) => result.error);
            if (isError) {
              throw new Error(`${isError.error?.message}`);
            }
          })
          .catch((error) => {
            throw new Error(`${error.message}`);
          });
        return { data: data || [] };
      },
      invalidatesTags: [{ type: "finPlans" }],
    }),
  }),
});

export const {
  useCreateFinPlanMutation,
  useGetFinPlanQuery,
  useUpdatePlanMutation,
  useDeletePlanMutation,
} = finplanApi;
