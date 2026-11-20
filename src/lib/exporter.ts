import type { BackgroundOption, CanvasElement, Project } from '../types'
import { motifMarkup } from './shapes'
import { downloadBlob, safeColor, slugify } from './utils'

const BACKGROUND_COLORS: Record<Exclude<BackgroundOption, 'transparent'>, string> = {
  cream: '#FBF7F0',
  white: '#FFFFFF',
  ink: '#2E211B',
}

export function renderElementsMarkup(elements: CanvasElement[], interactive = false): string {
  return elements
    .map((element) => {
      const factor = element.size / 100
      const sx = (element.flipX ? -1 : 1) * factor
      const sy = (element.flipY ? -1 : 1) * factor
      const transform = `translate(${element.x.toFixed(2)} ${element.y.toFixed(2)}) rotate(${element.rotation.toFixed(2)}) scale(${sx.toFixed(4)} ${sy.toFixed(4)})`
      const cursor = interactive ? ' style="cursor:move"' : ''
      return `<g data-id="${element.id}" transform="${transform}" opacity="${Math.max(0, Math.min(1, element.opacity))}"${cursor}>${motifMarkup(element.shapeId, element.color, element.accent)}</g>`
    })
    .join('')
}

export interface SvgOptions {
  background?: BackgroundOption
  padding?: number
}

export function buildSvg(project: Project, options: SvgOptions = {}): string {
  const background = options.background ?? project.background
  const padding = Math.max(0, options.padding ?? 0)
  const size = project.canvasSize
  const view = `${-padding} ${-padding} ${size + padding * 2} ${size + padding * 2}`
  const bgRect =
    background === 'transparent'
      ? ''
      : `<rect x="${-padding}" y="${-padding}" width="${size + padding * 2}" height="${size + padding * 2}" fill="${BACKGROUND_COLORS[background]}"/>`

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size + padding * 2}" height="${size + padding * 2}" viewBox="${view}" role="img" aria-label="Орнамент SakhaPattern">
${bgRect}
<g>${renderElementsMarkup(project.elements)}</g>
</svg>`
}

export function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

export function projectDataUrl(project: Project): string {
  return svgToDataUrl(buildSvg(project, { padding: 0 }))
}

export function downloadSvg(project: Project): void {
  const blob = new Blob([buildSvg(project, { padding: 24 })], {
    type: 'image/svg+xml;charset=utf-8',
  })
  downloadBlob(blob, `${slugify(project.name)}.svg`)
}

export async function downloadPng(
  project: Project,
  options: { scale?: number; background?: BackgroundOption } = {},
): Promise<void> {
  const scale = Math.max(1, Math.min(6, options.scale ?? 3))
  const svg = buildSvg(project, { background: options.background, padding: 0 })
  const image = new Image()
  image.src = svgToDataUrl(svg)

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve()
    image.onerror = () => reject(new Error('Не удалось подготовить PNG'))
  })

  const canvas = document.createElement('canvas')
  const dimension = project.canvasSize * scale
  canvas.width = dimension
  canvas.height = dimension
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas недоступен')
  context.scale(scale, scale)
  context.drawImage(image, 0, 0, project.canvasSize, project.canvasSize)

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
  if (!blob) throw new Error('Не удалось создать PNG')
  downloadBlob(blob, `${slugify(project.name)}.png`)
}

export function backgroundValue(background: BackgroundOption): string {
  return background === 'transparent' ? 'transparent' : safeColor(BACKGROUND_COLORS[background])
}
