import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Mentor, session } from "../types";

interface MentorshipState {
  mentors: Mentor[];
  sessions: session[];
  selectedMentor: Mentor | null;
  filters: {
    expertise: string[];
    priceRange: [number, number];
    rating: number;
    availability: string[];
    location: string;
    education_level: string[];
  };
  searchQuery: string;
  loading: boolean;
  error: string | null;
}

const initialState: MentorshipState = {
  mentors: [],
  sessions: [],
  selectedMentor: null,
  filters: {
    expertise: [],
    priceRange: [0, 500],
    rating: 0,
    availability: [],
    location: "",
    education_level: [],
  },
  searchQuery: "",
  loading: false,
  error: null,
};

// Async Thunks
export const fetchMentors = createAsyncThunk(
  "mentorship/fetchMentors",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<Mentor[]>("/api/mentors/");
      return response.data.map((mentor) => ({
        ...mentor,
        expertise: mentor.profile.skills?.split(",") || [],
        availability: [], // You'll need to implement availability logic
        price: mentor.role === "mentor" ? 100 : 0, // Default pricing
        rating: mentor.profile.rating || 0,
      }));
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch mentors"
      );
    }
  }
);

export const fetchUsersessions = createAsyncThunk(
  "mentorship/fetchUsersessions",
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get<session[]>(
        `/api/sessions/?user=${userId}`
      );
      return response.data.map((session) => ({
        ...session,
        mentor_details: {
          name: session.mentor.toString(), // You'll need to adjust this based on your API response
          avatar: undefined,
        },
      }));
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch sessions"
      );
    }
  }
);

export const booksession = createAsyncThunk(
  "mentorship/booksession",
  async (sessionData: Omit<session, "id" | "status">, { rejectWithValue }) => {
    try {
      const response = await axios.post<session>("/api/sessions/", {
        ...sessionData,
        status: "scheduled",
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to book session"
      );
    }
  }
);

export const updatesession = createAsyncThunk(
  "mentorship/updatesession",
  async (
    { id, updates }: { id: string; updates: Partial<session> },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.patch<session>(
        `/api/sessions/${id}/`,
        updates
      );
      return { id, updates: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update session"
      );
    }
  }
);

const mentorshipSlice = createSlice({
  name: "mentorship",
  initialState,
  reducers: {
    selectMentor: (state, action: PayloadAction<Mentor | null>) => {
      state.selectedMentor = action.payload;
    },
    setFilters: (
      state,
      action: PayloadAction<Partial<MentorshipState["filters"]>>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.searchQuery = "";
    },
    resetMentorshipState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch Mentors
      .addCase(fetchMentors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMentors.fulfilled, (state, action) => {
        state.loading = false;
        state.mentors = action.payload;
      })
      .addCase(fetchMentors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch sessions
      .addCase(fetchUsersessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersessions.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions = action.payload;
      })
      .addCase(fetchUsersessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Book session
      .addCase(booksession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(booksession.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions.push(action.payload);
      })
      .addCase(booksession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update session
      .addCase(updatesession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatesession.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.sessions.findIndex(
          (s) => s.id === action.payload.id
        );
        if (index !== -1) {
          state.sessions[index] = {
            ...state.sessions[index],
            ...action.payload.updates,
          };
        }
      })
      .addCase(updatesession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  selectMentor,
  setFilters,
  setSearchQuery,
  clearFilters,
  resetMentorshipState,
} = mentorshipSlice.actions;

export default mentorshipSlice.reducer;
