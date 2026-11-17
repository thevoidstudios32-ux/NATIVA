import * as React from 'react'
import { cn } from '@/lib/utils'

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-11 w-full rounded-md border border-line bg-paper px-3.5 text-[15px] text-ink placeholder:text-ink-soft/60 transition-colors focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/10 disabled:opacity-60 aria-[invalid=true]:border-danger',
        className,
      )}
      {...props}
    />
  )
}

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'min-h-28 w-full rounded-md border border-line bg-paper px-3.5 py-3 text-[15px] text-ink placeholder:text-ink-soft/60 transition-colors focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/10',
        className,
      )}
      {...props}
    />
  )
}

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn('mb-1.5 block text-sm font-medium text-ink', className)} {...props} />
}

export function FieldError({ children }: { children?: React.ReactNode }) {
  if (!children) return null
  return <p className="mt-1.5 text-sm text-danger" role="alert">{children}</p>
}
