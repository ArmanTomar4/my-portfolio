export interface Project {
  id: string
  name: string
  description: string
  tech: string[]
  github?: string
  live?: string
  image?: string
  drive: string
}

export const projects: Project[] = [
  {
    id: 'portfolio',
    drive: 'C:',
    name: 'This Portfolio',
    description: 'The site you\'re on right now — Windows 95 desktop on large screens, skeuomorphic early-iOS on mobile. Two themes, one codebase, all hand-built CSS. No UI libraries.',
    tech: ['Next.js', 'TypeScript', 'Zustand', 'Tailwind', 'Upstash Redis'],
    github: 'https://github.com/ArmanTomar4/my-portfolio',
    live: '',
    image: '',
  },
  {
    id: 'kheeladi',
    drive: 'D:',
    name: 'Kheeladi',
    description: 'Full-stack board game e-commerce platform — product listings, cart system, and order management built end-to-end with Docker, Kubernetes, and Redis.',
    tech: ['JavaScript', 'Node.js', 'Docker', 'Kubernetes', 'Redis'],
    github: '',
    live: '',
    image: '',
  },
  {
    id: 'warewolf',
    drive: 'E:',
    name: 'WareWolf Platform',
    description: 'Complete web platform (frontend + backend) built in JavaScript. Docker + Kubernetes for load balancing, and a Redis caching layer that significantly improved response times.',
    tech: ['JavaScript', 'Node.js', 'Docker', 'Kubernetes', 'Redis'],
    github: '',
    live: '',
    image: '',
  },
  {
    id: 'mits-college',
    drive: 'F:',
    name: 'MITS College Website',
    description: 'Official website for Madhav Institute of Technology & Science. Node.js + Express backend, serving the entire college student and faculty base with optimized load times.',
    tech: ['Node.js', 'Express.js', 'HTML', 'CSS', 'JavaScript'],
    github: '',
    live: '',
    image: '',
  },
]
