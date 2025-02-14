import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import supabase from "../supabaseClient";

export const supabaseApi = createApi({
  reducerPath: "supabaseApi",
  baseQuery: fetchBaseQuery({}),
  endpoints: (builder) => ({
    updateCompany: builder.mutation({
      queryFn: async (company) => {
        const [companyData, id] = company;
        const { data: accounts, error } = await supabase
          .from("company")
          .update({
            name: companyData.companyName,
            currency: companyData.mainCurrency,
          })
          .eq("id", id);
        if (error) {
          console.log(error.message);
          throw new Error(`Some think went wrong with Fetch: ${error.message}`);
        }

        return { data: accounts || [] };
      },
    }),
  }),
});

export const { useUpdateCompanyMutation } = supabaseApi;
