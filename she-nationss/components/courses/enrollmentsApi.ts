import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const enrollmentsApi = createApi({
  reducerPath: "enrollmentsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8082/api/" }),
  endpoints: (builder) => ({
    getAllEnrollments: builder.query<any[], void>({
      query: () => "enrollments/",
    }),
    createEnrollment: builder.mutation<any, Partial<any>>({
      query: (body) => ({
        url: "enrollments/",
        method: "POST",
        body,
      }),
    }),
    deleteEnrollment: builder.mutation<void, string>({
      query: (id) => ({
        url: `enrollments/${id}/`,
        method: "DELETE",
      }),
    }),
    updateEnrollment: builder.mutation<any, { id: string; data: Partial<any> }>(
      {
        query: ({ id, data }) => ({
          url: `enrollments/${id}/`,
          method: "PATCH",
          body: data,
        }),
      }
    ),
    getEnrollmentById: builder.query<any, string>({
      query: (id) => `enrollments/${id}/`,
    }),
  }),
});

export const {
  useGetAllEnrollmentsQuery,
  useCreateEnrollmentMutation,
  useDeleteEnrollmentMutation,
  useUpdateEnrollmentMutation,
  useGetEnrollmentByIdQuery,
} = enrollmentsApi;
