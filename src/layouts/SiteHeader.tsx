import darkIcon from '../assets/dark.png'

type SiteHeaderProps = {
  onToggleTheme: () => void
}

export function SiteHeader({ onToggleTheme }: SiteHeaderProps) {
  return (
    <header className="app-header">
      <h1>
        <a className="app-brand-link" href="#/">wrkcoronel</a>
      </h1>
      <nav className="app-nav">
        <ul>
          <li>
            <a href="#/">Home</a>
          </li>
          <li>
            <a href="#/projetos">Projetos</a>
          </li>
          <li>
            <a href="https://github.com/wrkcoronel" target="_blank" rel="noopener noreferrer">Github</a>
          </li>
          <li>
            <a href="https://www.linkedin.com/in/pedrogcoronel/" target="_blank" rel="noopener noreferrer">Linkedin</a>
          </li>
        </ul>
      </nav>
      <button
        type="button"
        className="app-theme-toggle"
        onClick={onToggleTheme}
        aria-label="Alternar tema do sistema"
      >
        <img src={darkIcon} alt="" aria-hidden="true" />
      </button>
    </header>
  )
}
