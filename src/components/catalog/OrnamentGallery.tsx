import { useMemo, useState } from 'react'
import { useApp } from '../../context/AppContext'
import { ORNAMENTS, ORNAMENT_CATEGORIES } from '../../data/ornaments'
import { getPalette } from '../../data/palettes'
import type { CanvasElement, OrnamentItem } from '../../types'
import { Button, Icon, MotifPreview, SectionHeading, Segmented } from '../ui'

function previewFor(item: OrnamentItem): CanvasElement[] {
  const palette = getPalette(item.paletteId)
  return [
    {
      id: `preview-${item.id}`,
      shapeId: item.shapeId,
      x: 300,
      y: 300,
      size: 300,
      rotation: 0,
      color: palette.colors[0],
      accent: palette.accent,
      opacity: 1,
      flipX: false,
      flipY: false,
    },
  ]
}

export function OrnamentGallery() {
  const { navigate, addElement, updateGenerator, regenerate, current } = useApp()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<(typeof ORNAMENT_CATEGORIES)[number]>('Все')

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('ru-RU')
    return ORNAMENTS.filter((item) => {
      const matchesCategory = category === 'Все' || item.category === category
      const haystack = [item.title, item.description, item.category, ...item.tags]
        .join(' ')
        .toLocaleLowerCase('ru-RU')
      return matchesCategory && (!normalized || haystack.includes(normalized))
    })
  }, [query, category])

  const useInGenerator = (item: OrnamentItem) => {
    const settings = { ...current.generator, shapeId: item.shapeId, paletteId: item.paletteId }
    updateGenerator({ shapeId: item.shapeId, paletteId: item.paletteId })
    regenerate(settings)
    navigate('editor')
  }

  return (
    <div className="animate-fade-up">
      <div className="mx-auto max-w-[1500px] px-4 py-12 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Каталог"
          title="Библиотека орнаментальных мотивов"
          description="Каталог включает геометрические, растительные и зооморфные мотивы, описанные в научной литературе. Рисунки — учебные реконструкции по описаниям, а не копии музейных предметов; символика не приписывается."
        />

        <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-line bg-white/70 p-4 shadow-card lg:flex-row lg:items-center">
          <label className="relative flex-1">
            <Icon name="search" className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Поиск по названию, категории или тегу…"
              className="w-full rounded-xl border border-line bg-parchment py-2.5 pl-10 pr-4 text-sm text-ink outline-none transition focus:border-terracotta focus:ring-4 focus:ring-terracotta/10"
            />
          </label>
          <Segmented
            options={ORNAMENT_CATEGORIES.map((value) => ({ value, label: value }))}
            value={category}
            onChange={setCategory}
          />
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-muted">
          <span>Найдено мотивов: {filtered.length}</span>
          <span className="hidden sm:inline">
            Добавить новые мотивы можно в файле <code className="rounded bg-sand px-1.5 py-0.5">src/data/ornaments.ts</code>
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-line bg-white/60 p-12 text-center">
            <Icon name="search" className="mx-auto h-8 w-8 text-muted/60" />
            <p className="mt-3 font-display text-lg text-ink">Ничего не найдено</p>
            <p className="mt-1 text-sm text-muted">Попробуйте изменить запрос или категорию.</p>
            <Button
              variant="secondary"
              size="sm"
              className="mt-4"
              onClick={() => {
                setQuery('')
                setCategory('Все')
              }}
            >
              Сбросить фильтры
            </Button>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((item) => {
              const palette = getPalette(item.paletteId)
              return (
                <article
                  key={item.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
                >
                  <div className="relative flex h-52 items-center justify-center bg-cream p-6">
                    <div className="absolute inset-0 opacity-[0.5] [background-image:linear-gradient(#E7DAC7_1px,transparent_1px),linear-gradient(90deg,#E7DAC7_1px,transparent_1px)] [background-size:28px_28px]" />
                    <MotifPreview elements={previewFor(item)} className="relative transition-transform duration-500 group-hover:scale-110" />
                    <span className="absolute left-3 top-3 rounded-full bg-ink/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-cream">
                      {item.category}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-xl text-ink">{item.title}</h3>
                      <div className="flex shrink-0 gap-1">
                        {palette.colors.slice(0, 4).map((color) => (
                          <span
                            key={color}
                            className="h-4 w-4 rounded-full border border-white shadow-sm"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
                    <p className="mt-3 flex items-start gap-2 rounded-lg bg-sand/60 p-2.5 text-[11px] leading-relaxed text-ink/70">
                      <Icon name="info" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-terracotta" />
                      {item.interpretationNote}
                    </p>
                    {item.source && (
                      <p className="mt-2 text-[11px] leading-relaxed text-muted/90">
                        <span className="font-semibold text-ink/70">Источник описания: </span>
                        {item.source}
                      </p>
                    )}
                    <p className="mt-3 text-xs text-muted">
                      <span className="font-semibold text-ink/80">Применение: </span>
                      {item.exampleUsage}
                    </p>
                    <div className="mt-auto flex flex-wrap gap-2 pt-5">
                      <Button
                        size="sm"
                        icon={<Icon name="plus" className="h-3.5 w-3.5" />}
                        onClick={() => {
                          addElement(item.shapeId)
                          navigate('editor')
                        }}
                      >
                        Добавить на холст
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => useInGenerator(item)}>
                        В генератор
                      </Button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
