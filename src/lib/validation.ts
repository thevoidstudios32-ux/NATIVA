export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())

export function passwordIssue(v: string): string | null {
  if (v.length < 8) return 'A senha deve ter pelo menos 8 caracteres.'
  if (!/[A-Za-z]/.test(v) || !/\d/.test(v)) return 'Use letras e números na senha.'
  return null
}
