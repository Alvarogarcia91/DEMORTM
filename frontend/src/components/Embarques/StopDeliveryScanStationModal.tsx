import React, { useState, useEffect } from 'react';
import { 
  X, 
  Scan, 
  QrCode, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  PackageCheck, 
  Layers, 
  Truck, 
  MapPin, 
  User, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  ChevronRight, 
  ArrowRight,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Camera,
  RotateCcw,
  Send,
  Eye,
  Info
} from 'lucide-react';
import { 
  ActiveShippingRoute, 
  ActiveRouteStop, 
  confirmStopDelivery, 
  StopDeliveryPayload 
} from '../../data/mockShippingData';
import { ModalPortal } from '../common/ModalPortal';
import { RemisionPreviewModal } from '../MesaVerificacion/Outbound/RemisionPreviewModal';
import { getRemisionByFolio, OutboundRemision } from '../../data/mockRemisionesData';

interface StopDeliveryScanStationModalProps {
  route: ActiveShippingRoute;
  stop: ActiveRouteStop;
  onClose: () => void;
  onDeliveryCompleted: (updatedRoute: ActiveShippingRoute, updatedStop: ActiveRouteStop) => void;
}

export type DeliveryScanStep = 'SCAN_REMISION' | 'SCAN_UNITS' | 'SUMMARY_SIGNATURE' | 'SUCCESS';

export const StopDeliveryScanStationModal: React.FC<StopDeliveryScanStationModalProps> = ({
  route,
  stop,
  onClose,
  onDeliveryCompleted,
}) => {
  const [currentStep, setCurrentStep] = useState<DeliveryScanStep>('SCAN_REMISION');
  
  // Remisión scanning state
  const [remisionInput, setRemisionInput] = useState('');
  const [isRemisionValidated, setIsRemisionValidated] = useState(false);
  const [remisionScanError, setRemisionScanError] = useState<string | null>(null);
  
  // UID units scanning state
  const [allExpectedUids, setAllExpectedUids] = useState<string[]>(() => {
    if (stop.items && stop.items.length > 0) {
      return stop.items.flatMap((it) => it.uids);
    }
    return [
      `SC-UID-2026-000101`,
      `SC-UID-2026-000102`,
      `SC-UID-2026-000107`,
      `SC-UID-2026-000108`
    ].slice(0, stop.totalUnits);
  });

  const [validatedUids, setValidatedUids] = useState<string[]>([]);
  const [uidInput, setUidInput] = useState('');
  const [uidScanError, setUidScanError] = useState<string | null>(null);
  const [uidScanSuccessMessage, setUidScanSuccessMessage] = useState<string | null>(null);
  const [isLaserScanning, setIsLaserScanning] = useState(false);

  // Partial / Incident state
  const [isPartialDelivery, setIsPartialDelivery] = useState(false);
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [incidentType, setIncidentType] = useState<string>('Unidad no localizada');
  const [incidentNotes, setIncidentNotes] = useState<string>('');

  // Signature & Confirmation form state
  const [recipientName, setRecipientName] = useState(stop.contactName || stop.destinationName || '');
  const [deliveryObservations, setDeliveryObservations] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(true);

  // Delivered remision preview modal
  const [showDeliveredRemisionModal, setShowDeliveredRemisionModal] = useState(false);
  const [lastDeliveredRemision, setLastDeliveredRemision] = useState<OutboundRemision | null>(null);

  // Other stops' UIDs to validate against wrong-stop errors
  const otherStopsUids = route.stops
    .filter((s) => s.id !== stop.id)
    .flatMap((s) => (s.items ? s.items.flatMap((it) => it.uids) : []));

  const totalExpectedCount = stop.totalUnits;
  const validatedCount = validatedUids.length;
  const isAllUnitsValidated = validatedCount >= totalExpectedCount && totalExpectedCount > 0;

  // Sound/Vibration feedback simulation
  const triggerLaserAnimation = (callback: () => void) => {
    setIsLaserScanning(true);
    setTimeout(() => {
      setIsLaserScanning(false);
      callback();
    }, 450);
  };

  // =========================================================================
  // PASO 1: VALIDACIÓN DE REMISIÓN
  // =========================================================================
  const handleValidateRemision = (codeToTest: string) => {
    const raw = codeToTest.trim().toUpperCase();
    setRemisionScanError(null);

    triggerLaserAnimation(() => {
      // Clean possible QR payload: e.g. REM=REM-2026-0061|TYPE=SALE...
      let extractedFolio = raw;
      if (raw.includes('REM=')) {
        const match = raw.match(/REM=([^|]+)/);
        if (match) extractedFolio = match[1];
      }

      if (extractedFolio === stop.remisionFolio.toUpperCase()) {
        setIsRemisionValidated(true);
        setRemisionScanError(null);
        // Auto advance to units after short pause
        setTimeout(() => {
          setCurrentStep('SCAN_UNITS');
        }, 600);
      } else {
        setRemisionScanError('La remisión escaneada no corresponde a esta entrega.');
      }
    });
  };

  // =========================================================================
  // PASO 2: ESCANEO Y VALIDACIÓN INDIVIDUAL DE UIDs
  // =========================================================================
  const handleScanUid = (uidToTest: string) => {
    const cleanUid = uidToTest.trim().toUpperCase();
    if (!cleanUid) return;

    setUidScanError(null);
    setUidScanSuccessMessage(null);

    triggerLaserAnimation(() => {
      // 1. Check if already scanned
      if (validatedUids.includes(cleanUid)) {
        setUidScanError('Esta unidad ya fue escaneada.');
        return;
      }

      // 2. Check if belongs to another stop of the route
      if (otherStopsUids.includes(cleanUid)) {
        setUidScanError('Esta unidad corresponde a otra entrega de la ruta.');
        return;
      }

      // 3. Check if UID belongs to this remisión
      if (!allExpectedUids.includes(cleanUid)) {
        setUidScanError(`Esta unidad no está incluida en ${stop.remisionFolio}.`);
        return;
      }

      // Valid UID
      const newValidated = [...validatedUids, cleanUid];
      setValidatedUids(newValidated);
      setUidInput('');
      setUidScanSuccessMessage(`Unidad ${cleanUid} validada correctamente ✓`);

      if (newValidated.length >= totalExpectedCount) {
        setTimeout(() => {
          setCurrentStep('SUMMARY_SIGNATURE');
        }, 700);
      }
    });
  };

  // Preset Simulators
  const handleScanNextValidUid = () => {
    const nextPending = allExpectedUids.find((uid) => !validatedUids.includes(uid));
    if (nextPending) {
      handleScanUid(nextPending);
    }
  };

  const handleScanAllRemainingUids = () => {
    triggerLaserAnimation(() => {
      setValidatedUids([...allExpectedUids]);
      setUidScanSuccessMessage(`Todas las unidades (${allExpectedUids.length} pzas) validadas ✓`);
      setTimeout(() => {
        setCurrentStep('SUMMARY_SIGNATURE');
      }, 700);
    });
  };

  // =========================================================================
  // PASO 3: CONFIRMACIÓN FINAL DE ENTREGA
  // =========================================================================
  const handleExecuteDeliveryConfirmation = () => {
    if (!acceptedTerms) return;

    const missingUids = allExpectedUids.filter((u) => !validatedUids.includes(u));
    const isPartial = missingUids.length > 0 || isPartialDelivery;

    const payload: StopDeliveryPayload = {
      routeId: route.id,
      stopId: stop.id,
      recipientName: recipientName.trim() || stop.destinationName,
      observations: deliveryObservations,
      acceptedTerms: true,
      validatedUids: validatedUids,
      missingUids: isPartial ? missingUids : undefined,
      incident: (isPartial || incidentNotes) ? {
        type: incidentType,
        notes: incidentNotes || (isPartial ? `Entrega parcial de ${validatedUids.length} de ${totalExpectedCount} piezas.` : ''),
      } : undefined,
    };

    const res = confirmStopDelivery(payload);
    if (res) {
      setLastDeliveredRemision(res.remision || getRemisionByFolio(stop.remisionFolio) || null);
      setCurrentStep('SUCCESS');
      onDeliveryCompleted(res.route, res.stop);
    }
  };

  return (
    <ModalPortal onClose={onClose}>
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col max-h-[96vh] animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-rose-500/30 text-rose-600 flex items-center justify-center shadow-xs">
              <Scan className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-black text-zinc-950">
                  Estación de Escaneo & Cierre de Entrega
                </h3>
                <span className="font-mono text-xs font-bold text-rose-600 px-2 py-0.5 rounded-full bg-white border border-rose-500 shadow-2xs">
                  {stop.remisionFolio}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border shadow-2xs bg-white ${
                  route.type === 'Venta' ? 'border-blue-500 text-blue-800' : 'border-purple-500 text-purple-800'
                }`}>
                  {route.type}
                </span>
              </div>
              <p className="text-[11px] text-zinc-500">
                Parada #{stop.sequenceNumber}: <strong>{stop.destinationName}</strong> &bull; Chofer: <strong>{route.driverName}</strong>
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

        {/* Step Indicator Bar */}
        <div className="px-6 py-2.5 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between text-xs font-bold">
          <div className="flex items-center gap-6">
            <div className={`flex items-center gap-2 ${
              currentStep === 'SCAN_REMISION' ? 'text-rose-600' : isRemisionValidated ? 'text-emerald-700' : 'text-zinc-400'
            }`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                isRemisionValidated ? 'bg-emerald-600 text-white' : currentStep === 'SCAN_REMISION' ? 'bg-rose-600 text-white' : 'bg-zinc-200 text-zinc-600'
              }`}>
                {isRemisionValidated ? '✓' : '1'}
              </span>
              <span>Escanear Remisión</span>
            </div>

            <ChevronRight className="w-3.5 h-3.5 text-zinc-300" />

            <div className={`flex items-center gap-2 ${
              currentStep === 'SCAN_UNITS' ? 'text-rose-600' : isAllUnitsValidated ? 'text-emerald-700' : 'text-zinc-400'
            }`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                isAllUnitsValidated ? 'bg-emerald-600 text-white' : currentStep === 'SCAN_UNITS' ? 'bg-rose-600 text-white' : 'bg-zinc-200 text-zinc-600'
              }`}>
                {isAllUnitsValidated ? '✓' : '2'}
              </span>
              <span>Escanear Unidades</span>
            </div>

            <ChevronRight className="w-3.5 h-3.5 text-zinc-300" />

            <div className={`flex items-center gap-2 ${
              currentStep === 'SUMMARY_SIGNATURE' || currentStep === 'SUCCESS' ? 'text-rose-600' : 'text-zinc-400'
            }`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                currentStep === 'SUCCESS' ? 'bg-emerald-600 text-white' : currentStep === 'SUMMARY_SIGNATURE' ? 'bg-rose-600 text-white' : 'bg-zinc-200 text-zinc-600'
              }`}>
                3
              </span>
              <span>Resumen & Firma</span>
            </div>
          </div>

          <div className="font-mono text-[11px] text-zinc-600">
            Progreso: <strong>{validatedCount}/{totalExpectedCount} u.</strong>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 text-xs space-y-4 bg-zinc-50/50">
          
          {/* ================================================================= */}
          {/* PASO 1: ESCANEAR REMISIÓN */}
          {/* ================================================================= */}
          {currentStep === 'SCAN_REMISION' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 block">
                      Paso 1 de 3 &bull; Validación Documental
                    </span>
                    <h4 className="text-sm font-black text-zinc-950">
                      Escanea el código QR de la Remisión Oficial
                    </h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white text-zinc-900 border border-zinc-300 shadow-2xs">
                    Esperada: {stop.remisionFolio}
                  </span>
                </div>

                {/* Laser Scanning Viewport Box */}
                <div className="relative h-44 bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800 flex flex-col items-center justify-center text-white shadow-inner">
                  {/* Camera Grid Overlay */}
                  <div className="absolute inset-4 border-2 border-dashed border-rose-500/50 rounded-xl pointer-events-none flex items-center justify-center">
                    <div className="w-16 h-16 border-2 border-rose-500 rounded-lg opacity-80" />
                  </div>

                  {/* Animated Laser Sweep Line */}
                  {isLaserScanning && (
                    <div className="absolute inset-x-0 top-0 h-1 bg-rose-500 shadow-[0_0_15px_#f43f5e] animate-pulse transition-all duration-300" />
                  )}

                  <QrCode className="w-10 h-10 text-rose-500 mb-2 animate-pulse" />
                  <span className="text-xs font-mono font-bold tracking-widest text-zinc-300">
                    APUNTA AL CÓDIGO QR DE LA REMISIÓN
                  </span>
                  <span className="text-[10px] text-zinc-500 mt-1">
                    Validación óptica directa Impresos RTM
                  </span>
                </div>

                {/* Manual Scan Input & Action */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={remisionInput}
                    onChange={(e) => setRemisionInput(e.target.value)}
                    placeholder={`Ingresa o escanea folio (ej. ${stop.remisionFolio})`}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-zinc-300 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && remisionInput) {
                        handleValidateRemision(remisionInput);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleValidateRemision(remisionInput || stop.remisionFolio)}
                    className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Scan className="w-4 h-4" />
                    <span>Escanear</span>
                  </button>
                </div>

                {/* Error Banner */}
                {remisionScanError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 font-bold animate-in shake">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{remisionScanError}</span>
                  </div>
                )}

                {/* Success Banner */}
                {isRemisionValidated && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between font-bold animate-in fade-in">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Remisión {stop.remisionFolio} validada correctamente</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep('SCAN_UNITS')}
                      className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-black hover:bg-emerald-700 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <span>Continuar</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Demo Simulator Quick Actions */}
              <div className="p-3.5 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-2">
                <span className="text-[10px] font-bold uppercase text-zinc-500 block">
                  Simulador Demo de Escaneo de Remisión
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRemisionInput(stop.remisionFolio);
                      handleValidateRemision(stop.remisionFolio);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold text-[11px] transition-colors cursor-pointer"
                  >
                    ✓ Escanear remisión correcta ({stop.remisionFolio})
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRemisionInput('REM-2026-9999');
                      handleValidateRemision('REM-2026-9999');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-900 font-bold text-[11px] transition-colors cursor-pointer"
                  >
                    ✗ Simular remisión incorrecta (REM-2026-9999)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* PASO 2: ESCANEAR UNIDADES (UIDs) */}
          {/* ================================================================= */}
          {currentStep === 'SCAN_UNITS' && (
            <div className="space-y-4 animate-in fade-in">
              
              {/* Progress and Counter Card */}
              <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 block">
                      Paso 2 de 3 &bull; Validación Individual de UIDs
                    </span>
                    <h4 className="text-sm font-black text-zinc-950">
                      Escaneo de Unidades Amparadas
                    </h4>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-base font-black text-zinc-950 block">
                      {validatedCount} de {totalExpectedCount} unidades
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {isAllUnitsValidated ? '100% completado' : `${totalExpectedCount - validatedCount} pendientes`}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      isAllUnitsValidated ? 'bg-emerald-500' : 'bg-rose-600'
                    }`}
                    style={{ width: `${Math.round((validatedCount / totalExpectedCount) * 100)}%` }}
                  />
                </div>

                {/* Scanner Input & Action */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={uidInput}
                    onChange={(e) => setUidInput(e.target.value)}
                    placeholder="Ingresa o escanea UID (ej. SC-UID-2026-000101)"
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-zinc-300 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && uidInput) {
                        handleScanUid(uidInput);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleScanUid(uidInput)}
                    className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Scan className="w-4 h-4" />
                    <span>Escanear</span>
                  </button>
                </div>

                {/* Status Messages */}
                {uidScanError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 font-bold animate-in shake">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{uidScanError}</span>
                  </div>
                )}

                {uidScanSuccessMessage && !uidScanError && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2 font-bold animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{uidScanSuccessMessage}</span>
                  </div>
                )}
              </div>

              {/* Items and UIDs Verification Table */}
              <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-zinc-950 tracking-wider block">
                    Detalle de Partidas & Estado de UIDs
                  </span>
                  <span className="text-[10px] text-zinc-500">
                    Remisión {stop.remisionFolio}
                  </span>
                </div>

                <div className="divide-y divide-zinc-100">
                  {stop.items && stop.items.length > 0 ? (
                    stop.items.map((it) => (
                      <div key={it.sku} className="py-2.5 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <div>
                            <strong className="text-zinc-950 block">{it.productName}</strong>
                            <span className="text-[10px] text-zinc-500 font-mono">SKU: {it.sku} &bull; {it.size}</span>
                          </div>
                          <span className="font-mono font-bold text-zinc-800">
                            {it.uids.filter((u) => validatedUids.includes(u)).length} / {it.quantity} validadas
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {it.uids.map((uid) => {
                            const isValid = validatedUids.includes(uid);
                            return (
                              <button
                                key={uid}
                                type="button"
                                onClick={() => handleScanUid(uid)}
                                className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                                  isValid 
                                    ? 'bg-emerald-50 border-emerald-400 text-emerald-900 shadow-2xs' 
                                    : 'bg-zinc-50 border-zinc-300 text-zinc-700 hover:border-zinc-400'
                                }`}
                              >
                                {isValid ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Clock className="w-3 h-3 text-zinc-400" />}
                                <span>{uid}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-wrap gap-1.5 py-2">
                      {allExpectedUids.map((uid) => {
                        const isValid = validatedUids.includes(uid);
                        return (
                          <button
                            key={uid}
                            type="button"
                            onClick={() => handleScanUid(uid)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                              isValid 
                                ? 'bg-emerald-50 border-emerald-400 text-emerald-900 shadow-2xs' 
                                : 'bg-zinc-50 border-zinc-300 text-zinc-700 hover:border-zinc-400'
                            }`}
                          >
                            {isValid ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Clock className="w-3 h-3 text-zinc-400" />}
                            <span>{uid}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Demo Simulator Buttons */}
              <div className="p-3.5 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-2">
                <span className="text-[10px] font-bold uppercase text-zinc-500 block">
                  Simulador de Escenarios de Escaneo
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleScanNextValidUid}
                    disabled={isAllUnitsValidated}
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold text-[11px] transition-colors cursor-pointer disabled:opacity-50"
                  >
                    ✓ Escanear siguiente UID válida
                  </button>

                  <button
                    type="button"
                    onClick={handleScanAllRemainingUids}
                    disabled={isAllUnitsValidated}
                    className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-[11px] transition-colors cursor-pointer disabled:opacity-50"
                  >
                    ⚡ Escanear todas las UIDs ({totalExpectedCount} u.)
                  </button>

                  <button
                    type="button"
                    onClick={() => handleScanUid('SC-UID-2026-999999')}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-900 font-bold text-[11px] transition-colors cursor-pointer"
                  >
                    ✗ UID ajena / no incluida
                  </button>

                  {validatedUids.length > 0 && (
                    <button
                      type="button"
                      onClick={() => handleScanUid(validatedUids[0])}
                      className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-[11px] transition-colors cursor-pointer"
                    >
                      ✗ UID duplicada
                    </button>
                  )}

                  {otherStopsUids.length > 0 && (
                    <button
                      type="button"
                      onClick={() => handleScanUid(otherStopsUids[0])}
                      className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-300 text-purple-900 font-bold text-[11px] transition-colors cursor-pointer"
                    >
                      ✗ UID de otra parada
                    </button>
                  )}
                </div>
              </div>

              {/* Bottom Actions for Step 2 */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsPartialDelivery(true);
                      setCurrentStep('SUMMARY_SIGNATURE');
                    }}
                    className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Registrar entrega parcial ({validatedCount}/{totalExpectedCount})
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowIncidentModal(true)}
                    className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-900 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Reportar incidencia
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentStep('SUMMARY_SIGNATURE')}
                  disabled={validatedCount === 0}
                  className={`px-6 py-2.5 rounded-2xl font-black text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer ${
                    isAllUnitsValidated 
                      ? 'bg-rose-600 hover:bg-rose-700 text-white' 
                      : 'bg-zinc-900 hover:bg-zinc-800 text-white'
                  }`}
                >
                  <span>Continuar a Resumen y Firma</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* ================================================================= */}
          {/* PASO 3: RESUMEN Y FIRMA DE ENTREGA */}
          {/* ================================================================= */}
          {currentStep === 'SUMMARY_SIGNATURE' && (
            <div className="space-y-4 animate-in fade-in">
              
              {/* Summary Metrics Card */}
              <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500 block">
                      Paso 3 de 3 &bull; Constancia de Entrega
                    </span>
                    <h4 className="text-sm font-black text-zinc-950">
                      Resumen de Validación de Entrega
                    </h4>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase border shadow-2xs bg-white ${
                    isAllUnitsValidated && !isPartialDelivery
                      ? 'border-emerald-500 text-emerald-800'
                      : 'border-amber-500 text-amber-800'
                  }`}>
                    {isAllUnitsValidated && !isPartialDelivery ? 'Lista para entregar' : 'Entrega parcial con faltante'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-0.5">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase block">Remisión:</span>
                    <strong className="text-rose-600 font-mono text-xs">{stop.remisionFolio}</strong>
                  </div>

                  <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-0.5">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase block">Esperadas:</span>
                    <strong className="text-zinc-900 font-mono text-xs">{totalExpectedCount} piezas</strong>
                  </div>

                  <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-0.5">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase block">Validadas:</span>
                    <strong className="text-emerald-700 font-mono text-xs">{validatedCount} piezas</strong>
                  </div>

                  <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-0.5">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase block">Diferencias:</span>
                    <strong className={`font-mono text-xs ${totalExpectedCount - validatedCount > 0 ? 'text-amber-700' : 'text-zinc-900'}`}>
                      {totalExpectedCount - validatedCount} pieza(s)
                    </strong>
                  </div>
                </div>
              </div>

              {/* Recipient & Observations Form */}
              <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-3">
                <span className="text-xs font-black uppercase text-zinc-950 tracking-wider block">
                  Datos de Recepción en Destino
                </span>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-zinc-700 block mb-1">
                      Nombre de quien recibe de conformidad:
                    </label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="Nombre completo del receptor"
                      className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-zinc-700 block mb-1">
                      Observaciones de entrega (opcional):
                    </label>
                    <textarea
                      value={deliveryObservations}
                      onChange={(e) => setDeliveryObservations(e.target.value)}
                      placeholder="Condiciones de entrega, notas de acceso o detalles relevantes..."
                      rows={2}
                      className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white resize-none"
                    />
                  </div>

                  {/* Visual Signature & Conformity Box */}
                  <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="conformity-check"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        className="w-4 h-4 accent-rose-600 rounded cursor-pointer"
                      />
                      <label htmlFor="conformity-check" className="text-[11px] font-bold text-zinc-900 cursor-pointer">
                        Mercancía recibida de conformidad en el domicilio especificado.
                      </label>
                    </div>

                    <div className="p-3 rounded-lg bg-white border border-dashed border-zinc-300 text-center text-zinc-500 space-y-1">
                      <span className="text-[10px] uppercase font-bold tracking-widest block text-zinc-400">
                        Constancia de Firma Electrónica
                      </span>
                      <p className="font-mono text-[11px] text-zinc-800 font-bold">
                        {recipientName || 'Receptor'} &bull; {route.driverName}
                      </p>
                      <span className="text-[9px] text-zinc-400 block font-mono">
                        Firma de recibido registrada en remisión oficial {stop.remisionFolio}
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Bottom CTAs */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep('SCAN_UNITS')}
                  className="px-4 py-2.5 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  ← Volver a escaneo
                </button>

                <button
                  type="button"
                  onClick={handleExecuteDeliveryConfirmation}
                  disabled={!acceptedTerms}
                  className="px-6 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirmar entrega de parada</span>
                </button>
              </div>

            </div>
          )}

          {/* ================================================================= */}
          {/* PASO 4: SUCCESS SCREEN */}
          {/* ================================================================= */}
          {currentStep === 'SUCCESS' && (
            <div className="p-6 rounded-3xl bg-white border border-emerald-200 shadow-sm text-center space-y-4 animate-in zoom-in-95">
              <div className="w-14 h-14 rounded-full bg-emerald-50 border-2 border-emerald-500 text-emerald-600 mx-auto flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-black text-zinc-950">
                  Entrega confirmada correctamente
                </h4>
                <p className="text-zinc-600 text-xs">
                  La parada #{stop.sequenceNumber} (<strong>{stop.destinationName}</strong>) ha sido registrada exitosamente.
                </p>
              </div>

              {/* Delivery Details Card */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-left space-y-2 font-mono text-[11px]">
                <div className="flex justify-between border-b border-zinc-200 pb-1.5">
                  <span className="text-zinc-500 font-sans">Remisión Oficial:</span>
                  <strong className="text-rose-600 font-bold">{stop.remisionFolio}</strong>
                </div>
                <div className="flex justify-between border-b border-zinc-200 pb-1.5">
                  <span className="text-zinc-500 font-sans">Recibió:</span>
                  <strong className="text-zinc-900 font-bold">{recipientName}</strong>
                </div>
                <div className="flex justify-between border-b border-zinc-200 pb-1.5">
                  <span className="text-zinc-500 font-sans">Chofer:</span>
                  <span className="text-zinc-800">{route.driverName} ({route.vehicleName})</span>
                </div>
                <div className="flex justify-between border-b border-zinc-200 pb-1.5">
                  <span className="text-zinc-500 font-sans">Unidades Entregadas:</span>
                  <strong className="text-emerald-700 font-bold">{validatedCount} de {totalExpectedCount} piezas</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 font-sans">Estado Resultante:</span>
                  <strong className="text-emerald-700 font-bold">
                    {route.type === 'Venta' ? 'Entregada al Cliente' : 'Entregado físicamente en destino'}
                  </strong>
                </div>
              </div>

              {route.type === 'Traspaso' && (
                <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-left text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Info className="w-4 h-4 text-purple-600" />
                    <span>Recepción Pendiente en Sucursal</span>
                  </div>
                  <p className="text-[11px] text-purple-800">
                    Las unidades se encuentran descargadas físicamente en el andén de la instalación. El inventario quedará disponible una vez que la sucursal confirme recepción en <strong>Mesa de Verificación &gt; Entradas</strong>.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeliveredRemisionModal(true)}
                  className="px-4 py-2.5 rounded-2xl bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-900 font-bold text-xs shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-rose-600" />
                  <span>Ver remisión entregada</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-black text-xs transition-all shadow-xs cursor-pointer"
                >
                  Volver a la ruta
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer (for Step 1) */}
        {currentStep === 'SCAN_REMISION' && (
          <div className="px-6 py-3.5 border-t border-zinc-200 flex items-center justify-between bg-white text-xs text-zinc-500">
            <span>Escaneo obligatorio de remisión antes de validar piezas físicas.</span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs transition-colors cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        )}

        {/* Incident Report Modal */}
        {showIncidentModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-zinc-200 space-y-4 text-xs animate-in zoom-in-95">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shadow-xs">
                <AlertTriangle className="w-5 h-5" />
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-black text-zinc-950">
                  Reportar Incidencia en Parada
                </h4>
                <p className="text-zinc-600 text-[11px]">
                  La incidencia quedará registrada en el folio de ruta y remisión.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-zinc-700 block mb-1">
                    Tipo de incidencia:
                  </label>
                  <select
                    value={incidentType}
                    onChange={(e) => setIncidentType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300 bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="Unidad no localizada">Unidad no localizada</option>
                    <option value="Cliente rechaza unidad">Cliente rechaza unidad</option>
                    <option value="Producto dañado">Producto dañado detectado en entrega</option>
                    <option value="Error de carga">Error de carga en CEDIS</option>
                    <option value="QR ilegible">Código QR / UID ilegible</option>
                    <option value="Cantidad incorrecta">Cantidad física incorrecta</option>
                    <option value="UID incorrecta">UID física no coincide con remisión</option>
                    <option value="Otro">Otro motivo</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-zinc-700 block mb-1">
                    Detalles y comentarios de la incidencia:
                  </label>
                  <textarea
                    value={incidentNotes}
                    onChange={(e) => setIncidentNotes(e.target.value)}
                    placeholder="Describe lo sucedido para el área de operaciones..."
                    rows={3}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white resize-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowIncidentModal(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowIncidentModal(false);
                    setIsPartialDelivery(true);
                    setCurrentStep('SUMMARY_SIGNATURE');
                  }}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition-all shadow-md cursor-pointer"
                >
                  Guardar y continuar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delivered Remisión Preview Modal */}
        {showDeliveredRemisionModal && lastDeliveredRemision && (
          <RemisionPreviewModal
            remision={lastDeliveredRemision}
            isOrderComplete={true}
            onClose={() => setShowDeliveredRemisionModal(false)}
          />
        )}

      </div>
    </ModalPortal>
  );
};
