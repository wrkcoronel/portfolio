import { useAppRoute } from './hooks/useAppRoute'
import { useTheme } from './hooks/useTheme'
import {
  getProjectSlug,
  projectCatalog,
} from './features/projects/model/projectCatalog'
import { SiteLayout } from './layouts/SiteLayout'
import { HomePage } from './pages/HomePage'
import { ProjectDetailPage } from './pages/ProjectDetailPage'
import { ProjectsPage } from './pages/ProjectsPage'

function App() {
  const { theme: activeTheme, toggleTheme } = useTheme()
  const currentRoute = useAppRoute()
  const selectedProject = currentRoute.page === 'project-detail'
    ? projectCatalog.find((project) => getProjectSlug(project) === currentRoute.projectSlug) ?? null
    : null

  return (
    <SiteLayout theme={activeTheme} onToggleTheme={toggleTheme}>
      {currentRoute.page === 'projects' ? <ProjectsPage /> : null}
      {currentRoute.page === 'project-detail' ? <ProjectDetailPage project={selectedProject} /> : null}
      {currentRoute.page === 'home' ? <HomePage /> : null}
    </SiteLayout>
  )
}

export default App
