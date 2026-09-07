import React, { useState } from 'react';
import { 
  X, 
  Truck, 
  User, 
  Calendar, 
  Clock, 
  MapPin, 
  Navigation, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  ArrowLeft, 
  Layers, 
  Building2, 
  ChevronUp, 
  ChevronDown, 
  Sparkles, 
  Route, 
  Send,
  Info,
  ShieldCheck,
  PackageCheck,
  RotateCcw
} from 'lucide-react';
import { 
  ShippingOutboundOrder, 
  RouteStop, 
  RouteAlternative, 
  RouteStrategyType,
  LoadingZone,
  ActiveShippingRoute,
  generateRecommendedLoadingZones,
  confirmOrderLoadAndStartRoute,
  MOCK_SHIPPING_VEHICLES,
  MOCK_SHIPPING_DRIVERS,
  ShippingVehicle,
  ShippingDriver,
  updateOrderRouteStrategy,
  assignTransportToOrder
} from '../../data/mockShippingData';
import { ModalPortal } from '../common/ModalPortal';
import { ShippingRouteInteractiveMap } from './ShippingRouteInteractiveMap';
import { ShippingTruckLoadingVisual } from './ShippingTruckLoadingVisual';

interface ShippingLoadWizardModalProps {
  order: ShippingOutboundOrder;
  onClose: () => void;
  onCompleteWizard?: (updatedOrder: ShippingOutboundOrder, createdRoute?: ActiveShippingRoute) => void;
  onNavigateToInRoute?: () => void;
}

export const ShippingLoadWizardModal: React.FC<ShippingLoadWizardModalProps> = ({
  order,
  onClose,
  onCompleteWizard,
  onNavigateToInRoute,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Step 2 State: Transport
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(
    order.assignedVehicleId || (MOCK_SHIPPING_VEHICLES.find((v) => v.status === 'Disponible')?.id || 'veh-08')
  );
  const [selectedDriverId, setSelectedDriverId] = useState<string>(
    order.assignedDriverId || (MOCK_SHIPPING_DRIVERS.find((d) => d.status === 'Disponible')?.id || 'drv-1')
  );
  const [plannedDate, setPlannedDate] = useState<string>(order.plannedDate || '28 Ago 2026');
  const [plannedTime, setPlannedTime] = useState<string>(order.plannedTime || '08:30');
  const [transportNotes, setTransportNotes] = useState<string>(order.notes || '');

  // Step 3 State: Route & Stops
  const [stopsList, setStopsList] = useState<RouteStop[]>(order.stops || []);
  const [selectedStrategy, setSelectedStrategy] = useState<RouteStrategyType>(order.selectedStrategy || 'RECOMMENDED');
  const [selectedStopId, setSelectedStopId] = useState<string | undefined>(order.stops?.[0]?.id);

  // Step 4 State: Loading Zones & Sequenced Loading
  const [loadingZones, setLoadingZones] = useState<LoadingZone[]>(() =>
    generateRecommendedLoadingZones(order.stops || [])
  );
  const [isManualLoadingMode, setIsManualLoadingMode] = useState<boolean>(false);

  // Final confirmation state
  const [createdRoute, setCreatedRoute] = useState<ActiveShippingRoute | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const selectedVehicle = MOCK_SHIPPING_VEHICLES.find((v) => v.id === selectedVehicleId);
  const selectedDriver = MOCK_SHIPPING_DRIVERS.find((d) => d.id === selectedDriverId);
  const isCapacitySufficient = selectedVehicle ? selectedVehicle.maxUnitsCapacity >= order.totalUnits : true;
  const isMultiStop = stopsList.length > 1;

  // Active alternative metrics
  const activeAlternative: RouteAlternative = (() => {
    const existing = order.routeAlternatives.find((a) => a.strategy === selectedStrategy);
    if (existing) return existing;

    if (selectedStrategy === 'MANUAL') {
      return {
        id: 'alt-custom',
        strategy: 'MANUAL',
        title: 'Ruta personalizada',
        badge: 'Personalizada',
        distanceKm: Math.round((order.routeAlternatives[0]?.distanceKm || 40) * 1.05 * 10) / 10,
        estimatedTimeMinutes: (order.routeAlternatives[0]?.estimatedTimeMinutes || 90) + 10,
        trafficDelayMinutes: (order.routeAlternatives[0]?.trafficDelayMinutes || 20) + 5,
        stopsCount: stopsList.length,
        windowsMetCount: Math.max(1, stopsList.length - 1),
        totalWindowsCount: stopsList.length,
        stopsSequence: stopsList.map((s) => s.id),
        description: 'Secuencia de paradas ajustada manualmente por el operador de embarques.',
      };
    }

    return (
      order.routeAlternatives[0] || {
        id: 'alt-fallback',
        strategy: 'DIRECT',
        title: 'Ruta directa',
        distanceKm: 20,
        estimatedTimeMinutes: 40,
        trafficDelayMinutes: 10,
        stopsCount: 1,
        windowsMetCount: 1,
        totalWindowsCount: 1,
        stopsSequence: [],
        description: 'Ruta directa de traslado.',
      }
    );
  })();

  // Handle reordering stops in Step 3 (Ruta)
  const handleMoveStop = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= stopsList.length) return;

    const newStops = [...stopsList];
    const [moved] = newStops.splice(index, 1);
    newStops.splice(targetIndex, 0, moved);

    const updatedStops = newStops.map((stop, idx) => ({
      ...stop,
      sequenceNumber: idx + 1,
    }));

    setStopsList(updatedStops);
    setSelectedStrategy('MANUAL');

    // Automatically synchronize recommended loading sequence
    setLoadingZones(generateRecommendedLoadingZones(updatedStops));
    setIsManualLoadingMode(false);
  };

  // Handle selecting route alternative in Step 3 (Ruta)
  const handleSelectAlternative = (strategy: RouteStrategyType) => {
    setSelectedStrategy(strategy);
    const alt = order.routeAlternatives.find((a) => a.strategy === strategy);
    if (alt && alt.stopsSequence.length > 0) {
      const reorderedStops = alt.stopsSequence
        .map((id, idx) => {
          const found = order.stops.find((s) => s.id === id);
          return found ? { ...found, sequenceNumber: idx + 1 } : null;
        })
        .filter(Boolean) as RouteStop[];

      if (reorderedStops.length > 0) {
        setStopsList(reorderedStops);
        setLoadingZones(generateRecommendedLoadingZones(reorderedStops));
        setIsManualLoadingMode(false);
      }
    }
  };

  // Handle manual reordering of loading zones in Step 4 (Carga secuenciada)
  const handleMoveLoadingZone = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= loadingZones.length) return;

    const newZones = [...loadingZones];
    const [moved] = newZones.splice(index, 1);
    newZones.splice(targetIndex, 0, moved);

    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    const updatedZones = newZones.map((z, idx) => ({
      ...z,
      zoneCode: `ZONA ${letters[idx] || idx + 1}`,
      zonePosition:
        idx === 0
          ? 'Fondo'
          : idx === newZones.length - 1
          ? 'Puertas'
          : 'Intermedio',
      loadingOrderNumber: idx + 1,
    }));

    setLoadingZones(updatedZones as any);
    setIsManualLoadingMode(true);
  };

  const handleRestoreLoadingRecommendation = () => {
    setLoadingZones(generateRecommendedLoadingZones(stopsList));
    setIsManualLoadingMode(false);
  };

  // Step 5 Confirmation: Validate and Dispatch to En ruta
  const handleConfirmLoadAndStartRoute = () => {
    setValidationError(null);

    if (!order.remisionFolio && stopsList.some((s) => !s.remisionFolio)) {
      setValidationError('La orden no cuenta con remisión oficial amparada.');
      return;
    }
    if (!selectedVehicleId || !selectedVehicle) {
      setValidationError('Debe asignar una unidad vehicular válida.');
      return;
    }
    if (!selectedDriverId || !selectedDriver) {
      setValidationError('Debe asignar un chofer con licencia vigente.');
      return;
    }
    if (!stopsList || stopsList.length === 0) {
      setValidationError('Debe contar con al menos una parada en la ruta.');
      return;
    }
    if (isMultiStop && (!loadingZones || loadingZones.length === 0)) {
      setValidationError('Debe definir la secuencia de carga física.');
      return;
    }

    // Execute dispatch
    const updatedOrder: ShippingOutboundOrder = {
      ...order,
      assignedVehicleId: selectedVehicleId,
      assignedVehicleName: selectedVehicle.name,
      assignedDriverId: selectedDriverId,
      assignedDriverName: selectedDriver.name,
      plannedDate,
      plannedTime,
      selectedStrategy,
      stops: stopsList,
      status: 'En ruta',
    };

    const newRoute = confirmOrderLoadAndStartRoute(
      updatedOrder,
      loadingZones,
      selectedStrategy,
      plannedTime,
      plannedDate
    );

    setCreatedRoute(newRoute);

    if (onCompleteWizard) {
      onCompleteWizard(updatedOrder, newRoute);
    }
  };

  // Save changes and advance
  const handleNextStep = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      assignTransportToOrder(order.id, selectedVehicleId, selectedDriverId, plannedDate, plannedTime, transportNotes);
      setCurrentStep(3);
    } else if (currentStep === 3) {
      updateOrderRouteStrategy(order.id, selectedStrategy, stopsList);
      if (!isManualLoadingMode) {
        setLoadingZones(generateRecommendedLoadingZones(stopsList));
      }
      setCurrentStep(4);
    } else if (currentStep === 4) {
      setCurrentStep(5);
    } else if (currentStep === 5) {
      handleConfirmLoadAndStartRoute();
    }
  };

  return (
    <ModalPortal onClose={onClose}>
      <div className="w-full max-w-4xl bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[96vh] animate-in zoom-in-95 duration-200">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-theme-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-theme-surface">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-rose-500/30 text-rose-600 flex items-center justify-center shadow-xs">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-black text-theme-main">
                  Planificación de Carga & Ruta de Despacho
                </h3>
                <span className="font-mono text-xs font-bold text-rose-600 px-2 py-0.5 rounded-full bg-white border border-rose-500 shadow-2xs">
                  {order.folio}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border shadow-2xs bg-white text-zinc-900 ${
                  order.type === 'Venta' ? 'border-blue-500 text-blue-800' : 'border-purple-500 text-purple-800'
                }`}>
                  {order.type}
                </span>
              </div>
              <p className="text-[11px] text-theme-muted">
                Ref: <strong>{order.sourceDocumentFolio}</strong> &bull; Total: <strong>{order.totalUnits} piezas</strong> &bull; {stopsList.length} {stopsList.length === 1 ? 'parada' : 'paradas'}
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

        {/* 5-Step Stepper Bar */}
        <div className="px-6 py-3 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between overflow-x-auto text-xs">
          {[
            { step: 1, label: '1. Orden' },
            { step: 2, label: '2. Transporte' },
            { step: 3, label: '3. Ruta recomendada' },
            { step: 4, label: '4. Carga secuenciada' },
            { step: 5, label: '5. Resumen' },
          ].map((st) => (
            <div key={st.step} className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  if (st.step < currentStep) setCurrentStep(st.step as any);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  currentStep === st.step
                    ? 'bg-rose-600 text-white shadow-xs'
                    : currentStep > st.step
                    ? 'bg-white text-zinc-900 border border-emerald-500 shadow-2xs'
                    : 'bg-transparent text-zinc-400 cursor-not-allowed'
                }`}
              >
                {currentStep > st.step ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <span className="w-4 h-4 rounded-full bg-white/20 text-center leading-4 text-[10px]">
                    {st.step}
                  </span>
                )}
                <span>{st.label}</span>
              </button>
              {st.step < 5 && <span className="text-zinc-300 mx-1">&rarr;</span>}
            </div>
          ))}
        </div>

        {/* Step Content Container */}
        <div className="p-6 overflow-y-auto flex-1 text-xs space-y-5 bg-zinc-50/50">
          
          {/* =========================================================================
              PASO 1: ORDEN
             ========================================================================= */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              
              {/* Order High-Level Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-1">
                  <span className="text-[10px] font-bold uppercase text-zinc-500 block">Orden & Origen</span>
                  <strong className="text-zinc-900 text-xs block font-mono">{order.folio}</strong>
                  <span className="text-[10px] text-zinc-600 block">{order.originWarehouseName}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-1">
                  <span className="text-[10px] font-bold uppercase text-zinc-500 block">Documento Base</span>
                  <strong className="text-zinc-900 text-xs block font-mono">{order.sourceDocumentType} {order.sourceDocumentFolio}</strong>
                  <span className="text-[10px] text-zinc-600 block">Salida autorizada</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-1">
                  <span className="text-[10px] font-bold uppercase text-zinc-500 block">Entregas & Volumen</span>
                  <strong className="text-zinc-900 text-xs block font-mono">{stopsList.length} {stopsList.length === 1 ? 'entrega' : 'entregas'} &bull; {order.totalUnits} piezas</strong>
                  <span className="text-[10px] text-zinc-600 block">{order.type}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-1">
                  <span className="text-[10px] font-bold uppercase text-zinc-500 block">Remisión Oficial</span>
                  <strong className="text-rose-600 text-xs block font-mono">{order.remisionFolio}</strong>
                  <span className="text-[10px] text-emerald-700 font-bold block">100% Validada en rampa</span>
                </div>
              </div>

              {/* Stops Breakdown in Step 1 */}
              <div className="space-y-3">
                <h4 className="font-black text-zinc-900 text-xs uppercase tracking-wider">
                  Detalle de Paradas & Remisiones ({stopsList.length} {stopsList.length === 1 ? 'destino' : 'destinos'})
                </h4>

                {stopsList.map((stop, idx) => (
                  <div key={stop.id} className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-2.5">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-rose-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div>
                          <strong className="text-zinc-900 text-xs block">{stop.destinationName}</strong>
                          <span className="text-[11px] text-zinc-500">{stop.address}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-right">
                        <span className="font-mono text-xs font-bold text-rose-600 px-2 py-0.5 rounded bg-zinc-50 border border-zinc-300">
                          {stop.remisionFolio}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white text-zinc-900 border border-emerald-500">
                          {stop.totalUnits} u.
                        </span>
                      </div>
                    </div>

                    {/* Items table for stop */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-[11px] border-collapse">
                        <thead>
                          <tr className="text-zinc-500 font-bold uppercase text-[9px] border-b border-zinc-200">
                            <th className="py-1 px-2">SKU / Artículo</th>
                            <th className="py-1 px-2">Medida</th>
                            <th className="py-1 px-2 text-center">Cant.</th>
                            <th className="py-1 px-2">UIDs Asignados</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                          {stop.items.map((it) => (
                            <tr key={it.sku}>
                              <td className="py-1.5 px-2">
                                <strong className="text-zinc-900">{it.productName}</strong>
                                <span className="font-mono text-[9px] text-zinc-500 block">{it.sku}</span>
                              </td>
                              <td className="py-1.5 px-2 text-zinc-600">{it.size}</td>
                              <td className="py-1.5 px-2 text-center font-mono font-bold text-zinc-900">{it.quantity}</td>
                              <td className="py-1.5 px-2">
                                <div className="flex flex-wrap gap-1">
                                  {it.uids.map((uid) => (
                                    <span key={uid} className="font-mono text-[9px] font-bold px-1.5 py-0.2 rounded bg-zinc-50 text-zinc-900 border border-zinc-300">
                                      {uid}
                                    </span>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* =========================================================================
              PASO 2: TRANSPORTE
             ========================================================================= */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              
              {/* Vehicle Select */}
              <div className="space-y-1.5">
                <label className="font-black text-zinc-900 text-xs uppercase tracking-wider block">
                  Unidad Vehicular Asignada <span className="text-rose-600">*</span>
                </label>
                <select
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded-2xl px-3 py-2.5 text-xs text-zinc-900 font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  required
                >
                  {MOCK_SHIPPING_VEHICLES.map((veh) => (
                    <option key={veh.id} value={veh.id} disabled={veh.status === 'Mantenimiento'}>
                      {veh.name} &bull; Placas: {veh.plate} &bull; Capacidad: {veh.maxUnitsCapacity} u. ({veh.status})
                    </option>
                  ))}
                </select>
              </div>

              {/* Real-Time Capacity Card */}
              {selectedVehicle && (
                <div className={`p-4 rounded-2xl bg-white border shadow-2xs space-y-2.5 ${
                  isCapacitySufficient ? 'border-emerald-600' : 'border-amber-500'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase text-zinc-600">
                      Evaluación de Capacidad y Factor de Estiba
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-2xs bg-white ${
                      isCapacitySufficient ? 'border-emerald-600 text-emerald-700' : 'border-amber-600 text-amber-800'
                    }`}>
                      {isCapacitySufficient ? 'Capacidad suficiente' : 'Capacidad excedida'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                      <span className="text-[10px] text-zinc-500 block uppercase">Capacidad Máxima Unidad:</span>
                      <strong className="text-zinc-900 text-base">{selectedVehicle.maxUnitsCapacity} unidades</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                      <span className="text-[10px] text-zinc-500 block uppercase">Carga Total de Orden:</span>
                      <strong className="text-zinc-900 text-base">{order.totalUnits} unidades</strong>
                    </div>
                  </div>

                  {!isCapacitySufficient && (
                    <div className="flex items-center gap-1.5 text-[11px] text-amber-800 font-semibold pt-1">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                      <span>La carga excede la capacidad estimada de esta unidad. Se sugiere asignar un vehículo de mayor porte.</span>
                    </div>
                  )}
                </div>
              )}

              {/* Driver Select */}
              <div className="space-y-1.5">
                <label className="font-black text-zinc-900 text-xs uppercase tracking-wider block">
                  Chofer Asignado <span className="text-rose-600">*</span>
                </label>
                <select
                  value={selectedDriverId}
                  onChange={(e) => setSelectedDriverId(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded-2xl px-3 py-2.5 text-xs text-zinc-900 font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  required
                >
                  {MOCK_SHIPPING_DRIVERS.map((drv) => (
                    <option key={drv.id} value={drv.id} disabled={drv.status === 'En ruta'}>
                      {drv.name} &bull; {drv.licenseType} ({drv.status})
                    </option>
                  ))}
                </select>
              </div>

              {/* Schedule Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-black text-zinc-900 text-[11px] uppercase tracking-wider block">
                    Fecha Planeada de Salida
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
                    <input
                      type="text"
                      value={plannedDate}
                      onChange={(e) => setPlannedDate(e.target.value)}
                      className="w-full bg-white border border-zinc-300 rounded-2xl pl-9 pr-3 py-2 text-xs text-zinc-900 font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-black text-zinc-900 text-[11px] uppercase tracking-wider block">
                    Hora Planeada
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
                    <input
                      type="text"
                      value={plannedTime}
                      onChange={(e) => setPlannedTime(e.target.value)}
                      className="w-full bg-white border border-zinc-300 rounded-2xl pl-9 pr-3 py-2 text-xs text-zinc-900 font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="font-black text-zinc-900 text-[11px] uppercase tracking-wider block">
                  Observaciones de Maniobra & Ruta
                </label>
                <textarea
                  value={transportNotes}
                  onChange={(e) => setTransportNotes(e.target.value)}
                  placeholder="Instrucciones especiales para el chofer..."
                  rows={2}
                  className="w-full bg-white border border-zinc-300 rounded-2xl p-3 text-xs text-zinc-900 font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                />
              </div>

            </div>
          )}

          {/* =========================================================================
              PASO 3: RUTA RECOMENDADA
             ========================================================================= */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              
              {/* Helper explanation */}
              <div className="p-3.5 rounded-2xl bg-white border border-zinc-200 shadow-2xs flex items-start gap-2.5 text-zinc-700">
                <Info className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  <strong>Ruta recomendada:</strong> La propuesta considera distancia entre destinos, secuencia de entregas, ventanas planeadas y condiciones estimadas de tráfico en el área metropolitana de Monterrey.
                </p>
              </div>

              {/* Strategy Cards (Alternatives) */}
              {stopsList.length > 1 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {order.routeAlternatives.map((alt) => {
                    const isSelected = selectedStrategy === alt.strategy;

                    return (
                      <button
                        key={alt.id}
                        type="button"
                        onClick={() => handleSelectAlternative(alt.strategy)}
                        className={`p-3.5 rounded-2xl bg-white border text-left transition-all cursor-pointer shadow-2xs space-y-1.5 ${
                          isSelected
                            ? 'border-2 border-rose-600 shadow-md'
                            : 'border-zinc-300 hover:border-zinc-400'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-black text-xs text-zinc-950 block">
                            {alt.title}
                          </span>
                          {alt.badge && (
                            <span className="px-2 py-0.2 rounded-full text-[9px] font-bold bg-white text-zinc-900 border border-rose-500 shadow-2xs">
                              {alt.badge}
                            </span>
                          )}
                        </div>

                        <div className="flex items-baseline gap-2 font-mono">
                          <strong className="text-zinc-950 text-sm">{alt.distanceKm} km</strong>
                          <span className="text-zinc-600 text-xs">
                            {Math.floor(alt.estimatedTimeMinutes / 60) > 0
                              ? `${Math.floor(alt.estimatedTimeMinutes / 60)} h ${alt.estimatedTimeMinutes % 60} min`
                              : `${alt.estimatedTimeMinutes} min`}
                          </span>
                        </div>

                        <p className="text-[10px] text-zinc-500 leading-tight line-clamp-2">
                          {alt.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-white border border-rose-500 shadow-2xs flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-black text-xs text-zinc-950 block">Ruta directa</span>
                    <p className="text-[11px] text-zinc-600">Esta salida tiene un único destino.</p>
                  </div>
                  <div className="text-right font-mono">
                    <strong className="text-zinc-950 text-sm block">{activeAlternative.distanceKm} km</strong>
                    <span className="text-zinc-600 text-xs">{activeAlternative.estimatedTimeMinutes} min</span>
                  </div>
                </div>
              )}

              {/* Interactive Route Map Component */}
              <ShippingRouteInteractiveMap
                origin={order.originCoordinates || { x: 260, y: 70, name: order.originWarehouseName }}
                stops={stopsList}
                activeAlternative={activeAlternative}
                selectedStopId={selectedStopId}
                onSelectStop={(id) => setSelectedStopId(id)}
              />

              {/* Sequence of Stops Reordering List */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-zinc-900 text-xs uppercase tracking-wider">
                    Secuencia Ordenada de Paradas ({stopsList.length} destinos)
                  </h4>
                  {selectedStrategy === 'MANUAL' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 border border-purple-500 shadow-2xs">
                      Ruta personalizada
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  {stopsList.map((stop, index) => {
                    const isSelected = selectedStopId === stop.id;

                    return (
                      <div
                        key={stop.id}
                        onClick={() => setSelectedStopId(stop.id)}
                        className={`p-3 rounded-2xl bg-white border transition-all flex items-center justify-between gap-3 cursor-pointer shadow-2xs ${
                          isSelected ? 'border-rose-600 shadow-xs' : 'border-zinc-200 hover:border-zinc-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-rose-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                            {index + 1}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <strong className="text-zinc-900 text-xs">{stop.destinationName}</strong>
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-zinc-100 text-zinc-700 border border-zinc-300">
                                {stop.zoneName}
                              </span>
                            </div>
                            <p className="text-[10px] text-zinc-500 truncate max-w-sm">{stop.address}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right font-mono text-[11px]">
                            <span className="text-zinc-900 font-bold block">{stop.totalUnits} piezas</span>
                            <span className="text-zinc-500 text-[10px]">{stop.remisionFolio}</span>
                          </div>

                          {stopsList.length > 1 && (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                disabled={index === 0}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMoveStop(index, 'up');
                                }}
                                className="p-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed border border-zinc-300 transition-colors"
                                title="Subir parada"
                              >
                                <ChevronUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={index === stopsList.length - 1}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMoveStop(index, 'down');
                                }}
                                className="p-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed border border-zinc-300 transition-colors"
                                title="Bajar parada"
                              >
                                <ChevronDown className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* =========================================================================
              PASO 4: CARGA SECUENCIADA (LIFO)
             ========================================================================= */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              
              {/* Step Helper Banner */}
              <div className="p-3.5 rounded-2xl bg-white border border-zinc-200 shadow-2xs flex items-start gap-2.5 text-zinc-700">
                <Info className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-zinc-950 text-xs block">Carga secuenciada en unidad vehicular</strong>
                  <p className="text-[11px] leading-relaxed">
                    Organiza las unidades dentro del vehículo según el orden de entrega para reducir movimientos durante la descarga.
                  </p>
                </div>
              </div>

              {/* Truck Loading Visual Component */}
              <ShippingTruckLoadingVisual
                vehicle={selectedVehicle}
                loadingZones={loadingZones}
                totalUnits={order.totalUnits}
                isMultiStop={isMultiStop}
                isManualMode={isManualLoadingMode}
                onMoveZone={handleMoveLoadingZone}
                onToggleManualMode={() => setIsManualLoadingMode((prev) => !prev)}
                onRestoreRecommendation={handleRestoreLoadingRecommendation}
              />

            </div>
          )}

          {/* =========================================================================
              PASO 5: RESUMEN FINAL & CONFIRMACIÓN DE DESPACHO
             ========================================================================= */}
          {currentStep === 5 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              
              {/* Validation Error Banner if any */}
              {validationError && (
                <div className="p-3.5 rounded-2xl bg-white border border-rose-500 shadow-2xs flex items-center gap-2 text-rose-800 text-xs font-semibold">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Executive Summary Cards */}
              <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                  <span className="font-black text-xs uppercase text-zinc-900">
                    Resumen Ejecutivo de Despacho & Carga
                  </span>
                  <span className="font-mono text-xs font-bold text-rose-600 px-2.5 py-0.5 rounded-full bg-white border border-rose-500 shadow-2xs">
                    {order.folio}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase block">Vehículo Asignado:</span>
                    <strong className="text-zinc-900">{selectedVehicle?.name}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase block">Chofer Asignado:</span>
                    <strong className="text-zinc-900">{selectedDriver?.name}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase block">Estrategia de Ruta:</span>
                    <strong className="text-rose-600">{activeAlternative.title}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase block">Tipo de Carga:</span>
                    <strong className="text-zinc-900">
                      {isMultiStop 
                        ? (isManualLoadingMode ? 'Carga secuenciada personalizada' : 'Carga secuenciada recomendada (LIFO)')
                        : 'Carga simple consolidada'}
                    </strong>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2 border-t border-zinc-100 font-mono text-xs">
                  <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-center">
                    <span className="text-[10px] text-zinc-500 font-sans block">Distancia Total</span>
                    <strong className="text-zinc-900 text-sm">{activeAlternative.distanceKm} km</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-center">
                    <span className="text-[10px] text-zinc-500 font-sans block">Tiempo de Viaje</span>
                    <strong className="text-emerald-700 text-sm">
                      {Math.floor(activeAlternative.estimatedTimeMinutes / 60) > 0
                        ? `${Math.floor(activeAlternative.estimatedTimeMinutes / 60)} h ${activeAlternative.estimatedTimeMinutes % 60} min`
                        : `${activeAlternative.estimatedTimeMinutes} min`}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-center">
                    <span className="text-[10px] text-zinc-500 font-sans block">Total Carga</span>
                    <strong className="text-zinc-900 text-sm">{order.totalUnits} piezas</strong>
                  </div>
                </div>
              </div>

              {/* Loading & Sequence Recap Box */}
              <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-zinc-500 tracking-wider block">
                    Secuencia Física de Carga en Caja Confirmada
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">
                    Orden de carga: {loadingZones.map((z) => z.stopSequenceNumber).join(' → ')}
                  </span>
                </div>

                <div className="space-y-1.5">
                  {loadingZones.map((zone, idx) => (
                    <div key={zone.id} className="flex items-center justify-between p-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-zinc-900 text-white font-bold text-[10px] flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <strong className="text-zinc-900">{zone.zoneCode} &bull; Parada {zone.stopSequenceNumber}</strong>
                        <span className="text-zinc-500 font-mono text-[10px]">({zone.destinationName})</span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-white text-zinc-700 border border-zinc-300">
                          {zone.zonePosition}
                        </span>
                      </div>
                      <span className="font-mono text-zinc-700 font-bold text-[10px]">
                        {zone.totalUnits} u &bull; {zone.remisionFolio}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Confirmation Notice Banner */}
              <div className="p-3.5 rounded-2xl bg-white border border-emerald-500 shadow-2xs flex items-center gap-2 text-zinc-700 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <p className="text-[11px] leading-tight">
                  <strong>Confirmación de Despacho:</strong> Esta acción marcará la carga como confirmada, asignará el folio de ruta y moverá la orden al módulo <strong>En ruta</strong>.
                </p>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-3.5 border-t border-theme-subtle flex items-center justify-between bg-theme-surface">
          <button
            type="button"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep((prev) => (prev - 1) as any)}
            className="px-4 py-2 rounded-2xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-bold text-xs border border-theme-subtle transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Atrás</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-2xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-bold text-xs border border-theme-subtle transition-colors cursor-pointer"
            >
              Cerrar
            </button>

            <button
              type="button"
              onClick={handleNextStep}
              className="px-6 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition-all shadow-md cursor-pointer flex items-center gap-2"
            >
              <span>
                {currentStep === 4 
                  ? 'Confirmar secuencia' 
                  : currentStep === 5 
                  ? 'Confirmar carga e iniciar ruta' 
                  : 'Siguiente paso'}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Success Dispatch Modal */}
        {createdRoute && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-zinc-200 space-y-4 text-xs animate-in zoom-in-95">
              <div className="w-12 h-12 rounded-2xl bg-white border border-emerald-500 text-emerald-600 flex items-center justify-center shadow-xs">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <div className="space-y-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 border border-emerald-500 shadow-2xs">
                  Carga Confirmada &bull; En Ruta
                </span>
                <h4 className="text-sm font-black text-zinc-950">
                  Carga confirmada. La ruta {createdRoute.folio} está en curso.
                </h4>
                <p className="text-zinc-600 text-[11px] leading-relaxed">
                  La orden <strong>{order.folio}</strong> ha sido despachada en la unidad <strong>{createdRoute.vehicleName}</strong> con el chofer <strong>{createdRoute.driverName}</strong> amparando <strong>{createdRoute.totalUnits} unidades</strong> en <strong>{createdRoute.stops.length} paradas</strong>.
                </p>
                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-[11px] font-mono text-zinc-700 space-y-0.5">
                  <div>Ruta: <strong className="text-rose-600">{createdRoute.folio}</strong></div>
                  <div>Tiempo estimado: <strong>{Math.floor(createdRoute.estimatedDurationMinutes / 60)} h {createdRoute.estimatedDurationMinutes % 60} min</strong></div>
                  <div>Distancia: <strong>{createdRoute.totalDistanceKm} km</strong></div>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onNavigateToInRoute) {
                      onNavigateToInRoute();
                    }
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Ver ruta en curso</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </ModalPortal>
  );
};
