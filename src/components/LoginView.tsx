import React, { useState } from 'react';
import QRCode from 'qrcode';
import * as api from '../api';

interface LoginViewProps {
  onLogin: (username: string) => void;
}

type Step = 'credentials' | 'code' | 'setup';

const CODE_INPUT_CLASS =
  'w-full h-12 pl-10 pr-4 bg-surface border-2 border-outline-variant rounded-xl focus:border-primary focus:outline-none font-medium text-base tracking-widest text-center';

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [step, setStep] = useState<Step>('credentials');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [secretBase32, setSecretBase32] = useState('');

  const mapError = (err: any): string => {
    const msg = err?.message || '';
    if (msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('net::ERR_CONNECTION_REFUSED')) {
      return 'No se puede conectar con el servidor. Asegúrate de ejecutar el backend PHP (npm run dev:api)';
    }
    if (msg.includes('respuesta vacía')) {
      return 'Error de comunicación con el servidor (Hostalia). Revisa que los archivos PHP estén subidos correctamente.';
    }
    return msg || 'Usuario o contraseña incorrectos';
  };

  const handleCodeChange = (value: string) => {
    setCode(value.replace(/\D/g, '').slice(0, 6));
  };

  const goBack = () => {
    setStep('credentials');
    setError('');
    setCode('');
  };

  const handleSubmitCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password) {
      setError('Ingrese usuario y contraseña');
      return;
    }
    setLoading(true);
    try {
      const res = await api.login(username.trim(), password);
      if (res.totp_required && !res.needs_setup) {
        setCode('');
        setError('');
        setStep('code');
      } else if (res.totp_required && res.needs_setup) {
        const data = await api.totpSetup(username.trim(), password);
        setSecretBase32(data.secret_base32);
        setQrDataUrl(await QRCode.toDataURL(data.otpauth_uri, { width: 220, margin: 2 }));
        setCode('');
        setError('');
        setStep('setup');
      } else if (res.user) {
        onLogin(username.trim());
      }
    } catch (err: any) {
      setError(mapError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!code.trim()) {
      setError('Introduce el código de 6 dígitos');
      return;
    }
    setLoading(true);
    try {
      const res = await api.login(username.trim(), password, code.trim());
      if (res.user) onLogin(username.trim());
    } catch (err: any) {
      setError(mapError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!code.trim()) {
      setError('Introduce el código de 6 dígitos de tu app autenticadora');
      return;
    }
    setLoading(true);
    try {
      await api.totpActivate(username.trim(), password, code.trim());
      onLogin(username.trim());
    } catch (err: any) {
      setError(mapError(err));
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

          {step === 'credentials' && (
            <form onSubmit={handleSubmitCredentials} className="p-6 space-y-4">
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
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    className="w-full h-12 pl-10 pr-12 bg-surface border-2 border-outline-variant rounded-xl focus:border-primary focus:outline-none font-medium text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface cursor-pointer"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
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
          )}

          {step === 'code' && (
            <form onSubmit={handleSubmitCode} className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[28px] text-primary">verified_user</span>
                <div>
                  <h2 className="font-bold text-lg text-on-surface">Verificación en dos pasos</h2>
                  <p className="text-sm text-on-surface-variant">Introduce el código de 6 dígitos de tu app autenticadora.</p>
                </div>
              </div>
              {error && (
                <div className="bg-error-container/10 text-error font-semibold text-sm px-4 py-3 rounded-lg flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  {error}
                </div>
              )}
              <div className="space-y-1">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">pin</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoFocus
                    value={code}
                    onChange={(e) => handleCodeChange(e.target.value)}
                    placeholder="000000"
                    className={CODE_INPUT_CLASS}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-primary text-on-primary font-bold text-base rounded-xl border-2 border-primary hover:bg-primary-container transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <span className="material-symbols-outlined animate-spin">sync</span> : null}
                {loading ? 'Verificando...' : 'Verificar'}
              </button>
              <button
                type="button"
                onClick={goBack}
                className="w-full h-10 text-on-surface-variant font-semibold text-sm hover:text-primary transition-colors cursor-pointer"
              >
                Volver
              </button>
            </form>
          )}

          {step === 'setup' && (
            <form onSubmit={handleSubmitSetup} className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[28px] text-primary">qr_code_2</span>
                <div>
                  <h2 className="font-bold text-lg text-on-surface">Verificación en dos pasos</h2>
                  <p className="text-sm text-on-surface-variant">
                    Escanea el código QR con tu app autenticadora (Microsoft Authenticator, Google Authenticator, Aegis...).
                  </p>
                </div>
              </div>
              {error && (
                <div className="bg-error/10 text-error font-semibold text-sm px-4 py-3 rounded-lg flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  {error}
                </div>
              )}
              <div className="flex justify-center">
                <div className="p-3 bg-surface border-2 border-outline-variant rounded-xl">
                  {qrDataUrl && <img src={qrDataUrl} alt="Código QR de verificación en dos pasos" className="w-56 h-56" />}
                </div>
              </div>
              <div className="space-y-1 bg-surface-container-highest p-3 rounded-xl">
                <label className="block font-semibold text-sm text-on-surface">Si no puedes escanear, escribe este código en la app:</label>
                <input
                  type="text"
                  readOnly
                  value={secretBase32}
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                  className="w-full bg-surface border-2 border-outline-variant rounded-lg px-3 py-2 font-code text-sm tracking-widest text-on-surface focus:border-primary focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="block font-semibold text-sm text-on-surface">Código de confirmación</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">pin</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoFocus
                    value={code}
                    onChange={(e) => handleCodeChange(e.target.value)}
                    placeholder="000000"
                    className={CODE_INPUT_CLASS}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-primary text-on-primary font-bold text-base rounded-xl border-2 border-primary hover:bg-primary-container transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <span className="material-symbols-outlined animate-spin">sync</span> : null}
                {loading ? 'Activando...' : 'Confirmar y entrar'}
              </button>
              <button
                type="button"
                onClick={goBack}
                className="w-full h-10 text-on-surface-variant font-semibold text-sm hover:text-primary transition-colors cursor-pointer"
              >
                Volver
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};