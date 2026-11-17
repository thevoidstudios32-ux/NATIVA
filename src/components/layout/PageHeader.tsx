import type { ReactNode } from 'react'

interface PageHeaderProps {
  eyebrow: string
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
}

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 pb-8 pt-8 md:flex-row md:items-end md:justify-between md:px-10 md:pt-14">
        <div className="animate-rise">
          <p className="eyebrow text-earth-deep">{eyebrow}</p>
          <h1 className="mt-3 text-4xl leading-tight md:text-5xl">{title}</h1>
          {description && <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-soft">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
      </div>
    </header>
  )
}
