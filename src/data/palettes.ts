import type { Palette } from '../types'

export const PALETTES: Palette[] = [
  {
    id: 'earth',
    name: 'Земля саха',
    colors: ['#7B2D2D', '#B4543A', '#C99A3D', '#2E211B'],
    accent: '#F3E9D9',
    note: 'Терракота, золото и тёмный коричневый — тёплая классическая гамма.',
  },
  {
    id: 'north',
    name: 'Северное сияние',
    colors: ['#2F5D62', '#4E8D8A', '#9FBFB5', '#E7DBC4'],
    accent: '#FBF7F0',
    note: 'Холодные оттенки с тёплым песочным акцентом.',
  },
  {
    id: 'ash',
    name: 'Пепел и золото',
    colors: ['#2E211B', '#6E5544', '#A98446', '#D9B96B'],
    accent: '#FBF7F0',
    note: 'Сдержанная палитра для графичных и лаконичных композиций.',
  },
  {
    id: 'berry',
    name: 'Брусника',
    colors: ['#7B2D2D', '#A63F36', '#D17954', '#E8C98E'],
    accent: '#FFF6E6',
    note: 'Насыщенные красные и ягодные оттенки с кремовым светом.',
  },
  {
    id: 'ice',
    name: 'Молочный лёд',
    colors: ['#3B5A63', '#6F9096', '#B9CCD0', '#EADFCB'],
    accent: '#FFFFFF',
    note: 'Мягкие голубые тона, подходящие для фона и лёгких узоров.',
  },
  {
    id: 'graphite',
    name: 'Графит и медь',
    colors: ['#24201F', '#4A4441', '#9C6B45', '#C79A63'],
    accent: '#F3E9D9',
    note: 'Современная индустриальная гамма с медным акцентом.',
  },
]

export function getPalette(id: string): Palette {
  return PALETTES.find((palette) => palette.id === id) ?? PALETTES[0]
}
