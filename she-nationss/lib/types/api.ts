// Auth & Accounts Types
export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  phone: string;
  location: string;
  role: string;
  education_level: string;
};

export type RegisterResponse = { message: string };

export type LoginPayload = { email: string; password: string };

export type LoginResponse = {
  message: string;
  access: string;
  refresh: string;
  user: User;
};

export type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  role: string;
  education_level: string;
  is_active: boolean;
  date_registered: string;
};

export type AllUsersResponse = User[];

export type VerifyUserPayload = { user_id: number };
export type VerifyUserResponse = { detail: string };

// Profile Types
export type ProfilePayload = {
  bio: string;
  skills: string;
  interests: string;
  profile_picture_url: string;
  resume_url: string;
  rating: string;
  sessions_completed: number;
  years_experience: string;
};

export type ProfileResponse = {
  detail: string;
  profile: ProfilePayload;
};

export type UpdateProfilePayload = ProfilePayload;
export type UpdateProfileResponse = ProfileResponse;

// Course Types
export type CoursePayload = {
  title: string;
  category: string;
  description: string;
  certificate_available: boolean;
  level: string;
  price: string;
  duration_weeks: number;
  instructor_name: string;
};

export type Course = Omit<CoursePayload, "instructor_name"> & {
  instructor_name: string;
};

export type CourseResponse = {
  detail: string;
  course: Course & { id: number; posted_by: string };
};

export type AllCoursesResponse = CourseResponse["course"][];
export type CourseByIdResponse = CourseResponse["course"];
export type UpdateCoursePayload = CoursePayload;
export type UpdateCourseResponse = CourseResponse;
export type DeleteCourseResponse = { detail: string };

// session Types
export type sessionPayload = {
  course: number;
  title: string;
  video_url: string;
  duration_minutes: number;
  order: number;
};

export type session = sessionPayload;

export type sessionResponse = {
  detail: string;
  session: session & { id: number; course_title: string };
};

export type AllsessionsResponse = sessionResponse["session"][];
export type sessionByIdResponse = sessionResponse["session"];
export type UpdatesessionPayload = sessionPayload;
export type UpdatesessionResponse = sessionResponse;
export type DeletesessionResponse = { detail: string };

// Enrollment Types
export type EnrollmentPayload = { course: number };

export type Enrollment = {
  id: number;
  progress: number;
  certificate_earned: boolean;
  enrolled_on: string;
  user: string;
  course: number;
  course_title: string;
};

export type EnrollmentResponse = {
  detail: string;
  enrollment: Enrollment;
};

export type AllEnrollmentsResponse = Enrollment[];
export type DeleteEnrollmentResponse = { detail: string };
export type UpdateEnrollmentPayload = { course: number };
export type UpdateEnrollmentResponse = EnrollmentResponse;

// session Progress Types
export type sessionProgressPayload = {
  enrollment: number;
  session: number;
  completed: boolean;
  watched_on: string;
};

export type sessionProgress = {
  id: number;
  completed: boolean;
  watched_on: string;
  enrollment: number;
  session: number;
  session_name: string;
  course_title: string;
};

export type sessionProgressResponse = {
  detail: string;
  session_progress: sessionProgress;
};

export type AllsessionProgressResponse = sessionProgress[];

// Review Types
export type ReviewPayload = {
  rating: number;
  comment: string;
};

export type Review = {
  id: number;
  course: number;
  user: string;
  rating: number;
  comment: string;
  created_at: string;
};

export type ReviewResponse = {
  detail: string;
  review: {
    course: number;
    rating: number;
    comment: string;
  };
};

export type AllReviewsResponse = Review[];
export type ReviewByIdResponse = Review;
export type DeleteReviewResponse = { detail: string };
