import React, { useState } from 'react';
import { 
  Navigation, 
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
  Building2
} from 'lucide-react';
import { ActiveShippingRoute, getActiveRoutesList } from '../../data/mockShippingData';
import { ActiveRouteDetailModal } from './ActiveRouteDetailModal';

export const EnRutaTab: React.FC = () => {
  const [routes, setRoutes] = useState<ActiveShippingRoute[]>(() => getActiveRoutesList());
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'Venta' | 'Traspaso'>('ALL');
  const [originFilter, setOriginFilter] = useState<string>('ALL');
  const [selectedRouteForDetail, setSelectedRouteForDetail] = useState<ActiveShippingRoute | null>(null);

  // Filter routes
  const filteredRoutes = routes.filter((rt) => {
    if (typeFilter !== 'ALL' && rt.type !== typeFilter) return false;
    if (originFilter !== 'ALL' && rt.originWarehouseName !== originFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchFolio = rt.folio.toLowerCase().includes(q);
      const matchOrder = rt.outboundOrderFolio.toLowerCase().includes(q);
      const matchDoc = rt.sourceDocumentFolio.toLowerCase().includes(q);
      const matchDriver = rt.driverName.toLowerCase().includes(q);
      const matchVehicle = rt.vehicleName.toLowerCase().includes(q);
      const matchDestinations = rt.stops.some(
        (s) => s.destinationName.toLowerCase().includes(q) || s.remisionFolio.toLowerCase().includes(q)
      );
      return matchFolio || matchOrder || matchDoc || matchDriver || matchVehicle || matchDestinations;
    }
    return true;
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      
      {/* Header & Filter Controls Bar */}
      <div className="p-4 rounded-3xl bg-white border border-zinc-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white border border-theme-primary/30 text-theme-primary flex items-center justify-center shadow-2xs">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-zinc-950 text-sm">
                Rutas en Tránsito & Despachos Activos
              </h3>
              <p className="text-[11px] text-zinc-500">
                Monitoreo en tiempo real de unidades en ruta metropolitana y estado de paradas.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-zinc-600">
            <span className="px-2.5 py-0.5 rounded-full bg-white border border-emerald-500 text-emerald-700 font-bold shadow-2xs">
              {filteredRoutes.length} rutas activas
            </span>
          </div>
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar ruta, orden, pedido, chofer, destino..."
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl pl-9 pr-3 py-2 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-theme-primary/30"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1.5">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-3 py-2 text-xs text-zinc-900 font-semibold focus:outline-none focus:ring-2 focus:ring-theme-primary/30"
            >
              <option value="ALL">Todos los tipos (Venta y Traspaso)</option>
              <option value="Venta">Solo Ventas a Clientes</option>
              <option value="Traspaso">Solo Traspasos a Sucursales</option>
            </select>
          </div>

          {/* Origin Warehouse Filter */}
          <div className="flex items-center gap-1.5">
            <select
              value={originFilter}
              onChange={(e) => setOriginFilter(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-3 py-2 text-xs text-zinc-900 font-semibold focus:outline-none focus:ring-2 focus:ring-theme-primary/30"
            >
              <option value="ALL">Todos los CEDIS de origen</option>
              <option value="CEDIS Monterrey Norte">CEDIS Monterrey Norte</option>
              <option value="CEDIS Monterrey Sur">CEDIS Monterrey Sur</option>
            </select>
          </div>
        </div>
      </div>

      {/* Routes Table Card */}
      <div className="rounded-3xl bg-white border border-zinc-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-50 text-zinc-500 font-bold uppercase text-[9px] border-b border-zinc-200">
                <th className="py-3 px-4">Ruta / Tipo</th>
                <th className="py-3 px-3">Orden & Doc. Origen</th>
                <th className="py-3 px-3">Unidad de Transporte</th>
                <th className="py-3 px-3">Chofer Asignado</th>
                <th className="py-3 px-3">Origen CEDIS</th>
                <th className="py-3 px-3 text-center">Paradas & Carga</th>
                <th className="py-3 px-3 text-center">Progreso</th>
                <th className="py-3 px-3">Salida & Duración</th>
                <th className="py-3 px-3">Estado</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredRoutes.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-zinc-400">
                    No se encontraron rutas activas con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredRoutes.map((rt) => {
                  const completed = rt.stops.filter((s) => s.status === 'Completada').length;
                  const total = rt.stops.length;
                  const progressPct = Math.round((completed / total) * 100);

                  return (
                    <tr key={rt.id} className="hover:bg-zinc-50/80 transition-colors">
                      
                      {/* Ruta / Tipo */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <strong className="font-mono text-xs text-theme-primary block font-bold">
                            {rt.folio}
                          </strong>
                          <span className={`px-2 py-0.2 rounded-full text-[9px] font-bold uppercase border shadow-2xs bg-white ${
                            rt.type === 'Venta' ? 'border-blue-500 text-blue-800' : 'border-purple-500 text-purple-800'
                          }`}>
                            {rt.type}
                          </span>
                        </div>
                      </td>

                      {/* Orden & Doc Origen */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <div className="font-mono text-[11px] space-y-0.5">
                          <strong className="text-zinc-900 block">{rt.outboundOrderFolio}</strong>
                          <span className="text-zinc-500 text-[10px] block">{rt.sourceDocumentFolio}</span>
                        </div>
                      </td>

                      {/* Unidad Vehicular */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                          <span className="text-zinc-900 font-semibold">{rt.vehicleName}</span>
                        </div>
                      </td>

                      {/* Chofer */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="text-zinc-800">{rt.driverName}</span>
                      </td>

                      {/* Origen */}
                      <td className="py-3.5 px-3 whitespace-nowrap text-zinc-600 text-[11px]">
                        {rt.originWarehouseName}
                      </td>

                      {/* Paradas & Carga */}
                      <td className="py-3.5 px-3 whitespace-nowrap text-center">
                        <div className="font-mono text-[11px]">
                          <strong className="text-zinc-900 block">{rt.stops.length} {rt.stops.length === 1 ? 'parada' : 'paradas'}</strong>
                          <span className="text-zinc-500 text-[10px]">{rt.totalUnits} piezas</span>
                        </div>
                      </td>

                      {/* Progreso */}
                      <td className="py-3.5 px-3 whitespace-nowrap text-center">
                        <div className="space-y-1 min-w-[85px]">
                          <span className="font-mono font-bold text-[10px] text-zinc-800 block">
                            {completed} / {total} completadas
                          </span>
                          <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${progressPct}%` }} />
                          </div>
                        </div>
                      </td>

                      {/* Salida & Duración */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <div className="font-mono text-[11px] space-y-0.5">
                          <span className="text-zinc-900 font-bold block">{rt.departureTime} h</span>
                          <span className="text-zinc-500 text-[10px] block">
                            {Math.floor(rt.estimatedDurationMinutes / 60) > 0
                              ? `${Math.floor(rt.estimatedDurationMinutes / 60)} h ${rt.estimatedDurationMinutes % 60} min`
                              : `${rt.estimatedDurationMinutes} min`} &bull; {rt.totalDistanceKm} km
                          </span>
                        </div>
                      </td>

                      {/* Estado */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-2xs bg-white border-emerald-500 text-emerald-700">
                          {rt.status}
                        </span>
                      </td>

                      {/* Acción */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedRouteForDetail(rt)}
                          className="px-3 py-1.5 rounded-xl bg-white hover:bg-zinc-50 text-zinc-900 font-bold text-xs border border-zinc-300 transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer ml-auto"
                        >
                          <Navigation className="w-3.5 h-3.5 text-theme-primary" />
                          <span>Abrir ruta</span>
                        </button>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active Route Detail Modal */}
      {selectedRouteForDetail && (
        <ActiveRouteDetailModal
          route={selectedRouteForDetail}
          onClose={() => setSelectedRouteForDetail(null)}
          onRouteUpdated={(updated) => {
            setRoutes(getActiveRoutesList());
            setSelectedRouteForDetail(updated);
          }}
        />
      )}

    </div>
  );
};
