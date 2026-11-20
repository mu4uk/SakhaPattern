import { getPalette } from '../data/palettes'
import type { CanvasElement, Direction, PatternSettings, ShapeId, SymmetryMode } from '../types'
import { clamp, uid } from './utils'

export const DEFAULT_GENERATOR: PatternSettings = {
  symmetry: 'radial',
  repeats: 8,
  shapeId: 'rhombus',
  paletteId: 'earth',
  direction: 'radial',
  spacing: 0,
  elementSize: 68,
  rotationStep: 0,
  jitter: 0,
}

export const SYMMETRY_LABELS: Record<SymmetryMode, string> = {
  none: 'Без симметрии',
  horizontal: 'Горизонтальный ряд',
  vertical: 'Вертикальный ряд',
  central: 'Центральная симметрия',
  radial: 'Радиальная симметрия',
  mirror: 'Зеркальное отражение',
}

export const DIRECTION_LABELS: Record<Direction, string> = {
  horizontal: 'По горизонтали',
  vertical: 'По вертикали',
  radial: 'Вокруг центра',
  center: 'К центру',
}

interface BuildOptions {
  x: number
  y: number
  size: number
  rotation: number
  colorIndex: number
  flipX?: boolean
  flipY?: boolean
}

/**
 * Алгоритмическая генерация композиции.
 * Функция чистая: одинаковые настройки дают одинаковый результат.
 */
export function generatePattern(settings: PatternSettings, canvasSize = 600): CanvasElement[] {
  const palette = getPalette(settings.paletteId)
  const count = clamp(Math.round(settings.repeats), 1, 24)
  const size = clamp(settings.elementSize, 20, 180)
  const margin = 70
  const span = Math.max(120, canvasSize - margin * 2)
  const cx = canvasSize / 2
  const cy = canvasSize / 2
  const jitter = clamp(settings.jitter, 0, 1)
  const elements: CanvasElement[] = []

  const sizeAt = (index: number, factor = 1) =>
    clamp(size * factor * (1 + jitter * Math.sin(index * 2.37 + 0.7)), 12, 240)

  const add = (shapeId: ShapeId, options: BuildOptions) => {
    elements.push({
      id: uid('el'),
      shapeId,
      x: options.x,
      y: options.y,
      size: options.size,
      rotation: options.rotation,
      color: palette.colors[options.colorIndex % palette.colors.length] ?? palette.colors[0],
      accent: palette.accent,
      opacity: 1,
      flipX: Boolean(options.flipX),
      flipY: Boolean(options.flipY),
    })
  }

  const directionRotation = settings.direction === 'vertical' ? 90 : 0

  switch (settings.symmetry) {
    case 'none': {
      add(settings.shapeId, {
        x: cx,
        y: cy,
        size: sizeAt(0, 1.8),
        rotation: directionRotation + settings.rotationStep,
        colorIndex: 0,
      })
      break
    }
    case 'horizontal':
    case 'vertical': {
      const step = span / Math.max(1, count - 1)
      const gap = clamp(settings.spacing, -0.8, 0.8)
      for (let i = 0; i < count; i += 1) {
        const offset = -span / 2 + step * i + gap * step
        const alternate = i % 2 === 0 ? 1 : -1
        add(settings.shapeId, {
          x: settings.symmetry === 'horizontal' ? cx + offset : cx,
          y: settings.symmetry === 'horizontal' ? cy : cy + offset,
          size: sizeAt(i),
          rotation:
            directionRotation +
            settings.rotationStep * i +
            (settings.direction === 'radial' ? alternate * 15 : 0),
          colorIndex: i,
          flipX: alternate < 0 && settings.symmetry === 'horizontal',
        })
      }
      break
    }
    case 'central': {
      const symmetricCount = Math.max(4, Math.round(count / 4) * 4)
      for (let i = 0; i < symmetricCount; i += 1) {
        const angle = (i * Math.PI * 2) / symmetricCount
        const radius = span * 0.33
        add(settings.shapeId, {
          x: cx + Math.cos(angle) * radius,
          y: cy + Math.sin(angle) * radius,
          size: sizeAt(i),
          rotation: (angle * 180) / Math.PI + 90 + settings.rotationStep,
          colorIndex: Math.floor(i / 4),
        })
      }
      add(settings.shapeId, {
        x: cx,
        y: cy,
        size: sizeAt(symmetricCount, 1.15),
        rotation: settings.rotationStep,
        colorIndex: 1,
      })
      break
    }
    case 'radial': {
      const radius = span * 0.34
      for (let i = 0; i < count; i += 1) {
        const angle = (i * Math.PI * 2) / count - Math.PI / 2
        add(settings.shapeId, {
          x: cx + Math.cos(angle) * radius,
          y: cy + Math.sin(angle) * radius,
          size: sizeAt(i),
          rotation: (angle * 180) / Math.PI + 90 + settings.rotationStep * i,
          colorIndex: i,
        })
      }
      if (count >= 5) {
        add(settings.shapeId, {
          x: cx,
          y: cy,
          size: sizeAt(count, 0.75),
          rotation: settings.rotationStep,
          colorIndex: 2,
        })
      }
      break
    }
    case 'mirror': {
      const half = Math.ceil(count / 2)
      const width = span * 0.36
      const offsetY = span * (0.14 + clamp(settings.spacing, -0.1, 0.1))
      for (let i = 0; i < half; i += 1) {
        const x = half === 1 ? width * 0.5 : (i / (half - 1)) * width
        for (const side of [-1, 1]) {
          for (const vertical of [-1, 1]) {
            add(settings.shapeId, {
              x: cx + side * x,
              y: cy + vertical * offsetY,
              size: sizeAt(i + half * (vertical + 1)),
              rotation: directionRotation + settings.rotationStep * i,
              colorIndex: i + (vertical > 0 ? 1 : 0),
              flipX: side < 0,
              flipY: vertical > 0,
            })
          }
        }
      }
      break
    }
  }

  return elements
}

export function randomizeGenerator(current: PatternSettings): PatternSettings {
  const shapes: ShapeId[] = [
    'rhombus',
    'nestedRhombus',
    'cross',
    'star8',
    'sun',
    'zigzag',
    'wave',
    'horn',
    'bird',
    'tree',
    'dots',
    'chevron',
    'lattice',
    'spiral',
    'triangle',
    'leaf',
    'border',
    'lyre',
    'curls',
    'sardaana',
    'herringbone',
    'trefoil',
    'berryMotif',
    'ramHorns',
    'horse',
    'ant',
    'arch',
    'heartMotif',
    'netCross',
    'sunCircle',
    'chess',
    'cord',
    'braid',
    'pearl',
    'comb',
    'oblique',
  ]
  const symmetries: SymmetryMode[] = ['horizontal', 'vertical', 'central', 'radial', 'mirror']
  const directions: Direction[] = ['horizontal', 'vertical', 'radial', 'center']
  const paletteIds = ['earth', 'north', 'ash', 'berry', 'ice', 'graphite']
  const pick = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)]

  return {
    ...current,
    shapeId: pick(shapes),
    symmetry: pick(symmetries),
    direction: pick(directions),
    paletteId: pick(paletteIds),
    repeats: Math.floor(Math.random() * 8) + 5,
    elementSize: Math.floor(Math.random() * 46) + 48,
    rotationStep: Math.random() < 0.4 ? Math.floor(Math.random() * 31) - 15 : 0,
    spacing: Number(((Math.random() - 0.5) * 0.6).toFixed(2)),
    jitter: Number((Math.random() * 0.22).toFixed(2)),
  }
}
