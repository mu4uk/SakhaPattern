import { useMemo, useState } from 'react'
import { useApp } from '../../context/AppContext'
import { downloadPng, downloadSvg, projectDataUrl } from '../../lib/exporter'
import { formatDate, formatTime } from '../../lib/utils'
import { Button, Icon, SectionHeading } from '../ui'

type SortMode = 'new' | 'old' | 'name'

export function SavedProjects() {
  const { projects, current, saveProject, openProject, deleteProject, navigate, notify } = useApp()
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortMode>('new')

  const visible = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('ru-RU')
    return projects
      .filter((project) => project.name.toLocaleLowerCase('ru-RU').includes(normalized))
      .sort((a, b) => {
        if (sort === 'name') return a.name.localeCompare(b.name, 'ru')
        const diff = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        return sort === 'new' ? diff : -diff
      })
  }, [projects, query, sort])

  const handlePng = async (id: string) => {
    const project = projects.find((item) => item.id === id)
    if (!project) return
    try {
      await downloadPng(project, { scale: 3 })
      notify('PNG скачан')
    } catch {
      notify('Не удалось скачать PNG', 'error')
    }
  }

  return (
    <div className="animate-fade-up mx-auto max-w-[1500px] px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow="Галерея"
          title="Сохранённые работы"
          description="Проекты хранятся в LocalStorage вашего браузера. Откройте работу, чтобы продолжить редактирование."
        />
        <Button
          onClick={() => {
            saveProject()
            navigate('gallery')
          }}
          icon={<Icon name="save" className="h-4 w-4" />}
        >
          Сохранить текущий
        </Button>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-white/70 p-4 shadow-card">
        <label className="relative min-w-[240px] flex-1">
          <Icon name="search" className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Поиск по названию работы…"
            className="w-full rounded-xl border border-line bg-parchment py-2.5 pl-10 pr-4 text-sm outline-none focus:border-terracotta"
          />
        </label>
        <select
          value={sort}
          onChange={(event) => setSort(event.target.value as SortMode)}
          aria-label="Сортировка"
          className="rounded-xl border border-line bg-parchment px-3 py-2.5 text-sm text-ink outline-none"
        >
          <option value="new">Сначала новые</option>
          <option value="old">Сначала старые</option>
          <option value="name">По названию</option>
        </select>
        <span className="text-xs text-muted">Работ: {visible.length}</span>
      </div>

      {visible.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-line bg-white/60 p-14 text-center">
          <Icon name="folder" className="mx-auto h-9 w-9 text-muted/60" />
          <h3 className="mt-3 font-display text-xl text-ink">Работ пока нет</h3>
          <p className="mt-2 text-sm text-muted">Создайте орнамент в конструкторе и сохраните его.</p>
          <Button className="mt-5" onClick={() => navigate('editor')}>
            Перейти в конструктор
          </Button>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((project) => {
            const isCurrent = project.id === current.id
            return (
              <article
                key={project.id}
                className="group overflow-hidden rounded-2xl border border-line bg-white shadow-card transition-all hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="relative flex aspect-square items-center justify-center bg-cream p-4">
                  <img
                    src={projectDataUrl(project)}
                    alt={`Предпросмотр работы ${project.name}`}
                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                  {isCurrent && (
                    <span className="absolute left-3 top-3 rounded-full bg-terracotta px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                      На холсте
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="truncate font-display text-lg text-ink" title={project.name}>
                    {project.name}
                  </h3>
                  <p className="mt-1 text-[11px] text-muted">
                    {formatDate(project.updatedAt)} · {formatTime(project.updatedAt)} · {project.elements.length} элементов
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Button size="sm" onClick={() => openProject(project.id)}>
                      Открыть
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => handlePng(project.id)}>
                      PNG
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => downloadSvg(project)}>
                      SVG
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      icon={<Icon name="trash" className="h-3.5 w-3.5" />}
                      onClick={() => {
                        if (window.confirm(`Удалить работу «${project.name}»?`)) deleteProject(project.id)
                      }}
                    >
                      Удалить
                    </Button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
