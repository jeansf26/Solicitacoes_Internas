'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginRequest } from '../services/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      // Chama a função centralizada da API
      const data = await loginRequest(email, senha);

      // Salva o token JWT no localStorage do navegador
      localStorage.setItem('token', data.token);

      // Redireciona para a página principal ou de solicitações
      router.push('/interno');
    } catch (err: any) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white/95 backdrop-blur p-8 shadow-2xl border border-white/10 text-slate-800">
        <h1 className="mb-6 text-center text-2xl font-bold text-emerald-950">Sistema de Solicitações</h1>

        {erro && (
          <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700 text-center">
            {erro}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
              placeholder="admin@gmail.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
              placeholder="******"
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="w-full rounded-lg bg-emerald-700 py-2.5 text-white font-semibold hover:bg-emerald-800 transition disabled:bg-emerald-300 shadow-md shadow-emerald-900/20"
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}