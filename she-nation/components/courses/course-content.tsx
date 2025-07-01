"use client";

import { useState, useEffect } from "react";
import {
  Play,
  Lock,
  CheckCircle,
  Clock,
  FileText,
  Video,
  Download,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Star,
  PlusCircle,
  Trash2,
  Edit,
  X,
  Image, // New import for image icon
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { updateCourseProgress } from "@/lib/slices/coursesSlice";
import { addNotification } from "@/lib/slices/notificationsSlice";
import { useGetCourseByIdQuery } from "@/lib/api/coursesApi";
import {
  useCreateEnrollmentMutation,
  useDeleteEnrollmentMutation,
  useGetAllEnrollmentsQuery,
} from "@/lib/api/enrollmentsApi";
import {
  useCreatesessionProgressMutation,
  useGetAllsessionProgressQuery,
} from "@/lib/api/sessionProgressApi";
import {
  useGetAllsessionsQuery,
  useDeletesessionMutation,
  useUpdatesessionMutation,
  useGetsessionByIdQuery,
} from "@/lib/api/sessionsApi"; // Make sure this file exists at src/lib/api/sessionsApi.ts
import {
  useCreateReviewMutation,
  useGetAllReviewsQuery,
} from "@/lib/api/reviewsApi";
// Inside CourseContent.tsx
import { CreatesessionForm } from "@/components/CreatesessionForm";

// Assuming CourseContentProps is defined elsewhere, e.g., in types/components.ts
interface CourseContentProps {
  courseId: string; // Keep as string as it comes from URL params
}

interface Course {
  id: number;
  posted_by: string;
  title: string;
  category: string;
  description: string;
  certificate_available: boolean;
  level: string;
  price: string;
  duration_weeks: number;
  instructor_name: string;
  progress: number; // Assuming this comes from the course detail
}

interface session {
  id: number;
  course_title: string;
  title: string;
  video_url: string | null;
  image_url: string | null; // NEW: Added for image display
  duration_minutes: number;
  order: number;
  course: number;
}

interface Review {
  id: number;
  user: { id: number; username: string };
  rating: number;
  comment: string;
  created_at: string;
}

interface Enrollment {
  id: number;
  progress: number;
  certificate_earned: boolean;
  enrolled_on: string;
  user: string; // The username string
  course: number;
  course_title: string;
}

interface sessionProgress {
  id: number;
  completed: boolean;
  watched_on: string;
  enrollment: number;
  session: number;
  session_name: string;
  course_title: string;
}

export function CourseContent({ courseId }: CourseContentProps) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const parsedCourseId = Number.parseInt(courseId);
  // Inside CourseContent component
  const [showCreatesessionModal, setShowCreatesessionModal] = useState(false);
  const isMentor = user?.role === "Mentor";

  const {
    data: course,
    isLoading: isLoadingCourse,
    error: courseError,
    refetch: refetchCourse,
  } = useGetCourseByIdQuery(parsedCourseId);
  const {
    data: allsessionsData,
    isLoading: isLoadingsessions,
    error: sessionsError,
    refetch: refetchsessions,
  } = useGetAllsessionsQuery();

  const {
    data: reviewsData,
    isLoading: isLoadingReviews,
    error: reviewsError,
  } = useGetAllReviewsQuery(parsedCourseId);
  const {
    data: allEnrollmentsData,
    isLoading: isLoadingEnrollments,
    error: enrollmentsError,
    refetch: refetchEnrollments,
  } = useGetAllEnrollmentsQuery();
  const {
    data: allsessionProgressData,
    isLoading: isLoadingsessionProgress,
    error: sessionProgressError,
    refetch: refetchsessionProgress,
  } = useGetAllsessionProgressQuery();

  const [createEnrollment] = useCreateEnrollmentMutation();
  const [deleteEnrollment] = useDeleteEnrollmentMutation();
  const [createsessionProgress] = useCreatesessionProgressMutation();
  const [createReview] = useCreateReviewMutation();
  const [deletesession] = useDeletesessionMutation();
  const [updatesession] = useUpdatesessionMutation();

  const [activesessionIndex, setActivesessionIndex] = useState(0);
  const [sessionCompletionStatus, setsessionCompletionStatus] = useState<
    Record<string, boolean>
  >({});
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);

  const [showEditsessionModal, setShowEditsessionModal] = useState(false);
  const [editingsession, setEditingsession] = useState<session | null>(null);
  const [editsessionTitle, setEditsessionTitle] = useState("");
  const [editsessionVideoUrl, setEditsessionVideoUrl] = useState("");
  const [editsessionDuration, setEditsessionDuration] = useState(0);
  const [editsessionOrder, setEditsessionOrder] = useState(0);

  const coursesessions: session[] = (allsessionsData || [])
    .filter((session: session) => session.course === parsedCourseId)
    .sort((a, b) => a.order - b.order);

  const isEnrolled =
    allEnrollmentsData?.some(
      (enrollment) =>
        enrollment.user === user?.name && enrollment.course === parsedCourseId
    ) || false;

  const currentUserEnrollment = allEnrollmentsData?.find(
    (enrollment) =>
      enrollment.user === user?.name && enrollment.course === parsedCourseId
  );
  const currentEnrollmentId = currentUserEnrollment?.id;

  useEffect(() => {
    if (user && currentUserEnrollment && allsessionProgressData) {
      const newCompletionStatus: Record<string, boolean> = {};
      allsessionProgressData.forEach((lp) => {
        if (lp.enrollment === currentUserEnrollment.id && lp.completed) {
          newCompletionStatus[lp.session.toString()] = true;
        }
      });
      setsessionCompletionStatus(newCompletionStatus);
    } else {
      setsessionCompletionStatus({});
    }
  }, [user, currentUserEnrollment, allsessionProgressData]);

  useEffect(() => {
    if (coursesessions.length > 0) {
      const completedCount = Object.values(sessionCompletionStatus).filter(
        Boolean
      ).length;
      const totalsessions = coursesessions.length;
      const newCourseProgress = Math.round(
        (completedCount / totalsessions) * 100
      );
      dispatch(
        updateCourseProgress({
          courseId: parsedCourseId.toString(),
          progress: newCourseProgress,
        })
      );
    } else {
      dispatch(
        updateCourseProgress({
          courseId: parsedCourseId.toString(),
          progress: 0,
        })
      );
    }
  }, [
    sessionCompletionStatus,
    coursesessions.length,
    parsedCourseId,
    dispatch,
  ]);

  if (
    isLoadingCourse ||
    isLoadingsessions ||
    isLoadingReviews ||
    isLoadingEnrollments ||
    isLoadingsessionProgress
  )
    return <div>Loading course content...</div>;
  if (courseError)
    return (
      <div>Error loading course: {courseError.message || "Unknown error"}</div>
    );
  if (sessionsError)
    return (
      <div>
        Error loading sessions: {sessionsError.message || "Unknown error"}
      </div>
    );
  if (reviewsError)
    return (
      <div>
        Error loading reviews: {reviewsError.message || "Unknown error"}
      </div>
    );
  if (enrollmentsError)
    return (
      <div>
        Error loading enrollments: {enrollmentsError.message || "Unknown error"}
      </div>
    );
  if (sessionProgressError)
    return (
      <div>
        Error loading session progress:{" "}
        {sessionProgressError.message || "Unknown error"}
      </div>
    );

  if (!course) return null;

  const currentsession = coursesessions[activesessionIndex];

  const getTotalsessions = () => coursesessions.length;
  const getCompletedsessions = () =>
    Object.values(sessionCompletionStatus).filter(Boolean).length;

  const handleEnrollCourse = async () => {
    if (!user) {
      dispatch(
        addNotification({
          title: "Login Required",
          message: "Please log in to enroll in this course",
          type: "error",
          read: false,
        })
      );
      return;
    }

    try {
      await createEnrollment({
        user: user.id,
        course: parsedCourseId,
      }).unwrap();
      dispatch(
        addNotification({
          title: "Enrolled Successfully",
          message: `You have been enrolled in "${course.title}"`,
          type: "success",
          read: false,
        })
      );
      refetchEnrollments();
      refetchsessionProgress();
    } catch (err: any) {
      dispatch(
        addNotification({
          title: "Enrollment Failed",
          message:
            err.data?.detail ||
            "Failed to enroll in the course. You might already be enrolled.",
          type: "error",
          read: false,
        })
      );
    }
  };

  const handleUnenrollCourse = async () => {
    if (!user) {
      dispatch(
        addNotification({
          title: "Login Required",
          message: "Please log in to unenroll.",
          type: "error",
          read: false,
        })
      );
      return;
    }

    if (!isEnrolled || !currentEnrollmentId) {
      dispatch(
        addNotification({
          title: "Not Enrolled",
          message: "You are not enrolled in this course.",
          type: "error",
          read: false,
        })
      );
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to unenroll from "${course.title}"? Your progress will be lost.`
      )
    ) {
      return;
    }

    try {
      await deleteEnrollment(currentEnrollmentId).unwrap();
      dispatch(
        addNotification({
          title: "Unenrolled Successfully",
          message: `You have been unenrolled from "${course.title}".`,
          type: "success",
          read: false,
        })
      );
      refetchEnrollments();
      refetchsessionProgress();
      setsessionCompletionStatus({});
      setActivesessionIndex(0);
    } catch (err: any) {
      dispatch(
        addNotification({
          title: "Unenrollment Failed",
          message: err.data?.detail || "Failed to unenroll from the course.",
          type: "error",
          read: false,
        })
      );
    }
  };

  const handlesessionClick = (sessionIndex: number) => {
    if (isEnrolled || isMentor) {
      setActivesessionIndex(sessionIndex);
    }
  };

  const markAsComplete = async () => {
    if (!currentsession || !isEnrolled || !user || !currentUserEnrollment)
      return;

    const sessionKey = `${currentsession.id}`;

    if (sessionCompletionStatus[sessionKey]) {
      dispatch(
        addNotification({
          title: "Already Completed",
          message: "This session is already marked as complete",
          type: "info",
          read: false,
        })
      );
      return;
    }

    try {
      await createsessionProgress({
        user: user.id,
        session: currentsession.id,
        enrollment: currentUserEnrollment.id,
        completed: true,
      }).unwrap();

      const newCompletionStatus = {
        ...sessionCompletionStatus,
        [sessionKey]: true,
      };
      setsessionCompletionStatus(newCompletionStatus);

      dispatch(
        addNotification({
          title: "session Completed!",
          message: `You've completed "${currentsession.title}"`,
          type: "success",
          read: false,
        })
      );

      setTimeout(() => {
        navigateToNext();
      }, 1000);
    } catch (err: any) {
      dispatch(
        addNotification({
          title: "Completion Failed",
          message: err.data?.detail || "Failed to mark session as complete.",
          type: "error",
          read: false,
        })
      );
    }
  };

  const handleDeletesession = async (
    sessionId: number,
    sessionTitle: string
  ) => {
    if (!isMentor) {
      dispatch(
        addNotification({
          title: "Unauthorized",
          message: "Only mentors can delete sessions.",
          type: "error",
          read: false,
        })
      );
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to delete the session "${sessionTitle}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await deletesession(sessionId).unwrap();
      dispatch(
        addNotification({
          title: "session Deleted",
          message: `session "${sessionTitle}" has been successfully deleted.`,
          type: "success",
          read: false,
        })
      );
      refetchsessions();
      if (currentsession?.id === sessionId) {
        setActivesessionIndex(0);
      }
    } catch (err: any) {
      dispatch(
        addNotification({
          title: "Deletion Failed",
          message: err.data?.detail || "Failed to delete session.",
          type: "error",
          read: false,
        })
      );
    }
  };

  const handleEditsessionClick = (session: session) => {
    if (!isMentor) {
      dispatch(
        addNotification({
          title: "Unauthorized",
          message: "Only mentors can edit sessions.",
          type: "error",
          read: false,
        })
      );
      return;
    }
    setEditingsession(session);
    setEditsessionTitle(session.title);
    setEditsessionVideoUrl(session.video_url || "");
    setEditsessionDuration(session.duration_minutes || 0);
    setEditsessionOrder(session.order || 0);
    setShowEditsessionModal(true);
  };

  const handleUpdatesessionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingsession || !isMentor) return;

    console.log(
      editsessionTitle,
      editsessionVideoUrl,
      editsessionDuration,
      editsessionOrder
    );

    try {
      await updatesession({
        id: editingsession.id,
        session: {
          course: parsedCourseId,
          title: editsessionTitle,
          video_url: editsessionVideoUrl || null,
          duration_minutes: editsessionDuration,
          order: editsessionOrder,
        },
      }).unwrap();

      dispatch(
        addNotification({
          title: "session Updated",
          message: `session "${editsessionTitle}" updated successfully.`,
          type: "success",
          read: false,
        })
      );
      setShowEditsessionModal(false);
      setEditingsession(null);
      refetchsessions();
    } catch (err: any) {
      dispatch(
        addNotification({
          title: "Update Failed",
          message: err.data?.detail || "Failed to update session.",
          type: "error",
          read: false,
        })
      );
    }
  };

  const navigateToNext = () => {
    if (activesessionIndex < coursesessions.length - 1) {
      setActivesessionIndex(activesessionIndex + 1);
    } else {
      dispatch(
        addNotification({
          title: "Course Completed!",
          message: `Congratulations! You've completed "${course.title}"`,
          type: "success",
          read: false,
        })
      );
    }
  };

  const navigateToPrevious = () => {
    if (activesessionIndex > 0) {
      setActivesessionIndex(activesessionIndex - 1);
    }
  };

  const canNavigateNext = () => {
    return activesessionIndex < coursesessions.length - 1;
  };

  const canNavigatePrevious = () => {
    return activesessionIndex > 0;
  };

  const getsessionType = (session?: session) => {
    if (!session) return "document";

    if (session.video_url) {
      return "video";
    }

    if (session.image_url) {
      return "image";
    }

    return "document";
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="w-4 h-4" />;
      case "document":
        return <FileText className="w-4 h-4" />;
      case "image": // NEW: Icon for image
        return <Image className="w-4 h-4" />;
      case "quiz":
        return <CheckCircle className="w-4 h-4" />;
      case "exercise":
        return <Download className="w-4 h-4" />;
      case "project":
        return <BookOpen className="w-4 h-4" />;
      default:
        return <Play className="w-4 h-4" />;
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      dispatch(
        addNotification({
          title: "Login Required",
          message: "Please log in to submit a review.",
          type: "error",
          read: false,
        })
      );
      return;
    }
    if (reviewRating === 0) {
      dispatch(
        addNotification({
          title: "Rating Required",
          message: "Please select a star rating for your review.",
          type: "error",
          read: false,
        })
      );
      return;
    }

    try {
      await createReview({
        courseId: parsedCourseId,
        review: {
          user: user.id,
          rating: reviewRating,
          comment: reviewComment,
        },
      }).unwrap();
      dispatch(
        addNotification({
          title: "Review Submitted",
          message: "Your review has been successfully submitted!",
          type: "success",
          read: false,
        })
      );
      setReviewRating(0);
      setReviewComment("");
      setShowReviewForm(false);
    } catch (err: any) {
      dispatch(
        addNotification({
          title: "Review Submission Failed",
          message:
            err.data?.detail ||
            "Failed to submit review. You might have already reviewed this course.",
          type: "error",
          read: false,
        })
      );
    }
  };

  return (
    <div className="space-y-6 bg-white">
      {/* Course Progress */}
      {isEnrolled && (
        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Your Progress</h3>
            <span className="text-purple-600 font-bold">
              {course?.progress || 0}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${course?.progress || 0}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {getCompletedsessions()} of {getTotalsessions()} sessions completed
          </p>
        </div>
      )}

      {/* Course Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* session List */}
        <div className="lg:col-span-1">
          <div className="glass-effect rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Course sessions</h3>
            <div className="space-y-2">
              {coursesessions.length > 0 ? (
                coursesessions.map((session, sessionIndex) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between gap-2 p-3 border border-gray-200 rounded-lg"
                  >
                    <button
                      onClick={() => handlesessionClick(sessionIndex)}
                      disabled={!isEnrolled && !isMentor}
                      className={`flex-1 text-left flex items-center space-x-3 transition-colors ${
                        activesessionIndex === sessionIndex
                          ? "bg-purple-100 text-purple-700"
                          : "hover:bg-gray-50"
                      } ${
                        !isEnrolled && !isMentor
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {sessionCompletionStatus[`${session.id}`] ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : isEnrolled || isMentor ? (
                          getIconForType(getsessionType(session))
                        ) : (
                          <Lock className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {session.title}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{session.duration_minutes} min</span>
                        </div>
                      </div>
                    </button>
                    {isMentor && (
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEditsessionClick(session)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                          title={`Edit "${session.title}"`}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleDeletesession(session.id, session.title)
                          }
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          title={`Delete "${session.title}"`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-600">
                  No sessions available for this course yet.
                </p>
              )}
              {isMentor && (
                <button
                  className="w-full mt-4 flex items-center justify-center p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  onClick={() => setShowCreatesessionModal(true)}
                >
                  <PlusCircle className="w-5 h-5 mr-2" />
                  Add New session
                </button>
              )}
            </div>
          </div>
        </div>

        {/* session Content Display Area */}
        <div className="lg:col-span-2">
          <div className="glass-effect rounded-xl p-6">
            {isEnrolled || isMentor ? (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">
                    {currentsession?.title || "Select a session"}
                  </h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {currentsession?.duration_minutes} min
                    </div>
                    <div className="flex items-center">
                      {getIconForType(
                        currentsession
                          ? getsessionType(currentsession)
                          : "video"
                      )}
                      <span className="ml-1 capitalize">
                        {currentsession
                          ? getsessionType(currentsession)
                          : "video"}
                      </span>
                    </div>
                    {currentsession &&
                      sessionCompletionStatus[`${currentsession.id}`] && (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Completed
                        </div>
                      )}
                  </div>
                </div>

                {/* Video Player or Image Display Area */}
                <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center mb-6 overflow-hidden">
                  {currentsession?.video_url ? (
                    // Video Player
                    <video
                      controls
                      src={currentsession.video_url}
                      className="w-full h-full object-cover"
                      poster={currentsession.image_url || undefined} // Use image as poster if available
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : currentsession?.image_url ? (
                    // Image Display
                    <img
                      src={currentsession.image_url}
                      alt={currentsession.title}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    // Generic Content Display Area
                    <div className="text-center text-white">
                      <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">Content Display Area</p>
                      <p className="text-sm opacity-75">
                        {currentsession?.title}
                        <br />
                        {getsessionType(currentsession) === "document" &&
                          "View Document / Quiz"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Navigation and Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-3">
                    {currentsession &&
                      !sessionCompletionStatus[`${currentsession.id}`] &&
                      isEnrolled && (
                        <button
                          onClick={markAsComplete}
                          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                        >
                          Mark as Complete
                        </button>
                      )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Lock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">
                  Enroll to Access Content
                </h3>
                <p className="text-gray-600 mb-6">
                  Join thousands of students and start learning today!
                </p>
                <button
                  onClick={handleEnrollCourse}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  Enroll Now
                </button>
              </div>
            )}
            {/* Unenroll button - displayed only if user is enrolled and NOT a mentor */}
            {isEnrolled && user && !isMentor && (
              <div className="mt-6 text-center">
                <button
                  onClick={handleUnenrollCourse}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Unenroll from Course
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="glass-effect rounded-xl p-6 mt-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center justify-between">
          <span>Student Reviews ({reviewsData?.length || 0})</span>
          {isEnrolled && (
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              {showReviewForm ? "Cancel Review" : "Add Your Review"}
            </button>
          )}
        </h3>

        {showReviewForm && isEnrolled && (
          <form
            onSubmit={handleReviewSubmit}
            className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50"
          >
            <h4 className="font-medium mb-3">Submit Your Review</h4>
            <div className="mb-3">
              <label
                htmlFor="rating"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Rating:
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 cursor-pointer ${
                      reviewRating >= star
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                    onClick={() => setReviewRating(star)}
                  />
                ))}
              </div>
            </div>
            <div className="mb-3">
              <label
                htmlFor="comment"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Comment:
              </label>
              <textarea
                id="comment"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                placeholder="Share your thoughts about this course..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
            >
              Submit Review
            </button>
          </form>
        )}

        {reviewsData && reviewsData.length > 0 ? (
          <div className="space-y-4">
            {reviewsData.map((review) => (
              <div
                key={review.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center mb-2">
                  <p className="font-semibold mr-2">{review.user.username}</p>
                  <div className="flex">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          review.rating > i
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-2">{review.comment}</p>
                <p className="text-xs text-gray-500">
                  Reviewed on:{" "}
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">
            No reviews yet. Be the first to review this course!
          </p>
        )}
      </div>

      {/* Edit session Modal */}
      {showEditsessionModal && editingsession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-lg relative">
            <button
              onClick={() => setShowEditsessionModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-bold mb-6">
              Edit session: {editingsession.title}
            </h3>
            <form onSubmit={handleUpdatesessionSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="editTitle"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="editTitle"
                  value={editsessionTitle}
                  onChange={(e) => setEditsessionTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="editVideoUrl"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Video URL (Optional)
                </label>
                <input
                  type="url"
                  id="editVideoUrl"
                  value={editsessionVideoUrl}
                  onChange={(e) => setEditsessionVideoUrl(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="editDuration"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  id="editDuration"
                  value={editsessionDuration}
                  onChange={(e) =>
                    setEditsessionDuration(parseInt(e.target.value))
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="0"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="editOrder"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Order
                </label>
                <input
                  type="number"
                  id="editOrder"
                  value={editsessionOrder}
                  onChange={(e) =>
                    setEditsessionOrder(parseInt(e.target.value))
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="1"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditsessionModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCreatesessionModal && isMentor && (
        <CreatesessionForm
          courseId={parsedCourseId}
          onsessionCreated={() => {
            setShowCreatesessionModal(false); // Close modal on success
            refetchsessions(); // Re-fetch sessions to show the new one
          }}
          onCancel={() => setShowCreatesessionModal(false)} // Close modal on cancel
        />
      )}
    </div>
  );
}
