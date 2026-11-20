export type Page = 'home' | 'catalog' | 'editor' | 'mockups' | 'gallery' | 'education'

export type ShapeId =
  | 'rhombus'
  | 'nestedRhombus'
  | 'cross'
  | 'star8'
  | 'sun'
  | 'zigzag'
  | 'wave'
  | 'horn'
  | 'bird'
  | 'tree'
  | 'dots'
  | 'chevron'
  | 'lattice'
  | 'spiral'
  | 'triangle'
  | 'leaf'
  | 'border'
  | 'lyre'
  | 'curls'
  | 'sardaana'
  | 'herringbone'
  | 'trefoil'
  | 'berryMotif'
  | 'ramHorns'
  | 'horse'
  | 'ant'
  | 'arch'
  | 'heartMotif'
  | 'netCross'
  | 'sunCircle'
  | 'chess'
  | 'cord'
  | 'braid'
  | 'pearl'
  | 'comb'
  | 'oblique'

export type SymmetryMode =
  | 'none'
  | 'horizontal'
  | 'vertical'
  | 'central'
  | 'radial'
  | 'mirror'

export type Direction = 'horizontal' | 'vertical' | 'radial' | 'center'

export type BackgroundOption = 'transparent' | 'cream' | 'white' | 'ink'

export interface CanvasElement {
  id: string
  shapeId: ShapeId
  x: number
  y: number
  size: number
  rotation: number
  color: string
  accent: string
  opacity: number
  flipX: boolean
  flipY: boolean
}

export interface PatternSettings {
  symmetry: SymmetryMode
  repeats: number
  shapeId: ShapeId
  paletteId: string
  direction: Direction
  spacing: number
  elementSize: number
  rotationStep: number
  jitter: number
}

export interface Project {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  elements: CanvasElement[]
  paletteId: string
  background: BackgroundOption
  canvasSize: number
  generator: PatternSettings
}

export interface Palette {
  id: string
  name: string
  colors: string[]
  accent: string
  note: string
}

export interface OrnamentItem {
  id: string
  title: string
  category: 'Геометрия' | 'Симметрия' | 'Линия' | 'Композиция' | 'Растительный' | 'Зооморфный' | 'Кайма'
  shapeId: ShapeId
  paletteId: string
  description: string
  interpretationNote: string
  exampleUsage: string
  tags: string[]
  source?: string
}

export interface ToastMessage {
  id: string
  text: string
  kind: 'success' | 'info' | 'error'
}

export type MockupId =
  | 'tshirt'
  | 'bag'
  | 'mug'
  | 'notebook'
  | 'postcard'
  | 'poster'
  | 'logo'
  | 'magnet'
