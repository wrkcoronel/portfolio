import {
  getProjectTitle,
  type ProjectSummary,
} from '../model/projectCatalog'

type ProjectTitleTextProps = {
  className?: string
  project: ProjectSummary
}

export function ProjectTitleText({ className, project }: ProjectTitleTextProps) {
  return (
    <span className={className}>
      {getProjectTitle(project)}
    </span>
  )
}
