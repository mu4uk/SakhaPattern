import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { renderElementsMarkup } from '../../lib/exporter'
import type { MockupId, Project } from '../../types'
import { cx } from '../../lib/utils'
import { Button, Icon, Panel, SectionHeading, Slider } from '../ui'

const MOCKUPS: Array<{ id: MockupId; label: string; description: string }> = [
  { id: 'tshirt', label: 'Футболка', description: 'Принт на груди изделия.' },
  { id: 'bag', label: 'Сумка', description: 'Узор на тканевой сумке.' },
  { id: 'mug', label: 'Кружка', description: 'Оформление керамики.' },
  { id: 'notebook', label: 'Блокнот', description: 'Дизайн обложки.' },
  { id: 'postcard', label: 'Открытка', description: 'Праздничная или сувенирная открытка.' },
  { id: 'poster', label: 'Плакат', description: 'Крупный графический носитель.' },
  { id: 'logo', label: 'Логотип', description: 'Знак на основе орнаментального мотива.' },
  { id: 'magnet', label: 'Магнит', description: 'Сувенирная продукция.' },
]

const COLORS = ['#FBF7F0', '#E8D9BE', '#D6B27A', '#B4543A', '#7B2D2D', '#2E211B', '#3B5A63']

function MockupArt({
  type,
  color,
  tile,
  project,
}: {
  type: MockupId
  color: string
  tile: number
  project: Project
}) {
  const pattern = (
    <pattern id="mock-pattern" width={tile} height={tile} patternUnits="userSpaceOnUse">
      <g transform={`scale(${tile / project.canvasSize})`}>
        <g dangerouslySetInnerHTML={{ __html: renderElementsMarkup(project.elements) }} />
      </g>
    </pattern>
  )
  const ink = '#2E211B'

  return (
    <svg viewBox="0 0 400 400" className="h-full w-full" role="img" aria-label="Макет изделия">
      <defs>{pattern}</defs>
      <rect width="400" height="400" rx="24" fill="#F6EFE3" />
      <circle cx="200" cy="200" r="150" fill="#FFFDF8" opacity="0.7" />

      {type === 'tshirt' && (
        <>
          <path
            d="M120 70 85 90 58 145 96 161 112 134 112 330 Q200 352 288 330 L288 134 304 161 342 145 315 90 280 70 Q250 102 200 102 Q150 102 120 70Z"
            fill={color}
            stroke={ink}
            strokeWidth="3"
          />
          <path
            d="M120 70 85 90 58 145 96 161 112 134 112 330 Q200 352 288 330 L288 134 304 161 342 145 315 90 280 70 Q250 102 200 102 Q150 102 120 70Z"
            fill="url(#mock-pattern)"
            opacity="0.92"
          />
          <path d="M162 78 Q200 120 238 78" fill="none" stroke={ink} strokeWidth="4" />
          <rect x="150" y="170" width="100" height="100" fill="url(#mock-pattern)" opacity="0.9" />
        </>
      )}

      {type === 'bag' && (
        <>
          <path d="M140 150 V112 Q200 66 260 112 V150" fill="none" stroke={ink} strokeWidth="12" />
          <rect x="92" y="140" width="216" height="200" rx="14" fill={color} stroke={ink} strokeWidth="3" />
          <rect x="92" y="140" width="216" height="200" rx="14" fill="url(#mock-pattern)" opacity="0.9" />
          <rect x="150" y="205" width="100" height="72" rx="8" fill="#FFFDF8" opacity="0.55" />
          <rect x="150" y="205" width="100" height="72" rx="8" fill="url(#mock-pattern)" opacity="0.95" />
        </>
      )}

      {type === 'mug' && (
        <>
          <path
            d="M288 158 H312 Q350 158 350 200 Q350 242 312 242 H288"
            fill="none"
            stroke={ink}
            strokeWidth="20"
          />
          <path d="M105 120 H290 V278 Q290 318 250 318 H145 Q105 318 105 278Z" fill={color} stroke={ink} strokeWidth="3" />
          <path d="M105 120 H290 V278 Q290 318 250 318 H145 Q105 318 105 278Z" fill="url(#mock-pattern)" opacity="0.9" />
          <ellipse cx="197" cy="122" rx="92" ry="14" fill="#FFFDF8" stroke={ink} strokeWidth="3" />
          <ellipse cx="197" cy="124" rx="78" ry="8" fill="#D9C7A8" />
        </>
      )}

      {type === 'notebook' && (
        <>
          <rect x="124" y="56" width="164" height="288" rx="10" fill={ink} opacity="0.25" transform="translate(8 8)" />
          <rect x="124" y="56" width="164" height="288" rx="10" fill={color} stroke={ink} strokeWidth="3" />
          <rect x="124" y="56" width="164" height="288" rx="10" fill="url(#mock-pattern)" opacity="0.88" />
          <rect x="124" y="56" width="18" height="288" fill={ink} opacity="0.18" />
          <rect x="160" y="100" width="92" height="70" rx="4" fill="#FFFDF8" opacity="0.65" />
          <rect x="160" y="100" width="92" height="70" rx="4" fill="url(#mock-pattern)" />
        </>
      )}

      {type === 'postcard' && (
        <>
          <rect x="52" y="108" width="296" height="184" rx="8" fill={color} stroke={ink} strokeWidth="3" />
          <rect x="66" y="122" width="198" height="156" rx="4" fill="url(#mock-pattern)" opacity="0.92" />
          <rect x="278" y="240" width="56" height="38" rx="3" fill="#FFFDF8" stroke={ink} strokeWidth="2" />
          <path d="M286 268 L304 250 L316 262" fill="none" stroke="#B4543A" strokeWidth="2" />
        </>
      )}

      {type === 'poster' && (
        <>
          <rect x="84" y="42" width="232" height="316" rx="5" fill={color} stroke={ink} strokeWidth="3" />
          <rect x="98" y="56" width="204" height="252" fill="url(#mock-pattern)" opacity="0.92" />
          <rect x="98" y="318" width="204" height="26" fill={ink} opacity="0.85" />
          <text x="200" y="336" textAnchor="middle" fill="#FBF7F0" fontSize="14" letterSpacing="3">
            SAKHAPATTERN
          </text>
        </>
      )}

      {type === 'logo' && (
        <>
          <circle cx="200" cy="200" r="130" fill={color} stroke={ink} strokeWidth="4" />
          <circle cx="200" cy="200" r="112" fill="url(#mock-pattern)" opacity="0.95" />
          <circle cx="200" cy="200" r="58" fill={color} stroke={ink} strokeWidth="3" />
          <circle cx="200" cy="200" r="46" fill="url(#mock-pattern)" opacity="0.95" />
          <text x="200" y="352" textAnchor="middle" fill={ink} fontSize="16" fontFamily="Georgia, serif">
            SakhaPattern
          </text>
        </>
      )}

      {type === 'magnet' && (
        <>
          <circle cx="200" cy="98" r="20" fill={color} stroke={ink} strokeWidth="3" />
          <rect x="100" y="120" width="200" height="190" rx="20" fill={color} stroke={ink} strokeWidth="3" />
          <rect x="100" y="120" width="200" height="190" rx="20" fill="url(#mock-pattern)" opacity="0.92" />
          <rect x="150" y="180" width="100" height="70" rx="8" fill="#FFFDF8" opacity="0.55" />
          <rect x="150" y="180" width="100" height="70" rx="8" fill="url(#mock-pattern)" />
        </>
      )}
    </svg>
  )
}

export function ProductMockup() {
  const { current, projects, openProject, navigate, notify } = useApp()
  const [type, setType] = useState<MockupId>('tshirt')
  const [color, setColor] = useState('#FBF7F0')
  const [tile, setTile] = useState(150)
  const [sourceId, setSourceId] = useState('current')

  const source =
    sourceId === 'current' ? current : projects.find((project) => project.id === sourceId) ?? current
  const active = MOCKUPS.find((mockup) => mockup.id === type) ?? MOCKUPS[0]

  const useCurrent = () => {
    setSourceId('current')
    notify('На макете показан текущий узор')
  }

  return (
    <div className="animate-fade-up mx-auto max-w-[1500px] px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Креативная индустрия"
        title="Орнамент на реальных носителях"
        description="Выберите сохранённый узор и посмотрите, как он будет выглядеть на сувенирной и печатной продукции. Макеты выполнены средствами SVG."
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-card">
          <div className="aspect-square max-h-[620px] p-4 sm:p-8">
            <MockupArt type={type} color={color} tile={tile} project={source} />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-4">
            <div>
              <h3 className="font-display text-lg text-ink">{active.label}</h3>
              <p className="text-xs text-muted">{active.description}</p>
            </div>
            <span className="rounded-lg bg-sand px-3 py-1.5 text-xs text-ink/80">Узор: {source.name}</span>
          </div>
        </div>

        <div className="space-y-5">
          <Panel title="Изделие" subtitle="Выберите макет для примерки.">
            <div className="grid grid-cols-2 gap-2">
              {MOCKUPS.map((mockup) => (
                <button
                  key={mockup.id}
                  type="button"
                  onClick={() => setType(mockup.id)}
                  className={cx(
                    'rounded-xl border px-3 py-2.5 text-xs font-medium transition-all',
                    type === mockup.id
                      ? 'border-ink bg-ink text-cream shadow-card'
                      : 'border-line bg-parchment text-ink/75 hover:border-terracotta/50',
                  )}
                >
                  {mockup.label}
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Узор и цвет" subtitle="Источник узора и цвет изделия.">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-ink/80">Источник узора</span>
              <select
                value={sourceId}
                onChange={(event) => setSourceId(event.target.value)}
                className="w-full rounded-lg border border-line bg-parchment px-3 py-2 text-xs text-ink outline-none focus:border-terracotta"
              >
                <option value="current">Текущий холст — {current.name}</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </label>
            {sourceId !== 'current' && (
              <Button size="sm" variant="secondary" className="mt-2" onClick={() => openProject(source.id)}>
                Открыть в редакторе
              </Button>
            )}
            <Button size="sm" variant="secondary" className="mt-2" onClick={useCurrent}>
              Показать текущий узор
            </Button>

            <p className="mb-2 mt-5 text-xs font-semibold text-ink/80">Цвет изделия</p>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((swatch) => (
                <button
                  key={swatch}
                  type="button"
                  onClick={() => setColor(swatch)}
                  aria-label={`Цвет ${swatch}`}
                  className={cx(
                    'h-8 w-8 rounded-full border-2 transition-transform hover:scale-110',
                    color === swatch ? 'border-terracotta ring-2 ring-terracotta/30' : 'border-white shadow-sm',
                  )}
                  style={{ backgroundColor: swatch }}
                />
              ))}
            </div>
            <div className="mt-5">
              <Slider
                label="Масштаб узора"
                value={tile}
                min={60}
                max={320}
                step={10}
                onChange={setTile}
              />
            </div>
            <p className="mt-4 flex items-start gap-2 rounded-lg bg-sand/60 p-3 text-[11px] leading-relaxed text-muted">
              <Icon name="info" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-terracotta" />
              Макеты — условные SVG-иллюстрации для демонстрации пропорций и цвета, а не фотореалистичный рендер.
            </p>
          </Panel>

          <Button className="w-full" onClick={() => navigate('editor')} icon={<Icon name="pen" className="h-4 w-4" />}>
            Создать новый узор
          </Button>
        </div>
      </div>
    </div>
  )
}
