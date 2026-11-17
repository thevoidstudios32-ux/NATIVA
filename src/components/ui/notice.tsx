import type { ReactNode } from 'react'
import { AlertCircle, CheckCircle2, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

const styles = {
  info: { cls: 'border-sage/40 bg-sage/10 text-forest', Icon: Info },
  success: { cls: 'border-success/30 bg-success/10 text-success', Icon: CheckCircle2 },
  error: { cls: 'border-danger/30 bg-danger/5 text-danger', Icon: AlertCircle },
}

export function Notice({ tone = 'info', children, className }: { tone?: keyof typeof styles; children: ReactNode; className?: string }) {
  const { cls, Icon } = styles[tone]
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={cn('flex gap-3 rounded-md border px-4 py-3 text-sm leading-relaxed', cls, className)}>
      <Icon className="mt-0.5 size-4 shrink-0" />
      <div>{children}</div>
    </div>
  )
}
