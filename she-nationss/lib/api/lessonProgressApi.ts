import { baseApi } from "./baseApi";


import type {
  sessionProgressPayload,
  sessionProgressResponse,
  AllsessionProgressResponse,
} from "../types/api";

export const lessonProgressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createLessonProgress: builder.mutation<
      sessionProgressResponse,
      sessionProgressPayload
    >({
      query: (progress) => ({
        url: "/courses/lesson-progress/",
        method: "POST",
        body: progress,
      }),
      invalidatesTags: ["SessionProgress"],
    }),
    getAllLessonProgress: builder.query<AllsessionProgressResponse, void>({
      query: () => "/courses/lesson-progress/",
      providesTags: ["SessionProgress"],
    }),
  }),
});

export const { useCreateLessonProgressMutation, useGetAllLessonProgressQuery } =
  lessonProgressApi;
