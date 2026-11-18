import { cn } from '@/lib/utils'

export function Avatar({ url, name, className }: { url?: string | null; name?: string | null; className?: string }) {
  const initials = (name || '?')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
  return (
    <span className={cn('relative inline-grid size-9 shrink-0 place-items-center overflow-hidden rounded-full bg-sage/30 font-serif text-sm text-forest', className)}>
      {url ? <img src={url} alt="" className="size-full object-cover" /> : initials}
    </span>
  )
}
