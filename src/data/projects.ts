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
    id: 'project-1',
    drive: 'C:',
    name: 'Project Alpha',
    description: 'A full stack web application with real-time features and modern UI.',
    tech: ['React', 'Node.js', 'MongoDB', 'Socket.io'],
    github: 'https://github.com/ArmanTomar4',
    live: '',
    image: '',
  },
  {
    id: 'project-2',
    drive: 'D:',
    name: 'Project Beta',
    description: 'A responsive e-commerce platform with payment integration.',
    tech: ['Next.js', 'TypeScript', 'Stripe', 'PostgreSQL'],
    github: 'https://github.com/ArmanTomar4',
    live: '',
    image: '',
  },
  {
    id: 'project-3',
    drive: 'E:',
    name: 'Project Gamma',
    description: 'A mobile-first design system and component library.',
    tech: ['React', 'Tailwind CSS', 'Storybook', 'Figma'],
    github: 'https://github.com/ArmanTomar4',
    live: '',
    image: '',
  },
  {
    id: 'project-4',
    drive: 'F:',
    name: 'Project Delta',
    description: 'A real-time dashboard with data visualization and analytics.',
    tech: ['Vue.js', 'D3.js', 'FastAPI', 'Redis'],
    github: 'https://github.com/ArmanTomar4',
    live: '',
    image: '',
  },
]
