// Componente responsável por modal de exclusão de solicitações

import { FormEvent } from 'react';
import { AlertTriangle, X } from 'lucide-react';

type ExclusaoModalProps = {
  aberto: boolean;
  aoFechar: () => void;
  aoSalvar: (e: FormEvent<HTMLFormElement>) => void;
};

export default function ExclusaoModal({ aberto, aoFechar, aoSalvar }: ExclusaoModalProps) {
  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 p-4">
      <form onSubmit={aoSalvar} className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 p-5 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-red-50 p-2 text-red-600 border border-red-100">
              <AlertTriangle size={20} />
            </div>
            <h3 className="font-semibold text-slate-800 text-base">
              Confirmar exclusão
            </h3>
          </div>
          <button type="button" onClick={aoFechar} className="text-slate-400 hover:text-slate-600 transition">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-slate-600 leading-relaxed">
            Deseja realmente excluir esta solicitação? Esta ação não poderá ser desfeita.
          </p>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
          <button
            type="button"
            onClick={aoFechar}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 transition"
          >
            Sim, excluir
          </button>
        </div>
      </form>
    </div>
  );
}