"use client"

import { MapPin, Clock, DollarSign, Bookmark } from "lucide-react"
import Link from "next/link"

export function FeaturedJobs() {
  const featuredJobs = [
    {
      id: "1",
      title: "Senior Software Engineer",
      company: "TechForward Inc.",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$120k - $160k",
      logo: "/placeholder.svg?height=60&width=60",
      featured: true,
      urgent: false,
    },
    {
      id: "2",
      title: "Product Manager",
      company: "InnovateCorp",
      location: "New York, NY",
      type: "Full-time",
      salary: "$100k - $140k",
      logo: "/placeholder.svg?height=60&width=60",
      featured: true,
      urgent: true,
    },
    {
      id: "3",
      title: "UX Designer",
      company: "DesignStudio",
      location: "Remote",
      type: "Contract",
      salary: "$80k - $110k",
      logo: "/placeholder.svg?height=60&width=60",
      featured: true,
      urgent: false,
    },
  ]

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold font-poppins">Featured Jobs</h2>
        <Link href="/jobs" className="text-purple-600 hover:text-purple-700 font-medium">
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredJobs.map((job) => (
          <div
            key={job.id}
            className="glass-effect rounded-xl p-6 hover:shadow-lg transition-all duration-300 relative"
          >
            {job.urgent && (
              <div className="absolute top-4 right-4">
                <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">Urgent</span>
              </div>
            )}

            <div className="flex items-start justify-between mb-4">
              <img src={job.logo || "/placeholder.svg"} alt={job.company} className="w-12 h-12 rounded-lg" />
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bookmark className="w-5 h-5 text-gray-400 hover:text-purple-600" />
              </button>
            </div>

            <h3 className="font-semibold text-gray-900 text-lg mb-2 hover:text-purple-600 cursor-pointer transition-colors">
              {job.title}
            </h3>
            <p className="text-purple-600 font-medium mb-4">{job.company}</p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="text-sm">{job.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                <span className="text-sm">{job.type}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <DollarSign className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">{job.salary}</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <Link
                href={`/jobs/${job.id}`}
                className="flex-1 px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors text-center"
              >
                View Details
              </Link>
              <button className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300">
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
