import type { GitHubProjectRepository } from '../model/projectCatalog'
import { MarkdownRenderer } from './MarkdownRenderer'

type GithubReadmePanelProps = {
  content: string | null
  errorMessage: string | null
  isLoading: boolean
  readmePath: string | null
  repository: GitHubProjectRepository | null
}

export function GithubReadmePanel({
  content,
  errorMessage,
  isLoading,
  readmePath,
  repository,
}: GithubReadmePanelProps) {
  return (
    <section className="github-readme-panel" aria-live="polite">
      {isLoading ? <p>Carregando README...</p> : null}
      {errorMessage ? <p>{errorMessage}</p> : null}
      {content ? (
        <MarkdownRenderer
          content={content}
          readmePath={readmePath}
          repository={repository}
        />
      ) : null}
    </section>
  )
}
