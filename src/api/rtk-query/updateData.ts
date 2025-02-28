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

        const isOldTranAmountChange =
          tranId && modalData.amount !== oldTransaction.amount;

        const updates = [];

        //! Для разных сценариев лучше делать для них отдельные запросы изменение данных
        //* Назавём это условия выполнение запроса
        //* Если транзакция существовала (редактирование)
        //* Сценарий если присходит редактирование
        if (oldTransaction) {
          const delta = modalData.amount - oldTransaction.amount; // Разница между новой и старой суммой
          if (isAccountChanged && oldAccount) {
            //* Сценарий если изменится и аккаунт в модалке и его сумма чтобы передать его данные другому аккаунту
            //* Также если сумма аккаунте не изменится то просто передать данные без изменение
            if (!isOldTranAmountChange) {
              console.log("Сценарий: изменение аккаунта без изменения суммы");

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
                  .update({
                    allAmount: newAccount.allAmount + oldTransaction.amount,
                  })
                  .eq("id", newAccount.id)
              );
            } //* Также если сумма аккаунте не изменится то просто передать данные без изменение
            else {
              console.log(
                "Сработал сценарий: изменение имя аккаунта и изменение его счета чтобы передать"
              );
              console.log(
                "Вычитаем так же стврую транзакци из аккаунта: ",
                oldAccount.allAmount - Number(modalData.amount)
              );

              console.log(
                "Плюсуем к новому аккаунту: ",
                +modalData.amount + newAccount.allAmount
              );

              const changeOldAmountAccount =
                oldAccount.allAmount - +modalData.amount;
              const addNewAmountAccount =
                +modalData.amount + newAccount.allAmount;

              //* 1. Вычитаем старую сумму из старого аккаунта
              updates.push(
                supabase
                  .from("accounts")
                  .update({
                    allAmount: changeOldAmountAccount,
                  })
                  .eq("id", oldAccount.id)
              );

              //* 2. Добавляем новую сумму в новый аккаунт
              updates.push(
                supabase
                  .from("accounts")
                  .update({
                    allAmount: addNewAmountAccount,
                  })
                  .eq("id", newAccount.id)
              );
            }
          } //* Сценарий если изменяется только сумма аккаунта
          else {
            console.log("Сценарий: изменение только суммы");

            //* Если аккаунт не менялся, просто обновляем сумму
            updates.push(
              supabase
                .from("accounts")
                .update({ allAmount: newAccount.allAmount + delta })
                .eq("id", newAccount.id)
            );
          }
        } //* Сценарий если редактирование не присходит плюсовать послдению транзакцию
        else {
          console.log("Сценарий: новая транзакция");
          updates.push(
            supabase
              .from("accounts")
              .update({ allAmount: newAccount.allAmount + tranLastData.amount })
              .eq("id", newAccount.id)
          );
        }

        console.log("modalData: ", modalData);
        console.log("oldTransaction: ", oldTransaction);
        console.log("oldAccount: ", oldAccount);
        console.log("newAccount: ", newAccount);
        console.log("isAccountChanged : ", isAccountChanged);
        console.log("updates: ", updates);

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
