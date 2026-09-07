import React, { useState } from 'react';
import { 
  Calendar, 
  LogOut, 
  Menu, 
  ChevronDown,
  Bell
} from 'lucide-react';
import { NavItemKey } from './Sidebar';
import { useAlertas } from '../context/AlertasContext';
import { AlertasQuickPanel } from './AlertasQuickPanel';
import { DemoAlert } from '../data/mockAlertasData';

interface TopbarProps {
  onOpenMobileMenu: () => void;
  onLogout: () => void;
  activeTab?: NavItemKey;
  onSelectTab?: (tab: NavItemKey) => void;
  onNavigateAlert?: (alert: DemoAlert) => void;
}

export const Topbar: React.FC<TopbarProps> = ({ 
  onOpenMobileMenu, 
  onLogout, 
  activeTab, 
  onSelectTab,
  onNavigateAlert
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAlertsPanel, setShowAlertsPanel] = useState(false);
  const { pendingCount } = useAlertas();

 return (
 <header className="sticky top-0 z-20 h-16 bg-theme-surface/95 backdrop-blur-md border-b border-theme-subtle px-4 sm:px-6 flex items-center justify-between gap-4 transition-colors">
 
 {/* Left: Mobile Menu Trigger & Current Module Breadcrumb */}
 <div className="flex items-center gap-3">
 <button
 onClick={onOpenMobileMenu}
 className="lg:hidden p-2 rounded-xl text-theme-muted hover:bg-theme-muted hover:text-theme-main transition-colors cursor-pointer"
 title="Abrir menú de navegación"
 >
 <Menu className="w-5 h-5" />
 </button>

 {activeTab && activeTab !== 'inicio' && (
 <div className="hidden sm:flex items-center gap-2 text-xs">
 <span className="text-theme-muted font-mono uppercase tracking-wider text-[10px]">RTM ERP</span>
 <span className="text-theme-muted">/</span>
 <span className="font-bold text-theme-main">
 {activeTab === 'mantenimiento' ? 'Mantenimiento' :
 activeTab === 'nomina' ? 'Nómina & Asistencia' :
 activeTab === 'crm' ? 'CRM' :
 activeTab === 'finanzas' ? 'Finanzas' :
 activeTab === 'tesoreria' ? 'Finanzas · Tesorería' :
 activeTab === 'contabilidad' ? 'Finanzas · Contabilidad' :
 activeTab === 'reportes-financieros' ? 'Finanzas · Reportes' :
 activeTab === 'presupuestos' ? 'Finanzas · Presupuestos' :
 activeTab === 'activos-fijos' ? 'Finanzas · Activos Fijos' :
 activeTab === 'facturacion' ? 'Facturación' :
 activeTab === 'cxc' ? 'Cuentas por Cobrar' :
 activeTab === 'cxp' ? 'Cuentas por Pagar' :
 activeTab === 'inventario' ? 'Inventario' :
 activeTab === 'mesa-verificacion' ? 'Operaciones de Almacén' :
 activeTab === 'logistica' ? 'Órdenes de Salida' :
 activeTab === 'compras' ? 'Compras' :
 activeTab === 'requisiciones' ? 'Requisiciones' :
 activeTab === 'proveedores' ? 'Proveedores' :
 activeTab === 'cotizaciones' ? 'Cotizaciones' :
 activeTab === 'pedidos' ? 'Pedidos' :
 activeTab === 'clientes' ? 'Clientes' :
 activeTab === 'articulos' ? 'Artículos' :
 activeTab === 'configuracion' ? 'Configuración & Temas' :
 activeTab}
 </span>
 </div>
 )}
 </div>

 {/* Right: Server Status, Date & User */}
 <div className="flex items-center gap-2 sm:gap-4 ml-auto">
 
 {/* Demo Server Status Pill */}
 <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-theme-muted border border-theme-subtle text-xs text-theme-main">
 <span className="relative flex h-2 w-2">
 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
 <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
 </span>
 <span className="font-semibold text-theme-main">Servidor Demo</span>
 </div>

 {/* Date Indicator */}
 <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-theme-muted border border-theme-subtle text-xs text-theme-muted">
 <Calendar className="w-3.5 h-3.5" />
 <span>27 Ago 2026</span>
 </div>

 <div className="h-5 w-px bg-theme-subtle hidden sm:block" />

 {/* Transversal Alerts Bell */}
 <div className="relative">
   <button
     onClick={() => {
       setShowAlertsPanel(!showAlertsPanel);
       setShowUserMenu(false);
     }}
     className={`relative p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
       showAlertsPanel
         ? 'bg-theme-primary text-white shadow-xs'
         : pendingCount > 0
         ? 'bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 border border-rose-500/20 dark:text-rose-400'
         : 'text-theme-muted hover:bg-theme-muted hover:text-theme-main'
     }`}
     title="Centro de Alertas del ERP"
     aria-label="Alertas"
   >
     <Bell className="w-5 h-5" />
     {pendingCount > 0 && (
       <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-black text-white shadow-xs ring-2 ring-white dark:ring-zinc-900 animate-in zoom-in">
         {pendingCount}
       </span>
     )}
   </button>

   {/* Quick Alerts Dropdown Panel */}
   <AlertasQuickPanel
     isOpen={showAlertsPanel}
     onClose={() => setShowAlertsPanel(false)}
     onOpenFullCenter={() => {
       setShowAlertsPanel(false);
       onSelectTab?.('centro-alertas');
     }}
     onNavigateAlert={(alert) => {
       setShowAlertsPanel(false);
       if (onNavigateAlert) {
         onNavigateAlert(alert);
       } else {
         onSelectTab?.(alert.destino.tab);
       }
     }}
   />
 </div>

 <div className="h-5 w-px bg-theme-subtle" />

 {/* User Profile & Menu */}
 <div className="relative">
 <button
 onClick={() => setShowUserMenu(!showUserMenu)}
 className="flex items-center gap-2.5 p-1 sm:px-2 rounded-xl hover:bg-theme-muted text-left transition-colors cursor-pointer"
 >
 <div className="w-8 h-8 rounded-lg overflow-hidden shadow-xs flex items-center justify-center bg-white border border-theme-subtle shrink-0">
 <img src="/assets/rtm-mark.svg" alt="RTM" className="w-full h-full object-cover" />
 </div>
 <div className="hidden sm:block">
 <p className="text-xs font-bold text-theme-main tracking-tight leading-none">
 Admin
 </p>
 <p className="text-[10px] text-theme-muted leading-none mt-1">
 Impresos RTM
 </p>
 </div>
 <ChevronDown className="w-3.5 h-3.5 text-theme-muted hidden sm:block" />
 </button>

 {/* User Menu Dropdown */}
 {showUserMenu && (
 <div className="absolute right-0 mt-2 w-48 bg-theme-surface border border-theme-subtle rounded-2xl shadow-xl p-1.5 z-50 animate-in fade-in duration-100">
 <div className="px-3 py-2 border-b border-theme-subtle mb-1">
 <p className="text-xs font-bold text-theme-main">Admin</p>
 <p className="text-[10px] text-theme-muted truncate">admin@rtmimpresos.com.mx</p>
 </div>

 <button
 onClick={() => {
 setShowUserMenu(false);
 onLogout();
 }}
 className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-500 hover:bg-rose-50/10 transition-colors cursor-pointer"
 >
 <LogOut className="w-3.5 h-3.5" />
 <span>Cerrar sesión</span>
 </button>
 </div>
 )}
 </div>
 </div>
 </header>
 );
};
