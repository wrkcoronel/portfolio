import { FeaturedProjectsSection } from '../features/projects/components/FeaturedProjectsSection'

export function HomePage() {
  return (
    <main className="app-main app-main-home">
      <section id="home" className="app-section app-home-intro">
        <h2>Pedro Coronel</h2>
        <p className="app-copy">
          Desenvolvo sistemas internos, automacoes e estruturas de dados para melhorar a operacao e apoiar a tomada de decisao.
        </p>
        <p className="app-copy">
          Organizo informacoes, conecto bases e crio processos para transformar dados do dia a dia em visao clara para analise e acompanhamento.
        </p>
        <p className="app-copy">
          Ja estruturei controles de entregas de clientes em Google Sheets e Excel para uso de diferentes areas, com foco em organizacao, padronizacao e confiabilidade.
        </p>
        <p className="app-copy">
          Tambem desenvolvo rotinas para acompanhar produtividade, volumes, entregas e indicadores ao longo do tempo, alimentando paineis e analises em BI.
        </p>
      </section>

      <FeaturedProjectsSection />
    </main>
  )
}
