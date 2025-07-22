"use client"

import type React from "react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle, FileText, Github, Upload } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [githubUrl, setGithubUrl] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [githubFetched, setGithubFetched] = useState(false)
  const [validationError, setValidationError] = useState("")

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      const file = files[0]
      if (file.type === "application/pdf" || file.type.includes("word")) {
        setUploadedFile(file)
        simulateUpload()
      } else {
        setValidationError("Please upload a PDF or Word document")
      }
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      setUploadedFile(files[0])
      simulateUpload()
    }
  }

  const simulateUpload = () => {
    setIsUploading(true)
    setValidationError("")
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setUploadProgress(progress)
      if (progress >= 100) {
        clearInterval(interval)
        setIsUploading(false)
      }
    }, 200)
  }

  const handleGithubFetch = () => {
    if (!githubUrl.includes("github.com")) {
      setValidationError("Please enter a valid GitHub URL")
      return
    }
    setValidationError("")
    setGithubFetched(true)
  }

  const isReadyForInterview = uploadedFile && githubFetched

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-800 mb-4">AI Technical Interview Assistant</h1>
            <p className="text-lg text-slate-600">
              Upload your resume and GitHub profile to get started with personalized interview preparation
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Resume Upload */}
            <Card className="border-2 border-dashed border-slate-200 hover:border-blue-300 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Resume Upload
                </CardTitle>
                <CardDescription>Upload your resume in PDF or Word format</CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive
                      ? "border-blue-400 bg-blue-50"
                      : uploadedFile
                        ? "border-green-400 bg-green-50"
                        : "border-slate-300 hover:border-slate-400"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />

                  {uploadedFile ? (
                    <div className="space-y-2">
                      <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                      <p className="text-green-700 font-medium">{uploadedFile.name}</p>
                      <p className="text-sm text-green-600">Resume uploaded successfully</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-12 w-12 text-slate-400 mx-auto" />
                      <p className="text-slate-600">Drag and drop your resume here, or click to browse</p>
                      <p className="text-sm text-slate-500">PDF, DOC, DOCX up to 10MB</p>
                    </div>
                  )}
                </div>

                {isUploading && (
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="w-full" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* GitHub Profile */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Github className="h-5 w-5 text-blue-600" />
                  GitHub Profile
                </CardTitle>
                <CardDescription>Connect your GitHub to analyze your coding experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Input
                    placeholder="https://github.com/username"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full"
                  />
                  <Button
                    onClick={handleGithubFetch}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={!githubUrl}
                  >
                    Fetch Repositories
                  </Button>
                </div>

                {githubFetched && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-700">
                      Successfully fetched 12 repositories. Found expertise in React, TypeScript, Python, and Node.js.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>

          {validationError && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">{validationError}</AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="text-center space-y-4">
            <Link href="/interview">
              <Button
                size="lg"
                className={`px-8 py-3 text-lg ${
                  isReadyForInterview ? "bg-blue-600 hover:bg-blue-700" : "bg-slate-400 cursor-not-allowed"
                }`}
                disabled={!isReadyForInterview}
              >
                Start Interview Session
              </Button>
            </Link>

            {!isReadyForInterview && (
              <p className="text-sm text-slate-500">
                Please upload your resume and connect your GitHub profile to continue
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
