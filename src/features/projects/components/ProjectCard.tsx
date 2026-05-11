import { getProjectSlug, type ProjectSummary } from '../model/projectCatalog'
import { ProjectDescriptionText } from './ProjectDescriptionText'
import { ProjectTitleText } from './ProjectTitleText'

type ProjectCardProps = {
  project: ProjectSummary
}

export function ProjectCard({ project }: ProjectCardProps) {
  const cardContent = (
    <>
      <h3><ProjectTitleText project={project} /></h3>
      <ProjectDescriptionText className="project-card-description" project={project} />
    </>
  )

  if (project.githubRepository) {
    return (
      <a
        className="project-card project-card-link"
        href={`#/projetos/${getProjectSlug(project)}`}
      >
        {cardContent}
      </a>
    )
  }

  return (
    <article className="project-card">
      {cardContent}
    </article>
  )
}
