import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  AlertTriangle,
  Building2,
  Calendar,
  User,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  FileText,
  FileCheck2,
  Package,
  Layers,
  Sparkles,
} from 'lucide-react';
import { SupplierMaster } from '../../../../data/mockSuppliersData';
import { IncomingInspection } from '../../../../data/mockCalidadData';
import { SupplierCorrectiveAction } from '../../../../data/mockSupplierQualityData';

interface Props {
  suppliers: SupplierMaster[];
  incomings: IncomingInspection[];
  initialSupplierId?: string;
  initialIncomingId?: string;
  onClose: () => void;
  onSaveAction: (action: SupplierCorrectiveAction) => void;
}

export const NuevaAccionCorrectivaModal: React.FC<Props> = ({
  suppliers,
  incomings,
  initialSupplierId,
  initialIncomingId,
  onClose,
  onSaveAction,
}) => {
  const [step, setStep] = useState<number>(1);

  // Form states
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>(
    initialSupplierId || (suppliers[0]?.id ?? 'sup-demo-bopp')
  );
  const [sourceType, setSourceType] = useState<'Incoming' | 'Auditoría' | 'Producción' | 'Reclamación'>('Incoming');
  const [selectedIncomingId, setSelectedIncomingId] = useState<string>(initialIncomingId || '');
  const [poFolio, setPoFolio] = useState<string>('OC-2026-1415');
  const [material, setMaterial] = useState<string>('Película BOPP Transparente 30 micras (12” x 3,000 m)');
  const [lotNumber, setLotNumber] = useState<string>('BOPP-260819-01 (RTM MP-260905-019)');

  // Step 2: Hallazgo
  const [defect, setDefect] = useState<string>('Espesor fuera de tolerancia (+16% sobre nominal: 34.8 µm vs 30.0 µm ± 1.5 µm)');
  const [severity, setSeverity] = useState<'Crítica' | 'Mayor' | 'Menor'>('Crítica');
  const [affectedQty, setAffectedQty] = useState<string>('10 bobinas (30,000 m lineales)');
  const [evidence, setEvidence] = useState<string>('Reporte micrométrico en 5 puntos de bobina y fotografía digital con testigo de calibración.');

  // Step 3: Contención
  const [containment, setContainment] = useState<
    'Material en HOLD' | 'Devolución a proveedor' | 'Reposición urgente' | 'Inspección reforzada 100%'
  >('Material en HOLD');
  const [containmentNotes, setContainmentNotes] = useState<string>(
    'Lote segregado físicamente en zona de Cuarentena con marchamo de seguridad rojo.'
  );

  // Step 4: Seguimiento
  const [rtmResponsible, setRtmResponsible] = useState<string>('Alicia Ramírez (Aseguramiento de Calidad)');
  const [supplierContact, setSupplierContact] = useState<string>('Ing. Carlos Mendoza (Jefe de Calidad)');
  const [commitmentDate, setCommitmentDate] = useState<string>(
    new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0]
  );
  const [rootCauseHypothesis, setRootCauseHypothesis] = useState<string>(
    'Desajuste en labio de extrusión durante cambio de resina virgen en planta de origen.'
  );

  // Auto-fill from incoming if changed
  const handleIncomingSelect = (incId: string) => {
    setSelectedIncomingId(incId);
    const inc = incomings.find((i) => i.id === incId);
    if (inc) {
      setPoFolio(inc.poFolio);
      setMaterial(inc.material);
      setLotNumber(`${inc.supplierLot} (RTM ${inc.rtmLot})`);
      setDefect(inc.notes || 'Desviación de especificación en recibo');
      const supMatch = suppliers.find((s) => s.tradeName.toLowerCase().includes(inc.supplier.toLowerCase()));
      if (supMatch) {
        setSelectedSupplierId(supMatch.id);
        const contact = supMatch.contacts.find((c) => c.isPrimary) || supMatch.contacts[0];
        if (contact) setSupplierContact(`${contact.name} (${contact.position})`);
      }
    }
  };

  const selectedSupplier = suppliers.find((s) => s.id === selectedSupplierId) || suppliers[0];

  const handleFinalSubmit = () => {
    const randomSeq = Math.floor(10 + Math.random() * 90);
    const newAction: SupplierCorrectiveAction = {
      id: `ACP-2026-00${randomSeq}`,
      supplierId: selectedSupplier.id,
      supplierName: selectedSupplier.tradeName,
      sourceType,
      sourceFolio: selectedIncomingId || 'INC-2026-REC',
      poFolio,
      material,
      lotNumber,
      defect,
      severity,
      affectedQty,
      evidence,
      containment,
      containmentNotes,
      rootCause: rootCauseHypothesis,
      commitmentDate,
      rtmResponsible,
      supplierContact,
      status: 'Detectada',
      createdAt: new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }) + ' · ' + new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
    };

    onSaveAction(newAction);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl border border-theme-subtle bg-theme-surface p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-theme-subtle">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-theme-main tracking-tight">
                Nueva Acción Correctiva de Proveedor (ACP)
              </h3>
              <p className="text-xs text-theme-muted">
                Emisión y escalamiento de no conformidad a proveedor con protocolo de contención
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-theme-muted hover:text-theme-main hover:bg-theme-muted/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Stepper */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          {[
            { num: 1, label: '1. Origen' },
            { num: 2, label: '2. Hallazgo' },
            { num: 3, label: '3. Contención' },
            { num: 4, label: '4. Seguimiento' },
          ].map((st) => (
            <div
              key={st.num}
              className={`p-2 rounded-xl border transition-all ${
                step === st.num
                  ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-black shadow-2xs'
                  : step > st.num
                  ? 'border-emerald-500/50 bg-emerald-50/40 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 font-bold'
                  : 'border-theme-subtle bg-theme-muted/20 text-theme-muted opacity-60'
              }`}
            >
              <span>{st.label}</span>
            </div>
          ))}
        </div>

        {/* STEP 1: Origen */}
        {step === 1 && (
          <div className="space-y-4 text-xs">
            <div>
              <label className="text-theme-muted block font-bold mb-1">Proveedor Involucrado:</label>
              <select
                value={selectedSupplierId}
                onChange={(e) => setSelectedSupplierId(e.target.value)}
                className="w-full rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 font-bold text-theme-main focus:ring-2 focus:ring-purple-500"
              >
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.tradeName} ({s.code || 'PROV'}) — RFC: {s.rfc}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-theme-muted block font-bold mb-1">Origen de Detección:</label>
                <select
                  value={sourceType}
                  onChange={(e) => setSourceType(e.target.value as any)}
                  className="w-full rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 text-theme-main font-semibold"
                >
                  <option value="Incoming">Inspección Incoming (Andén)</option>
                  <option value="Producción">En Proceso de Producción</option>
                  <option value="Auditoría">Auditoría Interna de Calidad</option>
                  <option value="Reclamación">Reclamación de Cliente Final</option>
                </select>
              </div>

              <div>
                <label className="text-theme-muted block font-bold mb-1">Vincular Inspección Incoming (Opcional):</label>
                <select
                  value={selectedIncomingId}
                  onChange={(e) => handleIncomingSelect(e.target.value)}
                  className="w-full rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 text-theme-main"
                >
                  <option value="">-- Sin vincular o manual --</option>
                  {incomings.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.id} · {i.supplier} ({i.status})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-theme-muted block font-bold mb-1">Orden de Compra (OC):</label>
                <input
                  type="text"
                  value={poFolio}
                  onChange={(e) => setPoFolio(e.target.value)}
                  className="w-full rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 font-mono font-bold text-theme-main"
                />
              </div>

              <div>
                <label className="text-theme-muted block font-bold mb-1">Lote del Proveedor & RTM:</label>
                <input
                  type="text"
                  value={lotNumber}
                  onChange={(e) => setLotNumber(e.target.value)}
                  className="w-full rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 font-mono text-theme-main"
                />
              </div>
            </div>

            <div>
              <label className="text-theme-muted block font-bold mb-1">Material / Insumo Afectado:</label>
              <input
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="w-full rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 font-semibold text-theme-main"
              />
            </div>
          </div>
        )}

        {/* STEP 2: Hallazgo */}
        {step === 2 && (
          <div className="space-y-4 text-xs">
            <div>
              <label className="text-theme-muted block font-bold mb-1">Descripción del Defecto / Desviación Técnica:</label>
              <textarea
                rows={3}
                value={defect}
                onChange={(e) => setDefect(e.target.value)}
                className="w-full rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 text-theme-main focus:ring-2 focus:ring-purple-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-theme-muted block font-bold mb-1">Severidad de la Incidencia:</label>
                <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                  {(['Crítica', 'Mayor', 'Menor'] as const).map((sev) => (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => setSeverity(sev)}
                      className={`p-2 rounded-xl border text-center font-bold transition-all ${
                        severity === sev
                          ? sev === 'Crítica'
                            ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300'
                            : sev === 'Mayor'
                            ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300'
                            : 'border-blue-500 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300'
                          : 'border-theme-subtle bg-theme-surface text-theme-muted hover:bg-theme-muted/30'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-theme-muted block font-bold mb-1">Cantidad Física Afectada:</label>
                <input
                  type="text"
                  value={affectedQty}
                  onChange={(e) => setAffectedQty(e.target.value)}
                  className="w-full rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 font-mono font-bold text-theme-main"
                />
              </div>
            </div>

            <div>
              <label className="text-theme-muted block font-bold mb-1">Evidencia Objetiva / Registro de Medición:</label>
              <input
                type="text"
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
                className="w-full rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 text-theme-main"
              />
            </div>
          </div>
        )}

        {/* STEP 3: Contención */}
        {step === 3 && (
          <div className="space-y-4 text-xs">
            <div>
              <label className="text-theme-muted block font-bold mb-1">Acción de Contención Inmediata:</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'Material en HOLD', label: 'Material en HOLD / Cuarentena', desc: 'Bloqueo físico y digital en almacén' },
                  { id: 'Devolución a proveedor', label: 'Devolución Total al Proveedor', desc: 'Embarque devuelto con flete por cobrar' },
                  { id: 'Reposición urgente', label: 'Reposición Urgente en 48h', desc: 'Sustitución de lote sin costo extra' },
                  { id: 'Inspección reforzada 100%', label: 'Inspección Reforzada 100%', desc: 'Muestreo total previo a uso en piso' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setContainment(item.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      containment === item.id
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 ring-2 ring-purple-600/30'
                        : 'border-theme-subtle bg-theme-surface text-theme-muted hover:bg-theme-muted/30'
                    }`}
                  >
                    <b className="block text-theme-main">{item.label}</b>
                    <span className="text-[11px] opacity-80">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-theme-muted block font-bold mb-1">Instrucciones de Disposición / Segregación:</label>
              <textarea
                rows={2}
                value={containmentNotes}
                onChange={(e) => setContainmentNotes(e.target.value)}
                className="w-full rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 text-theme-main"
              />
            </div>

            <div>
              <label className="text-theme-muted block font-bold mb-1">Hipótesis Preliminar de Causa Raíz (5 Porqués):</label>
              <textarea
                rows={2}
                value={rootCauseHypothesis}
                onChange={(e) => setRootCauseHypothesis(e.target.value)}
                className="w-full rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 text-theme-main"
              />
            </div>
          </div>
        )}

        {/* STEP 4: Seguimiento & Resumen */}
        {step === 4 && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-theme-muted block font-bold mb-1">Responsable RTM (Aseguramiento de Calidad):</label>
                <input
                  type="text"
                  value={rtmResponsible}
                  onChange={(e) => setRtmResponsible(e.target.value)}
                  className="w-full rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 font-bold text-theme-main"
                />
              </div>

              <div>
                <label className="text-theme-muted block font-bold mb-1">Contacto del Proveedor para Notificación:</label>
                <input
                  type="text"
                  value={supplierContact}
                  onChange={(e) => setSupplierContact(e.target.value)}
                  className="w-full rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 font-bold text-theme-main"
                />
              </div>
            </div>

            <div>
              <label className="text-theme-muted block font-bold mb-1">Fecha Compromiso de Respuesta (8D / ACP):</label>
              <input
                type="date"
                value={commitmentDate}
                onChange={(e) => setCommitmentDate(e.target.value)}
                className="w-full rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 font-mono font-bold text-theme-main"
              />
            </div>

            {/* Resumen del Folio que se emitirá */}
            <div className="rounded-2xl border border-purple-500/30 bg-purple-50/50 dark:bg-purple-950/30 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-300">
                  Resumen de la Acción Correctiva a Emitir
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-black bg-purple-600 text-white">
                  Folio: ACP-2026-AUTOPR
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-theme-main">
                <div>Proveedor: <b>{selectedSupplier.tradeName}</b></div>
                <div>Severidad: <b className="text-rose-600">{severity}</b></div>
                <div>Lote: <span className="font-mono">{lotNumber}</span></div>
                <div>Contención: <b>{containment}</b></div>
              </div>
              <p className="text-[11px] text-purple-900 dark:text-purple-300 pt-1 border-t border-purple-500/20">
                Al confirmar, el Scorecard del proveedor reflejará inmediatamente la acción abierta y se registrará en su historial de calidad.
              </p>
            </div>
          </div>
        )}

        {/* Footer Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-theme-subtle">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => prev - 1)}
              className="px-4 py-2 rounded-xl border border-theme-subtle text-xs font-bold text-theme-muted hover:bg-theme-muted/30 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-theme-subtle text-xs font-bold text-theme-muted hover:bg-theme-muted/30"
            >
              Cancelar
            </button>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => prev + 1)}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-600/20"
            >
              <span>Continuar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalSubmit}
              className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-600/30"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Emitir Acción Correctiva</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
