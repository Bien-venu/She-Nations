"use client";

import { useState } from "react";
import { X, DollarSign } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { booksession } from "@/lib/slices/mentorshipSlice";
import { addNotification } from "@/lib/slices/notificationsSlice";

interface MentorBookingModalProps {
  onClose: () => void;
  mentorId: string | null;
}

export function MentorBookingModal({
  onClose,
  mentorId,
}: MentorBookingModalProps) {
  const { selectedMentor } = useAppSelector((state) => state.mentorship);
  const dispatch = useAppDispatch();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [topic, setTopic] = useState("");

  if (!selectedMentor) return null;

  const handleBooking = () => {
    if (selectedDate && selectedTime && topic) {
      dispatch(
        booksession({
          mentorId: selectedMentor.id,
          mentorName: selectedMentor.name,
          date: selectedDate,
          time: selectedTime,
          status: "scheduled",
          topic,
        })
      );

      dispatch(
        addNotification({
          title: "session Booked Successfully",
          message: `Your session with ${selectedMentor.name} has been scheduled for ${selectedDate} at ${selectedTime}`,
          type: "success",
          read: false,
        })
      );

      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold font-poppins">Book session</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <img
              src={selectedMentor.avatar || "/placeholder.svg"}
              alt={selectedMentor.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h3 className="font-semibold">{selectedMentor.name}</h3>
              <p className="text-sm text-gray-600">
                {selectedMentor.experience}
              </p>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <DollarSign className="w-4 h-4 mr-1" />${selectedMentor.price}
                /hour
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Time Slots
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["10:00 AM", "2:00 PM", "4:00 PM", "6:00 PM"].map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`p-3 rounded-lg border transition-colors ${
                      selectedTime === time
                        ? "bg-purple-100 border-purple-500 text-purple-700"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                session Topic
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="What would you like to discuss in this session?"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleBooking}
              disabled={!selectedDate || !selectedTime || !topic}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              Book session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
