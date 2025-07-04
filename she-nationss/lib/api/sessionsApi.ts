import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const sessionsApi = createApi({
  reducerPath: "sessionsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "" }),
  endpoints: (builder) => ({
    getAllsessions: builder.query<any[], void>({
      query: () => "http://localhost:8082/api/sessions/",
    }),
    deletesession: builder.mutation<void, string>({
      query: (id) => ({
        url: `http://localhost:8082/api/sessions/${id}/`,
        method: "DELETE",
      }),
    }),
    updatesession: builder.mutation<any, { id: string; data: Partial<any> }>({
      query: ({ id, data }) => ({
        url: `http://localhost:8082/api/sessions/${id}/`,
        method: "PATCH",
        body: data,
      }),
    }),
    getsessionById: builder.query<any, string>({
      query: (id) => `http://localhost:8082/api/sessions/${id}/`,
    }),
  }),
});

export const {
  useGetAllsessionsQuery,
  useDeletesessionMutation,
  useUpdatesessionMutation,
  useGetsessionByIdQuery,
} = sessionsApi;
