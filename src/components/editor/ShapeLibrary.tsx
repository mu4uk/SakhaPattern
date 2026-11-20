import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { getPalette } from '../../data/palettes'
import { SHAPE_LIST, motifMarkup } from '../../lib/shapes'
import { cx } from '../../lib/utils'
import type { ShapeDefinition } from '../../lib/shapes'
import { Icon, Panel, Segmented } from '../ui'

type FamilyFilter = 'Все' | ShapeDefinition['family']

const FAMILIES: FamilyFilter[] = [
  'Все',
  'Геометрия',
  'Симметрия',
  'Линия',
  'Композиция',
  'Растительный',
  'Зооморфный',
  'Кайма',
]

export function ShapeLibrary() {
  const { addElement, current } = useApp()
  const [family, setFamily] = useState<FamilyFilter>('Все')
  const palette = getPalette(current.generator.paletteId)
  const shapes = SHAPE_LIST.filter((shape) => family === 'Все' || shape.family === family)

  return (
    <Panel
      title="Библиотека элементов"
      subtitle="Нажмите на мотив, чтобы добавить его на холст. Есть растительные, зооморфные мотивы и кайма."
      actions={<Icon name="grid" className="h-4 w-4 text-terracotta" />}
    >
      <Segmented
        options={FAMILIES.map((value) => ({ value, label: value }))}
        value={family}
        onChange={setFamily}
        className="mb-4"
      />
      <div className="grid max-h-[290px] grid-cols-4 gap-2 overflow-y-auto pr-1">
        {shapes.map((shape) => (
          <button
            key={shape.id}
            type="button"
            title={`${shape.title} — добавить на холст`}
            onClick={() => addElement(shape.id)}
            className={cx(
              'group flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border border-line bg-parchment p-1.5 transition-all hover:-translate-y-0.5 hover:border-terracotta hover:bg-white hover:shadow-card',
            )}
          >
            <span
              className="h-9 w-9 transition-transform group-hover:scale-110"
              dangerouslySetInnerHTML={{
                __html: `<svg viewBox="-50 -50 100 100" class="h-9 w-9">${motifMarkup(shape.id, palette.colors[0], palette.accent)}</svg>`,
              }}
            />
            <span className="line-clamp-2 text-center text-[9px] leading-tight text-muted group-hover:text-ink">
              {shape.title}
            </span>
          </button>
        ))}
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-muted">
        Рисунки — учебные реконструкции по описаниям мотивов из научных публикаций, а не копии конкретных предметов.
      </p>
    </Panel>
  )
}
