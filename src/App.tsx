import { useEffect, useState } from 'react'
import darkIcon from './assets/dark.png'

const THEME_STORAGE_KEY = 'theme-preference'

function getSystemTheme(): 'dark' | 'light' {
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function getInitialTheme(): 'dark' | 'light' {
  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)

  if (storedTheme === 'dark' || storedTheme === 'light') {
    return storedTheme
  }

  return getSystemTheme()
}

type HeaderProps = {
  onToggleTheme: () => void
}

function Header({ onToggleTheme }: HeaderProps) {
  return (
    <header className="app-header">
      <h1>wrkcoronel</h1>
      <nav className="app-nav">
        <ul>
          <li>
            <a href="#home">Home</a>
          </li>
          <li>
            <a href="#projetos">Projetos</a>
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

function Main() {
  return (
    <main className="app-main">
      
      <section id="home" className="app-section">
        <h2>Pedro Coronel</h2>
        <p>Desenvolvedor focado em sistemas, automações e soluções operacionais.
        <br></br>Construo ferramentas para otimizar processos e resolver problemas reais dentro de empresas.
        <br></br>Projetos voltados para eficiência, controle e produtividade.</p>
      </section>
    </main>
  )
} 

function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(getInitialTheme)

  const toggleTheme = () => {
    setTheme((current) => {
      const nextTheme = current === 'dark' ? 'light' : 'dark'
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
      return nextTheme
    })
  }

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)

    if (storedTheme === 'dark' || storedTheme === 'light') {
      return
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)')
    const handleChange = () => {
      setTheme(mediaQuery.matches ? 'light' : 'dark')
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return (
    <div className="app" data-theme={theme}>
      <Header onToggleTheme={toggleTheme} />
      <Main />
    </div>
  )
}

export default App
