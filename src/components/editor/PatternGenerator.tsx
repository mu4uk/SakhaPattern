import { useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import { PALETTES } from '../../data/palettes'
import {
  DIRECTION_LABELS,
  SYMMETRY_LABELS,
  generatePattern,
} from '../../lib/patternGenerator'
import { SHAPE_LIST } from '../../lib/shapes'
import type { Direction, SymmetryMode } from '../../types'
import { Button, Icon, MotifPreview, Panel, Segmented, Slider } from '../ui'

const SYMMETRIES = Object.keys(SYMMETRY_LABELS) as SymmetryMode[]
const DIRECTIONS = Object.keys(DIRECTION_LABELS) as Direction[]

export function PatternGenerator() {
  const { current, updateGenerator, regenerate, randomize, autoApply, setAutoApply } = useApp()
  const settings = current.generator

  const preview = useMemo(
    () => generatePattern(settings, current.canvasSize),
    [settings, current.canvasSize],
  )

  return (
    <Panel
      title="Генератор орнаментов"
      subtitle="Настройте параметры — композиция обновится автоматически."
      actions={<Icon name="sparkles" className="h-4 w-4 text-terracotta" />}
    >
      <label className="flex cursor-pointer items-center justify-between rounded-xl border border-line bg-parchment px-3 py-2.5">
        <span className="flex items-center gap-2 text-xs font-medium text-ink">
          <Icon name="refresh" className="h-4 w-4 text-terracotta" />
          Автообновление холста
        </span>
        <input
          type="checkbox"
          checked={autoApply}
          onChange={(event) => setAutoApply(event.target.checked)}
          className="h-4 w-4 accent-[#B4543A]"
        />
      </label>

      <div className="mt-4">
        <p className="mb-2 text-xs font-semibold text-ink/80">Тип симметрии</p>
        <Segmented
          options={SYMMETRIES.map((value) => ({ value, label: SYMMETRY_LABELS[value] }))}
          value={settings.symmetry}
          onChange={(symmetry) => updateGenerator({ symmetry })}
        />
      </div>

      <div className="mt-4">
        <p className="mb-2 text-xs font-semibold text-ink/80">Направление композиции</p>
        <Segmented
          options={DIRECTIONS.map((value) => ({ value, label: DIRECTION_LABELS[value] }))}
          value={settings.direction}
          onChange={(direction) => updateGenerator({ direction })}
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-ink/80">Основная форма</span>
          <select
            value={settings.shapeId}
            onChange={(event) => updateGenerator({ shapeId: event.target.value as typeof settings.shapeId })}
            className="w-full rounded-lg border border-line bg-parchment px-2.5 py-2 text-xs text-ink outline-none focus:border-terracotta"
          >
            {SHAPE_LIST.map((shape) => (
              <option key={shape.id} value={shape.id}>
                {shape.title}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-ink/80">Палитра</span>
          <select
            value={settings.paletteId}
            onChange={(event) => updateGenerator({ paletteId: event.target.value })}
            className="w-full rounded-lg border border-line bg-parchment px-2.5 py-2 text-xs text-ink outline-none focus:border-terracotta"
          >
            {PALETTES.map((palette) => (
              <option key={palette.id} value={palette.id}>
                {palette.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-5 space-y-4">
        <Slider
          label="Количество повторений"
          value={settings.repeats}
          min={1}
          max={24}
          onChange={(repeats) => updateGenerator({ repeats })}
        />
        <Slider
          label="Размер мотива"
          value={settings.elementSize}
          min={20}
          max={140}
          onChange={(elementSize) => updateGenerator({ elementSize })}
        />
        <Slider
          label="Шаг поворота"
          value={settings.rotationStep}
          min={-30}
          max={30}
          onChange={(rotationStep) => updateGenerator({ rotationStep })}
          suffix="°"
        />
        <Slider
          label="Смещение интервала"
          value={Math.round(settings.spacing * 10)}
          min={-8}
          max={8}
          step={1}
          onChange={(spacing) => updateGenerator({ spacing: spacing / 10 })}
        />
        <Slider
          label="Вариативность размера"
          value={Math.round(settings.jitter * 100)}
          min={0}
          max={40}
          onChange={(jitter) => updateGenerator({ jitter: jitter / 100 })}
          suffix="%"
        />
      </div>

      <div className="mt-5 flex items-center gap-3 rounded-xl bg-sand/60 p-2.5">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-line bg-white">
          <MotifPreview elements={preview} />
        </div>
        <p className="text-[11px] leading-relaxed text-muted">
          Мини-предпросмотр рассчитан по тем же параметрам, что и большой холст.
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button size="sm" variant="secondary" onClick={() => regenerate()} icon={<Icon name="refresh" className="h-3.5 w-3.5" />}>
          Применить
        </Button>
        <Button size="sm" onClick={randomize} icon={<Icon name="sparkles" className="h-3.5 w-3.5" />}>
          Случайный вариант
        </Button>
      </div>
      {!autoApply && (
        <p className="mt-3 rounded-lg border border-gold/30 bg-gold/10 p-2.5 text-[11px] leading-relaxed text-ink/70">
          Автообновление выключено: вы редактировали холст вручную. Нажмите «Применить», чтобы заменить композицию сгенерированной.
        </p>
      )}
    </Panel>
  )
}
