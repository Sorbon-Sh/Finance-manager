import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import supabase from "../supabaseClient";
import { IAccounts } from "../../types/indexTypes";
import { prepareDateWithOriginalParts } from "../../utility/prepareDateToServer";

export const transferRequest = createApi({
  reducerPath: "transferRequest",
  baseQuery: fetchBaseQuery({}),
  endpoints: (builder) => ({
    transferRequest: builder.mutation({
      queryFn: async (formData) => {
        const [accounts, modal, dateIsString, tranData, amount, category] =
          formData;

        const modalAmount = parseFloat(amount);

        const fromAccount = accounts.find(
          (element: IAccounts) => element.account === modal.fromAccount,
        );
        const toAccount = accounts.find(
          (element: IAccounts) => element.account === modal.toAccount,
        );

        const takeAmountFrom = fromAccount
          ? fromAccount.allAmount - modalAmount
          : 0;
        const putAmountTo = toAccount ? toAccount.allAmount + modalAmount : 0;
        const isSameFromAccount = tranData
          ? tranData.account !== modal.fromAccount
          : false;
        const isSameToAccount = tranData
          ? tranData.account !== modal.toAccount
          : false;
        const isAmountChanged = tranData
          ? tranData.amount !== modalAmount
          : false;

        if (
          isSameFromAccount ||
          isSameToAccount ||
          (isAmountChanged && isSameFromAccount && isSameToAccount)
        ) {
          const date = prepareDateWithOriginalParts(tranData, dateIsString);
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

          const accountsToJSON = JSON.stringify({
            toAccount: modal.toAccount,
            fromAccount: modal.fromAccount,
          });

          const transaction = await supabase
            .from("transactions")
            .update({
              amount: modalAmount,
              account: accountsToJSON,
              category: category,
              tranCategory: category,
              date,
            })
            .eq("id", tranData.id);

          const data = Promise.all([
            takeFromAccount,
            sendToAccount,
            transaction,
          ])
            .then((results) => {
              const isError = results.find((result) => result.error);
              if (isError) {
                throw new Error(`${isError.error?.message}`);
              } else {
                console.log("Transfer: Success");
              }
            })
            .catch((error) => {
              throw new Error(`${error.message}`);
            });

          return { data: data || [] };
        }

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

        const accountsToJSON = JSON.stringify({
          toAccount: modal.toAccount,
          fromAccount: modal.fromAccount,
        });

        const transaction = await supabase.from("transactions").insert({
          amount: modalAmount,
          account: accountsToJSON,
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

        const data = Promise.all([takeFromAccount, sendToAccount, transaction])
          .then((results) => {
            const isError = results.find((result) => result.error);
            if (isError) {
              throw new Error(`${isError.error?.message}`);
            } else {
              console.log("Transfer: Success");
            }
          })
          .catch((error) => {
            throw new Error(`${error.message}`);
          });

        return { data: data || [] };
      },
    }),
  }),
});

export const { useTransferRequestMutation } = transferRequest;
