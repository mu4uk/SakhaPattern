import { useMemo, useState } from 'react'
import { generatePattern, SYMMETRY_LABELS } from '../../lib/patternGenerator'
import type { SymmetryMode } from '../../types'
import { Icon, MotifPreview, SectionHeading, Segmented, Slider } from '../ui'

const TOPICS = [
  {
    icon: 'grid',
    title: 'Геометрическая основа',
    text: 'В визуальных интерпретациях орнамента преобладают ромбы, треугольники, кресты, ломаные линии и их сочетания. Такие формы легко вписать в цифровую сетку и повторять.',
  },
  {
    icon: 'sparkles',
    title: 'Симметрия и повторение',
    text: 'Осевая, центральная и радиальная симметрия помогают собрать отдельный мотив в целостную композицию. В конструкторе эти правила реализованы как алгоритмы.',
  },
  {
    icon: 'palette',
    title: 'Цвет и контраст',
    text: 'Сочетание тёплых земных оттенков и светлого фона делает узор читаемым. Палитры в приложении — современные дизайн-решения, а не реконструкция исторической раскраски.',
  },
  {
    icon: 'shirt',
    title: 'От ДПИ к графическому дизайну',
    text: 'Орнаментальные принципы применяются в текстиле, упаковке, полиграфии и цифровых медиа. Это практическая область для начинающего дизайнера.',
  },
]

const MODES: SymmetryMode[] = ['horizontal', 'vertical', 'central', 'radial', 'mirror']

export function EducationSection() {
  const [mode, setMode] = useState<SymmetryMode>('radial')
  const [repeats, setRepeats] = useState(8)

  const demo = useMemo(
    () =>
      generatePattern({
        symmetry: mode,
        repeats,
        shapeId: 'rhombus',
        paletteId: 'earth',
        direction: mode === 'vertical' ? 'vertical' : 'center',
        spacing: 0,
        elementSize: 58,
        rotationStep: 0,
        jitter: 0,
      }),
    [mode, repeats],
  )

  const borderDemo = useMemo(
    () =>
      generatePattern({
        symmetry: 'horizontal',
        repeats: 9,
        shapeId: 'zigzag',
        paletteId: 'ash',
        direction: 'horizontal',
        spacing: 0,
        elementSize: 44,
        rotationStep: 0,
        jitter: 0,
      }),
    [],
  )

  return (
    <div className="animate-fade-up mx-auto max-w-[1500px] px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Образование"
        title="Мир якутского орнамента"
        description="Обзор визуальных особенностей орнаментальных композиций и того, как геометрические правила превращаются в цифровой алгоритм."
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-terracotta">
            Введение
          </span>
          <h2 className="mt-2 font-display text-2xl text-ink">Орнамент как визуальный язык формы</h2>
          <p className="mt-4 text-sm leading-7 text-muted">
            Орнаментальное искусство народа саха — обширная тема, требующая работы с источниками и
            консультаций со специалистами. Этот раздел не является историческим исследованием:
            здесь рассматривается только то, что можно увидеть и описать — геометрия, ритм,
            симметрия и повторение.
          </p>
          <p className="mt-3 text-sm leading-7 text-muted">
            Все мотивы в приложении являются авторскими учебными интерпретациями. Они помогают
            понять принцип построения узора и попробовать его в современном дизайне, не выдавая
            выдуманные значения за традиционные.
          </p>
          <div className="mt-6 flex items-start gap-3 rounded-xl bg-sand/60 p-4 text-xs leading-relaxed text-ink/75">
            <Icon name="info" className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" />
            Для серьёзного исторического исследования используйте научные публикации и материалы
            музеев; данный проект — цифровой инструмент и учебная интерпретация.
          </div>
        </article>

        <div className="relative min-h-[300px] overflow-hidden rounded-3xl bg-ink p-6 shadow-lift">
          <div className="absolute -right-16 -top-16 h-72 w-72 opacity-20">
            <MotifPreview elements={demo} />
          </div>
          <div className="relative">
            <h3 className="font-display text-2xl text-cream">Повторение создаёт ритм</h3>
            <p className="mt-3 text-sm leading-relaxed text-cream/70">
              Один и тот же мотив по-разному «звучит» в ряду, по кругу и при зеркальном отражении.
              Попробуйте переключить тип симметрии ниже.
            </p>
            <div className="mt-6 h-48 rounded-2xl bg-parchment p-3">
              <MotifPreview elements={demo} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TOPICS.map((topic) => (
          <article key={topic.title} className="rounded-2xl border border-line bg-white/75 p-5 shadow-card">
            <Icon name={topic.icon} className="h-5 w-5 text-terracotta" />
            <h3 className="mt-4 font-display text-lg text-ink">{topic.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{topic.text}</p>
          </article>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
          <h2 className="font-display text-2xl text-ink">Интерактивный пример: симметрия</h2>
          <p className="mt-2 text-sm text-muted">
            Измените параметры и наблюдайте, как алгоритм перестраивает композицию.
          </p>
          <div className="mt-5">
            <Segmented
              options={MODES.map((value) => ({ value, label: SYMMETRY_LABELS[value] }))}
              value={mode}
              onChange={setMode}
            />
          </div>
          <div className="mt-5 max-w-sm">
            <Slider label="Количество повторов" value={repeats} min={2} max={16} onChange={setRepeats} />
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="aspect-square rounded-2xl border border-line bg-cream p-4">
              <MotifPreview elements={demo} />
            </div>
            <div className="aspect-square rounded-2xl border border-line bg-cream p-4">
              <MotifPreview elements={borderDemo} />
            </div>
          </div>
          <p className="mt-3 text-xs text-muted">
            Слева — выбранный тип симметрии, справа — пример горизонтального ритма из ломаных линий.
          </p>
        </div>

        <div className="space-y-5">
          <div className="rounded-3xl border border-line bg-sand/50 p-6">
            <h3 className="font-display text-xl text-ink">Где используется сегодня</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              {['Текстиль и одежда', 'Упаковка и этикетки', 'Полиграфия и открытки', 'Интерфейсы и иконки', 'Сувенирная продукция'].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Icon name="check" className="h-4 w-4 text-terracotta" />
                    {item}
                  </li>
                ),
              )}
            </ul>
          </div>
          <div className="rounded-3xl bg-ink p-6 text-cream">
            <h3 className="font-display text-xl">Практический вывод</h3>
            <p className="mt-3 text-sm leading-relaxed text-cream/70">
              Цифровой конструктор позволяет быстро проверять идеи: менять масштаб, цвет и
              симметрию, не перерисовывая узор вручную. Это снижает порог входа в дизайн.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
