"use client";

import { Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { selectMentor } from "@/lib/slices/mentorshipSlice";
import { MentorBookingModal } from "./mentor-booking-modal";
import { useState } from "react";

interface MentorGridProps {
  mentors: any[];
}

export function MentorGrid({ mentors: initialMentors }: MentorGridProps) {
  const {
    mentors: reduxMentors,
    searchQuery,
    filters,
  } = useAppSelector((state) => state.mentorship);
  const dispatch = useAppDispatch();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null);

  const mentors = initialMentors || reduxMentors;

  // Enhanced filtering logic
  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch =
      !searchQuery ||
      mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.experience.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.expertise.some((skill) =>
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      mentor.bio.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesExpertise =
      !filters.expertise.length ||
      filters.expertise.some((exp) =>
        mentor.expertise.some((skill) =>
          skill.toLowerCase().includes(exp.toLowerCase())
        )
      );

    const matchesPrice =
      mentor.price >= filters.priceRange[0] &&
      mentor.price <= filters.priceRange[1];

    const matchesRating = mentor.rating >= filters.rating;

    const matchesLocation =
      !filters.location ||
      mentor.location.toLowerCase().includes(filters.location.toLowerCase());

      const matchesAvailability =
        !filters.availability ||
        (Array.isArray(mentor.availability) &&
          typeof filters.availability === "string" &&
          mentor.availability.some((slot: string) =>
            slot.toLowerCase().includes(
              typeof filters.availability === "string"
                ? filters.availability.toLowerCase()
                : ""
            )
          ));
    

    return (
      matchesSearch &&
      matchesExpertise &&
      matchesPrice &&
      matchesRating &&
      matchesLocation &&
      matchesAvailability
    );
  });

  const handleBooksession = (mentor: any) => {
    dispatch(selectMentor(mentor));
    setSelectedMentorId(mentor.id);
    setShowBookingModal(true);
  };

  const handleViewProfile = (mentorId: string) => {
    // Navigate to mentor profile page
    window.location.href = `/mentors/${mentorId}`;
  };

  return (
    <>
      <div className="mb-6">
        <p className="text-gray-600">
          {filteredMentors.length} mentor
          {filteredMentors.length !== 1 ? "s" : ""} found
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMentors.map((mentor) => (
          <div
            key={mentor.id}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center space-x-4 mb-4">
              <img
                src={mentor.avatar || "/placeholder.svg"}
                alt={mentor.name}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {mentor.name}
                </h3>
                <p className="text-gray-600">{mentor.title}</p>
                <p className="text-gray-600">{mentor.company}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                {mentor.rating}
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {mentor.sessions} sessions
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => handleViewProfile(mentor.id)}>
                View Profile
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredMentors.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No mentors found
          </h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search criteria or filters to find more mentors.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      {showBookingModal && (
        <MentorBookingModal
          onClose={() => setShowBookingModal(false)}
          mentorId={selectedMentorId}
        />
      )}
    </>
  );
}
