"use client";

import { useEffect, useState } from "react";
import { MapPin, Clock, DollarSign, Users } from "lucide-react";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";

export function JobListings() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await fetch(
          "http://localhost:8082/api/applications/opportunities/"
        );
        if (!response.ok) throw new Error("Failed to fetch jobs");
        const data = await response.json();

        // If the data is nested (e.g., data.jobs), update here
        setJobs(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, []);

  if (loading) return <p className="text-center">Loading jobs...</p>;
  if (error) return <p className="text-center text-red-600">Error: {error}</p>;
  if (jobs.length === 0)
    return <p className="text-center">No jobs available.</p>;

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <div
          key={job.id}
          className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex justify-between items-center mb-3">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{job.title}</h2>
              <p className="text-sm text-gray-600">{job.company}</p>
            </div>
            <button
              className="text-purple-600 hover:underline"
              onClick={() => router.push(`/jobs/${job.id}`)}
            >
              <Eye className="w-5 h-5 inline mr-1" />
              View
            </button>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {job.location}
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {new Date(job.deadline).toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-1" />
              {job.salary || "Negotiable"}
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {job.applicants || 0} applicants
            </div>
          </div>

          <p className="text-gray-700 mt-3 line-clamp-2">{job.description}</p>
        </div>
      ))}
    </div>
  );
}
