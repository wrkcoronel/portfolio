import { useEffect, useState } from 'react'

export type AppRoute =
  | { page: 'home' }
  | { page: 'projects' }
  | { page: 'project-detail'; projectSlug: string }

function getRouteFromHash(): AppRoute {
  const currentHash = window.location.hash

  if (currentHash === '#/projetos') {
    return { page: 'projects' }
  }

  if (currentHash.startsWith('#/projetos/')) {
    const projectSlug = currentHash.replace('#/projetos/', '').trim()

    if (projectSlug) {
      return { page: 'project-detail', projectSlug }
    }
  }

  return { page: 'home' }
}

export function useAppRoute() {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(getRouteFromHash)

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(getRouteFromHash())
      window.scrollTo({ top: 0, behavior: 'auto' })
    }

    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  return currentRoute
}
