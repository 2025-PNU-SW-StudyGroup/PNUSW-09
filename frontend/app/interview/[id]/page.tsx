"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getCandidateById } from "@/lib/mock-data"
import { ArrowRight, Bot, Clock, Mic, MicOff, Play, Plus, Square, User, Volume2 } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"

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
  difficulty: "Easy" | "Medium" | "Hard"
  question: string
  followUps: string[]
}

export default function LiveInterviewPage() {
  const params = useParams()
  const candidateId = params.id as string
  const candidate = getCandidateById(candidateId)

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
      difficulty: "Medium",
      question: "Explain the difference between useEffect and useLayoutEffect hooks.",
      followUps: [
        "When would you choose one over the other?",
        "Can you provide a practical example?",
        "How do they affect the rendering cycle?",
      ],
    },
    {
      id: "2",
      category: "System Design",
      difficulty: "Hard",
      question: "Design a real-time chat application that can handle millions of users.",
      followUps: [
        "How would you handle message persistence?",
        "What about scaling the WebSocket connections?",
        "How would you implement message delivery guarantees?",
      ],
    },
    {
      id: "3",
      category: "Algorithms",
      difficulty: "Easy",
      question: "Implement a function to reverse a string without using built-in methods.",
      followUps: [
        "What's the time complexity?",
        "Can you optimize for space?",
        "How would you handle Unicode characters?",
      ],
    },
    {
      id: "4",
      category: "TypeScript",
      difficulty: "Medium",
      question: "Explain generic constraints and provide an example of when you'd use them.",
      followUps: [
        "How do they improve type safety?",
        "Can you show a real-world use case?",
        "What about conditional types?",
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
      alert('Microphone access permission is required.')
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
          "That's a great answer. Could you explain it in more detail?",
          "Interesting approach. How would you handle edge cases?",
          "Good explanation. Let's dive deeper into the implementation.",
          "I understand. What about performance considerations?",
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

  const startInterview = () => {
    setIsInterviewStarted(true)

    // Add welcome message
    const welcomeMessage: Message = {
      id: "welcome",
      sender: "interviewer",
      content: `Hello ${candidate?.name}! Welcome to your technical interview. I've reviewed your background in ${candidate?.position}. Let's start with a brief introduction about your experience.`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages([welcomeMessage])
  }

  const stopInterview = () => {
    setIsInterviewStarted(false)
    stopRecording()
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

  if (!candidate) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Candidate Not Found</h1>
          <Link href="/overview">
            <Button>Back to Overview</Button>
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
                      {candidate.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-semibold text-slate-800">{candidate.name}</h2>
                    <p className="text-sm text-slate-600">{candidate.position}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div
                    className={`flex items-center gap-2 ${isInterviewStarted ? "text-green-600" : "text-slate-400"}`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full ${isInterviewStarted ? "bg-green-500 animate-pulse" : "bg-slate-300"}`}
                    ></div>
                    <span className="text-sm font-medium">{isInterviewStarted ? "Live Interview" : "Not Started"}</span>
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
                  {showQuestions ? "Hide" : "Show"} Questions
                </Button>

                {!isInterviewStarted ? (
                  <Button onClick={startInterview} className="bg-green-600 hover:bg-green-700">
                    <Play className="h-4 w-4 mr-2" />
                    Start Interview
                  </Button>
                ) : (
                  <Link href={`/candidates/${candidate.id}`}>
                    <Button onClick={stopInterview} variant="destructive">
                      <Square className="h-4 w-4 mr-2" />
                      End Interview
                    </Button>
                  </Link>
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
                      {isRecording ? "Stop Recording" : "Start Recording"}
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
                            {currentSpeaker === "candidate" ? "Candidate Speaking" : "Interviewer Speaking"}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <Alert className="border-blue-200 bg-blue-50 p-2 w-auto">
                  <AlertDescription className="text-blue-700 text-sm">
                    🎤 Real-time transcription enabled. All conversation is being transcribed automatically.
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
                <h3 className="text-lg font-medium text-slate-800 mb-2">Ready to Start Interview</h3>
                <p className="text-slate-600 mb-4">
                  Click &ldquo;Start Interview&rdquo; to begin real-time transcription
                </p>
                <p className="text-sm text-slate-500">
                  The system will automatically detect who&rsquo;s speaking and transcribe the conversation
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
                      <p className="text-xs mt-1 text-slate-500">Transcribing...</p>
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
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Question Recommendations</h2>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-slate-600 mb-1 block">Difficulty</label>
                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-600 mb-1 block">Topic</label>
                  <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Topics</SelectItem>
                      <SelectItem value="react">React</SelectItem>
                      <SelectItem value="algorithms">Algorithms</SelectItem>
                      <SelectItem value="system">System Design</SelectItem>
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
                      Add to Interview
                    </Button>

                    {question.followUps.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-slate-600">Follow-up suggestions:</p>
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
