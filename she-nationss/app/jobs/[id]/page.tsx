"use client";

import React, { use } from "react"; // <-- import use
import { JobDetailsHeader } from "@/components/jobs/job-details-header";
import { JobDetailsContent } from "@/components/jobs/job-details-content";
import { JobDetailsSidebar } from "@/components/jobs/job-details-sidebar";
import { AuthGuard } from "@/components/auth/auth-guard";

interface JobPageProps {
  params: Promise<{ id: string }>; // params is now a Promise
}

function JobPage({ params }: JobPageProps) {
  const paramsResolved = use(params); // unwrap the Promise
  const { id } = paramsResolved;

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <JobDetailsHeader jobId={id} />

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <JobDetailsContent jobId={id} />
            </div>
            <div className="lg:col-span-1">
              <JobDetailsSidebar jobId={id} />
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}

export default JobPage;
