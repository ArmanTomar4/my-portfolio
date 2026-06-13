export interface SkillCategory {
  category: string
  color: string
  items: string[]
}

export const skills: SkillCategory[] = [
  {
    category: 'Frontend',
    color: '#0000AA',
    items: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS'],
  },
  {
    category: 'UI / Design',
    color: '#AA0000',
    items: ['Figma', 'Responsive Design', 'CSS Animations', 'Design Systems', 'Prototyping'],
  },
  {
    category: 'Backend',
    color: '#006600',
    items: ['Node.js', 'Express', 'REST APIs', 'GraphQL', 'PostgreSQL', 'MongoDB', 'Redis'],
  },
  {
    category: 'Tools',
    color: '#AA6600',
    items: ['Git', 'GitHub', 'VS Code', 'Vercel', 'Docker', 'Postman'],
  },
]
