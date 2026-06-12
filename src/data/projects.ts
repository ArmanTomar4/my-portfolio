export interface Project {
  id: string
  name: string
  description: string
  tech: string[]
  github?: string
  live?: string
  image?: string
}

export const projects: Project[] = [
  {
    id: 'project-1',
    name: 'Project One',
    description: 'Description of your project.',
    tech: ['React', 'Node.js', 'MongoDB'],
    github: 'https://github.com/ArmanTomar4',
    live: '',
  },
]
