"use client";

import { useGetAllsessionsQuery } from "@/lib/api/lessonsApi"; // or sessionsApi, depending on your setup
import { useDeletesessionMutation } from "@/lib/api/lessonsApi";
import { Calendar, Clock, User, X, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format, isValid } from "date-fns"; // <-- import isValid
import { toast } from "sonner";

export default function SessionsPageContent() {
  const {
    data: sessionsData,
    isLoading,
    isError,
    refetch,
  } = useGetAllsessionsQuery();
  const [deleteSession] = useDeletesessionMutation();

  // Extend the session type to include mentor_details
  type MentorDetails = { name?: string };
  type Session = {
    id: number;
    course_title: string;
    mentor_details?: MentorDetails;
    topic?: string;
    date?: string;
    status?: string;
    start_time?: string;
    end_time?: string;
    duration?: number;
    meeting_link?: string;
    // ...other properties from sessionPayload
  };
  const sessions: Session[] = sessionsData || [];

  const handleCancelSession = async (sessionId: number) => {
    try {
      await deleteSession(sessionId).unwrap();
      toast.success("Session cancelled successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to cancel session");
      console.error("Cancellation error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Failed to load sessions</p>
        <Button variant="outline" onClick={() => refetch()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  if (!sessions.length) {
    return (
      <div className="text-center py-20">
        <div className="mx-auto h-24 w-24 text-gray-400">
          <Calendar className="w-full h-full" />
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          No sessions booked
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by booking a session with a mentor
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Your sessions</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sessions.map((session) => {
          const sessionDate = session.date ? new Date(session.date) : null;
          const formattedDate =
            sessionDate && isValid(sessionDate)
              ? format(sessionDate, "PPP")
              : "No date available";

          return (
            <div
              key={session.id}
              className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {session.topic}
                    </h3>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <User className="mr-1 h-4 w-4" />
                      <span>{session.mentor_details?.name || "Mentor"}</span>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      session.status === "scheduled"
                        ? "bg-green-100 text-green-800"
                        : session.status === "completed"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {session.status}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>
                      {session.start_time} - {session.end_time} (
                      {session.duration} mins)
                    </span>
                  </div>
                </div>

                {session.meeting_link && (
                  <div className="mt-4">
                    <a
                      href={session.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      <Video className="mr-2 h-4 w-4" />
                      Join Meeting
                    </a>
                  </div>
                )}

                <div className="mt-6 flex justify-end space-x-2">
                  {session.status === "scheduled" && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleCancelSession(session.id)}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
