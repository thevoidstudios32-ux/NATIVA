import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { Spinner } from '@/components/ui/spinner'
import Landing from '@/pages/Landing'
import NotFound from '@/pages/NotFound'
import * as P from '@/pages/app'

const SignUp = lazy(() => import('@/pages/auth/SignUp'))
const SignIn = lazy(() => import('@/pages/auth/SignIn'))
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'))

function PageFallback() {
  return (
    <div className="grid min-h-[60svh] place-items-center text-forest">
      <Spinner className="size-6" />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/cadastro" element={<SignUp />} />
          <Route path="/entrar" element={<SignIn />} />
          <Route path="/recuperar-senha" element={<ForgotPassword />} />

          <Route element={<AppLayout />}>
            <Route path="/inicio" element={<P.Dashboard />} />
            <Route path="/especies" element={<P.Species />} />
            <Route path="/especies/:slug" element={<P.SpeciesDetail />} />
            <Route path="/mapa" element={<P.ObservationMap />} />
            <Route path="/registro/novo" element={<P.NewObservation />} />
            <Route path="/diario" element={<P.Journal />} />
            <Route path="/comunidade" element={<P.Community />} />
            <Route path="/colecoes" element={<P.Collections />} />
            <Route path="/perfil" element={<P.Profile />} />
            <Route path="/configuracoes" element={<P.AccountSettings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
