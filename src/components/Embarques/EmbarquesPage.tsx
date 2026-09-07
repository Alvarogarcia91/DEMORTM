import React, { useState } from 'react';
import { 
  Truck, 
  LayoutDashboard, 
  Navigation, 
  PackageCheck,
  History,
  FileText
} from 'lucide-react';
import { EmbarquesDashboard } from './EmbarquesDashboard';
import { ShippingOrdersTab } from './ShippingOrdersTab';
import { EnRutaTab } from './EnRutaTab';
import { HistorialTab } from './HistorialTab';
import { getShippingOrdersList, getActiveRoutesList, getShippingHistoryList } from '../../data/mockShippingData';

export type EmbarquesSubtab = 'dashboard' | 'orders' | 'in_route' | 'history';

export const EmbarquesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<EmbarquesSubtab>('orders');
  const activeOrdersCount = getShippingOrdersList().filter((o) => o.status !== 'En ruta' && o.status !== 'Completada').length;
  const inRouteCount = getActiveRoutesList().filter((r) => r.status === 'En ruta').length;
  const historyCount = getShippingHistoryList().length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white text-zinc-900 border border-theme-primary shadow-2xs">
            Despacho B2B & Logística Industrial
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-theme-main">
          Órdenes de Salida
        </h1>
        <p className="text-xs sm:text-sm text-theme-muted">
          Despacho de producto terminado liberado por QA, staging de tarimas y validación de carga para clientes industriales.
        </p>
      </div>

      {/* Subtabs Bar */}
      <div className="border-b border-theme-subtle">
        <div className="flex flex-wrap gap-4">
          
          {/* Tabs visibles: Órdenes de salida, En ruta, Historial */}

          {/* Subtab Órdenes de salida */}
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-1.5 border-b-2 px-1 pb-2.5 text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'orders'
                ? 'border-theme-primary text-theme-primary'
                : 'border-transparent text-theme-muted hover:text-theme-main'
            }`}
          >
            <Truck className="h-4 w-4" />
            <span>Órdenes de salida</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-white text-zinc-900 border border-zinc-300 shadow-2xs">
              {activeOrdersCount}
            </span>
          </button>

          {/* Subtab En ruta */}
          <button
            type="button"
            onClick={() => setActiveTab('in_route')}
            className={`flex items-center gap-1.5 border-b-2 px-1 pb-2.5 text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'in_route'
                ? 'border-theme-primary text-theme-primary'
                : 'border-transparent text-theme-muted hover:text-theme-main'
            }`}
          >
            <Navigation className="h-4 w-4" />
            <span>En ruta</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-white text-zinc-900 border border-emerald-500 shadow-2xs">
              {inRouteCount}
            </span>
          </button>

          {/* Subtab Entregas (anterior Historial) */}
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 border-b-2 px-1 pb-2.5 text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'history'
                ? 'border-theme-primary text-theme-primary'
                : 'border-transparent text-theme-muted hover:text-theme-main'
            }`}
          >
            <PackageCheck className="h-4 w-4" />
            <span>Entregas B2B</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-white text-zinc-900 border border-zinc-300 shadow-2xs">
              {historyCount}
            </span>
          </button>

        </div>
      </div>

      {/* Subtab Content */}
      {activeTab === 'dashboard' && (
        <EmbarquesDashboard 
          onNavigateTab={(tab) => setActiveTab(tab)} 
        />
      )}
      {activeTab === 'orders' && <ShippingOrdersTab onNavigateToInRoute={() => setActiveTab('in_route')} />}
      {activeTab === 'in_route' && <EnRutaTab />}
      {activeTab === 'history' && <HistorialTab />}

    </div>
  );
};
