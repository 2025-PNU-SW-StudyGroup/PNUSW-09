"use client"

import type React from "react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { API_CONFIG, getApiUrl } from "@/lib/config"
import { CheckCircle, ExternalLink, FileText, Github, LinkIcon, Upload, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import useSWR from "swr"

interface FormData {
  username: string
  email: string
  positionId: number | null
  experienceId: number | null
  location: string
  githubUrl: string
  portfolioUrl: string
  techStackIds: number[]
  resumeFilePath: string
  portfolioFilePath: string
}

interface FormErrors {
  username?: string
  email?: string
  positionId?: string
  experienceId?: string
  location?: string
  githubUrl?: string
  portfolioUrl?: string
  techStackIds?: string
  resumeFilePath?: string
  portfolioFilePath?: string
}

interface FileUpload {
  resume: File | null
  portfolio: File | null
}

interface TechStack {
  id: number
  title: string
}

interface Experience {
  id: number
  title: string
}

interface Position {
  id: number
  title: string
}

// fetcher 함수 추가
const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    positionId: null,
    experienceId: null,
    location: "",
    githubUrl: "",
    portfolioUrl: "",
    techStackIds: [],
    resumeFilePath: "",
    portfolioFilePath: "",
  })

  const [files, setFiles] = useState<FileUpload>({
    resume: null,
    portfolio: null,
  })

  const [dragActive, setDragActive] = useState({
    resume: false,
    portfolio: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [githubValidated, setGithubValidated] = useState(false)
  
  // 이력서 업로드 상태 관리
  const [resumeUploadState, setResumeUploadState] = useState<{
    uploading: boolean
    uploaded: boolean
    error: string | null
    fileName: string
  }>({
    uploading: false,
    uploaded: false,
    error: null,
    fileName: ""
  })

  // 포트폴리오 업로드 상태 관리 (단일 파일)
  const [portfolioUploadState, setPortfolioUploadState] = useState<{
    uploading: boolean
    uploaded: boolean
    error: string | null
    fileName: string
  }>({
    uploading: false,
    uploaded: false,
    error: null,
    fileName: ""
  })

  // SWR로 기술 스택 데이터 가져오기
  const { data: techStacks = [], error: techStacksError, isLoading: loadingTechStacks } = useSWR<TechStack[]>(
    getApiUrl(API_CONFIG.ENDPOINTS.TECH_STACKS),
    fetcher
  )
  
  // SWR로 경험 데이터 가져오기
  const { data: experiences = [], error: experiencesError, isLoading: loadingExperiences } = useSWR<Experience[]>(
    getApiUrl(API_CONFIG.ENDPOINTS.EXPERIENCES),
    fetcher
  )

  // SWR로 포지션 데이터 가져오기
  const { data: positions = [], error: positionsError, isLoading: loadingPositions } = useSWR<Position[]>(
    getApiUrl(API_CONFIG.ENDPOINTS.POSITIONS),
    fetcher
  )
  
  const [selectedTechStackIds, setSelectedTechStackIds] = useState<number[]>([])

  // 선택된 기술 스택 ID가 변경될 때 formData.techStackIds 업데이트
  useEffect(() => {
    setFormData((prev) => ({ ...prev, techStackIds: selectedTechStackIds }))
  }, [selectedTechStackIds])

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field as keyof FormErrors]: undefined }))
    }
  }

  // ID 값을 위한 별도 핸들러
  const handleIdChange = (field: 'positionId' | 'experienceId', value: string) => {
    const numericValue = value ? parseInt(value, 10) : null
    setFormData((prev) => ({ ...prev, [field]: numericValue }))
    // Clear error when user selects
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleDrag = (e: React.DragEvent, type: "resume" | "portfolio") => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive((prev) => ({ ...prev, [type]: true }))
    } else if (e.type === "dragleave") {
      setDragActive((prev) => ({ ...prev, [type]: false }))
    }
  }

  // 이력서 업로드 함수
  const uploadResume = async (file: File) => {
    setResumeUploadState(prev => ({ ...prev, uploading: true, error: null }))
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.UPLOAD_RESUME), {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error('파일 업로드에 실패했습니다')
      }
      
      const filePath = await response.text() // 백엔드에서 string으로 응답
      
      // 성공 시 상태 업데이트
      setResumeUploadState({
        uploading: false,
        uploaded: true,
        error: null,
        fileName: file.name
      })
      
      // FormData에 파일 경로 저장
      setFormData(prev => ({ ...prev, resumeFilePath: filePath }))
      
      // 에러 클리어
      if (errors.resumeFilePath) {
        setErrors(prev => ({ ...prev, resumeFilePath: undefined }))
      }
      
    } catch (error) {
      setResumeUploadState({
        uploading: false,
        uploaded: false,
        error: error instanceof Error ? error.message : '업로드 중 오류가 발생했습니다',
        fileName: ""
      })
      
      // FormData에서 경로 제거
      setFormData(prev => ({ ...prev, resumeFilePath: "" }))
    }
  }

  // 포트폴리오 업로드 함수
  const uploadPortfolio = async (file: File) => {
    setPortfolioUploadState(prev => ({ ...prev, uploading: true }))
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.UPLOAD_PORTFOLIO), {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error('파일 업로드에 실패했습니다')
      }
      
      const filePath = await response.text() // 백엔드에서 string으로 응답
      
      // 성공 시 상태 업데이트
      setPortfolioUploadState(prev => ({
        ...prev,
        uploading: false,
        uploaded: true,
        error: null,
        fileName: file.name
      }))
      
      // FormData에 파일 경로 추가
      setFormData(prev => ({ 
        ...prev, 
        portfolioFilePath: filePath 
      }))
      
    } catch (error) {
      setPortfolioUploadState(prev => ({
        ...prev,
        uploading: false,
        error: error instanceof Error ? error.message : '업로드 중 오류가 발생했습니다',
        fileName: ""
      }))
      
      // FormData에서 경로 제거
      setFormData(prev => ({ ...prev, portfolioFilePath: "" }))
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>, type: "resume" | "portfolio") => {
    const selectedFiles = Array.from(e.target.files || [])

    if (type === "resume") {
      const file = selectedFiles[0]
      if (file) {
        setFiles((prev) => ({ ...prev, resume: file }))
        // 파일 선택 즉시 업로드
        uploadResume(file)
      }
    } else {
      if (selectedFiles.length > 0) {
        setFiles((prev) => ({ ...prev, portfolio: selectedFiles[0] }))
        // 파일 선택 즉시 업로드
        uploadPortfolio(selectedFiles[0])
      }
    }
  }

  const handleDrop = (e: React.DragEvent, type: "resume" | "portfolio") => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive((prev) => ({ ...prev, [type]: false }))

    const droppedFiles = Array.from(e.dataTransfer.files)

    if (type === "resume") {
      const file = droppedFiles[0]
      if (file && (file.type === "application/pdf" || file.type.includes("word"))) {
        setFiles((prev) => ({ ...prev, resume: file }))
        // 드롭된 파일 즉시 업로드
        uploadResume(file)
      }
    } else {
      if (droppedFiles.length > 0) {
        setFiles((prev) => ({ ...prev, portfolio: droppedFiles[0] }))
        // 드롭된 파일 즉시 업로드
        uploadPortfolio(droppedFiles[0])
      }
    }
  }

  const validateGithub = () => {
    if (formData.githubUrl && formData.githubUrl.includes("github.com")) {
      setGithubValidated(true)
    }
  }

  // 기술 스택 선택/해제 핸들러
  const toggleTechStack = (techId: number) => {
    setSelectedTechStackIds((prev) => {
      const newSelected = prev.includes(techId)
        ? prev.filter(id => id !== techId)
        : [...prev, techId]
      
      // skillIds 에러 클리어
      if (errors.techStackIds && newSelected.length > 0) {
        setErrors((prevErrors) => ({ ...prevErrors, techStackIds: undefined }))
      }
      
      return newSelected
    })
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.username.trim()) newErrors.username = "이름을 입력해주세요"
    if (!formData.email.trim()) newErrors.email = "이메일을 입력해주세요"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "유효하지 않은 이메일 형식입니다"
    if (!formData.positionId) newErrors.positionId = "포지션을 선택해주세요"
    if (!formData.experienceId) newErrors.experienceId = "경력을 선택해주세요"
    if (!formData.location.trim()) newErrors.location = "지역을 입력해주세요"
    if (formData.techStackIds.length === 0) newErrors.techStackIds = "기술 스택을 선택해주세요"
    if (!formData.resumeFilePath.trim()) newErrors.resumeFilePath = "이력서를 업로드해주세요"
    if (!formData.portfolioFilePath.trim()) newErrors.portfolioFilePath = "포트폴리오를 업로드해주세요"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (!resumeUploadState.uploaded) {
      setErrors({ resumeFilePath: "이력서를 업로드해주세요" })
      return
    }

    if (!portfolioUploadState.uploaded) {
      setErrors({ portfolioFilePath: "포트폴리오를 업로드해주세요" })
      return
    }

    setIsSubmitting(true)

    try {
      console.log("Sending registration request to:", getApiUrl(API_CONFIG.ENDPOINTS.REGISTER))
      
      // 실제 사용자 등록 API 호출
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.REGISTER), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          positionId: formData.positionId,
          experienceId: formData.experienceId,
          location: formData.location,
          githubUrl: formData.githubUrl,
          portfolioUrl: formData.portfolioUrl,
          techStackIds: formData.techStackIds,
          resumeFilePath: formData.resumeFilePath,
          portfolioFilePath: formData.portfolioFilePath,
        }),
      })

      console.log("Response status:", response.status)
      console.log("Response headers:", response.headers)

      if (!response.ok) {
        // 상세한 에러 정보 가져오기
        let errorMessage = `등록에 실패했습니다 (${response.status})`
        try {
          const errorText = await response.text()
          if (errorText) {
            errorMessage += `: ${errorText}`
          }
        } catch (e) {
          // 에러 텍스트를 읽을 수 없는 경우 무시
        }
        throw new Error(errorMessage)
      }

      // 성공 응답 처리
      const contentType = response.headers.get('content-type')
      let result
      
      if (contentType && contentType.includes('application/json')) {
        result = await response.json()
      } else {
        result = await response.text()
      }
      
      console.log("Registration successful:", result)
      
      // 성공 알림 (선택적)
      alert("지원자 등록이 성공적으로 완료되었습니다!")

      // 성공 시 메인 페이지로 이동
      router.push("/")
      
    } catch (error) {
      console.error("Error submitting candidate:", error)
      
      // 네트워크 에러와 서버 에러 구분
      let errorMessage = "등록 중 오류가 발생했습니다"
      
      if (error instanceof Error) {
        if (error.message.includes("Failed to fetch")) {
          errorMessage = "서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요."
        } else {
          errorMessage = error.message
        }
      }
      
      setErrors({ 
        username: errorMessage
      })
      
      // 사용자에게 에러 알림
      alert(errorMessage)
      
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">새 지원자 등록</h1>
          <p className="text-slate-600">면접 파이프라인에 새로운 지원자를 추가하세요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                기본 정보
              </CardTitle>
              <CardDescription>지원자의 개인 정보 및 경력 사항을 입력해주세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">이름 *</Label>
                  <Input
                    id="name"
                    placeholder="홍길동"
                    value={formData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    className={errors.username ? "border-red-500" : ""}
                  />
                  {errors.username && <p className="text-sm text-red-600">{errors.username}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">이메일 주소 *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="hong.gildong@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="position">포지션 *</Label>
                  <Select value={formData.positionId?.toString() || ""} onValueChange={(value) => handleIdChange("positionId", value)}>
                    <SelectTrigger className={errors.positionId ? "border-red-500" : ""}>
                      <SelectValue placeholder={loadingPositions ? "포지션 로딩 중..." : positionsError ? "포지션 로딩 실패" : "포지션 선택"} />
                    </SelectTrigger>
                    <SelectContent>
                        {loadingPositions ? (
                          <div className="p-2 text-center text-slate-500">포지션을 불러오는 중입니다...</div>
                        ) : positionsError ? (
                          <div className="p-2 text-center text-red-500">포지션을 불러오는데 실패했습니다</div>
                        ) : positions.length === 0 ? (
                          <div className="p-2 text-center text-slate-500">등록된 포지션이 없습니다</div>
                        ) : (
                          positions.map((position) => (
                            <SelectItem key={position.id} value={position.id.toString()}>
                              {position.title}
                            </SelectItem>
                          ))
                        )}
                    </SelectContent>
                  </Select>
                  {errors.positionId && <p className="text-sm text-red-600">{errors.positionId}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">경력 *</Label>
                  <Select value={formData.experienceId?.toString() || ""} onValueChange={(value) => handleIdChange("experienceId", value)}>
                    <SelectTrigger className={errors.experienceId ? "border-red-500" : ""}>
                      <SelectValue placeholder={loadingExperiences ? "경력 로딩 중..." : experiencesError ? "경력 로딩 실패" : "경력 선택"} />
                    </SelectTrigger>
                    <SelectContent>
                      {
                        loadingExperiences ? (
                          <div className="p-2 text-center text-slate-500">경력 정보를 불러오는 중입니다...</div>
                        ) : experiencesError ? (
                          <div className="p-2 text-center text-red-500">경력 정보를 불러오는데 실패했습니다</div>
                        ) : experiences.length === 0 ? (
                          <div className="p-2 text-center text-slate-500">등록된 경력 정보가 없습니다</div>
                        ) : (
                          experiences.map((experience) => (
                            <SelectItem key={experience.id} value={experience.id.toString()}>
                              {experience.title}
                            </SelectItem>
                          ))
                        )}
                    </SelectContent>
                  </Select>
                  {errors.experienceId && <p className="text-sm text-red-600">{errors.experienceId}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">지역 *</Label>
                <Input
                  id="location"
                  placeholder="서울, 대한민국"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  className={errors.location ? "border-red-500" : ""}
                />
                {errors.location && <p className="text-sm text-red-600">{errors.location}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">기술 스택 *</Label>
                                 <div className={`flex flex-wrap gap-2 p-3 border rounded-md min-h-[60px] ${errors.techStackIds ? "border-red-500" : "border-slate-300"}`}>
                   {loadingTechStacks ? (
                     <p className="text-slate-500">기술 스택을 불러오는 중입니다...</p>
                   ) : techStacksError ? (
                     <p className="text-red-500">기술 스택을 불러오는데 실패했습니다.</p>
                   ) : techStacks.length === 0 ? (
                     <p className="text-slate-500">등록된 기술 스택이 없습니다.</p>
                   ) : (
                     techStacks.map((tech) => (
                       <Button
                         key={tech.id}
                         type="button"
                         variant={selectedTechStackIds.includes(tech.id) ? "default" : "outline"}
                         size="sm"
                         onClick={() => toggleTechStack(tech.id)}
                         className={`flex items-center gap-1 ${
                           selectedTechStackIds.includes(tech.id) 
                             ? "bg-blue-600 text-white hover:bg-blue-700" 
                             : "hover:bg-slate-50"
                         }`}
                       >
                         {selectedTechStackIds.includes(tech.id) && (
                           <CheckCircle className="h-3 w-3" />
                         )}
                         <span className="text-sm">{tech.title}</span>
                       </Button>
                     ))
                   )}
                 </div>
                 {selectedTechStackIds.length > 0 && (
                   <p className="text-sm text-slate-600">
                     선택된 기술: {selectedTechStackIds.map(id => techStacks.find(tech => tech.id === id)?.title).join(', ')}
                   </p>
                 )}
                {errors.techStackIds && <p className="text-sm text-red-600">{errors.techStackIds}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Resume Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                이력서 업로드 *
              </CardTitle>
              <CardDescription>PDF 또는 Word 형식의 이력서를 업로드해주세요</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive.resume
                    ? "border-blue-400 bg-blue-50"
                    : resumeUploadState.uploading
                      ? "border-yellow-400 bg-yellow-50"
                      : resumeUploadState.uploaded
                        ? "border-green-400 bg-green-50"
                        : resumeUploadState.error
                          ? "border-red-400 bg-red-50"
                          : "border-slate-300 hover:border-slate-400"
                }`}
                onDragEnter={(e) => handleDrag(e, "resume")}
                onDragLeave={(e) => handleDrag(e, "resume")}
                onDragOver={(e) => handleDrag(e, "resume")}
                onDrop={(e) => handleDrop(e, "resume")}
              >
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileInput(e, "resume")}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={resumeUploadState.uploading}
                />

                {resumeUploadState.uploading ? (
                  <div className="space-y-2">
                    <Upload className="h-12 w-12 text-yellow-500 mx-auto animate-pulse" />
                    <p className="text-yellow-700 font-medium">업로드 중...</p>
                    <p className="text-sm text-yellow-600">파일을 업로드하고 있습니다. 잠시만 기다려주세요.</p>
                  </div>
                ) : resumeUploadState.uploaded ? (
                  <div className="space-y-2">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                    <p className="text-green-700 font-medium">{resumeUploadState.fileName}</p>
                    <p className="text-sm text-green-600">이력서가 성공적으로 업로드되었습니다</p>
                  </div>
                ) : resumeUploadState.error ? (
                  <div className="space-y-2">
                    <Upload className="h-12 w-12 text-red-500 mx-auto" />
                    <p className="text-red-700 font-medium">업로드 실패</p>
                    <p className="text-sm text-red-600">{resumeUploadState.error}</p>
                    <p className="text-xs text-red-500">다시 시도하려면 파일을 선택해주세요</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-12 w-12 text-slate-400 mx-auto" />
                    <p className="text-slate-600">이력서를 여기에 드래그하거나 클릭하여 파일을 선택하세요</p>
                    <p className="text-sm text-slate-500">PDF, DOC, DOCX 최대 10MB</p>
                  </div>
                )}
              </div>
              {errors.resumeFilePath && <p className="text-sm text-red-600 mt-2">{errors.resumeFilePath}</p>}
            </CardContent>
          </Card>

          {/* GitHub & Portfolio */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* GitHub Profile */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Github className="h-5 w-5 text-blue-600" />
                  GitHub 프로필
                </CardTitle>
                <CardDescription>지원자의 GitHub 프로필 링크</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Input
                    placeholder="https://github.com/username"
                    value={formData.githubUrl}
                    onChange={(e) => handleInputChange("githubUrl", e.target.value)}
                  />
                  <Button
                    type="button"
                    onClick={validateGithub}
                    className="w-full bg-transparent"
                    variant="outline"
                    disabled={!formData.githubUrl}
                  >
                    프로필 검증
                  </Button>
                </div>

                {githubValidated && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-700">
                      GitHub 프로필이 성공적으로 검증되었습니다
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Portfolio URL */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LinkIcon className="h-5 w-5 text-blue-600" />
                  포트폴리오 웹사이트
                </CardTitle>
                <CardDescription>지원자의 포트폴리오 또는 개인 웹사이트 링크</CardDescription>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="https://portfolio.com"
                  value={formData.portfolioUrl}
                  onChange={(e) => handleInputChange("portfolioUrl", e.target.value)}
                />
              </CardContent>
            </Card>
          </div>

          {/* Portfolio File */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5 text-blue-600" />
                포트폴리오 파일
              </CardTitle>
              <CardDescription>추가 포트폴리오 파일, 프로젝트 또는 문서를 업로드하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive.portfolio 
                    ? "border-blue-400 bg-blue-50" 
                    : portfolioUploadState.uploading
                      ? "border-yellow-400 bg-yellow-50"
                      : portfolioUploadState.uploaded
                        ? "border-green-400 bg-green-50"
                        : portfolioUploadState.error
                          ? "border-red-400 bg-red-50"
                          : "border-slate-300 hover:border-slate-400"
                }`}
                onDragEnter={(e) => handleDrag(e, "portfolio")}
                onDragLeave={(e) => handleDrag(e, "portfolio")}
                onDragOver={(e) => handleDrag(e, "portfolio")}
                onDrop={(e) => handleDrop(e, "portfolio")}
              >
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileInput(e, "portfolio")}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={portfolioUploadState.uploading}
                />

                {portfolioUploadState.uploading ? (
                  <div className="space-y-2">
                    <Upload className="h-8 w-8 text-yellow-500 mx-auto animate-pulse" />
                    <p className="text-yellow-700 font-medium">업로드 중...</p>
                    <p className="text-sm text-yellow-600">파일을 업로드하고 있습니다. 잠시만 기다려주세요.</p>
                  </div>
                ) : portfolioUploadState.uploaded ? (
                  <div className="space-y-2">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto" />
                    <p className="text-green-700 font-medium">{portfolioUploadState.fileName}</p>
                    <p className="text-sm text-green-600">포트폴리오가 성공적으로 업로드되었습니다</p>
                  </div>
                ) : portfolioUploadState.error ? (
                  <div className="space-y-2">
                    <Upload className="h-8 w-8 text-red-500 mx-auto" />
                    <p className="text-red-700 font-medium">업로드 실패</p>
                    <p className="text-sm text-red-600">{portfolioUploadState.error}</p>
                    <p className="text-xs text-red-500">다시 시도하려면 파일을 선택해주세요</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-8 w-8 text-slate-400 mx-auto" />
                    <p className="text-slate-600">포트폴리오를 여기에 드래그하거나 클릭하여 파일을 선택하세요</p>
                    <p className="text-sm text-slate-500">PDF, DOC, DOCX 최대 10MB</p>
                  </div>
                )}
              </div>
              {errors.portfolioFilePath && <p className="text-sm text-red-600 mt-2">{errors.portfolioFilePath}</p>}
            </CardContent>
          </Card>

          {/* Submitting Progress */}
          {isSubmitting && (
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-center text-sm">
                    <span>지원자 정보를 등록하는 중입니다...</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/")}
              disabled={isSubmitting}
              className="bg-transparent"
            >
              취소
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 px-8">
              {isSubmitting ? "등록 중..." : "지원자 등록"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
