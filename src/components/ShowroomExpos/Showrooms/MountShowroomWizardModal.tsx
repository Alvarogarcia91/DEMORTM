import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Boxes, 
  Tag, 
  Scan, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  AlertTriangle, 
  Check, 
  Store, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { 
  ShowroomBayRecord, 
  MOCK_COMMERCIAL_SUGGESTIONS, 
  CommercialShowroomSuggestion 
} from '../../../data/mockShowroomExposData';
import { ModalPortal } from '../../common/ModalPortal';
import { StatusBadge } from '../../common/StatusBadge';

interface MountShowroomWizardModalProps {
  bay: ShowroomBayRecord;
  onClose: () => void;
  onConfirmMount: (bayId: string, sku: string, uid: string, operatorName: string) => void;
  onShowToast?: (msg: string) => void;
}

export const MountShowroomWizardModal: React.FC<MountShowroomWizardModalProps> = ({
  bay,
  onClose,
  onConfirmMount,
  onShowToast,
}) => {
  // Steps: 1: Sugerencia, 2: Artículo, 3: Unidad, 4: Recolección, 5: Montaje / Escaneo, 6: Confirmación
  const [step, setStep] = useState<number>(1);

  // Suggestions for this branch
  const branchSuggestions = MOCK_COMMERCIAL_SUGGESTIONS.filter(
    (s) => s.branchId === bay.branchId
  );
  const activeSuggestion: CommercialShowroomSuggestion = 
    branchSuggestions[0] || MOCK_COMMERCIAL_SUGGESTIONS[0];

  // Selected article & UID
  const [selectedSku, setSelectedSku] = useState<string>(activeSuggestion.sku);
  const [selectedUid, setSelectedUid] = useState<string>(activeSuggestion.suggestedUid.uid);
  const [selectedFromLocation, setSelectedFromLocation] = useState<string>(activeSuggestion.suggestedUid.location);
  const [operatorName, setOperatorName] = useState<string>('Carlos Mendoza (Piso de Venta)');

  // Pick Order Folio generated
  const [generatedPickFolio, setGeneratedPickFolio] = useState<string>(`OR-SHOW-2026-00${Math.floor(25 + Math.random() * 50)}`);

  // Scan states for step 5
  const [isScanningUid, setIsScanningUid] = useState<boolean>(false);
  const [isUidScanned, setIsUidScanned] = useState<boolean>(false);
  const [isScanningBay, setIsScanningBay] = useState<boolean>(false);
  const [isBayScanned, setIsBayScanned] = useState<boolean>(false);
  const [scanError, setScanError] = useState<string | null>(null);

  const availableArticlesList = [
    {
      sku: activeSuggestion.sku,
      name: activeSuggestion.productName,
      brand: activeSuggestion.brand,
      size: activeSuggestion.size,
      availableStock: activeSuggestion.availableStock,
      inExhibition: 0,
      committed: 4,
      rotation: activeSuggestion.rotationSpeed,
      reasons: activeSuggestion.reasons,
      uidOption: activeSuggestion.suggestedUid,
    },
    {
      sku: 'SC-RES-MNC-QS',
      name: 'Restonic Colchón Moon Cool Queen Size',
      brand: 'Restonic',
      size: 'Queen Size',
      availableStock: 14,
      inExhibition: 0,
      committed: 2,
      rotation: 'Alta',
      reasons: ['Crecimiento del +24% en cotizaciones.', '14 unidades en almacén.'],
      uidOption: { uid: 'SC-UID-2026-000184', location: 'A-B-03', ageDays: 32, reason: 'Excelente estado de empaque en nivel piso.' },
    },
    {
      sku: 'SC-SEA-CLB-KS',
      name: 'Sealy Colchón Crown Jewel King Size',
      brand: 'Sealy',
      size: 'King Size',
      availableStock: 8,
      inExhibition: 0,
      committed: 1,
      rotation: 'Media',
      reasons: ['Mayor ticket promedio King Size ($19,899 MXN).', 'Excelente para prueba de cliente.'],
      uidOption: { uid: 'SC-UID-2026-000186', location: 'A-C-02', ageDays: 38, reason: 'Unidad validada con control de calidad.' },
    },
    {
      sku: 'SC-SPA-REC-MAT',
      name: 'Spring Air Colchón Record Matrimonial',
      brand: 'Spring Air',
      size: 'Matrimonial',
      availableStock: 16,
      inExhibition: 1,
      committed: 5,
      rotation: 'Alta',
      reasons: ['Modelo tradicional de alta rotación.', '16 disponibles en almacén.'],
      uidOption: { uid: 'SC-UID-2026-000192', location: 'B-A-01', ageDays: 21, reason: 'Rotación estándar FIFO.' },
    },
  ];

  const currentArticleObj = availableArticlesList.find((a) => a.sku === selectedSku) || availableArticlesList[0];

  // Handler: Select Article
  const handleSelectArticle = (sku: string) => {
    setSelectedSku(sku);
    const art = availableArticlesList.find((a) => a.sku === sku);
    if (art) {
      setSelectedUid(art.uidOption.uid);
      setSelectedFromLocation(art.uidOption.location);
    }
  };

  // Step 5: Simulate UID Scan
  const handleSimulateUidScan = () => {
    setIsScanningUid(true);
    setScanError(null);
    setTimeout(() => {
      setIsScanningUid(false);
      setIsUidScanned(true);
    }, 450);
  };

  // Step 5: Simulate Wrong UID Scan
  const handleSimulateWrongUidScan = () => {
    setIsScanningUid(true);
    setScanError(null);
    setTimeout(() => {
      setIsScanningUid(false);
      setScanError('✕ La unidad escaneada (SC-UID-2026-000999) no corresponde a esta orden.');
    }, 400);
  };

  // Step 5: Simulate Bay QR Scan
  const handleSimulateBayScan = () => {
    setIsScanningBay(true);
    setScanError(null);
    setTimeout(() => {
      setIsScanningBay(false);
      setIsBayScanned(true);
    }, 450);
  };

  // Step 5: Simulate Wrong Bay QR Scan
  const handleSimulateWrongBayScan = () => {
    setIsScanningBay(true);
    setScanError(null);
    setTimeout(() => {
      setIsScanningBay(false);
      setScanError(`✕ El showroom escaneado (SHOW-08) no corresponde a esta orden. Se requiere ${bay.code}.`);
    }, 400);
  };

  // Step 6: Final Confirm
  const handleFinalConfirm = () => {
    onConfirmMount(bay.id, selectedSku, selectedUid, operatorName);
    if (onShowToast) {
      onShowToast(`Montaje completado en ${bay.code}. La unidad ${selectedUid} está ahora En exhibición.`);
    }
    onClose();
  };

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-150">
        <div className="relative w-full max-w-2xl bg-theme-surface rounded-3xl border border-theme-subtle shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-theme-subtle bg-theme-muted/30">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-theme-primary/10 text-theme-primary flex items-center justify-center border border-theme-primary/20">
                <Store className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-theme-main uppercase tracking-wider">
                  Montar Artículo en Showroom &bull; Paso {step} de 6
                </h3>
                <p className="text-[11px] text-theme-muted">
                  {bay.name} &bull; {bay.branchName}
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

          {/* Stepper Wizard Bar */}
          <div className="px-6 py-2.5 bg-theme-muted/10 border-b border-theme-subtle flex items-center justify-between text-[10px] font-bold overflow-x-auto gap-2">
            {[
              { num: 1, label: '1. Sugerencia' },
              { num: 2, label: '2. Artículo' },
              { num: 3, label: '3. Unidad' },
              { num: 4, label: '4. Recolección' },
              { num: 5, label: '5. Montaje' },
              { num: 6, label: '6. Confirmación' },
            ].map((st) => (
              <div
                key={st.num}
                className={`flex items-center gap-1 shrink-0 ${
                  step === st.num
                    ? 'text-theme-primary font-black'
                    : step > st.num
                    ? 'text-emerald-600 font-bold'
                    : 'text-theme-muted'
                }`}
              >
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] border ${
                  step === st.num
                    ? 'border-theme-primary bg-theme-primary-light text-theme-primary'
                    : step > st.num
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-theme-subtle text-theme-muted'
                }`}>
                  {step > st.num ? '✓' : st.num}
                </span>
                <span>{st.label}</span>
              </div>
            ))}
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-4">

            {/* ============================================================= */}
            {/* PASO 1: SUGERENCIA COMERCIAL INTELIGENTE */}
            {/* ============================================================= */}
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="p-3.5 rounded-2xl bg-white border border-zinc-200 space-y-1 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-zinc-900">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-black uppercase tracking-wider">
                      Sugerencia de Exhibición para {bay.branchName}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-600 leading-relaxed">
                    Sugerencia basada en inventario disponible, movimiento comercial y cobertura de exhibición.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {availableArticlesList.map((item, idx) => {
                    const isSelected = selectedSku === item.sku;
                    return (
                      <div
                        key={item.sku}
                        onClick={() => handleSelectArticle(item.sku)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-white border-zinc-900 shadow-md ring-1 ring-zinc-900'
                            : 'bg-theme-surface border-theme-subtle hover:border-theme-main shadow-2xs'
                        }`}
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold text-theme-primary">
                              {item.sku}
                            </span>
                            {idx === 0 && (
                              <StatusBadge variant="smart" label="Máxima recomendación (Score 96)" size="sm" />
                            )}
                          </div>
                          <strong className="text-xs sm:text-sm font-bold text-theme-main block">
                            {item.name}
                          </strong>
                          <div className="flex flex-wrap items-center gap-2 text-[10px] text-theme-muted">
                            <span>Disponibles en sucursal: <strong className="text-emerald-600 font-mono">{item.availableStock}</strong></span>
                            <span>&bull;</span>
                            <span>Rotación: <strong className="text-purple-600">{item.rotation}</strong></span>
                          </div>
                          <div className="space-y-0.5 pt-1">
                            {item.reasons.map((r, rIdx) => (
                              <div key={rIdx} className="text-[10px] text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-theme-primary shrink-0" />
                                <span>{r}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-2 border-t md:border-t-0 md:border-l border-theme-subtle pt-2 md:pt-0 md:pl-4">
                          <button
                            type="button"
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              isSelected
                                ? 'bg-theme-primary text-white shadow-xs'
                                : 'bg-theme-muted text-theme-main hover:bg-theme-subtle'
                            }`}
                          >
                            {isSelected ? 'Seleccionado' : 'Elegir'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ============================================================= */}
            {/* PASO 2: DETALLE DEL ARTÍCULO */}
            {/* ============================================================= */}
            {step === 2 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="p-4 rounded-2xl bg-theme-muted/30 border border-theme-subtle space-y-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-theme-primary uppercase">
                      {currentArticleObj.sku}
                    </span>
                    <strong className="text-base font-bold text-theme-main block">
                      {currentArticleObj.name}
                    </strong>
                    <span className="text-xs text-theme-muted">
                      Marca: {currentArticleObj.brand} &bull; Medida: {currentArticleObj.size}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-theme-subtle text-xs">
                    <div className="p-2.5 rounded-xl bg-theme-surface border border-theme-subtle space-y-0.5">
                      <span className="text-[10px] text-theme-muted uppercase font-bold">Disponibles</span>
                      <strong className="text-base font-mono font-black text-emerald-600 block">
                        {currentArticleObj.availableStock}
                      </strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-theme-surface border border-theme-subtle space-y-0.5">
                      <span className="text-[10px] text-theme-muted uppercase font-bold">En exhibición</span>
                      <strong className="text-base font-mono font-bold text-purple-600 block">
                        {currentArticleObj.inExhibition}
                      </strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-theme-surface border border-theme-subtle space-y-0.5">
                      <span className="text-[10px] text-theme-muted uppercase font-bold">Comprometidas</span>
                      <strong className="text-base font-mono font-bold text-amber-600 block">
                        {currentArticleObj.committed}
                      </strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-theme-surface border border-theme-subtle space-y-0.5">
                      <span className="text-[10px] text-theme-muted uppercase font-bold">Rotación</span>
                      <strong className="text-xs font-bold text-theme-main block pt-1">
                        {currentArticleObj.rotation}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-800 text-[11px] leading-relaxed">
                  Las unidades comprometidas o reservadas para pedidos de clientes quedan bloqueadas automáticamente y no pueden seleccionarse para montaje.
                </div>
              </div>
            )}

            {/* ============================================================= */}
            {/* PASO 3: SELECCIÓN DE UNIDAD FÍSICA (UID) */}
            {/* ============================================================= */}
            {step === 3 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="space-y-1">
                  <label className="text-xs font-black text-theme-main uppercase tracking-wider block">
                    Unidad física sugerida (Serializado por UID)
                  </label>
                  <p className="text-[11px] text-theme-muted">
                    Se prioriza la unidad disponible de mayor antigüedad en almacén cercana al recorrido.
                  </p>
                </div>

                {/* Suggested UID Card */}
                <div className="p-4 rounded-2xl bg-white border-2 border-zinc-900 shadow-md space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase bg-theme-primary text-white">
                      {currentArticleObj.uidOption.uid}
                    </span>
                    <StatusBadge variant="success" label="Sugerencia FIFO" size="sm" />
                  </div>
                  <strong className="text-xs font-bold text-zinc-900 block">
                    Ubicación actual en almacén: <span className="font-mono text-theme-primary font-black">{currentArticleObj.uidOption.location}</span> &bull; {currentArticleObj.uidOption.ageDays} días en almacén
                  </strong>
                  <p className="text-[11px] text-zinc-600">
                    Motivo: {currentArticleObj.uidOption.reason}
                  </p>
                </div>

                {/* Secondary UID Option */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block">
                    Otras unidades disponibles en la sucursal:
                  </span>
                  <div
                    onClick={() => {
                      setSelectedUid('SC-UID-2026-000299');
                      setSelectedFromLocation('A-B-04');
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                      selectedUid === 'SC-UID-2026-000299'
                        ? 'bg-white border-zinc-900 font-bold shadow-xs'
                        : 'bg-theme-surface border-theme-subtle text-theme-muted hover:border-theme-main'
                    }`}
                  >
                    <span className="font-mono font-bold">SC-UID-2026-000299</span>
                    <span>Ubicación: A-B-04 (19 días)</span>
                    <span className="text-[10px] text-emerald-600 font-bold">Disponible</span>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================= */}
            {/* PASO 4: ORDEN DE RECOLECCIÓN INTERNA */}
            {/* ============================================================= */}
            {step === 4 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                    <span className="text-[10px] font-mono font-bold text-theme-primary uppercase">
                      ORDEN DE RECOLECCIÓN DE SHOWROOM
                    </span>
                    <strong className="text-xs font-mono font-black text-zinc-900">
                      {generatedPickFolio}
                    </strong>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-zinc-500 block uppercase font-semibold">Tipo de Movimiento</span>
                      <strong className="text-zinc-900 font-bold">Montaje interno de Showroom</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 block uppercase font-semibold">Destino</span>
                      <strong className="text-zinc-900 font-bold">{bay.code} ({bay.name})</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 block uppercase font-semibold">Origen</span>
                      <strong className="text-zinc-900 font-bold">{bay.branchName} &bull; {selectedFromLocation}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 block uppercase font-semibold">Unidad asignada</span>
                      <strong className="font-mono text-theme-primary font-bold">{selectedUid}</strong>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-theme-main block">
                    Operador / Responsable de maniobra
                  </label>
                  <input
                    type="text"
                    value={operatorName}
                    onChange={(e) => setOperatorName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-theme-surface border border-theme-subtle text-xs text-theme-main focus:outline-none focus:border-theme-primary font-semibold"
                  />
                </div>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 text-[11px]">
                  <strong>Importante:</strong> Esta orden es un movimiento interno de sucursal. <strong>No</strong> se envía a Verificación de Salida ni requiere transporte vehicular. Aparecerá en <em>Recolecciones</em> de Showroom.
                </div>
              </div>
            )}

            {/* ============================================================= */}
            {/* PASO 5: EJECUTAR MONTAJE / ESCANEO (UID + QR SHOWROOM) */}
            {/* ============================================================= */}
            {step === 5 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="text-center space-y-1">
                  <h4 className="text-xs font-black text-theme-main uppercase tracking-wider">
                    Estación de Escaneo y Validación Física
                  </h4>
                  <p className="text-[11px] text-theme-muted">
                    Escanea primero la unidad física y después la bahía de showroom destino.
                  </p>
                </div>

                {/* Error Banner */}
                {scanError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 text-xs font-bold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{scanError}</span>
                  </div>
                )}

                {/* Scan Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Scan 1: UID */}
                  <div className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                    isUidScanned
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-900'
                      : 'bg-white border-zinc-200 text-zinc-900 shadow-2xs'
                  }`}>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                          1. Escanear UID
                        </span>
                        {isUidScanned && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      </div>
                      <strong className="text-xs font-mono font-black block">
                        {selectedUid}
                      </strong>
                      <span className="text-[10px] text-zinc-500 block">
                        {isUidScanned ? '✓ Unidad correcta verificada' : 'Pendiente de escanear'}
                      </span>
                    </div>

                    {!isUidScanned && (
                      <div className="space-y-1.5 pt-2">
                        <button
                          type="button"
                          onClick={handleSimulateUidScan}
                          disabled={isScanningUid}
                          className="w-full py-2 rounded-xl bg-theme-primary text-white text-xs font-bold hover:bg-theme-primary/90 transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Scan className="w-3.5 h-3.5" />
                          <span>{isScanningUid ? 'Validando...' : 'Escanear UID'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleSimulateWrongUidScan}
                          className="w-full py-1 text-[10px] text-zinc-500 hover:text-theme-primary font-semibold cursor-pointer"
                        >
                          Simular UID incorrecto
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Scan 2: Bay QR */}
                  <div className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                    !isUidScanned
                      ? 'opacity-50 pointer-events-none bg-theme-muted/20 border-theme-subtle'
                      : isBayScanned
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-900'
                      : 'bg-white border-zinc-200 text-zinc-900 shadow-2xs'
                  }`}>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                          2. Escanear Showroom
                        </span>
                        {isBayScanned && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      </div>
                      <strong className="text-xs font-mono font-black block">
                        {bay.code} ({bay.name})
                      </strong>
                      <span className="text-[10px] text-zinc-500 block">
                        {isBayScanned ? '✓ Bahía correcta verificada' : 'Esperando escaneo de bahía'}
                      </span>
                    </div>

                    {isUidScanned && !isBayScanned && (
                      <div className="space-y-1.5 pt-2">
                        <button
                          type="button"
                          onClick={handleSimulateBayScan}
                          disabled={isScanningBay}
                          className="w-full py-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Scan className="w-3.5 h-3.5" />
                          <span>{isScanningBay ? 'Verificando bahía...' : 'Escanear QR Showroom'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleSimulateWrongBayScan}
                          className="w-full py-1 text-[10px] text-zinc-500 hover:text-theme-primary font-semibold cursor-pointer"
                        >
                          Simular showroom incorrecto
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )}

            {/* ============================================================= */}
            {/* PASO 6: CONFIRMACIÓN Y RECEPCIÓN DE MONTAJE */}
            {/* ============================================================= */}
            {step === 6 && (
              <div className="space-y-4 animate-in fade-in duration-150 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-black text-theme-main uppercase tracking-wider">
                    ¡Montaje Listo para Confirmación!
                  </h4>
                  <p className="text-xs text-theme-muted">
                    La unidad ha sido validada físicamente y queda asignada a la bahía de exhibición.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-theme-muted/30 border border-theme-subtle text-left space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-theme-subtle">
                    <span className="text-theme-muted">Bahía Destino:</span>
                    <strong className="text-theme-main font-mono">{bay.code} &bull; {bay.branchName}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-theme-subtle">
                    <span className="text-theme-muted">Artículo:</span>
                    <strong className="text-theme-main">{currentArticleObj.name}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-theme-subtle">
                    <span className="text-theme-muted">UID Serializado:</span>
                    <strong className="font-mono text-theme-primary">{selectedUid}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-theme-subtle">
                    <span className="text-theme-muted">Nuevo Estado de UID:</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 border border-purple-500">
                      En exhibición (No disponible para venta)
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-theme-muted">Operador:</span>
                    <span className="text-theme-main font-semibold">{operatorName}</span>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Footer Navigation */}
          <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-theme-subtle bg-theme-muted/20">
            <button
              onClick={() => {
                if (step > 1) setStep(step - 1);
                else onClose();
              }}
              className="px-4 py-2 text-xs font-bold text-theme-muted hover:text-theme-main transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>{step === 1 ? 'Cancelar' : 'Anterior'}</span>
            </button>

            {step < 5 && (
              <button
                onClick={() => setStep(step + 1)}
                className="px-5 py-2.5 rounded-xl bg-theme-primary text-white text-xs font-bold hover:bg-theme-primary/90 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Continuar</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}

            {step === 5 && (
              <button
                onClick={() => setStep(6)}
                disabled={!isUidScanned || !isBayScanned}
                className="px-5 py-2.5 rounded-xl bg-theme-primary text-white text-xs font-bold hover:bg-theme-primary/90 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>Finalizar validación</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}

            {step === 6 && (
              <button
                onClick={handleFinalConfirm}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Confirmar montaje en showroom</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </ModalPortal>
  );
};
