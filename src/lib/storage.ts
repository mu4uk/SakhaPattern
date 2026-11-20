import { generatePattern, DEFAULT_GENERATOR } from './patternGenerator'
import type { PatternSettings, Project } from '../types'
import { uid } from './utils'

const PROJECTS_KEY = 'sakhaPattern.projects.v1'
const CURRENT_KEY = 'sakhaPattern.current.v1'
const SEEDED_KEY = 'sakhaPattern.seeded.v1'

export function createProject(name = 'Новый орнамент'): Project {
  const now = new Date().toISOString()
  return {
    id: uid('project'),
    name,
    createdAt: now,
    updatedAt: now,
    elements: [],
    paletteId: DEFAULT_GENERATOR.paletteId,
    background: 'transparent',
    canvasSize: 600,
    generator: { ...DEFAULT_GENERATOR },
  }
}

function demoProject(
  name: string,
  generator: Partial<PatternSettings>,
  background: Project['background'],
  createdAt: string,
): Project {
  const settings: PatternSettings = { ...DEFAULT_GENERATOR, ...generator }
  return {
    id: uid('demo'),
    name,
    createdAt,
    updatedAt: createdAt,
    elements: generatePattern(settings, 600),
    paletteId: settings.paletteId,
    background,
    canvasSize: 600,
    generator: settings,
  }
}

export function createDemoProjects(): Project[] {
  return [
    demoProject(
      'Северный ритм',
      {
        symmetry: 'radial',
        repeats: 10,
        shapeId: 'rhombus',
        paletteId: 'earth',
        direction: 'radial',
        elementSize: 62,
      },
      'cream',
      '2026-09-12T10:30:00.000Z',
    ),
    demoProject(
      'Зеркальная кайма',
      {
        symmetry: 'mirror',
        repeats: 8,
        shapeId: 'chevron',
        paletteId: 'ash',
        direction: 'horizontal',
        elementSize: 54,
      },
      'transparent',
      '2026-09-24T14:15:00.000Z',
    ),
    demoProject(
      'Солнечный круг',
      {
        symmetry: 'central',
        repeats: 8,
        shapeId: 'sun',
        paletteId: 'berry',
        direction: 'center',
        elementSize: 58,
      },
      'transparent',
      '2026-10-06T09:05:00.000Z',
    ),
  ]
}

function read<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function write(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Хранилище может быть недоступно (приватный режим) — приложение продолжает работу.
  }
}

export function loadProjects(): Project[] {
  const stored = read<Project[]>(PROJECTS_KEY)
  if (Array.isArray(stored)) return stored

  const seeded = read<boolean>(SEEDED_KEY)
  if (!seeded) {
    const demos = createDemoProjects()
    write(PROJECTS_KEY, demos)
    write(SEEDED_KEY, true)
    return demos
  }
  return []
}

export function saveProjects(projects: Project[]): void {
  write(PROJECTS_KEY, projects)
}

export function loadCurrentProject(): Project | null {
  return read<Project>(CURRENT_KEY)
}

export function saveCurrentProject(project: Project): void {
  write(CURRENT_KEY, project)
}
