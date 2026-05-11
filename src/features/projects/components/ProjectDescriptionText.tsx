import { getProjectDescription, type ProjectSummary } from '../model/projectCatalog'

type ProjectDescriptionTextProps = {
  className?: string
  project: ProjectSummary
}

export function ProjectDescriptionText({ className, project }: ProjectDescriptionTextProps) {
  return (
    <p className={className}>
      {getProjectDescription(project)}
    </p>
  )
}
