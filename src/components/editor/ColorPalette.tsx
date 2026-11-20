import { useApp } from '../../context/AppContext'
import { PALETTES } from '../../data/palettes'
import { cx } from '../../lib/utils'
import { Icon, Panel, Slider } from '../ui'

export function ColorPalette() {
  const { current, selectedId, updateElement, updateGenerator, autoApply } = useApp()
  const selected = current.elements.find((element) => element.id === selectedId) ?? null

  const choosePalette = (id: string) => {
    const palette = PALETTES.find((item) => item.id === id)
    if (!palette) return
    if (!autoApply) {
      current.elements.forEach((element, index) => {
        updateElement(element.id, {
          color: palette.colors[index % palette.colors.length],
          accent: palette.accent,
        })
      })
    }
    updateGenerator({ paletteId: id })
  }

  return (
    <Panel
      title="Цвет и палитра"
      subtitle="Палитра применяется ко всей композиции, цвет — к выбранному элементу."
      actions={<Icon name="palette" className="h-4 w-4 text-terracotta" />}
    >
      <div className="space-y-2">
        {PALETTES.map((palette) => (
          <button
            key={palette.id}
            type="button"
            title={palette.note}
            onClick={() => choosePalette(palette.id)}
            className={cx(
              'flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition-all',
              current.generator.paletteId === palette.id
                ? 'border-terracotta bg-terracotta/5 shadow-sm'
                : 'border-line bg-parchment hover:border-terracotta/50 hover:bg-white',
            )}
          >
            <span className="flex -space-x-1.5">
              {palette.colors.map((color) => (
                <span
                  key={color}
                  className="h-5 w-5 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: color }}
                />
              ))}
            </span>
            <span className="flex-1 text-xs font-medium text-ink">{palette.name}</span>
            {current.generator.paletteId === palette.id && (
              <Icon name="check" className="h-4 w-4 text-terracotta" />
            )}
          </button>
        ))}
      </div>

      <div className="mt-5 border-t border-line pt-4">
        {selected ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-ink/80">Основной цвет</span>
                <span className="flex items-center gap-2 rounded-lg border border-line bg-parchment p-1.5">
                  <input
                    type="color"
                    value={selected.color}
                    onChange={(event) => updateElement(selected.id, { color: event.target.value })}
                    className="h-7 w-9 cursor-pointer rounded border-0 bg-transparent p-0"
                    aria-label="Основной цвет элемента"
                  />
                  <span className="font-mono text-[10px] uppercase text-muted">{selected.color}</span>
                </span>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-ink/80">Цвет акцента</span>
                <span className="flex items-center gap-2 rounded-lg border border-line bg-parchment p-1.5">
                  <input
                    type="color"
                    value={selected.accent}
                    onChange={(event) => updateElement(selected.id, { accent: event.target.value })}
                    className="h-7 w-9 cursor-pointer rounded border-0 bg-transparent p-0"
                    aria-label="Цвет акцента элемента"
                  />
                  <span className="font-mono text-[10px] uppercase text-muted">{selected.accent}</span>
                </span>
              </label>
            </div>
            <Slider
              label="Размер элемента"
              value={Math.round(selected.size)}
              min={12}
              max={320}
              onChange={(size) => updateElement(selected.id, { size })}
            />
            <Slider
              label="Поворот"
              value={Math.round(selected.rotation)}
              min={-180}
              max={180}
              onChange={(rotation) => updateElement(selected.id, { rotation })}
              suffix="°"
            />
            <Slider
              label="Прозрачность"
              value={Math.round(selected.opacity * 100)}
              min={10}
              max={100}
              onChange={(opacity) => updateElement(selected.id, { opacity: opacity / 100 })}
              suffix="%"
            />
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-line bg-parchment/60 p-4 text-center text-xs leading-relaxed text-muted">
            <Icon name="info" className="mx-auto mb-2 h-4 w-4 text-terracotta" />
            Выберите элемент на холсте, чтобы менять его цвет, размер, поворот и прозрачность.
          </div>
        )}
      </div>
    </Panel>
  )
}
