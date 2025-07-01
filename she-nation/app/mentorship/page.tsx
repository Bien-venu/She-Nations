"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MentorGrid } from "@/components/mentorship/mentor-grid";

function MentorshipPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // Mock mentor data - replace with API data
  const mentors = [
    {
      id: "1",
      name: "Dr. Emily Chen",
      title: "Senior Software Engineer",
      company: "TechCorp Inc.",
      category: "Engineering",
      rating: 4.9,
      sessions: 45,
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "2",
      name: "Maria Rodriguez",
      title: "Marketing Manager",
      company: "Global Marketing Solutions",
      category: "Marketing",
      rating: 4.7,
      sessions: 32,
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "3",
      name: "David Lee",
      title: "Business Consultant",
      company: "Strategic Consulting Group",
      category: "Business",
      rating: 4.8,
      sessions: 56,
      avatar: "/placeholder.svg?height=80&width=80",
    },
  ];

  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch =
      mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      !categoryFilter || mentor.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ["Engineering", "Marketing", "Business"];

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Find a Mentor
              </h1>
              <p className="text-gray-600">
                Connect with experienced professionals for guidance and support
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search mentors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Mentor Grid */}
        <MentorGrid mentors={filteredMentors} />
      </div>
    </div>
  );
}

export default MentorshipPage;
