import { useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import { generatePattern } from '../../lib/patternGenerator'
import { SHAPES } from '../../lib/shapes'
import { Button, Icon, MotifPreview, SectionHeading } from '../ui'

const FEATURES = [
  {
    icon: 'grid',
    title: 'Библиотека мотивов',
    text: 'Каталог геометрических, растительных и зооморфных мотивов с описаниями и пометками об учебной реконструкции.',
  },
  {
    icon: 'sparkles',
    title: 'Алгоритмическая генерация',
    text: 'Симметрия, повторения, палитра и направление — узор собирается автоматически.',
  },
  {
    icon: 'pen',
    title: 'Настоящий редактор',
    text: 'Перемещение, поворот, масштаб, цвет, прозрачность и зеркалирование элементов.',
  },
  {
    icon: 'shirt',
    title: 'Примерка на продукцию',
    text: 'Посмотрите, как узор выглядит на футболке, кружке, сумке, открытке и плакате.',
  },
  {
    icon: 'save',
    title: 'Сохранение работ',
    text: 'Проекты хранятся в браузере: их можно открыть заново и продолжить редактировать.',
  },
  {
    icon: 'download',
    title: 'Экспорт PNG и SVG',
    text: 'Скачивайте готовый дизайн в высоком разрешении с прозрачным или цветным фоном.',
  },
]

const STEPS = [
  { number: '01', title: 'Выберите мотив', text: 'Найдите форму в каталоге или создайте свою с генератором.' },
  { number: '02', title: 'Настройте композицию', text: 'Измените цвет, размер, симметрию и количество повторов.' },
  { number: '03', title: 'Примерьте на изделии', text: 'Посмотрите узор на макете сувенирной продукции.' },
  { number: '04', title: 'Скачайте результат', text: 'Сохраните проект и экспортируйте PNG или SVG.' },
]

export function HomePage() {
  const { navigate } = useApp()

  const heroPattern = useMemo(
    () =>
      generatePattern({
        symmetry: 'radial',
        repeats: 12,
        shapeId: 'rhombus',
        paletteId: 'earth',
        direction: 'radial',
        spacing: 0,
        elementSize: 62,
        rotationStep: 0,
        jitter: 0,
      }),
    [],
  )

  const examples = useMemo(
    () => [
      {
        label: 'Текстиль',
        title: 'Принт на ткани',
        elements: generatePattern({
          symmetry: 'mirror',
          repeats: 6,
          shapeId: 'lattice',
          paletteId: 'north',
          direction: 'horizontal',
          spacing: 0,
          elementSize: 58,
          rotationStep: 0,
          jitter: 0,
        }),
      },
      {
        label: 'Упаковка',
        title: 'Орнаментальная кайма',
        elements: generatePattern({
          symmetry: 'horizontal',
          repeats: 7,
          shapeId: 'zigzag',
          paletteId: 'ash',
          direction: 'horizontal',
          spacing: 0,
          elementSize: 46,
          rotationStep: 0,
          jitter: 0,
        }),
      },
      {
        label: 'Сувениры',
        title: 'Медальон на кружке',
        elements: generatePattern({
          symmetry: 'central',
          repeats: 4,
          shapeId: 'star8',
          paletteId: 'berry',
          direction: 'center',
          spacing: 0,
          elementSize: 62,
          rotationStep: 0,
          jitter: 0,
        }),
      },
    ],
    [],
  )

  return (
    <div className="animate-fade-up">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-32 -top-40 h-[520px] w-[520px] rounded-full bg-gold/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-40 top-40 h-[420px] w-[420px] rounded-full bg-terracotta/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-[1500px] items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-terracotta/25 bg-terracotta/5 px-4 py-1.5 text-xs font-medium text-terracotta">
              <span className="h-1.5 w-1.5 rounded-full bg-terracotta" />
              Цифровой конструктор орнаментов
            </span>
            <h1 className="mt-6 font-display text-[clamp(3rem,7vw,6rem)] leading-[0.95] tracking-tight text-ink">
              Sakha<span className="text-terracotta">Pattern</span>
            </h1>
            <p className="mt-4 font-display text-xl text-ink/80 sm:text-2xl">
              Традиции в каждом пикселе
            </p>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted">
              Изучайте визуальные особенности якутского орнамента, собирайте собственные
              композиции из геометрических, растительных и зооморфных мотивов и применяйте их
              в современном дизайне — прямо в браузере, без регистрации.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                size="lg"
                icon={<Icon name="sparkles" className="h-5 w-5" />}
                onClick={() => navigate('editor')}
              >
                Создать орнамент
              </Button>
              <Button
                size="lg"
                variant="secondary"
                icon={<Icon name="grid" className="h-5 w-5" />}
                onClick={() => navigate('catalog')}
              >
                Изучить орнаменты
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-xs text-muted">
              <span className="flex items-center gap-2">
                <Icon name="check" className="h-4 w-4 text-terracotta" /> Работает локально
              </span>
              <span className="flex items-center gap-2">
                <Icon name="check" className="h-4 w-4 text-terracotta" /> SVG + PNG экспорт
              </span>
              <span className="flex items-center gap-2">
                <Icon name="check" className="h-4 w-4 text-terracotta" /> Данные сохраняются
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[520px]">
            <div className="absolute inset-6 rounded-full bg-gradient-to-br from-gold/25 via-terracotta/10 to-transparent blur-2xl" />
            <div className="relative aspect-square rounded-[38%] border border-line bg-parchment/80 p-6 shadow-lift">
              <div className="absolute inset-0 animate-slow-spin rounded-[38%] border border-dashed border-gold/40" />
              <MotifPreview elements={heroPattern} className="relative animate-float" padding={20} />
              <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-cream bg-ink shadow-lift" />
              <div className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gold">
                <div
                  className="h-6 w-6"
                  dangerouslySetInnerHTML={{
                    __html: `<svg viewBox="-50 -50 100 100" class="h-6 w-6">${SHAPES.rhombus.markup('#2E211B', '#FBF7F0')}</svg>`,
                  }}
                />
              </div>
            </div>
            <div className="absolute -left-6 top-10 hidden h-24 w-24 rotate-[-12deg] rounded-2xl border border-line bg-white/90 p-3 shadow-card sm:block">
              <MotifPreview
                elements={[{ ...heroPattern[0], size: 70 }]}
                className="h-full w-full"
              />
            </div>
            <div className="absolute -right-4 bottom-8 hidden h-28 w-28 rotate-[9deg] rounded-2xl border border-line bg-white/90 p-3 shadow-card sm:block">
              <MotifPreview
                elements={[{ ...heroPattern[2], size: 74 }]}
                className="h-full w-full"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Возможности"
          title="Инструмент для творчества и дизайна"
          description="От первого мотива до готового макета — все этапы в одном приложении."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <article
              key={feature.title}
              className="group rounded-2xl border border-line bg-white/70 p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-terracotta/40 hover:shadow-lift"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-sand text-terracotta transition-colors group-hover:bg-terracotta group-hover:text-white">
                <Icon name={feature.icon} />
              </span>
              <h3 className="mt-5 font-display text-xl text-ink">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-sand/50">
        <div className="mx-auto max-w-[1500px] px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Метод"
            title="От традиции к современному дизайну"
            description="Цифровой конструктор не заменяет изучение традиции, а делает мотивы понятнее и доступнее для экспериментов."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <div key={step.number} className="relative rounded-2xl bg-parchment/80 p-5 shadow-card">
                <span className="font-display text-4xl text-gold/70">{step.number}</span>
                <h3 className="mt-2 font-display text-lg text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Креативная индустрия"
            title="Где может работать орнамент"
            description="Учебные примеры применения узоров в современных медиа и продуктах."
          />
          <Button variant="secondary" onClick={() => navigate('mockups')} icon={<Icon name="arrowRight" className="h-4 w-4" />}>
            Открыть макеты
          </Button>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {examples.map((example) => (
            <article key={example.title} className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
              <div className="flex aspect-[4/3] items-center justify-center bg-cream p-8">
                <MotifPreview elements={example.elements} />
              </div>
              <div className="border-t border-line px-5 py-4">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-terracotta">
                  {example.label}
                </span>
                <h3 className="mt-1 font-display text-lg text-ink">{example.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-4 pb-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-ink px-6 py-12 text-cream shadow-lift sm:px-12">
          <div className="absolute -right-10 -top-16 h-64 w-64 opacity-10">
            <MotifPreview elements={heroPattern} />
          </div>
          <div className="relative max-w-2xl">
            <h2 className="font-display text-3xl sm:text-4xl">Готовы создать свой узор?</h2>
            <p className="mt-3 text-sm leading-relaxed text-cream/70">
              Выберите мотив, настройте симметрию и скачайте готовый дизайн за несколько минут.
            </p>
            <Button variant="gold" size="lg" className="mt-6" onClick={() => navigate('editor')}>
              Перейти в конструктор
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
