import React, { useState } from 'react';
import { 
  Truck, 
  Navigation, 
  History, 
  PackageCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Building2, 
  Calendar, 
  Filter, 
  ArrowRight, 
  Layers, 
  User, 
  AlertCircle, 
  Check, 
  ShieldCheck, 
  ChevronRight, 
  Info,
  TrendingUp,
  BarChart3,
  Activity,
  Boxes,
  Maximize2
} from 'lucide-react';
import { 
  getShippingOrdersList, 
  getActiveRoutesList, 
  getShippingHistoryList, 
  INITIAL_MOCK_FLEET, 
  getDriverPerformanceByPeriod, 
  getDeliveryActivityData, 
  INITIAL_MOCK_ATTENTION_ITEMS,
  ActiveShippingRoute
} from '../../data/mockShippingData';
import { ShippingRouteInteractiveMap } from './ShippingRouteInteractiveMap';
import { ActiveRouteDetailModal } from './ActiveRouteDetailModal';

interface EmbarquesDashboardProps {
  onNavigateTab: (tab: 'orders' | 'in_route' | 'history', filterQuery?: string) => void;
}

export const EmbarquesDashboard: React.FC<EmbarquesDashboardProps> = ({ onNavigateTab }) => {
  const [selectedFacility, setSelectedFacility] = useState<string>('ALL');
  const [selectedPeriod, setSelectedPeriod] = useState<'Hoy' | '7 días' | '30 días'>('Hoy');
  const [selectedActiveRouteModal, setSelectedActiveRouteModal] = useState<ActiveShippingRoute | null>(null);

  // Dynamic calculations from stores
  const allOrders = getShippingOrdersList();
  const allActiveRoutes = getActiveRoutesList();
  const allHistory = getShippingHistoryList();

  // Facility filtering helper
  const matchesFacility = (facilityName?: string) => {
    if (selectedFacility === 'ALL') return true;
    if (!facilityName) return true;
    return facilityName.toLowerCase().includes(selectedFacility.toLowerCase());
  };

  const readyToLoadOrders = allOrders.filter((o) => 
    (o.status === 'Lista para carga' || o.status === 'Transporte asignado') && matchesFacility(o.originWarehouseName)
  );
  const totalUnitsReadyToLoad = readyToLoadOrders.reduce((sum, o) => sum + o.totalUnits, 0);

  const activeRoutes = allActiveRoutes.filter((r) => 
    r.status === 'En ruta' && matchesFacility(r.originWarehouseName)
  );
  const pendingStopsCount = activeRoutes.reduce((sum, r) => 
    sum + r.stops.filter((s) => s.status !== 'Completada').length, 0
  );

  const todayCompletedCount = 18;
  const todayPlannedCount = 23;

  const attentionItems = INITIAL_MOCK_ATTENTION_ITEMS;
  const driverPerformance = getDriverPerformanceByPeriod(selectedPeriod);
  const activityPoints = getDeliveryActivityData(selectedPeriod);

  // Active route map setup: pick the first active route or default
  const displayedActiveRoute = activeRoutes[0] || allActiveRoutes[0];
  const mapStopsMock = displayedActiveRoute ? displayedActiveRoute.stops.map((s, idx) => ({
    id: s.id,
    sequenceNumber: s.sequenceNumber,
    destinationName: s.destinationName,
    zoneName: s.zoneName,
    address: s.address,
    coordinates: {
      x: s.coordinates.x,
      y: s.coordinates.y,
      lat: 25.65 + idx * 0.02,
      lng: -100.35 + idx * 0.02,
    },
    totalUnits: s.totalUnits,
    remisionFolio: s.remisionFolio,
    sourceDocumentFolio: s.sourceDocumentFolio || displayedActiveRoute.sourceDocumentFolio,
    customerType: s.customerType,
    timeWindow: s.timeWindow,
    priority: s.priority,
    items: s.items,
  })) : [];

  const mapAlternativeMock = displayedActiveRoute ? {
    id: 'alt-dash',
    strategy: displayedActiveRoute.selectedStrategy || 'RECOMMENDED',
    title: 'Ruta activa en monitoreo',
    distanceKm: displayedActiveRoute.totalDistanceKm,
    estimatedTimeMinutes: displayedActiveRoute.estimatedDurationMinutes,
    trafficDelayMinutes: 8,
    stopsCount: displayedActiveRoute.stops.length,
    windowsMetCount: displayedActiveRoute.stops.length,
    totalWindowsCount: displayedActiveRoute.stops.length,
    stopsSequence: displayedActiveRoute.stops.map((s) => s.id),
    description: `Monitoreo de ${displayedActiveRoute.folio} (${displayedActiveRoute.driverName}).`,
  } : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Filter Controls & Discrete Header Action */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-3xl bg-white border border-zinc-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white border border-rose-500/30 text-rose-600 flex items-center justify-center shadow-xs">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black text-zinc-950">
              Centro de Control & Despacho
            </h2>
            <p className="text-[11px] text-zinc-500">
              Operación integral de carga, asignación de flota, rutas activas y entregas.
            </p>
          </div>
        </div>

        {/* Filters and Action */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Facility Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <Building2 className="w-4 h-4 text-zinc-400" />
            <select
              value={selectedFacility}
              onChange={(e) => setSelectedFacility(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-zinc-300 bg-white text-xs font-semibold text-zinc-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="ALL">Todas las instalaciones</option>
              <option value="CEDIS Monterrey Norte">CEDIS Monterrey Norte</option>
              <option value="CEDIS Monterrey Sur">CEDIS Monterrey Sur</option>
              <option value="Sucursal Valle Oriente">Sucursal Valle Oriente</option>
              <option value="Sucursal Cumbres">Sucursal Cumbres</option>
            </select>
          </div>

          {/* Period Filter Toggle */}
          <div className="flex items-center rounded-xl border border-zinc-300 bg-zinc-50 p-0.5 text-xs font-bold text-zinc-600">
            {(['Hoy', '7 días', '30 días'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setSelectedPeriod(p)}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  selectedPeriod === p
                    ? 'bg-white text-zinc-950 shadow-2xs border border-zinc-200'
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Discrete CTA */}
          <button
            type="button"
            onClick={() => onNavigateTab('orders')}
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-zinc-50 text-rose-600 font-bold text-xs border border-rose-500/40 shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Ver órdenes de salida</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 1. TOP CLICKABLE KPI CARDS (4 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Card 1: Listas para carga */}
        <div
          onClick={() => onNavigateTab('orders')}
          className="p-5 rounded-3xl bg-white border border-zinc-200 hover:border-zinc-300 hover:shadow-xs transition-all cursor-pointer group space-y-1.5"
        >
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-zinc-500">
            <span>Listas para carga</span>
            <div className="w-6 h-6 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-600 group-hover:text-rose-600 group-hover:border-rose-500/40 transition-colors">
              <Truck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-zinc-950">
            {readyToLoadOrders.length || 12}
          </div>
          <div className="flex items-center justify-between text-xs text-zinc-600 pt-0.5">
            <span className="font-mono">{totalUnitsReadyToLoad || 81} unidades preparadas</span>
            <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Card 2: Rutas activas */}
        <div
          onClick={() => onNavigateTab('in_route')}
          className="p-5 rounded-3xl bg-white border border-zinc-200 hover:border-zinc-300 hover:shadow-xs transition-all cursor-pointer group space-y-1.5"
        >
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-zinc-500">
            <span>Rutas activas</span>
            <div className="w-6 h-6 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-600 group-hover:text-emerald-600 group-hover:border-emerald-500/40 transition-colors">
              <Navigation className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-emerald-700">
            {activeRoutes.length || 7}
          </div>
          <div className="flex items-center justify-between text-xs text-zinc-600 pt-0.5">
            <span className="font-mono">{pendingStopsCount || 19} paradas pendientes</span>
            <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Card 3: Entregas de hoy */}
        <div
          onClick={() => onNavigateTab('history')}
          className="p-5 rounded-3xl bg-white border border-zinc-200 hover:border-zinc-300 hover:shadow-xs transition-all cursor-pointer group space-y-1.5"
        >
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-zinc-500">
            <span>Entregas de hoy</span>
            <div className="w-6 h-6 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-600 group-hover:text-blue-600 group-hover:border-blue-500/40 transition-colors">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-blue-700">
            {todayCompletedCount}
          </div>
          <div className="flex items-center justify-between text-xs text-zinc-600 pt-0.5">
            <span className="font-mono">{todayPlannedCount} planeadas &bull; {todayCompletedCount} completadas</span>
            <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Card 4: Requieren atención */}
        <div
          onClick={() => onNavigateTab('in_route', 'attention')}
          className="p-5 rounded-3xl bg-white border border-zinc-200 hover:border-zinc-300 hover:shadow-xs transition-all cursor-pointer group space-y-1.5"
        >
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-zinc-500">
            <span>Requieren atención</span>
            <div className="w-6 h-6 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-600 group-hover:text-rose-600 group-hover:border-rose-500/40 transition-colors">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-rose-600">
            3
          </div>
          <div className="flex items-center justify-between text-xs text-zinc-600 pt-0.5">
            <span>Incidencias / retrasos</span>
            <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

      </div>

      {/* 2. CENTRO DE OPERACIÓN (2 COLUMNAS: MAPA & ATENCIÓN) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Izquierda: Rutas activas (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-3xl bg-white border border-zinc-200 shadow-2xs space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-rose-600" />
                <h3 className="font-black text-zinc-950 text-sm">
                  Rutas Activas
                </h3>
              </div>
              <p className="text-[11px] text-zinc-500">
                {activeRoutes.length || 7} rutas activas &bull; {pendingStopsCount || 19} paradas pendientes &bull; 4 vehículos disponibles
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigateTab('in_route')}
              className="px-3 py-1 rounded-xl bg-zinc-50 hover:bg-zinc-100 text-zinc-800 font-bold text-xs border border-zinc-300 transition-colors cursor-pointer"
            >
              Ver monitor completo
            </button>
          </div>

          {/* Interactive Route Map Container */}
          <div className="rounded-2xl border border-zinc-200 overflow-hidden bg-zinc-50">
            {displayedActiveRoute && mapAlternativeMock ? (
              <ShippingRouteInteractiveMap
                origin={displayedActiveRoute.originCoordinates}
                stops={mapStopsMock as any}
                activeAlternative={mapAlternativeMock as any}
                selectedStopId={undefined}
                onSelectStop={() => {}}
              />
            ) : (
              <div className="h-64 flex items-center justify-center text-zinc-400 text-xs">
                No hay rutas activas para mostrar en el mapa.
              </div>
            )}
          </div>

          {/* Map legend strip */}
          <div className="flex items-center justify-between text-[11px] text-zinc-600 border-t border-zinc-100 pt-2 flex-wrap gap-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                <span>Origen CEDIS</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <span>Próxima parada</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Completada</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-400" />
                <span>Pendiente</span>
              </span>
            </div>
            <span className="font-mono text-zinc-500 text-[10px]">
              Actualizado hace 2 min
            </span>
          </div>
        </div>

        {/* Derecha: Requieren atención (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-3xl bg-white border border-zinc-200 shadow-2xs space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
            <div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <h3 className="font-black text-zinc-950 text-sm">
                  Requieren Atención
                </h3>
              </div>
              <p className="text-[11px] text-zinc-500">
                Prioridad operativa por retraso o validación en sitio.
              </p>
            </div>

            <span className="px-2 py-0.5 rounded-full bg-white border border-rose-500 text-rose-700 font-bold font-mono text-[10px] shadow-2xs">
              {attentionItems.filter((i) => i.severity !== 'success').length} alertas
            </span>
          </div>

          {/* Attention Items Stack */}
          <div className="space-y-2.5 overflow-y-auto max-h-[380px] pr-1">
            {attentionItems.map((item) => {
              const borderAccent = item.severity === 'danger' 
                ? 'border-rose-300 bg-white' 
                : item.severity === 'warning'
                ? 'border-amber-300 bg-white'
                : 'border-zinc-200 bg-white';

              return (
                <div
                  key={item.id}
                  className={`p-3 rounded-2xl border ${borderAccent} shadow-2xs text-xs space-y-1.5 hover:shadow-xs transition-shadow`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-zinc-950 text-xs">
                        {item.routeFolio}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-medium">
                        {item.vehicleName} &bull; {item.driverName}
                      </span>
                    </div>

                    <span className={`px-2 py-0.2 rounded-full text-[9px] font-bold uppercase border shadow-2xs ${
                      item.severity === 'danger' ? 'border-rose-500 text-rose-700 bg-white' :
                      item.severity === 'warning' ? 'border-amber-500 text-amber-700 bg-white' :
                      'border-emerald-500 text-emerald-700 bg-white'
                    }`}>
                      {item.categoryTitle}
                    </span>
                  </div>

                  <div className="text-[11px] text-zinc-700">
                    <strong>{item.stopSequenceText}:</strong> {item.destinationName}
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-zinc-100">
                    <span className="text-[11px] text-zinc-500 italic">
                      {item.detailText}
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        const target = allActiveRoutes.find((r) => r.folio === item.routeFolio);
                        if (target) setSelectedActiveRouteModal(target);
                        else onNavigateTab('in_route');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-[10px] transition-colors shadow-2xs cursor-pointer"
                    >
                      {item.actionLabel}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
            <span>Prioridad alta atendida primero</span>
            <button
              type="button"
              onClick={() => onNavigateTab('in_route')}
              className="text-rose-600 font-bold hover:underline"
            >
              Ver todas las rutas en curso &rarr;
            </button>
          </div>
        </div>

      </div>

      {/* 3. OPERACIÓN DE HOY (PIPELINE VISUAL HORIZONTAL) */}
      <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-2">
          <div>
            <h3 className="font-black text-zinc-950 text-sm">
              Operación de hoy
            </h3>
            <p className="text-[11px] text-zinc-500">
              Pipeline de avance de flujo desde orden validada hasta entrega física.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-600 font-medium">Avance de entregas de hoy:</span>
            <span className="font-mono text-xs font-bold text-emerald-700 px-2.5 py-0.5 rounded-full bg-white border border-emerald-500 shadow-2xs">
              78,3 %
            </span>
          </div>
        </div>

        {/* Horizontal Pipeline Steps */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          
          {/* Step 1: Listas para carga */}
          <div
            onClick={() => onNavigateTab('orders')}
            className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 hover:border-zinc-300 transition-all cursor-pointer group space-y-1"
          >
            <span className="text-[10px] font-bold uppercase text-zinc-500 block">
              1. Listas para carga
            </span>
            <div className="text-2xl font-black font-mono text-zinc-950">
              12
            </div>
            <span className="text-[10px] text-zinc-500 block group-hover:text-zinc-900 transition-colors">
              Órdenes validadas en Mesa
            </span>
          </div>

          {/* Step 2: Cargadas */}
          <div
            onClick={() => onNavigateTab('orders')}
            className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 hover:border-zinc-300 transition-all cursor-pointer group space-y-1"
          >
            <span className="text-[10px] font-bold uppercase text-zinc-500 block">
              2. Cargadas
            </span>
            <div className="text-2xl font-black font-mono text-zinc-950">
              7
            </div>
            <span className="text-[10px] text-zinc-500 block group-hover:text-zinc-900 transition-colors">
              Secuencia LIFO en camión
            </span>
          </div>

          {/* Step 3: En ruta */}
          <div
            onClick={() => onNavigateTab('in_route')}
            className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 hover:border-zinc-300 transition-all cursor-pointer group space-y-1"
          >
            <span className="text-[10px] font-bold uppercase text-zinc-500 block">
              3. En ruta
            </span>
            <div className="text-2xl font-black font-mono text-emerald-700">
              7
            </div>
            <span className="text-[10px] text-zinc-500 block group-hover:text-zinc-900 transition-colors">
              Unidades en tránsito
            </span>
          </div>

          {/* Step 4: Llegadas registradas */}
          <div
            onClick={() => onNavigateTab('in_route')}
            className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 hover:border-zinc-300 transition-all cursor-pointer group space-y-1"
          >
            <span className="text-[10px] font-bold uppercase text-zinc-500 block">
              4. Llegadas registradas
            </span>
            <div className="text-2xl font-black font-mono text-blue-700">
              21
            </div>
            <span className="text-[10px] text-zinc-500 block group-hover:text-zinc-900 transition-colors">
              Coordenada GPS capturada
            </span>
          </div>

          {/* Step 5: Entregadas */}
          <div
            onClick={() => onNavigateTab('history')}
            className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 hover:border-zinc-300 transition-all cursor-pointer group space-y-1"
          >
            <span className="text-[10px] font-bold uppercase text-zinc-500 block">
              5. Entregadas
            </span>
            <div className="text-2xl font-black font-mono text-zinc-950">
              18
            </div>
            <span className="text-[10px] text-zinc-500 block group-hover:text-zinc-900 transition-colors">
              Firma y constancia emitida
            </span>
          </div>

        </div>
      </div>

      {/* 4. PRÓXIMAS ENTREGAS & ENTREGAS DEL PERIODO (2 COLS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Próximas entregas (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-3xl bg-white border border-zinc-200 shadow-2xs space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
            <div>
              <h3 className="font-black text-zinc-950 text-sm">
                Próximas entregas
              </h3>
              <p className="text-[11px] text-zinc-500">
                Llegadas estimadas programadas para las siguientes horas.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigateTab('in_route')}
              className="text-rose-600 font-bold text-xs hover:underline cursor-pointer"
            >
              Ver todas las rutas &rarr;
            </button>
          </div>

          {/* Compact Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 text-[10px] font-bold uppercase text-zinc-500">
                  <th className="py-2.5 px-3">Hora</th>
                  <th className="py-2.5 px-2">Ruta</th>
                  <th className="py-2.5 px-2">Tipo</th>
                  <th className="py-2.5 px-3">Destino</th>
                  <th className="py-2.5 px-2">Chofer</th>
                  <th className="py-2.5 px-2">Unidades</th>
                  <th className="py-2.5 px-3 text-right">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 font-sans text-[11px]">
                <tr className="hover:bg-zinc-50/70 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-zinc-900">14:45</td>
                  <td className="py-2.5 px-2 font-mono text-zinc-700">RT-2026-0031</td>
                  <td className="py-2.5 px-2">
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-white text-blue-800 border border-blue-400">
                      Venta
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-medium text-zinc-900 max-w-[140px] truncate">Roberto Cantú Garza</td>
                  <td className="py-2.5 px-2 text-zinc-600">Roberto Garza</td>
                  <td className="py-2.5 px-2 font-mono">4 unidades</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white border border-blue-500 text-blue-800">
                      Próxima
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-zinc-50/70 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-zinc-900">15:10</td>
                  <td className="py-2.5 px-2 font-mono text-zinc-700">RT-2026-0034</td>
                  <td className="py-2.5 px-2">
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-white text-purple-800 border border-purple-400">
                      Traspaso
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-medium text-zinc-900 max-w-[140px] truncate">Sucursal Cumbres</td>
                  <td className="py-2.5 px-2 text-zinc-600">Carlos Medina</td>
                  <td className="py-2.5 px-2 font-mono">9 unidades</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white border border-emerald-500 text-emerald-800">
                      En tiempo
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-zinc-50/70 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-zinc-900">15:25</td>
                  <td className="py-2.5 px-2 font-mono text-zinc-700">RT-2026-0033</td>
                  <td className="py-2.5 px-2">
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-white text-blue-800 border border-blue-400">
                      Venta
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-medium text-zinc-900 max-w-[140px] truncate">Hotel Boutique Las Lomas</td>
                  <td className="py-2.5 px-2 text-zinc-600">Luis Herrera</td>
                  <td className="py-2.5 px-2 font-mono">3 unidades</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white border border-amber-500 text-amber-800">
                      Retraso: 18 min
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-zinc-50/70 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-zinc-900">15:50</td>
                  <td className="py-2.5 px-2 font-mono text-zinc-700">RT-2026-0032</td>
                  <td className="py-2.5 px-2">
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-white text-blue-800 border border-blue-400">
                      Venta
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-medium text-zinc-900 max-w-[140px] truncate">Desarrollos Residenciales del Norte</td>
                  <td className="py-2.5 px-2 text-zinc-600">Javier Salinas</td>
                  <td className="py-2.5 px-2 font-mono">6 unidades</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white border border-emerald-500 text-emerald-800">
                      En tiempo
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-zinc-50/70 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-zinc-900">16:15</td>
                  <td className="py-2.5 px-2 font-mono text-zinc-700">RT-2026-0035</td>
                  <td className="py-2.5 px-2">
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-white text-purple-800 border border-purple-400">
                      Traspaso
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-medium text-zinc-900 max-w-[140px] truncate">Sucursal Valle Oriente</td>
                  <td className="py-2.5 px-2 text-zinc-600">Carlos Medina</td>
                  <td className="py-2.5 px-2 font-mono">14 unidades</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white border border-blue-500 text-blue-800">
                      Próxima
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Entregas del periodo (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-3xl bg-white border border-zinc-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
              <div>
                <h3 className="font-black text-zinc-950 text-sm">
                  Entregas del periodo
                </h3>
                <p className="text-[11px] text-zinc-500">
                  Efectividad y cumplimiento de entregas ({selectedPeriod}).
                </p>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black font-mono text-emerald-700 block">
                  91,4 %
                </span>
                <span className="text-[10px] text-zinc-500 uppercase font-bold">
                  Completas
                </span>
              </div>
            </div>

            {/* Distribution Bars */}
            <div className="space-y-2 pt-3">
              <div>
                <div className="flex justify-between text-xs font-semibold text-zinc-800 mb-1">
                  <span>Entregas completas</span>
                  <span className="font-mono font-bold">91,4 %</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-100 overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: '91.4%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-zinc-800 mb-1">
                  <span>Entregas parciales</span>
                  <span className="font-mono font-bold">4,8 %</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-100 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '4.8%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-zinc-800 mb-1">
                  <span>Con incidencia</span>
                  <span className="font-mono font-bold">2,6 %</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-100 overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: '2.6%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-zinc-800 mb-1">
                  <span>Canceladas</span>
                  <span className="font-mono font-bold">1,2 %</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-100 overflow-hidden">
                  <div className="h-full bg-zinc-400 rounded-full" style={{ width: '1.2%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Operational Metrics Cards (3 mini cards) */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-zinc-100 text-center">
            <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200 space-y-0.5">
              <span className="text-[9px] font-bold uppercase text-zinc-500 block">Tiempo x Entrega</span>
              <strong className="text-xs font-black font-mono text-zinc-950 block">14 min</strong>
            </div>

            <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200 space-y-0.5">
              <span className="text-[9px] font-bold uppercase text-zinc-500 block">Tiempo x Ruta</span>
              <strong className="text-xs font-black font-mono text-zinc-950 block">1 h 38 min</strong>
            </div>

            <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200 space-y-0.5">
              <span className="text-[9px] font-bold uppercase text-zinc-500 block">En Horario</span>
              <strong className="text-xs font-black font-mono text-emerald-700 block">92,8 %</strong>
            </div>
          </div>
        </div>

      </div>

      {/* 5. DESEMPEÑO POR CHOFER & FLOTA HOY (2 COLS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Desempeño operativo por chofer (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-3xl bg-white border border-zinc-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
            <div>
              <h3 className="font-black text-zinc-950 text-sm">
                Desempeño operativo por chofer
              </h3>
              <p className="text-[11px] text-zinc-500">
                Auditoría de cumplimiento de entregas y puntualidad ({selectedPeriod}).
              </p>
            </div>

            <span className="text-xs font-mono text-zinc-500">
              5 operadores
            </span>
          </div>

          {/* Drivers List */}
          <div className="space-y-2.5">
            {driverPerformance.map((drv) => (
              <div
                key={drv.driverId}
                className="p-3 rounded-2xl bg-zinc-50/70 border border-zinc-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white border border-zinc-300 flex items-center justify-center font-bold text-zinc-700 shadow-2xs">
                    <User className="w-4 h-4 text-zinc-500" />
                  </div>
                  <div>
                    <strong className="text-zinc-950 font-bold block">{drv.driverName}</strong>
                    <span className="text-[11px] text-zinc-500">
                      {drv.deliveriesCount} entregas registradas
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <span className="font-mono text-xs font-bold text-emerald-700 block">
                      {drv.completedPercentage.toFixed(1)} % completas
                    </span>
                    <span className="text-[10px] text-zinc-500 block">
                      {drv.incidentCount > 0 ? `${drv.incidentCount} incidencia` : '0 incidencias'}
                    </span>
                  </div>

                  <span className="px-2.5 py-1 rounded-xl bg-white border border-zinc-300 font-mono text-[10px] font-bold text-zinc-800 shadow-2xs">
                    Llegada: {drv.avgDelayText}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Flota hoy (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-3xl bg-white border border-zinc-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
            <div>
              <h3 className="font-black text-zinc-950 text-sm">
                Flota hoy
              </h3>
              <p className="text-[11px] text-zinc-500">
                Disponibilidad y estatus de unidades de transporte.
              </p>
            </div>

            <Truck className="w-4 h-4 text-zinc-400" />
          </div>

          {/* Fleet Status Summary Chips */}
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-white border border-emerald-500/40 shadow-2xs space-y-0.5">
              <span className="text-[10px] font-bold uppercase text-zinc-500 block">En ruta</span>
              <strong className="text-lg font-black font-mono text-emerald-700 block">7</strong>
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-blue-500/40 shadow-2xs space-y-0.5">
              <span className="text-[10px] font-bold uppercase text-zinc-500 block">Disponibles</span>
              <strong className="text-lg font-black font-mono text-blue-700 block">4</strong>
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-amber-500/40 shadow-2xs space-y-0.5">
              <span className="text-[10px] font-bold uppercase text-zinc-500 block">Pendientes de carga</span>
              <strong className="text-lg font-black font-mono text-amber-700 block">3</strong>
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-zinc-300 shadow-2xs space-y-0.5">
              <span className="text-[10px] font-bold uppercase text-zinc-500 block">Mantenimiento</span>
              <strong className="text-lg font-black font-mono text-zinc-700 block">1</strong>
            </div>
          </div>

          {/* Fleet Vehicles Sample */}
          <div className="space-y-2 pt-1">
            {INITIAL_MOCK_FLEET.slice(0, 4).map((veh) => (
              <div
                key={veh.id}
                className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs flex items-center justify-between gap-2"
              >
                <div>
                  <strong className="text-zinc-900 block truncate">{veh.vehicleName}</strong>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {veh.assignedRouteFolio ? `${veh.assignedRouteFolio} · ${veh.loadedUnits}/${veh.capacityUnits} unidades` : veh.lastActivityText}
                  </span>
                </div>

                <div className="text-right">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border shadow-2xs ${
                    veh.status === 'En ruta' ? 'border-emerald-500 text-emerald-800 bg-white' :
                    veh.status === 'Disponible' ? 'border-blue-500 text-blue-800 bg-white' :
                    veh.status === 'Pendiente de carga' ? 'border-amber-500 text-amber-800 bg-white' :
                    'border-zinc-400 text-zinc-700 bg-white'
                  }`}>
                    {veh.status}
                  </span>
                  {veh.occupancyPercentage > 0 && (
                    <span className="text-[10px] font-mono text-zinc-500 block mt-0.5">
                      {veh.occupancyPercentage} % ocupación
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 6. VENTAS VS TRASPASOS & CARGA SECUENCIADA (2 COLS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Movimientos por tipo (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-3xl bg-white border border-zinc-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
            <div>
              <h3 className="font-black text-zinc-950 text-sm">
                Movimientos por tipo
              </h3>
              <p className="text-[11px] text-zinc-500">
                Segmentación operativa entre despachos de Venta y Traspaso.
              </p>
            </div>

            <Boxes className="w-4 h-4 text-zinc-400" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Venta Card */}
            <div className="p-4 rounded-2xl bg-white border border-blue-300 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-white border border-blue-500 text-blue-800 shadow-2xs">
                  Venta
                </span>
                <span className="font-mono text-xs font-bold text-blue-900">68 %</span>
              </div>
              <div className="text-2xl font-black font-mono text-zinc-950">
                46 entregas
              </div>
              <div className="space-y-1 text-xs text-zinc-600 border-t border-zinc-100 pt-2">
                <div className="flex justify-between">
                  <span>Ventas entregadas completas:</span>
                  <strong className="font-mono text-zinc-900">42 pedidos</strong>
                </div>
                <div className="flex justify-between">
                  <span>Entregas parciales / incidencias:</span>
                  <strong className="font-mono text-amber-700">4 pedidos</strong>
                </div>
              </div>
            </div>

            {/* Traspaso Card */}
            <div className="p-4 rounded-2xl bg-white border border-purple-300 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-white border border-purple-500 text-purple-800 shadow-2xs">
                  Traspaso
                </span>
                <span className="font-mono text-xs font-bold text-purple-900">32 %</span>
              </div>
              <div className="text-2xl font-black font-mono text-zinc-950">
                22 movimientos
              </div>
              <div className="space-y-1 text-xs text-zinc-600 border-t border-zinc-100 pt-2">
                <div className="flex justify-between">
                  <span>Traspasos entregados físicamente:</span>
                  <strong className="font-mono text-zinc-900">18 traspasos</strong>
                </div>
                <div className="flex justify-between">
                  <span>Pendientes de recepción en Mesa:</span>
                  <strong className="font-mono text-purple-700">4 traspasos</strong>
                </div>
              </div>
            </div>

          </div>

          {/* Operational Clarity Note */}
          <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-zinc-600 text-xs flex items-start gap-2.5">
            <Info className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>Regla de Traspaso:</strong> El traspaso entregado físicamente en andén de sucursal se mantiene como <em>Pendiente de recepción</em>. El inventario no se considera disponible en sucursal hasta ser validado 100% en Mesa de Verificación &gt; Entradas.
            </p>
          </div>
        </div>

        {/* Carga secuenciada & Incidencias (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Carga secuenciada Insight Card */}
          <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
              <div>
                <h3 className="font-black text-zinc-950 text-sm">
                  Carga secuenciada
                </h3>
                <p className="text-[11px] text-zinc-500">
                  Acomodo de unidades en orden inverso a la entrega (LIFO).
                </p>
              </div>
              <Layers className="w-4 h-4 text-zinc-400" />
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
                <div className="flex items-center justify-between font-bold text-zinc-900">
                  <span>5 rutas con carga secuenciada</span>
                  <span className="font-mono text-emerald-700">71 %</span>
                </div>
                <p className="text-[11px] text-zinc-500">
                  42 unidades acomodadas en zonas (Fondo, Intermedio, Puertas) cubriendo 14 paradas.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
                <div className="flex items-center justify-between font-bold text-zinc-900">
                  <span>2 rutas con carga simple</span>
                  <span className="font-mono text-zinc-600">29 %</span>
                </div>
                <p className="text-[11px] text-zinc-500">
                  Destino único o traspaso completo a un solo andén.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 7. ACTIVIDAD DE ENTREGAS (GRÁFICA DE SERIES) */}
      <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-2">
          <div>
            <h3 className="font-black text-zinc-950 text-sm">
              Actividad de entregas
            </h3>
            <p className="text-[11px] text-zinc-500">
              Distribución de salidas de CEDIS, llegadas a destino y entregas completadas ({selectedPeriod}).
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="flex items-center gap-1.5 text-zinc-700">
              <span className="w-2.5 h-2.5 rounded bg-zinc-400" />
              <span>Salidas</span>
            </span>
            <span className="flex items-center gap-1.5 text-blue-700">
              <span className="w-2.5 h-2.5 rounded bg-blue-500" />
              <span>Llegadas</span>
            </span>
            <span className="flex items-center gap-1.5 text-emerald-700">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
              <span>Entregas</span>
            </span>
          </div>
        </div>

        {/* Clean Semantic Histogram Bars */}
        <div className="grid grid-cols-5 sm:grid-cols-7 lg:grid-cols-10 gap-2 items-end h-40 pt-4 px-2">
          {activityPoints.map((pt, idx) => {
            const maxVal = 30;
            const hSalidas = Math.max(8, (pt.salidas / maxVal) * 100);
            const hLlegadas = Math.max(4, (pt.llegadas / maxVal) * 100);
            const hEntregas = Math.max(4, (pt.entregas / maxVal) * 100);

            return (
              <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                <div className="w-full flex items-end justify-center gap-1 h-32">
                  {/* Salidas Bar */}
                  <div
                    className="w-2 bg-zinc-300 rounded-t-sm group-hover:bg-zinc-400 transition-all"
                    style={{ height: `${hSalidas}%` }}
                    title={`Salidas: ${pt.salidas}`}
                  />
                  {/* Llegadas Bar */}
                  <div
                    className="w-2 bg-blue-400 rounded-t-sm group-hover:bg-blue-500 transition-all"
                    style={{ height: `${hLlegadas}%` }}
                    title={`Llegadas: ${pt.llegadas}`}
                  />
                  {/* Entregas Bar */}
                  <div
                    className="w-2 bg-emerald-500 rounded-t-sm group-hover:bg-emerald-600 transition-all"
                    style={{ height: `${hEntregas}%` }}
                    title={`Entregas: ${pt.entregas}`}
                  />
                </div>
                <span className="text-[10px] font-mono text-zinc-500 block truncate">
                  {pt.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Route Modal if clicked */}
      {selectedActiveRouteModal && (
        <ActiveRouteDetailModal
          route={selectedActiveRouteModal}
          onClose={() => setSelectedActiveRouteModal(null)}
        />
      )}

    </div>
  );
};
