import React, { useState, useEffect, useCallback } from 'react';
import * as api from '../api';

interface UsersManagementModalProps {
  isOpen: boolean;
  currentUsername: string;
  onClose: () => void;
  showToast: (msg: string) => void;
}

export const UsersManagementModal: React.FC<UsersManagementModalProps> = ({ isOpen, currentUsername, onClose, showToast }) => {
  const [users, setUsers] = useState<api.User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [editingUser, setEditingUser] = useState<api.User | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [totpEnabled, setTotpEnabled] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setUsers(await api.fetchUsers());
    } catch (err: any) {
      setError(err.message || 'Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setView('list');
      setEditingUser(null);
      setDeleteConfirmId(null);
      setUsername('');
      setPassword('');
      setConfirmPass('');
      setTotpEnabled(false);
      setError('');
      loadUsers();
    }
  }, [isOpen, loadUsers]);

  if (!isOpen) return null;

  const startCreate = () => {
    setView('create');
    setUsername('');
    setPassword('');
    setConfirmPass('');
    setTotpEnabled(false);
    setError('');
  };

  const startEdit = (user: api.User) => {
    setView('edit');
    setEditingUser(user);
    setUsername(user.username);
    setPassword('');
    setConfirmPass('');
    setTotpEnabled(!!user.totp_enabled);
    setError('');
  };

  const validate = (): string => {
    if (!username.trim()) return 'El nombre de usuario es obligatorio';
    if (view === 'create' && !password) return 'La contraseña es obligatoria';
    if (password && password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
    if (password !== confirmPass) return 'Las contraseñas no coinciden';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validate();
    if (validation) {
      setError(validation);
      return;
    }
    setSaving(true);
    setError('');
    try {
      if (view === 'create') {
        await api.createUser(username.trim(), password, totpEnabled);
        showToast('✓ Usuario creado correctamente');
      } else if (editingUser) {
        await api.updateUser(parseInt(editingUser.id), username.trim(), password || undefined, totpEnabled);
        showToast('✓ Usuario actualizado correctamente');
      }
      setView('list');
      await loadUsers();
    } catch (err: any) {
      setError(err.message || 'Error al guardar el usuario');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (user: api.User) => {
    setDeleteConfirmId(null);
    if (user.username === currentUsername) {
      setError('No puedes eliminar tu propio usuario');
      return;
    }
    try {
      await api.deleteUser(parseInt(user.id));
      showToast('✓ Usuario eliminado');
      await loadUsers();
    } catch (err: any) {
      setError(err.message || 'Error al eliminar el usuario');
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-on-background/40 backdrop-blur-sm animate-fade-in">
        <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-xl w-full max-w-lg overflow-hidden shadow-2xl">
          <div className="bg-primary p-4 flex items-center justify-between text-on-primary">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[28px]">manage_accounts</span>
              <h4 className="font-bold text-xl">Gestión de Usuarios</h4>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="p-4 space-y-4">
            {error && (
              <div className="bg-error-container text-error font-semibold text-sm px-4 py-3 rounded-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">error</span>
                {error}
              </div>
            )}

            {view === 'list' && (
              <>
                {loading ? (
                  <div className="flex items-center justify-center gap-2 py-8 text-on-surface-variant">
                    <span className="material-symbols-outlined animate-spin">sync</span>
                    <span>Cargando usuarios...</span>
                  </div>
                ) : (
                  <div className="flex flex-col divide-y-2 divide-outline-variant max-h-80 overflow-y-auto border-2 border-outline-variant rounded-xl">
                    {users.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-3">
                          <span className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined">person</span>
                          </span>
                          <div className="flex flex-col">
                            <span className="font-semibold text-base text-on-surface">
                              {user.username}
                              {user.totp_enabled && (
                                <span
                                  className="ml-2 text-xs px-2 py-0.5 rounded-full bg-secondary text-on-secondary font-bold align-middle"
                                  title="Verificación en dos pasos activada"
                                >
                                  2FA
                                </span>
                              )}
                              {user.username === currentUsername && (
                                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-primary text-on-primary font-bold align-middle">
                                  Tú
                                </span>
                              )}
                            </span>
                            {user.created_at && (
                              <span className="font-medium text-sm text-on-surface-variant">
                                Creado: {user.created_at.slice(0, 10)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => startEdit(user)}
                            className="p-2 rounded text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                            title="Editar usuario"
                          >
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(user.id)}
                            className="p-2 rounded text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors cursor-pointer"
                            title="Eliminar usuario"
                          >
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={startCreate}
                  className="w-full h-12 bg-primary text-on-primary font-bold rounded-xl hover:bg-primary-container transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">person_add</span>
                  Nuevo Usuario
                </button>
              </>
            )}

            {(view === 'create' || view === 'edit') && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="block font-semibold text-sm text-on-surface">Nombre de usuario</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ej: pedro"
                    className="w-full h-12 px-4 bg-surface border-2 border-outline-variant rounded-xl focus:border-primary focus:outline-none font-medium text-base"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-semibold text-sm text-on-surface">
                    {view === 'edit' ? 'Nueva contraseña (opcional)' : 'Contraseña'}
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={view === 'edit' ? 'Déjalo en blanco para no cambiarla' : 'Mínimo 6 caracteres'}
                    className="w-full h-12 px-4 bg-surface border-2 border-outline-variant rounded-xl focus:border-primary focus:outline-none font-medium text-base"
                  />
                </div>
                {password !== '' && (
                  <div className="space-y-1">
                    <label className="block font-semibold text-sm text-on-surface">Confirmar contraseña</label>
                    <input
                      type="password"
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                      className="w-full h-12 px-4 bg-surface border-2 border-outline-variant rounded-xl focus:border-primary focus:outline-none font-medium text-base"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between gap-4 p-4 border-2 border-outline-variant rounded-xl">
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm text-on-surface">Requerir verificación en dos pasos (2FA)</span>
                    <span className="font-medium text-xs text-on-surface-variant">
                      {totpEnabled
                        ? view === 'edit'
                          ? 'Activado: el usuario usará su app autenticadora en el próximo acceso'
                          : 'Activado: el usuario configurará el QR en su primer acceso'
                        : 'Desactivado: el usuario entra solo con contraseña'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTotpEnabled(!totpEnabled)}
                    aria-pressed={totpEnabled}
                    className={`w-16 h-8 rounded-full flex items-center px-1 transition-colors cursor-pointer shrink-0 ${totpEnabled ? 'bg-secondary' : 'bg-outline-variant'}`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full bg-on-secondary shadow transition-transform duration-200 ${totpEnabled ? 'translate-x-8' : 'translate-x-0'}`}
                    />
                  </button>
                </div>

                <div className="flex gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => { setView('list'); setError(''); }}
                    className="flex-1 h-12 bg-surface-container-highest font-semibold text-base rounded-xl border-2 border-transparent hover:border-outline-variant transition-all cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 h-12 bg-primary text-on-primary font-bold text-base rounded-xl border-2 border-primary hover:bg-primary-container transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {saving ? <span className="material-symbols-outlined animate-spin">sync</span> : null}
                    {saving ? 'Guardando...' : view === 'create' ? 'Crear Usuario' : 'Guardar Cambios'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {deleteConfirmId && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-on-background/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest border-2 border-error rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="bg-error p-4 flex items-center justify-between text-on-error">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[28px]">warning</span>
                <h4 className="font-bold text-xl">Eliminar Usuario</h4>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <p className="text-base text-on-surface">
                ¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 h-12 bg-surface-container-highest font-semibold text-base rounded-xl border-2 border-transparent hover:border-outline-variant transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const user = users.find((u) => u.id === deleteConfirmId);
                    if (user) handleDelete(user);
                  }}
                  className="flex-1 h-12 bg-error text-on-error font-bold text-base rounded-xl border-2 border-error hover:bg-error/90 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                  Sí, eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
