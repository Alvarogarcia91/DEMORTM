import React from 'react';
import { 
  Layers, 
  Printer, 
  Scissors, 
  CheckCircle2, 
  PenTool, 
  Home,
  LogOut,
  User
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  backendOnline: boolean;
  user: { name: string; role: string; email: string };
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  setActiveTab, 
  backendOnline, 
  user, 
  onLogout 
}) => {
  const tabs = [
    { id: 'home', label: 'Inicio', icon: Home },
    { id: 'produccion', label: 'Producción (Offset & Flexo)', icon: Printer },
    { id: 'suajes', label: 'Cálculo de Suajes', icon: Scissors },
    { id: 'calidad', label: 'Control de Calidad (QA)', icon: CheckCircle2 },
    { id: 'diseno', label: 'Diseño & Muestras', icon: PenTool },
  ];

  return (
    <header className="header-wrapper">
      <div className="header-inner">
        <div className="brand-section">
          <div className="nexora-logo" onClick={() => setActiveTab('home')} style={{ cursor: 'pointer' }}>
            <div className="brand-icon">
              <Layers size={20} strokeWidth={2.5} />
            </div>
            <div>
              <span style={{ fontWeight: 800 }}>NEXORA</span>
              <span style={{ color: '#3b82f6', marginLeft: '4px', fontWeight: 800 }}>OS</span>
            </div>
          </div>
          <div className="client-tag">
            <span>CLIENTE:</span>
            <span className="rtm-badge">IMPRESOS RTM</span>
          </div>
        </div>

        <nav className="nav-tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                className={`tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="header-status">
          <div className="live-pill">
            <span className="live-dot"></span>
            <span>{backendOnline ? 'FastAPI Python Conectado' : 'Modo Autónomo'}</span>
          </div>

          <div className="header-user-badge">
            <div className="user-initials">
              {user.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
            <span className="user-short-name">{user.name.split(' ')[0]}</span>
            <button 
              className="btn-logout-header" 
              onClick={onLogout} 
              title="Cerrar sesión"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
