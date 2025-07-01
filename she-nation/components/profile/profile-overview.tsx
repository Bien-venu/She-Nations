"use client"

import { MapPin, Calendar, Award, Users, BookOpen } from "lucide-react"
import { useAppSelector } from "@/lib/hooks"

export function ProfileOverview() {
  const { user } = useAppSelector((state) => state.auth)

  if (!user) return null

  const skills = [
    "Leadership",
    "Communication",
    "Project Management",
    "Strategic Planning",
    "Team Building",
    "Problem Solving",
  ]
  const interests = [
    "Technology",
    "Innovation",
    "Mentoring",
    "Professional Development",
    "Networking",
    "Continuous Learning",
  ]

  const recentActivity = [
    { type: "course", title: "Completed Advanced Leadership Course", date: "2 days ago" },
    { type: "forum", title: "Posted in Career Development", date: "1 week ago" },
    { type: "mentorship", title: "Started mentoring Sarah Johnson", date: "2 weeks ago" },
    { type: "achievement", title: "Earned Communication Expert badge", date: "3 weeks ago" },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "course":
        return <BookOpen className="w-4 h-4 text-blue-600" />
      case "forum":
        return <Users className="w-4 h-4 text-purple-600" />
      case "mentorship":
        return <Users className="w-4 h-4 text-green-600" />
      case "achievement":
        return <Award className="w-4 h-4 text-yellow-600" />
      default:
        return <Calendar className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* About */}
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4">About</h3>
          <p className="text-gray-700 leading-relaxed">
            {user.bio ||
              "Passionate professional with a strong commitment to excellence and continuous growth. I believe in the power of collaboration, innovation, and lifelong learning to drive meaningful change and create positive impact in both personal and professional spheres."}
          </p>
        </div>

        {/* Skills */}
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4">Skills & Expertise</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span key={skill} className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.type)}</div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">{activity.title}</p>
                  <p className="text-sm text-gray-500">{activity.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Contact Info */}
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
          <div className="space-y-3">
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-3" />
              <span className="text-sm">{user.location || "Location not set"}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-3" />
              <span className="text-sm">Joined {new Date(user.joinDate || Date.now()).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Interests */}
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Interests</h3>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest) => (
              <span key={interest} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300">
              Edit Profile
            </button>
            <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Download Resume
            </button>
            <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Share Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
