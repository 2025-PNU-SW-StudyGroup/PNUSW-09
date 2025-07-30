"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { API_CONFIG, getApiUrl } from "@/lib/config"
import { Calendar, Clock, Eye, Filter, MapPin, Play, Plus, RotateCcw, Search } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"
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

export default function OverviewPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [positionFilter, setPositionFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("applyAt")

  // 실제 API 호출
  const { data: apiCandidates, error, isLoading } = useSWR<ApiCandidate[]>(
    getApiUrl(API_CONFIG.ENDPOINTS.APPLICANTS),
    fetcher
  )

  // API 데이터 우선 사용, 없으면 빈 배열
  const candidates: ApiCandidate[] = useMemo(() => apiCandidates || [], [apiCandidates])

  const filteredAndSortedCandidates = useMemo(() => {
    const filtered = candidates.filter((candidate) => {
      const matchesSearch =
        candidate.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.position.title.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || candidate.status === statusFilter
      const matchesPosition = positionFilter === "all" || candidate.position.title.toLowerCase().includes(positionFilter)

      return matchesSearch && matchesStatus && matchesPosition
    })

    // Sort candidates
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.username.localeCompare(b.username)
        case "applyAt":
          return new Date(b.applyAt).getTime() - new Date(a.applyAt).getTime()
        case "status":
          return a.status.localeCompare(b.status)
        case "score":
          return (b.score || 0) - (a.score || 0)
        default:
          return 0
      }
    })

    return filtered
  }, [candidates, searchTerm, statusFilter, positionFilter, sortBy])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800 border-green-200"
      case "WAITING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const positions = Array.from(new Set(candidates.map((c) => c.position.title)))

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">지원자 현황</h1>
              <p className="text-slate-600">인터뷰 진행 상황을 한눈에 확인하고 관리하세요</p>
            </div>
            <Link href="/register">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                지원자 정보 등록
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">전체 지원자 수</p>
                  <p className="text-2xl font-bold text-slate-800">{candidates.length}명</p>
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Eye className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">인터뷰 대기중</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {candidates.filter((c) => c.status === "WAITING").length}명
                  </p>
                </div>
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-4 w-4 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">인터뷰 완료</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {candidates.filter((c) => c.status === "COMPLETED").length}명
                  </p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">평균 점수</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {candidates.filter((c) => c.score).length > 0 
                      ? Math.round(
                          candidates.filter((c) => c.score).reduce((acc, c) => acc + (c.score || 0), 0) /
                            candidates.filter((c) => c.score).length,
                        )
                      : 0
                    }점
                  </p>
                </div>
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Filter className="h-4 w-4 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="이름, 이메일, 포지션으로 검색하기"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="상태" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    <SelectItem value="WAITING">대기중</SelectItem>
                    <SelectItem value="INTERVIEWING">인터뷰 진행중</SelectItem>
                    <SelectItem value="COMPLETED">완료</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={positionFilter} onValueChange={setPositionFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="포지션" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 포지션</SelectItem>
                    {positions.map((position) => (
                      <SelectItem key={position} value={position}>
                        {position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="정렬" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="applyAt">지원일순</SelectItem>
                    <SelectItem value="name">이름순</SelectItem>
                    <SelectItem value="status">상태순</SelectItem>
                    <SelectItem value="score">점수순</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Candidates Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* 로딩 스켈레톤 */}
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                      <div>
                        <div className="h-4 w-24 bg-slate-200 rounded mb-2"></div>
                        <div className="h-3 w-32 bg-slate-200 rounded"></div>
                      </div>
                    </div>
                    <div className="h-6 w-16 bg-slate-200 rounded"></div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="h-4 w-32 bg-slate-200 rounded"></div>
                  <div className="flex gap-4">
                    <div className="h-3 w-20 bg-slate-200 rounded"></div>
                    <div className="h-3 w-24 bg-slate-200 rounded"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-slate-200 rounded"></div>
                    <div className="h-6 w-16 bg-slate-200 rounded"></div>
                    <div className="h-6 w-16 bg-slate-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card className="p-8 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <Filter className="h-8 w-8 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">데이터를 불러올 수 없습니다</h3>
                <p className="text-slate-600 mb-4">서버 연결에 문제가 발생했습니다.</p>
                <Button 
                  onClick={() => window.location.reload()} 
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  다시 시도
                </Button>
              </div>
            </div>
          </Card>
        ) : filteredAndSortedCandidates.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center">
                <Search className="h-8 w-8 text-slate-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">
                  {candidates.length === 0 ? "등록된 지원자가 없습니다" : "검색 결과가 없습니다"}
                </h3>
                <p className="text-slate-600 mb-4">
                  {candidates.length === 0 
                    ? "새로운 지원자를 등록해 보세요." 
                    : "다른 검색어를 시도해 보세요."
                  }
                </p>
                {candidates.length === 0 && (
                  <Link href="/register">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      지원자 등록
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAndSortedCandidates.map((candidate) => (
              <Card key={candidate.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={candidate.avatar || "/placeholder.svg"} alt={candidate.username} />
                        <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                          {candidate.username
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-slate-800">{candidate.username}</h3>
                        <p className="text-sm text-slate-600">{candidate.email}</p>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(candidate.status)} border`}>
                      {getStatusText(candidate.status)}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <p className="font-medium text-slate-800">
                      {candidate.position.title}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {candidate.experience.title}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {candidate.location}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-slate-600 mb-2">보유 스킬</p>
                    <div className="flex flex-wrap gap-1">
                      {candidate.techStackNames?.slice(0, 3).map((skillName, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skillName}
                        </Badge>
                      ))}
                      {candidate.techStackNames && candidate.techStackNames.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          외 {candidate.techStackNames.length - 3}개
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>{formatDate(candidate.applyAt)} 지원</span>
                    {candidate.score && <span className="font-medium text-blue-600">{candidate.score}점</span>}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Link href={`/candidates/${candidate.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        <Eye className="h-3 w-3 mr-1" />
                        상세보기
                      </Button>
                    </Link>
                    <Link href={`/interview/${candidate.id}`} className="flex-1">
                      <Button 
                        size="sm" 
                        className={`w-full ${
                          candidate.status === "COMPLETED" 
                            ? "bg-purple-600 hover:bg-purple-700" 
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        {candidate.status === "COMPLETED" ? <RotateCcw className="h-3 w-3 mr-1" /> : <Play className="h-3 w-3 mr-1" />}
                        {candidate.status === "COMPLETED" ? "인터뷰 검토" : "인터뷰 시작"}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
