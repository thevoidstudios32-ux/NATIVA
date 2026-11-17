import { Link, NavLink, Outlet } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { Button } from '@/components/ui/button'
import { accountNav, NEW_OBSERVATION_PATH, primaryNav, type NavItem } from '@/content/navigation'
import { cn } from '@/lib/utils'

/** Estrutura da área logada: menu lateral no desktop, barra inferior no celular. */
export function AppLayout() {
  return (
    <div className="min-h-[100svh] bg-paper lg:grid lg:grid-cols-[264px_1fr]">
      <Sidebar />
      <div className="flex min-h-[100svh] flex-col">
        <MobileTopBar />
        <main className="flex-1 pb-28 lg:pb-0">
          <Outlet />
        </main>
      </div>
      <MobileBottomNav />
    </div>
  )
}

function Sidebar() {
  return (
    <aside className="paper sticky top-0 hidden h-[100svh] flex-col border-r border-line lg:flex">
      <div className="px-6 pb-6 pt-7">
        <Link to="/inicio" aria-label="NATIVA — início"><Logo tagline /></Link>
      </div>
      <div className="px-4">
        <Button asChild size="lg" className="w-full justify-start">
          <Link to={NEW_OBSERVATION_PATH}><Plus /> Nova observação</Link>
        </Button>
      </div>
      <nav className="mt-8 flex-1 space-y-0.5 overflow-y-auto px-3" aria-label="Navegação principal">
        <p className="eyebrow px-3 pb-2 text-ink-soft/70">Campo</p>
        {primaryNav.map((item) => <SideLink key={item.to} item={item} />)}
        <p className="eyebrow px-3 pb-2 pt-6 text-ink-soft/70">Conta</p>
        {accountNav.map((item) => <SideLink key={item.to} item={item} />)}
      </nav>
      <p className="px-6 py-5 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft/60">
        Observe · Registre · Descubra
      </p>
    </aside>
  )
}

function SideLink({ item }: { item: NavItem }) {
  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-md px-3 py-2.5 text-[14.5px] transition-colors',
          isActive ? 'bg-forest text-sand' : 'text-ink hover:bg-forest/5 hover:text-forest',
        )
      }
    >
      <item.icon className="size-[18px]" strokeWidth={1.6} />
      {item.label}
    </NavLink>
  )
}

function MobileTopBar() {
  return (
    <header className="sticky top-0 z-[1000] flex h-14 items-center justify-between border-b border-line bg-paper/95 px-4 backdrop-blur lg:hidden">
      <Link to="/inicio" aria-label="NATIVA — início"><Logo /></Link>
      <div className="flex items-center gap-1">
        {accountNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            aria-label={item.label}
            className={({ isActive }) =>
              cn('grid size-10 place-items-center rounded-md', isActive ? 'text-forest' : 'text-ink-soft')
            }
          >
            <item.icon className="size-5" strokeWidth={1.6} />
          </NavLink>
        ))}
      </div>
    </header>
  )
}

function MobileBottomNav() {
  const items = primaryNav.filter((i) => i.mobile)
  const left = items.slice(0, 2)
  const right = items.slice(2, 4)
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-[1000] border-t border-line bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
      aria-label="Navegação principal"
    >
      <div className="grid h-16 grid-cols-5 items-center">
        {left.map((i) => <BottomLink key={i.to} item={i} />)}
        <div className="flex justify-center">
          <Link
            to={NEW_OBSERVATION_PATH}
            aria-label="Nova observação"
            className="-mt-7 grid size-14 place-items-center rounded-full bg-forest text-sand shadow-[0_6px_18px_-6px_rgba(38,61,50,0.6)] ring-4 ring-paper transition-transform active:scale-95"
          >
            <Plus className="size-6" />
          </Link>
        </div>
        {right.map((i) => <BottomLink key={i.to} item={i} />)}
      </div>
    </nav>
  )
}

function BottomLink({ item }: { item: NavItem }) {
  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        cn('flex flex-col items-center gap-1 text-[10.5px]', isActive ? 'text-forest' : 'text-ink-soft')
      }
    >
      <item.icon className="size-5" strokeWidth={1.6} />
      <span className="truncate">{item.label.replace('Explorar espécies', 'Espécies').replace('Meu diário', 'Diário')}</span>
    </NavLink>
  )
}
