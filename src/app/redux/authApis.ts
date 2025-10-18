import { baseApis } from "./main/baseApis";

const authApis = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    signIn: builder.mutation({
      query: (data) => ({
        url: "/auth",
        method: "POST",
        body: data,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useSignInMutation } = authApis;

export default authApis;
