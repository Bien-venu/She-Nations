"use client";

import { Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/lib/hooks";
import { selectMentor } from "@/lib/slices/mentorshipSlice";
import { useState } from "react";
import { MentorBookingModal } from "./mentor-booking-modal";

interface MentorGridProps {
  mentors: any[];
}

export function MentorGrid({ mentors }: MentorGridProps) {
  const dispatch = useAppDispatch();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null);

  const handleBooksession = (mentor: any) => {
    dispatch(selectMentor(mentor));
    setSelectedMentorId(mentor.id);
    setShowBookingModal(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mentors.map((mentor) => (
          <div
            key={mentor.id}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center space-x-4 mb-4">
              <img
                src={mentor.avatar || "/placeholder.svg"}
                alt={mentor.name}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h3 className="text-xl font-semibold">{mentor.name}</h3>
                <p className="text-sm text-gray-500">{mentor.title}</p>
                <p className="text-sm text-gray-500">{mentor.location}</p>
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-4 flex gap-4">
              <span>
                <Star className="inline w-4 h-4 text-yellow-400 mr-1" />
                {mentor.rating ?? "0.0"}
              </span>
              <span>
                <Users className="inline w-4 h-4 text-gray-400 mr-1" />
                {mentor.sessions} sessions
              </span>
            </div>
            <div className="flex justify-between">
              <Button onClick={() => handleBooksession(mentor)}>Book</Button>
              <Button variant="outline">View Profile</Button>
            </div>
          </div>
        ))}
      </div>

      {showBookingModal && (
        <MentorBookingModal
          onClose={() => setShowBookingModal(false)}
          mentorId={selectedMentorId}
        />
      )}
    </>
  );
}
