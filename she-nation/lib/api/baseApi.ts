import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8082/api",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token
    if (token) {
      headers.set("authorization", `Bearer ${token}`)
    }
    headers.set("content-type", "application/json")
    return headers
  },
})

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: [
    "User",
    "Profile",
    "Course",
    "session",
    "Enrollment",
    "SessionProgress",
    "Review",
  ],
  endpoints: () => ({}),
})

// Define the FrontendMentor type or import it from the appropriate module
type FrontendMentor = {
  id: number;
  name: string;
  // Add other relevant fields here
};

export const mentorshipApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMentors: builder.query<FrontendMentor[], void>({
      query: () => "auth/mentors/",
      providesTags: ["User"],
    }),
    cancelMentorSession: builder.mutation<void, number>({
      query: (sessionId) => ({
        url: `mentorship/sessions/${sessionId}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["session"],
    }),
  }),
})

export const { useGetMentorsQuery, useCancelMentorSessionMutation } = mentorshipApi
