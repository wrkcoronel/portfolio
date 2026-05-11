import {
  getProjectDescription,
  getProjectTitle,
  type ProjectSummary,
} from '../model/projectCatalog'

export function filterProjectsBySearchTerm(projects: ProjectSummary[], searchTerm: string) {
  const normalizedSearchTerm = searchTerm.trim().toLowerCase()

  if (!normalizedSearchTerm) {
    return projects
  }

  return projects.filter((project) => {
    const searchableContent = `${getProjectTitle(project)} ${getProjectDescription(project)}`

    return searchableContent.toLowerCase().includes(normalizedSearchTerm)
  })
}
