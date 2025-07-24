"use client"

import { useState, useEffect, useRef } from "react"
import { Send, Mic, MicOff, User, Bot, Clock, Plus, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

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
        "Hello! Welcome to your technical interview. I've reviewed your resume and GitHub profile. Let's start with a quick introduction - can you tell me about your experience with React and TypeScript?",
      timestamp: "10:00 AM",
    },
  ])
  const [newMessage, setNewMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")
  const [selectedTopic, setSelectedTopic] = useState<string>("all")
  const [showQuestions, setShowQuestions] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

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

    // Simulate interviewer response
    setTimeout(() => {
      const responses = [
        "That's a great point. Can you elaborate on that?",
        "Interesting approach. How would you handle edge cases?",
        "Good explanation. Let's dive deeper into the implementation.",
        "I see. What about performance considerations?",
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
                  <span className="text-sm font-medium text-slate-600">Live Interview</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-slate-500">
                  <Clock className="h-4 w-4" />
                  <span>23:45</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowQuestions(!showQuestions)}>
                  {showQuestions ? "Hide" : "Show"} Questions
                </Button>
                <Link href="/analysis">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    End Interview
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
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="bg-white border-t border-slate-200 p-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  placeholder="Type your response..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  className="pr-12"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                  onClick={() => setIsRecording(!isRecording)}
                >
                  {isRecording ? <MicOff className="h-4 w-4 text-red-500" /> : <Mic className="h-4 w-4" />}
                </Button>
              </div>
              <Button onClick={sendMessage} className="bg-blue-600 hover:bg-blue-700">
                <Send className="h-4 w-4" />
              </Button>
            </div>
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
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add to Chat
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
