import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const links = [
  { href: '#proposta', label: 'Proposta' },
  { href: '#como-funciona', label: 'Como funciona' },
  { href: '#mapa', label: 'Mapa' },
  { href: '#catalogo', label: 'Catálogo' },
  { href: '#comunidade', label: 'Comunidade' },
]

/** Cabeçalho público. `overlay` = transparente sobre o hero até rolar a página. */
export function PublicHeader({ overlay = false }: { overlay?: boolean }) {
  const [scrolled, setScrolled] = useState(!overlay)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!overlay) return
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [overlay])

  const solid = scrolled || open
  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-[1000] transition-colors duration-300',
        solid ? 'border-b border-line bg-paper/95 backdrop-blur' : 'bg-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-8">
        <Link to="/" aria-label="NATIVA — página inicial">
          <Logo tagline tone={solid ? 'forest' : 'sand'} />
        </Link>

        {overlay && (
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Seções">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={cn(
                  'text-sm transition-colors',
                  solid ? 'text-ink-soft hover:text-forest' : 'text-sand/85 hover:text-sand',
                )}
              >
                {l.label}
              </a>
            ))}
          </nav>
        )}

        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant={solid ? 'ghost' : 'outline-light'} size="sm">
            <Link to="/entrar">Entrar</Link>
          </Button>
          <Button asChild variant={solid ? 'primary' : 'light'} size="sm">
            <Link to="/cadastro">Criar conta</Link>
          </Button>
        </div>

        <button
          type="button"
          className={cn('grid size-10 place-items-center rounded-md md:hidden', solid ? 'text-forest' : 'text-sand')}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="animate-fade border-t border-line bg-paper px-5 pb-6 pt-2 md:hidden">
          {overlay && (
            <nav className="flex flex-col" aria-label="Seções">
              {links.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="border-b border-line py-3.5 font-serif text-lg text-forest">
                  {l.label}
                </a>
              ))}
            </nav>
          )}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Button asChild variant="outline"><Link to="/entrar">Entrar</Link></Button>
            <Button asChild><Link to="/cadastro">Criar conta</Link></Button>
          </div>
        </div>
      )}
    </header>
  )
}
