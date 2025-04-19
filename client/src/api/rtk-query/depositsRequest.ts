import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import supabase from "../supabaseClient";
import { IDeposits } from "../../types/indexTypes";
import { prepareDateWithOriginalParts } from "../../utility/prepareDateToServer";

export const depositsApi = createApi({
  reducerPath: "depositsApi",
  baseQuery: fetchBaseQuery({}),
  tagTypes: ["Deposits"],
  endpoints: (builder) => ({
    getDeposits: builder.query<IDeposits[], void>({
      queryFn: async () => {
        const { data: data, error } = await supabase
          .from("deposits")
          .select("*");
        if (error) {
          console.log(error.message);
          throw new Error(error.message);
        }

        return { data: data || [] };
      },
      providesTags: ["Deposits"],
    }),

    createDeposit: builder.mutation({
      queryFn: async (formData) => {
        const [depositData, investment, annualInterest, taxes] = formData;
        const { data: Supadata, error } = await supabase
          .from("deposits")
          .insert({
            ...depositData,
            investment,
            annualInterest,
            taxes,
            date: {
              day: depositData.date.day,
              month: depositData.date.month,
              year: depositData.date.year,
              hour: depositData.date.hour,
              minute: depositData.date.minute,
              weekDay: depositData.date.weekDay,
            },
          });
        if (error) {
          console.log(error.message);
          throw new Error(error.message);
        }

        return { data: Supadata || [] };
      },
      invalidatesTags: ["Deposits"],
    }),
    deleteDeposit: builder.mutation({
      queryFn: async (rowsId) => {
        const { data, error } = await supabase
          .from("deposits")
          .delete()
          .in("id", rowsId);

        if (error) {
          console.log(error.message);
          throw new Error(error.message);
        }

        return { data: data || [] };
      },
      invalidatesTags: ["Deposits"],
    }),
    updateDeposit: builder.mutation({
      queryFn: async (form) => {
        const [
          formData,
          depositData,
          dateIsString,
          investment,
          annualInterest,
          taxes,
          rowId,
        ] = form;
        const date = prepareDateWithOriginalParts(depositData, dateIsString);
        const { data, error } = await supabase
          .from("deposits")
          .update({
            ...formData,
            investment,
            annualInterest,
            taxes,
            date,
          })
          .eq("id", rowId);

        if (error) {
          console.log(error.message);
          throw new Error(error.message);
        }

        return { data: data || [] };
      },
      invalidatesTags: ["Deposits"],
    }),
  }),
});

export const {
  useGetDepositsQuery,
  useCreateDepositMutation,
  useDeleteDepositMutation,
  useUpdateDepositMutation,
} = depositsApi;
