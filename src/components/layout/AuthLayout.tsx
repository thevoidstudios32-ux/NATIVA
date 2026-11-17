import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '@/components/brand/Logo'
import { Photo } from '@/components/ui/photo'
import { photos } from '@/content/photos'

interface AuthLayoutProps {
  eyebrow: string
  title: ReactNode
  subtitle?: ReactNode
  children: ReactNode
  footer?: ReactNode
}

export function AuthLayout({ eyebrow, title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="grid min-h-[100svh] lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-forest-deep lg:block">
        <Photo src={photos.fieldwork} alt="Montanhas envoltas em névoa" className="absolute inset-0" />
        <div className="absolute inset-0 bg-forest-deep/50" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link to="/" aria-label="NATIVA — página inicial"><Logo tagline tone="sand" /></Link>
          <blockquote className="max-w-md">
            <p className="font-serif text-3xl leading-snug text-sand">
              “Olhar com atenção é a primeira forma de cuidado.”
            </p>
            <p className="eyebrow mt-6 text-sand/60">Caderno de campo NATIVA</p>
          </blockquote>
        </div>
      </aside>

      <main className="paper-warm flex flex-col px-5 py-8 md:px-12">
        <Link to="/" className="lg:hidden" aria-label="NATIVA — página inicial"><Logo tagline /></Link>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">
          <p className="eyebrow text-earth-deep">{eyebrow}</p>
          <h1 className="mt-4 text-4xl leading-tight md:text-[2.75rem]">{title}</h1>
          {subtitle && <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{subtitle}</p>}
          <div className="mt-10 animate-rise">{children}</div>
          {footer && <div className="mt-8 border-t border-line pt-6 text-sm text-ink-soft">{footer}</div>}
        </div>
      </main>
    </div>
  )
}
