"use client";

import { useEffect, useState } from "react";
import { Award, CheckCircle } from "lucide-react";

interface JobDetailsContentProps {
  jobId: string;
}

export function JobDetailsContent({ jobId }: JobDetailsContentProps) {
  const [opportunity, setOpportunity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOpportunity() {
      try {
        const res = await fetch(
          `http://localhost:8082/api/applications/opportunities/${jobId}/`
        );
        if (!res.ok) throw new Error("Failed to fetch opportunity details");
        const data = await res.json();
        setOpportunity(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    if (jobId) fetchOpportunity();
  }, [jobId]);

  if (loading) return <p className="text-center">Loading opportunity...</p>;
  if (error) return <p className="text-center text-red-600">Error: {error}</p>;
  if (!opportunity)
    return <p className="text-center">Opportunity not found.</p>;

  // Fake benefits since your API doesn’t include any
  const benefits = [
    "Networking with tech leaders",
    "Mentorship opportunities",
    "Hands-on coding sessions",
    "Startup pitching practice",
    "Free certification",
  ];

  return (
    <div className="space-y-8">
      {/* Title and Summary */}
      <div className="glass-effect rounded-xl p-6">
        <h2 className="text-3xl font-bold mb-2">{opportunity.title}</h2>
        <p className="text-gray-600 mb-2">{opportunity.location}</p>
        <p className="text-sm text-gray-500">
          Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
        </p>
      </div>

      {/* Description */}
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-2xl font-semibold mb-4">Description</h3>
        <p className="text-gray-700 leading-relaxed">
          {opportunity.description}
        </p>
      </div>

      {/* Eligibility */}
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-2xl font-semibold mb-4">Eligibility Criteria</h3>
        <p className="text-gray-700">{opportunity.eligibility_criteria}</p>
      </div>

      {/* Benefits */}
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-2xl font-semibold mb-4">What You'll Gain</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {benefits.map((item, i) => (
            <div key={i} className="flex items-center">
              <Award className="w-5 h-5 text-purple-600 mr-3" />
              <span className="text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Active Status */}
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-2xl font-semibold mb-4">Status</h3>
        <div className="flex items-center">
          <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
          <span className="text-gray-700 font-medium">
            {opportunity.is_active
              ? "Currently accepting applications"
              : "Closed"}
          </span>
        </div>
      </div>
    </div>
  );
}
