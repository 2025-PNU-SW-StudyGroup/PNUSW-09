"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { API_CONFIG, getApiUrl } from "@/lib/config"
import { ArrowRight, Bot, Clock, Mic, MicOff, Play, Plus, Square, User, Volume2 } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import useSWR from "swr"
import useSWRMutation from "swr/mutation"

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

interface Message {
  id: string
  sender: "candidate" | "interviewer"
  content: string
  timestamp: string
  isTranscribing?: boolean
}

interface Question {
  id: string
  category: string
  difficulty: "쉬움" | "보통" | "어려움"
  question: string
  followUps: string[]
}

// fetcher 함수
const fetcher = (url: string) => fetch(url).then(res => res.json())

// API fetcher 함수
const updateStatusFetcher = async (url: string, { arg }: { arg: { status: string } }) => {
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(arg),
  })

  if (!response.ok) {
    throw new Error(`상태 변경 실패: ${response.status}`)
  }

  return response.json()
}

export default function LiveInterviewPage() {
  const params = useParams()
  const router = useRouter()
  const candidateId = params.id as string

  // 실제 API 호출
  const { data: candidate, error, isLoading } = useSWR<ApiCandidate>(
    candidateId ? getApiUrl(`${API_CONFIG.ENDPOINTS.APPLICANTS}/${candidateId}`) : null,
    fetcher
  )

  // SWR Mutation 훅
  const { trigger: updateStatus, isMutating: isUpdatingStatus } = useSWRMutation(
    getApiUrl(API_CONFIG.ENDPOINTS.UPDATE_STATUS.replace('{id}', candidateId)),
    updateStatusFetcher
  )

  const [isRecording, setIsRecording] = useState(false)
  const [isInterviewStarted, setIsInterviewStarted] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")
  const [selectedTopic, setSelectedTopic] = useState<string>("all")
  const [showQuestions, setShowQuestions] = useState(true)
  const [interviewDuration, setInterviewDuration] = useState(0)
  const [currentSpeaker, setCurrentSpeaker] = useState<"candidate" | "interviewer" | null>(null)
  const [audioLevel, setAudioLevel] = useState(0)
  const [currentTranscript, setCurrentTranscript] = useState("")
  const [sessionId, setSessionId] = useState<string>("")
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const questions: Question[] = [
    {
      id: "1",
      category: "React",
      difficulty: "보통",
      question: "useEffect와 useLayoutEffect 훅의 차이점을 설명해주세요.",
      followUps: [
        "언제 어떤 것을 선택해야 할까요?",
        "실용적인 예시를 제공해 주실 수 있나요?",
        "렌더링 사이클에 어떤 영향을 미치나요?",
      ],
    },
    {
      id: "2",
      category: "시스템 설계",
      difficulty: "어려움",
      question: "수백만 명의 사용자를 처리할 수 있는 실시간 채팅 애플리케이션을 설계해보세요.",
      followUps: [
        "메시지 저장을 어떻게 처리하시겠습니까?",
        "WebSocket 연결의 확장성은 어떻게 처리하시겠습니까?",
        "메시지 전송 보장을 어떻게 구현하시겠습니까?",
      ],
    },
    {
      id: "3",
      category: "알고리즘",
      difficulty: "쉬움",
      question: "내장 메서드를 사용하지 않고 문자열을 뒤집는 함수를 구현해보세요.",
      followUps: [
        "시간 복잡도는 어떻게 되나요?",
        "공간 효율성을 위해 최적화할 수 있나요?",
        "유니코드 문자는 어떻게 처리하시겠습니까?",
      ],
    },
    {
      id: "4",
      category: "TypeScript",
      difficulty: "보통",
      question: "제네릭 제약조건(generic constraints)을 설명하고 언제 사용하는지 예시를 들어주세요.",
      followUps: [
        "타입 안전성을 어떻게 향상시키나요?",
        "실제 사용 사례를 보여주실 수 있나요?",
        "조건부 타입은 어떤가요?",
      ],
    },
  ]

  const filteredQuestions = questions.filter((q) => {
    const difficultyMatch = selectedDifficulty === "all" || q.difficulty === selectedDifficulty
    const topicMatch = selectedTopic === "all" || q.category.toLowerCase().includes(selectedTopic.toLowerCase())
    return difficultyMatch && topicMatch
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    // Generate session ID on component mount
    setSessionId(Date.now().toString())
  }, [])

  useEffect(() => {
    if (isInterviewStarted) {
      intervalRef.current = setInterval(() => {
        setInterviewDuration((prev) => prev + 1)
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isInterviewStarted])

  // Simulate audio level when recording
  useEffect(() => {
    if (isRecording && isInterviewStarted) {
      const audioInterval = setInterval(() => {
        setAudioLevel(Math.random() * 100)
      }, 100)

      return () => {
        clearInterval(audioInterval)
      }
    } else {
      setAudioLevel(0)
    }
  }, [isRecording, isInterviewStarted])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })
      mediaRecorderRef.current = mediaRecorder

      // Send recording start signal to server
      await fetch('/api/speech/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start', sessionId })
      })

      mediaRecorder.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          const reader = new FileReader()
          reader.onload = async () => {
            const base64Audio = (reader.result as string).split(',')[1]
            
            try {
              const response = await fetch('/api/speech/stream', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                  action: 'audio', 
                  sessionId, 
                  audioData: base64Audio 
                })
              })
              
              const data = await response.json()
              if (data.result && data.result.transcript) {
                setCurrentTranscript(data.result.transcript)
                
                // Add as message if final result
                if (data.result.isFinal) {
                  addTranscriptAsMessage(data.result.transcript)
                  setCurrentTranscript("")
                }
              }
            } catch (error) {
              console.error('Audio processing error:', error)
            }
          }
          reader.readAsDataURL(event.data)
        }
      }

      mediaRecorder.start(1000) // Generate data chunks every 1 second
      setIsRecording(true)
      setCurrentSpeaker("candidate")

      // Start result polling
      startPolling()

    } catch (error) {
      console.error('Error starting recording:', error)
      alert('마이크 접근 권한이 필요합니다.')
    }
  }

  const stopRecording = async () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
      mediaRecorderRef.current = null
      setIsRecording(false)
      setCurrentSpeaker(null)

      // Send recording stop signal to server
      await fetch('/api/speech/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'stop', sessionId })
      })

      // Stop polling
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
        pollingIntervalRef.current = null
      }

      // Add current transcript as message if exists
      if (currentTranscript.trim()) {
        addTranscriptAsMessage(currentTranscript)
        setCurrentTranscript("")
      }
    }
  }

  const startPolling = () => {
    pollingIntervalRef.current = setInterval(async () => {
      try {
        const response = await fetch(`/api/speech/stream?sessionId=${sessionId}`)
        const data = await response.json()
        
        if (data.result && data.result.transcript) {
          setCurrentTranscript(data.result.transcript)
          
          if (data.result.isFinal) {
            addTranscriptAsMessage(data.result.transcript)
            setCurrentTranscript("")
          }
        }
      } catch (error) {
        console.error('Polling error:', error)
      }
    }, 500) // Poll every 0.5 seconds
  }

  const addTranscriptAsMessage = (transcript: string) => {
    if (transcript.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        sender: "candidate",
        content: transcript,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => [...prev, message])

      // Simulate interviewer response
      setTimeout(() => {
        const responses = [
          "좋은 답변이네요. 더 자세히 설명해 주실 수 있나요?",
          "흥미로운 접근법이네요. 예외 상황은 어떻게 처리하시겠습니까?",
          "잘 설명해주셨습니다. 구현에 대해 더 자세히 알아볼까요?",
          "이해했습니다. 성능 고려사항은 어떤가요?",
        ]

        const response: Message = {
          id: (Date.now() + 1).toString(),
          sender: "interviewer",
          content: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }

        setMessages((prev) => [...prev, response])
      }, 1500)
    }
  }

  const startInterview = async () => {
    try {
      // SWR Mutation을 사용한 상태 변경
      await updateStatus({ status: 'INTERVIEWING' })
      
      console.log('상태가 INTERVIEWING으로 변경되었습니다')
      
      // 기존 로직 실행
      setIsInterviewStarted(true)

      // Add welcome message
      const welcomeMessage: Message = {
        id: "welcome",
        sender: "interviewer",
        content: `안녕하세요! 기술 면접에 오신 것을 환영합니다. 지원해주신 포지션의 경력을 검토해보았습니다. 먼저 본인의 경험에 대해 간단히 소개해 주세요.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      setMessages([welcomeMessage])
      
    } catch (error) {
      console.error('면접 시작 중 오류 발생:', error)
      alert('면접을 시작할 수 없습니다. 다시 시도해주세요.')
    }
  }

  const stopInterview = async () => {
    try {
      // 면접 종료 시 상태를 COMPLETED로 변경
      await updateStatus({ status: 'COMPLETED' })
      
      console.log('상태가 COMPLETED로 변경되었습니다')
      
      setIsInterviewStarted(false)
      stopRecording()
      
      // 상태 변경 후 지원자 상세 페이지로 이동
      router.push(`/candidates/${candidate?.id}`)
      
    } catch (error) {
      console.error('면접 종료 중 오류 발생:', error)
      alert('면접을 종료할 수 없습니다. 다시 시도해주세요.')
    }
  }

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  const addQuestionToChat = (question: string) => {
    const message: Message = {
      id: Date.now().toString(),
      sender: "interviewer",
      content: question,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
    setMessages((prev) => [...prev, message])
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "쉬움":
        return "bg-green-100 text-green-800"
      case "보통":
        return "bg-yellow-100 text-yellow-800"
      case "어려움":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <div className="h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">지원자 정보를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen bg-slate-50 flex items-center justify-center">
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
          <Link href="/">
            <Button>개요로 돌아가기</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-slate-50 flex flex-col">
      <div className="flex h-full">
        {/* Main Interview Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-white border-b border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                      {candidate.username
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-semibold text-slate-800">{candidate.username}</h2>
                    <p className="text-sm text-slate-600">{candidate.position.title}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div
                    className={`flex items-center gap-2 ${isInterviewStarted ? "text-green-600" : "text-slate-400"}`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full ${isInterviewStarted ? "bg-green-500 animate-pulse" : "bg-slate-300"}`}
                    ></div>
                    <span className="text-sm font-medium">{isInterviewStarted ? "면접중" : "시작 전"}</span>
                  </div>

                  {isInterviewStarted && (
                    <div className="flex items-center gap-1 text-sm text-slate-500">
                      <Clock className="h-4 w-4" />
                      <span>{formatDuration(interviewDuration)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowQuestions(!showQuestions)}>
                  질문 {showQuestions ? "숨기기" : "보기"}
                </Button>

                {!isInterviewStarted ? (
                  <Button 
                    onClick={startInterview} 
                    className="bg-green-600 hover:bg-green-700"
                    disabled={isUpdatingStatus}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {isUpdatingStatus ? "시작 중..." : "면접 시작"}
                  </Button>
                ) : (
                  <Button 
                    onClick={stopInterview} 
                    variant="destructive"
                    disabled={isUpdatingStatus}
                  >
                    <Square className="h-4 w-4 mr-2" />
                    {isUpdatingStatus ? "종료 중..." : "면접 종료"}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Recording Status */}
          {isInterviewStarted && (
            <div className="bg-blue-50 border-b border-blue-200 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant={isRecording ? "destructive" : "default"}
                      onClick={toggleRecording}
                      className="flex items-center gap-2"
                    >
                      {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      {isRecording ? "녹음 중지" : "녹음 시작"}
                    </Button>

                    {isRecording && (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Volume2 className="h-4 w-4 text-blue-600" />
                          <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 transition-all duration-100"
                              style={{ width: `${audioLevel}%` }}
                            />
                          </div>
                        </div>

                        {currentSpeaker && (
                          <Badge variant="outline" className="text-xs">
                            {currentSpeaker === "candidate" ? "지원자 발화 중" : "면접관 발화 중"}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <Alert className="border-blue-200 bg-blue-50 p-2 w-auto">
                  <AlertDescription className="text-blue-700 text-sm">
                    🎤 실시간 음성 인식이 활성화되었습니다. 모든 대화가 자동으로 텍스트로 변환됩니다.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {!isInterviewStarted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mic className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-slate-800 mb-2">면접 시작 준비 완료</h3>
                <p className="text-slate-600 mb-4">
                  &ldquo;면접 시작&rdquo;을 클릭하여 실시간 음성 인식을 시작하세요
                </p>
                <p className="text-sm text-slate-500">
                  시스템이 자동으로 발화자를 구분하고 대화를 텍스트로 변환합니다
                </p>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.sender === "candidate" ? "justify-start" : "justify-end"}`}
                  >
                    {message.sender === "candidate" && (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-slate-100 text-slate-600">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={`max-w-md rounded-lg p-3 ${
                        message.sender === "candidate" ? "bg-white border border-slate-200" : "bg-blue-600 text-white"
                      } ${message.isTranscribing ? "animate-pulse" : ""}`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.sender === "candidate" ? "text-slate-500" : "text-blue-100"
                        }`}
                      >
                        {message.timestamp}
                      </p>
                    </div>

                    {message.sender === "interviewer" && (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                
                {/* Display current transcript */}
                {currentTranscript && (
                  <div className="flex gap-3 justify-start">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-slate-100 text-slate-600">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="max-w-md rounded-lg p-3 bg-slate-200 border border-slate-300 opacity-70">
                      <p className="text-sm">{currentTranscript}</p>
                      <p className="text-xs mt-1 text-slate-500">변환 중...</p>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </div>

        {/* Question Recommendation Sidebar */}
        {showQuestions && (
          <div className="w-96 bg-white border-l border-slate-200 flex flex-col">
            <div className="p-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">추천 질문</h2>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-slate-600 mb-1 block">난이도</label>
                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">모든 레벨</SelectItem>
                      <SelectItem value="쉬움">쉬움</SelectItem>
                      <SelectItem value="보통">보통</SelectItem>
                      <SelectItem value="어려움">어려움</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-600 mb-1 block">주제</label>
                  <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">모든 주제</SelectItem>
                      <SelectItem value="react">React</SelectItem>
                      <SelectItem value="algorithms">알고리즘</SelectItem>
                      <SelectItem value="system">시스템 설계</SelectItem>
                      <SelectItem value="typescript">TypeScript</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {filteredQuestions.map((question) => (
                <Card key={question.id} className="border border-slate-200">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {question.category}
                      </Badge>
                      <Badge className={`text-xs ${getDifficultyColor(question.difficulty)}`}>
                        {question.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-slate-700">{question.question}</p>

                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => addQuestionToChat(question.question)}
                      disabled={!isInterviewStarted}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      면접에 추가
                    </Button>

                    {question.followUps.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-slate-600">후속 질문 제안:</p>
                        {question.followUps.map((followUp, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="flex-1 justify-start text-xs h-auto p-2 text-slate-600 hover:text-slate-800"
                              onClick={() => addQuestionToChat(followUp)}
                              disabled={!isInterviewStarted}
                            >
                              <ArrowRight className="h-3 w-3 mr-1 flex-shrink-0" />
                              <span className="text-left">{followUp}</span>
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
