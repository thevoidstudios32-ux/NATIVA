/** Mensagem amigável para falhas de rede/banco, sem expor detalhes técnicos. */
export function friendlyError(err: unknown): string {
  const msg = (err as { message?: string })?.message?.toLowerCase() ?? ''
  if (!navigator.onLine || msg.includes('failed to fetch') || msg.includes('network'))
    return 'Sem conexão com a internet. Verifique sua rede e tente novamente.'
  if (msg.includes('duplicate') || msg.includes('unique')) return 'Este valor já está em uso.'
  if (msg.includes('row-level security') || msg.includes('permission')) return 'Você não tem permissão para esta ação.'
  if (msg.includes('payload too large') || msg.includes('exceeded the maximum')) return 'Arquivo grande demais.'
  if (msg.includes('mime') || msg.includes('invalid_mime')) return 'Tipo de arquivo não permitido.'
  return 'Algo deu errado. Tente novamente em instantes.'
}
