"use client";

import { useState } from "react";
import { MapPin, Clock, DollarSign, Bookmark, Eye, Users } from "lucide-react";
import { useRouter } from "@/next/navigation";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { incrementJobViews } from "@/lib/slices/jobsSlice";
import { JobApplicationModal } from "./job-application-modal";
import { addNotification } from "@/lib/slices/notificationsSlice";

export function JobListings() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { jobs, searchQuery, filters } = useAppSelector((state) => state.jobs);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);

  // Filter jobs based on search and filters
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = !filters.type || job.type === filters.type;
    const matchesLocation =
      !filters.location ||
      job.location.toLowerCase().includes(filters.location.toLowerCase());
    const matchesCategory =
      !filters.category || job.category === filters.category;

    return matchesSearch && matchesType && matchesLocation && matchesCategory;
  });

  const handleViewDetails = (job: any) => {
    dispatch(incrementJobViews(job.id));
    router.push(`/jobs/${job.id}`);
  };

  const handleApplyNow = (job: any) => {
    setSelectedJob(job);
    setShowApplicationModal(true);
  };

  const handleSaveJob = (jobId: string) => {
    if (savedJobs.includes(jobId)) {
      // Unsave job
      setSavedJobs(savedJobs.filter((id) => id !== jobId));
      dispatch(
        addNotification({
          title: "Job Removed",
          message: "Job has been removed from your saved jobs",
          type: "info",
          read: false,
        })
      );
    } else {
      // Save job
      setSavedJobs([...savedJobs, jobId]);
      dispatch(
        addNotification({
          title: "Job Saved",
          message: "Job has been added to your saved jobs",
          type: "success",
          read: false,
        })
      );
    }
  };

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case "Full-time":
        return "bg-green-100 text-green-600";
      case "Part-time":
        return "bg-blue-100 text-blue-600";
      case "Contract":
        return "bg-yellow-100 text-yellow-600";
      case "Remote":
        return "bg-purple-100 text-purple-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Results Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {filteredJobs.length} Job{filteredJobs.length !== 1 ? "s" : ""}{" "}
            Found
          </h2>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
            <option>Most Recent</option>
            <option>Salary: High to Low</option>
            <option>Salary: Low to High</option>
            <option>Most Relevant</option>
          </select>
        </div>

        {/* Job Cards */}
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="glass-effect rounded-xl p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <img
                    src={job.logo || "/placeholder.svg"}
                    alt={job.company}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 hover:text-purple-600 cursor-pointer">
                          {job.title}
                        </h3>
                        <p className="text-gray-600 font-medium">
                          {job.company}
                        </p>
                      </div>
                      <button
                        onClick={() => handleSaveJob(job.id)}
                        className={`p-2 transition-colors ${
                          savedJobs.includes(job.id)
                            ? "text-purple-600"
                            : "text-gray-400 hover:text-purple-600"
                        }`}
                      >
                        <Bookmark
                          className="w-5 h-5"
                          fill={
                            savedJobs.includes(job.id) ? "currentColor" : "none"
                          }
                        />
                      </button>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {job.postedDate}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {job.salary}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {job.applicants} applicants
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4 line-clamp-2">
                      {job.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${getJobTypeColor(
                            job.type
                          )}`}
                        >
                          {job.type}
                        </span>
                        <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                          {job.category}
                        </span>
                        {job.featured && (
                          <span className="px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-600 rounded-full">
                            Featured
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleViewDetails(job)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </button>
                        <button
                          onClick={() => handleApplyNow(job)}
                          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No jobs found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or filters to find more
              opportunities.
            </p>
            <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Job Application Modal */}
      {showApplicationModal && selectedJob && (
        <JobApplicationModal
          job={selectedJob}
          onClose={() => {
            setShowApplicationModal(false);
            setSelectedJob(null);
          }}
        />
      )}
    </>
  );
}
