import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const sessionProgressApi = createApi({
  reducerPath: "sessionProgressApi",
  baseQuery: fetchBaseQuery({ baseUrl: "" }), // empty base URL
  endpoints: (builder) => ({
    getAllsessionProgress: builder.query<any[], void>({
      query: () => "http://localhost:8082/api/courses/lesson-progress/", // full absolute URL here
    }),
    createsessionProgress: builder.mutation<any, Partial<any>>({
      query: (body) => ({
        url: "http://localhost:8082/api/courses/lesson-progress/",
        method: "POST",
        body,
      }),
    }),
    updatesessionProgress: builder.mutation<
      any,
      { id: string; data: Partial<any> }
    >({
      query: ({ id, data }) => ({
        url: `http://localhost:8082/api/courses/lesson-progress/${id}/`,
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetAllsessionProgressQuery,
  useCreatesessionProgressMutation,
  useUpdatesessionProgressMutation,
} = sessionProgressApi;
