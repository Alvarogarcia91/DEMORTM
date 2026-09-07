import React, { useRef } from 'react';
import {
  CheckCircle2,
  Download,
  FileCheck,
  Layers,
  Printer,
  ShieldAlert,
  ShieldCheck,
  X,
} from 'lucide-react';
import { TraceabilityDossier } from '../../../data/mockTraceabilityData';

interface Props {
  dossier: TraceabilityDossier;
  onClose: () => void;
  onToast?: (msg: string) => void;
}

export const TraceabilityExportModal: React.FC<Props> = ({
  dossier,
  onClose,
  onToast,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
    onToast?.('✓ Enviando expediente oficial a impresión / exportación PDF.');
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(dossier, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Trazabilidad_${dossier.opFolio}_${dossier.partNumber.replace(/[^a-zA-Z0-9_-]/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onToast?.('✓ Archivo de trazabilidad JSON descargado.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col rounded-3xl border border-theme-subtle bg-theme-surface shadow-2xl text-xs overflow-hidden">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-theme-subtle bg-theme-muted/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <FileCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black text-theme-main">
                  CERTIFICADO OFICIAL DE TRAZABILIDAD 360°
                </span>
                <span className="rounded-md bg-theme-primary/10 px-2 py-0.5 font-mono text-[10px] font-bold text-theme-primary">
                  {dossier.opFolio}
                </span>
              </div>
              <p className="text-[11px] text-theme-muted">
                Expediente digital certificado bajo normas IATF 16949:2016 / ISO 9001:2015
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadJson}
              className="flex items-center gap-1.5 rounded-xl border border-theme-subtle bg-theme-surface px-3 py-1.5 text-xs font-bold text-theme-main hover:bg-theme-muted/20 transition-colors cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 text-theme-muted" />
              <span>JSON</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Imprimir / PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-1.5 text-theme-muted hover:bg-theme-muted/20 hover:text-theme-main transition-colors cursor-pointer ml-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1 bg-theme-surface">
          <div ref={printRef} className="space-y-6 text-theme-main">
            {/* Header Documento Corporativo */}
            <div className="flex items-start justify-between border-b-2 border-theme-primary pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black tracking-tight text-theme-main">
                    ROTOMÉXICO S.A. DE C.V.
                  </span>
                  <span className="rounded-full bg-theme-primary/10 text-theme-primary px-2 py-0.5 text-[9px] font-bold">
                    SGC CERTIFICADO
                  </span>
                </div>
                <p className="text-[11px] text-theme-muted">
                  Planta Industrial Parque Tecnológico Querétaro · R.F.C: RTM-840912-QA1
                </p>
                <p className="text-[11px] font-semibold text-theme-muted mt-0.5">
                  EXPEDIENTE DE AUDITORÍA & TRAZABILIDAD ASCENDENTE / DESCENDENTE (DHR/DMR)
                </p>
              </div>

              <div className="text-right font-mono text-[11px] space-y-0.5">
                <div><span className="text-theme-muted">Código:</span> <b className="font-bold">FM-QA-TRZ-360</b></div>
                <div><span className="text-theme-muted">Fecha Emisión:</span> <b>{new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}</b></div>
                <div><span className="text-theme-muted">Versión SGC:</span> <b>Rev. {dossier.revision || '4.2'}</b></div>
              </div>
            </div>

            {/* Cuadro de Datos Generales del Lote */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-theme-muted/10 rounded-2xl p-4 border border-theme-subtle">
              <div>
                <span className="text-[10px] uppercase font-bold text-theme-muted block">Cliente:</span>
                <b className="text-xs font-black block">{dossier.cliente}</b>
                <small className="text-[10px] text-theme-muted">{dossier.pedido}</small>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-theme-muted block">Producto / N° Parte:</span>
                <b className="text-xs font-black block font-mono">{dossier.partNumber}</b>
                <small className="text-[10px] text-theme-muted">{dossier.partDescription}</small>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-theme-muted block">Lote de Producto Terminado:</span>
                <b className="text-xs font-black block font-mono text-theme-primary">{dossier.finishedBatch}</b>
                <small className="text-[10px] text-theme-muted">Cant: {dossier.quantity.toLocaleString()} pzas</small>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-theme-muted block">Dictamen & Estado:</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    dossier.status === 'Liberada'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : dossier.status === 'Detenida (HOLD)'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                  }`}>
                    {dossier.status}
                  </span>
                  <span className="font-mono text-[10px] font-bold text-theme-muted">
                    {dossier.machine}
                  </span>
                </div>
              </div>
            </div>

            {/* Scorecard de Salud de Trazabilidad */}
            <div className="rounded-2xl border border-theme-subtle p-3 space-y-2">
              <span className="text-[10px] uppercase font-bold text-theme-muted block">
                Evaluación de Integridad de la Cadena (Scorecard):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
                <div className="p-2 rounded-xl bg-theme-muted/10 border border-theme-subtle">
                  <span className="text-[9px] uppercase font-bold text-theme-muted block">Documental</span>
                  <b className="text-xs font-black text-theme-main font-mono">
                    {dossier.health.documentationValid ? '100% OK' : 'Pendiente'}
                  </b>
                </div>
                <div className="p-2 rounded-xl bg-theme-muted/10 border border-theme-subtle">
                  <span className="text-[9px] uppercase font-bold text-theme-muted block">Insumos/Lotes</span>
                  <b className="text-xs font-black text-theme-main font-mono">
                    {dossier.health.lotsIdentified ? '100% OK' : 'Incompleto'}
                  </b>
                </div>
                <div className="p-2 rounded-xl bg-theme-muted/10 border border-theme-subtle">
                  <span className="text-[9px] uppercase font-bold text-theme-muted block">Ruta Operativa</span>
                  <b className="text-xs font-black text-theme-main font-mono">
                    {dossier.health.routeComplete ? '100% OK' : 'En proceso'}
                  </b>
                </div>
                <div className="p-2 rounded-xl bg-theme-muted/10 border border-theme-subtle">
                  <span className="text-[9px] uppercase font-bold text-theme-muted block">Gates de Calidad</span>
                  <b className="text-xs font-black text-theme-main font-mono">
                    {dossier.health.qaGatesComplete ? '100% OK' : 'Con Hallazgos'}
                  </b>
                </div>
                <div className="p-2 rounded-xl bg-theme-muted/10 border border-theme-subtle col-span-2 sm:col-span-1">
                  <span className="text-[9px] uppercase font-bold text-theme-muted block">Embarque</span>
                  <b className={`text-xs font-black font-mono ${
                    dossier.health.shippingIdentified ? 'text-emerald-600' : 'text-amber-600'
                  }`}>
                    {dossier.health.shippingIdentified ? 'Conforme' : 'En andén'}
                  </b>
                </div>
              </div>
            </div>

            {/* Tabla 1: Genealogía de Insumos y Materias Primas */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <b className="text-xs font-black uppercase tracking-wide text-theme-main flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-theme-primary" />
                  1. Genealogía de Insumos y Materias Primas (Materia Prima &rarr; OP)
                </b>
                <span className="text-[10px] text-theme-muted">{dossier.materials.length} insumos registrados</span>
              </div>
              <div className="overflow-x-auto rounded-xl border border-theme-subtle">
                <table className="w-full text-[11px]">
                  <thead className="bg-theme-muted/20 text-[10px] uppercase font-bold text-theme-muted border-b border-theme-subtle">
                    <tr>
                      <th className="p-2 text-left">Tipo</th>
                      <th className="p-2 text-left">Descripción / SKU</th>
                      <th className="p-2 text-left">Lote Proveedor</th>
                      <th className="p-2 text-left">Proveedor</th>
                      <th className="p-2 text-left">Certificado Calidad (COA)</th>
                      <th className="p-2 text-right">Cant. Consumida</th>
                      <th className="p-2 text-center">Inspección</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-theme-subtle">
                    {dossier.materials.map((m) => (
                      <tr key={m.id}>
                        <td className="p-2 font-bold">{m.type}</td>
                        <td className="p-2 font-mono">{m.name} ({m.sku})</td>
                        <td className="p-2 font-mono font-bold text-indigo-600 dark:text-indigo-400">{m.lotNumber}</td>
                        <td className="p-2">{m.supplier}</td>
                        <td className="p-2 font-mono text-[10px]">{m.coaFolio || 'N/A'}</td>
                        <td className="p-2 text-right font-mono">{m.consumed}</td>
                        <td className="p-2 text-center">
                          <span className="rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.2 text-[9px] font-bold">
                            {m.incomingQaStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tabla 2: Ruta Operativa de Procesos y Parámetros */}
            <div className="space-y-2">
              <b className="text-xs font-black uppercase tracking-wide text-theme-main flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-theme-primary" />
                2. Ruta de Manufactura Ejecutada vs Autorizada
              </b>
              <div className="overflow-x-auto rounded-xl border border-theme-subtle">
                <table className="w-full text-[11px]">
                  <thead className="bg-theme-muted/20 text-[10px] uppercase font-bold text-theme-muted border-b border-theme-subtle">
                    <tr>
                      <th className="p-2 text-left">Paso</th>
                      <th className="p-2 text-left">Operación</th>
                      <th className="p-2 text-left">Máquina</th>
                      <th className="p-2 text-left">Operador</th>
                      <th className="p-2 text-right">Tiempo Real</th>
                      <th className="p-2 text-right">Scrap</th>
                      <th className="p-2 text-center">Dictamen</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-theme-subtle">
                    {dossier.routing.map((s) => (
                      <tr key={s.stepNumber}>
                        <td className="p-2 font-mono font-bold">{s.stepNumber}</td>
                        <td className="p-2 font-bold">{s.process}</td>
                        <td className="p-2 font-mono">{s.machine}</td>
                        <td className="p-2">{s.operator}</td>
                        <td className="p-2 text-right font-mono">{s.runMinutesReal} min</td>
                        <td className="p-2 text-right font-mono font-bold text-rose-600">{s.scrapQty} {s.scrapUom}</td>
                        <td className="p-2 text-center">
                          <span className={`rounded-full px-2 py-0.2 text-[9px] font-bold ${
                            s.status === 'Completada'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          }`}>
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tabla 3: Puntos de Control y Auditorías QA */}
            <div className="space-y-2">
              <b className="text-xs font-black uppercase tracking-wide text-theme-main flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-theme-primary" />
                3. Gates y Auditorías de Calidad en Piso
              </b>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {dossier.qualityGates.map((gate) => (
                  <div key={gate.id} className="p-3 rounded-xl border border-theme-subtle bg-theme-muted/10 space-y-1">
                    <div className="flex items-center justify-between">
                      <b className="font-bold text-xs">{gate.gate}</b>
                      <span className={`rounded-full px-2 py-0.2 text-[9px] font-bold ${
                        gate.dictamen === 'Aprobado' || gate.dictamen === 'Conforme'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                      }`}>
                        {gate.dictamen}
                      </span>
                    </div>
                    <p className="text-[10px] text-theme-muted">{gate.auditor} · {gate.timestamp}</p>
                    <p className="text-[11px] text-theme-main mt-1">{gate.notes}</p>
                    {gate.measurements && gate.measurements.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {gate.measurements.map((m, idx) => (
                          <span key={idx} className="rounded bg-theme-surface border border-theme-subtle px-1.5 py-0.5 text-[9px] font-mono">
                            {m.parameter}: {m.actual} (Std: {m.standard}) [{m.status.toUpperCase()}]
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Incidencias si existen */}
            {dossier.incidents.length > 0 && (
              <div className="space-y-2">
                <b className="text-xs font-black uppercase tracking-wide text-rose-600 flex items-center gap-1.5">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  4. Incidencias, No Conformidades o Reclamos Ligados
                </b>
                <div className="space-y-1.5">
                  {dossier.incidents.map((inc) => (
                    <div key={inc.id} className="p-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-[11px] flex items-center justify-between">
                      <div>
                        <b className="font-mono font-bold text-rose-800 dark:text-rose-300">{inc.id} ({inc.type})</b>
                        <p className="text-theme-main">{inc.title} - {inc.impact}</p>
                      </div>
                      <span className="rounded-full bg-rose-200 text-rose-900 px-2 py-0.5 font-mono text-[9px] font-bold">
                        {inc.severity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cuadro de Firmas Digitales / Certificación */}
            <div className="border-t-2 border-theme-subtle pt-6 mt-8">
              <div className="text-center text-[10px] text-theme-muted uppercase tracking-wider mb-6">
                CERTIFICACIÓN DE EXPEDIENTE DIGITAL Y CUSTODIA DE TRAZABILIDAD
              </div>
              <div className="grid grid-cols-3 gap-6 text-center text-xs">
                <div className="border-t border-theme-subtle pt-2 space-y-0.5">
                  <b className="font-bold block">Alicia Ramírez</b>
                  <p className="text-[10px] text-theme-muted">Aseguramiento de Calidad</p>
                  <span className="font-mono text-[9px] text-emerald-600 font-bold block">✓ Certificado Digital QA-2026-AR</span>
                </div>
                <div className="border-t border-theme-subtle pt-2 space-y-0.5">
                  <b className="font-bold block">{dossier.operator}</b>
                  <p className="text-[10px] text-theme-muted">Supervisión de Manufactura</p>
                  <span className="font-mono text-[9px] text-emerald-600 font-bold block">✓ Validado en Piso MFG-2026-RM</span>
                </div>
                <div className="border-t border-theme-subtle pt-2 space-y-0.5">
                  <b className="font-bold block">{dossier.shipping.driver || 'Jorge Medina'}</b>
                  <p className="text-[10px] text-theme-muted">Logística & Embarques PT</p>
                  <span className="font-mono text-[9px] text-emerald-600 font-bold block">✓ Despacho Conforme LOG-2026-JM</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-theme-subtle bg-theme-muted/10 px-6 py-3 text-xs">
          <span className="text-theme-muted text-[11px]">
            Expediente digital emitido para <b>{dossier.cliente}</b> · OP <b>{dossier.opFolio}</b>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-theme-subtle bg-theme-surface px-4 py-1.5 font-bold text-theme-main hover:bg-theme-muted/20 transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
