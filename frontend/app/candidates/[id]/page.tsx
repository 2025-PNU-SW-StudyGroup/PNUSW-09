"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { API_CONFIG, getApiUrl } from "@/lib/config"
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  ExternalLink,
  FileText,
  Github,
  MapPin,
  Play,
  Star,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import useSWR from "swr"

// API 응답용 Candidate 타입 정의
interface ApiCandidate {
  id: string | number
  username: string
  email: string
  position: { id: number, title: string }
  status: "WAITING" | "INTERVIEWING" | "COMPLETED"
  applyAt: string
  experience: { id: number, title: string }
  location: string
  techStackNames: string[]
  score?: number
  avatar?: string
}

// fetcher 함수
const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function CandidateDetailPage() {
  const params = useParams()
  const candidateId = params.id as string

  // 실제 API 호출
  const { data: candidate, error, isLoading } = useSWR<ApiCandidate>(
    candidateId ? getApiUrl(`${API_CONFIG.ENDPOINTS.APPLICANTS}/${candidateId}`) : null,
    fetcher
  )

  // Remove all upload-related state and functions
  const [githubUrl, setGithubUrl] = useState("")
  const [portfolioUrl, setPortfolioUrl] = useState("")
  const [resumeUploaded, setResumeUploaded] = useState(false)

  // candidate 데이터가 로드되면 상태 업데이트
  useEffect(() => {
    if (candidate) {
      setGithubUrl(candidate.email || "") // API에서는 githubUrl이 없을 수 있음
      setPortfolioUrl(candidate.email || "") // API에서는 portfolioUrl이 없을 수 있음
      setResumeUploaded(false) // API에서는 resumeUploaded가 없을 수 있음
    }
  }, [candidate])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            {/* Header skeleton */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-200 rounded-full"></div>
                <div>
                  <div className="h-8 w-48 bg-slate-200 rounded mb-2"></div>
                  <div className="h-6 w-32 bg-slate-200 rounded mb-2"></div>
                  <div className="h-4 w-64 bg-slate-200 rounded"></div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-8 w-16 bg-slate-200 rounded"></div>
                <div className="h-10 w-24 bg-slate-200 rounded"></div>
              </div>
            </div>
            
            {/* Skills skeleton */}
            <div>
              <div className="h-4 w-20 bg-slate-200 rounded mb-2"></div>
              <div className="flex gap-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-6 w-16 bg-slate-200 rounded"></div>
                ))}
              </div>
            </div>

            {/* Tabs skeleton */}
            <div className="space-y-6">
              <div className="h-10 w-full bg-slate-200 rounded"></div>
              <div className="grid lg:grid-cols-2 gap-6">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="h-64 bg-slate-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">데이터를 불러올 수 없습니다</h1>
          <p className="text-slate-600 mb-4">서버 연결에 문제가 발생했습니다.</p>
          <Button onClick={() => window.location.reload()}>다시 시도</Button>
        </div>
      </div>
    )
  }

  if (!candidate) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">지원자를 찾을 수 없습니다</h1>
          <p className="text-slate-600">찾으시는 지원자가 존재하지 않습니다.</p>
          <Link href="/">
            <Button className="mt-4">개요로 돌아가기</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Mock performance data for completed interviews
  const performanceData =
    candidate.status === "COMPLETED"
      ? [
          { name: "기술 지식", value: 85, color: "#3b82f6" },
          { name: "문제 해결", value: 78, color: "#10b981" },
          { name: "커뮤니케이션", value: 92, color: "#f59e0b" },
          { name: "코드 품질", value: 88, color: "#8b5cf6" },
        ]
      : []

  const topicData =
    candidate.status === "COMPLETED"
      ? [
          { topic: "React", timeSpent: 12, questions: 4, success: 85 },
          { topic: "TypeScript", timeSpent: 8, questions: 3, success: 90 },
          { topic: "알고리즘", timeSpent: 15, questions: 5, success: 70 },
          { topic: "시스템 설계", timeSpent: 10, questions: 2, success: 75 },
        ]
      : []

  const downloadReport = () => {
    // Simulate PDF download
    const link = document.createElement("a")
    link.href = "#"
    link.download = `${candidate.username.replace(" ", "_")}_interview_report.pdf`
    link.click()
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "완료"
      case "WAITING":
        return "대기중"
      case "INTERVIEWING":
        return "진행중"
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800 border-green-200"
      case "WAITING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "INTERVIEWING":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src="/placeholder.svg" alt={candidate.username} />
                <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-lg">
                  {candidate.username
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">{candidate.username}</h1>
                <p className="text-lg text-slate-600">{candidate.position.title}</p>
                <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {candidate.experience.title}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {candidate.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(candidate.applyAt)} 지원
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={`${getStatusColor(candidate.status)} border`}>
                {getStatusText(candidate.status)}
              </Badge>
              <Link href={`/interview/${candidate.id}`}>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Play className="h-4 w-4 mr-2" />
                  {candidate.status === "COMPLETED" ? "면접 검토" : "면접 시작"}
                </Button>
              </Link>
            </div>
          </div>

          {/* Skills */}
          <div>
            <p className="text-sm font-medium text-slate-600 mb-2">기술 스택:</p>
            <div className="flex flex-wrap gap-2">
              {candidate.techStackNames.map((skill: string, index: number) => (
                <Badge key={index} variant="outline" className="bg-slate-50">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="skills-summary" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="skills-summary">기술 요약</TabsTrigger>
            <TabsTrigger value="interview-report" disabled={candidate.status !== "COMPLETED"}>
              면접 리포트
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
                    이력서 분석
                  </CardTitle>
                  <CardDescription>업로드된 이력서 기반 AI 분석</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{candidate.experience.title}</div>
                        <div className="text-sm text-blue-700">경력</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{candidate.techStackNames.length}</div>
                        <div className="text-sm text-green-700">주요 기술</div>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-600 mb-2">기술 스택:</p>
                      <div className="flex flex-wrap gap-2">
                        {candidate.techStackNames.map((skill: string, index: number) => (
                          <Badge key={index} variant="outline" className="bg-slate-50">
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
                    GitHub 분석
                  </CardTitle>
                  <CardDescription>코드 저장소 및 기여도 분석</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">15</div>
                        <div className="text-sm text-purple-700">저장소</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">4.2k</div>
                        <div className="text-sm text-orange-700">기여도</div>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-600 mb-2">주요 언어:</p>
                      <div className="flex flex-wrap gap-2">
                        {["JavaScript", "TypeScript", "Python", "React"].map((lang) => (
                          <Badge key={lang} variant="outline" className="bg-blue-50">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <p className="text-slate-500 text-center py-4">GitHub 프로필이 제공되지 않았습니다</p>
                  </div>
                </CardContent>
              </Card>

              {/* Portfolio Analysis */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ExternalLink className="h-5 w-5 text-blue-600" />
                    포트폴리오 & 프로젝트
                  </CardTitle>
                  <CardDescription>포트폴리오 및 프로젝트 작업 분석</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-slate-600 mb-2">확인된 주요 강점:</p>
                      <ul className="text-sm text-slate-700 space-y-1">
                        <li>• 모던 프레임워크를 활용한 강력한 프론트엔드 개발 경험</li>
                        <li>• 뛰어난 UI/UX 디자인 감각</li>
                        <li>• 프로젝트 전반에 걸쳐 입증된 풀스택 역량</li>
                        <li>• 활발한 오픈소스 기여 활동</li>
                      </ul>
                    </div>
                    <p className="text-slate-500 text-center py-4">포트폴리오가 제공되지 않았습니다</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Interview Report Tab - keep existing content */}
          <TabsContent value="interview-report" className="space-y-6">
            {candidate.status === "COMPLETED" && (
              <>
                {/* Overall Score */}
                <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-slate-800">면접 성과</CardTitle>
                    <CardDescription>
                      {candidate.applyAt && new Date(candidate.applyAt).toLocaleDateString()} 완료
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
                          ? "우수"
                          : candidate.score && candidate.score >= 70
                            ? "양호"
                            : "개선 필요"}
                      </span>
                    </div>
                    <Button onClick={downloadReport} className="bg-blue-600 hover:bg-blue-700">
                      <Download className="h-4 w-4 mr-2" />
                      전체 리포트 다운로드
                    </Button>
                  </CardContent>
                </Card>

                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Performance Breakdown */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                        성과 분석
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
                      <CardTitle>주제별 성과</CardTitle>
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
                        주요 강점
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {/* {candidate.strengths?.map((strength, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-green-800">{strength}</span>
                          </li>
                        )) || [ */}
                          <li key="default1" className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-green-800">문제 해결 능력이 뛰어남</span>
                          </li>
                          <li key="default2" className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-green-800">기술적 지식이 풍부함</span>
                          </li>
                          <li key="default3" className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-green-800">의사소통 능력이 우수함</span>
                          </li>
                        {/* ]} */}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Areas for Improvement */}
                  <Card className="border-amber-200 bg-amber-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-amber-800">
                        <AlertTriangle className="h-5 w-5" />
                        개선 영역
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {/* {candidate.improvements?.map((improvement, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-amber-800">{improvement}</span>
                          </li>
                        )) || [ */}
                          <li key="default1" className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-amber-800">알고리즘 최적화 기법 보완 필요</span>
                          </li>
                          <li key="default2" className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-amber-800">시스템 설계 경험 확장 필요</span>
                          </li>
                        {/* ]} */}
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
