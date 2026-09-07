import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Boxes,
  CheckCircle2,
  Clock,
  FileCheck,
  FileText,
  HelpCircle,
  Layers,
  PackageCheck,
  Printer,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Tag,
  Truck,
  Upload,
  Wrench,
  X,
} from 'lucide-react';
import { ModalPortal } from '../common/ModalPortal';
import {
  OPERATION_CHECKLISTS,
  QualityAuditItem,
  QualityStatus,
  BatchSample,
  NonConformance,
} from '../../data/mockCalidadData';
import { ProductionOrder } from '../../data/mockProduccionData';

interface Props {
  onClose: () => void;
  productionOrders: ProductionOrder[];
  onCompleteAudit: (audit: QualityAuditItem, effect: 'approve' | 'reject' | 'draft') => void;
  initialAuditType?: QualityAuditItem['type'];
  initialOpFolio?: string;
  onOpenLabelPreview?: (opFolio: string, client: string, part: string, lot: string) => void;
}

export const NuevaAuditoriaWizardModal: React.FC<Props> = ({
  onClose,
  productionOrders,
  onCompleteAudit,
  initialAuditType,
  initialOpFolio,
  onOpenLabelPreview,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(initialAuditType ? 2 : 1);
  const [auditType, setAuditType] = useState<QualityAuditItem['type']>(
    initialAuditType || 'Primera pieza'
  );

  // Paso 2: Origen seleccionado
  const [selectedOpFolio, setSelectedOpFolio] = useState<string>(
    initialOpFolio || productionOrders[0]?.folio || 'OP-2026-95250'
  );
  const [supplierName, setSupplierName] = useState('Avery Dennison');
  const [poFolio, setPoFolio] = useState('OC-2026-1402');
  const [incomingMaterial, setIncomingMaterial] = useState('BOPP Blanco Brillante 10”');
  const [incomingLot, setIncomingLot] = useState('AD-78219');
  const [remnantCode, setRemnantCode] = useState('BOB-REM-042');

  // Paso 3: Operación seleccionada
  const selectedOrder = productionOrders.find((o) => o.folio === selectedOpFolio) || productionOrders[0];

  const getDefaultOperation = (type: QualityAuditItem['type']): QualityAuditItem['operationType'] => {
    if (type === 'Incoming') return 'Incoming';
    if (type === 'Validación de remanente') return 'Remanente';
    if (type === 'Auditoría final') return 'Auditoría Final';
    if (selectedOrder?.area === 'Flexografía') return 'Impresión + Troquel';
    return 'Impresión';
  };

  const [operationType, setOperationType] = useState<QualityAuditItem['operationType']>(
    getDefaultOperation(initialAuditType || 'Primera pieza')
  );

  // Paso 4: Checklist interactivo
  const [checklistValues, setChecklistValues] = useState<
    Record<string, { status: 'Conforme' | 'No conforme' | 'N/A'; measured?: string; note?: string }>
  >({});

  // Paso 5: Baches y dictamen
  const [sampleSize, setSampleSize] = useState(selectedOrder?.quantity && selectedOrder.quantity > 5000 ? 13 : 3);
  const [defectsCount, setDefectsCount] = useState(0);
  const [auditNotes, setAuditNotes] = useState('');
  const [hasEvidence, setHasEvidence] = useState(false);

  // Carga de checklist base
  const currentChecklist = OPERATION_CHECKLISTS[operationType] || OPERATION_CHECKLISTS['Impresión'];

  const getChecklistState = (criterion: string, defaultMeasured: string) => {
    return checklistValues[criterion] || { status: 'Conforme', measured: defaultMeasured, note: '' };
  };

  const handleSetCriterion = (
    criterion: string,
    status: 'Conforme' | 'No conforme' | 'N/A',
    measured?: string
  ) => {
    setChecklistValues((prev) => ({
      ...prev,
      [criterion]: {
        ...prev[criterion],
        status,
        measured: measured !== undefined ? measured : prev[criterion]?.measured,
      },
    }));
  };

  const hasAnyRejection = Object.values(checklistValues).some((item) => item.status === 'No conforme');

  const handleExecuteDictamen = (effect: 'approve' | 'reject' | 'draft') => {
    const finalStatus: QualityStatus =
      effect === 'approve'
        ? auditType === 'Auditoría final'
          ? 'Liberado'
          : 'Conforme'
        : effect === 'reject'
        ? 'No conforme'
        : 'Pendiente';

    const checklistResults = currentChecklist.map(([criterion, spec, defaultMeasured]) => {
      const state = getChecklistState(criterion, defaultMeasured);
      return {
        criterion,
        spec,
        measured: state.measured || defaultMeasured,
        result: state.status,
        note: state.note,
      };
    });

    const isIncoming = auditType === 'Incoming';
    const isRemnant = auditType === 'Validación de remanente';

    const newAudit: QualityAuditItem = {
      id: `aud-${Date.now()}`,
      folio: `AUD-2026-${Math.floor(100 + Math.random() * 900)}`,
      type: auditType,
      origin: isIncoming ? poFolio : isRemnant ? remnantCode : selectedOpFolio,
      client: isIncoming ? supplierName : isRemnant ? 'Panasonic' : selectedOrder?.cliente || 'Cliente RTM',
      part: isIncoming ? incomingMaterial : selectedOrder?.partNumber || 'NA472050',
      revision: isIncoming ? incomingLot : selectedOrder?.revision || 'Rev A',
      area: isIncoming ? 'Almacén MP' : selectedOrder?.area || 'Flexografía',
      line: isIncoming ? 'Andén de Recibo' : selectedOrder?.machine || 'Prensa RTM',
      operator: isIncoming ? 'Almacén MP' : selectedOrder?.operator || 'Operador RTM',
      auditor: 'Alicia Ramírez (Calidad)',
      scheduledAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: finalStatus,
      waitingMinutes: 0,
      operationType,
      checklistResults,
      defectCount: effect === 'reject' ? defectsCount || 1 : 0,
      batches: [
        {
          id: `bch-${Date.now()}`,
          batchNumber: `BCH-${Math.floor(40000 + Math.random() * 9999)}`,
          producedQty: selectedOrder?.quantity || 1000,
          sampleSize,
          defectsFound: effect === 'reject' ? defectsCount || 1 : 0,
          status: effect === 'approve' ? 'Conforme' : 'No conforme',
          packageCount: 10,
          unitPerPackage: Math.round((selectedOrder?.quantity || 1000) / 10),
        },
      ],
      labelsAvailable: effect === 'approve',
      notes: auditNotes || `Auditoría ${auditType} ejecutada por Alicia Ramírez. Dictamen: ${finalStatus}.`,
    };

    onCompleteAudit(newAudit, effect);
  };

  return (
    <ModalPortal onClose={onClose}>
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-theme-subtle bg-theme-surface shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Header con pasos */}
        <div className="sticky top-0 z-20 border-b border-theme-subtle bg-theme-surface p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-theme-primary/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-theme-primary">
                WIZARD DE AUDITORÍA QA · PASO {step} DE 5
              </span>
              <span className="text-xs font-bold text-theme-main">
                {step === 1 && '1. Selección de Tipo de Auditoría'}
                {step === 2 && `2. Origen: ${auditType}`}
                {step === 3 && `3. Operación y Checklist`}
                {step === 4 && `4. Captura de Criterios y Mediciones`}
                {step === 5 && `5. Dictamen y Efecto en Producción`}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="rounded-xl p-2 text-theme-muted hover:bg-theme-muted/30"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Barra de progreso de pasos */}
          <div className="mt-3 flex gap-1.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  step >= s ? 'bg-theme-primary' : 'bg-theme-muted/20'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* PASO 1: ¿QUÉ DESEAS AUDITAR? */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-black text-theme-main">
                  ¿Qué tipo de auditoría deseas iniciar?
                </h3>
                <p className="text-xs text-theme-muted">
                  Selecciona la entidad o evento operativo a inspeccionar. Cada tipo carga su propio protocolo.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    type: 'Primera pieza' as const,
                    title: 'Primera Pieza en Máquina',
                    desc: 'Gate mandatorio antes de arrancar corrida de producción en Offset o Flexo.',
                    icon: ShieldCheck,
                    badge: 'Gate P0',
                  },
                  {
                    type: 'Control > 2 horas' as const,
                    title: 'Control en Proceso (> 2 horas)',
                    desc: 'Auditoría periódica obligatoria tras 2 horas de corrida continua.',
                    icon: Clock,
                    badge: 'Regla confirmada RTM',
                  },
                  {
                    type: 'Auditoría final' as const,
                    title: 'Auditoría Final / Liberación PT',
                    desc: 'Inspección por muestreo AQL previa a traspaso al Almacén de PT.',
                    icon: PackageCheck,
                    badge: 'Liberación de Lote',
                  },
                  {
                    type: 'Incoming' as const,
                    title: 'Incoming / Recibo Materia Prima',
                    desc: 'Inspección de bobinas, tintas y sustratos en andén contra CoA.',
                    icon: Truck,
                    badge: 'Entrada MP',
                  },
                  {
                    type: 'Validación de remanente' as const,
                    title: 'Validación de Remanente',
                    desc: 'Dictamen de aptitud de bobinas y pliegos sobrantes para reutilización.',
                    icon: Layers,
                    badge: 'Dictamen Calidad',
                  },
                  {
                    type: 'Preimpresión' as const,
                    title: 'Preimpresión / Herramental',
                    desc: 'Inspección de placas térmicas CTP, suajes y clichés flexográficos.',
                    icon: Wrench,
                    badge: 'Herramental',
                  },
                ].map((card) => {
                  const Icon = card.icon;
                  const isSelected = auditType === card.type;
                  return (
                    <button
                      key={card.type}
                      type="button"
                      onClick={() => setAuditType(card.type)}
                      className={`rounded-2xl border p-4 text-left transition-all ${
                        isSelected
                          ? 'border-2 border-theme-primary bg-theme-primary/5 shadow-xs'
                          : 'border-theme-subtle bg-theme-surface hover:border-theme-primary/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div
                          className={`rounded-xl p-2.5 ${
                            isSelected
                              ? 'bg-theme-primary text-white'
                              : 'bg-theme-muted/10 text-theme-primary'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="rounded-full bg-theme-muted/20 px-2 py-0.5 text-[9px] font-bold text-theme-muted">
                          {card.badge}
                        </span>
                      </div>
                      <b className="mt-3 block text-sm text-theme-main">{card.title}</b>
                      <p className="mt-1 text-xs text-theme-muted leading-relaxed">
                        {card.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* PASO 2: ORIGEN Y SELECCIÓN */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-black text-theme-main">
                  Selecciona el origen a auditar ({auditType})
                </h3>
                <p className="text-xs text-theme-muted">
                  Vincula la auditoría con la orden, lote de proveedor o remanente correspondiente.
                </p>
              </div>

              {auditType === 'Incoming' ? (
                <div className="grid gap-3 sm:grid-cols-2 rounded-2xl border border-theme-subtle bg-theme-surface p-4 text-xs">
                  <div>
                    <label className="font-bold text-theme-muted block mb-1">Proveedor:</label>
                    <input
                      value={supplierName}
                      onChange={(e) => setSupplierName(e.target.value)}
                      className="w-full rounded-xl border border-theme-subtle p-2.5 text-xs text-theme-main"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-theme-muted block mb-1">Orden de Compra / Recepción:</label>
                    <input
                      value={poFolio}
                      onChange={(e) => setPoFolio(e.target.value)}
                      className="w-full rounded-xl border border-theme-subtle p-2.5 font-mono text-xs text-theme-main"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-theme-muted block mb-1">Material / Sustrato:</label>
                    <input
                      value={incomingMaterial}
                      onChange={(e) => setIncomingMaterial(e.target.value)}
                      className="w-full rounded-xl border border-theme-subtle p-2.5 text-xs text-theme-main"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-theme-muted block mb-1">Lote de Proveedor:</label>
                    <input
                      value={incomingLot}
                      onChange={(e) => setIncomingLot(e.target.value)}
                      className="w-full rounded-xl border border-theme-subtle p-2.5 font-mono text-xs text-theme-main"
                    />
                  </div>
                </div>
              ) : auditType === 'Validación de remanente' ? (
                <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 text-xs space-y-3">
                  <div>
                    <label className="font-bold text-theme-muted block mb-1">Código de Bobina Remanente:</label>
                    <select
                      value={remnantCode}
                      onChange={(e) => setRemnantCode(e.target.value)}
                      className="w-full rounded-xl border border-theme-subtle p-2.5 font-mono text-xs text-theme-main"
                    >
                      <option value="BOB-REM-042">BOB-REM-042 · BOPP Blanco 10” (850 ft) · Lote RT031026</option>
                      <option value="BOB-REM-019">BOB-REM-019 · Papel Semigloss 7” (320 ft) · Lote SG-260814</option>
                    </select>
                  </div>
                  <div className="rounded-xl border border-theme-subtle bg-theme-muted/10 p-3 text-[11px] text-theme-muted">
                    <b>Nota de Política:</b> Alicia Ramírez autoriza si el remanente cumple con libre de polvo,
                    orilla uniforme y prueba de adhesión Tack conforme antes de ingresar a tiro inicial.
                  </div>
                </div>
              ) : (
                /* Selección de Orden de Producción */
                <div className="space-y-3">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-theme-muted block">
                    Seleccionar Orden de Producción Activa:
                  </label>
                  <div className="divide-y divide-theme-subtle rounded-2xl border border-theme-subtle bg-theme-surface overflow-hidden">
                    {productionOrders.slice(0, 5).map((ord) => (
                      <button
                        key={ord.id}
                        type="button"
                        onClick={() => setSelectedOpFolio(ord.folio)}
                        className={`flex w-full items-center justify-between p-3.5 text-left text-xs transition-all ${
                          selectedOpFolio === ord.folio
                            ? 'bg-theme-primary/10 border-l-4 border-theme-primary'
                            : 'hover:bg-theme-muted/20'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-theme-main">{ord.folio}</span>
                            <span className="rounded-md bg-theme-muted/20 px-1.5 py-0.5 text-[10px] font-bold text-theme-muted">
                              {ord.area}
                            </span>
                          </div>
                          <span className="text-theme-main font-bold block mt-0.5">{ord.cliente}</span>
                          <small className="text-theme-muted block">
                            {ord.partNumber} · {ord.revision} · Máquina: {ord.machine}
                          </small>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-theme-main">
                            {ord.quantity.toLocaleString()} pzas
                          </span>
                          <small className="block text-theme-muted">Operador: {ord.operator}</small>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PASO 3: OPERACIÓN Y CHECKLIST CONTEXTUAL */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-black text-theme-main">
                  Selecciona la operación a auditar
                </h3>
                <p className="text-xs text-theme-muted">
                  El sistema carga automáticamente el checklist específico según la operación técnica.
                </p>
              </div>

              {/* Selector de operación */}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 text-xs">
                {(
                  [
                    'Impresión',
                    'Corte',
                    'Doblado',
                    'Intercalado / Grapado',
                    'Impresión + Troquel',
                    'Conteo / Rebobinado',
                    'Incoming',
                    'Remanente',
                    'Auditoría Final',
                  ] as QualityAuditItem['operationType'][]
                ).map((op) => (
                  <button
                    key={op}
                    type="button"
                    onClick={() => setOperationType(op)}
                    className={`rounded-xl border p-3 font-bold text-left transition-all ${
                      operationType === op
                        ? 'border-theme-primary bg-theme-primary/10 text-theme-primary shadow-xs'
                        : 'border-theme-subtle bg-theme-surface text-theme-muted hover:text-theme-main'
                    }`}
                  >
                    {op}
                  </button>
                ))}
              </div>

              {/* Preview del checklist cargado */}
              <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-theme-muted block">
                  Checklist Técnico Asignado ({currentChecklist.length} criterios):
                </span>
                <div className="divide-y divide-theme-subtle text-xs">
                  {currentChecklist.map(([criterion, spec]) => (
                    <div key={criterion} className="py-2 flex items-center justify-between">
                      <span className="font-bold text-theme-main">{criterion}</span>
                      <span className="text-theme-muted font-mono text-[11px]">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PASO 4: CAPTURA DE CRITERIOS Y MEDICIONES */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-theme-main">
                    Captura de Criterios: {operationType}
                  </h3>
                  <p className="text-xs text-theme-muted">
                    Registra la conformidad de cada punto y captura lecturas dimensionales o espectrales.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const allOk: any = {};
                    currentChecklist.forEach(([c, s, d]) => {
                      allOk[c] = { status: 'Conforme', measured: d, note: '' };
                    });
                    setChecklistValues(allOk);
                  }}
                  className="rounded-xl border border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100"
                >
                  ✓ Marcar todo conforme
                </button>
              </div>

              {/* Tabla de criterios */}
              <div className="divide-y divide-theme-subtle rounded-2xl border border-theme-subtle bg-theme-surface">
                {currentChecklist.map(([criterion, spec, defaultMeasured]) => {
                  const state = getChecklistState(criterion, defaultMeasured);
                  return (
                    <div key={criterion} className="p-3.5 space-y-2 text-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <b className="text-theme-main">{criterion}</b>
                          <small className="block text-theme-muted font-mono">
                            Especificación: {spec}
                          </small>
                        </div>
                        <div className="flex gap-1">
                          {(['Conforme', 'No conforme', 'N/A'] as const).map((st) => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => handleSetCriterion(criterion, st)}
                              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all ${
                                state.status === st
                                  ? st === 'Conforme'
                                    ? 'bg-emerald-600 text-white'
                                    : st === 'No conforme'
                                    ? 'bg-rose-600 text-white'
                                    : 'bg-zinc-700 text-white'
                                  : 'border border-theme-subtle bg-theme-surface text-theme-muted hover:text-theme-main'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Campo para valor medido */}
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-theme-muted text-[11px] shrink-0">Valor medido:</span>
                        <input
                          type="text"
                          value={state.measured || defaultMeasured}
                          onChange={(e) => handleSetCriterion(criterion, state.status, e.target.value)}
                          className="w-48 rounded-lg border border-theme-subtle bg-theme-surface px-2.5 py-1 font-mono text-xs text-theme-main"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Evidencia fotográfica */}
              <div className="flex items-center justify-between rounded-xl border border-dashed border-theme-subtle p-3 text-xs">
                <div className="flex items-center gap-2 text-theme-muted">
                  <Upload className="h-4 w-4" />
                  <span>
                    {hasEvidence
                      ? 'Evidencia fotográfica adjunta: inspeccion_qa_07sep.jpg'
                      : 'Evidencia fotográfica digital (Opcional)'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setHasEvidence(!hasEvidence)}
                  className="rounded-lg border border-theme-subtle px-3 py-1 text-[11px] font-bold text-theme-main hover:bg-theme-muted/30"
                >
                  {hasEvidence ? 'Quitar foto' : 'Adjuntar foto demo'}
                </button>
              </div>
            </div>
          )}

          {/* PASO 5: DICTAMEN Y EFECTO REAL */}
          {step === 5 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-black text-theme-main">
                  Dictamen Final y Efecto Operativo
                </h3>
                <p className="text-xs text-theme-muted">
                  Emite la resolución de Calidad. Este dictamen actualiza directamente el estado de Producción, Almacén o Cuarentena.
                </p>
              </div>

              {/* Muestreo y Baches (Sección 14 de auditoría) */}
              <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-theme-subtle pb-2">
                  <span className="font-bold text-theme-main uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Boxes className="h-4 w-4 text-theme-primary" />
                    Inspección por Muestreo AQL / Baches:
                  </span>
                  <span className="font-mono text-theme-muted">AQL 0.65 / Nivel II</span>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <span className="text-theme-muted block">Lote Total:</span>
                    <b className="text-base font-mono text-theme-main">
                      {selectedOrder?.quantity.toLocaleString() || '1,000'} pzas
                    </b>
                  </div>
                  <div>
                    <span className="text-theme-muted block">Tamaño Muestra (pzas):</span>
                    <input
                      type="number"
                      value={sampleSize}
                      onChange={(e) => setSampleSize(parseInt(e.target.value) || 3)}
                      className="w-24 rounded-lg border border-theme-subtle p-1 font-mono font-bold text-theme-main"
                    />
                  </div>
                  <div>
                    <span className="text-theme-muted block">Defectos Encontrados:</span>
                    <input
                      type="number"
                      value={defectsCount}
                      onChange={(e) => setDefectsCount(parseInt(e.target.value) || 0)}
                      className="w-24 rounded-lg border border-theme-subtle p-1 font-mono font-bold text-theme-main"
                    />
                  </div>
                </div>
              </div>

              {/* Resumen del Dictamen */}
              {hasAnyRejection || defectsCount > 0 ? (
                <div className="rounded-2xl border border-rose-400 bg-rose-50/60 dark:bg-rose-950/30 p-4 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-rose-900 dark:text-rose-200">
                    <ShieldAlert className="h-5 w-5 text-rose-600 shrink-0" />
                    <b className="text-sm">⚠ RECHAZO / NO CONFORME DETECTADO</b>
                  </div>
                  <p className="text-rose-950 dark:text-rose-100">
                    Se detectaron no conformidades en el checklist o defectos en el muestreo. Al rechazar, la OP
                    pasará inmediatamente a estado <b>Detenida</b> en Piso de Planta y se generará un folio de{' '}
                    <b>MNC (Material No Conforme)</b> en HOLD.
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/30 p-4 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                    <b className="text-sm">✓ AUDITORíA LISTA PARA APROBACIóN</b>
                  </div>
                  <p className="text-emerald-950 dark:text-emerald-100">
                    Todos los criterios están conformes. Al aprobar,{' '}
                    {auditType === 'Primera pieza'
                      ? 'Producción quedará automáticamente habilitada para arrancar la corrida.'
                      : auditType === 'Auditoría final'
                      ? 'la OP pasará a estado Liberada y quedará disponible para Almacén de PT.'
                      : 'el material quedará formalmente avalado en sistema.'}
                  </p>
                </div>
              )}

              {/* Observaciones Finales */}
              <div className="space-y-1.5 text-xs">
                <label className="font-bold text-theme-muted block uppercase tracking-wider text-[10px]">
                  Notas y Dictamen del Auditor (Alicia Ramírez):
                </label>
                <textarea
                  rows={2}
                  value={auditNotes}
                  onChange={(e) => setAuditNotes(e.target.value)}
                  placeholder="Detalles sobre liberación, especificaciones o causa raíz..."
                  className="w-full rounded-xl border border-theme-subtle bg-theme-surface p-3 text-xs text-theme-main focus:border-theme-primary focus:outline-none"
                />
              </div>

              {/* Botones de Dictamen Grande */}
              <div className="grid gap-3 sm:grid-cols-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleExecuteDictamen('approve')}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 p-4 text-sm font-black text-white shadow-md hover:bg-emerald-700 transition-all hover:scale-[1.01]"
                >
                  <CheckCircle2 className="h-5 w-5" />
                  {auditType === 'Auditoría final'
                    ? 'Aprobar y Liberar Lote PT'
                    : 'Aprobar Auditoría (Conforme)'}
                </button>

                <button
                  type="button"
                  onClick={() => handleExecuteDictamen('reject')}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-rose-600 p-4 text-sm font-black text-white shadow-md hover:bg-rose-700 transition-all hover:scale-[1.01]"
                >
                  <AlertTriangle className="h-5 w-5" />
                  Rechazar / No Conforme (Mandar a HOLD)
                </button>
              </div>
            </div>
          )}

          {/* Navegación entre pasos */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-theme-subtle pt-5 mt-6">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => (prev - 1) as any)}
                className="flex items-center gap-1.5 rounded-xl border border-theme-subtle px-4 py-2 text-xs font-bold text-theme-main hover:bg-theme-muted/30"
              >
                <ArrowLeft className="h-4 w-4" /> Anterior
              </button>
            ) : (
              <div />
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-theme-subtle px-4 py-2 text-xs font-bold text-theme-muted hover:text-theme-main"
              >
                Cancelar
              </button>
              {step < 5 ? (
                <button
                  type="button"
                  onClick={() => setStep((prev) => (prev + 1) as any)}
                  className="flex items-center gap-1.5 rounded-xl bg-theme-primary px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-theme-primary/90"
                >
                  Siguiente <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleExecuteDictamen('draft')}
                  className="rounded-xl border border-theme-subtle px-4 py-2 text-xs font-bold text-theme-main hover:bg-theme-muted/30"
                >
                  Guardar como Borrador
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};
