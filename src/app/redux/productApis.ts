import { baseApis } from "./main/baseApis";

const productApis = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    createProduct: builder.mutation({
      query: (data) => ({
        url: "/products",
        method: "POST",
        body: data,
      }),
    }),
    updateProduct: builder.mutation({
      query: ({ data, id }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
    }),
    getSingleProduct: builder.query({
      query: (slug) => ({
        url: `/products/${slug}`,
        method: "GET",
      }),
    }),
    getAllProducts: builder.query({
      query: (params) => ({
        url: `/products`,
        method: "GET",
        params,
      }),
    }),
    getAllProductsBySearch: builder.query({
      query: (params) => ({
        url: `/products/search`,
        method: "GET",
        params,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateProductMutation,
  useGetSingleProductQuery,
  useGetAllProductsQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetAllProductsBySearchQuery,
} = productApis;

export default productApis;
