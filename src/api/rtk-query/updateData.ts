import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import supabase from "../supabaseClient";

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
        const [tran, acc] = tranAndAcc;
        const [accountData] = acc;
        console.log("TranAndAcc: ", "acc", accountData);

        console.log("TranAndAcc: ", "tran: ", tran);

        if (!accountData || !accountData.id || tran.amount === undefined) {
          console.error("❌ Ошибка: Некорректные данные!", accountData);
          throw new Error("Некорректные данные для обновления!");
        } else {
          console.log("Данне получены: ", accountData.id, tran.amount);
        }

        const { data, error } = await supabase
          .from("accounts")
          .update({
            allAmount: tran.amount + accountData.allAmount,
          })
          .eq("id", accountData.id);

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
  useUpdateAmountAccountMutation,
} = supabaseApi;
