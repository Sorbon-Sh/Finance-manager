import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import supabase from "../supabaseClient";
import { ICompnay } from "../../types/indexTypes";

export const companyRequest = createApi({
  reducerPath: "companyRequest",
  baseQuery: fetchBaseQuery({}),
  tagTypes: ["Company"],
  endpoints: (builder) => ({
    getCompanyData: builder.query<ICompnay[], string>({
      queryFn: async (table) => {
        if (!table) {
          throw new Error("Table name is undefined");
        }
        const { data: company, error } = await supabase.from(table).select("*");
        if (error) {
          console.log(error.message);
          throw new Error(error.message);
        }

        return { data: company || [] };
      },
      providesTags: [{ type: "Company" }],
    }),
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
      invalidatesTags: [{ type: "Company" }],
    }),
  }),
});

export const { useUpdateCompanyMutation, useGetCompanyDataQuery } =
  companyRequest;
