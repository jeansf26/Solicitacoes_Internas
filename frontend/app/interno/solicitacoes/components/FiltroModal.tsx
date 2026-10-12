// componente responsavel pelo modal de filtro de solicitações

import { FormEvent } from 'react';
import { X } from 'lucide-react';

type Filtros = {
  titulo: string;
  prioridade: string;
  status: string;
  crescente_data: boolean;
};

type FiltroModalProps = {
  aberto: boolean;
  modo?: string;
  filtros: Filtros;
  setFiltro: (filtros: Filtros) => void;
  aoFechar: () => void;
  aoSalvar: (e: FormEvent<HTMLFormElement>) => void;
};

export default function FiltroModal({
  aberto,
  filtros,
  setFiltro,
  aoFechar,
  aoSalvar,
}: FiltroModalProps) {
  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/30 p-4">
      <form onSubmit={aoSalvar} className="w-full max-w-xl rounded-xl bg-white shadow-lg">
        <div className="flex items-center justify-between border-b p-5">
          <h3 className="font-semibold text-slate-800">
            Filtros disponíveis:
          </h3>
          <button type="button" onClick={aoFechar} className="text-slate-500 hover:text-slate-700">
            <X size={20} />
          </button>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2">
          {/* Filtro por Título */}
          <div className="sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">Título</span>
            <input
              type="text"
              value={filtros.titulo}
              onChange={(e) => setFiltro({ ...filtros, titulo: e.target.value })}
              placeholder="Pesquisar por título..."
              className="mt-1 block w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Filtro por Prioridade */}
          <div>
            <span className="text-sm font-medium text-slate-700">Prioridade</span>
            <select
              value={filtros.prioridade}
              onChange={(e) => setFiltro({ ...filtros, prioridade: e.target.value })}
              className="mt-1 block w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
            >
              <option value="">Todas</option>
              <option value="Baixa">Baixa</option>
              <option value="Média">Média</option>
              <option value="Alta">Alta</option>
            </select>
          </div>

          {/* Filtro por Status */}
          <div>
            <span className="text-sm font-medium text-slate-700">Status</span>
            <select
              value={filtros.status}
              onChange={(e) => setFiltro({ ...filtros, status: e.target.value })}
              className="mt-1 block w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
            >
              <option value="">Todos</option>
              <option value="Aberta">Aberta</option>
              <option value="Em Análise">Em Análise</option>
              <option value="Aprovada">Aprovada</option>
              <option value="Rejeitada">Rejeitada</option>
            </select>
          </div>

          {/* Ordenação por Data */}
          <div className="sm:col-span-2 flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="crescente_data"
              checked={filtros.crescente_data}
              onChange={(e) => setFiltro({ ...filtros, crescente_data: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="crescente_data" className="text-sm font-medium text-slate-700 select-none cursor-pointer">
              Exibir da mais antiga para a mais recente (Data Crescente)
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t p-5">
          <button type="button" onClick={aoFechar} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">
            Cancelar
          </button>
          <button type="submit" className="rounded-lg bg-emerald-700 px-4 py-2 text-sm text-white hover:bg-emerald-800">
            Aplicar Filtros
          </button>
        </div>
      </form>
    </div>
  );
}