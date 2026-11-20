import { useState } from 'react'
import { Header } from './components/layout/Header'
import { Sidebar } from './components/layout/Sidebar'
import { HomePage } from './components/home/HomePage'
import { OrnamentGallery } from './components/catalog/OrnamentGallery'
import { OrnamentEditor } from './components/editor/OrnamentEditor'
import { ProductMockup } from './components/mocks/ProductMockup'
import { SavedProjects } from './components/gallery/SavedProjects'
import { EducationSection } from './components/education/EducationSection'
import { ToastHost } from './components/ui'
import { useApp } from './context/AppContext'

export default function App() {
  const { page } = useApp()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-cream text-ink">
      <Header mobileOpen={mobileOpen} onToggleMenu={() => setMobileOpen((value) => !value)} />
      <div className="mx-auto flex max-w-[1600px]">
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <main className="min-w-0 flex-1">
          {page === 'home' && <HomePage />}
          {page === 'catalog' && <OrnamentGallery />}
          {page === 'editor' && <OrnamentEditor />}
          {page === 'mockups' && <ProductMockup />}
          {page === 'gallery' && <SavedProjects />}
          {page === 'education' && <EducationSection />}
        </main>
      </div>
      <footer className="border-t border-line bg-parchment/70">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-3 px-4 py-6 text-xs text-muted sm:px-6 lg:px-8">
          <span>© SakhaPattern · «Традиции в каждом пикселе»</span>
          <span>Учебный цифровой конструктор · данные хранятся локально в браузере</span>
        </div>
      </footer>
      <ToastHost />
    </div>
  )
}
