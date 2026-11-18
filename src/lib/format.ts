const dateFmt = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
const rtf = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' })

/** Formata data "AAAA-MM-DD" sem deslocamento de fuso horário. */
export function formatDate(isoDate: string) {
  const [y, m, d] = isoDate.slice(0, 10).split('-').map(Number)
  return dateFmt.format(new Date(y, m - 1, d))
}

export function formatRelative(iso: string) {
  const diff = (new Date(iso).getTime() - Date.now()) / 1000
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 31536000], ['month', 2592000], ['week', 604800], ['day', 86400], ['hour', 3600], ['minute', 60],
  ]
  for (const [unit, secs] of units) {
    if (Math.abs(diff) >= secs) return rtf.format(Math.round(diff / secs), unit)
  }
  return 'agora'
}
