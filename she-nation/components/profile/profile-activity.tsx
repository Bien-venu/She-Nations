"use client"

import { BookOpen, Users, Award, MessageCircle, Briefcase } from "lucide-react"
import { useAppSelector } from "@/lib/hooks"

export function ProfileActivity() {
  const { user } = useAppSelector((state) => state.auth)

  const activities = [
    {
      id: 1,
      type: "course_completed",
      title: "Completed 'Advanced Leadership Strategies'",
      description: "Successfully finished the course with a score of 95%",
      date: "2024-01-15",
      icon: BookOpen,
      color: "text-blue-600",
    },
    {
      id: 2,
      type: "forum_post",
      title: "Posted in Career Development Forum",
      description: "Shared insights on 'Building Effective Teams in Remote Work'",
      date: "2024-01-12",
      icon: MessageCircle,
      color: "text-purple-600",
    },
    {
      id: 3,
      type: "mentorship_started",
      title: "Started mentoring Sarah Johnson",
      description: "New mentorship relationship focused on career transition",
      date: "2024-01-10",
      icon: Users,
      color: "text-green-600",
    },
    {
      id: 4,
      type: "achievement_earned",
      title: "Earned 'Communication Expert' Badge",
      description: "Recognized for outstanding communication skills",
      date: "2024-01-08",
      icon: Award,
      color: "text-yellow-600",
    },
    {
      id: 5,
      type: "job_applied",
      title: "Applied for Senior Manager Position",
      description: "Application submitted to TechForward Inc.",
      date: "2024-01-05",
      icon: Briefcase,
      color: "text-indigo-600",
    },
    {
      id: 6,
      type: "course_enrolled",
      title: "Enrolled in 'Digital Marketing Fundamentals'",
      description: "Started new learning journey in digital marketing",
      date: "2024-01-03",
      icon: BookOpen,
      color: "text-blue-600",
    },
  ]

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return "Today"
    if (diffInDays === 1) return "Yesterday"
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    return `${Math.floor(diffInDays / 30)} months ago`
  }

  return (
    <div className="space-y-6">
      {/* Activity Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-effect rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">12</div>
          <div className="text-sm text-gray-600">Courses Completed</div>
        </div>
        <div className="glass-effect rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">45</div>
          <div className="text-sm text-gray-600">Forum Posts</div>
        </div>
        <div className="glass-effect rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">8</div>
          <div className="text-sm text-gray-600">Mentorships</div>
        </div>
        <div className="glass-effect rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">15</div>
          <div className="text-sm text-gray-600">Achievements</div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-6">Activity Timeline</h3>
        <div className="space-y-6">
          {activities.map((activity) => {
            const Icon = activity.icon
            return (
              <div key={activity.id} className="flex items-start space-x-4">
                <div className={`flex-shrink-0 p-2 rounded-lg bg-gray-50 ${activity.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">{activity.title}</h4>
                    <span className="text-sm text-gray-500">{getTimeAgo(activity.date)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Monthly Activity Chart */}
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-6">Monthly Activity</h3>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 35 }, (_, i) => {
            const intensity = Math.random()
            return (
              <div
                key={i}
                className={`aspect-square rounded-sm ${
                  intensity > 0.7
                    ? "bg-purple-600"
                    : intensity > 0.4
                      ? "bg-purple-400"
                      : intensity > 0.2
                        ? "bg-purple-200"
                        : "bg-gray-100"
                }`}
                title={`Activity level: ${Math.round(intensity * 100)}%`}
              />
            )
          })}
        </div>
        <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
          <span>Less active</span>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-gray-100 rounded-sm" />
            <div className="w-3 h-3 bg-purple-200 rounded-sm" />
            <div className="w-3 h-3 bg-purple-400 rounded-sm" />
            <div className="w-3 h-3 bg-purple-600 rounded-sm" />
          </div>
          <span>More active</span>
        </div>
      </div>
    </div>
  )
}
