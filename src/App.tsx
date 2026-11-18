import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '@/auth/AuthProvider'
import { GuestOnly, RequireAuth } from '@/auth/guards'
import { AppLayout } from '@/components/layout/AppLayout'
import { Spinner } from '@/components/ui/spinner'
import { ToastProvider } from '@/components/ui/toast'
import Landing from '@/pages/Landing'
import NotFound from '@/pages/NotFound'
import * as P from '@/pages/app'

const SignUp = lazy(() => import('@/pages/auth/SignUp'))
const SignIn = lazy(() => import('@/pages/auth/SignIn'))
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'))
const ResetPassword = lazy(() => import('@/pages/auth/ResetPassword'))
const Dashboard = lazy(() => import('@/pages/app/Dashboard'))
const Profile = lazy(() => import('@/pages/app/Profile'))
const AccountSettings = lazy(() => import('@/pages/app/AccountSettings'))

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
      <AuthProvider>
        <ToastProvider>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/cadastro" element={<GuestOnly><SignUp /></GuestOnly>} />
              <Route path="/entrar" element={<GuestOnly><SignIn /></GuestOnly>} />
              <Route path="/recuperar-senha" element={<ForgotPassword />} />
              <Route path="/redefinir-senha" element={<ResetPassword />} />

              <Route element={<AppLayout />}>
                {/* Áreas públicas (somente dados públicos) */}
                <Route path="/especies" element={<P.Species />} />
                <Route path="/especies/:slug" element={<P.SpeciesDetail />} />
                <Route path="/comunidade" element={<P.Community />} />

                {/* Áreas privadas */}
                <Route element={<RequireAuth />}>
                  <Route path="/inicio" element={<Dashboard />} />
                  <Route path="/mapa" element={<P.ObservationMap />} />
                  <Route path="/registro/novo" element={<P.NewObservation />} />
                  <Route path="/diario" element={<P.Journal />} />
                  <Route path="/colecoes" element={<P.Collections />} />
                  <Route path="/perfil" element={<Profile />} />
                  <Route path="/configuracoes" element={<AccountSettings />} />
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
