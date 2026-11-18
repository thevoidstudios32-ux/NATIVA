import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { AlertCircle, CheckCircle2, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type Tone = 'success' | 'error'
interface Toast { id: number; tone: Tone; message: string }

const ToastContext = createContext<(message: string, tone?: Tone) => void>(() => {})

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const dismiss = (id: number) => setToasts((t) => t.filter((x) => x.id !== id))
  const push = useCallback((message: string, tone: Tone = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, tone, message }])
    setTimeout(() => dismiss(id), 4500)
  }, [])

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[2000] flex flex-col items-center gap-2 px-4 lg:bottom-6 lg:items-end lg:pr-6" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              'pointer-events-auto flex w-full max-w-sm animate-rise items-start gap-3 rounded-md border bg-paper px-4 py-3 text-sm shadow-[0_10px_30px_-12px_rgba(38,61,50,0.35)]',
              t.tone === 'success' ? 'border-success/30 text-forest' : 'border-danger/30 text-danger',
            )}
          >
            {t.tone === 'success' ? <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" /> : <AlertCircle className="mt-0.5 size-4 shrink-0" />}
            <p className="flex-1">{t.message}</p>
            <button onClick={() => dismiss(t.id)} aria-label="Fechar" className="text-ink-soft hover:text-ink"><X className="size-4" /></button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
