import { baseApis } from "./main/baseApis";

const categoryApis = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    getCategoryBySearch: builder.query({
      query: (params) => ({
        url: `/categories/search`,
        method: "GET",
        params,
      }),
    }),
    getAllCategories: builder.query({
      query: (params) => ({
        url: `/categories`,
        method: "GET",
        params,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetAllCategoriesQuery, useGetCategoryBySearchQuery } =
  categoryApis;

export default categoryApis;
