import { useState } from 'react'
import { Leaf } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PhotoProps {
  src: string
  alt: string
  className?: string
  imgClassName?: string
  eager?: boolean
}

/** Imagem com carregamento suave e fallback tonal caso a fotografia não carregue. */
export function Photo({ src, alt, className, imgClassName, eager }: PhotoProps) {
  const [state, setState] = useState<'loading' | 'ok' | 'error'>('loading')
  return (
    <div className={cn('relative overflow-hidden bg-forest-soft', className)}>
      {state === 'error' ? (
        <div className="paper absolute inset-0 grid place-items-center bg-sage/40">
          <Leaf className="size-8 text-forest/40" strokeWidth={1.2} aria-hidden />
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setState('ok')}
          onError={() => setState('error')}
          className={cn(
            'size-full object-cover transition-opacity duration-700',
            state === 'ok' ? 'opacity-100' : 'opacity-0',
            imgClassName,
          )}
        />
      )}
    </div>
  )
}
