import { useApp } from '../../context/AppContext'
import type { Page } from '../../types'
import { cx } from '../../lib/utils'
import { Button, Icon } from '../ui'

const QUICK_LINKS: Array<{ page: Page; label: string }> = [
  { page: 'home', label: 'Главная' },
  { page: 'catalog', label: 'Каталог' },
  { page: 'editor', label: 'Конструктор' },
  { page: 'mockups', label: 'Применение' },
]

export function Header({
  mobileOpen,
  onToggleMenu,
}: {
  mobileOpen: boolean
  onToggleMenu: () => void
}) {
  const { page, navigate } = useApp()

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-cream/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1600px] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate('home')}
          className="group flex items-center gap-3 text-left"
          aria-label="SakhaPattern — на главную"
        >
          <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-ink shadow-card transition-transform group-hover:-rotate-6">
            <svg viewBox="0 0 40 40" className="h-7 w-7" aria-hidden="true">
              <path d="M20 3 33 20 20 37 7 20Z" fill="none" stroke="#C99A3D" strokeWidth="2.4" />
              <path d="M20 10 27 20 20 30 13 20Z" fill="#B4543A" />
              <circle cx="20" cy="20" r="3" fill="#FBF7F0" />
            </svg>
          </span>
          <span className="leading-tight">
            <span className="block font-display text-xl tracking-tight text-ink">SakhaPattern</span>
            <span className="hidden text-[10px] uppercase tracking-[0.18em] text-muted sm:block">
              Традиции в каждом пикселе
            </span>
          </span>
        </button>

        <nav className="ml-8 hidden items-center gap-1 lg:flex">
          {QUICK_LINKS.map((link) => (
            <button
              key={link.page}
              type="button"
              onClick={() => navigate(link.page)}
              className={cx(
                'rounded-lg px-3.5 py-2 text-sm font-medium transition-colors',
                page === link.page
                  ? 'bg-white text-ink shadow-sm'
                  : 'text-muted hover:bg-white/60 hover:text-ink',
              )}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button
            size="sm"
            className="hidden sm:inline-flex"
            icon={<Icon name="sparkles" className="h-4 w-4" />}
            onClick={() => navigate('editor')}
          >
            Создать орнамент
          </Button>
          <button
            type="button"
            onClick={onToggleMenu}
            aria-expanded={mobileOpen}
            aria-label="Открыть меню разделов"
            className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-white/70 text-ink lg:hidden"
          >
            <Icon name={mobileOpen ? 'close' : 'menu'} />
          </button>
        </div>
      </div>
    </header>
  )
}
