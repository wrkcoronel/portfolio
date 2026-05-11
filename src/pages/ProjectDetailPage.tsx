import { GithubReadmePanel } from '../features/projects/components/GithubReadmePanel'
import type { ProjectSummary } from '../features/projects/model/projectCatalog'
import { useGithubReadme } from '../features/projects/hooks/useGithubReadme'

type ProjectDetailPageProps = {
  project: ProjectSummary | null
}

export function ProjectDetailPage({ project }: ProjectDetailPageProps) {
  const readmeState = useGithubReadme(
    project?.githubRepository ?? null,
    Boolean(project?.githubRepository),
  )

  if (!project) {
    return (
      <main className="app-main app-main-compact">
        <section className="app-section app-projects-page">
          <p className="projects-empty">Projeto nao encontrado.</p>
        </section>
      </main>
    )
  }

  return (
    <main className="app-main app-main-compact">
      <section className="app-section app-projects-page">
        <div className="project-detail-actions">
          {project.githubRepository ? (
            <a
              className="projects-repository-link"
              href={`https://github.com/${project.githubRepository.owner}/${project.githubRepository.name}`}
              target="_blank"
              rel="noreferrer"
            >
              Ver repositorio
            </a>
          ) : null}
        </div>

        {project.githubRepository ? (
          <GithubReadmePanel
            content={readmeState.content}
            errorMessage={readmeState.errorMessage}
            isLoading={readmeState.isLoading}
            readmePath={readmeState.readmePath}
            repository={readmeState.repository}
          />
        ) : (
          <p className="projects-empty">Este projeto ainda nao tem README conectado.</p>
        )}
      </section>
    </main>
  )
}
