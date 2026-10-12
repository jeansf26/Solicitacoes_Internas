// Componente responsavel pelo modal de resposta de solicitaçãop e cadastro

import { FormEvent } from 'react';
import { X } from 'lucide-react';
import { formatarData } from '../../../services/date';

type DadosFormulario = {
  titulo: string;
  descricao: string;
  area: string;
  prioridade: string;
  status: string;
  comentario: string;
  data_atualizacao: Date | null;
};

type SolicitacaoModalProps = {
  aberto: boolean;
  modo: string;
  dados: DadosFormulario;
  setDados: (dados: DadosFormulario) => void;
  aoFechar: () => void;
  aoSalvar: (e: FormEvent<HTMLFormElement>) => void;
};

export default function SolicitacaoModal({
  aberto,
  modo,
  dados,
  setDados,
  aoFechar,
  aoSalvar,
}: SolicitacaoModalProps) {
  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/30 p-4">
      <form onSubmit={aoSalvar} className="w-full max-w-xl rounded-xl bg-white shadow-lg">
        <div className="flex items-center justify-between border-b p-5">
          <h3 className="font-semibold">
            {modo != "cadastro" ? 'Resposta de solicitação ' + dados.titulo : 'Nova solicitação'}
          </h3>
          <button type="button" onClick={aoFechar} className="text-slate-500">
            <X size={20} />
          </button>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2">
          {modo != "cadastro" ? (
            modo == "fechado" ? (
              <>
                <div className="sm:col-span-2">
                  <span className="text-sm font-medium text-slate-700">Data de resposta: </span>
                  <input
                    disabled
                    value={formatarData(dados.data_atualizacao)}
                    className="mt-1 block w-full rounded border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <span className="text-sm font-medium text-slate-700">Status da Resposta</span>
                  <input
                    disabled
                    value={dados.status}
                    className="mt-1 block w-full rounded border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-600 cursor-not-allowed font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <span className="text-sm font-medium text-slate-700">Comentário</span>
                  <textarea
                    disabled
                    value={dados.comentario || 'Nenhum comentário registrado.'}
                    rows={4}
                    className="mt-1 block w-full rounded border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-600 cursor-not-allowed"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <span className="text-sm font-medium text-slate-700">Status da Resposta</span>
                  <select
                    value={dados.status}
                    onChange={(e) => setDados({ ...dados, status: e.target.value })}
                    className="mt-1 block w-full rounded border border-slate-300 px-3 py-2 text-sm"
                  >
                    <option value="Em Análise">Em Análise</option>
                    <option value="Aprovada">Aprovada</option>
                    <option value="Rejeitada">Rejeitada</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <span className="text-sm font-medium text-slate-700">Comentário</span>
                  <textarea
                    value={dados.comentario}
                    onChange={(e) => setDados({ ...dados, comentario: e.target.value })}
                    rows={4}
                    placeholder="Adicione um comentário ou justificativa..."
                    className="mt-1 block w-full rounded border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
              </>
            )
          ) : (
            <>
              <div className="sm:col-span-2">
                <span className="text-sm font-medium text-slate-700">Título</span>
                <input
                  required
                  value={dados.titulo}
                  onChange={(e) => setDados({ ...dados, titulo: e.target.value })}
                  className="mt-1 block w-full rounded border border-slate-300 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <span className="text-sm font-medium text-slate-700">Área</span>
                <input
                  required
                  value={dados.area}
                  onChange={(e) => setDados({ ...dados, area: e.target.value })}
                  className="mt-1 block w-full rounded border border-slate-300 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <span className="text-sm font-medium text-slate-700">Prioridade</span>
                <select
                  value={dados.prioridade}
                  onChange={(e) => setDados({ ...dados, prioridade: e.target.value })}
                  className="mt-1 block w-full rounded border border-slate-300 px-3 py-2 text-sm"
                >
                  <option>Baixa</option>
                  <option>Média</option>
                  <option>Alta</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <span className="text-sm font-medium text-slate-700">Descrição</span>
                <textarea
                  required
                  value={dados.descricao}
                  onChange={(e) => setDados({ ...dados, descricao: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t p-5">
          <button type="button" onClick={aoFechar} className="px-4 py-2 text-sm text-slate-600">
            Cancelar
          </button>
          <button type="submit" className="rounded-lg bg-emerald-700 px-4 py-2 text-sm text-white hover:bg-emerald-800">
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}