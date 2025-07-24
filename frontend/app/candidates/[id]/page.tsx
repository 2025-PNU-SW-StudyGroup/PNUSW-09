"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import {
  Github,
  ExternalLink,
  Download,
  Calendar,
  MapPin,
  Clock,
  Star,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Play,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { getCandidateById } from "@/lib/mock-data"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function CandidateDetailPage() {
  const params = useParams()
  const candidateId = params.id as string
  const candidate = getCandidateById(candidateId)

  // Remove all upload-related state and functions
  const [githubUrl, setGithubUrl] = useState(candidate?.githubUrl || "")
  const [portfolioUrl, setPortfolioUrl] = useState(candidate?.portfolioUrl || "")
  const [resumeUploaded, setResumeUploaded] = useState(candidate?.resumeUploaded || false)

  if (!candidate) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Candidate Not Found</h1>
          <p className="text-slate-600">The candidate you're looking for doesn't exist.</p>
          <Link href="/overview">
            <Button className="mt-4">Back to Overview</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Mock performance data for completed interviews
  const performanceData =
    candidate.status === "completed"
      ? [
          { name: "Technical Knowledge", value: 85, color: "#3b82f6" },
          { name: "Problem Solving", value: 78, color: "#10b981" },
          { name: "Communication", value: 92, color: "#f59e0b" },
          { name: "Code Quality", value: 88, color: "#8b5cf6" },
        ]
      : []

  const topicData =
    candidate.status === "completed"
      ? [
          { topic: "React", timeSpent: 12, questions: 4, success: 85 },
          { topic: "TypeScript", timeSpent: 8, questions: 3, success: 90 },
          { topic: "Algorithms", timeSpent: 15, questions: 5, success: 70 },
          { topic: "System Design", timeSpent: 10, questions: 2, success: 75 },
        ]
      : []

  const downloadReport = () => {
    // Simulate PDF download
    const link = document.createElement("a")
    link.href = "#"
    link.download = `${candidate.name.replace(" ", "_")}_interview_report.pdf`
    link.click()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={candidate.avatar || "/placeholder.svg"} alt={candidate.name} />
                <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-lg">
                  {candidate.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">{candidate.name}</h1>
                <p className="text-lg text-slate-600">{candidate.position}</p>
                <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {candidate.experience}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {candidate.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Applied {new Date(candidate.appliedDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                className={`${
                  candidate.status === "completed"
                    ? "bg-green-100 text-green-800 border-green-200"
                    : "bg-yellow-100 text-yellow-800 border-yellow-200"
                } border`}
              >
                {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
              </Badge>
              <Link href={`/interview/${candidate.id}`}>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Play className="h-4 w-4 mr-2" />
                  {candidate.status === "completed" ? "Review Interview" : "Start Interview"}
                </Button>
              </Link>
            </div>
          </div>

          {/* Skills */}
          <div>
            <p className="text-sm font-medium text-slate-600 mb-2">Skills & Technologies:</p>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((skill) => (
                <Badge key={skill} variant="outline" className="bg-slate-50">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="skills-summary" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="skills-summary">Skills Summary</TabsTrigger>
            <TabsTrigger value="interview-report" disabled={candidate.status !== "completed"}>
              Interview Report
            </TabsTrigger>
          </TabsList>

          {/* Skills Summary Tab */}
          <TabsContent value="skills-summary" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Pre-Interview Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Resume Analysis
                  </CardTitle>
                  <CardDescription>AI-generated analysis from uploaded resume</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{candidate.experience}</div>
                        <div className="text-sm text-blue-700">Experience</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{candidate.skills.length}</div>
                        <div className="text-sm text-green-700">Key Skills</div>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-600 mb-2">Technical Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {candidate.skills.map((skill) => (
                          <Badge key={skill} variant="outline" className="bg-slate-50">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* GitHub Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Github className="h-5 w-5 text-blue-600" />
                    GitHub Analysis
                  </CardTitle>
                  <CardDescription>Code repository and contribution analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  {candidate.githubUrl ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">15</div>
                          <div className="text-sm text-purple-700">Repositories</div>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">4.2k</div>
                          <div className="text-sm text-orange-700">Contributions</div>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-slate-600 mb-2">Primary Languages:</p>
                        <div className="flex flex-wrap gap-2">
                          {["JavaScript", "TypeScript", "Python", "React"].map((lang) => (
                            <Badge key={lang} variant="outline" className="bg-blue-50">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <a
                        href={candidate.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View GitHub Profile <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  ) : (
                    <p className="text-slate-500 text-center py-4">No GitHub profile provided</p>
                  )}
                </CardContent>
              </Card>

              {/* Portfolio Analysis */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ExternalLink className="h-5 w-5 text-blue-600" />
                    Portfolio & Projects
                  </CardTitle>
                  <CardDescription>Analysis of portfolio and project work</CardDescription>
                </CardHeader>
                <CardContent>
                  {candidate.portfolioUrl ? (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-slate-600 mb-2">Key Strengths Identified:</p>
                        <ul className="text-sm text-slate-700 space-y-1">
                          <li>• Strong frontend development experience with modern frameworks</li>
                          <li>• Excellent UI/UX design sensibility</li>
                          <li>• Full-stack capabilities demonstrated across projects</li>
                          <li>• Active open source contributor</li>
                        </ul>
                      </div>

                      <a
                        href={candidate.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View Portfolio <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  ) : (
                    <p className="text-slate-500 text-center py-4">No portfolio provided</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Interview Report Tab - keep existing content */}
          <TabsContent value="interview-report" className="space-y-6">
            {candidate.status === "completed" && (
              <>
                {/* Overall Score */}
                <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-slate-800">Interview Performance</CardTitle>
                    <CardDescription>
                      Completed on {candidate.interviewDate && new Date(candidate.interviewDate).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
                      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-slate-200"
                          stroke="currentColor"
                          strokeWidth="3"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-blue-600"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeDasharray={`${candidate.score}, 100`}
                          strokeLinecap="round"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold text-slate-800">{candidate.score}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Star className="h-5 w-5 text-yellow-500 fill-current" />
                      <span className="text-lg font-semibold text-slate-700">
                        {candidate.score && candidate.score >= 85
                          ? "Excellent"
                          : candidate.score && candidate.score >= 70
                            ? "Good"
                            : "Needs Improvement"}
                      </span>
                    </div>
                    <Button onClick={downloadReport} className="bg-blue-600 hover:bg-blue-700">
                      <Download className="h-4 w-4 mr-2" />
                      Download Full Report
                    </Button>
                  </CardContent>
                </Card>

                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Performance Breakdown */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                        Performance Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {performanceData.map((item, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-slate-700">{item.name}</span>
                              <span className="text-sm font-bold text-slate-800">{item.value}%</span>
                            </div>
                            <Progress value={item.value} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Topic Performance */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Topic Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={topicData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="topic" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="success" fill="#3b82f6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Strengths */}
                  <Card className="border-green-200 bg-green-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-800">
                        <CheckCircle className="h-5 w-5" />
                        Key Strengths
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {candidate.strengths?.map((strength, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-green-800">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Areas for Improvement */}
                  <Card className="border-amber-200 bg-amber-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-amber-800">
                        <AlertTriangle className="h-5 w-5" />
                        Areas for Improvement
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {candidate.improvements?.map((improvement, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-amber-800">{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
