import React, { useState } from 'react';
import { 
  X, 
  History, 
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
  Building2,
  ShieldCheck,
  ArrowRight,
  Info
} from 'lucide-react';
import { ShippingHistoryRecord, ShippingHistoryStopDetail } from '../../data/mockShippingData';
import { ModalPortal } from '../common/ModalPortal';
import { ShippingRouteInteractiveMap } from './ShippingRouteInteractiveMap';
import { RemisionPreviewModal } from '../MesaVerificacion/Outbound/RemisionPreviewModal';
import { getRemisionByFolio, OutboundRemision } from '../../data/mockRemisionesData';

interface ShippingHistoryDetailModalProps {
  record: ShippingHistoryRecord;
  onClose: () => void;
}

export const ShippingHistoryDetailModal: React.FC<ShippingHistoryDetailModalProps> = ({
  record,
  onClose,
}) => {
  const [activeDetailSection, setActiveDetailSection] = useState<'timeline' | 'stops' | 'map'>('stops');
  const [expandedStopSequence, setExpandedStopSequence] = useState<number | null>(null);
  const [selectedRemisionFolio, setSelectedRemisionFolio] = useState<string | null>(null);

  const getResultBadgeStyle = (result: string) => {
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

  // Prepare map pins from stops
  const mapStopsMock = record.stops.map((s) => ({
    id: `stop-${s.stopSequence}`,
    sequenceNumber: s.stopSequence,
    destinationName: s.destinationName,
    zoneName: s.zoneName,
    address: s.address,
    coordinates: {
      x: s.coordinates.lng ? Math.round(((s.coordinates.lng + 100.45) / 0.25) * 600) : 300,
      y: s.coordinates.lat ? Math.round(((25.75 - s.coordinates.lat) / 0.15) * 450) : 250,
      lat: s.coordinates.lat,
      lng: s.coordinates.lng,
    },
    totalUnits: s.totalUnits,
    remisionFolio: s.remisionFolio,
    sourceDocumentFolio: s.sourceDocumentFolio,
    customerType: s.customerType,
    timeWindow: 'Entrega finalizada',
    priority: 'Normal' as const,
    items: s.items,
  }));

  const mapAlternativeMock = {
    id: 'alt-hist',
    strategy: 'RECOMMENDED' as const,
    title: 'Ruta finalizada',
    distanceKm: record.estimatedDistanceKm,
    estimatedTimeMinutes: parseInt(record.estimatedTimeText, 10) || 60,
    trafficDelayMinutes: 10,
    stopsCount: record.stopsCount,
    windowsMetCount: record.stopsCount,
    totalWindowsCount: record.stopsCount,
    stopsSequence: record.stops.map((s) => `stop-${s.stopSequence}`),
    description: `Recorrido cerrado el ${record.closingDateTime}.`,
  };

  return (
    <ModalPortal onClose={onClose}>
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col max-h-[96vh] animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-theme-primary/30 text-theme-primary flex items-center justify-center shadow-xs">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-black text-zinc-950">
                  Trazabilidad & Cierre de Ruta
                </h3>
                <span className="font-mono text-xs font-bold text-theme-primary px-2 py-0.5 rounded-full bg-white border border-theme-primary shadow-2xs">
                  {record.routeFolio}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border shadow-2xs bg-white ${
                  record.type === 'Venta' ? 'border-blue-500 text-blue-800' : 'border-purple-500 text-purple-800'
                }`}>
                  {record.type}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border shadow-2xs ${getResultBadgeStyle(record.result)}`}>
                  {record.result}
                </span>
              </div>
              <p className="text-[11px] text-zinc-500">
                Orden: <strong>{record.outboundOrderFolio}</strong> &bull; Documento: <strong>{record.sourceDocumentFolio}</strong> &bull; Cierre: <strong>{record.closingDateTime}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section Navigation Tabs */}
        <div className="px-6 border-b border-zinc-200 bg-zinc-50 flex items-center gap-4">
          <button
            type="button"
            onClick={() => setActiveDetailSection('stops')}
            className={`py-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeDetailSection === 'stops'
                ? 'border-theme-primary text-theme-primary'
                : 'border-transparent text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <PackageCheck className="w-4 h-4" />
            <span>Detalle por Parada ({record.stopsCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveDetailSection('timeline')}
            className={`py-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeDetailSection === 'timeline'
                ? 'border-theme-primary text-theme-primary'
                : 'border-transparent text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Timeline de Trazabilidad</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveDetailSection('map')}
            className={`py-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeDetailSection === 'map'
                ? 'border-theme-primary text-theme-primary'
                : 'border-transparent text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <Navigation className="w-4 h-4" />
            <span>Mapa del Recorrido</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 text-xs space-y-5 bg-zinc-50/50">
          
          {/* Key Executive Overview Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold uppercase text-zinc-500 block">Vehículo & Chofer</span>
              <strong className="text-zinc-900 text-xs block truncate">{record.vehicleName}</strong>
              <span className="text-[11px] text-zinc-600 block">{record.driverName}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold uppercase text-zinc-500 block">Origen & Despacho</span>
              <strong className="text-zinc-900 text-xs block truncate">{record.originWarehouseName}</strong>
              <span className="text-[11px] text-zinc-600 block">Salida: {record.departureDateTime}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold uppercase text-zinc-500 block">Tiempos & Distancia</span>
              <strong className="text-zinc-900 text-xs block font-mono">{record.estimatedDistanceKm} km</strong>
              <span className="text-[11px] text-zinc-600 block">
                Est: {record.estimatedTimeText} &bull; Real: {record.realTimeText}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold uppercase text-zinc-500 block">Carga & Paradas</span>
              <strong className="text-zinc-900 text-xs block font-mono">{record.totalUnits} piezas</strong>
              <span className="text-[11px] text-zinc-600 block">
                {record.stopsCount} parada(s) ejecutadas
              </span>
            </div>
          </div>

          {/* Cancellation Alert Banner */}
          {record.result === 'Cancelada' && record.cancelReason && (
            <div className="p-4 rounded-2xl bg-zinc-100 border border-zinc-300 text-zinc-800 space-y-1">
              <div className="flex items-center gap-2 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-zinc-600" />
                <span>Motivo de Cancelación de Ruta</span>
              </div>
              <p className="text-[11px] text-zinc-600 leading-relaxed pl-6">
                {record.cancelReason}
              </p>
            </div>
          )}

          {/* ================================================================= */}
          {/* SECTION 1: DETALLE POR PARADA */}
          {/* ================================================================= */}
          {activeDetailSection === 'stops' && (
            <div className="space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-zinc-900 text-xs uppercase tracking-wider">
                  Desglose de Entregas por Parada ({record.stops.length})
                </h4>
                <span className="text-[10px] font-mono text-zinc-500">
                  {record.remisionesFolios.join(' · ')}
                </span>
              </div>

              <div className="space-y-3">
                {record.stops.map((stop) => {
                  const isExpanded = expandedStopSequence === stop.stopSequence;

                  return (
                    <div
                      key={stop.stopSequence}
                      className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-3"
                    >
                      {/* Top Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-2.5">
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-full bg-zinc-900 text-white font-black text-xs flex items-center justify-center shrink-0">
                            {stop.stopSequence}
                          </span>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <strong className="text-zinc-950 text-xs">{stop.destinationName}</strong>
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-zinc-100 text-zinc-700 border border-zinc-300">
                                {stop.zoneName}
                              </span>
                              <span className="text-[10px] text-zinc-500 font-mono">
                                ({stop.customerType})
                              </span>
                            </div>
                            <p className="text-[11px] text-zinc-500">{stop.address}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-right">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-2xs ${getResultBadgeStyle(stop.result)}`}>
                            {stop.result}
                          </span>
                          <span className="font-mono text-xs font-bold text-zinc-900 px-2 py-0.5 rounded bg-zinc-50 border border-zinc-300">
                            {stop.validatedUnits}/{stop.totalUnits} u.
                          </span>
                        </div>
                      </div>

                      {/* Timestamps & GPS Coordinates Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[11px] bg-zinc-50 p-3 rounded-xl border border-zinc-200">
                        <div>
                          <span className="text-[9px] text-zinc-500 font-bold uppercase block">Remisión:</span>
                          <strong className="text-theme-primary font-mono">{stop.remisionFolio}</strong>
                        </div>
                        <div>
                          <span className="text-[9px] text-zinc-500 font-bold uppercase block">Llegada en Sitio:</span>
                          <span className="font-mono text-zinc-800">{stop.arrivalDateTime}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-zinc-500 font-bold uppercase block">Entrega Final:</span>
                          <span className="font-mono text-zinc-800">{stop.deliveryDateTime}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-zinc-500 font-bold uppercase block">Recibió:</span>
                          <span className="text-zinc-900 font-bold truncate block">{stop.recipientName}</span>
                        </div>
                      </div>

                      {/* Incident / Partial Note if present */}
                      {stop.incidentNotes && (
                        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
                          <div className="flex items-center gap-1.5 font-bold text-[11px]">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                            <span>Incidencia Registrada: {stop.incidentType || 'Detalle operativo'}</span>
                          </div>
                          <p className="text-[11px] text-amber-800 leading-relaxed">
                            {stop.incidentNotes}
                          </p>
                        </div>
                      )}

                      {/* Branch Verification Reception Notice for Traspaso */}
                      {record.type === 'Traspaso' && (
                        <div className={`p-3 rounded-xl border text-xs space-y-1 ${
                          stop.branchReceiptConfirmed
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                            : 'bg-purple-50 border-purple-200 text-purple-900'
                        }`}>
                          <div className="flex items-center gap-1.5 font-bold text-[11px]">
                            <Info className={`w-3.5 h-3.5 ${stop.branchReceiptConfirmed ? 'text-emerald-700' : 'text-purple-700'}`} />
                            <span>
                              {stop.branchReceiptConfirmed
                                ? 'Recepción confirmada en Mesa de Verificación'
                                : 'Entregado físicamente en destino · Pendiente de recepción'}
                            </span>
                          </div>
                          <p className="text-[11px]">
                            {stop.branchReceiptConfirmed
                              ? `Verificación completada el ${stop.branchReceiptDateTime} por ${stop.branchReceiptOperator}. Unidades disponibles en stock de sucursal.`
                              : 'Mercancía en andén de sucursal. Pendiente validación de ingreso en Mesa de Verificación > Entradas de la instalación.'}
                          </p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-zinc-500 font-mono">
                          GPS: {stop.coordinates.label}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedRemisionFolio(stop.remisionFolio)}
                            className="px-3 py-1.5 rounded-xl bg-white hover:bg-zinc-50 text-zinc-900 font-bold text-xs border border-zinc-300 shadow-2xs flex items-center gap-1.5 cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5 text-theme-primary" />
                            <span>Ver remisión</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setExpandedStopSequence(isExpanded ? null : stop.stopSequence)}
                            className="px-3 py-1.5 rounded-xl bg-white hover:bg-zinc-50 text-zinc-900 font-bold text-xs border border-zinc-300 shadow-2xs flex items-center gap-1.5 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-zinc-600" />
                            <span>{isExpanded ? 'Ocultar UIDs' : 'Ver UIDs'}</span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {/* Expandable UIDs Breakdown */}
                      {isExpanded && (
                        <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2 animate-in fade-in">
                          <span className="text-[10px] font-bold uppercase text-zinc-500 block">
                            Partidas & Números de Serie Únicos (UIDs)
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
                              Partidas amparadas en remisión {stop.remisionFolio}.
                            </p>
                          )}
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* SECTION 2: TIMELINE DE TRAZABILIDAD */}
          {/* ================================================================= */}
          {activeDetailSection === 'timeline' && (
            <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                <div>
                  <h4 className="font-black text-zinc-950 text-xs uppercase tracking-wider">
                    Línea de Vida & Trazabilidad Integral
                  </h4>
                  <p className="text-[11px] text-zinc-500">
                    Historial cronológico de eventos desde pedido origen hasta entrega final.
                  </p>
                </div>
                <span className="font-mono text-xs font-bold text-zinc-700">
                  {record.timeline.length} eventos registrados
                </span>
              </div>

              {/* Vertical Stepper Timeline */}
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-200">
                {record.timeline.map((ev, idx) => (
                  <div key={idx} className="relative space-y-1">
                    {/* Timeline Node Dot */}
                    <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-white border-2 border-theme-primary flex items-center justify-center shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-theme-primary" />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <strong className="text-zinc-950 text-xs font-black">
                        {ev.stepName}
                      </strong>
                      <span className="font-mono text-[10px] text-zinc-500">
                        {ev.timestamp}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-zinc-600">
                      <span>Responsable: <strong>{ev.responsibleUser}</strong></span>
                      {ev.referenceFolio && (
                        <span className="px-1.5 py-0.2 rounded bg-zinc-100 font-mono text-[10px] text-zinc-800 border border-zinc-300">
                          {ev.referenceFolio}
                        </span>
                      )}
                    </div>

                    {ev.notes && (
                      <p className="text-[11px] text-zinc-500 italic bg-zinc-50 p-2 rounded-lg border border-zinc-200 mt-1">
                        {ev.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* SECTION 3: MAPA DEL RECORRIDO */}
          {/* ================================================================= */}
          {activeDetailSection === 'map' && (
            <div className="space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-zinc-900 text-xs uppercase tracking-wider">
                  Mapa de Trayecto Recorrido & Paradas Completadas
                </h4>
                <span className="text-[11px] text-zinc-500">
                  {record.originWarehouseName} &rarr; {record.destinationSummary}
                </span>
              </div>

              <ShippingRouteInteractiveMap
                origin={record.originCoordinates}
                stops={mapStopsMock as any}
                activeAlternative={mapAlternativeMock as any}
                selectedStopId={undefined}
                onSelectStop={() => {}}
              />
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-zinc-200 flex items-center justify-between bg-white">
          <div className="text-[11px] text-zinc-500">
            Registro inmutable auditado con firma digital de entrega Impresos RTM.
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
          >
            Cerrar detalle
          </button>
        </div>

        {/* Remisión Preview Modal */}
        {selectedRemisionFolio && (
          <RemisionPreviewModal
            remision={
              getRemisionByFolio(selectedRemisionFolio) || {
                id: `rem-${selectedRemisionFolio}`,
                folio: selectedRemisionFolio,
                type: record.type,
                status: 'Entregada',
                outboundOrderFolio: record.outboundOrderFolio,
                sourceDocumentFolio: record.sourceDocumentFolio,
                sourceDocumentType: record.sourceDocumentType,
                createdAt: record.departureDateTime,
                originWarehouseId: record.originWarehouseId,
                originWarehouseName: record.originWarehouseName,
                destinationName: record.stops.find((s) => s.remisionFolio === selectedRemisionFolio)?.destinationName || record.destinationSummary,
                destinationAddress: record.stops.find((s) => s.remisionFolio === selectedRemisionFolio)?.address,
                operatorAssigned: record.driverName,
                totalUnits: record.stops.find((s) => s.remisionFolio === selectedRemisionFolio)?.totalUnits || record.totalUnits,
                qrPayload: `REM=${selectedRemisionFolio}|TYPE=${record.type === 'Venta' ? 'SALE' : 'TRANSFER'}|REF=${record.sourceDocumentFolio}`,
                items: record.stops.find((s) => s.remisionFolio === selectedRemisionFolio)?.items || [],
                signatures: {
                  deliveredByLabel: 'Entregó (Chofer de Reparto)',
                  deliveredByName: record.driverName,
                  receivedByLabel: 'Recibió de conformidad',
                  receivedByName: record.stops.find((s) => s.remisionFolio === selectedRemisionFolio)?.recipientName,
                  signeeNameLabel: 'Nombre del Receptor',
                  signeeName: '',
                  dateTimeLabel: 'Fecha y hora de entrega',
                },
                deliveryProof: {
                  deliveredAt: record.closingDateTime,
                  recipientName: record.stops.find((s) => s.remisionFolio === selectedRemisionFolio)?.recipientName || 'Receptor',
                  driverName: record.driverName,
                  vehicleName: record.vehicleName,
                  coordinates: record.stops.find((s) => s.remisionFolio === selectedRemisionFolio)?.coordinates || { lat: 25.6573, lng: -100.3668, label: '25.6573, -100.3668' },
                  result: record.result as any,
                  validatedUidsCount: record.stops.find((s) => s.remisionFolio === selectedRemisionFolio)?.validatedUnits || record.totalUnits,
                  expectedUnitsCount: record.stops.find((s) => s.remisionFolio === selectedRemisionFolio)?.totalUnits || record.totalUnits,
                  observations: 'Constancia histórica registrada en auditoría operativa.',
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
