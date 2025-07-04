"use client";

import { JobListings } from "@/components/jobs/job-listings";
import { JobsHeader } from "@/components/jobs/jobs-header";
import { JobFilters } from "@/components/jobs/job-filters";

export default function JobsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <JobsHeader />

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <JobFilters />
          </div>
          <div className="lg:col-span-3">
            <JobListings />
          </div>
        </div>
      </div>
    </div>
  );
}
