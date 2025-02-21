import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import supabase from "../supabaseClient";
import { ITransactions } from "../../types/types";

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
        const [tranLastData, acc, tranId, tranData] = tranAndAcc;
        const [accountData] = acc;
        const filter = tranData.find(
          (elem: ITransactions) => elem.id === tranId
        );
        console.log("filter: ", filter);

        const { data, error } = await supabase
          .from("accounts")
          .update({
            allAmount: tranLastData.amount + accountData.allAmount,
          })
          .eq("id", accountData.id);

        if (error) {
          console.log(error.message);
          throw new Error(error.message);
        }
        if (
          !accountData ||
          !accountData.id ||
          tranLastData.amount === undefined
        ) {
          console.error("❌ Ошибка: Некорректные данные!", accountData);
          throw new Error("Некорректные данные для обновления!");
        } else {
          console.log("Данне получены: ", accountData.id, tranLastData.amount);
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
  useUpdateAmountAccountMutation,
} = supabaseApi;
