export interface Candidate {
  id: string
  username: string
  email: string
  position: string
  avatar: string
  status: "pending" | "completed"
  appliedDate: string
  experience: string
  location: string
  resumeUploaded: boolean
  githubUrl?: string
  portfolioUrl?: string
  skills: string[]
  interviewDate?: string
  score?: number
  strengths?: string[]
  improvements?: string[]
}

export const mockCandidates: Candidate[] = [
  {
    id: "1",
    username: "Sarah Chen",
    email: "sarah.chen@email.com",
    position: "Senior Frontend Developer",
    avatar: "/placeholder.svg?height=40&width=40&text=SC",
    status: "completed",
    appliedDate: "2024-01-15",
    experience: "5 years",
    location: "San Francisco, CA",
    resumeUploaded: true,
    githubUrl: "https://github.com/sarahchen",
    portfolioUrl: "https://sarahchen.dev",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "GraphQL"],
    interviewDate: "2024-01-20",
    score: 87,
    strengths: ["Strong React knowledge", "Excellent communication", "Problem-solving skills"],
    improvements: ["System design concepts", "Algorithm optimization"],
  },
]

export const getCandidateById = (id: string): Candidate | undefined => {
  return mockCandidates.find((candidate) => candidate.id === id)
}
