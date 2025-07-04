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
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    resume_url: "",
  });
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApply = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setSubmitStatus("⚠️ You must be logged in to apply.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8082/api/applications/opportunities/${jobId}/applications/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.detail || "Application failed");
      }

      setSubmitStatus("✅ Application submitted successfully!");
      setFormData({ full_name: "", email: "", phone: "", resume_url: "" });
    } catch (err: any) {
      setSubmitStatus(err.message || "❌ Submission failed.");
    }
  };

  if (loading) return <p className="text-center">Loading opportunity...</p>;
  if (error) return <p className="text-center text-red-600">Error: {error}</p>;
  if (!opportunity)
    return <p className="text-center">Opportunity not found.</p>;

  return (
    <div className="space-y-8">
      {/* Summary */}
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

      {/* Status */}
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

      {/* Apply Form */}
      {opportunity.is_active && (
        <div className="glass-effect rounded-xl p-6 space-y-4">
          <h3 className="text-2xl font-semibold mb-2">Apply Now</h3>

          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="url"
            name="resume_url"
            value={formData.resume_url}
            onChange={handleChange}
            placeholder="Resume URL"
            className="w-full p-3 border rounded-lg"
          />

          <button
            onClick={handleApply}
            className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition"
          >
            Submit Application
          </button>

          {submitStatus && (
            <p className="text-center text-sm text-gray-600 mt-2">
              {submitStatus}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
