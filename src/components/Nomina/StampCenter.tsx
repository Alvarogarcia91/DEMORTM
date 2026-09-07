import React, { useState } from 'react';
import {
  FileCheck2,
  AlertTriangle,
  RefreshCw,
  Download,
  Send,
  Eye,
  CheckCircle2,
  FileCode,
  ShieldCheck,
  Building2,
  QrCode,
  Layers,
  X,
  Sparkles,
  CreditCard,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { ModalPortal } from '../common/ModalPortal';
import { EmployeePayroll, Employee } from '../../data/mockNominaData';
import { formatCurrency, generateMockUuid } from '../../utils/payrollDemoHelpers';

interface StampCenterProps {
  calculations: EmployeePayroll[];
  employees: Employee[];
  isCerrada: boolean;
  isTimbrada: boolean;
  onStampSuccess: (updatedCalculations: EmployeePayroll[]) => void;
  onTriggerToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const StampCenter: React.FC<StampCenterProps> = ({
  calculations,
  employees,
  isCerrada,
  isTimbrada,
  onStampSuccess,
  onTriggerToast,
}) => {
  const [isStamping, setIsStamping] = useState(false);
  const [stampProgress, setStampProgress] = useState(0);
  const [selectedReceipt, setSelectedReceipt] = useState<EmployeePayroll | null>(null);
  const [isFixErrorsModalOpen, setIsFixErrorsModalOpen] = useState(false);

  // Form states for fixing the 2 fiscal errors
  const [cpAlan, setCpAlan] = useState('88700');
  const [rfcEduardo, setRfcEduardo] = useState('VICE010419H91');

  // Count states
  const totalEmployees = calculations.length;
  const timbradosCount = calculations.filter((c) => c.cfdiStatus === 'timbrado').length;
  const erroresCount = calculations.filter((c) => c.cfdiStatus === 'con_error').length;
  const pendientesCount = calculations.filter((c) => c.cfdiStatus === 'pendiente').length;

  const handleStartStamping = () => {
    setIsStamping(true);
    setStampProgress(20);

    setTimeout(() => {
      setStampProgress(60);
    }, 400);

    setTimeout(() => {
      setStampProgress(100);
      setIsStamping(false);

      // Initial demo scenario: 28 success, 2 errors (Alan Rodriguez & Eduardo Villarreal)
      const now = new Date().toISOString();
      const updated = calculations.map((c) => {
        if (c.empleadoId === 'RTM-022') {
          return {
            ...c,
            cfdiStatus: 'con_error' as const,
            errorTimbrado: 'Código postal fiscal del receptor (88799) no coincide con el catálogo del SAT',
          };
        }
        if (c.empleadoId === 'RTM-008') {
          return {
            ...c,
            cfdiStatus: 'con_error' as const,
            errorTimbrado: 'La homoclave del RFC receptor requiere validación en la lista LCO del SAT',
          };
        }
        return {
          ...c,
          cfdiStatus: 'timbrado' as const,
          uuidSat: generateMockUuid(),
          fechaTimbrado: now,
          errorTimbrado: undefined,
        };
      });

      onStampSuccess(updated);
      onTriggerToast('Timbrado demo completado · 28 correctos · 2 requieren atención fiscal', 'warning');
    }, 1100);
  };

  const handleFixAndRetryErrors = () => {
    setIsStamping(true);
    setTimeout(() => {
      setIsStamping(false);
      setIsFixErrorsModalOpen(false);

      const now = new Date().toISOString();
      const updated = calculations.map((c) => ({
        ...c,
        cfdiStatus: 'timbrado' as const,
        uuidSat: c.uuidSat || generateMockUuid(),
        fechaTimbrado: c.fechaTimbrado || now,
        errorTimbrado: undefined,
        validaciones: {
          ...c.validaciones,
          datosFiscalesCompletos: true,
        },
      }));

      onStampSuccess(updated);
      onTriggerToast('30 de 30 CFDI timbrados correctamente · Validación PAC 100% exitosa', 'success');
    }, 900);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Console */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5 rounded-2xl bg-white border border-zinc-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-zinc-950">Centro de Timbrado Fiscal CFDI Nómina 4.0</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 border border-emerald-500 shadow-2xs">
              PAC AUTORIZADO #58211
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Certificación digital SAT, generación de cadenas originales y emisión de recibos electrónicos
          </p>
        </div>

        {/* Primary Stamping Action */}
        <div className="flex items-center gap-2">
          {erroresCount > 0 && (
            <button
              onClick={() => setIsFixErrorsModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Corregir {erroresCount} Errores y Reintentar</span>
            </button>
          )}

          {!isTimbrada && erroresCount === 0 && (
            <button
              onClick={handleStartStamping}
              disabled={isStamping || !isCerrada}
              className="px-5 py-2.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-bold text-xs flex items-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isStamping ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Conectando con PAC ({stampProgress}%)...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Timbrar Nómina (Simulación)</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* KPIs del Centro de Timbrado */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">Pendientes</span>
          <div className="text-2xl font-black font-mono text-zinc-900">{pendientesCount}</div>
          <p className="text-[10px] text-zinc-500 mt-0.5">Por enviar a timbrar</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block mb-1">Timbrados SAT</span>
          <div className="text-2xl font-black font-mono text-emerald-700">{timbradosCount}</div>
          <p className="text-[10px] text-zinc-500 mt-0.5">Comprobantes con UUID válido</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block mb-1">Con Error Fiscal</span>
          <div className="text-2xl font-black font-mono text-rose-700">{erroresCount}</div>
          <p className="text-[10px] text-zinc-500 mt-0.5">{erroresCount > 0 ? 'Requieren corrección' : '0 errores'}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">Cancelados</span>
          <div className="text-2xl font-black font-mono text-zinc-500">0</div>
          <p className="text-[10px] text-zinc-500 mt-0.5">Sin cancelaciones</p>
        </div>
      </div>

      {/* Tabla de Empleados y Comprobantes Fiscales */}
      <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-2xs">
        <div className="px-4 py-3 bg-zinc-50 border-b border-zinc-200 flex justify-between items-center text-xs">
          <span className="font-bold text-zinc-900 uppercase tracking-wider text-[11px]">
            Lista de Comprobantes CFDI por Empleado
          </span>
          <span className="text-zinc-500 font-mono text-[11px]">{calculations.length} registros</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50/50 border-b border-zinc-200 text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
              <tr>
                <th className="px-4 py-3">Colaborador</th>
                <th className="px-4 py-3">RFC</th>
                <th className="px-4 py-3 text-right">Neto a Dispersar</th>
                <th className="px-4 py-3 text-center">Estado Fiscal</th>
                <th className="px-4 py-3 text-center">Estado CFDI</th>
                <th className="px-4 py-3">UUID Fiscal SAT</th>
                <th className="px-4 py-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-mono text-[11px]">
              {calculations.map((calc) => {
                const emp = employees.find((e) => e.id === calc.empleadoId);
                const isTimbrado = calc.cfdiStatus === 'timbrado';
                const isError = calc.cfdiStatus === 'con_error';

                return (
                  <tr key={calc.empleadoId} className={`hover:bg-zinc-50/70 transition-colors ${isError ? 'bg-rose-50/30' : ''}`}>
                    {/* Colaborador */}
                    <td className="px-4 py-3 font-sans">
                      <div className="font-bold text-zinc-900 text-xs">{calc.empleadoNombre}</div>
                      <div className="text-[10px] text-zinc-400 font-mono">{calc.numeroEmpleado} · {calc.departamento}</div>
                    </td>

                    {/* RFC */}
                    <td className="px-4 py-3 text-zinc-700">
                      {emp?.rfc || '—'}
                    </td>

                    {/* Neto */}
                    <td className="px-4 py-3 text-right font-bold text-zinc-900">
                      {formatCurrency(calc.netoAPagar)}
                    </td>

                    {/* Estado Fiscal */}
                    <td className="px-4 py-3 text-center font-sans">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 shadow-2xs ${
                        isError ? 'border border-rose-500' : 'border border-emerald-500'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isError ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                        <span>{isError ? 'Error SAT' : 'Validado'}</span>
                      </span>
                    </td>

                    {/* Estado CFDI */}
                    <td className="px-4 py-3 text-center font-sans">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 shadow-2xs ${
                        isTimbrado
                          ? 'border border-emerald-500'
                          : isError
                          ? 'border border-rose-500 animate-pulse'
                          : 'border border-zinc-300'
                      }`}>
                        <span>{isTimbrado ? 'Timbrado' : isError ? 'Rechazado' : 'Pendiente'}</span>
                      </span>
                    </td>

                    {/* UUID */}
                    <td className="px-4 py-3">
                      {calc.uuidSat ? (
                        <span className="text-blue-700 font-bold font-mono text-[10px] truncate block max-w-[170px]" title={calc.uuidSat}>
                          {calc.uuidSat.substring(0, 18)}...
                        </span>
                      ) : isError ? (
                        <span className="text-rose-700 font-sans text-[10px] block max-w-[190px] truncate" title={calc.errorTimbrado}>
                          {calc.errorTimbrado}
                        </span>
                      ) : (
                        <span className="text-zinc-400 italic text-[10px]">Sin timbrar</span>
                      )}
                    </td>

                    {/* Acción */}
                    <td className="px-4 py-3 text-right font-sans">
                      <button
                        onClick={() => setSelectedReceipt(calc)}
                        disabled={!isTimbrado}
                        className="px-2.5 py-1 rounded-lg border border-zinc-200 hover:bg-zinc-100 text-[11px] font-bold text-zinc-800 transition-colors flex items-center gap-1 ml-auto cursor-pointer disabled:opacity-40"
                      >
                        <Eye className="w-3.5 h-3.5 text-zinc-500" />
                        <span>Ver Recibo</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Sección "Preparar Pago / Dispersión y Entregables" (Sección 15) */}
      <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-theme-primary" />
            <div>
              <h3 className="text-sm font-bold text-zinc-950 uppercase tracking-wider">
                Preparar Pago, Dispersión y Entregables
              </h3>
              <p className="text-[11px] text-zinc-500">
                Generación de layouts bancarios (BBVA, Banamex, Banorte, Santander) y entrega de recibos a colaboradores
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {/* Layout bancario */}
          <button
            onClick={() => onTriggerToast('Layout bancario generado · 30 colaboradores · $128,460.35 para dispersión SPEI', 'success')}
            className="p-3.5 rounded-xl border border-zinc-200 hover:border-theme-primary hover:bg-zinc-50/60 transition-all text-left flex flex-col justify-between cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs text-zinc-950 group-hover:text-theme-primary transition-colors">
                Layout Bancario Multi-Banco
              </span>
              <Download className="w-4 h-4 text-zinc-400 group-hover:text-theme-primary" />
            </div>
            <p className="text-[10px] text-zinc-500">Formato TXT estándar de tesorería RTM</p>
          </button>

          {/* Resumen contable */}
          <button
            onClick={() => onTriggerToast('Resumen contable exportado correctamente · Póliza de diario generada', 'success')}
            className="p-3.5 rounded-xl border border-zinc-200 hover:border-theme-primary hover:bg-zinc-50/60 transition-all text-left flex flex-col justify-between cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs text-zinc-950 group-hover:text-theme-primary transition-colors">
                Resumen Contable / Póliza
              </span>
              <FileSpreadsheet className="w-4 h-4 text-zinc-400 group-hover:text-theme-primary" />
            </div>
            <p className="text-[10px] text-zinc-500">Centros de costo por departamento de planta</p>
          </button>

          {/* Descargar recibos ZIP */}
          <button
            onClick={() => onTriggerToast('Archivo RTM_Recibos_Nomina_Semana36.zip descargado correctamente', 'success')}
            className="p-3.5 rounded-xl border border-zinc-200 hover:border-theme-primary hover:bg-zinc-50/60 transition-all text-left flex flex-col justify-between cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs text-zinc-950 group-hover:text-theme-primary transition-colors">
                Descargar Recibos ZIP
              </span>
              <Download className="w-4 h-4 text-zinc-400 group-hover:text-theme-primary" />
            </div>
            <p className="text-[10px] text-zinc-500">Paquete de 30 archivos PDF + XML sellados</p>
          </button>

          {/* Enviar recibos */}
          <button
            onClick={() => onTriggerToast('30 recibos preparados y notificados para consulta de los colaboradores', 'success')}
            className="p-3.5 rounded-xl border border-zinc-200 hover:border-theme-primary hover:bg-zinc-50/60 transition-all text-left flex flex-col justify-between cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs text-zinc-950 group-hover:text-theme-primary transition-colors">
                Enviar Recibos por Correo
              </span>
              <Send className="w-4 h-4 text-zinc-400 group-hover:text-theme-primary" />
            </div>
            <p className="text-[10px] text-zinc-500">Dispersión electrónica de comprobantes</p>
          </button>
        </div>
      </div>

      {/* Modal de Corrección Fiscal Visual (Sección 14.2) */}
      <ModalPortal isOpen={isFixErrorsModalOpen} onClose={() => setIsFixErrorsModalOpen(false)}>
        <div className="bg-white border border-zinc-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col text-zinc-900 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-bold text-zinc-950">Corregir Inconsistencias Fiscales SAT</h3>
            </div>
            <button
              onClick={() => setIsFixErrorsModalOpen(false)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-4 text-xs">
            <p className="text-zinc-600">
              El PAC reportó 2 rechazos de timbrado con base en el validador CFDI 4.0 del SAT. Actualiza los datos para liberar el 100% de la nómina:
            </p>

            {/* Error 1: Alan Rodriguez */}
            <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 space-y-2">
              <span className="font-bold text-zinc-900 block text-xs">
                1. Alan Rodríguez Soto (RTM-022 · Operador Lawson Screen)
              </span>
              <span className="text-[11px] text-rose-700 block">
                Motivo rechazo: Código postal fiscal 88799 no coincide con Constancia SAT.
              </span>
              <div>
                <label className="block text-zinc-500 text-[10px] uppercase font-bold mb-1">
                  Código Postal Fiscal Actualizado:
                </label>
                <input
                  type="text"
                  value={cpAlan}
                  onChange={(e) => setCpAlan(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 bg-white font-mono text-xs font-bold"
                />
              </div>
            </div>

            {/* Error 2: Eduardo Villarreal */}
            <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 space-y-2">
              <span className="font-bold text-zinc-900 block text-xs">
                2. Eduardo Villarreal Cruz (RTM-008 · Ayudante de Flexografía)
              </span>
              <span className="text-[11px] text-rose-700 block">
                Motivo rechazo: La homoclave requiere actualización en la lista LCO.
              </span>
              <div>
                <label className="block text-zinc-500 text-[10px] uppercase font-bold mb-1">
                  RFC Corregido con Homoclave Válida:
                </label>
                <input
                  type="text"
                  value={rfcEduardo}
                  onChange={(e) => setRfcEduardo(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 bg-white font-mono text-xs font-bold"
                />
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-zinc-200 bg-zinc-50 flex justify-end gap-2">
            <button
              onClick={() => setIsFixErrorsModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-zinc-200 hover:bg-zinc-100 text-xs font-semibold text-zinc-700 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleFixAndRetryErrors}
              className="px-5 py-2 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Guardar Correcciones y Reintentar Timbrado</span>
            </button>
          </div>
        </div>
      </ModalPortal>

      {/* Modal de Recibo Individual CFDI 4.0 (Sección 14.3) */}
      {selectedReceipt && (
        <ModalPortal isOpen={!!selectedReceipt} onClose={() => setSelectedReceipt(null)}>
          <div className="bg-white border border-zinc-200 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col text-zinc-900 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white text-zinc-900 border border-emerald-500 shadow-2xs">
                  RECIBO ELECTRÓNICO DE NÓMINA (CFDI 4.0 DEMO)
                </span>
                <h3 className="text-base font-bold text-zinc-950 mt-1">{selectedReceipt.empleadoNombre}</h3>
                <p className="text-xs text-zinc-500">
                  {selectedReceipt.puesto} · <strong className="text-zinc-800">{selectedReceipt.departamento}</strong>
                </p>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* Fiscal Header Emisor / Receptor */}
              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 grid grid-cols-2 gap-3 text-[11px]">
                <div>
                  <span className="text-zinc-400 uppercase font-bold text-[9px] block">Patrón Emisor</span>
                  <strong className="text-zinc-900 text-xs">RTM IMPRESOS S.A. DE C.V.</strong>
                  <p className="text-zinc-500 font-mono">RFC: RTM890315AB1</p>
                  <p className="text-zinc-500">Régimen: 601 General de Ley PM</p>
                </div>
                <div>
                  <span className="text-zinc-400 uppercase font-bold text-[9px] block">Periodo & Pago</span>
                  <p className="text-zinc-800">Semana 36 (31 ago – 06 sep 2026)</p>
                  <p className="text-zinc-500">Fecha de Pago: 07-sep-2026</p>
                  <p className="text-zinc-500">Días Pagados: {selectedReceipt.diasTrabajados} días</p>
                </div>
              </div>

              {/* Percepciones & Deducciones columns */}
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-zinc-200 rounded-xl p-3 bg-white space-y-2">
                  <span className="font-bold text-[10px] uppercase tracking-wider text-emerald-800 block">Percepciones</span>
                  <div className="space-y-1 font-mono text-[11px]">
                    {selectedReceipt.percepciones.map((p) => (
                      <div key={p.id} className="flex justify-between">
                        <span className="text-zinc-600 font-sans">{p.descripcion}</span>
                        <strong className="text-zinc-900">{formatCurrency(p.importe)}</strong>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-zinc-100 flex justify-between font-bold text-zinc-900">
                      <span>Total Percepciones:</span>
                      <span>{formatCurrency(selectedReceipt.totalPercepciones)}</span>
                    </div>
                  </div>
                </div>

                <div className="border border-zinc-200 rounded-xl p-3 bg-white space-y-2">
                  <span className="font-bold text-[10px] uppercase tracking-wider text-rose-800 block">Deducciones</span>
                  <div className="space-y-1 font-mono text-[11px]">
                    {selectedReceipt.deducciones.map((d) => (
                      <div key={d.id} className="flex justify-between">
                        <span className="text-zinc-600 font-sans">{d.descripcion}</span>
                        <strong className="text-rose-700">-{formatCurrency(d.importe)}</strong>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-zinc-100 flex justify-between font-bold text-rose-700">
                      <span>Total Deducciones:</span>
                      <span>-{formatCurrency(selectedReceipt.totalDeducciones)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Neto */}
              <div className="p-3.5 rounded-xl bg-zinc-900 text-white flex justify-between items-center font-bold">
                <span>Neto a Pagar por Transferencia:</span>
                <span className="font-mono text-emerald-400 text-base">{formatCurrency(selectedReceipt.netoAPagar)} MXN</span>
              </div>

              {/* Digital Seal & QR Demo */}
              <div className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50 flex items-center gap-4">
                <div className="p-2 rounded-lg bg-white border border-zinc-200 shrink-0">
                  <QrCode className="w-16 h-16 text-zinc-900" />
                </div>
                <div className="font-mono text-[10px] text-zinc-600 space-y-1 break-all">
                  <p><strong className="text-zinc-900">Folio Fiscal UUID:</strong> <span className="text-blue-700 font-bold">{selectedReceipt.uuidSat}</span></p>
                  <p><strong className="text-zinc-900">Certificación SAT:</strong> {selectedReceipt.fechaTimbrado || '2026-09-07T10:15:22'}</p>
                  <p className="text-zinc-400 text-[9px]">Sello SAT: MD5-RTM-CFDI40-NOMINA-DEMO-CERTIFIED-VALIDATION</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-zinc-200 bg-zinc-50 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onTriggerToast('Descarga simulada de archivo XML de recibo', 'info')}
                  className="px-3 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-100 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <FileCode className="w-3.5 h-3.5 text-blue-600" />
                  <span>XML</span>
                </button>
                <button
                  onClick={() => onTriggerToast('Descarga simulada de archivo PDF de recibo', 'info')}
                  className="px-3 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-100 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600" />
                  <span>PDF</span>
                </button>
              </div>

              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Cerrar Recibo
              </button>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
};
