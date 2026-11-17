import * as React from 'react'
import { cn } from '@/lib/utils'

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-lg border border-line bg-paper', className)} {...props} />
}

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-sm border border-forest/20 px-2 py-0.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-forest',
        className,
      )}
      {...props}
    />
  )
}
