import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  ArrowRight, 
  Check,
  Server,
  Shield,
  MapPin
} from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('admin@rtmimpresos.com.mx');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen w-full bg-[#F0F2F5] text-zinc-900 flex items-center justify-center p-4 sm:p-6 lg:p-10 selection:bg-[#1E3A8A] selection:text-white login-anim-bg">
      {/* Background ambient pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-4xl min-h-[580px] bg-white border border-zinc-200/90 rounded-[2rem] shadow-2xl shadow-zinc-900/10 flex flex-col md:flex-row overflow-hidden login-anim-card">
        
        {/* Subtle one-time system initialization scanline */}
        <div className="login-anim-scanline z-30" />

        {/* ========================================================================= */}
        {/* LEFT COLUMN: BRANDING & DEMO SERVER STATUS */}
        {/* ========================================================================= */}
        <div className="relative hidden md:flex md:w-[46%] bg-[#FAFAFC] p-10 lg:p-12 flex-col justify-between border-r border-zinc-200/80 overflow-hidden login-anim-left">
          
          {/* Subtle clean grid */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:20px_20px]" />

          {/* Top: Logo Oficial + ERP Badge */}
          <div className="relative z-10 login-anim-logo">
            <div className="flex items-center gap-3">
              <img 
                src="/assets/logo-rtm.svg" 
                alt="Impresos RTM" 
                style={{ maxHeight: '40px', width: 'auto' }}
                className="h-10 w-auto object-contain drop-shadow-sm"
              />
              <span className="text-xs font-black tracking-[0.25em] text-zinc-500 uppercase border-l-2 border-zinc-300 pl-3">
                ERP
              </span>
            </div>
          </div>

          {/* Center Content: Entorno del Servidor Demo */}
          <div className="relative z-10 my-auto py-6 space-y-5">
            <div className="space-y-1.5">
              <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900">
                Sistema de Gestión
              </h1>
              <p className="text-xs text-zinc-500 font-normal">
                Control Integral de Operaciones & Producción.
              </p>
            </div>

            {/* Info Card: Servidor Demo & Nodo */}
            <div className="p-4 rounded-2xl bg-white border border-zinc-200/90 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                <span className="text-[11px] font-bold text-zinc-700 uppercase tracking-wider">Estado del Sistema</span>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold">
                  <span className="relative flex h-2 w-2 items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 login-anim-dot" />
                  </span>
                  <span>En línea</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-zinc-600">
                  <span className="flex items-center gap-1.5 text-zinc-400">
                    <Server className="w-3.5 h-3.5" />
                    Entorno
                  </span>
                  <span className="font-semibold text-zinc-800">Servidor Demo RTM v1.0</span>
                </div>

                <div className="flex items-center justify-between text-zinc-600">
                  <span className="flex items-center gap-1.5 text-zinc-400">
                    <MapPin className="w-3.5 h-3.5" />
                    Planta Principal
                  </span>
                  <span className="font-medium text-zinc-700">Reynosa, Tamps.</span>
                </div>

                <div className="flex items-center justify-between text-zinc-600">
                  <span className="flex items-center gap-1.5 text-zinc-400">
                    <Shield className="w-3.5 h-3.5" />
                    Sesión
                  </span>
                  <span className="font-medium text-zinc-700">Demo Autorizada</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Descriptor */}
          <div className="relative z-10 pt-4 border-t border-zinc-200/80 flex items-center justify-between text-[11px] text-zinc-400 login-anim-footer">
            <span className="font-medium">Plataforma Demo</span>
            <span className="font-mono text-[10px]">rtm-demo-2026</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: LOGIN FORM */}
        {/* ========================================================================= */}
        <div className="flex-1 p-8 sm:p-12 lg:p-14 flex flex-col justify-between bg-white login-anim-right">
          
          {/* Mobile Header */}
          <div className="md:hidden flex items-center justify-between mb-8 pb-4 border-b border-zinc-100 login-anim-logo">
            <div className="flex items-center gap-2.5">
              <img 
                src="/assets/logo-rtm.svg" 
                alt="Impresos RTM" 
                style={{ maxHeight: '32px', width: 'auto' }}
                className="h-8 w-auto object-contain"
              />
              <span className="text-[11px] font-black tracking-widest text-zinc-500 uppercase border-l-2 border-zinc-300 pl-2.5">
                ERP
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 login-anim-dot" />
              <span>Demo</span>
            </div>
          </div>

          {/* Center Form Section */}
          <div className="w-full max-w-sm mx-auto my-auto py-2">
            <div className="mb-8 login-anim-item-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
                Iniciar sesión
              </h2>
              <p className="text-xs text-zinc-500 mt-1.5">
                Ingresa tus credenciales para acceder al ERP de Impresos RTM.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="login-anim-item-2">
                <label 
                  htmlFor="email"
                  className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 mb-1.5"
                >
                  Correo electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                    <Mail className={`w-4 h-4 transition-colors ${focusedField === 'email' ? 'text-[#1E3A8A]' : ''}`} />
                  </div>
                  <input
                    id="email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="admin@rtmimpresos.com.mx"
                    autoComplete="email"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-[#1E3A8A] focus:ring-4 focus:ring-[#1E3A8A]/10 transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="login-anim-item-3">
                <div className="flex items-center justify-between mb-1.5">
                  <label 
                    htmlFor="password"
                    className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700"
                  >
                    Contraseña
                  </label>
                  <button
                    type="button"
                    tabIndex={-1}
                    className="text-xs text-zinc-500 hover:text-[#1E3A8A] transition-colors font-medium cursor-pointer"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                    <Lock className={`w-4 h-4 transition-colors ${focusedField === 'password' ? 'text-[#1E3A8A]' : ''}`} />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Introduce tu contraseña"
                    autoComplete="current-password"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-11 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-[#1E3A8A] focus:ring-4 focus:ring-[#1E3A8A]/10 transition-all shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
                    title={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center justify-between pt-1 login-anim-item-4">
                <label 
                  onClick={() => setRememberMe(!rememberMe)}
                  className="flex items-center gap-2 cursor-pointer select-none group"
                >
                  <div 
                    className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-all ${
                      rememberMe 
                        ? 'bg-zinc-900 border-zinc-900 text-white shadow-sm' 
                        : 'bg-white border-zinc-300 group-hover:border-zinc-400'
                    }`}
                  >
                    {rememberMe && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="text-xs text-zinc-600 group-hover:text-zinc-900 transition-colors font-medium">
                    Recordarme
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2 login-anim-item-5">
                <button
                  type="submit"
                  className="relative overflow-hidden w-full py-3.5 px-6 rounded-xl bg-[#1E3A8A] hover:bg-[#172554] active:scale-[0.99] text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2.5 shadow-lg shadow-[#1E3A8A]/20 hover:shadow-[#1E3A8A]/30 transition-all duration-150 cursor-pointer group"
                >
                  <span className="relative z-10 flex items-center gap-2.5">
                    <span>Iniciar sesión</span>
                    <ArrowRight className="w-4 h-4 text-white/90 transition-transform group-hover:translate-x-0.5" />
                  </span>
                  {/* Subtle initial sheen highlight */}
                  <span className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none login-anim-sheen" />
                </button>
              </div>
            </form>
          </div>

          {/* Discreet Footer */}
          <div className="pt-6 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-1.5 text-[11px] text-zinc-400 text-center sm:text-left login-anim-footer">
            <p>
              &copy; {new Date().getFullYear()} Impresos RTM S.A. de C.V.
            </p>
            <p className="flex items-center gap-1.5">
              <span>by <strong className="font-semibold text-zinc-700">Nexora IT®</strong></span>
              <span className="text-zinc-300">&middot;</span>
              <a 
                href="https://itnexora.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[10px] text-zinc-400 hover:text-zinc-800 underline transition-colors cursor-pointer"
              >
                www.itnexora.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
