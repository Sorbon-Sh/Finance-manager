import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import supabase from "../supabaseClient";
import { IAccounts } from "../../types/types";

export const supabaseApi = createApi({
  reducerPath: "supabaseApi",
  baseQuery: fetchBaseQuery({}),
  endpoints: (builder) => ({
    transferRequest: builder.mutation({
      queryFn: async (formData) => {
        const [accounts, modal, category] = formData;

        const fromAccount = accounts.find(
          (element: IAccounts) => element.account === modal.fromAccount
        );
        const toAccount = accounts.find(
          (element: IAccounts) => element.account === modal.toAccount
        );
        const takeAmountFrom = fromAccount.allAmount - modal.amount;
        const putAmountTo = toAccount.allAmount + modal.amount;

        const takeFromAccount = await supabase
          .from("accounts")
          .update({
            allAmount: takeAmountFrom,
          })
          .eq("id", fromAccount.id);

        const sendToAccount = await supabase
          .from("accounts")
          .update({
            allAmount: putAmountTo,
          })
          .eq("id", toAccount.id);

        const transaction = await supabase.from("transactions").insert({
          amount: modal.amount,
          account: modal.toAccount,
          category: category,
          tranCategory: category,
          date: {
            day: modal.date.day,
            month: modal.date.month,
            year: modal.date.year,
            hour: modal.date.hour,
            minute: modal.date.minute,
            weekDay: modal.date.weekDay,
          },
        });

        Promise.all([takeFromAccount, sendToAccount, transaction])
          .then((results) => {
            const isError = results.find((result) => result.error);
            if (isError) {
              throw new Error(`${isError.error?.message}`);
            } else {
              console.log("Transfer: Success");
            }
          })
          .catch((error) => {
            console.log("Error", error);
            throw new Error(`${error.message}`);
          });

        return { data: data || [] };
      },
    }),
  }),
});

export const { useTransferRequestMutation } = supabaseApi;
