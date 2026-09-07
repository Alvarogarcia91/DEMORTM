import React from 'react';
import { 
  Store, 
  Boxes, 
  Truck, 
  Clock, 
  AlertTriangle, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  ShieldAlert, 
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { 
  ShowroomBayRecord, 
  ExpoRecord, 
  ShowroomPickOrder, 
  MOCK_COMMERCIAL_SUGGESTIONS 
} from '../../../data/mockShowroomExposData';
import { StatusBadge } from '../../common/StatusBadge';

interface ShowroomExposDashboardProps {
  bays: ShowroomBayRecord[];
  expos: ExpoRecord[];
  pickOrders: ShowroomPickOrder[];
  onNavigateTab: (tabKey: 'showrooms' | 'recolecciones' | 'expos') => void;
  onOpenMountWizardForSuggestion: (bay: ShowroomBayRecord) => void;
}

export const ShowroomExposDashboard: React.FC<ShowroomExposDashboardProps> = ({
  bays,
  expos,
  pickOrders,
  onNavigateTab,
  onOpenMountWizardForSuggestion,
}) => {
  const activeShowroomUnits = bays.filter(b => b.status === 'En exhibición').length;
  const pendingMountsCount = bays.filter(b => b.status === 'Pendiente de montaje').length;
  const activeExposCount = expos.filter(e => e.status === 'En exposición externa' || e.status === 'En tránsito').length;
  const reservedForExpoUnits = expos.filter(e => e.status === 'Planeada' || e.status === 'Preparando').reduce((acc, e) => acc + e.totalUnits, 0);
  const pendingReturnUnits = expos.filter(e => e.status === 'Por regresar' || e.status === 'En retorno').reduce((acc, e) => acc + e.totalUnits, 0);

  // Alertas de atención requerida
  const attentionAlerts = [
    {
      id: 'alt-1',
      title: 'Bahía SHOW-06 disponible en Sucursal Valle Oriente',
      description: 'Espacio disponible para montaje de modelo recomendado con alta demanda.',
      type: 'Disponible',
      actionLabel: 'Montar en SHOW-06',
      tab: 'showrooms',
      severity: 'info',
    },
    {
      id: 'alt-2',
      title: 'Bahía SHOW-05 con 58 días en exhibición (Alta antigüedad)',
      description: 'Nayt Flow Pro Queen Size excede el umbral recomendado de 40 días en piso de venta.',
      type: 'Alta Antigüedad',
      actionLabel: 'Ver bahía',
      tab: 'showrooms',
      severity: 'warning',
    },
    {
      id: 'alt-3',
      title: 'Expo Hogar Cintermex con salida programada hoy 14:00 h',
      description: '8 unidades en preparación de carga en andén de salida hacia Cintermex.',
      type: 'Logística Externa',
      actionLabel: 'Ver Expo',
      tab: 'expos',
      severity: 'info',
    },
    {
      id: 'alt-4',
      title: 'Expo Franquicias Valle Real finaliza hoy',
      description: '6 unidades pendientes de orden de retorno para inspección física.',
      type: 'Retorno Pendiente',
      actionLabel: 'Generar retorno',
      tab: 'expos',
      severity: 'danger',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. KPIs OPERATIVOS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-theme-muted">Showrooms Activos</span>
          <strong className="text-2xl font-mono font-black text-theme-main block">{bays.length}</strong>
          <span className="text-[10px] text-theme-muted">12 bahías físicas</span>
        </div>

        <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-theme-muted">En Exhibición</span>
          <strong className="text-2xl font-mono font-black text-purple-600 block">{activeShowroomUnits}</strong>
          <span className="text-[10px] text-theme-muted">Unidades en piso</span>
        </div>

        <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-theme-muted">Pend. Montaje</span>
          <strong className="text-2xl font-mono font-black text-amber-600 block">{pendingMountsCount}</strong>
          <span className="text-[10px] text-theme-muted">Órdenes abiertas</span>
        </div>

        <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-theme-muted">Expos Activas</span>
          <strong className="text-2xl font-mono font-black text-blue-600 block">{activeExposCount}</strong>
          <span className="text-[10px] text-theme-muted">Sedes externas</span>
        </div>

        <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-theme-muted">Apartadas Expo</span>
          <strong className="text-2xl font-mono font-black text-theme-primary block">{reservedForExpoUnits}</strong>
          <span className="text-[10px] text-theme-muted">Bloqueadas para venta</span>
        </div>

        <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-theme-muted">Pend. Regreso</span>
          <strong className="text-2xl font-mono font-black text-emerald-600 block">{pendingReturnUnits}</strong>
          <span className="text-[10px] text-theme-muted">A inspección</span>
        </div>

      </div>

      {/* 2. BLOQUE: REQUIEREN ATENCIÓN */}
      <div className="p-5 rounded-3xl bg-rose-500/5 border border-rose-500/20 shadow-xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-rose-700">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider">
              Requieren Atención &bull; Alertas Operativas de Exhibición
            </h3>
          </div>
          <StatusBadge variant="danger" label="4 acciones pendientes" size="sm" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {attentionAlerts.map((alt) => (
            <div
              key={alt.id}
              className="p-3.5 rounded-2xl bg-white border border-zinc-200 flex flex-col justify-between space-y-2 shadow-2xs"
            >
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-white text-zinc-900 border border-zinc-300">
                  {alt.type}
                </span>
                <strong className="text-xs font-bold text-zinc-900 block line-clamp-1">
                  {alt.title}
                </strong>
                <p className="text-[11px] text-zinc-600 leading-relaxed">
                  {alt.description}
                </p>
              </div>

              <div className="pt-2 border-t border-zinc-100 flex justify-end">
                <button
                  onClick={() => onNavigateTab(alt.tab as any)}
                  className="text-xs font-bold text-theme-primary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{alt.actionLabel}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. SUGERENCIAS COMERCIALES CONECTADAS A VENTAS */}
      <div className="p-5 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <h3 className="text-xs sm:text-sm font-black text-theme-main uppercase tracking-wider">
              Sugerencias de Montaje en Showroom &middot; Inteligencia Comercial
            </h3>
          </div>
          <span className="text-[10px] text-theme-muted">Movimiento comercial observado en plataforma</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MOCK_COMMERCIAL_SUGGESTIONS.map((sug, idx) => (
            <div
              key={sug.sku}
              className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-theme-primary">
                    {sug.sku}
                  </span>
                  <StatusBadge variant="smart" label={`Score ${sug.score}`} size="sm" />
                </div>

                <div>
                  <strong className="text-xs font-bold text-zinc-900 block line-clamp-1">
                    {sug.productName}
                  </strong>
                  <span className="text-[10px] text-zinc-500 block">
                    {sug.branchName} &bull; Disponibles: <strong className="text-emerald-600 font-mono">{sug.availableStock}</strong>
                  </span>
                </div>

                <div className="space-y-1 pt-1 border-t border-zinc-100">
                  {sug.reasons.slice(0, 2).map((r, rIdx) => (
                    <div key={rIdx} className="text-[10px] text-zinc-600 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-theme-primary shrink-0" />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
                <span className="text-[10px] text-zinc-500 font-bold">Rotación {sug.rotationSpeed}</span>
                <button
                  onClick={() => {
                    const targetBay = bays.find(b => b.branchId === sug.branchId && b.status === 'Disponible') || bays[0];
                    onOpenMountWizardForSuggestion(targetBay);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-theme-primary text-white font-bold text-xs hover:bg-theme-primary/90 transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <span>Sugerir para showroom</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
