import React, { useState } from 'react';
import {
  Factory,
  Plus,
  Filter,
  Calendar,
  Layers,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { ProductionOrder } from '../../data/mockProduccionData';
import {
  DashboardPeriod,
  DashboardAreaFilter,
  DashboardShift,
  DASHBOARD_V8_SNAPSHOTS,
} from '../../data/mockProductionDashboardV8';
import { ProductionExecutiveKpis } from './dashboard/ProductionExecutiveKpis';
import { ProductionShiftSummary } from './dashboard/ProductionShiftSummary';
import { PlantTraffic } from './dashboard/PlantTraffic';
import { PlanVsActual } from './dashboard/PlanVsActual';
import { ProductionActionCenter } from './dashboard/ProductionActionCenter';
import { WeeklyCapacity } from './dashboard/WeeklyCapacity';
import { DeliveryRisk } from './dashboard/DeliveryRisk';
import { Losses4M } from './dashboard/Losses4M';
import { ScrapSummary } from './dashboard/ScrapSummary';
import { StandardVsActual } from './dashboard/StandardVsActual';
import { CompletedJobsSummary } from './dashboard/CompletedJobsSummary';
import { NextStartsSummary } from './dashboard/NextStartsSummary';

interface Props {
  orders: ProductionOrder[];
  onOpenOrder: (order: ProductionOrder) => void;
  onNavigateTab?: (tab: 'Planeación' | 'Órdenes' | 'Piso' | 'Procesos' | 'Máquinas' | 'Analítica') => void;
  onNewOrder?: () => void;
}

export const DashboardProduccion: React.FC<Props> = ({
  orders,
  onOpenOrder,
  onNavigateTab,
  onNewOrder,
}) => {
  const [period, setPeriod] = useState<DashboardPeriod>('Hoy');
  const [areaFilter, setAreaFilter] = useState<DashboardAreaFilter>('Todas');
  const [shiftFilter, setShiftFilter] = useState<DashboardShift>('Turno A (06:00 - 14:00)');
  const [activeToast, setActiveToast] = useState<string>('');

  const snapshot = DASHBOARD_V8_SNAPSHOTS[period === 'Semana actual' ? 'Semana actual' : 'Hoy'];

  const handleOpenByFolio = (folio: string) => {
    const found = orders.find((o) => o.folio === folio);
    if (found) {
      onOpenOrder(found);
    } else {
      setActiveToast(`Abriendo detalle técnico para orden ${folio}...`);
      setTimeout(() => setActiveToast(''), 3000);
    }
  };

  const handleReprogram = (opFolio: string) => {
    if (onNavigateTab) {
      onNavigateTab('Planeación');
    }
    setActiveToast(`Navegando a Planeación para reprogramar orden ${opFolio}...`);
    setTimeout(() => setActiveToast(''), 3000);
  };

  const handleViewImpact = (machine: string) => {
    if (onNavigateTab) {
      onNavigateTab('Piso');
    }
    setActiveToast(`Mostrando paro y afectación en ${machine}...`);
    setTimeout(() => setActiveToast(''), 3000);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header del Centro de Control (Sección 3 del MD) */}
      <div className="flex flex-col gap-4 rounded-3xl border border-theme-subtle bg-theme-surface p-5 shadow-2xs md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black tracking-widest text-theme-primary uppercase">
              PRODUCCIÓN · CENTRO DE CONTROL
            </span>
            <span className="flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.2 text-[9px] font-black">
              ● Planta Operando
            </span>
          </div>
          <h1 className="text-xl font-black text-theme-main">
            Centro de Control de Manufactura RTM
          </h1>
          <p className="text-xs text-theme-muted">
            Plan, tráfico de planta, capacidad semanal, pérdidas 4M y excepciones operativas en tiempo real.
          </p>
        </div>

        {/* Barra de Filtros Globales y Nueva OP */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Selector de Periodo */}
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as DashboardPeriod)}
            className="rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 text-xs font-bold text-theme-main focus:border-theme-primary focus:outline-none"
          >
            <option value="Hoy">Hoy</option>
            <option value="Ayer">Ayer</option>
            <option value="Semana actual">Semana actual</option>
            <option value="Últimos 7 días">Últimos 7 días</option>
            <option value="Mes actual">Mes actual</option>
          </select>

          {/* Selector de Área */}
          <select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value as DashboardAreaFilter)}
            className="rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 text-xs font-bold text-theme-main focus:border-theme-primary focus:outline-none"
          >
            <option value="Todas">Todas las áreas</option>
            <option value="Offset">Offset</option>
            <option value="Flexografía">Flexografía</option>
            <option value="Acabados">Acabados</option>
          </select>

          {/* Selector de Turno */}
          <select
            value={shiftFilter}
            onChange={(e) => setShiftFilter(e.target.value as DashboardShift)}
            className="rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 text-xs font-bold text-theme-main focus:border-theme-primary focus:outline-none"
          >
            <option value="Todos">Todos los turnos</option>
            <option value="Turno A (06:00 - 14:00)">Turno A (06:00 - 14:00)</option>
            <option value="Turno B (14:00 - 21:30)">Turno B (14:00 - 21:30)</option>
            <option value="Turno C (21:30 - 06:00)">Turno C (21:30 - 06:00)</option>
          </select>

          {onNewOrder && (
            <button
              type="button"
              onClick={onNewOrder}
              className="flex items-center gap-1.5 rounded-xl bg-theme-primary px-3.5 py-2 text-xs font-bold text-white shadow-md hover:bg-theme-primary/90"
            >
              <Plus className="h-4 w-4" />
              <span>+ Nueva OP</span>
            </button>
          )}
        </div>
      </div>

      {/* Toast Notificación */}
      {activeToast && (
        <div className="rounded-xl border border-theme-primary/40 bg-theme-primary/10 p-3 text-xs font-bold text-theme-primary animate-in fade-in">
          {activeToast}
        </div>
      )}

      {/* Fila 1: KPIs Ejecutivos Calculados (Sección 4 del MD) */}
      <ProductionExecutiveKpis
        planTotal={snapshot.planTotal}
        goodProduced={snapshot.goodProduced}
        lostMinutes={snapshot.lostMinutesTotal}
        scrapUnits={snapshot.scrapTotalUnits}
        criticalOpsCount={snapshot.criticalOpsCount}
        criticalOpsUrgent={snapshot.criticalOpsUrgent}
        criticalMachinesCount={snapshot.criticalMachinesCount}
        onViewRiskOrders={() => {
          setActiveToast('Enfocando panel de Entregas en Riesgo...');
          setTimeout(() => setActiveToast(''), 2500);
        }}
      />

      {/* Fila 2: Resumen del Turno / Café de la Mañana de Iván (Sección 5 del MD) */}
      <ProductionShiftSummary
        onSelectDeviation={() => handleOpenByFolio('OP-2026-95318')}
        onSelectStoppedMachine={() => handleViewImpact('Mark Andy 830 10"')}
        onSelectRiskOrders={() => handleOpenByFolio('OP-2026-95321')}
        onSelectSupplyStage={() => {
          if (onNavigateTab) onNavigateTab('Planeación');
        }}
      />

      {/* Fila 3: Tráfico de Planta / Protagonista Visual (Sección 6 del MD) */}
      <PlantTraffic
        onNavigateToPlanning={(folio) => {
          if (onNavigateTab) onNavigateTab('Planeación');
        }}
        onOpenOrder={handleOpenByFolio}
      />

      {/* Fila 4: Plan vs Real (Izq) & Action Center (Der) (Secciones 7 y 10 del MD) */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <PlanVsActual period={period} />
        <ProductionActionCenter
          onOpenOrder={handleOpenByFolio}
          onReprogramOrder={handleReprogram}
          onViewImpact={handleViewImpact}
          onReviewScrap={(folio) => handleOpenByFolio(folio)}
          onViewSupply={(folio) => {
            if (onNavigateTab) onNavigateTab('Planeación');
          }}
        />
      </div>

      {/* Fila 5: Capacidad Semanal (Izq) & Riesgo de Entrega (Der) (Secciones 8 y 9 del MD) */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <WeeklyCapacity
          onNavigateToPlanning={() => {
            if (onNavigateTab) onNavigateTab('Planeación');
          }}
        />
        <DeliveryRisk
          onOpenOrder={handleOpenByFolio}
          onReprogramOrder={handleReprogram}
        />
      </div>

      {/* Fila 6: Pérdidas 4M (Izq) & Merma / Desperdicio (Der) (Secciones 11 y 12 del MD) */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Losses4M
          period={period}
          onNavigateToIncidents={() => {
            if (onNavigateTab) onNavigateTab('Piso');
          }}
        />
        <ScrapSummary
          period={period}
          onOpenOrder={handleOpenByFolio}
        />
      </div>

      {/* Fila 7: Desempeño contra Estándar de Catálogos V6 (Sección 13 del MD) */}
      <StandardVsActual
        onAnalyze4M={(name) => {
          setActiveToast(`Iniciando análisis 4M de desviación operativa para ${name}...`);
          setTimeout(() => setActiveToast(''), 3000);
        }}
      />

      {/* Fila 8: Trabajos Completados (Izq) & Arranques Próximas 24 h (Der) (Secciones 14 y 15 del MD) */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <CompletedJobsSummary />
        <NextStartsSummary
          onNavigateToSupplyProgram={() => {
            if (onNavigateTab) onNavigateTab('Planeación');
          }}
        />
      </div>
    </div>
  );
};
