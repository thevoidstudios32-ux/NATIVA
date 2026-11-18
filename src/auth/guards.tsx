import type { ReactNode } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Spinner } from '@/components/ui/spinner'
import { useAuth } from './AuthProvider'

function FullScreenLoader() {
  return (
    <div className="grid min-h-[60svh] place-items-center text-forest">
      <Spinner className="size-6" />
    </div>
  )
}

/** Protege rotas privadas: sem sessão → login, preservando o destino. */
export function RequireAuth() {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <FullScreenLoader />
  if (!user) return <Navigate to="/entrar" replace state={{ from: location.pathname + location.search }} />
  return <Outlet />
}

/** Páginas de login/cadastro: quem já está logado vai para o início. */
export function GuestOnly({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <FullScreenLoader />
  if (user) return <Navigate to="/inicio" replace />
  return <>{children}</>
}
