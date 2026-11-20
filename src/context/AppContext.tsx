import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { getPalette } from '../data/palettes'
import { generatePattern, randomizeGenerator } from '../lib/patternGenerator'
import {
  createProject,
  loadCurrentProject,
  loadProjects,
  saveCurrentProject,
  saveProjects,
} from '../lib/storage'
import type {
  BackgroundOption,
  CanvasElement,
  Page,
  PatternSettings,
  Project,
  ShapeId,
  ToastMessage,
} from '../types'
import { uid } from '../lib/utils'

const PAGES: Page[] = ['home', 'catalog', 'editor', 'mockups', 'gallery', 'education']

interface AppContextValue {
  page: Page
  current: Project
  projects: Project[]
  selectedId: string | null
  autoApply: boolean
  toasts: ToastMessage[]
  navigate: (page: Page) => void
  setProjectName: (name: string) => void
  setBackground: (background: BackgroundOption) => void
  addElement: (shapeId: ShapeId) => void
  updateElement: (id: string, patch: Partial<CanvasElement>) => void
  deleteElement: (id: string) => void
  deleteSelected: () => void
  duplicateSelected: () => void
  flipSelected: (axis: 'x' | 'y') => void
  clearCanvas: () => void
  selectElement: (id: string | null) => void
  updateGenerator: (patch: Partial<PatternSettings>) => void
  regenerate: (settings?: PatternSettings) => void
  randomize: () => void
  setAutoApply: (value: boolean) => void
  saveProject: () => Project
  openProject: (id: string) => void
  deleteProject: (id: string) => void
  notify: (text: string, kind?: ToastMessage['kind']) => void
  dismissToast: (id: string) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(() => loadProjects())
  const [current, setCurrent] = useState<Project>(() => loadCurrentProject() ?? createProject())
  const [page, setPage] = useState<Page>('home')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [autoApply, setAutoApply] = useState(true)
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const notify = useCallback((text: string, kind: ToastMessage['kind'] = 'success') => {
    const id = uid('toast')
    setToasts((prev) => [...prev.slice(-3), { id, text, kind }])
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 3400)
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const navigate = useCallback((next: Page) => {
    setPage(next)
    if (window.location.hash !== `#${next}`) window.location.hash = next
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const fromHash = () => {
      const value = window.location.hash.replace('#', '') as Page
      if (PAGES.includes(value)) {
        setPage(value)
        return
      }
      // Старые или ошибочные ссылки (например, #research) не должны оставлять
      // пользователя на предыдущем разделе с несоответствующим адресом.
      setPage('home')
      if (window.location.hash) window.history.replaceState(null, '', '#home')
    }
    fromHash()
    window.addEventListener('hashchange', fromHash)
    return () => window.removeEventListener('hashchange', fromHash)
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => saveCurrentProject(current), 350)
    return () => window.clearTimeout(timer)
  }, [current])

  useEffect(() => saveProjects(projects), [projects])

  const setProjectName = useCallback((name: string) => {
    setCurrent((prev) => ({ ...prev, name, updatedAt: new Date().toISOString() }))
  }, [])

  const setBackground = useCallback((background: BackgroundOption) => {
    setCurrent((prev) => ({ ...prev, background, updatedAt: new Date().toISOString() }))
  }, [])

  const addElement = useCallback((shapeId: ShapeId) => {
    setCurrent((prev) => {
      const palette = getPalette(prev.generator.paletteId)
      const index = prev.elements.length
      const offset = (index % 6) * 14
      const element: CanvasElement = {
        id: uid('el'),
        shapeId,
        x: prev.canvasSize / 2 + offset - 35,
        y: prev.canvasSize / 2 + offset - 35,
        size: 90,
        rotation: 0,
        color: palette.colors[index % palette.colors.length],
        accent: palette.accent,
        opacity: 1,
        flipX: false,
        flipY: false,
      }
      setSelectedId(element.id)
      return {
        ...prev,
        elements: [...prev.elements, element],
        generator: { ...prev.generator, shapeId },
        updatedAt: new Date().toISOString(),
      }
    })
  }, [])

  const updateElement = useCallback((id: string, patch: Partial<CanvasElement>) => {
    setAutoApply(false)
    setCurrent((prev) => ({
      ...prev,
      elements: prev.elements.map((element) =>
        element.id === id ? { ...element, ...patch } : element,
      ),
      updatedAt: new Date().toISOString(),
    }))
  }, [])

  const deleteElement = useCallback((id: string) => {
    setAutoApply(false)
    setCurrent((prev) => ({
      ...prev,
      elements: prev.elements.filter((element) => element.id !== id),
      updatedAt: new Date().toISOString(),
    }))
    setSelectedId((prev) => (prev === id ? null : prev))
  }, [])

  const deleteSelected = useCallback(() => {
    if (selectedId) deleteElement(selectedId)
  }, [selectedId, deleteElement])

  const duplicateSelected = useCallback(() => {
    if (!selectedId) return
    const source = current.elements.find((element) => element.id === selectedId)
    if (!source) return
    const copy: CanvasElement = {
      ...source,
      id: uid('el'),
      x: source.x + 24,
      y: source.y + 24,
    }
    setAutoApply(false)
    setCurrent((prev) => ({
      ...prev,
      elements: [...prev.elements, copy],
      updatedAt: new Date().toISOString(),
    }))
    setSelectedId(copy.id)
  }, [selectedId, current.elements])

  const flipSelected = useCallback(
    (axis: 'x' | 'y') => {
      if (!selectedId) return
      const source = current.elements.find((element) => element.id === selectedId)
      if (!source) return
      updateElement(selectedId, axis === 'x' ? { flipX: !source.flipX } : { flipY: !source.flipY })
    },
    [selectedId, current.elements, updateElement],
  )

  const clearCanvas = useCallback(() => {
    setAutoApply(false)
    setSelectedId(null)
    setCurrent((prev) => ({
      ...prev,
      elements: [],
      updatedAt: new Date().toISOString(),
    }))
  }, [])

  const regenerate = useCallback((settings?: PatternSettings) => {
    setCurrent((prev) => {
      const nextSettings = settings ?? prev.generator
      return {
        ...prev,
        generator: nextSettings,
        paletteId: nextSettings.paletteId,
        elements: generatePattern(nextSettings, prev.canvasSize),
        updatedAt: new Date().toISOString(),
      }
    })
    setSelectedId(null)
  }, [])

  const updateGenerator = useCallback(
    (patch: Partial<PatternSettings>) => {
      const next = { ...current.generator, ...patch }
      setCurrent((prev) => ({ ...prev, generator: next }))
      if (autoApply) regenerate(next)
    },
    [current.generator, autoApply, regenerate],
  )

  const randomize = useCallback(() => {
    const next = randomizeGenerator(current.generator)
    setCurrent((prev) => ({ ...prev, generator: next }))
    regenerate(next)
    notify('Случайный вариант сгенерирован')
  }, [current.generator, regenerate, notify])

  const saveProject = useCallback(() => {
    const saved: Project = { ...current, updatedAt: new Date().toISOString() }
    setCurrent(saved)
    setProjects((prev) => {
      const exists = prev.some((project) => project.id === saved.id)
      return exists
        ? prev.map((project) => (project.id === saved.id ? saved : project))
        : [saved, ...prev]
    })
    notify('Проект сохранён в галерее')
    return saved
  }, [current, notify])

  const openProject = useCallback(
    (id: string) => {
      const project = projects.find((item) => item.id === id)
      if (!project) return
      setCurrent(project)
      setSelectedId(null)
      setAutoApply(false)
      navigate('editor')
      notify(`Проект «${project.name}» открыт`)
    },
    [projects, navigate, notify],
  )

  const deleteProject = useCallback(
    (id: string) => {
      setProjects((prev) => prev.filter((project) => project.id !== id))
      notify('Проект удалён из галереи', 'info')
    },
    [notify],
  )

  const value = useMemo<AppContextValue>(
    () => ({
      page,
      current,
      projects,
      selectedId,
      autoApply,
      toasts,
      navigate,
      setProjectName,
      setBackground,
      addElement,
      updateElement,
      deleteElement,
      deleteSelected,
      duplicateSelected,
      flipSelected,
      clearCanvas,
      selectElement: setSelectedId,
      updateGenerator,
      regenerate,
      randomize,
      setAutoApply,
      saveProject,
      openProject,
      deleteProject,
      notify,
      dismissToast,
    }),
    [
      page,
      current,
      projects,
      selectedId,
      autoApply,
      toasts,
      navigate,
      setProjectName,
      setBackground,
      addElement,
      updateElement,
      deleteElement,
      deleteSelected,
      duplicateSelected,
      flipSelected,
      clearCanvas,
      updateGenerator,
      regenerate,
      randomize,
      saveProject,
      openProject,
      deleteProject,
      notify,
      dismissToast,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp должен использоваться внутри AppProvider')
  return context
}
