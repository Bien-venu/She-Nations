// lib/api/sessionsApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
  

export const sessionsApi = createApi({
  reducerPath: "sessionsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8082/api/" }),
  endpoints: (builder) => ({
    getAllsessions: builder.query<any[], void>({
      query: () => "sessions/",
    }),
    deletesession: builder.mutation<void, string>({
      query: (id) => ({
        url: `sessions/${id}/`,
        method: "DELETE",
      }),
    }),
    updatesession: builder.mutation<any, { id: string; data: Partial<any> }>({
      query: ({ id, data }) => ({
        url: `sessions/${id}/`,
        method: "PATCH",
        body: data,
      }),
    }),
    getsessionById: builder.query<any, string>({
      query: (id) => `sessions/${id}/`,
    }),
  }),
});

export const {
  useGetAllsessionsQuery,
  useDeletesessionMutation,
  useUpdatesessionMutation,
  useGetsessionByIdQuery,
} = sessionsApi;
