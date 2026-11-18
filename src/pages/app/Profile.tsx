import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Camera, Globe2, Lock } from 'lucide-react'
import { useAuth } from '@/auth/AuthProvider'
import { PageHeader } from '@/components/layout/PageHeader'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FieldError, Input, Label, Textarea } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/components/ui/toast'
import { friendlyError } from '@/lib/errors'
import { ACCEPTED_IMAGE_TYPES, resizeImage } from '@/lib/images'
import { supabase } from '@/lib/supabase'

const MAX_AVATAR_INPUT = 8 * 1024 * 1024 // aceito na entrada; reduzido para ~512px antes do envio

export default function Profile() {
  const { profile, user, refreshProfile } = useAuth()
  const toast = useToast()
  const fileRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({ full_name: '', username: '', bio: '' })
  const [errors, setErrors] = useState<{ full_name?: string; username?: string; bio?: string }>({})
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (profile) setForm({ full_name: profile.full_name, username: profile.username, bio: profile.bio ?? '' })
  }, [profile])

  if (!profile || !user || !supabase) return null

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    const next: typeof errors = {}
    const username = form.username.trim().toLowerCase()
    if (form.full_name.trim().length < 2) next.full_name = 'Informe seu nome.'
    if (!/^[a-z0-9_]{3,30}$/.test(username)) next.username = 'Use de 3 a 30 caracteres: letras minúsculas, números ou _.'
    if (form.bio.length > 600) next.bio = 'A biografia pode ter até 600 caracteres.'
    if (!next.username && username !== profile!.username) {
      const { data } = await supabase!.rpc('username_available', { candidate: username })
      if (!data) next.username = 'Este nome de usuário já está em uso.'
    }
    setErrors(next)
    if (Object.keys(next).length) return

    setSaving(true)
    const { error } = await supabase!
      .from('profiles')
      .update({ full_name: form.full_name.trim(), username, bio: form.bio.trim() || null })
      .eq('id', user!.id)
    setSaving(false)
    if (error) return toast(friendlyError(error), 'error')
    await refreshProfile()
    toast('Perfil atualizado.')
  }

  async function onAvatar(file: File | undefined) {
    if (!file) return
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) return toast('Use uma imagem JPG, PNG ou WebP.', 'error')
    if (file.size > MAX_AVATAR_INPUT) return toast('A imagem deve ter no máximo 8 MB.', 'error')
    setUploading(true)
    try {
      const blob = await resizeImage(file, 512)
      const path = `${user!.id}/avatar-${Date.now()}.webp`
      const up = await supabase!.storage.from('avatars').upload(path, blob, { contentType: 'image/webp' })
      if (up.error) throw up.error
      const { data } = supabase!.storage.from('avatars').getPublicUrl(path)
      const old = profile!.avatar_url?.split('/avatars/')[1]
      const { error } = await supabase!.from('profiles').update({ avatar_url: data.publicUrl }).eq('id', user!.id)
      if (error) throw error
      if (old) await supabase!.storage.from('avatars').remove([decodeURIComponent(old)])
      await refreshProfile()
      toast('Foto de perfil atualizada.')
    } catch (err) {
      toast(friendlyError(err), 'error')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  async function removeAvatar() {
    const old = profile!.avatar_url?.split('/avatars/')[1]
    const { error } = await supabase!.from('profiles').update({ avatar_url: null }).eq('id', user!.id)
    if (error) return toast(friendlyError(error), 'error')
    if (old) await supabase!.storage.from('avatars').remove([decodeURIComponent(old)])
    await refreshProfile()
    toast('Foto removida.')
  }

  return (
    <>
      <PageHeader eyebrow="Perfil" title={<>Seu <em className="text-sage">perfil.</em></>} description="Estas informações aparecem para a comunidade somente se o seu perfil for público." />
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 md:px-10 lg:grid-cols-[280px_1fr]">
        <Card className="h-fit p-6 text-center">
          <Avatar url={profile.avatar_url} name={profile.full_name || profile.username} className="mx-auto size-28 text-3xl" />
          <p className="mt-4 font-serif text-2xl text-forest">{profile.full_name || 'Sem nome'}</p>
          <p className="font-mono text-xs text-ink-soft">@{profile.username}</p>
          <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-ink-soft">
            {profile.is_public ? <><Globe2 className="size-3.5" /> Perfil público</> : <><Lock className="size-3.5" /> Perfil privado</>}
          </p>
          <input ref={fileRef} type="file" accept={ACCEPTED_IMAGE_TYPES.join(',')} className="hidden" onChange={(e) => onAvatar(e.target.files?.[0])} />
          <div className="mt-6 flex flex-col gap-2">
            <Button variant="outline" onClick={() => fileRef.current?.click()} disabled={uploading}>
              {uploading ? <Spinner /> : <Camera />} {profile.avatar_url ? 'Trocar foto' : 'Adicionar foto'}
            </Button>
            {profile.avatar_url && <Button variant="ghost" size="sm" onClick={removeAvatar}>Remover foto</Button>}
          </div>
        </Card>

        <Card className="p-6 md:p-8">
          <form onSubmit={onSubmit} noValidate className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="full_name">Nome</Label>
                <Input id="full_name" value={form.full_name} maxLength={120} onChange={(e) => setForm({ ...form, full_name: e.target.value })} aria-invalid={!!errors.full_name} />
                <FieldError>{errors.full_name}</FieldError>
              </div>
              <div>
                <Label htmlFor="username">Nome de usuário</Label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft">@</span>
                  <Input id="username" className="pl-8" value={form.username} maxLength={30} autoCapitalize="none" onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase() })} aria-invalid={!!errors.username} />
                </div>
                <FieldError>{errors.username}</FieldError>
              </div>
            </div>
            <div>
              <Label htmlFor="bio">Biografia</Label>
              <Textarea id="bio" value={form.bio} maxLength={600} placeholder="Ex.: Observador de aves no interior de São Paulo, interessado em fenologia de plantas nativas." onChange={(e) => setForm({ ...form, bio: e.target.value })} aria-invalid={!!errors.bio} />
              <div className="mt-1 flex justify-between text-xs text-ink-soft">
                <FieldError>{errors.bio}</FieldError>
                <span className="ml-auto">{form.bio.length}/600</span>
              </div>
            </div>
            <div className="flex justify-end border-t border-line pt-6">
              <Button type="submit" disabled={saving}>{saving && <Spinner />} Salvar perfil</Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  )
}
