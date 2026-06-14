export interface ExperienceItem {
  company: string
  role: string
  location: string
  start: string
  end: string
  bullets: string[]
  current?: boolean
  /** True for non-employer entries (e.g. independent freelance work) */
  freelance?: boolean
}

export interface ProjectItem {
  name: string
  stack: string
  bullets: string[]
}

export const experience: ExperienceItem[] = [
  {
    company: 'Kheeladi',
    role: 'Full Stack Developer',
    location: 'Bangalore',
    start: 'May 2026',
    end: 'Present',
    current: true,
    bullets: [
      'Building a full-stack board-game e-commerce platform using Docker, Kubernetes, and Redis.',
      'Developing end-to-end features including product listings, cart system, and order management.',
    ],
  },
  {
    company: 'Warewolf',
    role: 'Full Stack Developer',
    location: 'Gurugram',
    start: 'Dec 2025',
    end: 'Feb 2026',
    bullets: [
      'Built complete web platform (frontend + backend) in JavaScript with Docker and Kubernetes for load balancing.',
      'Integrated Redis caching layer, significantly improving application response times.',
    ],
  },
  {
    company: 'Aparatus',
    role: 'Frontend Developer',
    location: 'Mumbai',
    start: 'Jan 2025',
    end: 'Oct 2025',
    bullets: [
      'Designed and developed frontend for multiple product websites and a SaaS application end-to-end.',
      'Delivered consistent, responsive UI across all products in close collaboration with the product team.',
    ],
  },
  {
    company: 'Large Media Solution',
    role: 'Frontend Developer',
    location: 'Ahmedabad',
    start: 'Aug 2024',
    end: 'Dec 2024',
    bullets: [
      'Managed and delivered frontend for 25+ client projects at a service-based agency.',
      'Built responsive, cross-browser UIs across concurrent client engagements on tight deadlines.',
    ],
  },
  {
    company: 'Independent',
    role: 'Freelance Full Stack Developer',
    location: 'Remote',
    start: '2023',
    end: '2024',
    freelance: true,
    bullets: [
      'Handled 12+ clients independently — delivered e-commerce sites, landing pages, and portfolios.',
      'Managed complete project lifecycle from requirements to deployment for each client.',
    ],
  },
]

export const featuredProjects: ProjectItem[] = [
  {
    name: 'College Website',
    stack: 'Node.js · Express.js · HTML · CSS · JS',
    bullets: [
      'Built the official website for Madhav Institute of Technology and Science with a Node.js + Express backend.',
      'Deployed the platform serving the entire college student and faculty base with optimized load times.',
    ],
  },
]

export const achievements: string[] = [
  '5+ internships & freelance roles before graduation',
  '37+ clients delivered across agencies & freelance work',
  'Built & deployed production SaaS products end-to-end',
]

export const about = {
  name: 'Arman Singh Tomar',
  role: 'Full Stack Developer',
  email: 'tomararman4@gmail.com',
  phone: '+91 7773081330',
  location: 'Gwalior, MP',
  github: 'https://github.com/ArmanTomar4',
  linkedin: 'https://www.linkedin.com/in/arman-tomar',
  resume: '/Arman_Resume.pdf',
  education: {
    school: 'Madhav Institute of Technology & Science',
    degree: 'B.Tech in AI & Machine Learning',
    location: 'Gwalior, MP',
    expected: 'May 2026',
  },
  experience,
  featuredProjects,
  achievements,
  bio: `Hi, I'm Arman Singh Tomar — a Full Stack Developer based in Gwalior, finishing my B.Tech in AI & ML at Madhav Institute of Technology & Science (May 2026).

I've shipped real production work — 37+ client projects across agencies and freelance, full-stack platforms with Docker, Kubernetes and Redis, and frontend for SaaS products end-to-end.

I care about the small stuff: the curve of a shadow, the timing of a hover, the exact gray of a divider. Designs that look obvious are usually the hardest to make.

This entire OS — desktop, mobile, the windows, the cursor, the boot screen — is hand-built. No UI libraries. Most of it is plain CSS and a Zustand store doing window management.

If you find a bug, leave a note in the guestbook. If you find an easter egg, even better.`,
}
