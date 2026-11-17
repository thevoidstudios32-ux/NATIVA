import { Link } from 'react-router-dom'
import { Logo } from '@/components/brand/Logo'

export function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-forest-deep text-sand/80">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-12 md:px-8">
        <div className="md:col-span-5">
          <Logo tagline tone="sand" />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-sand/65">
            Plataforma colaborativa de observação e documentação da natureza. Qualquer pessoa pode contribuir para
            registrar a biodiversidade.
          </p>
        </div>
        <FooterCol
          title="Plataforma"
          links={[
            { to: '/especies', label: 'Catálogo de espécies' },
            { to: '/comunidade', label: 'Comunidade' },
            { to: '/mapa', label: 'Mapa de observações' },
          ]}
        />
        <FooterCol
          title="Conta"
          links={[
            { to: '/cadastro', label: 'Criar conta' },
            { to: '/entrar', label: 'Entrar' },
            { to: '/recuperar-senha', label: 'Recuperar senha' },
          ]}
        />
        <div className="md:col-span-3">
          <p className="eyebrow text-earth">Princípios</p>
          <ul className="mt-4 space-y-2.5 text-sm text-sand/65">
            <li>Localização sempre opcional</li>
            <li>Coordenadas públicas aproximadas</li>
            <li>Registros privados por padrão</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-sand/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-xs text-sand/45 md:flex-row md:justify-between md:px-8">
          <span>© {year} NATIVA — Observe. Registre. Descubra.</span>
          <span>Mapas © colaboradores do OpenStreetMap · Fotografias editoriais: Unsplash</span>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div className="md:col-span-2">
      <p className="eyebrow text-earth">{title}</p>
      <ul className="mt-4 space-y-2.5 text-sm">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="text-sand/75 transition-colors hover:text-sand">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
