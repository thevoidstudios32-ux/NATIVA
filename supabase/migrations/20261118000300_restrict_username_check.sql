-- Verificação de nome de usuário apenas para usuários autenticados (evita enumeração anônima).
revoke execute on function public.username_available(text) from public, anon;
grant execute on function public.username_available(text) to authenticated;
