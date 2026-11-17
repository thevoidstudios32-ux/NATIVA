import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Camera, EyeOff, FolderOpen, MapPin, NotebookPen, Search, ShieldCheck, Users, BookOpenText,
} from 'lucide-react'
import { PublicHeader } from '@/components/layout/PublicHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { Button } from '@/components/ui/button'
import { Photo } from '@/components/ui/photo'
import { photos } from '@/content/photos'
import { categories } from '@/content/categories'

const PreviewMap = lazy(() => import('@/components/landing/PreviewMap').then((m) => ({ default: m.PreviewMap })))

export default function Landing() {
  return (
    <div className="bg-paper">
      <PublicHeader overlay />
      <Hero />
      <Proposal />
      <HowItWorks />
      <Features />
      <MapPreview />
      <CatalogPreview />
      <Community />
      <ClosingCta />
      <SiteFooter />
    </div>
  )
}

/* ───────────────────────── Hero ───────────────────────── */
function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-forest-deep">
      <Photo src={photos.hero} alt="Floresta com luz filtrada entre as copas das árvores" eager className="absolute inset-0 -z-10" imgClassName="scale-105" />
      {/* Escurecimento sutil para legibilidade */}
      <div className="absolute inset-0 -z-10 bg-forest-deep/45" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-forest-deep/85 to-transparent" />

      <div className="mx-auto w-full max-w-7xl px-5 pb-14 pt-32 md:px-8 md:pb-20">
        <p className="eyebrow animate-rise text-sand/80">Nature Observation Platform</p>
        <h1 className="mt-5 max-w-4xl animate-rise font-serif text-[3.25rem] leading-[0.98] text-sand [animation-delay:80ms] sm:text-7xl md:text-[6.5rem]">
          Observe. Registre.
          <br />
          <em className="font-light text-earth">Descubra.</em>
        </h1>
        <div className="mt-10 grid animate-rise gap-10 [animation-delay:160ms] md:grid-cols-12 md:items-end">
          <p className="max-w-xl text-[17px] leading-relaxed text-sand/85 md:col-span-6">
            Um diário de campo coletivo para documentar a biodiversidade. Fotografe, localize e descreva o que você
            encontra — e contribua, junto a uma comunidade de observadores, para conhecer melhor a natureza ao redor.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row md:col-span-6 md:justify-end">
            <Button asChild variant="light" size="lg">
              <Link to="/cadastro">
                Criar conta gratuita <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="outline-light" size="lg">
              <Link to="/especies">Explorar a plataforma</Link>
            </Button>
          </div>
        </div>
        <div className="mt-14 flex items-center gap-4 border-t border-sand/15 pt-5 font-mono text-[10.5px] uppercase tracking-[0.2em] text-sand/50">
          <span>Fig. 01</span>
          <span className="h-px w-8 bg-sand/30" />
          <span>Floresta — luz da manhã</span>
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── Proposta ───────────────────────── */
function Proposal() {
  return (
    <section id="proposta" className="paper-warm scroll-mt-20">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 md:grid-cols-12 md:px-8 md:py-32">
        <div className="md:col-span-4">
          <SectionLabel index="01" label="A proposta" />
        </div>
        <div className="md:col-span-8">
          <p className="font-serif text-3xl leading-[1.25] text-forest md:text-[2.6rem]">
            Toda observação importa. Um pássaro no quintal, uma flor à beira da trilha, um inseto na janela —
            cada registro bem documentado ajuda a contar a história da vida em um lugar.
          </p>
          <div className="mt-12 grid gap-8 text-[15px] leading-relaxed text-ink-soft sm:grid-cols-2">
            <p>
              A NATIVA reúne o rigor de um guia de campo com a simplicidade de um caderno de anotações. Você registra
              o que viu, quando e onde, com fotografias e detalhes que fazem sentido para cada grupo de organismos.
            </p>
            <p>
              Não é preciso ser especialista. Registros podem começar com identificação pendente, e a comunidade pode
              sugerir identificações. Você decide o que é público e o que permanece no seu diário.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── Como funciona ───────────────────────── */
const steps = [
  {
    n: '01',
    title: 'Observe',
    icon: Search,
    text: 'Saia a campo — ou simplesmente olhe pela janela. Anote espécie, comportamento, ambiente e horário.',
  },
  {
    n: '02',
    title: 'Registre',
    icon: Camera,
    text: 'Fotografe, marque a localização no mapa (se quiser) e preencha os campos próprios de cada categoria.',
  },
  {
    n: '03',
    title: 'Descubra',
    icon: BookOpenText,
    text: 'Consulte fichas de espécies, compare com observações públicas e organize descobertas em coleções.',
  },
]

function HowItWorks() {
  return (
    <section id="como-funciona" className="scroll-mt-20 border-t border-line">
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <div className="grid gap-6 md:grid-cols-12">
          <div className="md:col-span-4">
            <SectionLabel index="02" label="Como funciona" />
          </div>
          <h2 className="text-4xl leading-tight md:col-span-8 md:text-5xl">
            Do encontro ao registro, <em className="text-sage">em três gestos.</em>
          </h2>
        </div>
        <ol className="mt-16 grid border-t border-line md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.n} className={`py-10 md:px-8 ${i > 0 ? 'border-t border-line md:border-l md:border-t-0' : 'md:pl-0'}`}>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs tracking-[0.2em] text-earth-deep">{s.n}</span>
                <s.icon className="size-5 text-sage" strokeWidth={1.5} />
              </div>
              <h3 className="mt-8 text-3xl">{s.title}</h3>
              <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-ink-soft">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ───────────────────────── Funcionalidades ───────────────────────── */
const features = [
  { icon: NotebookPen, title: 'Registro de campo', text: 'Formulário adaptado a cada categoria — aves, plantas, mamíferos e mais. Salve rascunhos e complete depois.' },
  { icon: MapPin, title: 'Mapa de observações', text: 'Seu mapa pessoal e o mapa público da comunidade, com filtros por categoria, espécie e período.' },
  { icon: BookOpenText, title: 'Catálogo de espécies', text: 'Fichas com nome popular e científico, família, habitat, distribuição e referências.' },
  { icon: FolderOpen, title: 'Coleções', text: 'Agrupe registros por trilha, projeto de estudo, estação do ano ou o que fizer sentido para você.' },
  { icon: EyeOff, title: 'Privacidade por registro', text: 'Cada observação pode ser privada ou pública. Registros privados nunca aparecem para outras pessoas.' },
  { icon: ShieldCheck, title: 'Proteção geográfica', text: 'Coordenadas públicas são aproximadas, e espécies vulneráveis têm a localização protegida.' },
]

function Features() {
  return (
    <section className="paper border-y border-line">
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <div className="grid gap-6 md:grid-cols-12">
          <div className="md:col-span-4">
            <SectionLabel index="03" label="Recursos" />
          </div>
          <h2 className="text-4xl leading-tight md:col-span-8 md:text-5xl">
            Ferramentas de documentação, <em className="text-sage">sem ruído.</em>
          </h2>
        </div>
        <div className="mt-16 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <article key={f.title} className="group bg-paper p-8 transition-colors duration-300 hover:bg-sand/40">
              <f.icon className="size-6 text-forest" strokeWidth={1.4} />
              <h3 className="mt-6 text-2xl">{f.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{f.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── Mapa ───────────────────────── */
function MapPreview() {
  return (
    <section id="mapa" className="scroll-mt-20">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 md:grid-cols-12 md:items-center md:px-8 md:py-32">
        <div className="md:col-span-5">
          <SectionLabel index="04" label="Mapa de observações" />
          <h2 className="mt-6 text-4xl leading-tight md:text-5xl">
            Um mapa vivo, <em className="text-sage">construído por quem observa.</em>
          </h2>
          <p className="mt-6 text-[15px] leading-relaxed text-ink-soft">
            Cada registro público se torna um ponto no mapa da comunidade. A localização é sempre opcional e só é
            capturada com a sua autorização explícita. Para registros públicos, mostramos uma posição aproximada — a
            coordenada exata permanece protegida.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-ink">
            {['Meu mapa: todas as suas observações', 'Mapa da comunidade: apenas registros públicos', 'Filtros por categoria, espécie e período'].map((t) => (
              <li key={t} className="flex items-start gap-3">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-earth" />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <figure className="md:col-span-7">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-line">
            <Suspense fallback={<div className="paper size-full" />}>
              <PreviewMap />
            </Suspense>
            <div className="pointer-events-none absolute left-4 top-4 z-[500] rounded-md border border-line bg-paper/95 px-3 py-2 backdrop-blur">
              <p className="eyebrow text-forest">Mapa da comunidade</p>
            </div>
          </div>
          <figcaption className="mt-3 font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-soft">
            Fig. 02 — Base cartográfica OpenStreetMap. Os pontos aparecem conforme a comunidade publica registros.
          </figcaption>
        </figure>
      </div>
    </section>
  )
}

/* ───────────────────────── Catálogo ───────────────────────── */
function CatalogPreview() {
  return (
    <section id="catalogo" className="scroll-mt-20 border-t border-line bg-forest text-sand">
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <SectionLabel index="05" label="Catálogo de espécies" tone="sand" />
            <h2 className="mt-6 max-w-2xl text-4xl leading-tight text-sand md:text-5xl">
              Fichas científicas, <em className="text-earth">separadas das observações pessoais.</em>
            </h2>
          </div>
          <Button asChild variant="outline-light">
            <Link to="/especies">
              Abrir o catálogo <ArrowRight />
            </Link>
          </Button>
        </div>

        <div className="mt-14 -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0 lg:grid-cols-7">
          {categories.map((c, i) => (
            <Link
              key={c.key}
              to={`/especies?categoria=${c.key}`}
              className="group w-44 shrink-0 snap-start md:w-auto"
            >
              <Photo
                src={c.photo}
                alt={c.label}
                className="aspect-[3/4] rounded-md"
                imgClassName="transition-transform duration-700 group-hover:scale-105"
              />
              <p className="mt-3 font-mono text-[10px] tracking-[0.2em] text-sand/50">{String(i + 1).padStart(2, '0')}</p>
              <p className="font-serif text-xl text-sand">{c.label}</p>
              <p className="text-xs italic text-sand/60">{c.taxon}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── Comunidade ───────────────────────── */
function Community() {
  return (
    <section id="comunidade" className="paper-warm scroll-mt-20">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 md:grid-cols-12 md:items-center md:px-8 md:py-32">
        <Photo src={photos.community} alt="Paisagem aberta ao amanhecer" className="aspect-[4/5] rounded-lg md:col-span-5" />
        <div className="md:col-span-6 md:col-start-7">
          <SectionLabel index="06" label="Comunidade" />
          <h2 className="mt-6 text-4xl leading-tight md:text-5xl">
            Uma comunidade dedicada à <em className="text-sage">qualidade do registro.</em>
          </h2>
          <p className="mt-6 text-[15px] leading-relaxed text-ink-soft">
            Compartilhe descobertas, veja o que outras pessoas estão observando e ajude a identificar organismos.
            Sem curtidas, sem rankings: o foco está na documentação cuidadosa da natureza.
          </p>
          <dl className="mt-10 grid gap-6 border-t border-line pt-8 sm:grid-cols-3">
            {[
              { icon: Users, t: 'Perfis opcionais', d: 'Você escolhe se seu perfil é público.' },
              { icon: Search, t: 'Identificação colaborativa', d: 'Sugestões da comunidade para registros pendentes.' },
              { icon: ShieldCheck, t: 'Moderação', d: 'Registros inadequados podem ser denunciados.' },
            ].map((x) => (
              <div key={x.t}>
                <x.icon className="size-5 text-earth-deep" strokeWidth={1.5} />
                <dt className="mt-3 font-serif text-lg text-forest">{x.t}</dt>
                <dd className="mt-1 text-sm text-ink-soft">{x.d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── CTA final ───────────────────────── */
function ClosingCta() {
  return (
    <section className="relative isolate overflow-hidden bg-forest-deep">
      <Photo src={photos.closing} alt="Lago entre montanhas" className="absolute inset-0 -z-10" />
      <div className="absolute inset-0 -z-10 bg-forest-deep/65" />
      <div className="mx-auto max-w-4xl px-5 py-28 text-center md:py-40">
        <p className="eyebrow text-sand/70">Comece seu diário de campo</p>
        <h2 className="mt-6 text-4xl leading-tight text-sand md:text-6xl">
          Qualquer pessoa pode ajudar a <em className="text-earth">documentar a biodiversidade.</em>
        </h2>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild variant="light" size="lg">
            <Link to="/cadastro">Criar minha conta <ArrowRight /></Link>
          </Button>
          <Button asChild variant="outline-light" size="lg">
            <Link to="/comunidade">Ver a comunidade</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

function SectionLabel({ index, label, tone = 'forest' }: { index: string; label: string; tone?: 'forest' | 'sand' }) {
  return (
    <div className={`flex items-center gap-3 ${tone === 'sand' ? 'text-sand/70' : 'text-earth-deep'}`}>
      <span className="eyebrow">{index}</span>
      <span className={`h-px w-10 ${tone === 'sand' ? 'bg-sand/30' : 'bg-earth/50'}`} />
      <span className="eyebrow">{label}</span>
    </div>
  )
}
