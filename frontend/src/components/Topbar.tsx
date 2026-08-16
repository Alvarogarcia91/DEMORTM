import React from 'react';
import { 
  ChevronLeft, 
  Search, 
  Clock, 
  Bell 
} from 'lucide-react';

interface TopbarProps {
  user: { name: string; role: string; email: string };
  onBack?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ user, onBack }) => {
  return (
    <header className="erp-topbar">
      <div className="topbar-left">
        <button className="topbar-back-btn" onClick={onBack} title="Atrás">
          <ChevronLeft size={20} />
        </button>

        <div className="topbar-search-wrap">
          <Search size={16} className="topbar-search-icon" />
          <input 
            type="text" 
            placeholder="Buscar folio, cliente, producto..." 
            className="topbar-search-input"
          />
        </div>
      </div>

      <div className="topbar-right">
        <div className="date-badge-pill">
          <Clock size={15} color="#0284c7" />
          <span>Julio 2026</span>
        </div>

        <button className="notif-bell-btn" title="Notificaciones">
          <Bell size={18} />
          <span className="notif-dot"></span>
        </button>

        <div className="topbar-user-pill">
          <div className="topbar-user-avatar">
            {user.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
          </div>
          <div className="topbar-user-text">
            <span className="topbar-user-name">{user.name}</span>
            <span className="topbar-user-sub">{user.role}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
