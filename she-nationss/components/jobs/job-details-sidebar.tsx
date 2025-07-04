"use client";

import { useState, useEffect } from "react";
import {
  MapPin,
  Clock,
  DollarSign,
  Users,
  Calendar,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface JobDetailsSidebarProps {
  jobId: string;
}

interface JobSidebarData {
  location: string;
  type: string;
  salary: string;
  postedDate: string;
  company: string;
  logo: string;
}

export function JobDetailsSidebar({ jobId }: JobDetailsSidebarProps) {
  const [job, setJob] = useState<JobSidebarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dummy company info and similar jobs
  const companyInfo = {
    founded: "2015",
    size: "500-1000 employees",
    industry: "Technology",
    website: "www.company.com",
    headquarters: "San Francisco, CA",
  };

  const similarJobs = [
    {
      id: "1",
      title: "Senior Developer",
      company: "TechCorp",
      salary: "$110k - $150k",
    },
    {
      id: "2",
      title: "Lead Engineer",
      company: "InnovateLab",
      salary: "$120k - $160k",
    },
    {
      id: "3",
      title: "Software Architect",
      company: "FutureTech",
      salary: "$130k - $170k",
    },
  ];

  useEffect(() => {
    async function fetchJob() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:8082/api/applications/opportunities/${jobId}/`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch job data");
        }
        const data = await response.json();
        const jobData = data.application || data;

        setJob({
          location: jobData.location || "N/A",
          type: jobData.type || "Full-time",
          salary: jobData.salary || "Negotiable",
          postedDate:
            jobData.date_applied ||
            jobData.postedDate ||
            new Date().toISOString(),
          company: jobData.company || "Unknown Company",
          logo: jobData.logo || "/placeholder.svg",
        });
      } catch (err: any) {
        setError(err.message);
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
    <div className="space-y-6">
      {/* Job Summary */}
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Job Summary</h3>
        <div className="space-y-4">
          {/* Location */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Location</span>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="font-medium">{job.location}</span>
            </div>
          </div>
          {/* Job Type */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Job Type</span>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span className="font-medium">{job.type}</span>
            </div>
          </div>
          {/* Salary */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Salary</span>
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-1" />
              <span className="font-medium">{job.salary}</span>
            </div>
          </div>
          {/* Posted Date */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Posted</span>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span className="font-medium">
                {new Date(job.postedDate).toLocaleDateString()}
              </span>
            </div>
          </div>
          {/* Applicants */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Applicants</span>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span className="font-medium">23 candidates</span>
            </div>
          </div>
        </div>
      </div>

      {/* Company Info */}
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">About {job.company}</h3>
        <div className="flex items-center space-x-4 mb-4">
          <img
            src={job.logo}
            alt={job.company}
            className="w-16 h-16 rounded-lg"
          />
          <div>
            <h4 className="font-semibold">{job.company}</h4>
            <p className="text-sm text-gray-600">{companyInfo.industry}</p>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Founded</span>
            <span className="font-medium">{companyInfo.founded}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Company Size</span>
            <span className="font-medium">{companyInfo.size}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Headquarters</span>
            <span className="font-medium">{companyInfo.headquarters}</span>
          </div>
        </div>

        <p className="text-gray-700 text-sm mb-4">
          A leading technology company focused on innovation and creating
          solutions that make a difference in people's lives.
        </p>

        <button className="w-full px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
          <Building className="w-4 h-4 mr-2 inline" />
          View Company Profile
        </button>
      </div>

      {/* Similar Jobs */}
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Similar Jobs</h3>
        <div className="space-y-4">
          {similarJobs.map((similarJob) => (
            <div
              key={similarJob.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors cursor-pointer"
            >
              <h4 className="font-medium text-gray-900 mb-1">
                {similarJob.title}
              </h4>
              <p className="text-sm text-gray-600 mb-2">{similarJob.company}</p>
              <p className="text-sm font-medium text-purple-600">
                {similarJob.salary}
              </p>
            </div>
          ))}
        </div>
        <button className="w-full mt-4 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
          View More Jobs
        </button>
      </div>

      {/* Share Job */}
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Share This Job</h3>
        <div className="flex space-x-2">
          <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
            LinkedIn
          </button>
          <button className="flex-1 px-3 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors text-sm">
            Twitter
          </button>
          <button className="flex-1 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
            Email
          </button>
        </div>
      </div>

      {/* Apply Now */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Apply Now</h3>
        <p className="text-gray-600 mb-6">
          Ready to take the next step in your career? Apply for this exciting
          opportunity today!
        </p>
        <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
          Submit Application
        </Button>
      </div>
    </div>
  );
}
