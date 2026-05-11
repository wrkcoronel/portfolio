# wrkcoronel portfolio

Portfolio pessoal em React + Vite com layout minimalista, listagem de projetos e leitura de `README.md` direto do GitHub na página de detalhe.

## Stack

- React 19
- TypeScript
- Vite
- CSS modularizado por responsabilidade

## Funcionalidades

- Home com seção de projetos em destaque
- Página de projetos com busca local
- Página de detalhe com renderização de `README.md`
- Tema claro/escuro
- Deploy configurado para GitHub Pages em `docs/`

## Estrutura

```text
src/
  features/projects/   logica, componentes e hooks da feature de projetos
  hooks/               hooks globais da aplicacao
  layouts/             header e layout base
  pages/               telas principais
  styles/              css separado por dominio visual
```
