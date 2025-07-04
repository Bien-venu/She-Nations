import React, { useState } from "react";
import { useDispatch } from "react-redux"; // if using redux
import { addNotification } from "@/lib/slices/notificationsSlice"; // adjust your path

interface Props {
  job: { id: number; title: string };
  onClose: () => void;
}

export default function JobApplicationForm({ job, onClose }: Props) {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    coverLetter: "",
    portfolioUrl: "",
    resume: null as File | null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = () => {
    if (!formData.fullName || !formData.email) {
      dispatch(
        addNotification({
          title: "Validation Error",
          message: "Full Name and Email are required.",
          type: "error",
          read: false,
        })
      );
      return false;
    }
    // Add more validations if needed
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append("full_name", formData.fullName);
      submitData.append("email", formData.email);
      submitData.append("phone", formData.phone);
      submitData.append("cover_letter", formData.coverLetter);
      submitData.append("portfolio_url", formData.portfolioUrl);
      if (formData.resume) {
        submitData.append("resume", formData.resume);
      }

      const response = await fetch(
        `http://localhost:8082/api/applications/opportunities/${job.id}/applications/`,
        {
          method: "POST",
          body: submitData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit application");
      }

      const data = await response.json();

      dispatch(
        addNotification({
          title: "Application Submitted",
          message:
            data.detail ||
            `Your application for ${job.title} has been submitted successfully.`,
          type: "success",
          read: false,
        })
      );

      setIsSubmitted(true);

      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      dispatch(
        addNotification({
          title: "Submission Failed",
          message:
            "There was an error submitting your application. Please try again.",
          type: "error",
          read: false,
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Full Name"
        value={formData.fullName}
        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <input
        type="tel"
        placeholder="Phone"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
      />
      <textarea
        placeholder="Cover Letter"
        value={formData.coverLetter}
        onChange={(e) =>
          setFormData({ ...formData, coverLetter: e.target.value })
        }
      />
      <input
        type="url"
        placeholder="Portfolio URL"
        value={formData.portfolioUrl}
        onChange={(e) =>
          setFormData({ ...formData, portfolioUrl: e.target.value })
        }
      />
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(e) =>
          setFormData({
            ...formData,
            resume: e.target.files ? e.target.files[0] : null,
          })
        }
      />

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Application"}
      </button>
    </form>
  );
}
