"use client"

import type React from "react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, ExternalLink, FileText, Github, LinkIcon, Upload, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface FormData {
  name: string
  email: string
  position: string
  experience: string
  location: string
  githubUrl: string
  portfolioUrl: string
  skills: string
}

interface FileUpload {
  resume: File | null
  portfolioFiles: File[]
}

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    position: "",
    experience: "",
    location: "",
    githubUrl: "",
    portfolioUrl: "",
    skills: "",
  })

  const [files, setFiles] = useState<FileUpload>({
    resume: null,
    portfolioFiles: [],
  })

  const [dragActive, setDragActive] = useState({
    resume: false,
    portfolio: false,
  })

  const [uploadProgress, setUploadProgress] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [githubValidated, setGithubValidated] = useState(false)

  const positions = [
    "프론트엔드 개발자",
    "백엔드 개발자", 
    "풀스택 엔지니어",
    "모바일 개발자",
    "DevOps 엔지니어",
    "데이터 엔지니어",
    "UI/UX 디자이너",
    "제품 매니저",
  ]

  const experienceLevels = ["1-2년", "3-4년", "5-7년", "8년 이상"]

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
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

  const handleDrop = (e: React.DragEvent, type: "resume" | "portfolio") => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive((prev) => ({ ...prev, [type]: false }))

    const droppedFiles = Array.from(e.dataTransfer.files)

    if (type === "resume") {
      const file = droppedFiles[0]
      if (file && (file.type === "application/pdf" || file.type.includes("word"))) {
        setFiles((prev) => ({ ...prev, resume: file }))
      }
    } else {
      setFiles((prev) => ({ ...prev, portfolioFiles: [...prev.portfolioFiles, ...droppedFiles] }))
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>, type: "resume" | "portfolio") => {
    const selectedFiles = Array.from(e.target.files || [])

    if (type === "resume") {
      const file = selectedFiles[0]
      if (file) {
        setFiles((prev) => ({ ...prev, resume: file }))
      }
    } else {
      setFiles((prev) => ({ ...prev, portfolioFiles: [...prev.portfolioFiles, ...selectedFiles] }))
    }
  }

  const removePortfolioFile = (index: number) => {
    setFiles((prev) => ({
      ...prev,
      portfolioFiles: prev.portfolioFiles.filter((_, i) => i !== index),
    }))
  }

  const validateGithub = () => {
    if (formData.githubUrl && formData.githubUrl.includes("github.com")) {
      setGithubValidated(true)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}

    if (!formData.name.trim()) newErrors.name = "이름을 입력해주세요"
    if (!formData.email.trim()) newErrors.email = "이메일을 입력해주세요"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "유효하지 않은 이메일 형식입니다"
    if (!formData.position) newErrors.position = "포지션을 선택해주세요"
    if (!formData.experience) newErrors.experience = "경력을 선택해주세요"
    if (!formData.location.trim()) newErrors.location = "지역을 입력해주세요"
    if (!formData.skills.trim()) newErrors.skills = "기술 스택을 입력해주세요"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const simulateUpload = () => {
    return new Promise<void>((resolve) => {
      let progress = 0
      const interval = setInterval(() => {
        progress += 10
        setUploadProgress(progress)
        if (progress >= 100) {
          clearInterval(interval)
          resolve()
        }
      }, 150)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (!files.resume) {
      setErrors({ name: "이력서를 업로드해주세요" })
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate file upload
      await simulateUpload()

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you would send the data to your API here
      console.log("Submitting candidate:", { formData, files })

      // Redirect to overview page
      router.push("/")
    } catch (error) {
      console.error("Error submitting candidate:", error)
    } finally {
      setIsSubmitting(false)
      setUploadProgress(0)
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
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
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
                  <Select value={formData.position} onValueChange={(value) => handleInputChange("position", value)}>
                    <SelectTrigger className={errors.position ? "border-red-500" : ""}>
                      <SelectValue placeholder="포지션 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map((position) => (
                        <SelectItem key={position} value={position}>
                          {position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.position && <p className="text-sm text-red-600">{errors.position}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">경력 *</Label>
                  <Select value={formData.experience} onValueChange={(value) => handleInputChange("experience", value)}>
                    <SelectTrigger className={errors.experience ? "border-red-500" : ""}>
                      <SelectValue placeholder="경력 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {experienceLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.experience && <p className="text-sm text-red-600">{errors.experience}</p>}
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
                <Textarea
                  id="skills"
                  placeholder="React, TypeScript, Node.js, Python, AWS..."
                  value={formData.skills}
                  onChange={(e) => handleInputChange("skills", e.target.value)}
                  className={errors.skills ? "border-red-500" : ""}
                  rows={3}
                />
                {errors.skills && <p className="text-sm text-red-600">{errors.skills}</p>}
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
                    : files.resume
                      ? "border-green-400 bg-green-50"
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
                />

                {files.resume ? (
                  <div className="space-y-2">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                    <p className="text-green-700 font-medium">{files.resume.name}</p>
                    <p className="text-sm text-green-600">이력서가 성공적으로 업로드되었습니다</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-12 w-12 text-slate-400 mx-auto" />
                    <p className="text-slate-600">이력서를 여기에 드래그하거나 클릭하여 파일을 선택하세요</p>
                    <p className="text-sm text-slate-500">PDF, DOC, DOCX 최대 10MB</p>
                  </div>
                )}
              </div>
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

          {/* Portfolio Files */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5 text-blue-600" />
                포트폴리오 파일
              </CardTitle>
              <CardDescription>추가 포트폴리오 파일, 프로젝트 또는 문서를 업로드하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive.portfolio ? "border-blue-400 bg-blue-50" : "border-slate-300 hover:border-slate-400"
                }`}
                onDragEnter={(e) => handleDrag(e, "portfolio")}
                onDragLeave={(e) => handleDrag(e, "portfolio")}
                onDragOver={(e) => handleDrag(e, "portfolio")}
                onDrop={(e) => handleDrop(e, "portfolio")}
              >
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleFileInput(e, "portfolio")}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <div className="space-y-2">
                  <Upload className="h-8 w-8 text-slate-400 mx-auto" />
                  <p className="text-slate-600">파일을 여기에 드래그하거나 클릭하여 선택하세요</p>
                  <p className="text-sm text-slate-500">여러 파일 업로드 지원</p>
                </div>
              </div>

              {files.portfolioFiles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600">업로드된 파일:</p>
                  {files.portfolioFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                      <span className="text-sm text-slate-700">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removePortfolioFile(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        제거
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upload Progress */}
          {isSubmitting && (
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>지원자 정보 업로드 중...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
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
