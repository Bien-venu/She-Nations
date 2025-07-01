"use client"

import { Award, CheckCircle } from "lucide-react"
import { useAppSelector } from "@/lib/hooks"

interface JobDetailsContentProps {
  jobId: string
}

export function JobDetailsContent({ jobId }: JobDetailsContentProps) {
  const { jobs } = useAppSelector((state) => state.jobs)
  const job = jobs.find((j) => j.id === jobId)

  if (!job) return null

  const benefits = [
    "Health, dental, and vision insurance",
    "401(k) with company matching",
    "Flexible work arrangements",
    "Professional development budget",
    "Unlimited PTO",
    "Stock options",
    "Gym membership",
    "Free meals and snacks",
  ]

  return (
    <div className="space-y-8">
      {/* Job Description */}
      <div className="glass-effect rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4">Job Description</h2>
        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed mb-4">
            We are seeking a talented and experienced professional to join our dynamic team. This role offers an
            exciting opportunity to work on cutting-edge projects and make a significant impact on our organization's
            growth.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            The ideal candidate will bring fresh perspectives, innovative thinking, and a passion for excellence. You'll
            collaborate with cross-functional teams to deliver high-quality solutions that drive business success.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Join us in shaping the future of our industry while advancing your career in a supportive and
            growth-oriented environment.
          </p>
        </div>
      </div>

      {/* Requirements */}
      <div className="glass-effect rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4">Requirements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Required Skills</h3>
            <ul className="space-y-2">
              {job.requirements.map((req, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{req}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Preferred Qualifications</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Bachelor's degree in relevant field</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">3+ years of industry experience</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Strong communication skills</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Leadership experience</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Responsibilities */}
      <div className="glass-effect rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4">Key Responsibilities</h2>
        <ul className="space-y-3">
          <li className="flex items-start">
            <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            <span className="text-gray-700">Lead and execute strategic initiatives to drive business growth</span>
          </li>
          <li className="flex items-start">
            <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            <span className="text-gray-700">
              Collaborate with cross-functional teams to deliver high-quality solutions
            </span>
          </li>
          <li className="flex items-start">
            <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            <span className="text-gray-700">
              Mentor junior team members and contribute to their professional development
            </span>
          </li>
          <li className="flex items-start">
            <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            <span className="text-gray-700">
              Analyze market trends and provide insights for strategic decision-making
            </span>
          </li>
          <li className="flex items-start">
            <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            <span className="text-gray-700">
              Maintain high standards of quality and ensure project deliverables meet expectations
            </span>
          </li>
        </ul>
      </div>

      {/* Benefits */}
      <div className="glass-effect rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4">Benefits & Perks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center">
              <Award className="w-5 h-5 text-purple-600 mr-3 flex-shrink-0" />
              <span className="text-gray-700">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Company Culture */}
      <div className="glass-effect rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4">Company Culture</h2>
        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed mb-4">
            Our company culture is built on the foundation of innovation, collaboration, and continuous learning. We
            believe in empowering our employees to take ownership of their work and make meaningful contributions to our
            shared success.
          </p>
          <p className="text-gray-700 leading-relaxed">
            We foster an inclusive environment where diverse perspectives are valued and everyone has the opportunity to
            grow both personally and professionally. Join us in creating a workplace where excellence thrives and
            innovation flourishes.
          </p>
        </div>
      </div>
    </div>
  )
}
