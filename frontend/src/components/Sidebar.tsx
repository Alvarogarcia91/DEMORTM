import React from 'react';
import { 
  Home,
  Printer,
  Scissors,
  CheckCircle2,
  PenTool,
  FileSpreadsheet,
  ShoppingCart,
  Boxes,
  Truck,
  Receipt,
  DollarSign,
  Package,
  QrCode,
  TrendingUp,
  Settings,
  Layers,
  ChevronLeft,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: { name: string; role: string; email: string };
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  user, 
  onLogout 
}) => {
  const menuItems = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'produccion', label: 'Producción (Offset & Flexo)', icon: Printer },
    { id: 'suajes', label: 'Ingeniería de Suajes 2D', icon: Scissors },
    { id: 'calidad', label: 'Control de Calidad (QA)', icon: CheckCircle2 },
    { id: 'diseno', label: 'Diseño & Muestras PE', icon: PenTool },
    { id: 'cotizaciones', label: 'Cotizaciones & Costos', icon: FileSpreadsheet },
    { id: 'pedidos', label: 'Órdenes de Trabajo (OP)', icon: ShoppingCart },
    { id: 'sustratos', label: 'Sustratos & Tintas', icon: Boxes },
    { id: 'remisiones', label: 'Remisiones & Embarque', icon: Truck },
    { id: 'facturacion', label: 'Facturación', icon: Receipt },
    { id: 'cuentas_cobrar', label: 'Cuentas por cobrar', icon: DollarSign },
    { id: 'inventario_suajes', label: 'Racks de Herramentales', icon: Package },
    { id: 'mapa_qr', label: 'Pasaporte Lote & QR', icon: QrCode },
    { id: 'reportes', label: 'Reportes de Turno', icon: TrendingUp },
    { id: 'configuracion', label: 'Configuración Planta', icon: Settings },
  ];

  return (
    <aside className="erp-sidebar">
      <div>
        <div className="sidebar-header">
          <div className="sidebar-brand" onClick={() => setActiveTab('inicio')}>
            <div className="sidebar-brand-icon">
              <Layers size={22} strokeWidth={2.4} />
            </div>
            <div className="sidebar-brand-text">
              <h2>NEXORA</h2>
              <span>Impresos RTM</span>
            </div>
          </div>
          <button className="sidebar-collapse-btn" title="Colapsar menú">
            <ChevronLeft size={18} />
          </button>
        </div>

        <nav className="sidebar-nav-list">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-footer-profile">
        <div className="profile-avatar-navy">
          {user.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
        </div>
        <div className="profile-navy-info">
          <span className="profile-navy-name">{user.name}</span>
          <span className="profile-navy-role">{user.role}</span>
        </div>
        <button 
          className="sidebar-logout-btn" 
          onClick={onLogout} 
          title="Cerrar sesión"
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
};
