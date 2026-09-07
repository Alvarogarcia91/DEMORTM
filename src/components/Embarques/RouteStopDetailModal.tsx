import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Navigation, 
  Clock, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Truck, 
  Building2, 
  User, 
  QrCode, 
  ExternalLink,
  ChevronRight,
  Info,
  ScanLine,
  PackageCheck
} from 'lucide-react';
import { ActiveShippingRoute, ActiveRouteStop, confirmStopArrival } from '../../data/mockShippingData';
import { ModalPortal } from '../common/ModalPortal';
import { RemisionPreviewModal } from '../MesaVerificacion/Outbound/RemisionPreviewModal';
import { StopDeliveryScanStationModal } from './StopDeliveryScanStationModal';
import { getRemisionByFolio } from '../../data/mockRemisionesData';

interface RouteStopDetailModalProps {
  route: ActiveShippingRoute;
  stop: ActiveRouteStop;
  onClose: () => void;
  onArrivalConfirmed?: (updatedStop: ActiveRouteStop) => void;
  onDeliveryCompleted?: (updatedRoute: ActiveShippingRoute, updatedStop: ActiveRouteStop) => void;
}

export const RouteStopDetailModal: React.FC<RouteStopDetailModalProps> = ({
  route,
  stop,
  onClose,
  onArrivalConfirmed,
  onDeliveryCompleted,
}) => {
  const [currentStop, setCurrentStop] = useState<ActiveRouteStop>(stop);
  const [showConfirmArrivalDialog, setShowConfirmArrivalDialog] = useState(false);
  const [showNavigationModal, setShowNavigationModal] = useState(false);
  const [showRemisionModal, setShowRemisionModal] = useState(false);
  const [showScanStationModal, setShowScanStationModal] = useState(false);
  const [showNextStepNotice, setShowNextStepNotice] = useState<string | null>(null);

  const isArrivalCompleted = currentStop.status === 'En atención' || currentStop.status === 'Completada';
  const totalStops = route.stops.length;

  const handleExecuteConfirmArrival = () => {
    const res = confirmStopArrival(route.id, currentStop.id);
    if (res) {
      setCurrentStop(res.stop);
      setShowConfirmArrivalDialog(false);
      if (onArrivalConfirmed) {
        onArrivalConfirmed(res.stop);
      }
    }
  };

  return (
    <ModalPortal onClose={onClose}>
      <div className="w-full max-w-2xl bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[96vh] animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-theme-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-theme-surface">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-theme-primary/30 text-theme-primary flex items-center justify-center shadow-xs">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-black text-theme-main">
                  {route.type === 'Venta' ? `Entrega ${currentStop.sequenceNumber} de ${totalStops}` : `Parada de Traspaso ${currentStop.sequenceNumber} de ${totalStops}`}
                </h3>
                <span className="font-mono text-xs font-bold text-theme-primary px-2 py-0.5 rounded-full bg-white border border-theme-primary shadow-2xs">
                  {route.folio}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border shadow-2xs bg-white ${
                  route.type === 'Venta' ? 'border-blue-500 text-blue-800' : 'border-purple-500 text-purple-800'
                }`}>
                  {route.type}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border shadow-2xs bg-white ${
                  currentStop.status === 'Completada' 
                    ? 'border-emerald-500 text-emerald-800' 
                    : currentStop.status === 'En atención'
                    ? 'border-purple-500 text-purple-800'
                    : currentStop.status === 'Próxima'
                    ? 'border-blue-500 text-blue-800'
                    : 'border-zinc-300 text-zinc-700'
                }`}>
                  {currentStop.status}
                </span>
              </div>
              <p className="text-[11px] text-theme-muted">
                Chofer: <strong>{route.driverName}</strong> &bull; Unidad: <strong>{route.vehicleName}</strong>
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 text-xs space-y-4 bg-zinc-50/50">
          
          {/* Destination Customer & Address Card */}
          <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-2">
              <div>
                <span className="text-[10px] font-bold uppercase text-zinc-500 block">Destino / Cliente</span>
                <strong className="text-zinc-950 text-sm block">{currentStop.destinationName}</strong>
                <span className="text-[11px] text-zinc-600">{currentStop.address}</span>
              </div>

              <div className="text-right font-mono">
                <span className="text-[10px] text-zinc-500 block font-sans">Ventana Programada</span>
                <span className="text-xs font-bold text-zinc-900 px-2 py-0.5 rounded bg-zinc-50 border border-zinc-300">
                  {currentStop.timeWindow}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-[11px]">
              <div>
                <span className="text-[10px] text-zinc-500 font-bold uppercase block">Remisión:</span>
                <strong className="text-theme-primary font-mono">{currentStop.remisionFolio}</strong>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 font-bold uppercase block">Documento Base:</span>
                <strong className="text-zinc-900 font-mono">{currentStop.sourceDocumentFolio}</strong>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 font-bold uppercase block">Carga Total:</span>
                <strong className="text-zinc-900 font-mono">{currentStop.totalUnits} piezas</strong>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 font-bold uppercase block">Prioridad:</span>
                <span className="font-bold text-zinc-800">{currentStop.priority}</span>
              </div>
            </div>
          </div>

          {/* Quick Action Navigation Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setShowNavigationModal(true)}
              className="p-3 rounded-2xl bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-900 font-bold text-xs shadow-2xs flex items-center justify-between transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
                  <Navigation className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="block font-black text-zinc-950">Abrir navegación</span>
                  <span className="text-[10px] text-zinc-500">Ruta asistida hacia destino</span>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            <button
              type="button"
              onClick={() => setShowRemisionModal(true)}
              className="p-3 rounded-2xl bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-900 font-bold text-xs shadow-2xs flex items-center justify-between transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-theme-primary-light text-theme-primary flex items-center justify-center border border-theme-primary/20">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="block font-black text-zinc-950">Ver remisión oficial</span>
                  <span className="text-[10px] font-mono text-zinc-500">{currentStop.remisionFolio}</span>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            </button>
          </div>

          {/* CONFIRM ARRIVAL SECTION / LOCATION RECORD */}
          <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-zinc-950 tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-theme-primary" />
                <span>Registro de Arribo en Destino</span>
              </span>

              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-2xs bg-white ${
                isArrivalCompleted ? 'border-emerald-600 text-emerald-700' : 'border-blue-500 text-blue-800'
              }`}>
                {isArrivalCompleted ? 'Llegada confirmada' : 'Arribo pendiente'}
              </span>
            </div>

            {!isArrivalCompleted ? (
              <div className="space-y-3">
                <p className="text-[11px] text-zinc-600 leading-relaxed">
                  Al llegar al domicilio de entrega, presiona <strong>Confirmar llegada</strong> para capturar automáticamente las coordenadas de geolocalización, registrar la hora exacta y cambiar el estado de la parada a <strong>En atención</strong>.
                </p>

                <button
                  type="button"
                  onClick={() => setShowConfirmArrivalDialog(true)}
                  className="w-full py-3 rounded-2xl bg-theme-primary hover:bg-theme-primary-hover text-white font-black text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Confirmar llegada a destino</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3 animate-in fade-in">
                {/* Mini Arrival GPS Card */}
                <div className="p-3.5 rounded-xl bg-zinc-900 text-white border border-zinc-800 space-y-2.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-black text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Llegada Registrada en Destino</span>
                    </span>
                    <span className="font-mono text-[10px] text-zinc-400">
                      {currentStop.arrivalRecord?.registeredAt || '28 Ago 2026 · 14:42'}
                    </span>
                  </div>

                  {/* Mini Cartographic Map Pin Graphic */}
                  <div className="h-20 bg-slate-950 rounded-lg relative overflow-hidden border border-zinc-800 flex items-center justify-center">
                    <svg viewBox="0 0 200 60" className="w-full h-full object-cover opacity-60">
                      <line x1="0" y1="30" x2="200" y2="30" stroke="#334155" strokeWidth="3" />
                      <line x1="100" y1="0" x2="100" y2="60" stroke="#334155" strokeWidth="3" />
                      <line x1="30" y1="0" x2="170" y2="60" stroke="#1e293b" strokeWidth="2" />
                    </svg>

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        <span className="w-8 h-8 rounded-full bg-theme-primary/30 animate-ping absolute -inset-1" />
                        <div className="w-6 h-6 rounded-full bg-theme-primary border-2 border-white flex items-center justify-center text-white shadow-lg">
                          <MapPin className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>

                    <span className="absolute bottom-1 right-2 text-[8px] font-mono text-zinc-500">
                      Ubicación demo &bull; GPS
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-300 pt-1">
                    <span>Coordenadas: <strong>{currentStop.arrivalRecord?.coordinates.label || '25.6573, -100.3668'}</strong></span>
                    <span className="text-zinc-400">Chofer: {route.driverName}</span>
                  </div>

                  <p className="text-[10px] text-zinc-400 text-center font-mono">
                    Ubicación registrada al confirmar llegada.
                  </p>
                </div>

                {/* Delivery Verification Actions */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-zinc-500 block">
                      Validación de Entrega & Escaneo
                    </span>
                    <span className="text-[10px] font-bold text-rose-600">
                      Obligatorio validar remisión y UIDs
                    </span>
                  </div>

                  {currentStop.status === 'Completada' ? (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <div>
                          <strong className="block text-xs">Entrega confirmada</strong>
                          <span className="text-[10px] text-emerald-800">
                            {route.type === 'Venta' ? 'Entregada al cliente de conformidad' : 'Entregado físicamente en destino'}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowRemisionModal(true)}
                        className="px-3 py-1 rounded-lg bg-white border border-emerald-400 text-emerald-900 font-bold text-[11px] shadow-2xs hover:bg-emerald-100 transition-colors cursor-pointer"
                      >
                        Ver remisión
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => setShowScanStationModal(true)}
                        className="w-full py-3 rounded-2xl bg-theme-primary hover:bg-theme-primary-hover text-white font-black text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <ScanLine className="w-4 h-4" />
                        <span>Iniciar Escaneo & Validación de Entrega</span>
                      </button>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setShowScanStationModal(true)}
                          className="p-2 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-300 text-zinc-800 font-bold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5 text-theme-primary" />
                          <span>Escanear remisión</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setShowScanStationModal(true)}
                          className="p-2 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-300 text-zinc-800 font-bold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <PackageCheck className="w-3.5 h-3.5 text-theme-primary" />
                          <span>Escanear unidades</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>

          {/* Items & UIDs Breakdown for this stop */}
          <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-2">
            <span className="text-xs font-black uppercase text-zinc-950 tracking-wider block">
              Partidas & Artículos Amparados ({currentStop.totalUnits} piezas)
            </span>

            <div className="divide-y divide-zinc-100">
              {currentStop.items && currentStop.items.length > 0 ? (
                currentStop.items.map((it) => (
                  <div key={it.sku} className="py-2.5 space-y-1 text-[11px]">
                    <div className="flex items-center justify-between">
                      <div>
                        <strong className="text-zinc-950 block">{it.productName}</strong>
                        <span className="text-[10px] text-zinc-500">{it.brand} &bull; Medida: {it.size}</span>
                      </div>
                      <span className="font-mono font-black text-zinc-900 text-xs">{it.quantity} pzas</span>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {it.uids.map((uid) => (
                        <span key={uid} className="font-mono text-[9px] font-bold px-1.5 py-0.2 rounded bg-zinc-50 text-zinc-900 border border-zinc-300">
                          {uid}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[11px] text-zinc-500 py-2 italic">
                  Partidas amparadas en remisión oficial {currentStop.remisionFolio}.
                </p>
              )}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-theme-subtle flex items-center justify-between bg-theme-surface">
          <div className="text-[10px] text-zinc-500">
            Parada #{currentStop.sequenceNumber} en monitoreo operativo
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
          >
            Volver a la ruta
          </button>
        </div>

        {/* Confirm Arrival Prompt Dialog */}
        {showConfirmArrivalDialog && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-zinc-200 space-y-4 text-xs animate-in zoom-in-95">
              <div className="w-10 h-10 rounded-2xl bg-white border border-theme-primary/30 text-theme-primary flex items-center justify-center shadow-xs">
                <MapPin className="w-5 h-5" />
              </div>

              <div className="space-y-1.5">
                <h4 className="text-sm font-black text-zinc-950">
                  ¿Confirmar llegada a destino?
                </h4>
                <p className="text-zinc-600 text-[11px] leading-relaxed">
                  Se registrará la ubicación actual y la hora de llegada para <strong>{currentStop.destinationName}</strong>. La parada cambiará a estado <strong>En atención</strong>.
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmArrivalDialog(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleExecuteConfirmArrival}
                  className="px-5 py-2 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-black text-xs transition-all shadow-md cursor-pointer"
                >
                  Confirmar llegada
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Mock Modal */}
        {showNavigationModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-zinc-200 space-y-4 text-xs animate-in zoom-in-95">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shadow-xs">
                <Navigation className="w-5 h-5" />
              </div>

              <div className="space-y-1.5">
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-300">
                  Navegación Asistida (Modo Demo)
                </span>
                <h4 className="text-sm font-black text-zinc-950">
                  Ruta hacia: {currentStop.destinationName}
                </h4>
                <p className="text-zinc-600 text-[11px] leading-relaxed">
                  {currentStop.address}
                </p>
                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 font-mono text-[11px] text-zinc-700 space-y-1">
                  <div>Tiempo estimado de trayecto: <strong>14 min</strong></div>
                  <div>Tráfico: <strong className="text-emerald-700">Fluido vía Av. Lázaro Cárdenas</strong></div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowNavigationModal(false)}
                  className="px-5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Cerrar navegación
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Remision Preview Modal */}
        {showRemisionModal && (
          <RemisionPreviewModal
            remision={
              getRemisionByFolio(currentStop.remisionFolio) || {
                id: `rem-${currentStop.remisionFolio}`,
                folio: currentStop.remisionFolio,
                type: route.type,
                status: 'Remisión generada',
                outboundOrderFolio: route.outboundOrderFolio,
                sourceDocumentFolio: currentStop.sourceDocumentFolio || route.sourceDocumentFolio,
                sourceDocumentType: route.sourceDocumentType,
                createdAt: route.departureDate,
                originWarehouseId: route.originWarehouseId,
                originWarehouseName: route.originWarehouseName,
                destinationName: currentStop.destinationName,
                destinationAddress: currentStop.address,
                operatorAssigned: route.driverName,
                totalUnits: currentStop.totalUnits,
                qrPayload: `REM=${currentStop.remisionFolio}|TYPE=${route.type === 'Venta' ? 'SALE' : 'TRANSFER'}|REF=${route.sourceDocumentFolio}`,
                items: currentStop.items || [],
                signatures: {
                  deliveredByLabel: 'Entregó (Chofer de Reparto)',
                  deliveredByName: route.driverName,
                  receivedByLabel: 'Recibió de conformidad',
                  receivedByName: currentStop.destinationName,
                  signeeNameLabel: 'Nombre del Receptor',
                  signeeName: '',
                  dateTimeLabel: 'Fecha y hora de entrega',
                },
              }
            }
            isOrderComplete={true}
            onClose={() => setShowRemisionModal(false)}
          />
        )}

        {/* Stop Delivery Scan Station Modal */}
        {showScanStationModal && (
          <StopDeliveryScanStationModal
            route={route}
            stop={currentStop}
            onClose={() => setShowScanStationModal(false)}
            onDeliveryCompleted={(updatedRoute, updatedStop) => {
              setCurrentStop(updatedStop);
              setShowScanStationModal(false);
              if (onDeliveryCompleted) {
                onDeliveryCompleted(updatedRoute, updatedStop);
              }
              if (onArrivalConfirmed) {
                onArrivalConfirmed(updatedStop);
              }
            }}
          />
        )}

      </div>
    </ModalPortal>
  );
};
