import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import supabase from "../supabaseClient";
import { IAccounts, ITransactions } from "../../types/types";

export const updateTranData = createApi({
  reducerPath: "updateTranData",
  baseQuery: fetchBaseQuery({}),
  endpoints: (builder) => ({
    updateCompany: builder.mutation({
      queryFn: async (company) => {
        const [companyData, id, currency] = company;
        const { data, error } = await supabase
          .from("company")
          .update({
            ...companyData,
            currency,
          })
          .eq("id", id);
        if (error) {
          console.log(error.message);
          throw new Error(error.message);
        }

        return { data: data || [] };
      },
    }),
    updateAccount: builder.mutation({
      queryFn: async (account) => {
        const [accountData, id] = account;
        console.log(accountData);
        const { data, error } = await supabase
          .from("accounts")
          .update({
            account: accountData.account,
            allAmount: accountData.allAmount,
          })
          .eq("id", id);
        if (error) {
          console.log(error.message);
          throw new Error(error.message);
        }

        return { data: data || [] };
      },
    }),
    updateIncomeAmountAccount: builder.mutation({
      queryFn: async (tranAndAcc) => {
        const [accData, tranId, tranData, modalData] = tranAndAcc;

        const oldTransaction = tranId
          ? tranData.find((t: ITransactions) => t.id === tranId)
          : null;

        const oldAccount = oldTransaction
          ? accData.find((a: IAccounts) => a.account === oldTransaction.account)
          : null;
        const newAccount = accData.find(
          (a: IAccounts) => a.account === modalData.account
        );

        const isAccountChanged =
          oldTransaction && oldTransaction.account !== modalData.account;

        const isOldTranAmountChange =
          tranId && modalData.amount !== oldTransaction.amount;

        const updates = [];

        if (oldTransaction) {
          const delta = modalData.amount - oldTransaction.amount;
          if (isAccountChanged && oldAccount) {
            if (!isOldTranAmountChange) {
              updates.push(
                supabase
                  .from("accounts")
                  .update({
                    allAmount: oldAccount.allAmount - oldTransaction.amount,
                  })
                  .eq("id", oldAccount.id)
              );

              updates.push(
                supabase
                  .from("accounts")
                  .update({
                    allAmount: newAccount.allAmount + oldTransaction.amount,
                  })
                  .eq("id", newAccount.id)
              );
            } else {
              const changeOldAmountAccount =
                oldAccount.allAmount - modalData.amount;
              const addNewAmountAccount =
                modalData.amount + newAccount.allAmount;

              updates.push(
                supabase
                  .from("accounts")
                  .update({
                    allAmount: changeOldAmountAccount,
                  })
                  .eq("id", oldAccount.id)
              );

              updates.push(
                supabase
                  .from("accounts")
                  .update({
                    allAmount: addNewAmountAccount,
                  })
                  .eq("id", newAccount.id)
              );
            }
          } else {
            updates.push(
              supabase
                .from("accounts")
                .update({ allAmount: newAccount.allAmount + delta })
                .eq("id", newAccount.id)
            );
          }
        } else {
          updates.push(
            supabase
              .from("accounts")
              .update({ allAmount: newAccount.allAmount + modalData.amount })
              .eq("id", newAccount.id)
          );
        }

        const results = await Promise.all(updates);
        const errors = results.filter((r) => r.error);
        if (errors.length) {
          console.error(errors);
          throw new Error("Ошибка обновления данных");
        }
        return { data: "Accounts updated successfully" };
      },
    }),
    updateExpenseAmountAccount: builder.mutation({
      queryFn: async (tranAndAcc) => {
        const [accData, modalData] = tranAndAcc;

        const account = accData.find(
          (a: IAccounts) => a.account === modalData.account
        );

        const { data, error } = await supabase
          .from("accounts")
          .update({ allAmount: account.allAmount - modalData.amount })
          .eq("id", account.id);

        if (error) {
          console.log(error.message);
          throw new Error(error.message);
        }

        return { data: data || [] };
      },
    }),

    updateTransaction: builder.mutation({
      queryFn: async (tranById) => {
        const [tranData, id] = tranById;
        if (!tranData) {
          console.error("❌ Ошибка: Некорректные данные!", tranById);
          throw new Error("Некорректные данные для обновления!");
        } else {
          console.log("Данне получены: ", tranById.id);
        }
        const { data, error } = await supabase
          .from("transactions")
          .update({
            ...tranData,
            date: {
              day: tranData.date.day,
              month: tranData.date.month,
              year: tranData.date.year,
              hour: tranData.date.hour,
              minute: tranData.date.minute,
              weekDay: tranData.date.weekDay,
            },
          })
          .eq("id", id);

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
  useUpdateCompanyMutation,
  useUpdateAccountMutation,
  useUpdateTransactionMutation,
  useUpdateExpenseAmountAccountMutation,
  useUpdateIncomeAmountAccountMutation,
} = updateTranData;
