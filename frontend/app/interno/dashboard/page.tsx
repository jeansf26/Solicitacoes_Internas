'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart3, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { dashboardRequest } from '../../services/api';
import { getCookie } from '../../services/cookies';
import toast from 'react-hot-toast';

// Tipos criados para organizar as métricas de status e prioridade
type StatusItem = {
  status: string;
  quantidade_status: number;
};

type PrioridadeItem = {
  prioridade: string;
  quantidade_prioridade: number;
};

type DashboardData = {
  total: number;
  por_status: StatusItem[];
  por_prioridade: PrioridadeItem[];
};

export default function DashboardPage() {
  const [dados, setDados] = useState<DashboardData | null>(null); //variavel que guarda as métricas
  const [carregando, setCarregando] = useState(true); //variavel que controla o carregamento
  const router = useRouter(); //hook do next que controla a rota

  // função que carrega as métricas da API
  async function carregarDashboard() {
    try {
      setCarregando(true);
      const resposta = await dashboardRequest();
      setDados(resposta);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Não foi possível carregar as métricas.');
    } finally {
      setCarregando(false);
    }
  }

  // função do next que controla o carregamento (roda ao criar a página)
  // se o usuário não estiver logado, redireciona para a página de login
  useEffect(() => {
    if (!getCookie('token')) {
      router.replace('/login');
      return;
    }
    carregarDashboard();
  }, [router]);

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Dashboard</h2>
          <p className="mt-1 text-sm text-slate-500">Métricas e visão geral das solicitações do sistema.</p>
        </div>
        <button
          onClick={carregarDashboard}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm hover:bg-slate-50 transition"
        >
          Atualizar Dados
        </button>
      </div>

      {carregando && (
        <p className="p-8 text-center text-sm text-slate-500">Carregando métricas...</p>
      )}

      {!carregando && dados && (
        <div className="space-y-6">
          {/* Card Principal de Total */}
          <div className="grid gap-6 sm:grid-cols-1">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-slate-500">Total de Solicitações</span>
                <h3 className="text-4xl font-extrabold text-slate-900 mt-1">{dados.total}</h3>
              </div>
              <div className="rounded-xl bg-emerald-50 p-4 text-emerald-700 border border-emerald-100">
                <BarChart3 size={28} />
              </div>
            </div>
          </div>

          {/* Grid de Status e Prioridades */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Card Por Status */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">
                Solicitações por Status
              </h3>
              <div className="space-y-3">
                {dados.por_status && dados.por_status.length > 0 ? (
                  dados.por_status.map((item, index) => (
                    <div key={index} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 border border-slate-100">
                      <span className="text-sm font-medium text-slate-700">{item.status}</span>
                      <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-800 border border-blue-100">
                        {item.quantidade_status}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">Nenhum registro encontrado.</p>
                )}
              </div>
            </div>

            {/* Card Por Prioridade */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">
                Solicitações por Prioridade
              </h3>
              <div className="space-y-3">
                {dados.por_prioridade && dados.por_prioridade.length > 0 ? (
                  dados.por_prioridade.map((item, index) => (
                    <div key={index} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 border border-slate-100">
                      <span className="text-sm font-medium text-slate-700">{item.prioridade}</span>
                      <span className="rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 border border-amber-100">
                        {item.quantidade_prioridade}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">Nenhum registro encontrado.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}