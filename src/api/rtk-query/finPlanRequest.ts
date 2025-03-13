import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import supabase from "../supabaseClient";
import { IFinPlan } from "../../types/types";

export const finplanApi = createApi({
  reducerPath: "finplanApi",
  baseQuery: fetchBaseQuery({}),
  endpoints: (builder) => ({
    createFinPlan: builder.mutation({
      queryFn: async (formData) => {
        console.log("FormData: ", formData);

        const postRequest = await supabase.from("finplans").insert({
          ...formData,
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
    updatePlan: builder.mutation({
      queryFn: async (data) => {
        const [formData, rowsId] = data;
        console.log("updatePlan: ", "Started");

        const updateRequest = await supabase
          .from("finplans")
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
          .eq("id", rowsId);

        Promise.all([updateRequest])
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

        return { data: updateRequest || [] };
      },
    }),
    deletePlan: builder.mutation({
      queryFn: async (rowsId) => {
        const deleteRequest = await supabase
          .from("finplans")
          .delete()
          .in("id", rowsId);

        Promise.all([deleteRequest])
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

        return { data: deleteRequest || [] };
      },
    }),
  }),
});

export const {
  useCreateFinPlanMutation,
  useGetFinPlanQuery,
  useUpdatePlanMutation,
  useDeletePlanMutation,
} = finplanApi;
