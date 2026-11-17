import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Button } from '@/components/ui/button'
import { FieldError, Input, Label } from '@/components/ui/input'
import { Notice } from '@/components/ui/notice'
import { Spinner } from '@/components/ui/spinner'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'
import { isEmail } from '@/lib/validation'
import { translateAuthError } from './SignUp'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [fieldError, setFieldError] = useState<string>()
  const [status, setStatus] = useState<{ tone: 'error' | 'success' | 'info'; msg: string } | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!isEmail(email)) return setFieldError('Informe um e-mail válido.')
    setFieldError(undefined)
    if (!isSupabaseConfigured || !supabase) {
      return setStatus({ tone: 'info', msg: 'A conexão com o Supabase ainda não foi configurada neste ambiente.' })
    }
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    })
    setLoading(false)
    if (error) return setStatus({ tone: 'error', msg: translateAuthError(error.message) })
    // Mensagem neutra: não revela se o e-mail está cadastrado.
    setStatus({ tone: 'success', msg: 'Se houver uma conta com este e-mail, você receberá um link para redefinir a senha.' })
  }

  return (
    <AuthLayout
      eyebrow="Recuperar senha"
      title={<>Vamos recuperar <em className="text-sage">seu acesso.</em></>}
      subtitle="Informe o e-mail da sua conta e enviaremos um link seguro para criar uma nova senha."
      footer={<Link to="/entrar" className="font-medium text-forest underline-offset-4 hover:underline">← Voltar para o login</Link>}
    >
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!fieldError} />
          <FieldError>{fieldError}</FieldError>
        </div>
        {status && <Notice tone={status.tone}>{status.msg}</Notice>}
        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading && <Spinner />} Enviar link de recuperação
        </Button>
      </form>
    </AuthLayout>
  )
}
