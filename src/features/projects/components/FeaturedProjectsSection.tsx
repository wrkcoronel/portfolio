import { getProjectSlug, projectCatalog } from '../model/projectCatalog'
import { ProjectCard } from './ProjectCard'

const FEATURED_PROJECTS_LIMIT = 4

export function FeaturedProjectsSection() {
  const featuredProjects = projectCatalog.slice(0, FEATURED_PROJECTS_LIMIT)
  const featuredProjectsCount = featuredProjects.length

  return (
    <section id="projetos" className="app-section app-projects">
      <div className="projects-header">
        <div className="projects-heading">
          <h2>Projetos</h2>
          <p>Projetos voltados para automacao, dados e melhoria de processos.</p>
        </div>

        <a className="projects-toggle" href="#/projetos">Ver todos</a>
      </div>

      <div
        className="projects-square"
        data-count={featuredProjectsCount}
        aria-label="Lista de projetos"
      >
        {featuredProjects.map((project) => (
          <ProjectCard key={getProjectSlug(project)} project={project} />
        ))}
      </div>
    </section>
  )
}
