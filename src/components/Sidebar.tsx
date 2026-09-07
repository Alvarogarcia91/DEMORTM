import React from 'react';
import {
 LayoutDashboard,
 Truck,
 LogOut,
 X,
 ChevronRight,
 Scan,
 Package,
 Boxes,
 Palette,
 ShoppingCart,
 ClipboardList,
 Building2,
 FileText,
 ShoppingBag,
 Users,
 Receipt,
 CreditCard,
 Scale,
 UserCheck,
 Wrench
} from 'lucide-react';
import { useNavigationModules } from '../context/NavigationModulesContext';

export type NavItemKey =
 | 'inicio'
 | 'articulos'
 | 'inventario'
 | 'mesa-verificacion'
 | 'logistica'
 | 'requisiciones'
 | 'compras'
 | 'proveedores'
 | 'cotizaciones'
 | 'pedidos'
 | 'clientes'
 | 'facturacion'
 | 'cxc'
 | 'cxp'
 | 'nomina'
 | 'mantenimiento'
 | 'configuracion';

interface SidebarProps {
 activeTab: NavItemKey;
 onSelectTab: (tab: NavItemKey) => void;
 isOpenMobile: boolean;
 onCloseMobile: () => void;
 onLogout: () => void;
}

interface NavSection {
 title?: string;
 badge?: string;
 items: {
 key: NavItemKey;
 label: string;
 icon: React.ComponentType<{ className?: string }>;
 badge?: string;
 isComingSoon?: boolean;
 }[];
}

export const Sidebar: React.FC<SidebarProps> = ({
 activeTab,
 onSelectTab,
 isOpenMobile,
 onCloseMobile,
 onLogout,
}) => {
 const sections: NavSection[] = [
 {
 items: [
 { key: 'inicio', label: 'Inicio', icon: LayoutDashboard },
 ],
 },
 {
 title: 'INVENTARIO Y OPERACIONES',
 items: [
 { key: 'articulos', label: 'Artículos', icon: Package },
 { key: 'inventario', label: 'Inventario', icon: Boxes },
 { key: 'mesa-verificacion', label: 'Operaciones de Almacén', icon: Scan },
 { key: 'logistica', label: 'Órdenes de Salida', icon: Truck },
 ],
 },
 {
 title: 'MANTENIMIENTO',
 items: [
 { key: 'mantenimiento', label: 'Mantenimiento', icon: Wrench },
 ],
 },
 {
 title: 'COMPRAS',
 items: [
 { key: 'requisiciones', label: 'Requisiciones', icon: ClipboardList },
 { key: 'compras', label: 'Compras', icon: ShoppingCart },
 { key: 'proveedores', label: 'Proveedores', icon: Building2 },
 ],
 },
 {
 title: 'VENTAS',
 items: [
 { key: 'cotizaciones', label: 'Cotizaciones', icon: FileText },
 { key: 'pedidos', label: 'Pedidos', icon: ShoppingBag },
 { key: 'clientes', label: 'Clientes', icon: Users },
 ],
 },
 {
 title: 'FINANZAS',
 items: [
 { key: 'facturacion', label: 'Facturación', icon: Receipt },
 { key: 'cxc', label: 'Cuentas por Cobrar', icon: CreditCard },
 { key: 'cxp', label: 'Cuentas por Pagar', icon: Scale },
 ],
 },
 {
 title: 'NÓMINA & RH',
 items: [
 { key: 'nomina', label: 'Nómina & Asistencia', icon: UserCheck },
 ],
 },
 {
 title: 'SISTEMA',
 items: [
 { key: 'configuracion', label: 'Configuración & Temas', icon: Palette },
 ],
 },
 ];

 const { isModuleVisible } = useNavigationModules();

 const visibleSections = sections
   .map((section) => ({
     ...section,
     items: section.items.filter((item) => isModuleVisible(item.key)),
   }))
   .filter((section) => section.items.length > 0);

 return (
 <>
 {/* Mobile Backdrop */}
 {isOpenMobile && (
 <div
 className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs z-40 lg:hidden animate-in fade-in duration-150"
 onClick={onCloseMobile}
 />
 )}

 {/* Sidebar Container */}
 <aside
 className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-theme-surface text-theme-main flex flex-col border-r border-theme-subtle shadow-sm transition-all duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
 isOpenMobile ? 'translate-x-0' : '-translate-x-full'
 }`}
 >
 {/* Header: Logo Oficial + ERP */}
 <div className="h-16 px-5 flex items-center justify-between border-b border-theme-subtle bg-theme-surface">
 <div className="flex items-center gap-2.5">
 <img
 src="/assets/logo-rtm.svg"
 alt="Impresos RTM"
 style={{ maxHeight: '32px', width: 'auto' }}
 className="h-8 w-auto object-contain"
 />
 <span className="text-[11px] font-black tracking-widest text-theme-muted uppercase border-l-2 border-theme-subtle pl-2">
 ERP
 </span>
 </div>
 
 <button
 onClick={onCloseMobile}
 className="lg:hidden p-1.5 rounded-lg text-theme-muted hover:text-theme-main hover:bg-theme-muted transition-colors"
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 {/* Server status badge with green indicator */}
 <div className="px-4 pt-4 pb-2">
 <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white border border-zinc-200 text-[11px] shadow-2xs">
 <div className="flex items-center gap-2">
 <span className="relative flex h-2 w-2">
 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
 <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
 </span>
 <span className="font-semibold text-zinc-900">Servidor Demo</span>
 </div>
 <span className="text-[10px] font-semibold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-500 shadow-2xs">
 En línea
 </span>
 </div>
 </div>

 {/* Navigation List */}
 <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5">
 {visibleSections.map((section, idx) => (
 <div key={idx} className="space-y-1">
 {section.title && (
 <div className="px-3 flex items-center justify-between mb-1.5">
 <p className="text-[10px] font-bold uppercase tracking-wider text-theme-muted opacity-80">
 {section.title}
 </p>
 {section.badge && (
 <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-white text-zinc-900 border border-zinc-300 shadow-2xs">
 {section.badge}
 </span>
 )}
 </div>
 )}

 {section.items.map((item) => {
 const Icon = item.icon;
 const isActive = activeTab === item.key;

 return (
 <button
 key={item.key}
 onClick={() => {
 if (!item.isComingSoon) {
 onSelectTab(item.key);
 onCloseMobile();
 }
 }}
 disabled={item.isComingSoon}
 className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group cursor-pointer ${
 isActive
 ? 'bg-theme-primary text-white font-bold shadow-sm'
 : item.isComingSoon
 ? 'opacity-40 cursor-not-allowed text-theme-muted'
 : 'text-theme-muted hover:text-theme-main hover:bg-theme-muted'
 }`}
 >
 <div className="flex items-center gap-3">
 <Icon
 className={`w-4 h-4 transition-transform duration-150 ${
 isActive
 ? 'text-white'
 : 'text-theme-muted group-hover:text-theme-main'
 }`}
 />
 <span>{item.label}</span>
 </div>

 <div className="flex items-center gap-1.5">
 {item.badge && (
 <span
 className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
 isActive
 ? 'bg-white/20 text-white'
 : 'bg-theme-muted text-theme-muted border border-theme-subtle'
 }`}
 >
 {item.badge}
 </span>
 )}
 
 {item.isComingSoon && (
 <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
 Próx.
 </span>
 )}

 <ChevronRight
 className={`w-3.5 h-3.5 transition-transform duration-150 ${
 isActive
 ? 'text-white translate-x-0.5'
 : 'text-theme-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5'
 }`}
 />
 </div>
 </button>
 );
 })}
 </div>
 ))}
 </div>

 {/* User Card & Logout */}
 <div className="p-3 border-t border-theme-subtle bg-theme-surface">
 <div className="p-2.5 rounded-2xl bg-theme-muted/50 border border-theme-subtle space-y-2">
 <div className="flex items-center gap-2.5">
 <div className="w-8 h-8 rounded-full bg-theme-primary/10 border border-theme-primary/20 flex items-center justify-center font-black text-xs text-theme-primary shrink-0">
 RTM
 </div>
 <div className="min-w-0 flex-1">
 <p className="text-xs font-bold text-theme-main truncate">
 Admin Demo
 </p>
 <p className="text-[10px] text-theme-muted truncate">
 Gerencia Comercial RTM
 </p>
 </div>
 </div>

 <button
 onClick={onLogout}
 className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium text-theme-muted hover:text-rose-600 hover:bg-rose-500/10 transition-colors border border-transparent hover:border-rose-500/20 cursor-pointer"
 >
 <LogOut className="w-3.5 h-3.5" />
 <span>Cerrar sesión</span>
 </button>
 </div>
 </div>
 </aside>
 </>
 );
};
