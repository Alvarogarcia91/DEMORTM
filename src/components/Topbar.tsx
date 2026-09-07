import React, { useState } from 'react';
import { 
 Calendar, 
 LogOut, 
 Menu, 
 ChevronDown
} from 'lucide-react';

interface TopbarProps {
 onOpenMobileMenu: () => void;
 onLogout: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenMobileMenu, onLogout }) => {
 const [showUserMenu, setShowUserMenu] = useState(false);

 return (
 <header className="sticky top-0 z-20 h-16 bg-theme-surface/95 backdrop-blur-md border-b border-theme-subtle px-4 sm:px-6 flex items-center justify-between gap-4 transition-colors">
 
 {/* Left: Mobile Menu Trigger (hidden on desktop) */}
 <div className="flex items-center">
 <button
 onClick={onOpenMobileMenu}
 className="lg:hidden p-2 rounded-xl text-theme-muted hover:bg-theme-muted hover:text-theme-main transition-colors cursor-pointer"
 title="Abrir menú de navegación"
 >
 <Menu className="w-5 h-5" />
 </button>
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
