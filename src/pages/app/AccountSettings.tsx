import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAuth } from '@/auth/AuthProvider'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FieldError, Input, Label } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/components/ui/toast'
import { friendlyError } from '@/lib/errors'
import { supabase } from '@/lib/supabase'
import { passwordIssue } from '@/lib/validation'
import { cn } from '@/lib/utils'

export default function AccountSettings() {
  const { profile, user, refreshProfile, signOut } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [savingPrivacy, setSavingPrivacy] = useState(false)
  const [pw, setPw] = useState({ next: '', confirm: '' })
  const [pwError, setPwError] = useState<string>()
  const [savingPw, setSavingPw] = useState(false)

  if (!profile || !user || !supabase) return null

  async function togglePublic(value: boolean) {
    setSavingPrivacy(true)
    const { error } = await supabase!.from('profiles').update({ is_public: value }).eq('id', user!.id)
    setSavingPrivacy(false)
    if (error) return toast(friendlyError(error), 'error')
    await refreshProfile()
    toast(value ? 'Seu perfil agora é público.' : 'Seu perfil agora é privado.')
  }

  async function changePassword(e: FormEvent) {
    e.preventDefault()
    const issue = passwordIssue(pw.next)
    if (issue) return setPwError(issue)
    if (pw.next !== pw.confirm) return setPwError('As senhas não coincidem.')
    setPwError(undefined)
    setSavingPw(true)
    const { error } = await supabase!.auth.updateUser({ password: pw.next })
    setSavingPw(false)
    if (error) return toast(friendlyError(error), 'error')
    setPw({ next: '', confirm: '' })
    toast('Senha alterada.')
  }

  async function onSignOut() {
    await signOut()
    navigate('/', { replace: true })
  }

  return (
    <>
      <PageHeader eyebrow="Configurações" title={<>Configurações <em className="text-sage">da conta.</em></>} />
      <div className="mx-auto max-w-3xl space-y-8 px-5 py-10 md:px-10">
        <Section title="Conta" description="E-mail usado para entrar na NATIVA.">
          <p className="font-mono text-sm text-ink">{user.email}</p>
        </Section>

        <Section title="Privacidade do perfil" description="Registros públicos sempre mostram região aproximada. Seu nome e foto só aparecem neles se o perfil for público.">
          <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Visibilidade do perfil">
            <Choice active={!profile.is_public} disabled={savingPrivacy} onClick={() => togglePublic(false)} title="Privado" text="Suas contribuições públicas aparecem como “Observador anônimo”." />
            <Choice active={profile.is_public} disabled={savingPrivacy} onClick={() => togglePublic(true)} title="Público" text="A comunidade vê seu nome, foto e biografia." />
          </div>
        </Section>

        <Section title="Alterar senha">
          <form onSubmit={changePassword} noValidate className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="new-password">Nova senha</Label>
              <Input id="new-password" type="password" autoComplete="new-password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="confirm-password">Confirmar senha</Label>
              <Input id="confirm-password" type="password" autoComplete="new-password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <FieldError>{pwError}</FieldError>
              <Button type="submit" variant="outline" disabled={savingPw} className="mt-2">{savingPw && <Spinner />} Atualizar senha</Button>
            </div>
          </form>
        </Section>

        <Section title="Sessão">
          <Button variant="outline" onClick={onSignOut}><LogOut /> Sair da conta</Button>
        </Section>
      </div>
    </>
  )
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <Card className="p-6 md:p-8">
      <h2 className="text-2xl">{title}</h2>
      {description && <p className="mt-1 text-sm text-ink-soft">{description}</p>}
      <div className="mt-5">{children}</div>
    </Card>
  )
}

function Choice({ active, disabled, onClick, title, text }: { active: boolean; disabled: boolean; onClick: () => void; title: string; text: string }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      disabled={disabled || active}
      onClick={onClick}
      className={cn(
        'rounded-md border p-4 text-left transition-colors disabled:cursor-default',
        active ? 'border-forest bg-forest/5' : 'border-line hover:border-forest/40',
      )}
    >
      <span className="flex items-center gap-2 font-medium text-forest">
        <span className={cn('size-3.5 rounded-full border', active ? 'border-[4px] border-forest' : 'border-ink-soft/50')} />
        {title}
      </span>
      <span className="mt-1.5 block text-sm text-ink-soft">{text}</span>
    </button>
  )
}
