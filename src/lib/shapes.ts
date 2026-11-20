import type { ShapeId } from '../types'
import { safeColor } from './utils'

export interface ShapeDefinition {
  id: ShapeId
  title: string
  family: 'Геометрия' | 'Линия' | 'Симметрия' | 'Композиция' | 'Растительный' | 'Зооморфный' | 'Кайма'
  markup: (color: string, accent: string) => string
}

function rayMarkup(count: number, inner: number, outer: number, halfWidth: number, color: string): string {
  let out = ''
  for (let i = 0; i < count; i += 1) {
    const angle = (i * 360) / count
    out += `<path d="M0 ${-inner} L${-halfWidth} ${-outer} L${halfWidth} ${-outer} Z" fill="${color}" transform="rotate(${angle})" />`
  }
  return out
}

/** Зеркальная копия левой половины мотива — основа осевой симметрии. */
function mirroredX(markup: string): string {
  return `${markup}<g transform="scale(-1 1)">${markup}</g>`
}

/** Короткие радиальные штрихи для солнечных и точечных мотивов. */
function ticks(count: number, inner: number, outer: number, color: string, width = 4): string {
  let out = ''
  for (let i = 0; i < count; i += 1) {
    const angle = (i * 360) / count
    out += `<path d="M0 ${-inner} V${-outer}" stroke="${color}" stroke-width="${width}" stroke-linecap="round" transform="rotate(${angle})" />`
  }
  return out
}

function spiralPoints(): string {
  const points: string[] = []
  for (let i = 0; i <= 90; i += 1) {
    const t = i / 90
    const angle = t * Math.PI * 5.4
    const radius = 4 + t * 42
    points.push(`${(Math.cos(angle) * radius).toFixed(1)},${(Math.sin(angle) * radius).toFixed(1)}`)
  }
  return points.join(' ')
}

const S = (color: string, accent: string) => ({
  color: safeColor(color),
  accent: safeColor(accent, '#F3E9D9'),
})

export const SHAPES: Record<ShapeId, ShapeDefinition> = {
  rhombus: {
    id: 'rhombus',
    title: 'Ромб с сердцевиной',
    family: 'Геометрия',
    markup: (color, accent) => {
      const c = S(color, accent)
      return `<path d="M0 -46 L38 0 L0 46 L-38 0 Z" fill="none" stroke="${c.color}" stroke-width="5" stroke-linejoin="round"/><path d="M0 -27 L23 0 L0 27 L-23 0 Z" fill="${c.color}" opacity="0.9"/><circle cx="0" cy="0" r="6" fill="${c.accent}"/>`
    },
  },
  nestedRhombus: {
    id: 'nestedRhombus',
    title: 'Вложенные ромбы',
    family: 'Геометрия',
    markup: (color, accent) => {
      const c = S(color, accent)
      return `<path d="M0 -48 L44 0 L0 48 L-44 0 Z" fill="${c.color}" opacity="0.22"/><path d="M0 -46 L40 0 L0 46 L-40 0 Z" fill="none" stroke="${c.color}" stroke-width="4"/><path d="M0 -26 L22 0 L0 26 L-22 0 Z" fill="none" stroke="${c.color}" stroke-width="4"/><path d="M0 -11 L9 0 L0 11 L-9 0 Z" fill="${c.accent}"/><circle cx="-40" cy="0" r="4" fill="${c.color}"/><circle cx="40" cy="0" r="4" fill="${c.color}"/>`
    },
  },
  cross: {
    id: 'cross',
    title: 'Ступенчатый крест',
    family: 'Геометрия',
    markup: (color, accent) => {
      const c = S(color, accent)
      return `<path d="M-13 -46 H13 V-13 H46 V13 H13 V46 H-13 V13 H-46 V-13 H-13 Z" fill="${c.color}"/><path d="M-7 -31 H7 V-7 H31 V7 H7 V31 H-7 V7 H-31 V-7 H-7 Z" fill="${c.accent}"/><rect x="-5" y="-5" width="10" height="10" fill="${c.color}"/>`
    },
  },
  star8: {
    id: 'star8',
    title: 'Восьмиугольная звезда',
    family: 'Симметрия',
    markup: (color, accent) => {
      const c = S(color, accent)
      return `<rect x="-27" y="-27" width="54" height="54" fill="${c.color}" transform="rotate(45)"/><rect x="-27" y="-27" width="54" height="54" fill="${c.color}" opacity="0.72"/><circle cx="0" cy="0" r="15" fill="${c.accent}"/><circle cx="0" cy="0" r="6" fill="${c.color}"/>`
    },
  },
  sun: {
    id: 'sun',
    title: 'Солнце с лучами',
    family: 'Симметрия',
    markup: (color, accent) => {
      const c = S(color, accent)
      return `${rayMarkup(12, 21, 45, 5, c.color)}<circle cx="0" cy="0" r="20" fill="${c.color}"/><circle cx="0" cy="0" r="10" fill="${c.accent}"/>`
    },
  },
  zigzag: {
    id: 'zigzag',
    title: 'Двойной зигзаг',
    family: 'Линия',
    markup: (color, accent) => {
      const c = S(color, accent)
      return `<path d="M-47 18 L-31 -14 L-15 18 L1 -14 L17 18 L33 -14 L47 16" fill="none" stroke="${c.color}" stroke-width="7" stroke-linejoin="miter" stroke-linecap="square"/><path d="M-47 34 L-31 2 L-15 34 L1 2 L17 34 L33 2 L47 32" fill="none" stroke="${c.accent}" stroke-width="5" stroke-linejoin="miter" opacity="0.85"/>`
    },
  },
  wave: {
    id: 'wave',
    title: 'Волнистая линия',
    family: 'Линия',
    markup: (color, accent) => {
      const c = S(color, accent)
      return `<path d="M-48 -12 C-34 -34 -18 10 -2 -12 C14 -34 30 10 48 -12" fill="none" stroke="${c.color}" stroke-width="7" stroke-linecap="round"/><path d="M-48 14 C-34 -8 -18 36 -2 14 C14 -8 30 36 48 14" fill="none" stroke="${c.accent}" stroke-width="6" stroke-linecap="round" opacity="0.9"/>`
    },
  },
  horn: {
    id: 'horn',
    title: 'Симметричные дуги',
    family: 'Симметрия',
    markup: (color, accent) => {
      const c = S(color, accent)
      return `<path d="M-5 34 C-40 20 -46 -16 -22 -38 C-30 -14 -20 8 -5 18 Z" fill="${c.color}"/><path d="M5 34 C40 20 46 -16 22 -38 C30 -14 20 8 5 18 Z" fill="${c.color}"/><path d="M0 -44 L15 -20 L0 4 L-15 -20 Z" fill="${c.accent}"/><path d="M0 8 L9 24 L0 42 L-9 24 Z" fill="${c.color}"/>`
    },
  },
  bird: {
    id: 'bird',
    title: 'Стилизованная птица',
    family: 'Композиция',
    markup: (color, accent) => {
      const c = S(color, accent)
      return `<path d="M0 -12 L38 -42 L26 -6 L48 12 L12 12 L0 44 L-12 12 L-48 12 L-26 -6 L-38 -42 Z" fill="${c.color}"/><path d="M0 -14 L17 -28 L9 -6 L0 4 L-9 -6 L-17 -28 Z" fill="${c.accent}"/><circle cx="0" cy="-30" r="6" fill="${c.color}"/>`
    },
  },
  tree: {
    id: 'tree',
    title: 'Стилизованное дерево',
    family: 'Композиция',
    markup: (color, accent) => {
      const c = S(color, accent)
      return `<path d="M-8 12 H8 V46 H-8 Z" fill="${c.color}"/><path d="M0 -48 L26 -12 H13 L34 14 H-34 L-13 -12 H-26 Z" fill="${c.color}"/><path d="M0 -32 L15 -10 H6 L20 8 H-20 L-6 -10 H-15 Z" fill="${c.accent}"/>`
    },
  },
  dots: {
    id: 'dots',
    title: 'Точки по ромбу',
    family: 'Геометрия',
    markup: (color, accent) => {
      const c = S(color, accent)
      return `<circle cx="0" cy="-40" r="8" fill="${c.color}"/><circle cx="36" cy="0" r="8" fill="${c.color}"/><circle cx="0" cy="40" r="8" fill="${c.color}"/><circle cx="-36" cy="0" r="8" fill="${c.color}"/><path d="M0 -20 L18 0 L0 20 L-18 0 Z" fill="${c.accent}"/><circle cx="0" cy="0" r="5" fill="${c.color}"/>`
    },
  },
  chevron: {
    id: 'chevron',
    title: 'Вложенные шевроны',
    family: 'Линия',
    markup: (color, accent) => {
      const c = S(color, accent)
      return `<path d="M-44 -30 L0 12 L44 -30" fill="none" stroke="${c.color}" stroke-width="8" stroke-linecap="square"/><path d="M-44 -4 L0 38 L44 -4" fill="none" stroke="${c.accent}" stroke-width="7" stroke-linecap="square"/><path d="M-20 -44 L0 -24 L20 -44" fill="none" stroke="${c.color}" stroke-width="6"/>`
    },
  },
  lattice: {
    id: 'lattice',
    title: 'Решётка из ромбов',
    family: 'Композиция',
    markup: (color, accent) => {
      const c = S(color, accent)
      return `<path d="M0 -48 L48 0 L0 48 L-48 0 Z" fill="none" stroke="${c.color}" stroke-width="5"/><path d="M-24 -24 L0 0 L24 -24 M-24 24 L0 0 L24 24" fill="none" stroke="${c.color}" stroke-width="4"/><path d="M0 -20 L18 0 L0 20 L-18 0 Z" fill="${c.accent}"/>`
    },
  },
  spiral: {
    id: 'spiral',
    title: 'Спираль',
    family: 'Линия',
    markup: (color, accent) => {
      const c = S(color, accent)
      return `<polyline points="${spiralPoints()}" fill="none" stroke="${c.color}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="0" cy="0" r="5" fill="${c.accent}"/>`
    },
  },
  triangle: {
    id: 'triangle',
    title: 'Вложенные треугольники',
    family: 'Геометрия',
    markup: (color, accent) => {
      const c = S(color, accent)
      return `<path d="M0 -46 L44 32 H-44 Z" fill="none" stroke="${c.color}" stroke-width="5" stroke-linejoin="round"/><path d="M0 -20 L22 16 H-22 Z" fill="${c.color}"/><path d="M0 -4 L9 12 H-9 Z" fill="${c.accent}"/>`
    },
  },
  leaf: {
    id: 'leaf',
    title: 'Лист с прожилками',
    family: 'Композиция',
    markup: (color, accent) => {
      const c = S(color, accent)
      return `<path d="M0 -46 C26 -22 28 14 0 46 C-28 14 -26 -22 0 -46 Z" fill="${c.color}" opacity="0.92"/><path d="M0 -42 V42" stroke="${c.accent}" stroke-width="4"/><path d="M0 -20 L16 -32 M0 -4 L20 -14 M0 12 L16 4 M0 -20 L-16 -32 M0 -4 L-20 -14 M0 12 L-16 4" stroke="${c.accent}" stroke-width="3" opacity="0.8"/>`
    },
  },
  border: {
    id: 'border',
    title: 'Кайма из ромбиков',
    family: 'Композиция',
    markup: (color, accent) => {
      const c = S(color, accent)
      let out = `<path d="M-48 0 H48" stroke="${c.color}" stroke-width="3" opacity="0.55"/>`
      for (let i = -2; i <= 2; i += 1) {
        const x = i * 20
        out += `<path d="M${x} -16 L${x + 11} 0 L${x} 16 L${x - 11} 0 Z" fill="${i % 2 === 0 ? c.color : c.accent}" stroke="${c.color}" stroke-width="2"/>`
      }
      return out
    },
  },

  // Мотивы, добавленные по описаниям из научных публикаций о якутском орнаменте.
  // Это учебные реконструкции формы, а не копии конкретных музейных предметов.
  lyre: {
    id: 'lyre',
    title: 'Процветшая лира',
    family: 'Растительный',
    markup: (color, accent) => {
      const c = S(color, accent)
      const branch = `<path d="M0 -8 C-10 -30 -30 -38 -36 -22 C-41 -8 -28 -2 -22 -12 C-18 -20 -26 -27 -30 -20" fill="none" stroke="${c.color}" stroke-width="5" stroke-linecap="round"/><path d="M-28 -14 Q-36 -34 -18 -40 Q-10 -28 -28 -14 Z" fill="${c.accent}" opacity="0.9"/>`
      return `<path d="M0 46 V-8" stroke="${c.color}" stroke-width="6" stroke-linecap="round"/>${mirroredX(branch)}<path d="M0 -8 Q-12 -30 0 -45 Q12 -30 0 -8 Z" fill="${c.color}"/><circle cx="0" cy="-27" r="5" fill="${c.accent}"/>`
    },
  },
  curls: {
    id: 'curls',
    title: 'Спиральные завитки',
    family: 'Растительный',
    markup: (color, accent) => {
      const c = S(color, accent)
      const curl = `<path d="M0 44 C-12 20 -34 16 -34 -6 C-34 -26 -12 -32 -6 -18 C-2 -8 -12 -4 -16 -12" fill="none" stroke="${c.color}" stroke-width="5" stroke-linecap="round"/><path d="M-24 16 Q-42 8 -38 -10" fill="none" stroke="${c.accent}" stroke-width="4" stroke-linecap="round"/>`
      return `${mirroredX(curl)}<path d="M0 44 V-2" stroke="${c.color}" stroke-width="5"/><circle cx="0" cy="-14" r="7" fill="${c.accent}"/>`
    },
  },
  sardaana: {
    id: 'sardaana',
    title: 'Цветок сардаана',
    family: 'Растительный',
    markup: (color, accent) => {
      const c = S(color, accent)
      return `<path d="M0 46 V8" stroke="${c.color}" stroke-width="5" stroke-linecap="round"/><path d="M0 8 C-22 -2 -26 -24 -10 -36 C-2 -42 0 -26 0 -18 C0 -26 2 -42 10 -36 C26 -24 22 -2 0 8 Z" fill="${c.color}" opacity="0.9"/><path d="M-14 16 Q-36 8 -34 -12 Q-16 -8 -14 16 Z M14 16 Q36 8 34 -12 Q16 -8 14 16 Z" fill="${c.accent}"/><path d="M0 -30 V10" stroke="${c.accent}" stroke-width="4"/><circle cx="0" cy="-20" r="4" fill="${c.color}"/>`
    },
  },
  herringbone: {
    id: 'herringbone',
    title: 'Ёлочка',
    family: 'Растительный',
    markup: (color, accent) => {
      const c = S(color, accent)
      let out = `<path d="M0 46 V-44" stroke="${c.color}" stroke-width="5" stroke-linecap="round"/>`
      for (let i = 0; i < 5; i += 1) {
        const y = -32 + i * 16
        const len = 26 - i * 3
        out += `<path d="M0 ${y + 12} L-${len} ${y} M0 ${y + 12} L${len} ${y}" stroke="${c.color}" stroke-width="5" stroke-linecap="round"/><path d="M${-len} ${y} l7 -1 M${len} ${y} l-7 -1" stroke="${c.accent}" stroke-width="4"/>`
      }
      return out
    },
  },
  trefoil: {
    id: 'trefoil',
    title: 'Трилистник',
    family: 'Растительный',
    markup: (color, accent) => {
      const c = S(color, accent)
      return `<path d="M0 46 V6" stroke="${c.color}" stroke-width="5"/><circle cx="0" cy="-20" r="16" fill="${c.color}"/><circle cx="-21" cy="3" r="14" fill="${c.color}" opacity="0.9"/><circle cx="21" cy="3" r="14" fill="${c.color}" opacity="0.9"/><path d="M0 -34 V14" stroke="${c.accent}" stroke-width="4"/><circle cx="0" cy="-20" r="5" fill="${c.accent}"/>`
    },
  },
  berryMotif: {
    id: 'berryMotif',
    title: 'Ногтевой (ягодный) мотив',
    family: 'Растительный',
    markup: (color, accent) => {
      const c = S(color, accent)
      return `<path d="M-38 30 Q0 -42 38 30 Q0 8 -38 30 Z" fill="${c.color}"/><path d="M-25 24 Q0 -20 25 24" fill="none" stroke="${c.accent}" stroke-width="4"/><circle cx="0" cy="4" r="5" fill="${c.accent}"/>`
    },
  },
  ramHorns: {
    id: 'ramHorns',
    title: 'Бараньи рога',
    family: 'Зооморфный',
    markup: (color, accent) => {
      const c = S(color, accent)
      const horn = `<path d="M-6 40 C-34 32 -46 6 -34 -18 C-25 -34 -6 -30 -4 -16 C-2 -6 -13 -1 -18 -9" fill="none" stroke="${c.color}" stroke-width="7" stroke-linecap="round"/><path d="M-34 -18 Q-46 -34 -30 -40" fill="none" stroke="${c.accent}" stroke-width="4"/>`
      return `${mirroredX(horn)}<path d="M0 -22 L16 0 L0 22 L-16 0 Z" fill="${c.accent}"/><circle cx="0" cy="0" r="5" fill="${c.color}"/>`
    },
  },
  horse: {
    id: 'horse',
    title: 'Геометризованный конь',
    family: 'Зооморфный',
    markup: (color, accent) => {
      const c = S(color, accent)
      return `<path d="M-34 -8 L4 -20 L22 -10 L30 8 L10 16 L-24 12 Z" fill="${c.color}" opacity="0.9"/><path d="M20 -14 L30 -40 L43 -32 L34 -10 Z" fill="${c.color}"/><path d="M-22 10 L-26 42 M-4 14 L-6 42 M10 14 L12 42 M22 10 L28 42" stroke="${c.color}" stroke-width="5" stroke-linecap="round"/><path d="M30 -38 Q10 -46 6 -30 Q14 -24 18 -30" fill="none" stroke="${c.accent}" stroke-width="4"/><circle cx="37" cy="-33" r="2.5" fill="${c.accent}"/>`
    },
  },
  ant: {
    id: 'ant',
    title: 'Муравей',
    family: 'Зооморфный',
    markup: (color, accent) => {
      const c = S(color, accent)
      let legs = ''
      for (let i = 0; i < 3; i += 1) {
        const y = -14 + i * 14
        legs += `<path d="M-7 ${y} L-28 ${y + 12} M7 ${y} L28 ${y + 12}" stroke="${c.color}" stroke-width="4" stroke-linecap="round"/>`
      }
      return `${legs}<ellipse cx="0" cy="-28" rx="11" ry="13" fill="${c.color}"/><ellipse cx="0" cy="-2" rx="8" ry="10" fill="${c.color}"/><ellipse cx="0" cy="26" rx="15" ry="17" fill="${c.color}"/><path d="M-5 -39 Q-14 -47 -18 -44 M5 -39 Q14 -47 18 -44" fill="none" stroke="${c.accent}" stroke-width="3"/><circle cx="0" cy="-30" r="4" fill="${c.accent}"/>`
    },
  },
  arch: {
    id: 'arch',
    title: 'Арочный мотив',
    family: 'Симметрия',
    markup: (color, accent) => {
      const c = S(color, accent)
      let out = `<path d="M-48 34 H48" stroke="${c.color}" stroke-width="3" opacity="0.6"/>`
      for (let i = -1; i <= 1; i += 1) {
        const x = i * 31
        out += `<path d="M${x - 15} 30 Q${x} -26 ${x + 15} 30" fill="none" stroke="${c.color}" stroke-width="6"/><circle cx="${x}" cy="-2" r="4" fill="${c.accent}"/>`
      }
      return out
    },
  },
  heartMotif: {
    id: 'heartMotif',
    title: 'Сердцевидный мотив',
    family: 'Геометрия',
    markup: (color, accent) => {
      const c = S(color, accent)
      return `<path d="M0 44 L-32 14 L-32 -10 L-16 -28 L0 -12 L16 -28 L32 -10 L32 14 Z" fill="${c.color}"/><path d="M0 28 L-18 10 L-18 -6 L-8 -16 L0 -6 L8 -16 L18 -6 L18 10 Z" fill="${c.accent}" opacity="0.85"/>`
    },
  },
  netCross: {
    id: 'netCross',
    title: 'Косый крест (сеть)',
    family: 'Геометрия',
    markup: (color, accent) => {
      const c = S(color, accent)
      let out = ''
      for (let i = -1; i <= 1; i += 1) {
        const x = i * 28
        out += `<path d="M${x - 12} -12 L${x + 12} 12 M${x - 12} 12 L${x + 12} -12" stroke="${c.color}" stroke-width="5" stroke-linecap="round"/>`
      }
      return `${out}<path d="M0 -20 L16 0 L0 20 L-16 0 Z" fill="${c.accent}"/>`
    },
  },
  sunCircle: {
    id: 'sunCircle',
    title: 'Круг с точкой',
    family: 'Симметрия',
    markup: (color, accent) => {
      const c = S(color, accent)
      return `${ticks(12, 36, 46, c.color, 3)}<circle cx="0" cy="0" r="31" fill="none" stroke="${c.color}" stroke-width="6"/><circle cx="0" cy="0" r="12" fill="${c.color}" opacity="0.9"/><circle cx="0" cy="0" r="4" fill="${c.accent}"/>`
    },
  },
  chess: {
    id: 'chess',
    title: 'Шашечный мотив',
    family: 'Геометрия',
    markup: (color, accent) => {
      const c = S(color, accent)
      let out = ''
      for (let row = 0; row < 4; row += 1) {
        for (let col = 0; col < 4; col += 1) {
          const x = -40 + col * 20
          const y = -40 + row * 20
          const main = (row + col) % 2 === 0
          out += `<rect x="${x}" y="${y}" width="20" height="20" fill="${main ? c.color : c.accent}" opacity="${main ? '0.9' : '0.55'}"/>`
        }
      }
      return out
    },
  },
  cord: {
    id: 'cord',
    title: 'Кручёный шнур',
    family: 'Кайма',
    markup: (color, accent) => {
      const c = S(color, accent)
      return `<path d="M-48 -16 C-36 -34 -24 2 -12 -16 C0 -34 12 2 24 -16 C36 -34 48 2 48 -16" fill="none" stroke="${c.color}" stroke-width="7" stroke-linecap="round"/><path d="M-48 16 C-36 -2 -24 34 -12 16 C0 -2 12 34 24 16 C36 -2 48 34 48 16" fill="none" stroke="${c.accent}" stroke-width="6" stroke-linecap="round"/>`
    },
  },
  braid: {
    id: 'braid',
    title: 'Плетёнка',
    family: 'Кайма',
    markup: (color, accent) => {
      const c = S(color, accent)
      const strand = (y: number, stroke: string, width = 6) =>
        `<path d="M-48 ${y} C-36 ${y - 18} -24 ${y + 18} -12 ${y} C0 ${y - 18} 12 ${y + 18} 24 ${y} C36 ${y - 18} 48 ${y + 18} 48 ${y}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round"/>`
      return strand(-18, c.color) + strand(0, c.accent, 5) + strand(18, c.color)
    },
  },
  pearl: {
    id: 'pearl',
    title: 'Жемчужная кайма',
    family: 'Кайма',
    markup: (color, accent) => {
      const c = S(color, accent)
      let out = `<path d="M-48 0 H48" stroke="${c.color}" stroke-width="3" opacity="0.5"/>`
      const radii = [9, 7, 11, 7, 9]
      for (let i = 0; i < radii.length; i += 1) {
        const x = -40 + i * 20
        out += `<circle cx="${x}" cy="0" r="${radii[i]}" fill="${i % 2 === 0 ? c.color : c.accent}" stroke="${c.accent}" stroke-width="2"/><circle cx="${x}" cy="0" r="2.5" fill="${c.color}"/>`
      }
      return out
    },
  },
  comb: {
    id: 'comb',
    title: 'Гребёнка',
    family: 'Кайма',
    markup: (color, accent) => {
      const c = S(color, accent)
      let out = `<path d="M-46 26 H46" stroke="${c.color}" stroke-width="4" stroke-linecap="round"/>`
      for (let i = -4; i <= 4; i += 1) {
        const x = i * 10
        const top = i % 2 === 0 ? -12 : -2
        out += `<path d="M${x} 22 V${top}" stroke="${c.color}" stroke-width="4" stroke-linecap="round"/><circle cx="${x}" cy="${top - 6}" r="3" fill="${c.accent}"/>`
      }
      return out
    },
  },
  oblique: {
    id: 'oblique',
    title: 'Косые линии',
    family: 'Кайма',
    markup: (color, accent) => {
      const c = S(color, accent)
      let out = ''
      for (let i = -2; i <= 2; i += 1) {
        const x = i * 18
        out += `<path d="M${x - 12} 44 L${x + 12} -44" stroke="${c.color}" stroke-width="6" stroke-linecap="round"/>`
      }
      return `${out}<path d="M-48 -44 H48 M-48 44 H48" stroke="${c.accent}" stroke-width="3" opacity="0.8"/>`
    },
  },
}

export const SHAPE_LIST: ShapeDefinition[] = Object.values(SHAPES)

export function isShapeId(value: string): value is ShapeId {
  return Object.prototype.hasOwnProperty.call(SHAPES, value)
}

export function motifMarkup(shapeId: ShapeId, color: string, accent: string): string {
  const shape = SHAPES[shapeId] ?? SHAPES.rhombus
  return shape.markup(color, accent)
}
