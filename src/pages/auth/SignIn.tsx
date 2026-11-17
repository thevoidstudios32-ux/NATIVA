import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Button } from '@/components/ui/button'
import { FieldError, Input, Label } from '@/components/ui/input'
import { Notice } from '@/components/ui/notice'
import { Spinner } from '@/components/ui/spinner'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'
import { isEmail } from '@/lib/validation'
import { translateAuthError } from './SignUp'

export default function SignIn() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/inicio'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    const next: typeof errors = {}
    if (!isEmail(email)) next.email = 'Informe um e-mail válido.'
    if (!password) next.password = 'Informe sua senha.'
    setErrors(next)
    if (Object.keys(next).length) return
    if (!isSupabaseConfigured || !supabase) {
      setError('A conexão com o Supabase ainda não foi configurada neste ambiente.')
      return
    }
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    setLoading(false)
    if (error) return setError(translateAuthError(error.message))
    navigate(from, { replace: true })
  }

  return (
    <AuthLayout
      eyebrow="Entrar"
      title={<>Bem-vindo de volta <em className="text-sage">ao campo.</em></>}
      footer={<>Ainda não tem conta? <Link to="/cadastro" className="font-medium text-forest underline-offset-4 hover:underline">Criar conta</Link></>}
    >
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!errors.email} />
          <FieldError>{errors.email}</FieldError>
        </div>
        <div>
          <div className="flex items-baseline justify-between">
            <Label htmlFor="password">Senha</Label>
            <Link to="/recuperar-senha" className="text-xs text-ink-soft underline-offset-4 hover:text-forest hover:underline">Esqueci minha senha</Link>
          </div>
          <Input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} aria-invalid={!!errors.password} />
          <FieldError>{errors.password}</FieldError>
        </div>
        {error && <Notice tone="error">{error}</Notice>}
        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading && <Spinner />} Entrar
        </Button>
      </form>
    </AuthLayout>
  )
}
