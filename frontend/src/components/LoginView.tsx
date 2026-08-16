import React, { useState } from 'react';
import { 
  Layers, 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  Printer, 
  Scissors, 
  CheckCircle2, 
  Sparkles,
  Zap,
  Building2,
  ChevronRight
} from 'lucide-react';

interface LoginViewProps {
  onLogin: (userData: { name: string; role: string; email: string }) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('carlos.mendoza@rtmimpresos.com.mx');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedRole, setSelectedRole] = useState<'Director' | 'Planta' | 'QA' | 'Suajes'>('Director');
  const [isLoading, setIsLoading] = useState(false);

  const demoRoles = [
    {
      id: 'Director' as const,
      title: 'Dirección General & Finanzas',
      name: 'Ing. Roberto Garza',
      email: 'r.garza@rtmimpresos.com.mx',
      desc: 'Acceso a OEE global, margen de mermas y KPIs ejecutivos'
    },
    {
      id: 'Planta' as const,
      title: 'Jefe de Producción (Offset & Flexo)',
      name: 'Carlos Mendoza',
      email: 'carlos.mendoza@rtmimpresos.com.mx',
      desc: 'Control de prensas Heidelberg/Mark Andy y programación master'
    },
    {
      id: 'Suajes' as const,
      title: 'Ingeniería de Suajes & Pre-prensa',
      name: 'Ana Luisa Morales',
      email: 'ana.morales@rtmimpresos.com.mx',
      desc: 'Aprovechamiento de pliego, imposición 2D y taller de troqueles'
    },
    {
      id: 'QA' as const,
      title: 'Aseguramiento de Calidad (QA)',
      name: 'Mariana Gómez',
      email: 'm.gomez@rtmimpresos.com.mx',
      desc: 'Liberación de lotes farmacéuticos, Delta E y pruebas de cinta'
    }
  ];

  const handleRoleSelect = (roleId: 'Director' | 'Planta' | 'QA' | 'Suajes') => {
    setSelectedRole(roleId);
    const roleInfo = demoRoles.find(r => r.id === roleId);
    if (roleInfo) {
      setEmail(roleInfo.email);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const currentRole = demoRoles.find(r => r.id === selectedRole) || demoRoles[0];

    // Smooth transition simulation
    setTimeout(() => {
      onLogin({
        name: currentRole.name,
        role: currentRole.title,
        email: email || currentRole.email
      });
    }, 600);
  };

  return (
    <div className="login-page-wrapper">
      {/* Ambient background glow elements */}
      <div className="ambient-glow glow-1"></div>
      <div className="ambient-glow glow-2"></div>
      <div className="ambient-grid-overlay"></div>

      <div className="login-container">
        {/* Left Brand Showcase Banner */}
        <div className="login-showcase">
          <div className="showcase-header">
            <div className="nexora-brand-badge">
              <div className="brand-icon">
                <Layers size={24} strokeWidth={2.5} />
              </div>
              <div>
                <span className="brand-name">NEXORA</span>
                <span className="brand-accent">OS</span>
              </div>
            </div>
            <div className="client-pill">
              <span className="live-dot"></span>
              <span>RTM IMPRESOS INDUSTRIAL</span>
            </div>
          </div>

          <div className="showcase-content">
            <div className="edition-tag">
              <Sparkles size={14} />
              <span>SISTEMA ERP A LA MEDIDA • EDICIÓN GRÁFICA</span>
            </div>
            <h1 className="showcase-title">
              La plataforma de control que sincroniza tus <span className="highlight-text">prensas, suajes y calidad.</span>
            </h1>
            <p className="showcase-description">
              Diseñado exclusivamente para la arquitectura operativa de <strong>Impresos RTM</strong>: Prensas Offset de pliego, rotativas Flexo, laboratorio de QA y taller de troquelado.
            </p>

            {/* Micro Feature Pills */}
            <div className="feature-grid">
              <div className="feature-item">
                <div className="feature-icon"><Printer size={18} /></div>
                <div>
                  <div className="feature-title">Offset & Flexo Unificados</div>
                  <div className="feature-subtitle">Heidelberg CD 102 & Mark Andy P7</div>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon"><Scissors size={18} /></div>
                <div>
                  <div className="feature-title">Algoritmo de Suajes 2D</div>
                  <div className="feature-subtitle">Aprovechamiento de pliego &gt; 88%</div>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon"><ShieldCheck size={18} /></div>
                <div>
                  <div className="feature-title">QA Grado Farmacéutico</div>
                  <div className="feature-subtitle">Trazabilidad Delta E & Cinta 3M</div>
                </div>
              </div>
            </div>
          </div>

          <div className="showcase-footer">
            <div className="trust-text">
              <span>Sistemas de Planta Operando • Cifrado TLS 1.3 • Nexora Engine v2.4</span>
            </div>
          </div>
        </div>

        {/* Right Authentication Form Card */}
        <div className="login-card">
          <div className="card-top">
            <div className="security-icon-wrap">
              <Lock size={20} />
            </div>
            <h2 className="login-heading">Acceso al Sistema</h2>
            <p className="login-subheading">
              Selecciona un perfil para la demo o haz clic directamente en <strong>Iniciar Sesión</strong>.
            </p>
          </div>

          {/* Quick Role Selector for Demo Presentation */}
          <div className="role-selector-section">
            <div className="section-label">PERFILES DISPONIBLES PARA LA DEMO:</div>
            <div className="role-chips-grid">
              {demoRoles.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleRoleSelect(r.id)}
                  className={`role-chip ${selectedRole === r.id ? 'active' : ''}`}
                >
                  <div className="chip-content">
                    <span className="chip-title">{r.title}</span>
                    <span className="chip-name">{r.name}</span>
                  </div>
                  <ChevronRight size={14} className="chip-arrow" />
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label">Correo Corporativo / Usuario</label>
              <div className="input-with-icon">
                <Mail size={16} className="field-icon" />
                <input 
                  type="text" 
                  className="form-input custom-input" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@rtmimpresos.com.mx"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Contraseña de Seguridad</label>
              <div className="input-with-icon">
                <Lock size={16} className="field-icon" />
                <input 
                  type="password" 
                  className="form-input custom-input" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <div className="form-extra-row">
              <label className="remember-checkbox">
                <input type="checkbox" defaultChecked />
                <span>Recordar credenciales de estación</span>
              </label>
              <span className="auth-mode-badge">DEMO INTERACTIVA</span>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary submit-login-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="spinner-wrap">
                  <span className="login-spinner"></span>
                  <span>Autenticando en Nexora OS...</span>
                </span>
              ) : (
                <>
                  <span>Iniciar Sesión en Demo RTM</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="quick-access-hint">
            <Zap size={14} color="#f59e0b" />
            <span>Haz clic en el botón para ingresar al panel principal de inmediato.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
