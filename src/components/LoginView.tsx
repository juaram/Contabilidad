import React, { useState } from 'react';
import * as api from '../api';

interface LoginViewProps {
  onLogin: (username: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password) {
      setError('Ingrese usuario y contraseña');
      return;
    }
    setLoading(true);
    try {
      await api.login(username.trim(), password);
      onLogin(username.trim());
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('net::ERR_CONNECTION_REFUSED')) {
        setError('No se puede conectar con el servidor. Asegúrate de ejecutar: node api/mock-server.mjs');
      } else if (msg.includes('respuesta vacía')) {
        setError('Error de comunicación con el servidor (Hostalia). Revisa que los archivos PHP estén subidos correctamente.');
      } else {
        setError(msg || 'Usuario o contraseña incorrectos');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans text-on-background antialiased flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-primary p-6 text-center">
            <span className="material-symbols-outlined text-white text-5xl">account_balance</span>
            <h1 className="text-2xl font-bold text-on-primary mt-2">Mis Cuentas</h1>
            <p className="text-on-primary/70 text-sm">Control Financiero Personal</p>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="bg-error-container text-error font-semibold text-sm px-4 py-3 rounded-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">error</span>
                {error}
              </div>
            )}
            <div className="space-y-1">
              <label className="block font-semibold text-sm text-on-surface">Usuario</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">person</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nombre de usuario"
                  className="w-full h-12 pl-10 pr-4 bg-surface border-2 border-outline-variant rounded-xl focus:border-primary focus:outline-none font-medium text-base"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="block font-semibold text-sm text-on-surface">Contraseña</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">lock</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  className="w-full h-12 pl-10 pr-4 bg-surface border-2 border-outline-variant rounded-xl focus:border-primary focus:outline-none font-medium text-base"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-primary text-on-primary font-bold text-base rounded-xl border-2 border-primary hover:bg-primary-container transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="material-symbols-outlined animate-spin">sync</span>
              ) : (
                <span className="material-symbols-outlined">login</span>
              )}
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
        <p className="text-center text-outline text-sm mt-4">
          Acceso privado — Usuario: admin / Contraseña: password
        </p>
      </div>
    </div>
  );
};
