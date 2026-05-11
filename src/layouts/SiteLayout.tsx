import type { ReactNode } from 'react'
import { SiteHeader } from './SiteHeader'

type SiteLayoutProps = {
  children: ReactNode
  onToggleTheme: () => void
  theme: 'dark' | 'light'
}

export function SiteLayout({ children, onToggleTheme, theme }: SiteLayoutProps) {
  return (
    <div id="top" className="app" data-theme={theme}>
      <SiteHeader onToggleTheme={onToggleTheme} />
      {children}
    </div>
  )
}
