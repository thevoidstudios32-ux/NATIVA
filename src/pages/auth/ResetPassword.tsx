import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/auth/AuthProvider'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Button } from '@/components/ui/button'
import { FieldError, Input, Label } from '@/components/ui/input'
import { Notice } from '@/components/ui/notice'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/components/ui/toast'
import { supabase } from '@/lib/supabase'
import { passwordIssue } from '@/lib/validation'
import { translateAuthError } from './SignUp'

/** Destino do link de recuperação enviado por e-mail. */
export default function ResetPassword() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [pw, setPw] = useState({ next: '', confirm: '' })
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    const issue = passwordIssue(pw.next)
    if (issue) return setError(issue)
    if (pw.next !== pw.confirm) return setError('As senhas não coincidem.')
    setError(undefined)
    setLoading(true)
    const { error } = await supabase!.auth.updateUser({ password: pw.next })
    setLoading(false)
    if (error) return setError(translateAuthError(error.message))
    toast('Senha redefinida com sucesso.')
    navigate('/inicio', { replace: true })
  }

  return (
    <AuthLayout eyebrow="Nova senha" title={<>Defina uma <em className="text-sage">nova senha.</em></>}>
      {authLoading ? (
        <Spinner className="size-6 text-forest" />
      ) : !user ? (
        <Notice tone="error">
          O link de recuperação é inválido ou expirou.{' '}
          <Link to="/recuperar-senha" className="underline">Solicite um novo link</Link>.
        </Notice>
      ) : (
        <form onSubmit={onSubmit} noValidate className="space-y-5">
          <div>
            <Label htmlFor="new">Nova senha</Label>
            <Input id="new" type="password" autoComplete="new-password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="confirm">Confirmar senha</Label>
            <Input id="confirm" type="password" autoComplete="new-password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} />
            <FieldError>{error}</FieldError>
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={loading}>{loading && <Spinner />} Salvar nova senha</Button>
        </form>
      )}
    </AuthLayout>
  )
}
