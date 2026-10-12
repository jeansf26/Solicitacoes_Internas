'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Edit, Funnel, Plus, Trash2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  solicitacaoCadastroRequest,
  solicitacaoDeleteRequest,
  solicitacaoRequest,
  solicitacaoUpdateRequest,
} from '../../services/api';
import SolicitacaoModal from './components/SolicitacaoModal';
import FiltroModal from './components/FiltroModal';
import toast from 'react-hot-toast';
import ExclusaoModal from './components/ExclusaoModal';

type DadosFormulario = {
  titulo: string;
  descricao: string;
  area: string;
  prioridade: string;
  status: string;
  comentario: string;
  data_atualizacao: Date | null;
};

type Filtros = {
  titulo: string;
  prioridade: string;
  status: string;
  crescente_data: boolean;
};

type Solicitacao = DadosFormulario & {
  id: number;
  area_solicitante?: string;
  nome_solicitante: string;
  data_solicitacao: Date;
};

const filtroVazio = {
  titulo: "",
  prioridade: "",
  status: "",
  crescente_data: true,
};

const dadosVazios: DadosFormulario = {
  titulo: '',
  descricao: '',
  area: '',
  prioridade: 'Média',
  status: 'Aberta',
  comentario: '',
  data_atualizacao: null,
};

export default function SolicitacoesPage() {
  // Variaveis que definem os formularios abertos
  const [formularioAberto, setFormularioAberto] = useState(false);
  const [filtrosAberto, setFiltrosAberto] = useState(false);
  const [exclusaoAberto, setExclusaoAberto] = useState(false);

  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [dados, setDados] = useState<DadosFormulario>(dadosVazios);
  const [filtro, setFiltro] = useState<Filtros>(filtroVazio);
  const [modo, setModo] = useState('');

  const [idEditando, setIdEditando] = useState<number | null>(null);
  const [idExcluindo, setIdExcluindo] = useState<number | null>(null);

  const [carregando, setCarregando] = useState(true);
  const router = useRouter();

  async function carregarSolicitacoes() {
    try {
      setCarregando(true);

      // Monta os parâmetros de URL apenas com o que for relevante
      const params = new URLSearchParams();
      if (filtro.titulo.trim()) params.append('titulo', filtro.titulo);
      if (filtro.prioridade) params.append('prioridade', filtro.prioridade);
      if (filtro.status) params.append('status', filtro.status);
      params.append('ordem', filtro.crescente_data ? 'ASC' : 'DESC');

      // Passa os filtros dinâmicos para a requisição da API
      const resposta = await solicitacaoRequest(params.toString());
      const lista = Array.isArray(resposta) ? resposta : resposta.data;

      setSolicitacoes(
        lista.map((item: Solicitacao) => ({
          ...item,
          area: item.area ?? item.area_solicitante ?? '',
          prioridade: item.prioridade ?? 'Média',
          status: item.status ?? 'Pendente',
          comentario: item.comentario ?? '',
        }))
      );
    } catch (error) {
      toast.error('Não foi possível carregar as solicitações.');
    } finally {
      setCarregando(false);
    }
  }

  // Função disparada ao aplicar os filtros no modal
  async function aplicarFiltros(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setFiltrosAberto(false);
    await carregarSolicitacoes();
  }

  useEffect(() => {
    if (!sessionStorage.getItem('token')) {
      router.replace('/login');
    }
    const timer = window.setTimeout(carregarSolicitacoes, 0);
    return () => window.clearTimeout(timer);
  }, []);

  function abrirCadastro() {
    if(!filtrosAberto){
        setDados(dadosVazios);
        setIdEditando(null);
        setModo('cadastro');
        setFormularioAberto(true);   
    }
  }

  function abrirFiltro() {
    if(!formularioAberto){
        setFiltrosAberto(true);
    }
  }
  
  function abrirResposta(solicitacao: Solicitacao) {
    setDados({
      titulo: solicitacao.titulo,
      descricao: solicitacao.descricao,
      area: solicitacao.area,
      prioridade: solicitacao.prioridade,
      status: solicitacao.status,
      comentario: solicitacao.comentario,
      data_atualizacao: solicitacao.data_atualizacao
    });

    setIdEditando(solicitacao.id);
    setModo(solicitacao.status == "Aprovada" || solicitacao.status == "Reprovada" ? "fechado" : "editar");
    setFormularioAberto(true);
  }

  async function salvar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    try {
      if (idEditando === null) {
        await solicitacaoCadastroRequest(
          dados.titulo,
          dados.descricao,
          dados.area,
          dados.prioridade,
          dados.status,
          dados.comentario
        );
      } else {
        await solicitacaoUpdateRequest(
          idEditando,
          dados.titulo,
          dados.descricao,
          dados.area,
          dados.prioridade,
          dados.status,
          dados.comentario
        );
      }

      setFormularioAberto(false);
      carregarSolicitacoes();
    } catch (error) {
      toast.error('Não foi possível salvar a solicitação.');
    }
  }

  // Apenas abre o modal e guarda o ID do item selecionado
  function solicitarExclusao(id: number) {
    setIdExcluindo(id);
    setExclusaoAberto(true);
  }

  // Executa a exclusão de fato quando confirmado no modal
  async function confirmarExclusao() {
    if (idExcluindo === null) return;

    try {
      await solicitacaoDeleteRequest(idExcluindo);
      toast.success('Solicitação excluída com sucesso!');
      setExclusaoAberto(false);
      setIdExcluindo(null);
      carregarSolicitacoes();
    } catch (error) {
      toast.error('Não foi possível excluir a solicitação.');
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Solicitações</h2>
          <p className="mt-1 text-sm text-slate-500">
            Gerencie as solicitações cadastradas.
          </p>
        </div>

        <button
          onClick={abrirCadastro}
          className="flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
        >
          <Plus size={18} />
          Nova solicitação
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <strong>Solicitações cadastradas</strong>
          <button
          onClick={abrirFiltro}
          className="flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
        >
          <Funnel size={18} />
          Filtrar
        </button>
        </div>

        {carregando && (
          <p className="p-6 text-sm text-slate-500">Carregando...</p>
        )}

        {!carregando && solicitacoes.length === 0 && (
          <p className="p-6 text-sm text-slate-500">
            Nenhuma solicitação cadastrada.
          </p>
        )}

        {!carregando && solicitacoes.length > 0 && (
          <div className="divide-y divide-slate-100">
            {solicitacoes.map((solicitacao) => (
              <article key={solicitacao.id} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      {solicitacao.titulo} - {solicitacao.data_solicitacao.toString()}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {solicitacao.descricao}
                    </p>
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={() => abrirResposta(solicitacao)}
                      title="Responder / Avaliar Solicitação"
                      className="rounded p-2 text-slate-500 hover:bg-slate-100"
                    >
                      <Edit size={21} />
                    </button>
                    <button
                      onClick={() => solicitarExclusao(solicitacao.id)}
                      className="rounded p-2 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={21} />
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-sm text-dark">
                  <span className="rounded border bg-slate-100 px-2 py-1">
                    Área: {solicitacao.area}
                  </span>
                  <span className="rounded border bg-amber-50 px-2 py-1">
                    Prioridade: {solicitacao.prioridade}
                  </span>
                  <span className="rounded border bg-blue-50 px-2 py-1">
                    {solicitacao.status}
                  </span>
                  <span className="rounded border bg-blue-50 px-2 py-1">
                    Solicitante: {solicitacao.nome_solicitante}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
      <SolicitacaoModal
        aberto={formularioAberto}
        modo={modo}
        dados={dados}
        setDados={setDados}
        aoFechar={() => setFormularioAberto(false)}
        aoSalvar={salvar}
      />
      <FiltroModal
        aberto={filtrosAberto}
        modo={modo}
        filtros={filtro}
        setFiltro={setFiltro}
        aoFechar={() => setFiltrosAberto(false)}
        aoSalvar={aplicarFiltros}
      />
      <ExclusaoModal
        aberto={exclusaoAberto}
        aoFechar={() => setExclusaoAberto(false)}
        aoSalvar={confirmarExclusao}
      />
    </section>
  );
}