import { useApp } from '../../context/AppContext'
import type { Page } from '../../types'
import { cx } from '../../lib/utils'
import { Icon } from '../ui'

const NAV_ITEMS: Array<{ page: Page; label: string; icon: string; hint: string }> = [
  { page: 'home', label: 'Главная', icon: 'home', hint: 'О проекте' },
  { page: 'catalog', label: 'Каталог орнаментов', icon: 'grid', hint: 'Мотивы и описания' },
  { page: 'editor', label: 'Конструктор', icon: 'pen', hint: 'Создание узора' },
  { page: 'mockups', label: 'Применение', icon: 'shirt', hint: 'Креативная индустрия' },
  { page: 'gallery', label: 'Галерея работ', icon: 'folder', hint: 'Сохранённые проекты' },
  { page: 'education', label: 'Мир орнамента', icon: 'book', hint: 'Образовательный раздел' },
]

export function Sidebar({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }) {
  const { page, navigate } = useApp()

  const go = (next: Page) => {
    navigate(next)
    onClose()
  }

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Закрыть меню"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-sm lg:hidden"
        />
      )}
      <aside
        className={cx(
          'fixed bottom-0 left-0 top-[72px] z-50 w-[272px] overflow-y-auto border-r border-line bg-parchment/95 px-4 py-6 backdrop-blur-xl transition-transform duration-300 lg:sticky lg:top-[72px] lg:z-0 lg:h-[calc(100vh-72px)] lg:translate-x-0',
          mobileOpen ? 'translate-x-0 shadow-lift' : '-translate-x-full',
        )}
      >
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
          Разделы
        </p>
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.page}
              type="button"
              onClick={() => go(item.page)}
              className={cx(
                'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all',
                page === item.page
                  ? 'bg-ink text-cream shadow-card'
                  : 'text-ink/75 hover:bg-sand/70 hover:text-ink',
              )}
            >
              <Icon
                name={item.icon}
                className={cx('h-[18px] w-[18px]', page === item.page ? 'text-gold' : 'text-terracotta')}
              />
              <span className="flex-1">
                <span className="block text-sm font-medium">{item.label}</span>
                <span
                  className={cx(
                    'block text-[11px]',
                    page === item.page ? 'text-cream/60' : 'text-muted/80',
                  )}
                >
                  {item.hint}
                </span>
              </span>
              {page === item.page && <Icon name="chevron" className="h-4 w-4 text-gold" />}
            </button>
          ))}
        </nav>

        <div className="mt-8 px-3 text-[11px] leading-relaxed text-muted/80">
          <p className="font-semibold text-ink/70">SakhaPattern · v1.0</p>
          <p>Локальное приложение без регистрации и серверной базы данных.</p>
        </div>
      </aside>
    </>
  )
}
