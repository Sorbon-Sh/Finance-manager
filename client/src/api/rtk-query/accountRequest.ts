import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import supabase from "../supabaseClient";
import { IAccounts, ITransactions } from "../../types/indexTypes";

export const accountRequest = createApi({
  reducerPath: "accountRequest",
  baseQuery: fetchBaseQuery({}),
  tagTypes: ["Accounts"],
  endpoints: (builder) => ({
    getAccount: builder.query<IAccounts[], string>({
      queryFn: async (table) => {
        const { data: accounts, error } = await supabase
          .from(table)
          .select("*");
        if (error) {
          console.log(error.message);
          throw new Error(error.message);
        }

        return { data: accounts || [] };
      },
      providesTags: [{ type: "Accounts" }],
    }),
    deleteAccount: builder.mutation({
      queryFn: async (ids) => {

        const { data, error } = await supabase
          .from("accounts")
          .delete()
          .in("id", ids);

        if (error) {
          console.log(error.message);
          throw new Error(error.message);
        }

        return { data: data || [] };
      },
      invalidatesTags: [{ type: "Accounts" }],
    }),
    createAccount: builder.mutation<IAccounts[], [object,number, string]>({
      queryFn: async (formData) => {
        const [accountData,allAmount, account] = formData;
        const { data, error } = await supabase.from("accounts").insert({
          ...accountData,
          allAmount,
          account,
        });

        if (error) {
          console.log(error.message);
          throw new Error(error.message);
        }

        return { data: data || [] };
      },
      invalidatesTags: [{ type: "Accounts" }],
    }),

    updateAccount: builder.mutation({
      queryFn: async (account) => {
        const [accountData,allAmount, id] = account;
        console.log(accountData);
        const { data, error } = await supabase
          .from("accounts")
          .update({
             ...accountData,
            allAmount
          })
          .eq("id", id);
        if (error) {
          console.log(error.message);
          throw new Error(error.message);
        }

        return { data: data || [] };
      },
      invalidatesTags: [{ type: "Accounts" }],
    }),
    incomeAmountAccount: builder.mutation({
      queryFn: async (tranAndAcc) => {
        const [accData, tranId, tranData, modalData] = tranAndAcc;

        const modalAmount = parseFloat(modalData.amount);

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
          tranId && modalAmount !== oldTransaction.amount;

        const updates = [];

        if (oldTransaction) {
          const delta = modalAmount - oldTransaction.amount;

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
              const changeOldAmountAccount = oldAccount.allAmount - modalAmount;
              const addNewAmountAccount = modalAmount + newAccount.allAmount;
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
              .update({ allAmount: newAccount.allAmount + modalAmount })
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
    expenseAmountAccount: builder.mutation({
      queryFn: async (tranAndAcc) => {
        const [accData, tranId, tranData, modalData] = tranAndAcc;

        const modalAmount = parseFloat(modalData.amount);

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
          tranId && modalAmount !== oldTransaction.amount;

        const updates = [];

        if (oldTransaction) {
          const delta = modalAmount - oldTransaction.amount
          console.log("delta: ", delta);
          if (isAccountChanged && oldAccount) {
            if (!isOldTranAmountChange) {
              console.log("1) oldAccount.allAmount + oldTransaction.amount: ", oldAccount.allAmount + oldTransaction.amount);
              updates.push(
                supabase
                  .from("accounts")
                  .update({
                    allAmount: oldAccount.allAmount + oldTransaction.amount,
                  })
                  .eq("id", oldAccount.id)
              );
             console.log("2) newAccount.allAmount - oldTransaction.amount", newAccount.allAmount - oldTransaction.amount)
              updates.push(
                supabase
                  .from("accounts")
                  .update({
                    allAmount: newAccount.allAmount - oldTransaction.amount,
                  })
                  .eq("id", newAccount.id)
              );
            } else {
              const changeOldAmountAccount =
                oldAccount.allAmount + Math.abs(delta);
              const addNewAmountAccount = Math.abs(
                modalAmount - newAccount.allAmount
              );
              console.log("3) changeOldAmountAccount: ", changeOldAmountAccount)
              console.log("4) addNewAmountAccount: ", addNewAmountAccount)
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
            console.log(
              "5) newAccount.allAmount + delta: ",
              newAccount.allAmount + delta
            );
            updates.push(
              supabase
                .from("accounts")
                .update({ allAmount: newAccount.allAmount + delta })
                .eq("id", newAccount.id)
            );
          }
        } else {
          console.log("6) newAccount.allAmount - modalAmount: ", newAccount.allAmount - modalAmount)
          updates.push(
            supabase
              .from("accounts")
              .update({ allAmount: newAccount.allAmount - modalAmount })
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
  }),
});

export const {
  useUpdateAccountMutation,
  useCreateAccountMutation,
  useGetAccountQuery,
  useIncomeAmountAccountMutation,
  useExpenseAmountAccountMutation,
  useDeleteAccountMutation,
  useLazyGetAccountQuery,
} = accountRequest;
