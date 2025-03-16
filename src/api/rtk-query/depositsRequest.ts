import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import supabase from "../supabaseClient";
import { IDeposits } from "../../types/types";

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
        const { data: Supadata, error } = await supabase
          .from("deposits")
          .insert({
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
    // updatePlanTransactions: builder.mutation({
    //   queryFn: async (data) => {
    //     const [formData, rowId] = data;

    //     const updateRequest = supabase
    //       .from("finplanTransactions")
    //       .update({
    //         ...formData,
    //         date: {
    //           day: formData.date.day,
    //           month: formData.date.month,
    //           year: formData.date.year,
    //           hour: formData.date.hour,
    //           minute: formData.date.minute,
    //           weekDay: formData.date.weekDay,
    //         },
    //       })
    //       .eq("id", rowId.id);

    //     Promise.all([updateRequest])
    //       .then((results) => {
    //         const isError = results.find((result) => result.error);
    //         if (isError) {
    //           throw new Error(`${isError.error?.message}`);
    //         } else {
    //           console.log(
    //             "✅ Данные успешно обновлены из базы данных!: ",
    //             results
    //           );
    //         }
    //       })
    //       .catch((error) => {
    //         throw new Error(`❌ Ошибка: ${error.message}`);
    //       });

    //     return { data: updateRequest || [] };
    //   },
    // }),
  }),
});

export const {
  useGetDepositsQuery,
  useCreateDepositMutation,
  useDeleteDepositMutation,
} = depositsApi;
