
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  LogOut,
  Leaf,
  ChevronRight,
  CircleHelp,
} from 'lucide-react';

export default function InternoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    router.push('/login');
  };

  const navItems = [
    {
      name: 'Dashboard',
      href: '/interno/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Solicitações',
      href: '/interno/solicitacoes',
      icon: FileText,
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-white text-slate-800">

      {/* Barra lateral */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col
        justify-between border-r border-slate-200 bg-slate-50/80 p-5">

        <div>
          {/* Identidade visual */}
          <div className="flex items-center gap-3 px-2 pb-7 pt-2">
            <div className="flex h-11 w-11 items-center justify-center
              rounded-xl bg-emerald-700 text-white shadow-sm
              shadow-emerald-900/15">
              <Leaf size={24} strokeWidth={2.2} />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight
                text-slate-900">
                Painel Interno
              </h1>
              <p className="mt-0.5 text-xs text-slate-500">
                Gestão de Solicitações
              </p>
            </div>
          </div>

          {/* Navegação */}
          <div className="mb-3 px-3 text-[11px] font-semibold
            uppercase tracking-widest text-slate-400">
            Menu principal
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-3
                    rounded-xl px-3 py-3 text-sm font-medium
                    transition-all duration-200 ${
                      isActive
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'
                    }`}
                >
                  <Icon
                    size={20}
                    strokeWidth={isActive ? 2.3 : 1.8}
                    className={isActive
                      ? 'text-emerald-700'
                      : 'text-slate-400 group-hover:text-emerald-700'}
                  />

                  <span className="flex-1">{item.name}</span>

                  {isActive && (
                    <ChevronRight
                      size={16}
                      className="text-emerald-700"
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Rodapé da sidebar */}
        <div className="border-t border-slate-200 pt-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl
              px-3 py-3 text-sm font-medium text-slate-600
              transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={19} />
            <span>Sair do Sistema</span>
          </button>
        </div>
      </aside>

      {/* Conteúdo principal */}
      <main className="flex min-w-0 flex-1 flex-col overflow-y-auto
        bg-white">

        {/* Cabeçalho */}
        <header className="sticky top-0 z-10 flex min-h-16
          items-center justify-between gap-4 border-b
          border-slate-200 bg-white/95 px-5 backdrop-blur
          sm:px-8">

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold
              text-slate-800">
              Sistema de Solicitações Internas
            </p>
            <p className="mt-0.5 hidden text-xs text-slate-500 sm:block">
              Gestão e acompanhamento de solicitações
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2
            rounded-full border border-emerald-100 bg-emerald-50
            px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium text-emerald-800">
              Sessão ativa
            </span>
          </div>
        </header>

        {/* Página atual */}
        <div className="flex-1 p-5 sm:p-8 lg:p-10">
          <div className="mx-auto w-full max-w-7xl">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
