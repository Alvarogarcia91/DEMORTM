import React, { useState } from 'react';
import { 
  Warehouse, 
  Map as MapIcon, 
  Boxes, 
  History, 
  Flame, 
  ArrowLeftRight, 
  ClipboardCheck, 
  Building2,
  CheckCircle2,
  LayoutDashboard,
  BarChart3
} from 'lucide-react';
import { DashboardTab } from './DashboardTab';
import { AnalyticsTab } from './AnalyticsTab';
import { MapTab } from './MapTab';
import { StocksTab } from './StocksTab';
import { MovementsTab } from './MovementsTab';
import { HeatmapTab } from './HeatmapTab';
import { TransfersTab } from './TransfersTab';
import { WarehousesTab } from './WarehousesTab';
import { RearrangementsTab } from './RearrangementsTab';
import { CountsTab } from './CountsTab';

export type InventoryTabKey = 
  | 'dashboard'
  | 'analytics'
  | 'map'
  | 'stocks'
  | 'movements'
  | 'heatmap'
  | 'rearrangements'
  | 'transfers'
  | 'counts'
  | 'warehouses';

export const InventoryPage: React.FC = () => {
  // Default tab: Dashboard
  const [activeTab, setActiveTab] = useState<InventoryTabKey>('dashboard');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const tabsConfig = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analítica', icon: BarChart3 },
    { id: 'map', label: 'Mapa de Planta', icon: MapIcon },
    { id: 'stocks', label: 'Existencias', icon: Boxes },
    { id: 'movements', label: 'Movimientos (Kardex)', icon: History },
    { id: 'heatmap', label: 'Mapa de calor', icon: Flame },
    { id: 'rearrangements', label: 'Reacomodos', icon: ArrowLeftRight },
    { id: 'counts', label: 'Conteos Cíclicos', icon: ClipboardCheck },
    { id: 'warehouses', label: 'Almacenes & Áreas', icon: Building2 },
  ];

  return (
    <div className="space-y-6 max-w-[1520px] w-full mx-auto pb-16 animate-in fade-in duration-200">
      
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-theme-subtle">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <Warehouse className="w-5 h-5 text-theme-primary shrink-0" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-theme-main tracking-tight">
              Inventario Industrial
            </h1>
          </div>
          <p className="text-xs text-theme-muted">
            Control físico, trazabilidad de bobinas, tarimas, pliegos y tintas por nave operativa.
          </p>
        </div>
      </div>

      {/* Horizontal Navigation Tabs (Level 1 Module Tabs) */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-theme-subtle pb-3 text-xs font-semibold">
        {tabsConfig.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'bg-theme-primary text-white font-bold shadow-xs'
                  : 'text-theme-muted hover:text-theme-main hover:bg-theme-muted'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-zinc-900 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TAB CONTENTS */}
      {activeTab === 'dashboard' && (
        <DashboardTab 
          onNavigateTab={(tabKey) => setActiveTab(tabKey as any)} 
          onShowToast={showToast} 
        />
      )}
      {activeTab === 'analytics' && (
        <AnalyticsTab onShowToast={showToast} />
      )}
      {activeTab === 'map' && <MapTab onShowToast={showToast} />}
      {activeTab === 'stocks' && <StocksTab />}
      {activeTab === 'movements' && <MovementsTab />}
      {activeTab === 'heatmap' && <HeatmapTab />}
      {activeTab === 'rearrangements' && <RearrangementsTab onShowToast={showToast} />}
      {activeTab === 'transfers' && <TransfersTab onShowToast={showToast} />}
      {activeTab === 'counts' && <CountsTab onShowToast={showToast} />}
      {activeTab === 'warehouses' && <WarehousesTab />}
    </div>
  );
};
