export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
  ENDPOINTS: {
    TECH_STACKS: '/api/tech-stacks',
    EXPERIENCES: '/api/experiences',
    POSITIONS: '/api/positions',
    UPLOAD_RESUME: '/api/applicants/upload-resume',
    UPLOAD_PORTFOLIO: '/api/applicants/upload-portfolio',
    REGISTER: '/api/applicants/register',
    APPLICANTS: '/api/applicants',
    UPDATE_STATUS: '/api/applicants/{id}/status',
  }
} as const

export const getApiUrl = (endpoint: string) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`
} 