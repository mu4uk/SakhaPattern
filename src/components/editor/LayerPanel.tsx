import { useApp } from '../../context/AppContext'
import { SHAPES } from '../../lib/shapes'
import { cx } from '../../lib/utils'
import { Icon, Panel } from '../ui'

export function LayerPanel() {
  const { current, selectedId, selectElement, deleteElement } = useApp()
  const items = [...current.elements].reverse()

  return (
    <Panel
      title="Слои композиции"
      subtitle={`Всего элементов: ${current.elements.length}`}
      actions={<Icon name="sliders" className="h-4 w-4 text-terracotta" />}
    >
      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line bg-parchment/60 p-6 text-center text-xs text-muted">
          Холст пуст. Добавьте мотив из библиотеки или сгенерируйте узор.
        </div>
      ) : (
        <div className="max-h-[220px] space-y-1 overflow-y-auto pr-1">
          {items.map((element, index) => (
            <div
              key={element.id}
              className={cx(
                'flex items-center gap-2 rounded-lg border px-2.5 py-1.5 transition-colors',
                selectedId === element.id
                  ? 'border-terracotta bg-terracotta/5'
                  : 'border-transparent hover:border-line hover:bg-parchment',
              )}
            >
              <button
                type="button"
                onClick={() => selectElement(element.id)}
                className="flex min-w-0 flex-1 items-center gap-2 text-left"
              >
                <span
                  className="h-3.5 w-3.5 shrink-0 rounded-full border border-white shadow-sm"
                  style={{ backgroundColor: element.color }}
                />
                <span className="truncate text-xs text-ink">
                  {SHAPES[element.shapeId]?.title ?? element.shapeId}
                </span>
                <span className="ml-auto text-[10px] text-muted">#{items.length - index}</span>
              </button>
              <button
                type="button"
                onClick={() => deleteElement(element.id)}
                aria-label="Удалить слой"
                className="grid h-6 w-6 place-items-center rounded text-muted transition hover:bg-wine/10 hover:text-wine"
              >
                <Icon name="trash" className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </Panel>
  )
}
