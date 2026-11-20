import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { useApp } from '../../context/AppContext'
import { backgroundValue, renderElementsMarkup } from '../../lib/exporter'
import type { CanvasElement } from '../../types'
import { clamp, cx } from '../../lib/utils'
import { Icon } from '../ui'

type DragMode = 'move' | 'resize' | 'rotate' | 'pan' | null

interface DragState {
  mode: DragMode
  id?: string
  start: { x: number; y: number }
  startClient: { x: number; y: number }
  initial: CanvasElement | null
  view: { x: number; y: number; zoom: number }
}

export function OrnamentCanvas() {
  const {
    current,
    selectedId,
    selectElement,
    updateElement,
    deleteSelected,
    duplicateSelected,
  } = useApp()
  const svgRef = useRef<SVGSVGElement>(null)
  const dragRef = useRef<DragState | null>(null)
  const [zoom, setZoom] = useState(1)
  const [view, setView] = useState({ x: 0, y: 0 })
  const [spacePressed, setSpacePressed] = useState(false)
  const size = current.canvasSize

  const toSvgPoint = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current
    if (!svg) return { x: 0, y: 0 }
    const point = svg.createSVGPoint()
    point.x = clientX
    point.y = clientY
    const matrix = svg.getScreenCTM()
    if (!matrix) return { x: 0, y: 0 }
    const transformed = point.matrixTransform(matrix.inverse())
    return { x: transformed.x, y: transformed.y }
  }, [])

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (event.code === 'Space' && !isTyping(event.target)) {
        event.preventDefault()
        setSpacePressed(true)
      }
    }
    const up = (event: KeyboardEvent) => {
      if (event.code === 'Space') setSpacePressed(false)
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (isTyping(event.target)) return
      if (event.key === 'Delete' || event.key === 'Backspace') {
        event.preventDefault()
        deleteSelected()
      } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'd') {
        event.preventDefault()
        duplicateSelected()
      } else if (event.key === 'Escape') {
        selectElement(null)
      } else if (selectedId && event.key.startsWith('Arrow')) {
        event.preventDefault()
        const element = current.elements.find((item) => item.id === selectedId)
        if (!element) return
        const step = event.shiftKey ? 10 : 2
        const delta: Record<string, { x: number; y: number }> = {
          ArrowLeft: { x: -step, y: 0 },
          ArrowRight: { x: step, y: 0 },
          ArrowUp: { x: 0, y: -step },
          ArrowDown: { x: 0, y: step },
        }
        const move = delta[event.key]
        if (move) updateElement(selectedId, { x: element.x + move.x, y: element.y + move.y })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [current.elements, selectedId, deleteSelected, duplicateSelected, selectElement, updateElement])

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      const point = toSvgPoint(event.clientX, event.clientY)
      const nextZoom = clamp(zoom * (event.deltaY < 0 ? 1.12 : 1 / 1.12), 0.4, 4)
      const ratio = zoom / nextZoom
      setView({
        x: point.x - (point.x - view.x) * ratio,
        y: point.y - (point.y - view.y) * ratio,
      })
      setZoom(nextZoom)
    }
    svg.addEventListener('wheel', onWheel, { passive: false })
    return () => svg.removeEventListener('wheel', onWheel)
  }, [toSvgPoint, view, zoom])

  const handlePointerDown = (event: ReactPointerEvent<SVGSVGElement>) => {
    const target = event.target as Element
    const handle = target.closest('[data-handle]')?.getAttribute('data-handle')
    const elementId = target.closest('[data-id]')?.getAttribute('data-id')
    const point = toSvgPoint(event.clientX, event.clientY)
    const startClient = { x: event.clientX, y: event.clientY }
    try {
      svgRef.current?.setPointerCapture(event.pointerId)
    } catch {
      // Некоторые браузеры не поддерживают захват для синтетических указателей.
    }

    if (handle === 'pan' || event.button === 1 || spacePressed) {
      dragRef.current = {
        mode: 'pan',
        start: point,
        startClient,
        initial: null,
        view: { ...view, zoom },
      }
      return
    }

    if (elementId && (handle === 'resize' || handle === 'rotate')) {
      const element = current.elements.find((item) => item.id === elementId) ?? null
      dragRef.current = {
        mode: handle,
        id: elementId,
        start: point,
        startClient,
        initial: element,
        view: { ...view, zoom },
      }
      return
    }

    if (elementId) {
      selectElement(elementId)
      const element = current.elements.find((item) => item.id === elementId) ?? null
      dragRef.current = {
        mode: 'move',
        id: elementId,
        start: point,
        startClient,
        initial: element,
        view: { ...view, zoom },
      }
      return
    }

    selectElement(null)
    dragRef.current = { mode: 'pan', start: point, startClient, initial: null, view: { ...view, zoom } }
  }

  const handlePointerMove = (event: ReactPointerEvent<SVGSVGElement>) => {
    const drag = dragRef.current
    if (!drag) return
    const point = toSvgPoint(event.clientX, event.clientY)

    if (drag.mode === 'pan') {
      const rect = svgRef.current?.getBoundingClientRect()
      if (!rect) return
      const ratio = size / zoom / rect.width
      setView({
        x: drag.view.x - (event.clientX - drag.startClient.x) * ratio,
        y: drag.view.y - (event.clientY - drag.startClient.y) * ratio,
      })
      return
    }

    if (!drag.id || !drag.initial) return
    const element = drag.initial

    if (drag.mode === 'move') {
      updateElement(drag.id, {
        x: element.x + (point.x - drag.start.x),
        y: element.y + (point.y - drag.start.y),
      })
    } else if (drag.mode === 'resize') {
      const startDistance = Math.hypot(drag.start.x - element.x, drag.start.y - element.y)
      const distance = Math.hypot(point.x - element.x, point.y - element.y)
      if (startDistance > 1) {
        updateElement(drag.id, { size: clamp(element.size * (distance / startDistance), 12, 320) })
      }
    } else if (drag.mode === 'rotate') {
      const angle = (Math.atan2(point.y - element.y, point.x - element.x) * 180) / Math.PI + 90
      updateElement(drag.id, { rotation: Math.round(angle) })
    }
  }

  const endDrag = (event: ReactPointerEvent<SVGSVGElement>) => {
    dragRef.current = null
    try {
      if (svgRef.current?.hasPointerCapture(event.pointerId)) {
        svgRef.current.releasePointerCapture(event.pointerId)
      }
    } catch {
      // Захват мог быть недоступен — это не влияет на результат редактирования.
    }
  }

  const selected = current.elements.find((element) => element.id === selectedId) ?? null
  const background = backgroundValue(current.background)
  const canvasFill = current.background === 'transparent' ? 'url(#checker)' : background

  return (
    <div className="relative h-full min-h-[420px] overflow-hidden rounded-2xl border border-line bg-[#EDE3D3] shadow-card">
      <svg
        ref={svgRef}
        viewBox={`${view.x} ${view.y} ${size / zoom} ${size / zoom}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className={cx('h-full w-full touch-none', spacePressed ? 'cursor-grab' : 'cursor-crosshair')}
        role="img"
        aria-label="Рабочая область конструктора орнаментов"
      >
        <defs>
          <pattern id="checker" width="24" height="24" patternUnits="userSpaceOnUse">
            <rect width="24" height="24" fill="#FFFFFF" />
            <rect width="12" height="12" fill="#F4ECDD" />
            <rect x="12" y="12" width="12" height="12" fill="#F4ECDD" />
          </pattern>
          <pattern id="grid-small" width="25" height="25" patternUnits="userSpaceOnUse">
            <path d="M25 0 H0 V25" fill="none" stroke="#E3D3B9" strokeWidth="0.8" />
          </pattern>
          <pattern id="grid-large" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="url(#grid-small)" />
            <path d="M100 0 H0 V100" fill="none" stroke="#D2BC98" strokeWidth="1.4" />
          </pattern>
        </defs>

        <rect x="-4000" y="-4000" width="9000" height="9000" fill="#EDE3D3" />
        <rect x="0" y="0" width={size} height={size} fill={canvasFill} />
        <rect x="0" y="0" width={size} height={size} fill="url(#grid-large)" opacity="0.75" />
        <rect
          x="0"
          y="0"
          width={size}
          height={size}
          fill="none"
          stroke="#C9AE82"
          strokeWidth="2"
          pointerEvents="none"
        />

        <g dangerouslySetInnerHTML={{ __html: renderElementsMarkup(current.elements, true) }} />

        {selected && (
          <g
            data-id={selected.id}
            transform={`translate(${selected.x} ${selected.y}) rotate(${selected.rotation})`}
          >
            <rect
              x={-selected.size / 2 - 4}
              y={-selected.size / 2 - 4}
              width={selected.size + 8}
              height={selected.size + 8}
              fill="none"
              stroke="#B4543A"
              strokeWidth="1.6"
              strokeDasharray="7 5"
              pointerEvents="none"
            />
            <line x1="0" y1={-selected.size / 2 - 4} x2="0" y2={-selected.size / 2 - 30} stroke="#2E211B" strokeWidth="2" pointerEvents="none" />
            <circle
              cx="0"
              cy={-selected.size / 2 - 34}
              r="9"
              fill="#FBF7F0"
              stroke="#2E211B"
              strokeWidth="2"
              data-handle="rotate"
              style={{ cursor: 'grab' }}
            />
            <circle
              cx={selected.size / 2 + 4}
              cy={selected.size / 2 + 4}
              r="9"
              fill="#B4543A"
              stroke="#FBF7F0"
              strokeWidth="2"
              data-handle="resize"
              style={{ cursor: 'nwse-resize' }}
            />
          </g>
        )}
      </svg>

      <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap gap-2">
        <span className="pointer-events-auto rounded-lg border border-line bg-white/90 px-3 py-1.5 text-[11px] font-medium text-ink shadow-sm backdrop-blur">
          Элементов: {current.elements.length}
        </span>
        {selected && (
          <span className="pointer-events-auto rounded-lg border border-terracotta/30 bg-terracotta/10 px-3 py-1.5 text-[11px] font-medium text-terracotta backdrop-blur">
            Выбран элемент
          </span>
        )}
      </div>

      <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-xl border border-line bg-white/90 p-1 shadow-card backdrop-blur">
        <button
          type="button"
          onClick={() => setZoom((value) => clamp(value / 1.2, 0.4, 4))}
          className="grid h-8 w-8 place-items-center rounded-lg text-ink transition hover:bg-sand"
          aria-label="Уменьшить масштаб"
        >
          <Icon name="zoomOut" className="h-4 w-4" />
        </button>
        <span className="w-12 text-center text-[11px] font-semibold tabular-nums text-ink">
          {Math.round(zoom * 100)}%
        </span>
        <button
          type="button"
          onClick={() => setZoom((value) => clamp(value * 1.2, 0.4, 4))}
          className="grid h-8 w-8 place-items-center rounded-lg text-ink transition hover:bg-sand"
          aria-label="Увеличить масштаб"
        >
          <Icon name="zoomIn" className="h-4 w-4" />
        </button>
        <span className="mx-1 h-5 w-px bg-line" />
        <button
          type="button"
          onClick={() => {
            setZoom(1)
            setView({ x: 0, y: 0 })
          }}
          className="rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-ink transition hover:bg-sand"
        >
          100%
        </button>
      </div>

      <div className="pointer-events-none absolute bottom-3 left-3 hidden rounded-lg bg-white/75 px-3 py-1.5 text-[10px] text-muted backdrop-blur sm:block">
        Перетаскивание — перемещение · колесо — масштаб · пробел — панорама · Delete — удалить
      </div>
    </div>
  )
}

function isTyping(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  return ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable
}
