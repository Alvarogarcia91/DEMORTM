import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Truck, 
  Clock, 
  MapPin, 
  Layers, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Eye, 
  RotateCcw,
  Calendar,
  Building2,
  PackageCheck,
  User,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { 
  ShippingHistoryRecord, 
  getShippingHistoryList, 
  ShippingHistoryResult 
} from '../../data/mockShippingData';
import { ShippingHistoryDetailModal } from './ShippingHistoryDetailModal';

export type EntregasQuickFilter = 'ALL' | 'COMPLETAS' | 'PARCIALES' | 'INCIDENCIAS' | 'TRASPASOS';

export const HistorialTab: React.FC = () => {
  const [historyRecords, setHistoryRecords] = useState<ShippingHistoryRecord[]>(() => getShippingHistoryList());
  const [quickFilter, setQuickFilter] = useState<EntregasQuickFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'Venta' | 'Traspaso'>('ALL');
  const [resultFilter, setResultFilter] = useState<string>('ALL');
  const [driverFilter, setDriverFilter] = useState<string>('ALL');
  const [vehicleFilter, setVehicleFilter] = useState<string>('ALL');
  const [originFilter, setOriginFilter] = useState<string>('ALL');
  const [selectedRecordForDetail, setSelectedRecordForDetail] = useState<ShippingHistoryRecord | null>(null);

  // Dynamic Metrics calculation
  const totalCompletedRoutes = historyRecords.filter((r) => r.status === 'Completada').length;
  const completeDeliveriesCount = historyRecords.filter((r) => r.result === 'Entrega completa').length;
  const partialDeliveriesCount = historyRecords.filter((r) => r.result === 'Entrega parcial').length;
  const incidentCount = historyRecords.filter((r) => r.result === 'Con incidencia').length;
  const transferDeliveredCount = historyRecords.filter(
    (r) => r.type === 'Traspaso' && (r.result === 'Entregado físicamente en destino' || r.result === 'Recepción confirmada en sucursal')
  ).length;

  // Filter records
  const filteredRecords = historyRecords.filter((r) => {
    // Quick filter check
    if (quickFilter === 'COMPLETAS') {
      if (r.result !== 'Entrega completa' && r.result !== 'Recepción confirmada en sucursal') return false;
    } else if (quickFilter === 'PARCIALES') {
      if (r.result !== 'Entrega parcial') return false;
    } else if (quickFilter === 'INCIDENCIAS') {
      if (r.result !== 'Con incidencia') return false;
    } else if (quickFilter === 'TRASPASOS') {
      if (r.type !== 'Traspaso') return false;
    }

    if (typeFilter !== 'ALL' && r.type !== typeFilter) return false;
    if (resultFilter !== 'ALL' && r.result !== resultFilter) return false;
    if (driverFilter !== 'ALL' && r.driverName !== driverFilter) return false;
    if (vehicleFilter !== 'ALL' && !r.vehicleName.includes(vehicleFilter)) return false;
    if (originFilter !== 'ALL' && r.originWarehouseName !== originFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchRoute = r.routeFolio.toLowerCase().includes(q);
      const matchOrder = r.outboundOrderFolio.toLowerCase().includes(q);
      const matchDoc = r.sourceDocumentFolio.toLowerCase().includes(q);
      const matchDest = r.destinationSummary.toLowerCase().includes(q);
      const matchDriver = r.driverName.toLowerCase().includes(q);
      const matchVehicle = r.vehicleName.toLowerCase().includes(q);
      const matchRemisiones = r.remisionesFolios.some((f) => f.toLowerCase().includes(q));
      const matchStops = r.stops.some(
        (s) => s.destinationName.toLowerCase().includes(q) || s.address.toLowerCase().includes(q)
      );
      return matchRoute || matchOrder || matchDoc || matchDest || matchDriver || matchVehicle || matchRemisiones || matchStops;
    }
    return true;
  });

  const getResultBadgeStyle = (result: ShippingHistoryResult) => {
    switch (result) {
      case 'Entrega completa':
      case 'Recepción confirmada en sucursal':
        return 'border-emerald-500 text-emerald-800 bg-white';
      case 'Entrega parcial':
        return 'border-amber-500 text-amber-800 bg-white';
      case 'Con incidencia':
        return 'border-rose-500 text-rose-800 bg-white';
      case 'Entregado físicamente en destino':
        return 'border-purple-500 text-purple-800 bg-white';
      case 'Cancelada':
        return 'border-zinc-400 text-zinc-700 bg-white';
      default:
        return 'border-zinc-300 text-zinc-800 bg-white';
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      
      {/* Top Executive KPI Cards (5 cols) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-4 rounded-3xl bg-white border border-zinc-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-zinc-500 text-[10px] font-bold uppercase">
            <span>Rutas completadas</span>
            <History className="w-3.5 h-3.5 text-zinc-400" />
          </div>
          <div className="text-2xl font-black font-mono text-zinc-950">
            {totalCompletedRoutes}
          </div>
          <span className="text-[10px] text-zinc-500 block">Viajes finalizados</span>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-zinc-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-zinc-500 text-[10px] font-bold uppercase">
            <span>Entregas completas</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-700">
            {completeDeliveriesCount}
          </div>
          <span className="text-[10px] text-zinc-500 block">100% de piezas entregadas</span>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-zinc-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-zinc-500 text-[10px] font-bold uppercase">
            <span>Entregas parciales</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-2xl font-black font-mono text-amber-700">
            {partialDeliveriesCount}
          </div>
          <span className="text-[10px] text-zinc-500 block">Con faltante registrado</span>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-zinc-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-zinc-500 text-[10px] font-bold uppercase">
            <span>Incidencias</span>
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <div className="text-2xl font-black font-mono text-rose-700">
            {incidentCount}
          </div>
          <span className="text-[10px] text-zinc-500 block">Rechazos o daños</span>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-zinc-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-zinc-500 text-[10px] font-bold uppercase">
            <span>Traspasos entregados</span>
            <Truck className="w-3.5 h-3.5 text-purple-600" />
          </div>
          <div className="text-2xl font-black font-mono text-purple-700">
            {transferDeliveredCount}
          </div>
          <span className="text-[10px] text-zinc-500 block">En andén o recibidos</span>
        </div>
      </div>

      {/* Header, Quick Subtabs & Filter Controls Bar */}
      <div className="p-4 rounded-3xl bg-white border border-zinc-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white border border-rose-500/30 text-rose-600 flex items-center justify-center shadow-2xs">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-zinc-950 text-sm">
                Registro de Entregas & Liquidación
              </h3>
              <p className="text-[11px] text-zinc-500">
                Auditoría completa de movimientos finalizados, firmas electrónicas y recepción de mercancía.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Quick Subtabs Bar */}
            <div className="flex items-center rounded-xl border border-zinc-300 bg-zinc-50 p-0.5 text-xs font-bold text-zinc-600">
              {(
                [
                  { id: 'ALL', label: 'Todas' },
                  { id: 'COMPLETAS', label: 'Completas' },
                  { id: 'PARCIALES', label: 'Parciales' },
                  { id: 'INCIDENCIAS', label: 'Con incidencia' },
                  { id: 'TRASPASOS', label: 'Traspasos' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setQuickFilter(tab.id)}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    quickFilter === tab.id
                      ? 'bg-white text-zinc-950 shadow-2xs border border-zinc-200'
                      : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 font-mono text-xs text-zinc-600">
              <span className="px-2.5 py-1 rounded-xl bg-white border border-zinc-300 text-zinc-800 font-bold shadow-2xs">
                {filteredRecords.length} registros
              </span>
            </div>
          </div>
        </div>

        {/* Search & Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5 pt-1">
          {/* Search Box (2 cols on lg) */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar ruta, orden, pedido, traspaso, remisión, cliente..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-zinc-300 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white placeholder:text-zinc-400"
            />
          </div>

          {/* Filter Type */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-zinc-300 bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 text-zinc-800"
            >
              <option value="ALL">Tipo: Todos</option>
              <option value="Venta">Venta</option>
              <option value="Traspaso">Traspaso</option>
            </select>
          </div>

          {/* Filter Result */}
          <div>
            <select
              value={resultFilter}
              onChange={(e) => setResultFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-zinc-300 bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 text-zinc-800"
            >
              <option value="ALL">Resultado: Todos</option>
              <option value="Entrega completa">Entrega completa</option>
              <option value="Entrega parcial">Entrega parcial</option>
              <option value="Con incidencia">Con incidencia</option>
              <option value="Entregado físicamente en destino">Entregado físicamente</option>
              <option value="Recepción confirmada en sucursal">Recepción confirmada</option>
              <option value="Cancelada">Cancelada</option>
            </select>
          </div>

          {/* Filter Driver */}
          <div>
            <select
              value={driverFilter}
              onChange={(e) => setDriverFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-zinc-300 bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 text-zinc-800"
            >
              <option value="ALL">Chofer: Todos</option>
              <option value="Roberto Garza">Roberto Garza</option>
              <option value="Carlos Medina">Carlos Medina</option>
              <option value="Luis Herrera">Luis Herrera</option>
              <option value="Javier Salinas">Javier Salinas</option>
              <option value="Raúl Morales">Raúl Morales</option>
            </select>
          </div>

          {/* Filter Origin */}
          <div>
            <select
              value={originFilter}
              onChange={(e) => setOriginFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-zinc-300 bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 text-zinc-800"
            >
              <option value="ALL">Origen: Todos</option>
              <option value="CEDIS Monterrey Norte">CEDIS Norte</option>
              <option value="CEDIS Monterrey Sur">CEDIS Sur</option>
            </select>
          </div>
        </div>
      </div>

      {/* History Records Table */}
      <div className="rounded-3xl border border-zinc-200 bg-white shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/80 text-[10px] font-black uppercase tracking-wider text-zinc-500">
                <th className="py-3.5 px-4">Ruta / Tipo</th>
                <th className="py-3.5 px-3">Orden & Doc. Origen</th>
                <th className="py-3.5 px-3">Cliente / Destino</th>
                <th className="py-3.5 px-3">Vehículo & Chofer</th>
                <th className="py-3.5 px-3">Paradas & Carga</th>
                <th className="py-3.5 px-3">Resultado</th>
                <th className="py-3.5 px-3">Salida & Cierre</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 font-sans">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-zinc-500">
                    <History className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
                    <p className="font-bold text-xs">No se encontraron movimientos históricos</p>
                    <p className="text-[11px] text-zinc-400">Intenta ajustar los criterios de búsqueda o filtros seleccionados.</p>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-zinc-50/70 transition-colors">
                    
                    {/* Ruta / Tipo */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <strong className="font-mono text-xs font-bold text-zinc-950 block">
                          {r.routeFolio}
                        </strong>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border shadow-2xs bg-white ${
                          r.type === 'Venta' ? 'border-blue-500 text-blue-800' : 'border-purple-500 text-purple-800'
                        }`}>
                          {r.type}
                        </span>
                      </div>
                    </td>

                    {/* Orden & Doc Origen */}
                    <td className="py-3.5 px-3">
                      <div className="space-y-0.5 font-mono text-[11px]">
                        <span className="text-zinc-900 font-bold block">{r.outboundOrderFolio}</span>
                        <span className="text-zinc-500 text-[10px] block">
                          Ref: {r.sourceDocumentFolio}
                        </span>
                      </div>
                    </td>

                    {/* Cliente / Destino */}
                    <td className="py-3.5 px-3 max-w-[200px]">
                      <div className="space-y-0.5">
                        <strong className="text-zinc-950 font-bold block truncate" title={r.destinationSummary}>
                          {r.destinationSummary}
                        </strong>
                        <span className="text-[10px] text-zinc-500 block truncate">
                          {r.originWarehouseName}
                        </span>
                      </div>
                    </td>

                    {/* Vehículo & Chofer */}
                    <td className="py-3.5 px-3">
                      <div className="space-y-0.5 text-[11px]">
                        <strong className="text-zinc-900 block truncate">{r.vehicleName}</strong>
                        <span className="text-zinc-600 text-[10px] flex items-center gap-1">
                          <User className="w-3 h-3 text-zinc-400" />
                          <span>{r.driverName}</span>
                        </span>
                      </div>
                    </td>

                    {/* Paradas & Carga */}
                    <td className="py-3.5 px-3 font-mono text-[11px]">
                      <div className="space-y-0.5">
                        <span className="text-zinc-900 font-bold block">
                          {r.stopsCount} parada(s)
                        </span>
                        <span className="text-zinc-500 text-[10px] block">
                          {r.totalUnits} piezas
                        </span>
                      </div>
                    </td>

                    {/* Resultado */}
                    <td className="py-3.5 px-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-2xs whitespace-nowrap ${getResultBadgeStyle(r.result)}`}>
                        {r.result}
                      </span>
                    </td>

                    {/* Salida & Cierre */}
                    <td className="py-3.5 px-3 text-[10px] font-mono text-zinc-600">
                      <div className="space-y-0.5">
                        <span className="block text-zinc-500">Salida: {r.departureDateTime}</span>
                        <span className="block text-zinc-800 font-bold">Cierre: {r.closingDateTime}</span>
                      </div>
                    </td>

                    {/* Acciones */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedRecordForDetail(r)}
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-zinc-50 text-zinc-900 font-bold text-xs border border-zinc-300 transition-all shadow-2xs flex items-center gap-1.5 ml-auto cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-zinc-600" />
                        <span>Ver detalle</span>
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Shipping History Detail Modal */}
      {selectedRecordForDetail && (
        <ShippingHistoryDetailModal
          record={selectedRecordForDetail}
          onClose={() => setSelectedRecordForDetail(null)}
        />
      )}

    </div>
  );
};

export const EntregasTab = HistorialTab;

