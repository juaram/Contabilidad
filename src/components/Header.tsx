import React from 'react';

interface HeaderProps {
  activeTab: 'inicio' | 'registro' | 'presupuestos' | 'ajustes';
  setActiveTab: (tab: 'inicio' | 'registro' | 'presupuestos' | 'ajustes') => void;
  onOpenNewEntry: () => void;
  appTitle: string;
  appSubtitle: string;
  username: string;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onOpenNewEntry, appTitle, appSubtitle, username }) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-24 bg-surface border-b-2 border-outline-variant z-50 px-4 md:px-margin-desktop grid grid-cols-3 items-center backdrop-blur-md">
      {/* Column 1: Title & Subtitle */}
      <div
        onClick={() => setActiveTab('inicio')}
        className="flex flex-col cursor-pointer select-none justify-self-start"
      >
        <h1 className="font-bold text-2xl lg:text-3xl text-primary tracking-tight leading-none">
          {appTitle}
        </h1>
        <p className="text-sm font-medium text-on-surface-variant">
          {appSubtitle}
        </p>
      </div>

      {/* Column 2: Nav buttons centered */}
      <nav className="hidden md:flex items-center justify-center gap-1 lg:gap-2">
        <button
          onClick={() => setActiveTab('inicio')}
          className={`flex items-center h-touch-target-min px-4 lg:px-6 rounded-full transition-all font-semibold text-base select-none ${
            activeTab === 'inicio'
              ? 'bg-primary text-on-primary shadow-sm'
              : 'border-2 border-transparent text-on-surface-variant hover:bg-surface-container-highest'
          }`}
        >
          <span className="material-symbols-outlined mr-2 text-[22px]">dashboard</span>
          <span>Inicio</span>
        </button>

        <button
          onClick={() => setActiveTab('registro')}
          className={`flex items-center h-touch-target-min px-4 lg:px-6 rounded-full transition-all font-semibold text-base select-none ${
            activeTab === 'registro'
              ? 'bg-primary text-on-primary shadow-sm'
              : 'border-2 border-transparent text-on-surface-variant hover:bg-surface-container-highest'
          }`}
        >
          <span className="material-symbols-outlined mr-2 text-[22px]">account_balance_wallet</span>
          <span>Registro</span>
        </button>

        <button
          onClick={() => setActiveTab('presupuestos')}
          className={`flex items-center h-touch-target-min px-4 lg:px-6 rounded-full transition-all font-semibold text-base select-none ${
            activeTab === 'presupuestos'
              ? 'bg-primary text-on-primary shadow-sm'
              : 'border-2 border-transparent text-on-surface-variant hover:bg-surface-container-highest'
          }`}
        >
          <span className="material-symbols-outlined mr-2 text-[22px]">savings</span>
          <span>Presupuestos</span>
        </button>

        <button
          onClick={onOpenNewEntry}
          className="flex items-center h-touch-target-min px-4 lg:px-6 rounded-full border-2 border-transparent text-on-surface-variant hover:bg-surface-container-highest transition-all font-semibold text-base select-none"
        >
          <span className="material-symbols-outlined mr-2 text-[22px]">add_circle</span>
          <span>Movimiento</span>
        </button>

        <button
          onClick={() => setActiveTab('ajustes')}
          className={`flex items-center h-touch-target-min px-4 lg:px-6 rounded-full transition-all font-semibold text-base select-none ${
            activeTab === 'ajustes'
              ? 'bg-primary text-on-primary shadow-sm'
              : 'border-2 border-transparent text-on-surface-variant hover:bg-surface-container-highest'
          }`}
        >
          <span className="material-symbols-outlined mr-2 text-[22px]">settings</span>
          <span>Ajustes</span>
        </button>
      </nav>

      {/* Column 3: User & icon */}
      <div className="flex items-center gap-4 justify-self-end">
        {/* Mobile menu shortcut button */}
        <div className="flex md:hidden gap-1">
          <button
            onClick={onOpenNewEntry}
            title="Nueva Entrada"
            className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="font-semibold text-base text-on-surface leading-tight">Usuario</span>
            <span className="text-sm font-medium text-on-surface-variant leading-tight">{username}</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center border-2 border-primary shadow-sm">
            <span className="material-symbols-outlined text-on-primary text-[24px]">person</span>
          </div>
        </div>
      </div>
    </header>
  );
};
