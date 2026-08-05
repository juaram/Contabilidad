import React, { useState } from 'react';
import * as api from '../api';

interface ChangePasswordModalProps {
  isOpen: boolean;
  username: string;
  onClose: () => void;
  showToast: (msg: string) => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, username, onClose, showToast }) => {
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!current || !newPass || !confirm) {
      setError('Todos los campos son obligatorios');
      return;
    }
    if (newPass.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (newPass !== confirm) {
      setError('Las contraseñas nuevas no coinciden');
      return;
    }

    setLoading(true);
    try {
      await api.changePassword(username, current, newPass);
      showToast('✓ Contraseña actualizada correctamente');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-on-background/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="bg-primary p-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[28px]">lock</span>
            <h4 className="font-bold text-xl">Cambiar Contraseña</h4>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors cursor-pointer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <p className="text-sm text-on-surface-variant">Usuario: <strong>{username}</strong></p>

          {error && (
            <div className="bg-error-container text-error font-semibold text-sm px-4 py-3 rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="block font-semibold text-sm text-on-surface">Contraseña actual</label>
            <input type="password" value={current} onChange={(e) => setCurrent(e.target.value)}
              className="w-full h-12 px-4 bg-surface border-2 border-outline-variant rounded-xl focus:border-primary focus:outline-none font-medium text-base" />
          </div>
          <div className="space-y-1">
            <label className="block font-semibold text-sm text-on-surface">Nueva contraseña</label>
            <input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)}
              className="w-full h-12 px-4 bg-surface border-2 border-outline-variant rounded-xl focus:border-primary focus:outline-none font-medium text-base" />
          </div>
          <div className="space-y-1">
            <label className="block font-semibold text-sm text-on-surface">Confirmar nueva contraseña</label>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
              className="w-full h-12 px-4 bg-surface border-2 border-outline-variant rounded-xl focus:border-primary focus:outline-none font-medium text-base" />
          </div>

          <div className="flex gap-4 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 h-12 bg-surface-container-highest font-semibold text-base rounded-xl border-2 border-transparent hover:border-outline-variant transition-all cursor-pointer">
              Cancelar
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 h-12 bg-primary text-on-primary font-bold text-base rounded-xl border-2 border-primary hover:bg-primary-container transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <span className="material-symbols-outlined animate-spin">sync</span> : null}
              {loading ? 'Guardando...' : 'Cambiar Contraseña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
