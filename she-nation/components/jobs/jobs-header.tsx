"use client"

import { useState } from "react"
import { Search, MapPin } from "lucide-react"
import { useAppDispatch } from "@/lib/hooks"
import { setSearchQuery, setFilters } from "@/lib/slices/jobsSlice"

export function JobsHeader() {
  const [searchInput, setSearchInput] = useState("")
  const [locationInput, setLocationInput] = useState("")
  const dispatch = useAppDispatch()

  const handleSearch = () => {
    dispatch(setSearchQuery(searchInput))
    dispatch(setFilters({ location: locationInput }))
  }

  return (
    <div className="mb-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-poppins gradient-text mb-4">Find Your Dream Job</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover opportunities that match your skills and aspirations in our curated job marketplace
        </p>
      </div>

      {/* Search Bar */}
      <div className="glass-effect rounded-2xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Job title, keywords, or company"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              placeholder="Location"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center"
          >
            <Search className="w-5 h-5 mr-2" />
            Search Jobs
          </button>
        </div>
      </div>

     
      
      </div>
  )
}
