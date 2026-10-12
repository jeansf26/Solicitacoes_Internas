/**
 * Salva um cookie no navegador.
 * @param name Nome do cookie
 * @param value Valor do cookie
 * @param hours Tempo de expiração em horas (padrão: 2 horas)
 */
export function setCookie(name: string, value: string, hours: number = 2): void {
  if (typeof document === 'undefined') return;

  const maxAge = Math.floor(hours * 60 * 60);
  const expires = new Date(Date.now() + maxAge * 1000).toUTCString();

  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expires}; max-age=${maxAge}; path=/; SameSite=Lax`;
}

/**
 * Recupera o valor de um cookie pelo nome.
 * @param name Nome do cookie
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;

  const encodedName = encodeURIComponent(name);
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${encodedName}=([^;]*)`));

  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Remove um cookie definindo sua data de expiração no passado.
 * @param name Nome do cookie
 */
export function deleteCookie(name: string): void {
  if (typeof document === 'undefined') return;

  const encodedName = encodeURIComponent(name);
  document.cookie = `${encodedName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; path=/; SameSite=Lax`;
}
