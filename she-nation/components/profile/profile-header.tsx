"use client";

import { useState } from "react";
import { Camera, MapPin, Calendar, Mail, Phone, Edit3 } from "lucide-react";
import { useAppSelector } from "@/lib/hooks";

export function ProfileHeader() {
  const { user } = useAppSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);

  if (!user) return null;

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-600";
      case "mentor":
        return "bg-purple-100 text-purple-600";
      case "lecturer":
        return "bg-blue-100 text-blue-600";
      case "company":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="glass-effect rounded-xl p-8 mb-8">
      <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
        {/* Profile Picture */}
        <div className="relative">
          <img
            src={user.avatar || "/placeholder.svg"}
            alt={user.name}
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
          />
          <button className="absolute bottom-2 right-2 p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors">
            <Camera className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Info */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold font-poppins text-gray-900">
                {user.name}
              </h1>
              <div className="flex items-center space-x-3 mt-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(
                    user.role
                  )}`}
                >
                  {user.role}
                </span>
                {user.verified && (
                  <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-medium">
                    Verified
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors flex items-center"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
          </div>

          <p className="text-gray-700 mb-4 max-w-2xl">
            {user.bio ||
              "Passionate professional dedicated to growth and excellence in my field. Always eager to learn, share knowledge, and make meaningful connections."}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center text-gray-600">
              <Mail className="w-4 h-4 mr-2" />
              <span className="text-sm">{user.email}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="text-sm">
                {user.location || "Location not set"}
              </span>
            </div>
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="text-sm">
                Joined{" "}
                {new Date(user.joinDate || Date.now()).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center text-gray-600">
              <Phone className="w-4 h-4 mr-2" />
              <span className="text-sm">{user.phone || "Phone not set"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {user.role === "mentor"
              ? "45"
              : user.role === "lecturer"
              ? "12"
              : user.role === "company"
              ? "23"
              : "8"}
          </div>
          <div className="text-sm text-gray-600">
            {user.role === "mentor"
              ? "Mentees"
              : user.role === "lecturer"
              ? "Courses"
              : user.role === "company"
              ? "Job Posts"
              : "Courses Completed"}
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-pink-600">
            {user.role === "mentor"
              ? "4.9"
              : user.role === "lecturer"
              ? "4.8"
              : user.role === "company"
              ? "4.7"
              : "156"}
          </div>
          <div className="text-sm text-gray-600">
            {user.role === "mentor"
              ? "Rating"
              : user.role === "lecturer"
              ? "Rating"
              : user.role === "company"
              ? "Rating"
              : "Forum Posts"}
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-indigo-600">
            {user.role === "mentor"
              ? "120"
              : user.role === "lecturer"
              ? "1,234"
              : user.role === "company"
              ? "89"
              : "23"}
          </div>
          <div className="text-sm text-gray-600">
            {user.role === "mentor"
              ? "sessions"
              : user.role === "lecturer"
              ? "Students"
              : user.role === "company"
              ? "Hires"
              : "Certificates"}
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {user.role === "mentor"
              ? "2.5"
              : user.role === "lecturer"
              ? "3.2"
              : user.role === "company"
              ? "1.8"
              : "67"}
          </div>
          <div className="text-sm text-gray-600">
            {user.role === "mentor"
              ? "Years Experience"
              : user.role === "lecturer"
              ? "Years Teaching"
              : user.role === "company"
              ? "Years Active"
              : "Skills Learned"}
          </div>
        </div>
      </div>
    </div>
  );
}
