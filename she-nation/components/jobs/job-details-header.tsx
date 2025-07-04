"use client";

import { useState, useEffect } from "react";
import { MapPin, Clock, DollarSign, Bookmark, Users } from "lucide-react";

interface JobDetailsHeaderProps {
  jobId: string;
}

interface JobData {
  title: string;
  location: string;
  postedDate: string; // we can use created_at or deadline
  salary?: string; // your data doesn't have salary, so optional
  applicants?: number; // optional as not provided
}

export function JobDetailsHeader({ jobId }: JobDetailsHeaderProps) {
  const [job, setJob] = useState<JobData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchJob() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `http://localhost:8082/api/applications/opportunities/${jobId}/`
        );
        if (!res.ok) throw new Error("Failed to fetch job data");
        const data = await res.json();

        // Map API response to JobData interface
        const jobData: JobData = {
          title: data.title,
          location: data.location,
          postedDate: data.deadline, // use deadline as postedDate here
          // salary and applicants not in API response, so skip or default
        };

        setJob(jobData);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  if (loading)
    return <div className="p-6 text-center">Loading job details...</div>;

  if (error)
    return <div className="p-6 text-center text-red-600">Error: {error}</div>;

  if (!job) return <div className="p-6 text-center">Job not found.</div>;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h2>
          <p className="text-gray-600 mb-4">{job.location}</p>
        </div>
        <button
          className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
          aria-label="Bookmark job"
        >
          <Bookmark className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center space-x-6 text-sm text-gray-600">
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-1" />
          {job.location}
        </div>
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          {job.postedDate
            ? new Date(job.postedDate).toLocaleDateString()
            : "N/A"}
        </div>
        <div className="flex items-center">
          <DollarSign className="w-4 h-4 mr-1" />
          {"Negotiable"}
        </div>
        <div className="flex items-center">
          <Users className="w-4 h-4 mr-1" />
          {"N/A applicants"}
        </div>
      </div>
    </div>
  );
}
