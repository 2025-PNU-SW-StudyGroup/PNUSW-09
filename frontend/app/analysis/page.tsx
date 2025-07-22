"use client"

import { Download, TrendingUp, Clock, CheckCircle, AlertTriangle, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import Link from "next/link"

export default function AnalysisPage() {
  const topicData = [
    { topic: "React", timeSpent: 12, questions: 4, success: 85 },
    { topic: "TypeScript", timeSpent: 8, questions: 3, success: 90 },
    { topic: "Algorithms", timeSpent: 15, questions: 5, success: 70 },
    { topic: "System Design", timeSpent: 20, questions: 2, success: 75 },
    { topic: "Node.js", timeSpent: 5, questions: 2, success: 95 },
  ]

  const performanceData = [
    { name: "Technical Knowledge", value: 85, color: "#3b82f6" },
    { name: "Problem Solving", value: 78, color: "#10b981" },
    { name: "Communication", value: 92, color: "#f59e0b" },
    { name: "Code Quality", value: 88, color: "#8b5cf6" },
  ]

  const overallScore = 86

  const strengths = [
    "Strong understanding of React hooks and lifecycle methods",
    "Excellent communication and explanation skills",
    "Good grasp of TypeScript advanced features",
    "Clean and readable code structure",
    "Effective problem-solving approach",
  ]

  const improvements = [
    "Algorithm optimization techniques need practice",
    "System design scalability concepts could be stronger",
    "Time management during coding challenges",
    "Edge case handling in solutions",
  ]

  const downloadReport = () => {
    // Simulate PDF download
    const link = document.createElement("a")
    link.href = "#"
    link.download = "interview-analysis-report.pdf"
    link.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-800 mb-4">Interview Analysis Report</h1>
            <p className="text-lg text-slate-600">Comprehensive evaluation of technical interview performance</p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <Badge variant="outline" className="px-3 py-1">
                <Clock className="h-4 w-4 mr-1" />
                Duration: 45 minutes
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                Questions Asked: 16
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                Topics Covered: 5
              </Badge>
            </div>
          </div>

          {/* Overall Score */}
          <Card className="mb-8 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-slate-800">Overall Performance</CardTitle>
              <CardDescription>Based on technical skills, problem-solving, and communication</CardDescription>
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
                    strokeDasharray={`${overallScore}, 100`}
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-slate-800">{overallScore}%</span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <span className="text-lg font-semibold text-slate-700">Strong Performance</span>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Performance Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Performance Breakdown
                </CardTitle>
                <CardDescription>Detailed analysis across key areas</CardDescription>
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

            {/* Time Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Time Distribution by Topic</CardTitle>
                <CardDescription>Minutes spent on each technical area</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={topicData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="topic" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="timeSpent" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Success Rate by Topic */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Success Rate by Topic</CardTitle>
              <CardDescription>Performance analysis across different technical areas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-5 gap-4">
                {topicData.map((topic, index) => (
                  <div key={index} className="text-center p-4 bg-slate-50 rounded-lg">
                    <h3 className="font-semibold text-slate-800 mb-2">{topic.topic}</h3>
                    <div className="text-2xl font-bold text-blue-600 mb-1">{topic.success}%</div>
                    <div className="text-sm text-slate-600">{topic.questions} questions</div>
                    <Progress value={topic.success} className="mt-2 h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Strengths */}
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  Key Strengths
                </CardTitle>
                <CardDescription className="text-green-700">
                  Areas where you excelled during the interview
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {strengths.map((strength, index) => (
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
                <CardDescription className="text-amber-700">
                  Opportunities to enhance your technical skills
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {improvements.map((improvement, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-amber-800">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="text-center space-y-4">
            <div className="flex justify-center gap-4">
              <Button onClick={downloadReport} className="bg-blue-600 hover:bg-blue-700 px-6 py-3">
                <Download className="h-4 w-4 mr-2" />
                Download PDF Report
              </Button>
              <Link href="/">
                <Button variant="outline" className="px-6 py-3 bg-transparent">
                  Start New Interview
                </Button>
              </Link>
            </div>

            <p className="text-sm text-slate-600">
              Report generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
