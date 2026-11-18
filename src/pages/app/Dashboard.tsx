import { lazy, Suspense, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Camera, Compass, FileClock, Leaf, NotebookPen, Plus, Users } from 'lucide-react'
import { useAuth } from '@/auth/AuthProvider'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Badge, Card } from '@/components/ui/card'
import { Notice } from '@/components/ui/notice'
import { categoryByKey } from '@/content/categories'
import { NEW_OBSERVATION_PATH } from '@/content/navigation'
import { friendlyError } from '@/lib/errors'
import { formatDate, formatRelative } from '@/lib/format'
import { supabase } from '@/lib/supabase'
import type { MyStats, ObservationSummary } from '@/types/database'

const PersonalMiniMap = lazy(() => import('@/components/map/PersonalMiniMap'))

export default function Dashboard() {
  const { profile, user } = useAuth()
  const [stats, setStats] = useState<MyStats | null>(null)
  const [recent, setRecent] = useState<ObservationSummary[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase || !user) return
    let active = true
    ;(async () => {
      const [s, r] = await Promise.all([
        supabase!.rpc('my_stats').single(),
        supabase!
          .from('observations')
          .select('id,title,category,species_guess,observation_date,visibility,is_draft,identification_status,created_at,updated_at,species(common_name,scientific_name)')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(6),
      ])
      if (!active) return
      if (s.error || r.error) setError(friendlyError(s.error ?? r.error))
      else {
        setStats(s.data as MyStats)
        setRecent((r.data ?? []) as unknown as ObservationSummary[])
      }
      setLoading(false)
    })()
    return () => {
      active = false
    }
  }, [user])

  const firstName = (profile?.full_name || '').split(' ')[0]
  const isEmpty = stats && stats.observations === 0 && stats.drafts === 0

  return (
    <>
      <PageHeader
        eyebrow="Meu NATIVA"
        title={<>Olá{firstName ? `, ${firstName}` : ''}. <em className="text-sage">O que você observou hoje?</em></>}
        actions={
          <Button asChild size="lg">
            <Link to={NEW_OBSERVATION_PATH}><Plus /> Nova observação</Link>
          </Button>
        }
      />

      <div className="mx-auto max-w-6xl space-y-10 px-5 py-10 md:px-10">
        {error && <Notice tone="error">{error}</Notice>}

        {/* Estatísticas — sempre calculadas a partir dos dados reais */}
        <section aria-label="Estatísticas" className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-4">
          <Stat label="Observações" value={stats?.observations} loading={loading} />
          <Stat label="Espécies diferentes" value={stats?.species} loading={loading} />
          <Stat label="Fotografias" value={stats?.photos} loading={loading} />
          <Stat label="Rascunhos" value={stats?.drafts} loading={loading} />
        </section>

        {isEmpty ? (
          <EmptyStart />
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <section>
              <SectionTitle title="Atividade recente" to="/diario" cta="Abrir diário" />
              {loading ? (
                <SkeletonList />
              ) : (
                <ol className="divide-y divide-line rounded-lg border border-line bg-paper">
                  {recent.map((o) => <RecentRow key={o.id} o={o} />)}
                </ol>
              )}
            </section>
            <section>
              <SectionTitle title="Meu mapa" to="/mapa" cta="Abrir mapa" />
              <div className="aspect-[4/3] overflow-hidden rounded-lg border border-line">
                <Suspense fallback={<div className="paper size-full" />}>
                  <PersonalMiniMap />
                </Suspense>
              </div>
            </section>
          </div>
        )}

        <section className="grid gap-4 md:grid-cols-3">
          <Shortcut to={NEW_OBSERVATION_PATH} icon={NotebookPen} title="Registrar observação" text="Fotografias, local e detalhes de campo." />
          <Shortcut to="/especies" icon={Compass} title="Catálogo de espécies" text="Consulte fichas científicas referenciadas." />
          <Shortcut to="/comunidade" icon={Users} title="Comunidade" text="Veja descobertas públicas recentes." />
        </section>
      </div>
    </>
  )
}

function Stat({ label, value, loading }: { label: string; value?: number; loading: boolean }) {
  return (
    <div className="bg-paper p-6">
      <p className="eyebrow text-ink-soft">{label}</p>
      <p className="mt-3 font-serif text-4xl text-forest md:text-5xl">
        {loading ? <span className="inline-block h-10 w-12 animate-pulse rounded bg-sand" /> : (value ?? 0)}
      </p>
    </div>
  )
}

function EmptyStart() {
  return (
    <section className="paper grid gap-8 overflow-hidden rounded-lg border border-line p-8 md:grid-cols-[1fr_auto] md:items-center md:p-12">
      <div>
        <p className="eyebrow text-earth-deep">Primeira página do diário</p>
        <h2 className="mt-4 max-w-xl text-3xl leading-snug md:text-4xl">
          Seu diário de campo está em branco — <em className="text-sage">e isso é um ótimo começo.</em>
        </h2>
        <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-ink-soft">
          Registre a primeira observação: pode ser uma planta no caminho ou um pássaro na janela. Não precisa saber
          o nome da espécie — a identificação pode ficar pendente.
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link to={NEW_OBSERVATION_PATH}><Camera /> Fazer meu primeiro registro</Link>
        </Button>
      </div>
      <Leaf className="hidden size-40 text-forest/10 md:block" strokeWidth={0.6} aria-hidden />
    </section>
  )
}

function RecentRow({ o }: { o: ObservationSummary }) {
  const cat = categoryByKey[o.category]
  const name = o.species?.common_name || o.species_guess || o.title || 'Organismo não identificado'
  return (
    <li className="flex items-center gap-4 px-5 py-4">
      <span className="grid size-10 shrink-0 place-items-center rounded-full border border-line text-sage">
        <cat.icon className="size-[18px]" strokeWidth={1.5} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-serif text-lg text-forest">{name}</p>
        <p className="text-xs text-ink-soft">
          {cat.label} · {o.observation_date ? formatDate(o.observation_date) : 'sem data'} · atualizado {formatRelative(o.updated_at)}
        </p>
      </div>
      {o.is_draft ? (
        <Badge className="border-earth/40 text-earth-deep"><FileClock className="size-3" /> Rascunho</Badge>
      ) : (
        <Badge>{o.visibility === 'public' ? 'Público' : 'Privado'}</Badge>
      )}
    </li>
  )
}

function SectionTitle({ title, to, cta }: { title: string; to: string; cta: string }) {
  return (
    <div className="mb-4 flex items-baseline justify-between">
      <h2 className="text-2xl">{title}</h2>
      <Link to={to} className="inline-flex items-center gap-1 text-sm text-ink-soft hover:text-forest">
        {cta} <ArrowRight className="size-3.5" />
      </Link>
    </div>
  )
}

function Shortcut({ to, icon: Icon, title, text }: { to: string; icon: typeof Leaf; title: string; text: string }) {
  return (
    <Link to={to} className="group">
      <Card className="h-full p-6 transition-colors group-hover:border-forest/40 group-hover:bg-sand/30">
        <Icon className="size-5 text-forest" strokeWidth={1.5} />
        <p className="mt-5 font-serif text-xl text-forest">{title}</p>
        <p className="mt-1 text-sm text-ink-soft">{text}</p>
      </Card>
    </Link>
  )
}

function SkeletonList() {
  return (
    <div className="space-y-px overflow-hidden rounded-lg border border-line">
      {[0, 1, 2].map((i) => <div key={i} className="h-[72px] animate-pulse bg-sand/50" />)}
    </div>
  )
}
