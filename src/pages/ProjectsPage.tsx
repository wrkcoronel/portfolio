import { useDeferredValue, useState } from 'react'
import { ProjectResultsList } from '../features/projects/components/ProjectResultsList'
import { ProjectSearchField } from '../features/projects/components/ProjectSearchField'
import { projectCatalog } from '../features/projects/model/projectCatalog'
import { filterProjectsBySearchTerm } from '../features/projects/utils/filterProjectsBySearchTerm'

export function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const deferredSearchTerm = useDeferredValue(searchTerm)
  const visibleProjects = filterProjectsBySearchTerm(projectCatalog, deferredSearchTerm)

  return (
    <main className="app-main app-main-compact">
      <section className="app-section app-projects-page">
        <div className="projects-heading">
          <h2>Projetos</h2>
          <p>Selecao completa de projetos, experimentos e ferramentas operacionais.</p>
        </div>

        <ProjectSearchField value={searchTerm} onChange={setSearchTerm} />
        <ProjectResultsList projects={visibleProjects} />

        {visibleProjects.length === 0 ? (
          <p className="projects-empty">Nenhum projeto encontrado para essa busca.</p>
        ) : null}
      </section>
    </main>
  )
}
