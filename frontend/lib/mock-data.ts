export interface Candidate {
  id: string
  name: string
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
    name: "Sarah Chen",
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
  {
    id: "2",
    name: "Marcus Johnson",
    email: "marcus.j@email.com",
    position: "Full Stack Engineer",
    avatar: "/placeholder.svg?height=40&width=40&text=MJ",
    status: "pending",
    appliedDate: "2024-01-18",
    experience: "3 years",
    location: "Austin, TX",
    resumeUploaded: true,
    githubUrl: "https://github.com/marcusj",
    skills: ["Node.js", "Python", "React", "PostgreSQL", "AWS"],
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.r@email.com",
    position: "Backend Developer",
    avatar: "/placeholder.svg?height=40&width=40&text=ER",
    status: "completed",
    appliedDate: "2024-01-12",
    experience: "4 years",
    location: "New York, NY",
    resumeUploaded: true,
    githubUrl: "https://github.com/emilyrod",
    skills: ["Java", "Spring Boot", "Microservices", "Docker", "Kubernetes"],
    interviewDate: "2024-01-19",
    score: 92,
    strengths: ["System architecture", "Clean code practices", "Technical depth"],
    improvements: ["Frontend technologies", "Communication clarity"],
  },
  {
    id: "4",
    name: "David Kim",
    email: "david.kim@email.com",
    position: "DevOps Engineer",
    avatar: "/placeholder.svg?height=40&width=40&text=DK",
    status: "pending",
    appliedDate: "2024-01-20",
    experience: "6 years",
    location: "Seattle, WA",
    resumeUploaded: false,
    skills: ["AWS", "Terraform", "Kubernetes", "CI/CD", "Monitoring"],
  },
  {
    id: "5",
    name: "Lisa Wang",
    email: "lisa.wang@email.com",
    position: "Mobile Developer",
    avatar: "/placeholder.svg?height=40&width=40&text=LW",
    status: "completed",
    appliedDate: "2024-01-10",
    experience: "4 years",
    location: "Los Angeles, CA",
    resumeUploaded: true,
    githubUrl: "https://github.com/lisawang",
    portfolioUrl: "https://lisawang.dev",
    skills: ["React Native", "Swift", "Kotlin", "Firebase", "Redux"],
    interviewDate: "2024-01-17",
    score: 78,
    strengths: ["Mobile expertise", "Cross-platform development", "User experience focus"],
    improvements: ["Backend knowledge", "System design", "Testing practices"],
  },
  {
    id: "6",
    name: "Alex Thompson",
    email: "alex.t@email.com",
    position: "Data Engineer",
    avatar: "/placeholder.svg?height=40&width=40&text=AT",
    status: "pending",
    appliedDate: "2024-01-22",
    experience: "5 years",
    location: "Chicago, IL",
    resumeUploaded: true,
    githubUrl: "https://github.com/alexthompson",
    skills: ["Python", "Apache Spark", "SQL", "Airflow", "GCP"],
  },
]

export const getCandidateById = (id: string): Candidate | undefined => {
  return mockCandidates.find((candidate) => candidate.id === id)
}
