import { useEffect, useState } from 'react'
import type { GitHubProjectRepository } from '../model/projectCatalog'

type GithubReadmeState = {
  content: string | null
  errorMessage: string | null
  isLoading: boolean
  readmePath: string | null
  repository: GitHubProjectRepository | null
}

const readmeCache = new Map<string, string>()
const readmeRequestCache = new Map<string, Promise<string>>()

function getRepositoryCacheKey(repository: GitHubProjectRepository) {
  return `${repository.owner}/${repository.name}`.toLowerCase()
}

async function fetchRawReadmeContent(repository: GitHubProjectRepository) {
  const cacheKey = getRepositoryCacheKey(repository)
  const cachedReadme = readmeCache.get(cacheKey)

  if (cachedReadme) {
    return cachedReadme
  }

  const existingRequest = readmeRequestCache.get(cacheKey)
  if (existingRequest) {
    return existingRequest
  }

  const request = (async () => {
    const response = await fetch(
      `https://raw.githubusercontent.com/${repository.owner}/${repository.name}/HEAD/README.md`,
    )

    if (!response.ok) {
      throw new Error(`GitHub raw README request failed with status ${response.status}`)
    }

    const readmeContent = await response.text()
    readmeCache.set(cacheKey, readmeContent)
    return readmeContent
  })()

  readmeRequestCache.set(cacheKey, request)

  try {
    return await request
  } finally {
    readmeRequestCache.delete(cacheKey)
  }
}

export function useGithubReadme(
  repository: GitHubProjectRepository | null,
  shouldFetch: boolean,
) {
  const [readmeState, setReadmeState] = useState<GithubReadmeState>({
    content: null,
    errorMessage: null,
    isLoading: false,
    readmePath: null,
    repository,
  })

  useEffect(() => {
    if (!repository || !shouldFetch) {
      return
    }

    const activeRepository = repository
    let isCancelled = false

    async function loadReadme() {
      setReadmeState((currentState) => {
        const isSameRepository = currentState.repository?.owner === activeRepository.owner
          && currentState.repository?.name === activeRepository.name

        if (currentState.content && isSameRepository) {
          return currentState
        }

        return {
          content: null,
          errorMessage: null,
          isLoading: true,
          readmePath: null,
          repository: activeRepository,
        }
      })

      try {
        const readmeContent = await fetchRawReadmeContent(activeRepository)

        if (!isCancelled) {
          setReadmeState({
            content: readmeContent,
            errorMessage: null,
            isLoading: false,
            readmePath: 'README.md',
            repository: activeRepository,
          })
        }
      } catch (error) {
        console.error(
          `[projects] Failed to load README for ${activeRepository.owner}/${activeRepository.name}`,
          error,
        )

        if (!isCancelled) {
          setReadmeState({
            content: null,
            errorMessage: 'Nao foi possivel carregar o README deste repositorio agora.',
            isLoading: false,
            readmePath: null,
            repository: activeRepository,
          })
        }
      }
    }

    void loadReadme()

    return () => {
      isCancelled = true
    }
  }, [repository, shouldFetch])

  return readmeState
}
