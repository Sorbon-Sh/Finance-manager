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
        const [tranLastData, acc, tranId, tranData, modalData] = tranAndAcc;

        const filter = tranId
          ? tranData.find((elem: ITransactions) => elem.id === tranId)
          : null;
        console.log("tranLastData: ", tranLastData);
        console.log("acc: ", acc);
        console.log("tranId: ", tranId);
        console.log("tranData: ", tranData);
        console.log("modalData: ", modalData);

        // console.log("filter: ", filter);

        // if (!tranLastData || !acc || !tranId || !tranData || modalData) {
        //   console.error(
        //     "❌ Ошибка: Некорректные данные!",
        //     "tranLastData: ",
        //     tranLastData.amount
        //   );
        //   console.error(
        //     "❌ Ошибка: Некорректные данные!",
        //     "acc: ",
        //     acc.allAmount
        //   );
        //   console.error("❌ Ошибка: Некорректные данные!", "tranId: ", tranId);
        //   console.error(
        //     "❌ Ошибка: Некорректные данные!",
        //     "tranData: ",
        //     tranData
        //   );
        //   console.error(
        //     "❌ Ошибка: Некорректные данные!",
        //     "modalData: ",
        //     modalData
        //   );
        //   const result = tranLastData.amount + acc.allAmount;
        //   console.log("result:", result);
        //   throw new Error("Некорректные данные для обновления!");
        // } else {
        //   console.log("Данне получены: ", "tranLastData: ", tranLastData);
        //   console.log("Данне получены: ", "acc: ", acc);
        //   console.log("Данне получены: ", "tranId: ", tranId);
        //   console.log("Данне получены: ", "tranData: ", tranData);
        //   console.log("Данне получены: ", "modalData: ", modalData);
        // }

        const { data, error } = await supabase
          .from("accounts")
          .update({
            allAmount: !tranId
              ? tranLastData.amount + acc.allAmount
              : modalData.amount < acc.allAmount
              ? acc.allAmount + tranLastData.amount
              : modalData.amount + acc.allAmount,
          })
          .eq("id", acc.id);

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
  useUpdateAmountAccountMutation,
} = supabaseApi;
