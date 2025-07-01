import { baseApi } from "./baseApi";
import type {
  sessionPayload,
  sessionResponse,
  AllsessionsResponse,
  sessionByIdResponse,
  UpdatesessionPayload,
  UpdatesessionResponse,
  DeletesessionResponse,
} from "../types/api";

export const sessionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createsession: builder.mutation<sessionResponse, sessionPayload>({
      query: (session) => ({
        url: "/courses/sessions/",
        method: "POST",
        body: session,
      }),
      invalidatesTags: ["session"],
    }),
    getAllsessions: builder.query<AllsessionsResponse, void>({
      query: () => "/courses/sessions/",
      providesTags: ["session"],
    }),
    getsessionById: builder.query<sessionByIdResponse, number>({
      query: (id) => `/courses/sessions/${id}/`,
      providesTags: (result, error, id) => [{ type: "session", id }],
    }),
    updatesession: builder.mutation<
      UpdatesessionResponse,
      { id: number; session: UpdatesessionPayload }
    >({
      query: ({ id, session }) => ({
        url: `/courses/sessions/${id}/`,
        method: "PUT",
        body: session,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "session", id }],
    }),
    deletesession: builder.mutation<DeletesessionResponse, number>({
      query: (id) => ({
        url: `/courses/sessions/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "session", id }],
    }),
  }),
});

export const {
  useCreatesessionMutation,
  useGetAllsessionsQuery,
  useGetsessionByIdQuery,
  useUpdatesessionMutation,
  useDeletesessionMutation,
} = sessionsApi;
