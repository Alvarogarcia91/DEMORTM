import React, { useState } from 'react';
import { 
  X, 
  Truck, 
  Navigation, 
  Clock, 
  MapPin, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  User, 
  Eye, 
  Layers, 
  PackageCheck,
  ChevronDown,
  ChevronUp,
  QrCode,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { ActiveShippingRoute, ActiveRouteStop } from '../../data/mockShippingData';
import { ModalPortal } from '../common/ModalPortal';
import { ShippingRouteInteractiveMap } from './ShippingRouteInteractiveMap';
import { RemisionPreviewModal } from '../MesaVerificacion/Outbound/RemisionPreviewModal';
import { RouteStopDetailModal } from './RouteStopDetailModal';
import { getRemisionByFolio, getRemisionesList, OutboundRemision } from '../../data/mockRemisionesData';

interface ActiveRouteDetailModalProps {
  route: ActiveShippingRoute;
  onClose: () => void;
  onRouteUpdated?: (updatedRoute: ActiveShippingRoute) => void;
}

export const ActiveRouteDetailModal: React.FC<ActiveRouteDetailModalProps> = ({
  route,
  onClose,
  onRouteUpdated,
}) => {
  const [currentRoute, setCurrentRoute] = useState<ActiveShippingRoute>(route);
  const [selectedStopId, setSelectedStopId] = useState<string | undefined>(
    route.stops.find((s) => s.status === 'Próxima' || s.status === 'En atención')?.id || route.stops[0]?.id
  );
  const [expandedStopId, setExpandedStopId] = useState<string | null>(null);
  const [selectedRemisionFolio, setSelectedRemisionFolio] = useState<string | null>(null);
  const [selectedStopForDetail, setSelectedStopForDetail] = useState<ActiveRouteStop | null>(null);

  const completedStopsCount = currentRoute.stops.filter((s) => s.status === 'Completada').length;
  const totalStopsCount = currentRoute.stops.length;
  const progressPercent = Math.round((completedStopsCount / totalStopsCount) * 100);

  const activeAlternativeMock = {
    id: 'alt-active',
    strategy: currentRoute.selectedStrategy,
    title: 'Ruta activa en curso',
    distanceKm: currentRoute.totalDistanceKm,
    estimatedTimeMinutes: currentRoute.estimatedDurationMinutes,
    trafficDelayMinutes: 20,
    stopsCount: currentRoute.stops.length,
    windowsMetCount: currentRoute.stops.length,
    totalWindowsCount: currentRoute.stops.length,
    stopsSequence: currentRoute.stops.map((s) => s.id),
    description: 'Ruta despachada y en monitoreo de trayecto metropolitano.',
  };

  const toggleExpand = (stopId: string) => {
    setExpandedStopId((prev) => (prev === stopId ? null : stopId));
  };

  const handleStopArrivalConfirmed = (updatedStop: ActiveRouteStop) => {
    const updatedStops = currentRoute.stops.map((s) => (s.id === updatedStop.id ? updatedStop : s));
    const updatedRoute = {
      ...currentRoute,
      stops: updatedStops,
    };
    setCurrentRoute(updatedRoute);
    if (onRouteUpdated) {
      onRouteUpdated(updatedRoute);
    }
  };

  return (
    <ModalPortal onClose={onClose}>
      <div className="w-full max-w-4xl bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[96vh] animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-theme-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-theme-surface">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-theme-primary/30 text-theme-primary flex items-center justify-center shadow-xs">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-black text-theme-main">
                  Monitoreo de Ruta de Despacho
                </h3>
                <span className="font-mono text-xs font-bold text-theme-primary px-2 py-0.5 rounded-full bg-white border border-theme-primary shadow-2xs">
                  {currentRoute.folio}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border shadow-2xs bg-white ${
                  currentRoute.type === 'Venta' ? 'border-blue-500 text-blue-800' : 'border-purple-500 text-purple-800'
                }`}>
                  {currentRoute.type}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border shadow-2xs bg-white border-emerald-500 text-emerald-700">
                  {currentRoute.status}
                </span>
              </div>
              <p className="text-[11px] text-theme-muted">
                Orden: <strong>{currentRoute.outboundOrderFolio}</strong> &bull; Documento: <strong>{currentRoute.sourceDocumentFolio}</strong> &bull; Salida: <strong>{currentRoute.departureDate} a las {currentRoute.departureTime} h</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-theme-muted hover:text-theme-main hover:bg-theme-muted transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Container */}
        <div className="p-6 overflow-y-auto flex-1 text-xs space-y-5 bg-zinc-50/50">
          
          {/* High-Level Overview Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold uppercase text-zinc-500 block">Vehículo & Chofer</span>
              <strong className="text-zinc-900 text-xs block truncate">{currentRoute.vehicleName}</strong>
              <span className="text-[11px] text-zinc-600 block">{currentRoute.driverName}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold uppercase text-zinc-500 block">Origen & Tráfico</span>
              <strong className="text-zinc-900 text-xs block truncate">{currentRoute.originWarehouseName}</strong>
              <span className="text-[11px] text-emerald-700 font-bold block flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {currentRoute.trafficStatusText || 'En tiempo (tráfico normal)'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold uppercase text-zinc-500 block">Trayecto & Tiempo Restante</span>
              <strong className="text-zinc-900 text-xs block font-mono">{currentRoute.totalDistanceKm} km &bull; {currentRoute.totalUnits} piezas</strong>
              <span className="text-[11px] text-zinc-600 block">
                {currentRoute.estimatedRemainingMinutes ? `${currentRoute.estimatedRemainingMinutes} min restantes` : '48 min estimados'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold uppercase text-zinc-500 block">Progreso de Entregas</span>
              <strong className="text-emerald-700 text-xs block font-mono">
                {completedStopsCount} de {totalStopsCount} completadas ({progressPercent}%)
              </strong>
              <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200 mt-1">
                <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          </div>

          {/* Interactive Map */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-zinc-900 text-xs uppercase tracking-wider">
                Recorrido de Ruta Metropolitana
              </h4>
              <span className="text-[11px] text-zinc-500">
                La parada actual se encuentra resaltada en el mapa
              </span>
            </div>

            <ShippingRouteInteractiveMap
              origin={currentRoute.originCoordinates}
              stops={currentRoute.stops}
              activeAlternative={activeAlternativeMock as any}
              selectedStopId={selectedStopId}
              onSelectStop={(id) => setSelectedStopId(id)}
            />
          </div>

          {/* Stops List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-zinc-900 text-xs uppercase tracking-wider">
                Secuencia de Paradas & Estado Operativo ({currentRoute.stops.length} destinos)
              </h4>
              <span className="text-[10px] font-mono text-zinc-500">
                LIFO en caja: {currentRoute.loadingZones.map((z) => z.stopSequenceNumber).join(' → ')}
              </span>
            </div>

            <div className="space-y-2.5">
              {currentRoute.stops.map((stop, idx) => {
                const isSelected = selectedStopId === stop.id;
                const isExpanded = expandedStopId === stop.id;

                const statusBadgeStyle = (() => {
                  switch (stop.status) {
                    case 'Completada':
                      return 'border-emerald-500 text-emerald-800 bg-white';
                    case 'En atención':
                      return 'border-purple-500 text-purple-800 bg-white';
                    case 'Próxima':
                      return 'border-blue-500 text-blue-800 bg-white';
                    case 'Con incidencia':
                      return 'border-rose-500 text-rose-800 bg-white';
                    default:
                      return 'border-zinc-300 text-zinc-700 bg-white';
                  }
                })();

                return (
                  <div
                    key={stop.id}
                    onClick={() => setSelectedStopId(stop.id)}
                    className={`p-4 rounded-2xl bg-white border transition-all cursor-pointer shadow-2xs space-y-3 ${
                      isSelected ? 'border-2 border-theme-primary shadow-xs' : 'border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    {/* Top Row: Stop info & Status */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-2.5">
                      <div className="flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-full text-white font-black text-xs flex items-center justify-center shrink-0 ${
                          stop.status === 'Completada' 
                            ? 'bg-emerald-600' 
                            : stop.status === 'En atención'
                            ? 'bg-purple-600 animate-pulse'
                            : 'bg-theme-primary'
                        }`}>
                          {idx + 1}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <strong className="text-zinc-950 text-xs">{stop.destinationName}</strong>
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-zinc-100 text-zinc-700 border border-zinc-300">
                              {stop.zoneName}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-500">{stop.address}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-right">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-2xs ${statusBadgeStyle}`}>
                          {stop.status}
                        </span>
                        <span className="font-mono text-xs font-bold text-zinc-900 px-2 py-0.5 rounded bg-zinc-50 border border-zinc-300">
                          {stop.totalUnits} u.
                        </span>
                      </div>
                    </div>

                    {/* Middle Row: Window & Action Buttons */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                      <div className="flex items-center gap-3 text-zinc-600">
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3.5 h-3.5 text-zinc-400" />
                          <span>Ventana: {stop.timeWindow}</span>
                        </span>
                        {stop.completedAt && (
                          <span className="text-emerald-700 font-bold font-mono">
                            &bull; Entregado a las {stop.completedAt} h
                          </span>
                        )}
                        {stop.statusNotes && (
                          <span className="text-zinc-500 italic text-[10px]">
                            &bull; {stop.statusNotes}
                          </span>
                        )}
                      </div>

                      {/* Action buttons per stop */}
                      <div className="flex items-center gap-2">
                        
                        {/* Abrir Parada (Vista Operativa del Chofer) */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStopForDetail(stop);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
                          title="Abrir vista operativa de parada para chofer"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          <span>Abrir parada</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRemisionFolio(stop.remisionFolio);
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-zinc-50 text-zinc-900 font-bold text-xs border border-zinc-300 transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-theme-primary" />
                          <span>Remisión {stop.remisionFolio}</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpand(stop.id);
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-zinc-50 text-zinc-900 font-bold text-xs border border-zinc-300 transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-zinc-600" />
                          <span>{isExpanded ? 'Ocultar UIDs' : 'Ver UIDs'}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Expandable UIDs / Partidas Container */}
                    {isExpanded && (
                      <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2 animate-in fade-in">
                        <span className="text-[10px] font-bold uppercase text-zinc-500 block">
                          Artículos & UIDs Asignados a esta Parada
                        </span>
                        {stop.items && stop.items.length > 0 ? (
                          <div className="space-y-1.5">
                            {stop.items.map((it) => (
                              <div key={it.sku} className="p-2 rounded-lg bg-white border border-zinc-200 text-[11px] space-y-1">
                                <div className="flex items-center justify-between">
                                  <strong className="text-zinc-900">{it.productName}</strong>
                                  <span className="font-mono text-zinc-700 font-bold">{it.quantity} pza(s)</span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {it.uids.map((uid) => (
                                    <span key={uid} className="font-mono text-[9px] font-bold px-1.5 py-0.2 rounded bg-zinc-50 text-zinc-900 border border-zinc-300">
                                      {uid}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[10px] text-zinc-500 italic">
                            Partidas asociadas amparadas en remisión {stop.remisionFolio}.
                          </p>
                        )}
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-theme-subtle flex items-center justify-between bg-theme-surface">
          <div className="text-[11px] text-zinc-500">
            Monitoreo en ruta metropolitana &bull; Pulsa <strong>Abrir parada</strong> para ver el detalle y confirmar llegada.
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
          >
            Cerrar monitoreo
          </button>
        </div>

        {/* Route Stop Detail Modal (Operational Driver View) */}
        {selectedStopForDetail && (
          <RouteStopDetailModal
            route={currentRoute}
            stop={selectedStopForDetail}
            onClose={() => setSelectedStopForDetail(null)}
            onArrivalConfirmed={(updatedStop) => {
              handleStopArrivalConfirmed(updatedStop);
              setSelectedStopForDetail(updatedStop);
            }}
            onDeliveryCompleted={(updatedRoute, updatedStop) => {
              setCurrentRoute(updatedRoute);
              setSelectedStopForDetail(updatedStop);
              if (onRouteUpdated) {
                onRouteUpdated(updatedRoute);
              }
            }}
          />
        )}

        {/* Remisión Preview Modal */}
        {selectedRemisionFolio && (
          <RemisionPreviewModal
            remision={
              getRemisionByFolio(selectedRemisionFolio) || {
                id: `rem-${selectedRemisionFolio}`,
                folio: selectedRemisionFolio,
                type: currentRoute.type,
                status: 'Remisión generada',
                outboundOrderFolio: currentRoute.outboundOrderFolio,
                sourceDocumentFolio: currentRoute.sourceDocumentFolio,
                sourceDocumentType: currentRoute.sourceDocumentType,
                createdAt: currentRoute.departureDate,
                originWarehouseId: currentRoute.originWarehouseId,
                originWarehouseName: currentRoute.originWarehouseName,
                destinationName: currentRoute.stops.find((s) => s.remisionFolio === selectedRemisionFolio)?.destinationName || currentRoute.stops[0]?.destinationName || '',
                destinationAddress: currentRoute.stops.find((s) => s.remisionFolio === selectedRemisionFolio)?.address,
                operatorAssigned: currentRoute.driverName,
                totalUnits: currentRoute.stops.find((s) => s.remisionFolio === selectedRemisionFolio)?.totalUnits || currentRoute.totalUnits,
                qrPayload: `REM=${selectedRemisionFolio}|TYPE=${currentRoute.type === 'Venta' ? 'SALE' : 'TRANSFER'}|REF=${currentRoute.sourceDocumentFolio}`,
                items: currentRoute.stops.find((s) => s.remisionFolio === selectedRemisionFolio)?.items || [],
                signatures: {
                  deliveredByLabel: 'Entregó (Chofer de Reparto)',
                  deliveredByName: currentRoute.driverName,
                  receivedByLabel: 'Recibió de conformidad',
                  receivedByName: currentRoute.stops.find((s) => s.remisionFolio === selectedRemisionFolio)?.destinationName,
                  signeeNameLabel: 'Nombre del Receptor',
                  signeeName: '',
                  dateTimeLabel: 'Fecha y hora de entrega',
                },
              }
            }
            isOrderComplete={true}
            onClose={() => setSelectedRemisionFolio(null)}
          />
        )}

      </div>
    </ModalPortal>
  );
};
