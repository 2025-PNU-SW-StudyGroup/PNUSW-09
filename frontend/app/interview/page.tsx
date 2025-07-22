"use client"


import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Bot, Clock, Mic, MicOff, Plus, Send, User } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

interface Message {
  id: string
  sender: "candidate" | "interviewer"
  content: string
  timestamp: string
}

interface Question {
  id: string
  category: string
  difficulty: "Easy" | "Medium" | "Hard"
  question: string
  followUps: string[]
}

export default function InterviewDashboard() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "interviewer",
      content:
        "안녕하세요! 기술 면접에 오신 것을 환영합니다. 이력서와 GitHub 프로필을 검토했습니다. 간단한 자기소개부터 시작해보겠습니다. React와 TypeScript 경험에 대해 말씀해 주시겠어요?",
      timestamp: "10:00 AM",
    },
  ])
  const [newMessage, setNewMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")
  const [selectedTopic, setSelectedTopic] = useState<string>("all")
  const [showQuestions, setShowQuestions] = useState(true)
  const [currentTranscript, setCurrentTranscript] = useState("")
  const [sessionId, setSessionId] = useState<string>("")
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const questions: Question[] = [
    {
      id: "1",
      category: "React",
      difficulty: "Medium",
      question: "useEffect와 useLayoutEffect 훅의 차이점을 설명해주세요.",
      followUps: [
        "언제 둘 중 하나를 선택하시겠습니까?",
        "실제 예제를 제공해 주실 수 있나요?",
        "렌더링 사이클에 어떤 영향을 미치나요?",
      ],
    },
    {
      id: "2",
      category: "System Design",
      difficulty: "Hard",
      question: "수백만 명의 사용자를 처리할 수 있는 실시간 채팅 애플리케이션을 설계해주세요.",
      followUps: [
        "메시지 지속성을 어떻게 처리하시겠습니까?",
        "WebSocket 연결을 어떻게 확장하시겠습니까?",
        "메시지 전달 보장을 어떻게 구현하시겠습니까?",
      ],
    },
    {
      id: "3",
      category: "Algorithms",
      difficulty: "Easy",
      question: "내장 메서드를 사용하지 않고 문자열을 뒤집는 함수를 구현해주세요.",
      followUps: [
        "시간 복잡도는 어떻게 되나요?",
        "공간을 위해 최적화할 수 있나요?",
        "Unicode 문자는 어떻게 처리하시겠습니까?",
      ],
    },
    {
      id: "4",
      category: "TypeScript",
      difficulty: "Medium",
      question: "제네릭 제약조건을 설명하고 언제 사용하는지 예제를 제공해주세요.",
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
    // 컴포넌트 마운트 시 세션 ID 생성
    setSessionId(Date.now().toString())
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })
      mediaRecorderRef.current = mediaRecorder

      // 서버에 녹음 시작 신호
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
                
                // 최종 결과인 경우 메시지로 추가
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

      mediaRecorder.start(1000) // 1초마다 데이터 청크 생성
      setIsRecording(true)

      // 결과 polling 시작
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

      // 서버에 녹음 중지 신호
      await fetch('/api/speech/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'stop', sessionId })
      })

      // polling 중지
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
        pollingIntervalRef.current = null
      }

      // 현재 transcript가 있으면 메시지로 추가
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
    }, 500) // 0.5초마다 polling
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

      // 면접관 응답 시뮬레이션
      setTimeout(() => {
        const responses = [
          "좋은 답변이네요. 더 자세히 설명해 주실 수 있나요?",
          "흥미로운 접근 방식입니다. 예외 상황은 어떻게 처리하시겠습니까?",
          "좋은 설명입니다. 구현에 대해 더 깊이 살펴보겠습니다.",
          "알겠습니다. 성능 고려사항은 어떤가요?",
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

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      sender: "candidate",
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")

    // 면접관 응답 시뮬레이션
    setTimeout(() => {
      const responses = [
        "좋은 답변이네요. 더 자세히 설명해 주실 수 있나요?",
        "흥미로운 접근 방식입니다. 예외 상황은 어떻게 처리하시겠습니까?",
        "좋은 설명입니다. 구현에 대해 더 깊이 살펴보겠습니다.",
        "알겠습니다. 성능 고려사항은 어떤가요?",
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

  const addQuestionToChat = (question: string) => {
    const message: Message = {
      id: Date.now().toString(),
      sender: "interviewer",
      content: question,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
    setMessages((prev) => [...prev, message])
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex h-screen">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-white border-b border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-slate-600">실시간 면접</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-slate-500">
                  <Clock className="h-4 w-4" />
                  <span>23:45</span>
                </div>
                {isRecording && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span>녹음 중</span>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowQuestions(!showQuestions)}>
                  {showQuestions ? "질문 숨기기" : "질문 보기"}
                </Button>
                <Link href="/analysis">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    면접 종료
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === "candidate" ? "justify-end" : "justify-start"}`}
              >
                {message.sender === "interviewer" && (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={`max-w-md rounded-lg p-3 ${
                    message.sender === "candidate" ? "bg-blue-600 text-white" : "bg-white border border-slate-200"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${message.sender === "candidate" ? "text-blue-100" : "text-slate-500"}`}>
                    {message.timestamp}
                  </p>
                </div>

                {message.sender === "candidate" && (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-slate-100 text-slate-600">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            
            {/* 현재 transcript 표시 */}
            {currentTranscript && (
              <div className="flex gap-3 justify-end">
                <div className="max-w-md rounded-lg p-3 bg-blue-400 text-white opacity-70">
                  <p className="text-sm">{currentTranscript}</p>
                  <p className="text-xs mt-1 text-blue-100">입력 중...</p>
                </div>
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-slate-100 text-slate-600">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="bg-white border-t border-slate-200 p-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  placeholder="답변을 입력하세요..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  className="pr-12"
                  disabled={isRecording}
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                  onClick={isRecording ? stopRecording : startRecording}
                >
                  {isRecording ? (
                    <MicOff className="h-4 w-4 text-red-500" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <Button onClick={sendMessage} className="bg-blue-600 hover:bg-blue-700" disabled={isRecording}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {isRecording && (
              <p className="text-xs text-slate-500 mt-2">
                🎤 음성을 인식하고 있습니다. 말씀을 멈추면 자동으로 텍스트로 변환됩니다.
              </p>
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
                      <SelectItem value="Easy">쉬움</SelectItem>
                      <SelectItem value="Medium">보통</SelectItem>
                      <SelectItem value="Hard">어려움</SelectItem>
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
                        {question.difficulty === "Easy" ? "쉬움" : question.difficulty === "Medium" ? "보통" : "어려움"}
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
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      채팅에 추가
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
