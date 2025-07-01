"use client";

import { MapPin, Clock, DollarSign, Bookmark, Users } from "lucide-react";
import { useAppSelector } from "@/lib/hooks";

interface JobDetailsHeaderProps {
  jobId: string;
}

export function JobDetailsHeader({ jobId }: JobDetailsHeaderProps) {
  const { jobs } = useAppSelector((state) => state.jobs);
  const job = jobs.find((j) => j.id === jobId);

  if (!job) return null;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h2>
          <p className="text-gray-600 mb-4">
            {job.company} - {job.location}
          </p>
        </div>
        <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
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
    </div>
  );
}
