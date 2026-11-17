import { Link } from 'react-router-dom'
import { Logo } from '@/components/brand/Logo'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="paper-warm grid min-h-[100svh] place-items-center px-5">
      <div className="max-w-md text-center">
        <Logo tagline className="justify-center" />
        <p className="eyebrow mt-14 text-earth-deep">Erro 404</p>
        <h1 className="mt-4 text-5xl">Trilha <em className="text-sage">não encontrada.</em></h1>
        <p className="mt-4 text-ink-soft">A página que você procura não existe ou foi movida.</p>
        <Button asChild className="mt-8"><Link to="/">Voltar ao início</Link></Button>
      </div>
    </div>
  )
}
