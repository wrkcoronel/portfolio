import {
  getProjectSlug,
  type ProjectSummary,
} from '../model/projectCatalog'
import { ProjectDescriptionText } from './ProjectDescriptionText'
import { ProjectTitleText } from './ProjectTitleText'

type ProjectResultsListProps = {
  projects: ProjectSummary[]
}

export function ProjectResultsList({ projects }: ProjectResultsListProps) {
  return (
    <div className="projects-list" aria-label="Todos os projetos">
      {projects.map((project) => {
        if (project.githubRepository) {
          return (
            <a
              key={getProjectSlug(project)}
              className="projects-list-link"
              href={`#/projetos/${getProjectSlug(project)}`}
            >
              <article className="projects-list-item">
                <h3><ProjectTitleText project={project} /></h3>
                <ProjectDescriptionText className="projects-list-description" project={project} />
              </article>
            </a>
          )
        }

        return (
          <article key={getProjectSlug(project)} className="projects-list-item">
            <h3><ProjectTitleText project={project} /></h3>
            <ProjectDescriptionText className="projects-list-description" project={project} />
          </article>
        )
      })}
    </div>
  )
}
