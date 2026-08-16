import React, { useState } from 'react';
import { Layers } from 'lucide-react';

interface LoginViewProps {
  onLogin: (userData: { name: string; role: string; email: string }) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('admin@rtmimpresos.com.mx');
  const [password, setPassword] = useState('••••••••');
  const [rememberSession, setRememberSession] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      onLogin({
        name: 'Carlos Mendoza',
        role: 'Jefe de Planta & Producción',
        email: email || 'admin@rtmimpresos.com.mx'
      });
    }, 350);
  };

  const handleApplyDemoCredentials = () => {
    setEmail('admin@rtmimpresos.com.mx');
    setPassword('••••••••');
  };

  return (
    <div className="login-split-page">
      {/* Left Hero Section (Navy Grid with RTM Branding) */}
      <div className="login-left-hero">
        <div className="login-brand-top">
          <div className="brand-icon-square">
            <Layers size={26} strokeWidth={2.4} />
          </div>
          <div className="brand-title-group">
            <h2>NEXORA</h2>
            <span>Impresos RTM • ERP</span>
          </div>
        </div>

        <div className="login-hero-body">
          <h1 className="hero-main-title">
            Centro de mando<br />operativo
          </h1>
          <p className="hero-sub-description">
            Gestión completa de producción gráfica:<br />
            <strong>Cotización → Pre-prensa → Prensas → Suajado → Calidad</strong>
          </p>

          <div className="hero-pills-row">
            <span className="hero-pill">Offset CD 102</span>
            <span className="hero-pill">Flexografía P7</span>
            <span className="hero-pill">Ingeniería Suajes</span>
            <span className="hero-pill">Auditorías QA</span>
            <span className="hero-pill">Bobinas & Pliegos</span>
          </div>
        </div>

        <div className="login-left-footer">
          <span>© 2026 Nexora OS • Impresos RTM - Monterrey, México</span>
        </div>
      </div>

      {/* Right Form Section (Pure White with Demo Box) */}
      <div className="login-right-form-panel">
        <div className="login-form-box">
          <div className="login-header-text">
            <h1>Bienvenido</h1>
            <p>Ingresa a tu plataforma de gestión</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '18px' }}>
              <label className="input-label-clean">Correo electrónico</label>
              <input 
                type="text" 
                className="input-clean" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@rtmimpresos.com.mx"
              />
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label className="input-label-clean">Contraseña</label>
              <input 
                type="password" 
                className="input-clean" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <div className="login-options-row">
              <label className="remember-me-label">
                <input 
                  type="checkbox" 
                  checked={rememberSession} 
                  onChange={(e) => setRememberSession(e.target.checked)} 
                />
                <span>Recordar sesión</span>
              </label>
            </div>

            <button 
              type="submit" 
              className="btn-primary-blue"
              disabled={isLoading}
            >
              {isLoading ? 'Ingresando al sistema...' : 'Ingresar al sistema'}
            </button>
          </form>

          {/* Demo Credentials Box */}
          <div className="demo-credentials-card" onClick={handleApplyDemoCredentials} style={{ cursor: 'pointer' }}>
            <div className="demo-credentials-title">Credenciales de demostración</div>
            <div className="demo-credentials-email">admin@rtmimpresos.com.mx</div>
            <div className="demo-credentials-pass">••••••••</div>
          </div>
        </div>

        {/* Floating Help Circle */}
        <div className="help-floating-btn" title="Ayuda y soporte">
          ?
        </div>
      </div>
    </div>
  );
};
