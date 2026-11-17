import { cn } from '@/lib/utils'

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={cn('size-7', className)} aria-hidden>
      <path
        d="M16 3.5c-5 4.6-7.4 9.6-7.4 14.6 0 4.1 3.3 7.4 7.4 7.4s7.4-3.3 7.4-7.4c0-5-2.4-10-7.4-14.6Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path d="M16 9v19M16 15l-3.4-2.9M16 20.5l4-3.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

interface LogoProps {
  className?: string
  tagline?: boolean
  tone?: 'forest' | 'sand'
}

export function Logo({ className, tagline = false, tone = 'forest' }: LogoProps) {
  const color = tone === 'sand' ? 'text-sand' : 'text-forest'
  return (
    <span className={cn('inline-flex items-center gap-2.5', color, className)}>
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className="font-serif text-[22px] font-medium tracking-[0.18em]">NATIVA</span>
        {tagline && (
          <span className="mt-1 font-mono text-[8.5px] tracking-[0.26em] opacity-75">
            NATURE OBSERVATION PLATFORM
          </span>
        )}
      </span>
    </span>
  )
}
