import React, { useState, useMemo } from 'react';
import { ProductionOrder } from '../../data/mockProduccionData';
import {
  ProductionPeriod,
  ProductionAnalyticsArea,
  ProductionAnalyticsShift,
  ProductionAnalyticsSubView,
  getProductionAnalyticsForPeriod,
} from '../../data/mockProduccionAnaliticaData';
import { ProductionAnalyticsHeader } from './analytics/ProductionAnalyticsHeader';
import { ProductionAnalyticsKpis } from './analytics/ProductionAnalyticsKpis';
import { ProductionSmartInsights } from './analytics/ProductionSmartInsights';
import { ProductionPlanVsActual } from './analytics/ProductionPlanVsActual';
import { ProductionMachineAnalytics } from './analytics/ProductionMachineAnalytics';
import { ProductionDowntimeAnalytics } from './analytics/ProductionDowntimeAnalytics';
import { ProductionScrapAnalytics } from './analytics/ProductionScrapAnalytics';
import { ProductionSetupAnalytics } from './analytics/ProductionSetupAnalytics';
import { ProductionOperatorAnalytics } from './analytics/ProductionOperatorAnalytics';
import { ProductionDeliveryAnalytics } from './analytics/ProductionDeliveryAnalytics';
import { ProductionPerformanceHeatmap } from './analytics/ProductionPerformanceHeatmap';

interface AnaliticaProduccionProps {
  orders: ProductionOrder[];
  onNotice: (message: string) => void;
  onOpenOrder?: (folio: string) => void;
  onNavigateTab?: (tab: any) => void;
}

export const AnaliticaProduccion: React.FC<AnaliticaProduccionProps> = ({
  orders,
  onNotice,
  onOpenOrder,
  onNavigateTab,
}) => {
  // Global Filters
  const [selectedPeriod, setSelectedPeriod] = useState<ProductionPeriod>('30 días');
  const [selectedArea, setSelectedArea] = useState<ProductionAnalyticsArea>('Todas');
  const [selectedMachine, setSelectedMachine] = useState<string>('all');
  const [selectedShift, setSelectedShift] = useState<ProductionAnalyticsShift>('Todos');
  const [comparePrevious, setComparePrevious] = useState<boolean>(true);
  const [activeSubView, setActiveSubView] = useState<ProductionAnalyticsSubView>('Resumen');

  // Export Banner State
  const [exportSuccessMessage, setExportSuccessMessage] = useState<{
    filename: string;
    subtitle: string;
  } | null>(null);

  // Load dataset according to period
  const dataset = useMemo(() => {
    return getProductionAnalyticsForPeriod(selectedPeriod);
  }, [selectedPeriod]);

  // Handler for Excel Export
  const handleExportExcel = () => {
    const filename = `analitica_produccion_${
      selectedArea === 'Todas' ? 'PLANTA-RTM' : selectedArea.toUpperCase()
    }_${selectedPeriod.replace(/\s+/g, '_')}_2026-09-07.xlsx`;

    const subtitle = `Manufactura RTM · ${
      selectedArea === 'Todas' ? 'Todas las áreas' : `Área ${selectedArea}`
    } · ${selectedPeriod} · ${selectedShift === 'Todos' ? 'Todos los turnos' : selectedShift}`;

    setExportSuccessMessage({ filename, subtitle });
    onNotice(`✓ Reporte analítico exportado a Excel: ${filename}`);

    // Auto-dismiss after 6s
    setTimeout(() => {
      setExportSuccessMessage(null);
    }, 6000);
  };

  // Handler for Smart Actions (No dead buttons)
  const handleSmartAction = (target: string, payload?: string) => {
    if (target === 'maquinas') {
      if (onNavigateTab) {
        onNavigateTab('Máquinas');
      } else {
        setActiveSubView('Máquinas');
      }
      onNotice(
        payload
          ? `Navegando a análisis de estación: ${payload}`
          : 'Navegando a catálogo y estado de máquinas'
      );
    } else if (target === 'planeacion') {
      if (onNavigateTab) {
        onNavigateTab('Planeación');
      }
      onNotice('Abriendo consola de Planeación para balanceo y secuencia de órdenes');
    } else if (target === 'scrap') {
      if (onNavigateTab) {
        onNavigateTab('Scrap y pérdidas');
      } else {
        setActiveSubView('Scrap y paros');
      }
      onNotice('Abriendo módulo de control de Scrap y pérdidas');
    } else if (target === 'operador') {
      setActiveSubView('Operadores');
      onNotice('Filtrando vista analítica por operadores de piso');
    } else if (target === 'orden' && payload) {
      if (onOpenOrder) {
        onOpenOrder(payload);
      }
      onNotice(`Abriendo orden de producción ${payload}`);
    }
  };

  // Filtered dataset subsets if specific area or machine is selected
  const filteredTopMachines = useMemo(() => {
    if (selectedArea === 'Todas') return dataset.topProductiveMachines;
    return dataset.topProductiveMachines.filter((m) => m.area === selectedArea);
  }, [dataset, selectedArea]);

  const filteredEfficiency = useMemo(() => {
    if (selectedArea === 'Todas') return dataset.machineEfficiency;
    return dataset.machineEfficiency.filter((m) => m.area === selectedArea);
  }, [dataset, selectedArea]);

  const filteredDowntime = useMemo(() => {
    if (selectedArea === 'Todas') return dataset.machineDowntime;
    return dataset.machineDowntime.filter((m) => m.area === selectedArea);
  }, [dataset, selectedArea]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200 w-full pb-12">
      {/* 1. HEADER & CONTROLES SUPERIORES */}
      <ProductionAnalyticsHeader
        selectedPeriod={selectedPeriod}
        onPeriodChange={(p) => {
          setSelectedPeriod(p);
          onNotice(`Periodo analítico actualizado a: ${p}`);
        }}
        selectedArea={selectedArea}
        onAreaChange={(a) => {
          setSelectedArea(a);
          onNotice(`Filtrando analítica por área: ${a}`);
        }}
        selectedMachine={selectedMachine}
        onMachineChange={(m) => {
          setSelectedMachine(m);
          onNotice(m === 'all' ? 'Mostrando todas las máquinas' : `Filtrando por estación: ${m}`);
        }}
        selectedShift={selectedShift}
        onShiftChange={(s) => {
          setSelectedShift(s);
          onNotice(`Turno seleccionado: ${s}`);
        }}
        comparePrevious={comparePrevious}
        onToggleComparePrevious={() => setComparePrevious((prev) => !prev)}
        activeSubView={activeSubView}
        onSubViewChange={setActiveSubView}
        onExportExcel={handleExportExcel}
        exportSuccessMessage={exportSuccessMessage}
        onDismissExportMessage={() => setExportSuccessMessage(null)}
      />

      {/* 2. KPIS ANALÍTICOS GLOBALES (6 COMPACTOS) */}
      <ProductionAnalyticsKpis
        kpis={dataset.kpis}
        comparePrevious={comparePrevious}
      />

      {/* 3. SUGERENCIAS DEL SISTEMA — PROTAGONISTA MORADO */}
      <ProductionSmartInsights
        suggestions={dataset.smartSuggestions}
        onActionClick={handleSmartAction}
        onNotice={onNotice}
      />

      {/* 4. CONTENIDO MODULAR SEGÚN SUB-VISTA */}

      {/* SUB-VISTA: RESUMEN (VISTA GENERAL COMPLETA) */}
      {activeSubView === 'Resumen' && (
        <div className="space-y-6">
          {/* Plan vs Real + Scrap Tendencia */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6">
              <ProductionPlanVsActual datasets={dataset.planVsActual} />
            </div>
            <div className="lg:col-span-6">
              <ProductionPerformanceHeatmap
                heatmap={dataset.machineHeatmap}
                pareto4M={dataset.pareto4M}
                onNavigateTab={onNavigateTab}
              />
            </div>
          </div>

          {/* Máquinas: Horas Productivas & Eficiencia */}
          <ProductionMachineAnalytics
            topMachines={filteredTopMachines}
            efficiencyList={filteredEfficiency}
            onSelectMachine={(mName) => {
              setSelectedMachine(mName);
              onNotice(`Estación seleccionada: ${mName}`);
            }}
          />

          {/* Paros por Máquina & Causas Principales */}
          <ProductionDowntimeAnalytics
            machineDowntime={filteredDowntime}
            downtimeCauses={dataset.downtimeCauses}
            onOpenOrder={onOpenOrder}
            onNavigateTab={onNavigateTab}
          />

          {/* Setup Estándar vs Real & Oportunidad */}
          <ProductionSetupAnalytics
            setupComparison={dataset.setupComparison}
            onNavigateTab={onNavigateTab}
          />

          {/* Desempeño de Operadores & Distribución del Tiempo */}
          <ProductionOperatorAnalytics
            operators={dataset.operatorPerformance}
            timeDistribution={dataset.operatorTimeDistribution}
            onOpenOrder={onOpenOrder}
          />

          {/* Scrap Completo: Tendencia, Procesos, Causas & Top OPs */}
          <ProductionScrapAnalytics
            weeklyTrend={dataset.scrapWeeklyTrend}
            byProcess={dataset.scrapByProcess}
            scrapCauses={dataset.scrapCauses}
            topOps={dataset.topScrapOps}
            onOpenOrder={onOpenOrder}
          />

          {/* Capacidad por Cliente & Cumplimiento de Entrega / Lead time */}
          <ProductionDeliveryAnalytics
            clientCapacity={dataset.clientCapacity}
            deliveryCompliance={dataset.deliveryCompliance}
            topDelayedOps={dataset.topDelayedOps}
            onOpenOrder={onOpenOrder}
          />
        </div>
      )}

      {/* SUB-VISTA: MÁQUINAS */}
      {activeSubView === 'Máquinas' && (
        <div className="space-y-6">
          <ProductionMachineAnalytics
            topMachines={filteredTopMachines}
            efficiencyList={filteredEfficiency}
            onSelectMachine={(mName) => {
              setSelectedMachine(mName);
              onNotice(`Estación seleccionada: ${mName}`);
            }}
          />

          <ProductionDowntimeAnalytics
            machineDowntime={filteredDowntime}
            downtimeCauses={dataset.downtimeCauses}
            onOpenOrder={onOpenOrder}
            onNavigateTab={onNavigateTab}
          />

          <ProductionPerformanceHeatmap
            heatmap={dataset.machineHeatmap}
            pareto4M={dataset.pareto4M}
            onNavigateTab={onNavigateTab}
          />

          <ProductionSetupAnalytics
            setupComparison={dataset.setupComparison}
            onNavigateTab={onNavigateTab}
          />
        </div>
      )}

      {/* SUB-VISTA: OPERADORES */}
      {activeSubView === 'Operadores' && (
        <div className="space-y-6">
          <ProductionOperatorAnalytics
            operators={dataset.operatorPerformance}
            timeDistribution={dataset.operatorTimeDistribution}
            onOpenOrder={onOpenOrder}
          />

          <ProductionSetupAnalytics
            setupComparison={dataset.setupComparison}
            onNavigateTab={onNavigateTab}
          />
        </div>
      )}

      {/* SUB-VISTA: SCRAP Y PAROS */}
      {activeSubView === 'Scrap y paros' && (
        <div className="space-y-6">
          <ProductionScrapAnalytics
            weeklyTrend={dataset.scrapWeeklyTrend}
            byProcess={dataset.scrapByProcess}
            scrapCauses={dataset.scrapCauses}
            topOps={dataset.topScrapOps}
            onOpenOrder={onOpenOrder}
          />

          <ProductionDowntimeAnalytics
            machineDowntime={filteredDowntime}
            downtimeCauses={dataset.downtimeCauses}
            onOpenOrder={onOpenOrder}
            onNavigateTab={onNavigateTab}
          />

          <ProductionPerformanceHeatmap
            heatmap={dataset.machineHeatmap}
            pareto4M={dataset.pareto4M}
            onNavigateTab={onNavigateTab}
          />
        </div>
      )}
    </div>
  );
};
