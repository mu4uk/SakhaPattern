import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { DEFAULT_GENERATOR } from '../../lib/patternGenerator'
import { downloadPng, downloadSvg } from '../../lib/exporter'
import type { BackgroundOption } from '../../types'
import { cx } from '../../lib/utils'
import { Button, Icon, Segmented } from '../ui'
import { OrnamentCanvas } from './OrnamentCanvas'
import { ShapeLibrary } from './ShapeLibrary'
import { PatternGenerator } from './PatternGenerator'
import { ColorPalette } from './ColorPalette'
import { LayerPanel } from './LayerPanel'

const BACKGROUNDS: Array<{ value: BackgroundOption; label: string }> = [
  { value: 'transparent', label: 'Прозрачный' },
  { value: 'cream', label: 'Молочный' },
  { value: 'white', label: 'Белый' },
  { value: 'ink', label: 'Тёмный' },
]

export function OrnamentEditor() {
  const {
    current,
    selectedId,
    duplicateSelected,
    deleteSelected,
    flipSelected,
    clearCanvas,
    saveProject,
    setProjectName,
    setBackground,
    updateGenerator,
    notify,
  } = useApp()
  const [scale, setScale] = useState(3)
  const [exportBackground, setExportBackground] = useState<'current' | BackgroundOption>('current')

  const hasSelection = Boolean(selectedId)
  const exportProject = () => ({
    ...current,
    background: exportBackground === 'current' ? current.background : exportBackground,
  })

  const handlePng = async () => {
    try {
      await downloadPng(exportProject(), { scale })
      notify('PNG скачан')
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Ошибка экспорта PNG', 'error')
    }
  }

  const handleSvg = () => {
    try {
      downloadSvg(exportProject())
      notify('SVG скачан')
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Ошибка экспорта SVG', 'error')
    }
  }

  const handleReset = () => {
    updateGenerator(DEFAULT_GENERATOR)
    setProjectName('Новый орнамент')
    setBackground('transparent')
    clearCanvas()
    notify('Редактор сброшен', 'info')
  }

  const toolButton = (
    label: string,
    icon: string,
    onClick: () => void,
    disabled = false,
  ) => (
    <button
      type="button"
      onClick={onClick}
      disabled={!hasSelection || disabled}
      title={label}
      className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-white/80 text-ink transition hover:border-terracotta hover:bg-white disabled:cursor-not-allowed disabled:opacity-35"
    >
      <Icon name={icon} className="h-4 w-4" />
    </button>
  )

  return (
    <div className="animate-fade-up mx-auto max-w-[1700px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-terracotta">
            Рабочая область
          </span>
          <h1 className="mt-1 font-display text-3xl text-ink sm:text-4xl">Конструктор орнаментов</h1>
          <p className="mt-1 text-sm text-muted">
            Собирайте композицию, экспериментируйте с симметрией и сохраняйте результат.
          </p>
        </div>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted">Название работы</span>
          <input
            value={current.name}
            onChange={(event) => setProjectName(event.target.value)}
            className="w-64 rounded-xl border border-line bg-white px-3.5 py-2 text-sm font-medium text-ink outline-none transition focus:border-terracotta focus:ring-4 focus:ring-terracotta/10"
            placeholder="Название работы"
          />
        </label>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)_330px]">
        <div className="order-2 space-y-5 xl:order-1">
          <ShapeLibrary />
          <LayerPanel />
        </div>

        <div className="order-1 xl:order-2">
          <div className="space-y-4">
            <div className="rounded-2xl border border-line bg-white/80 p-3 shadow-card">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 border-r border-line pr-3">
                  {toolButton('Дублировать (Ctrl+D)', 'copy', duplicateSelected)}
                  {toolButton('Зеркало по горизонтали', 'flipH', () => flipSelected('x'))}
                  {toolButton('Зеркало по вертикали', 'flipV', () => flipSelected('y'))}
                  {toolButton('Удалить (Delete)', 'trash', deleteSelected)}
                </div>
                <div className="min-w-[220px] flex-1">
                  <Segmented
                    options={BACKGROUNDS}
                    value={current.background}
                    onChange={setBackground}
                  />
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-line pt-3">
                <select
                  value={scale}
                  onChange={(event) => setScale(Number(event.target.value))}
                  aria-label="Качество PNG"
                  className="rounded-lg border border-line bg-parchment px-2.5 py-2 text-xs text-ink outline-none"
                >
                  <option value={1}>PNG 1×</option>
                  <option value={2}>PNG 2×</option>
                  <option value={3}>PNG 3×</option>
                  <option value={4}>PNG 4×</option>
                </select>
                <select
                  value={exportBackground}
                  onChange={(event) => setExportBackground(event.target.value as typeof exportBackground)}
                  aria-label="Фон экспорта"
                  className="rounded-lg border border-line bg-parchment px-2.5 py-2 text-xs text-ink outline-none"
                >
                  <option value="current">Фон как на холсте</option>
                  <option value="transparent">Прозрачный фон</option>
                  <option value="white">Белый фон</option>
                  <option value="cream">Молочный фон</option>
                  <option value="ink">Тёмный фон</option>
                </select>
                <div className="ml-auto flex flex-wrap gap-2">
                  <Button size="sm" variant="secondary" onClick={handleReset}>
                    Сбросить
                  </Button>
                  <Button size="sm" variant="secondary" onClick={clearCanvas} icon={<Icon name="trash" className="h-3.5 w-3.5" />}>
                    Очистить
                  </Button>
                  <Button size="sm" variant="gold" onClick={saveProject} icon={<Icon name="save" className="h-3.5 w-3.5" />}>
                    Сохранить
                  </Button>
                  <Button size="sm" variant="secondary" onClick={handleSvg} icon={<Icon name="download" className="h-3.5 w-3.5" />}>
                    SVG
                  </Button>
                  <Button size="sm" onClick={handlePng} icon={<Icon name="download" className="h-3.5 w-3.5" />}>
                    PNG
                  </Button>
                </div>
              </div>
            </div>

            <div className={cx('h-[clamp(420px,62vh,720px)]')}>
              <OrnamentCanvas />
            </div>

            <div className="rounded-xl border border-line bg-sand/40 px-4 py-3 text-[11px] leading-relaxed text-muted">
              <strong className="text-ink/80">Подсказка:</strong> выберите мотив в каталоге, нажмите «Добавить на холст»,
              затем задайте симметрию в генераторе и скачайте готовый PNG. Рядом с холстом доступны
              мини-предпросмотр и список слоёв.
            </div>
          </div>
        </div>

        <div className="order-3 space-y-5">
          <PatternGenerator />
          <ColorPalette />
        </div>
      </div>
    </div>
  )
}
