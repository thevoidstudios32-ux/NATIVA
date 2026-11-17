import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'

interface StagePlaceholderProps {
  eyebrow: string
  title: ReactNode
  description: string
  stage: number
  icon: LucideIcon
  plan: string[]
}

/**
 * Página estrutural da Etapa 1: define navegação e hierarquia.
 * Informa claramente em qual etapa a funcionalidade real (conectada ao Supabase) será entregue.
 * Não exibe dados simulados.
 */
export function StagePlaceholder({ eyebrow, title, description, stage, icon: Icon, plan }: StagePlaceholderProps) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <section className="mx-auto max-w-6xl px-5 py-10 md:px-10">
        <div className="paper grid gap-8 rounded-lg border border-line p-8 md:grid-cols-[auto_1fr] md:p-10">
          <div className="grid size-14 place-items-center rounded-full border border-forest/20 text-forest">
            <Icon className="size-6" strokeWidth={1.4} />
          </div>
          <div>
            <p className="eyebrow text-earth-deep">Em construção · Etapa {stage}</p>
            <p className="mt-3 max-w-xl font-serif text-2xl leading-snug text-forest">
              Esta seção será conectada aos dados reais do Supabase na etapa {stage} do desenvolvimento.
            </p>
            <ul className="mt-6 grid gap-2 text-sm text-ink-soft sm:grid-cols-2">
              {plan.map((p) => (
                <li key={p} className="flex items-start gap-2.5">
                  <span className="mt-2 size-1 shrink-0 rounded-full bg-earth" /> {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
