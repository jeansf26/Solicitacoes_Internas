// Função para formatar datas no formato DD/MM/AAAA HH:MM
export function formatarData(data?: Date | null): string {
  if (!data) return '';

  const d = new Date(data);

  return `${d.toLocaleDateString('pt-BR')} às ${d.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
}
