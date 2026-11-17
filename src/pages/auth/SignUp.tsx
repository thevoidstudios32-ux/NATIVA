import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Button } from '@/components/ui/button'
import { FieldError, Input, Label } from '@/components/ui/input'
import { Notice } from '@/components/ui/notice'
import { Spinner } from '@/components/ui/spinner'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'
import { isEmail, passwordIssue } from '@/lib/validation'

export default function SignUp() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({})
  const [status, setStatus] = useState<{ tone: 'error' | 'success' | 'info'; msg: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    const next: typeof errors = {}
    if (form.name.trim().length < 2) next.name = 'Informe seu nome.'
    if (!isEmail(form.email)) next.email = 'Informe um e-mail válido.'
    const pw = passwordIssue(form.password)
    if (pw) next.password = pw
    setErrors(next)
    if (Object.keys(next).length) return

    if (!isSupabaseConfigured || !supabase) {
      setStatus({ tone: 'info', msg: 'A conexão com o Supabase ainda não foi configurada neste ambiente.' })
      return
    }
    setLoading(true)
    setStatus(null)
    const { error } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: {
        data: { full_name: form.name.trim() },
        emailRedirectTo: `${window.location.origin}/inicio`,
      },
    })
    setLoading(false)
    if (error) {
      setStatus({ tone: 'error', msg: translateAuthError(error.message) })
      return
    }
    setStatus({
      tone: 'success',
      msg: 'Conta criada. Enviamos um link de confirmação para o seu e-mail — confirme para começar a registrar.',
    })
  }

  return (
    <AuthLayout
      eyebrow="Criar conta"
      title={<>Comece seu <em className="text-sage">diário de campo.</em></>}
      subtitle="Gratuito. Seus registros são privados até você decidir compartilhá-los."
      footer={<>Já possui conta? <Link to="/entrar" className="font-medium text-forest underline-offset-4 hover:underline">Entrar</Link></>}
    >
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <div>
          <Label htmlFor="name">Nome</Label>
          <Input id="name" autoComplete="name" value={form.name} onChange={set('name')} aria-invalid={!!errors.name} />
          <FieldError>{errors.name}</FieldError>
        </div>
        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" autoComplete="email" inputMode="email" value={form.email} onChange={set('email')} aria-invalid={!!errors.email} />
          <FieldError>{errors.email}</FieldError>
        </div>
        <div>
          <Label htmlFor="password">Senha</Label>
          <Input id="password" type="password" autoComplete="new-password" value={form.password} onChange={set('password')} aria-invalid={!!errors.password} />
          <FieldError>{errors.password}</FieldError>
          {!errors.password && <p className="mt-1.5 text-xs text-ink-soft">Mínimo de 8 caracteres, com letras e números.</p>}
        </div>
        {status && <Notice tone={status.tone}>{status.msg}</Notice>}
        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading && <Spinner />} Criar conta
        </Button>
      </form>
    </AuthLayout>
  )
}

export function translateAuthError(msg: string): string {
  const m = msg.toLowerCase()
  if (m.includes('already registered') || m.includes('already been registered')) return 'Este e-mail já está cadastrado.'
  if (m.includes('invalid login credentials')) return 'E-mail ou senha incorretos.'
  if (m.includes('email not confirmed')) return 'Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.'
  if (m.includes('rate limit') || m.includes('too many')) return 'Muitas tentativas. Aguarde alguns minutos e tente novamente.'
  if (m.includes('failed to fetch') || m.includes('network')) return 'Falha de conexão. Verifique sua internet e tente novamente.'
  if (m.includes('password')) return 'A senha não atende aos requisitos de segurança.'
  return 'Não foi possível concluir. Tente novamente em instantes.'
}
