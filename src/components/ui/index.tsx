import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { useApp } from '../../context/AppContext'
import { renderElementsMarkup } from '../../lib/exporter'
import type { CanvasElement, ToastMessage } from '../../types'
import { cx } from '../../lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'gold'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: ReactNode
}

const BUTTON_STYLES: Record<ButtonVariant, string> = {
  primary:
    'bg-ink text-cream shadow-card hover:bg-[#46332a] focus-visible:ring-ink/40 active:translate-y-px',
  secondary:
    'bg-white/70 text-ink border border-line hover:border-terracotta/60 hover:bg-white focus-visible:ring-terracotta/30',
  ghost: 'text-ink/75 hover:text-ink hover:bg-ink/5 focus-visible:ring-ink/20',
  danger:
    'bg-wine/10 text-wine border border-wine/25 hover:bg-wine hover:text-white focus-visible:ring-wine/30',
  gold: 'bg-gold text-ink shadow-card hover:bg-[#dcae4c] focus-visible:ring-gold/40 active:translate-y-px',
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cx(
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-45',
        size === 'sm' && 'px-3 py-1.5 text-xs',
        size === 'md' && 'px-4 py-2.5 text-sm',
        size === 'lg' && 'px-6 py-3.5 text-base',
        BUTTON_STYLES[variant],
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  )
}

export function Panel({
  title,
  subtitle,
  actions,
  children,
  className,
}: {
  title?: string
  subtitle?: string
  actions?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cx('rounded-2xl border border-line bg-white/75 p-5 shadow-card', className)}>
      {(title || actions) && (
        <header className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && <h3 className="font-display text-lg text-ink">{title}</h3>}
            {subtitle && <p className="mt-1 text-xs leading-relaxed text-muted">{subtitle}</p>}
          </div>
          {actions}
        </header>
      )}
      {children}
    </section>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  center = false,
}: {
  eyebrow: string
  title: string
  description?: string
  center?: boolean
}) {
  return (
    <div className={cx('max-w-3xl', center && 'mx-auto text-center')}>
      <span className="inline-block rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8a6420]">
        {eyebrow}
      </span>
      <h2 className="mt-4 font-display text-3xl leading-tight text-ink sm:text-4xl">{title}</h2>
      {description && <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">{description}</p>}
    </div>
  )
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  suffix = '',
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  suffix?: string
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center justify-between text-xs font-medium text-ink/80">
        <span>{label}</span>
        <span className="rounded-md bg-sand px-2 py-0.5 font-semibold tabular-nums text-ink">
          {value}
          {suffix}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="slider-track w-full"
      />
    </label>
  )
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  className,
}: {
  options: Array<{ value: T; label: string }>
  value: T
  onChange: (value: T) => void
  className?: string
}) {
  return (
    <div className={cx('flex flex-wrap gap-1.5', className)}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cx(
            'rounded-lg border px-3 py-1.5 text-xs font-medium transition-all',
            value === option.value
              ? 'border-ink bg-ink text-cream shadow-sm'
              : 'border-line bg-white/70 text-ink/70 hover:border-terracotta/50 hover:text-ink',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

const ICON_PATHS: Record<string, ReactNode> = {
  home: <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </>
  ),
  pen: (
    <>
      <path d="m15 5 4 4L8 20H4v-4z" />
      <path d="m13 7 4 4" />
    </>
  ),
  shirt: (
    <path d="M8 3 4 5l-2 5 3 1v10h14V11l3-1-2-5-4-2a4 4 0 0 1-8 0z" />
  ),
  folder: <path d="M3 6a2 2 0 0 1 2-2h4l2 3h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
  book: (
    <>
      <path d="M4 4h7a3 3 0 0 1 3 3v13a3 3 0 0 0-3-3H4z" />
      <path d="M20 4h-3a3 3 0 0 0-3 3v13a3 3 0 0 1 3-3h3z" />
    </>
  ),
  flask: (
    <>
      <path d="M9 3h6M10 3v6L5 19a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-10V3" />
      <path d="M7 15h10" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  trash: (
    <>
      <path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14" />
    </>
  ),
  copy: (
    <>
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    </>
  ),
  download: <path d="M12 3v12m0 0 5-5m-5 5-5-5M4 19h16" />,
  save: (
    <>
      <path d="M5 3h11l3 3v15H5z" />
      <path d="M8 3v6h8V3M8 21v-7h8v7" />
    </>
  ),
  sparkles: (
    <>
      <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
      <path d="M19 16.5 20 19l2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z" />
    </>
  ),
  zoomIn: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 5 5M10.5 7.5v6M7.5 10.5h6" />
    </>
  ),
  zoomOut: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 5 5M7.5 10.5h6" />
    </>
  ),
  rotate: <path d="M20 11a8 8 0 1 0-2.3 6M20 5v6h-6" />,
  flipH: <path d="M12 3v18M8 7 3 12l5 5zM16 7l5 5-5 5z" />,
  flipV: <path d="M3 12h18M7 8 12 3l5 5zM7 16l5 5 5-5z" />,
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 5 5" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6 6 18" />,
  check: <path d="m5 12 5 5L20 7" />,
  chevron: <path d="m9 6 6 6-6 6" />,
  palette: (
    <>
      <path d="M12 3a9 9 0 1 0 0 18c1.7 0 2.5-1.2 2.5-2.3 0-1.6-1.2-2.2-1.2-3.4 0-1 .8-1.8 1.9-1.8H18a3 3 0 0 0 3-3A9 9 0 0 0 12 3z" />
      <circle cx="7.5" cy="11" r="1" />
      <circle cx="10" cy="7" r="1" />
      <circle cx="15" cy="7.5" r="1" />
    </>
  ),
  sliders: <path d="M4 7h10M18 7h2M4 17h4M12 17h8M14 4v6M8 14v6" />,
  eye: (
    <>
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z" />
      <circle cx="12" cy="12" r="2.5" />
    </>
  ),
  refresh: <path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v6h-6" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  arrowRight: <path d="M5 12h14m0 0-5-5m5 5-5 5" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
}

export function Icon({ name, className }: { name: keyof typeof ICON_PATHS | string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cx('h-5 w-5 shrink-0', className)}
      aria-hidden="true"
    >
      {ICON_PATHS[name] ?? ICON_PATHS.info}
    </svg>
  )
}

export function MotifPreview({
  elements,
  canvasSize = 600,
  className,
  padding = 0,
}: {
  elements: CanvasElement[]
  canvasSize?: number
  className?: string
  padding?: number
}) {
  return (
    <svg
      viewBox={`${-padding} ${-padding} ${canvasSize + padding * 2} ${canvasSize + padding * 2}`}
      className={cx('h-full w-full', className)}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <g dangerouslySetInnerHTML={{ __html: renderElementsMarkup(elements) }} />
    </svg>
  )
}

const TOAST_STYLES: Record<ToastMessage['kind'], string> = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  info: 'border-line bg-white text-ink',
  error: 'border-wine/30 bg-wine/10 text-wine',
}

export function ToastHost() {
  const { toasts, dismissToast } = useApp()
  if (toasts.length === 0) return null
  return (
    <div className="fixed bottom-5 right-5 z-[100] flex w-[min(92vw,340px)] flex-col gap-2">
      {toasts.map((toast) => (
        <button
          key={toast.id}
          type="button"
          onClick={() => dismissToast(toast.id)}
          className={cx(
            'flex animate-fade-up items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm shadow-lift',
            TOAST_STYLES[toast.kind],
          )}
        >
          <Icon name={toast.kind === 'error' ? 'info' : 'check'} className="mt-0.5 h-4 w-4" />
          <span className="flex-1">{toast.text}</span>
          <Icon name="close" className="h-3.5 w-3.5 opacity-50" />
        </button>
      ))}
    </div>
  )
}
