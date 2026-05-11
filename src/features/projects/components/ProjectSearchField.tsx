type ProjectSearchFieldProps = {
  value: string
  onChange: (value: string) => void
}

export function ProjectSearchField({ value, onChange }: ProjectSearchFieldProps) {
  return (
    <label className="projects-search">
      <span>Buscar projeto</span>
      <input
        type="search"
        name="project-search"
        placeholder="Digite nome ou descricao"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}
