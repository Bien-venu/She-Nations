"use client"

import { Award, Star, Trophy, Medal, Target, Zap, Users } from "lucide-react"

export function ProfileAchievements() {
  const achievements = [
    {
      id: 1,
      title: "Course Completion Master",
      description: "Completed 10+ courses with excellent ratings",
      icon: Award,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      earned: true,
      date: "2024-01-15",
      progress: 100,
    },
    {
      id: 2,
      title: "Community Leader",
      description: "Made 50+ helpful forum posts",
      icon: Star,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      earned: true,
      date: "2024-01-10",
      progress: 100,
    },
    {
      id: 3,
      title: "Mentor Excellence",
      description: "Successfully mentored 5+ individuals",
      icon: Trophy,
      color: "text-green-600",
      bgColor: "bg-green-100",
      earned: true,
      date: "2024-01-05",
      progress: 100,
    },
    {
      id: 4,
      title: "Skill Specialist",
      description: "Master 15 different skills",
      icon: Target,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      earned: false,
      progress: 80,
    },
    {
      id: 5,
      title: "Network Builder",
      description: "Connect with 100+ professionals",
      icon: Zap,
      color: "text-pink-600",
      bgColor: "bg-pink-100",
      earned: false,
      progress: 65,
    },
    {
      id: 6,
      title: "Knowledge Sharer",
      description: "Create and share 5+ resources",
      icon: Medal,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
      earned: false,
      progress: 40,
    },
  ]

  const earnedAchievements = achievements.filter((a) => a.earned)
  const inProgressAchievements = achievements.filter((a) => !a.earned)

  return (
    <div className="space-y-6">
      {/* Achievement Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-effect rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">{earnedAchievements.length}</div>
          <div className="text-gray-600">Achievements Earned</div>
        </div>
        <div className="glass-effect rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{inProgressAchievements.length}</div>
          <div className="text-gray-600">In Progress</div>
        </div>
        <div className="glass-effect rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {Math.round((earnedAchievements.length / achievements.length) * 100)}%
          </div>
          <div className="text-gray-600">Completion Rate</div>
        </div>
      </div>

      {/* Earned Achievements */}
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-6 flex items-center">
          <Trophy className="w-6 h-6 mr-2 text-yellow-600" />
          Earned Achievements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {earnedAchievements.map((achievement) => {
            const Icon = achievement.icon
            return (
              <div
                key={achievement.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${achievement.bgColor}`}>
                    <Icon className={`w-6 h-6 ${achievement.color}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{achievement.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                    <p className="text-xs text-gray-500">
                      Earned on {new Date(achievement.date!).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* In Progress Achievements */}
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-6 flex items-center">
          <Target className="w-6 h-6 mr-2 text-blue-600" />
          In Progress
        </h3>
        <div className="space-y-4">
          {inProgressAchievements.map((achievement) => {
            const Icon = achievement.icon
            return (
              <div key={achievement.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${achievement.bgColor} opacity-60`}>
                    <Icon className={`w-6 h-6 ${achievement.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                      <span className="text-sm font-medium text-purple-600">{achievement.progress}%</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${achievement.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Achievement Categories */}
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-6">Achievement Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <Award className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="font-semibold text-gray-900">Learning</div>
            <div className="text-sm text-gray-600">2/3 earned</div>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="font-semibold text-gray-900">Community</div>
            <div className="text-sm text-gray-600">1/2 earned</div>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="font-semibold text-gray-900">Skills</div>
            <div className="text-sm text-gray-600">0/2 earned</div>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <div className="font-semibold text-gray-900">Special</div>
            <div className="text-sm text-gray-600">0/1 earned</div>
          </div>
        </div>
      </div>
    </div>
  )
}
