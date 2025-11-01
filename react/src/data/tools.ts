export type ToolCategory = 'Education' | 'Divers'

export type Tool = {
  id: string
  name: string
  description: string
  category: ToolCategory
  href?: string
  icon?: string // path to an icon/image in public
  tags?: string[]
  subtitle?: string
  shortDescription?: string
}

export const categories: ToolCategory[] = ['Education', 'Divers']

export const tools: Tool[] = [
  {
    id: 'revisit',
    name: 'Revisit',
    description: "Réviser les questions posées durant l'examen du permis.",
    category: 'Education',
    href: 'https://redfly.fr/revisit/',
    icon: 'https://redfly.fr/revisit/favicon.svg',
    tags: ['permis', 'questions', 'examen', 'révision'],
    subtitle: 'Révision espacée et swipe intuitif pour réussir ton permis',
    shortDescription: "Apprends le Code de la route naturellement avec un système de révision intelligent. Swipe, progresse et réussis ton ETG sans effort. 100% gratuit."
  }
]
