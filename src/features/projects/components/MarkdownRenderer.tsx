import { Fragment } from 'react'
import type { GitHubProjectRepository } from '../model/projectCatalog'

type MarkdownRendererProps = {
  content: string
  readmePath: string | null
  repository: GitHubProjectRepository | null
}

type MarkdownBlock =
  | { type: 'heading'; level: 1 | 2 | 3; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'unordered-list'; items: string[] }
  | { type: 'ordered-list'; items: string[] }
  | { type: 'code-block'; code: string }
  | { type: 'image'; alt: string; src: string }
  | { type: 'html-image'; alt: string; src: string; centered: boolean }

function parseMarkdownBlocks(markdownContent: string): MarkdownBlock[] {
  const lines = markdownContent.replace(/\r\n/g, '\n').split('\n')
  const blocks: MarkdownBlock[] = []

  let currentParagraph: string[] = []
  let currentList: { type: 'unordered-list' | 'ordered-list'; items: string[] } | null = null
  let currentCodeBlock: string[] | null = null
  let currentHtmlImageContainer: { centered: boolean } | null = null

  function flushParagraph() {
    if (currentParagraph.length === 0) {
      return
    }

    blocks.push({
      type: 'paragraph',
      text: currentParagraph.join(' ').trim(),
    })
    currentParagraph = []
  }

  function flushList() {
    if (!currentList) {
      return
    }

    blocks.push(currentList)
    currentList = null
  }

  function flushCodeBlock() {
    if (!currentCodeBlock) {
      return
    }

    blocks.push({
      type: 'code-block',
      code: currentCodeBlock.join('\n'),
    })
    currentCodeBlock = null
  }

  for (const line of lines) {
    const trimmedLine = line.trim()

    if (trimmedLine.startsWith('```')) {
      flushParagraph()
      flushList()

      if (currentCodeBlock) {
        flushCodeBlock()
      } else {
        currentCodeBlock = []
      }
      continue
    }

    if (currentCodeBlock) {
      currentCodeBlock.push(line)
      continue
    }

    if (!trimmedLine) {
      flushParagraph()
      flushList()
      continue
    }

    const centeredParagraphMatch = trimmedLine.match(/^<p[^>]*align=["']center["'][^>]*>$/i)
    if (centeredParagraphMatch) {
      flushParagraph()
      flushList()
      currentHtmlImageContainer = { centered: true }
      continue
    }

    if (/^<\/p>$/i.test(trimmedLine)) {
      currentHtmlImageContainer = null
      continue
    }

    const headingMatch = trimmedLine.match(/^(#{1,3})\s+(.*)$/)
    if (headingMatch) {
      flushParagraph()
      flushList()

      blocks.push({
        type: 'heading',
        level: headingMatch[1].length as 1 | 2 | 3,
        text: headingMatch[2].trim(),
      })
      continue
    }

    const imageMatch = trimmedLine.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
    if (imageMatch) {
      flushParagraph()
      flushList()

      blocks.push({
        type: 'image',
        alt: imageMatch[1].trim(),
        src: imageMatch[2].trim(),
      })
      continue
    }

    const htmlImageTagMatch = trimmedLine.match(/^<img\s+[^>]*>$/i)

    if (htmlImageTagMatch) {
      flushParagraph()
      flushList()

      const srcMatch = trimmedLine.match(/\bsrc=["']([^"']+)["']/i)
      const altMatch = trimmedLine.match(/\balt=["']([^"']*)["']/i)

      if (!srcMatch) {
        continue
      }

      blocks.push({
        type: 'html-image',
        src: srcMatch[1].trim(),
        alt: altMatch?.[1].trim() ?? '',
        centered: currentHtmlImageContainer?.centered ?? false,
      })
      continue
    }

    const unorderedListMatch = trimmedLine.match(/^[-*]\s+(.*)$/)
    if (unorderedListMatch) {
      flushParagraph()

      if (!currentList || currentList.type !== 'unordered-list') {
        flushList()
        currentList = { type: 'unordered-list', items: [] }
      }

      currentList.items.push(unorderedListMatch[1].trim())
      continue
    }

    const orderedListMatch = trimmedLine.match(/^\d+\.\s+(.*)$/)
    if (orderedListMatch) {
      flushParagraph()

      if (!currentList || currentList.type !== 'ordered-list') {
        flushList()
        currentList = { type: 'ordered-list', items: [] }
      }

      currentList.items.push(orderedListMatch[1].trim())
      continue
    }

    flushList()
    currentParagraph.push(trimmedLine)
  }

  flushParagraph()
  flushList()
  flushCodeBlock()

  return blocks
}

function resolveMarkdownUrl(
  sourceUrl: string,
  repository: GitHubProjectRepository | null,
  readmePath: string | null,
  mode: 'link' | 'image',
) {
  if (/^https?:\/\//i.test(sourceUrl)) {
    return sourceUrl
  }

  if (!repository) {
    return sourceUrl
  }

  const normalizedSource = sourceUrl.replace(/^\.?\//, '')
  const readmeDirectory = readmePath?.includes('/')
    ? readmePath.slice(0, readmePath.lastIndexOf('/') + 1)
    : ''
  const absolutePath = sourceUrl.startsWith('/')
    ? sourceUrl.slice(1)
    : `${readmeDirectory}${normalizedSource}`

  if (mode === 'image') {
    return `https://raw.githubusercontent.com/${repository.owner}/${repository.name}/HEAD/${absolutePath}`
  }

  return `https://github.com/${repository.owner}/${repository.name}/blob/HEAD/${absolutePath}`
}

function renderInlineMarkdown(
  text: string,
  repository: GitHubProjectRepository | null,
  readmePath: string | null,
) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|!\[[^\]]*\]\([^)]+\)|\[[^\]]+\]\([^)]+\))/g)

  return parts
    .filter(Boolean)
    .map((part, index) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={`${part}-${index}`}>{part.slice(1, -1)}</code>
      }

      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>
      }

      const imageMatch = part.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
      if (imageMatch) {
        return (
          <img
            key={`${part}-${index}`}
            className="markdown-inline-image"
            src={resolveMarkdownUrl(imageMatch[2], repository, readmePath, 'image')}
            alt={imageMatch[1]}
          />
        )
      }

      const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
      if (linkMatch) {
        return (
          <a
            key={`${part}-${index}`}
            href={resolveMarkdownUrl(linkMatch[2], repository, readmePath, 'link')}
            target="_blank"
            rel="noreferrer"
          >
            {linkMatch[1]}
          </a>
        )
      }

      return <Fragment key={`${part}-${index}`}>{part}</Fragment>
    })
}

export function MarkdownRenderer({ content, readmePath, repository }: MarkdownRendererProps) {
  const blocks = parseMarkdownBlocks(content)

  return (
    <div className="markdown-renderer">
      {blocks.map((block, index) => {
        if (block.type === 'heading') {
          if (block.level === 1) {
            return <h1 key={index}>{renderInlineMarkdown(block.text, repository, readmePath)}</h1>
          }

          if (block.level === 2) {
            return <h2 key={index}>{renderInlineMarkdown(block.text, repository, readmePath)}</h2>
          }

          return <h3 key={index}>{renderInlineMarkdown(block.text, repository, readmePath)}</h3>
        }

        if (block.type === 'unordered-list') {
          return (
            <ul key={index}>
              {block.items.map((item, itemIndex) => (
                <li key={`${item}-${itemIndex}`}>{renderInlineMarkdown(item, repository, readmePath)}</li>
              ))}
            </ul>
          )
        }

        if (block.type === 'ordered-list') {
          return (
            <ol key={index}>
              {block.items.map((item, itemIndex) => (
                <li key={`${item}-${itemIndex}`}>{renderInlineMarkdown(item, repository, readmePath)}</li>
              ))}
            </ol>
          )
        }

        if (block.type === 'image') {
          return (
            <img
              key={index}
              className="markdown-block-image"
              src={resolveMarkdownUrl(block.src, repository, readmePath, 'image')}
              alt={block.alt}
            />
          )
        }

        if (block.type === 'html-image') {
          return (
            <div
              key={index}
              className={block.centered ? 'markdown-image-frame markdown-image-frame-centered' : 'markdown-image-frame'}
            >
              <img
                className="markdown-block-image"
                src={resolveMarkdownUrl(block.src, repository, readmePath, 'image')}
                alt={block.alt}
              />
            </div>
          )
        }

        if (block.type === 'code-block') {
          return (
            <pre key={index} className="markdown-code-block">
              <code>{block.code}</code>
            </pre>
          )
        }

        return <p key={index}>{renderInlineMarkdown(block.text, repository, readmePath)}</p>
      })}
    </div>
  )
}
