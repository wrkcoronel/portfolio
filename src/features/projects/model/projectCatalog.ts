export type GitHubProjectRepository = {
  owner: string
  name: string
}

export type ProjectSummary = {
  slug?: string
  title?: string
  description?: string
  githubRepository?: GitHubProjectRepository
}

export const projectCatalog: ProjectSummary[] = [
  {
    slug: 'macropilot',
    title: 'Macropilot',
    description: 'Software de RPA para criar, salvar e reutilizar macros feitas pelo usuario.',
    githubRepository: {
      owner: 'wrkcoronel',
      name: 'macropilot',
    },
  },
]

export function getProjectSlug(project: ProjectSummary) {
  if (project.slug) {
    return project.slug
  }

  if (project.githubRepository) {
    return project.githubRepository.name.toLowerCase()
  }

  return 'project'
}

export function getProjectTitle(project: ProjectSummary) {
  if (project.title) {
    return project.title
  }

  if (project.githubRepository) {
    return project.githubRepository.name
  }

  return 'Projeto'
}

export function getProjectDescription(project: ProjectSummary) {
  return project.description ?? 'Descricao indisponivel.'
}
