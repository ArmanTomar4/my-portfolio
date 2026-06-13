export interface SkillCategory {
  category: string
  color: string
  items: string[]
}

export const skills: SkillCategory[] = [
  {
    category: 'Programming',
    color: '#0000AA',
    items: ['JavaScript', 'Python', 'C++', 'HTML', 'CSS'],
  },
  {
    category: 'Frontend',
    color: '#AA0000',
    items: ['React.js', 'Next.js'],
  },
  {
    category: 'Backend',
    color: '#006600',
    items: ['Node.js', 'Express.js', 'FastAPI', 'REST APIs'],
  },
  {
    category: 'DevOps & Cloud',
    color: '#AA6600',
    items: ['Docker', 'Kubernetes', 'Redis', 'AWS (EC2, EKS)', 'GCP', 'Git', 'GitHub'],
  },
]
