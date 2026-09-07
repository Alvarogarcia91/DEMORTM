import React, { useState } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Layers,
  Shield,
  Sparkles,
  X,
} from 'lucide-react';
import {
  DEFAULT_18_PPAP_ELEMENTS,
  PpapCase,
  PpapChecklistItem,
  PpapProcessArea,
  PpapSubmissionLevel,
  PpapSubmissionReason,
} from '../../../data/mockPpapData';
import { ModalPortal } from '../../common/ModalPortal';

interface Props {
  onClose: () => void;
  onCreateCase: (newCase: PpapCase) => void;
}

export const PpapCreateWizardModal: React.FC<Props> = ({ onClose, onCreateCase }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Paso 1: Parte y Cliente
  const [client, setClient] = useState('Panasonic Industrial Devices');
  const [partNumber, setPartNumber] = useState('');
  const [partName, setPartName] = useState('');
  const [revision, setRevision] = useState('Rev A');
  const [processArea, setProcessArea] = useState<PpapProcessArea>('Flexografía');
  const [family, setFamily] = useState('Etiquetas Industriales');

  // Paso 2: Alcance y Nivel
  const [submissionReason, setSubmissionReason] = useState<PpapSubmissionReason>('Nueva parte');
  const [submissionLevel, setSubmissionLevel] = useState<PpapSubmissionLevel>(3);

  // Paso 3: Elementos Requeridos (Checklist interactivo)
  const [selectedElements, setSelectedElements] = useState<number[]>([
    1, 2, 5, 6, 7, 8, 9, 10, 11, 13, 14, 18,
  ]);

  // Paso 4: Responsable y Fecha Objetivo
  const [owner, setOwner] = useState('Alicia Ramírez (Aseguramiento de Calidad)');
  const [targetDate, setTargetDate] = useState('30 Sep 2026');
  const [clientContact, setClientContact] = useState('');

  const toggleElement = (num: number) => {
    setSelectedElements((prev) =>
      prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num].sort((a, b) => a - b)
    );
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();

    const pNum = partNumber.trim() || 'PARTE-DEMO-01';
    const pName = partName.trim() || 'Etiqueta de Validación Técnica';

    const checklist: PpapChecklistItem[] = DEFAULT_18_PPAP_ELEMENTS.map((el) => {
      const isSelected = selectedElements.includes(el.elementNumber);
      return {
        id: `ck-${Date.now()}-${el.elementNumber}`,
        elementNumber: el.elementNumber,
        name: el.name,
        humanLabel: el.humanLabel,
        status: isSelected ? (el.elementNumber === 1 ? 'Completo' : 'Pendiente') : 'No aplica',
        documentRef: isSelected && el.elementNumber === 1 ? `DIB-${pNum}.pdf` : undefined,
        lastReviewDate: isSelected && el.elementNumber === 1 ? 'Hoy' : undefined,
      };
    });

    const newCase: PpapCase = {
      id: `ppap-${Date.now()}`,
      folio: `PPAP-2026-00${Math.floor(Math.random() * 90) + 10}`,
      client,
      clientCode: 'CL-DEMO',
      partNumber: pNum,
      partName: pName,
      revision,
      processArea,
      family,
      submissionLevel,
      submissionReason,
      status: 'En preparación',
      completionPercentage: 15,
      targetDate,
      lastUpdated: 'Hoy · Reciente',
      owner,
      clientContact: clientContact.trim() || undefined,
      pswStatus: 'Pendiente de firma',
      checklist,
      documents: [
        {
          id: `doc-${Date.now()}`,
          name: `Dibujo y Especificación ${pNum}`,
          code: `DWG-${pNum}`,
          revision,
          category: 'Dibujo y Especificaciones',
          status: 'Aprobado',
          responsible: owner,
          date: 'Hoy',
          fileSize: '1.5 MB',
        },
      ],
      dimensionalResults: [
        {
          id: `dim-${Date.now()}`,
          itemNumber: 1,
          characteristic: 'Dimensión Principal de Contorno',
          specification: '50.00 ± 0.20 mm',
          nominal: 50.0,
          tolerance: '±0.20',
          measured: 50.04,
          unit: 'mm',
          instrument: 'Vernier Mitutoyo Calibrado',
          sampleSize: 10,
          inSpec: true,
        },
      ],
      colorVisualResults: [
        {
          id: `col-${Date.now()}`,
          parameter: 'Inspección Visual y Calce',
          specification: 'Registro conforme sin descalce',
          measured: 'Conforme',
          instrument: 'Lupa 20x',
          result: 'Conforme',
        },
      ],
      pfmeaRows: [
        {
          id: `pfm-${Date.now()}`,
          stepNumber: 10,
          processStep: 'Alimentación de material',
          failureMode: 'Desvío de orilla de banda',
          failureEffect: 'Desalineación visual',
          severity: 5,
          potentialCause: 'Sensor descalibrado',
          occurrence: 2,
          currentControls: 'Guía electrónica',
          detection: 2,
          rpn: 20,
          actionPriority: 'Baja',
          recommendedAction: 'Setup estándar de operador',
          responsible: owner,
          status: 'En proceso',
        },
      ],
      controlPlanItems: [
        {
          id: `cp-${Date.now()}`,
          stepNumber: 10,
          operation: 'Prensa de Impresión',
          machine: processArea === 'Flexografía' ? 'Mark Andy P5' : 'Heidelberg SM52',
          characteristic: 'Registro y tonalidad',
          classification: 'Crítica',
          specification: 'Delta E ≤ 1.50',
          measurementMethod: 'Espectrofotometría',
          sampleSize: '3 lecturas',
          frequency: 'Por rollo / pila',
          instrument: 'X-Rite eXact',
          responsible: 'Operador / Calidad',
          reactionPlan: 'Ajuste de parámetros y retención si aplica',
        },
      ],
      validationSample: {
        opFolio: 'OP-PENDIENTE',
        runDate: 'Por programar',
        producedQuantity: 0,
        sampleQuantity: 100,
        inspectedBy: owner,
        releaseStatus: 'Pendiente de liberación',
        lotNumber: 'LOTE-PILOTO',
        coaFolio: 'COA-PENDIENTE',
        notes: 'Muestra a obtener de la primera corrida piloto industrial.',
      },
      approvals: [
        {
          id: `app-1`,
          role: 'Ingeniería de Proceso',
          humanTitle: 'Validación Técnica',
          assignedTo: 'Roberto Morales',
          status: 'Pendiente',
        },
        {
          id: `app-2`,
          role: 'Aseguramiento de Calidad',
          humanTitle: 'Revisión Documental y PSW',
          assignedTo: owner,
          status: 'Pendiente',
        },
        {
          id: `app-3`,
          role: 'Calidad Cliente',
          humanTitle: 'Dictamen Formal del Cliente',
          assignedTo: clientContact.trim() || 'SQA Cliente',
          status: 'Pendiente',
        },
      ],
      history: [
        {
          id: `h-${Date.now()}`,
          date: 'Hoy · Reciente',
          user: owner,
          action: 'Expediente Creado',
          details: `Apertura de PPAP Nivel ${submissionLevel} para ${client}.`,
          badgeTone: 'primary',
        },
      ],
    };

    onCreateCase(newCase);
  };

  return (
    <ModalPortal onClose={onClose}>
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-theme-subtle bg-theme-surface shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Header del Wizard */}
        <div className="flex items-center justify-between border-b border-theme-subtle p-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-theme-primary">
              NUEVO EXPEDIENTE PPAP & CORE TOOLS · PASO {step} DE 4
            </span>
            <h3 className="text-xl font-black text-theme-main">
              {step === 1 && 'Parte, Cliente y Proceso'}
              {step === 2 && 'Motivo de Envío y Nivel PPAP'}
              {step === 3 && 'Elementos y Evidencias Requeridas'}
              {step === 4 && 'Responsable y Fecha Meta'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-theme-subtle p-2 text-theme-muted hover:bg-theme-muted/30"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Formulario por pasos */}
        <form onSubmit={handleFinish}>
          <div className="p-6 space-y-4 text-xs">
            {/* PASO 1: Parte y Cliente */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="font-bold text-theme-main block mb-1">Cliente Solicitante</label>
                  <select
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    className="w-full rounded-xl border border-theme-subtle bg-theme-base p-2.5 font-semibold text-theme-main focus:outline-hidden"
                  >
                    <option value="Panasonic Industrial Devices">Panasonic Industrial Devices</option>
                    <option value="TRICO Components México">TRICO Components México</option>
                    <option value="Stanley Black & Decker">Stanley Black & Decker</option>
                    <option value="Pentair Water México">Pentair Water México</option>
                    <option value="Tyco Electronics">Tyco Electronics</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-theme-main block mb-1">Número de Parte</label>
                    <input
                      type="text"
                      placeholder="Ej. 526412 o NA472050"
                      value={partNumber}
                      onChange={(e) => setPartNumber(e.target.value)}
                      className="w-full rounded-xl border border-theme-subtle bg-theme-base p-2.5 font-mono text-theme-main focus:outline-hidden"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-theme-main block mb-1">Revisión</label>
                    <input
                      type="text"
                      placeholder="Ej. Rev A o Rev 02"
                      value={revision}
                      onChange={(e) => setRevision(e.target.value)}
                      className="w-full rounded-xl border border-theme-subtle bg-theme-base p-2.5 font-bold text-theme-main focus:outline-hidden"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-theme-main block mb-1">Descripción de la Parte</label>
                  <input
                    type="text"
                    placeholder="Ej. Etiqueta autoadherible de advertencia técnica"
                    value={partName}
                    onChange={(e) => setPartName(e.target.value)}
                    className="w-full rounded-xl border border-theme-subtle bg-theme-base p-2.5 text-theme-main focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-theme-main block mb-1">Proceso de Planta</label>
                    <select
                      value={processArea}
                      onChange={(e) => setProcessArea(e.target.value as PpapProcessArea)}
                      className="w-full rounded-xl border border-theme-subtle bg-theme-base p-2.5 font-semibold text-theme-main focus:outline-hidden"
                    >
                      <option value="Flexografía">Flexografía</option>
                      <option value="Offset">Offset</option>
                      <option value="Acabados">Acabados</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-theme-main block mb-1">Familia de Producto</label>
                    <input
                      type="text"
                      value={family}
                      onChange={(e) => setFamily(e.target.value)}
                      className="w-full rounded-xl border border-theme-subtle bg-theme-base p-2.5 text-theme-main focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* PASO 2: Alcance y Nivel */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="font-bold text-theme-main block mb-1">Motivo de Sumisión</label>
                  <select
                    value={submissionReason}
                    onChange={(e) => setSubmissionReason(e.target.value as PpapSubmissionReason)}
                    className="w-full rounded-xl border border-theme-subtle bg-theme-base p-2.5 font-semibold text-theme-main focus:outline-hidden"
                  >
                    <option value="Nueva parte">Nueva parte</option>
                    <option value="Cambio de ingeniería / revisión">Cambio de ingeniería / revisión</option>
                    <option value="Cambio de proceso">Cambio de proceso</option>
                    <option value="Cambio de material">Cambio de material</option>
                    <option value="Revalidación anual">Revalidación anual</option>
                    <option value="Otro requerimiento de cliente">Otro requerimiento de cliente</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-theme-main block mb-1.5">
                    Nivel de Presentación PPAP (AIAG)
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {([1, 2, 3, 4, 5] as PpapSubmissionLevel[]).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setSubmissionLevel(lvl)}
                        className={`rounded-2xl border p-3 text-center transition-all ${
                          submissionLevel === lvl
                            ? 'border-theme-primary bg-theme-primary text-white shadow-xs font-black'
                            : 'border-theme-subtle bg-theme-base text-theme-muted hover:text-theme-main'
                        }`}
                      >
                        <span className="block text-sm">Nivel {lvl}</span>
                        <span className="text-[9px] opacity-80">
                          {lvl === 1 ? 'Solo PSW' : lvl === 3 ? 'Estándar' : lvl === 5 ? 'En sitio' : 'Parcial'}
                        </span>
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-theme-muted mt-2">
                    <b>Nivel 3 (Recomendado):</b> Requiere el paquete completo de los 18 elementos con muestras y PSW formal firmado.
                  </p>
                </div>
              </div>
            )}

            {/* PASO 3: Elementos Requeridos */}
            {step === 3 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-theme-muted">
                    Selecciona los elementos que compondrán este expediente para el demo:
                  </span>
                  <span className="font-mono font-bold text-theme-primary">
                    {selectedElements.length} elementos seleccionados
                  </span>
                </div>

                <div className="max-h-64 overflow-y-auto space-y-1.5 rounded-2xl border border-theme-subtle p-3 bg-theme-base">
                  {DEFAULT_18_PPAP_ELEMENTS.map((el) => {
                    const isChecked = selectedElements.includes(el.elementNumber);
                    return (
                      <label
                        key={el.elementNumber}
                        className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-theme-muted/20 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleElement(el.elementNumber)}
                          className="rounded border-theme-subtle text-theme-primary focus:ring-0"
                        />
                        <span className="font-mono text-theme-muted w-6 text-right">#{el.elementNumber}</span>
                        <span className="font-bold text-theme-main">{el.humanLabel}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* PASO 4: Responsable y Fecha */}
            {step === 4 && (
              <div className="space-y-4">
                <div>
                  <label className="font-bold text-theme-main block mb-1">Responsable en Planta</label>
                  <input
                    type="text"
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    className="w-full rounded-xl border border-theme-subtle bg-theme-base p-2.5 font-semibold text-theme-main focus:outline-hidden"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-theme-main block mb-1">Fecha Meta de Entrega</label>
                    <input
                      type="text"
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                      className="w-full rounded-xl border border-theme-subtle bg-theme-base p-2.5 font-mono text-theme-main focus:outline-hidden"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-theme-main block mb-1">Contacto SQA de Cliente</label>
                    <input
                      type="text"
                      placeholder="Ej. Ing. Carlos SQA"
                      value={clientContact}
                      onChange={(e) => setClientContact(e.target.value)}
                      className="w-full rounded-xl border border-theme-subtle bg-theme-base p-2.5 text-theme-main focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-theme-subtle bg-theme-muted/10 p-3.5 space-y-1">
                  <span className="font-bold text-theme-main block">Resumen del Expediente:</span>
                  <p className="text-[11px] text-theme-muted">
                    Expediente PPAP Nivel {submissionLevel} para <b>{client}</b> (Parte: {partNumber || 'PARTE-DEMO-01'} {revision}).
                    Contará con {selectedElements.length} entregables y se abrirá directamente para cargar evidencias.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer del Wizard con Botones Siguiente / Anterior */}
          <div className="flex items-center justify-between border-t border-theme-subtle p-5 bg-theme-muted/10">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s - 1) as any)}
                className="flex items-center gap-1 rounded-xl border border-theme-subtle bg-theme-surface px-4 py-2 text-xs font-bold text-theme-main hover:bg-theme-muted/30"
              >
                <ChevronLeft className="h-4 w-4" /> Anterior
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s + 1) as any)}
                className="flex items-center gap-1 rounded-xl bg-theme-primary px-4 py-2 text-xs font-bold text-white hover:bg-theme-primary/90 shadow-xs"
              >
                Siguiente <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-xl bg-theme-primary px-5 py-2 text-xs font-bold text-white hover:bg-theme-primary/90 shadow-md"
              >
                ✓ Crear Expediente
              </button>
            )}
          </div>
        </form>
      </div>
    </ModalPortal>
  );
};
