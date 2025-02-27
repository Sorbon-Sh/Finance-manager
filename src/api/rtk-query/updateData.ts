import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import supabase from "../supabaseClient";
import { IAccounts, ITransactions } from "../../types/types";

export const supabaseApi = createApi({
  reducerPath: "supabaseApi",
  baseQuery: fetchBaseQuery({}),
  endpoints: (builder) => ({
    updateCompany: builder.mutation({
      queryFn: async (company) => {
        const [companyData, id] = company;
        const { data, error } = await supabase
          .from("company")
          .update({
            name: companyData.companyName,
            currency: companyData.mainCurrency,
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
    updateAmountAccount: builder.mutation({
      queryFn: async (tranAndAcc) => {
        const [tranLastData, accData, tranId, tranData, modalData] = tranAndAcc;

        if (!accData) return { error: "Account data is missing" };

        //* Текущая транзакция (если это редактирование)
        const oldTransaction = tranId
          ? tranData.find((t: ITransactions) => t.id === tranId)
          : null;

        //* Определяем старый и новый аккаунты
        const oldAccount = oldTransaction
          ? accData.find((a: IAccounts) => a.account === oldTransaction.account)
          : null;
        const newAccount = accData.find(
          (a: IAccounts) => a.account === modalData.account
        );

        if (!newAccount) return { error: "New account not found" };

        //* Флаг, поменялся ли аккаунт
        const isAccountChanged =
          oldTransaction && oldTransaction.account !== modalData.account;

        const updates = [];

        //* Если транзакция существовала (редактирование)
        if (oldTransaction) {
          const delta = modalData.amount - oldTransaction.amount; //* Разница между новой и старой суммой

          //! Для разных сценариев лучше делать для них отдельные запросы изменение данных
          //* Назавём это условия выполнение запроса
          if (isAccountChanged && oldAccount) {
            //* 1. Вычитаем сумму из старого аккаунта
            updates.push(
              supabase
                .from("accounts")
                .update({
                  allAmount: oldAccount.allAmount - oldTransaction.amount,
                })
                .eq("id", oldAccount.id)
            );

            //* 2. Добавляем сумму в новый аккаунт
            updates.push(
              supabase
                .from("accounts")
                .update({ allAmount: newAccount.allAmount + modalData.amount })
                .eq("id", newAccount.id)
            );
          } else {
            //* Если аккаунт не менялся, просто обновляем сумму
            updates.push(
              supabase
                .from("accounts")
                .update({ allAmount: newAccount.allAmount + delta })
                .eq("id", newAccount.id)
            );
          }
        } else {
          //* Если это новая транзакция (добавление дохода)
          updates.push(
            supabase
              .from("accounts")
              .update({ allAmount: newAccount.allAmount + tranLastData.amount })
              .eq("id", newAccount.id)
          );
        }

        //* Выполняем все обновления
        const results = await Promise.all(updates);
        const errors = results.filter((r) => r.error);

        if (errors.length) {
          console.log(errors.map((e) => e.error).join("\n"));
          return { error: errors.map((e) => e.error).join("\n") };
        }

        return { data: "Accounts updated successfully" };
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
  useUpdateAmountAccountMutation,
} = supabaseApi;
