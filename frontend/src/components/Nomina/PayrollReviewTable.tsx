import React, { useState } from 'react';
import {
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Eye,
  Lock,
  Unlock,
  Download,
  UploadCloud,
  ArrowRight,
  ShieldCheck,
  Building2,
  DollarSign,
  Search,
  Filter,
  Check,
  X
} from 'lucide-react';
import { ModalPortal } from '../common/ModalPortal';
import { EmployeePayroll, PayrollPeriod, Employee } from '../../data/mockNominaData';
import { formatCurrency } from '../../utils/payrollDemoHelpers';
import { ImportModalFake } from './ImportModalFake';

interface PayrollReviewTableProps {
  period: PayrollPeriod;
  calculations: EmployeePayroll[];
  employees: Employee[];
  isCerrada: boolean;
  onClosePayroll: () => void;
  onReopenPayroll: (motivo: string) => void;
  onTriggerToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  onProceedToStamp: () => void;
}

export const PayrollReviewTable: React.FC<PayrollReviewTableProps> = ({
  period,
  calculations,
  employees,
  isCerrada,
  onClosePayroll,
  onReopenPayroll,
  onTriggerToast,
  onProceedToStamp,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('TODOS');
  const [selectedCalcDetail, setSelectedCalcDetail] = useState<EmployeePayroll | null>(null);

  // Modals state
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [isReopenModalOpen, setIsReopenModalOpen] = useState(false);
  const [reopenMotive, setReopenMotive] = useState('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Checklist for closing
  const [check1, setCheck1] = useState(true);
  const [check2, setCheck2] = useState(true);
  const [check3, setCheck3] = useState(true);
  const [check4, setCheck4] = useState(true);
  const [check5, setCheck5] = useState(true);

  const departments = ['TODOS', 'Flexografía', 'Offset', 'Acabado', 'Serigrafía', 'Almacén', 'Mantenimiento', 'Calidad', 'Planeación', 'Manufactura', 'RH'];

  const filteredCalculations = calculations.filter((calc) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      calc.empleadoNombre.toLowerCase().includes(term) ||
      calc.numeroEmpleado.toLowerCase().includes(term) ||
      calc.puesto.toLowerCase().includes(term);

    const matchesDept = selectedDept === 'TODOS' || calc.departamento === selectedDept;
    return matchesSearch && matchesDept;
  });

  const listosCount = calculations.filter((c) => c.estadoValidacion === 'listo').length;
  const revisionCount = calculations.filter((c) => c.estadoValidacion === 'requiere_revision').length;
  const bloqueadosCount = calculations.filter((c) => c.estadoValidacion === 'bloqueado').length;

  const totalPercepciones = calculations.reduce((acc, c) => acc + c.totalPercepciones, 0);
  const totalDeducciones = calculations.reduce((acc, c) => acc + c.totalDeducciones, 0);
  const totalNeto = calculations.reduce((acc, c) => acc + c.netoAPagar, 0);

  const handleConfirmClose = () => {
    onClosePayroll();
    setIsCloseModalOpen(false);
    onTriggerToast('Nómina cerrada exitosamente · Bloqueada para modificaciones · Lista para timbrado', 'success');
  };

  const handleConfirmReopen = () => {
    if (!reopenMotive.trim()) {
      onTriggerToast('Por favor captura el motivo obligatorio de reapertura', 'warning');
      return;
    }
    onReopenPayroll(reopenMotive.trim());
    setIsReopenModalOpen(false);
    setReopenMotive('');
    onTriggerToast('Nómina reabierta temporalmente para ajustes autorizados', 'info');
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Locked Notice Banner when closed */}
      {isCerrada && (
        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold">
                Nómina Cerrada · Periodo bloqueado contra modificaciones
              </p>
              <p className="text-[11px] text-blue-800">
                Los cambios posteriores requieren reapertura formal y quedarán registrados en la bitácora de auditoría RTM.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsReopenModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-white border border-blue-300 text-blue-900 text-xs font-bold hover:bg-blue-100 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Unlock className="w-3.5 h-3.5 text-blue-600" />
              <span>Solicitar Reapertura</span>
            </button>

            <button
              onClick={onProceedToStamp}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <span>Ir a Timbrado CFDI</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 1. Panel de Validaciones Automáticas (Sección 12.2) */}
      <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-zinc-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white text-zinc-900 border border-zinc-300 shadow-2xs">
                VALIDACIONES AUTOMÁTICAS POR REGLAS DE NEGOCIO
              </span>
              <span className="text-xs font-bold text-zinc-950">Semana 36</span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Validación continua de checadas, incidencias, datos fiscales y cuentas bancarias
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-white text-zinc-900 border border-emerald-500 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{listosCount} Listos</span>
            </span>

            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-white text-zinc-900 border border-amber-500 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>{revisionCount} En Revisión</span>
            </span>

            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-white text-zinc-900 border border-zinc-300 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-zinc-400" />
              <span>{bloqueadosCount} Bloqueados</span>
            </span>
          </div>
        </div>

        {/* 6 Validation Rule Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
          {[
            { label: 'Checadas completas', ok: true },
            { label: 'Incidencias autorizadas', ok: true },
            { label: 'Neto no negativo', ok: true },
            { label: 'Datos fiscales SAT', ok: revisionCount === 0 },
            { label: 'Cuentas bancarias CLABE', ok: true },
            { label: 'Periodo fiscal semanal', ok: true },
          ].map((v, idx) => (
            <div
              key={idx}
              className={`p-2.5 rounded-xl border flex items-center justify-between ${
                v.ok ? 'bg-zinc-50/60 border-zinc-200 text-zinc-800' : 'bg-amber-50/50 border-amber-300 text-amber-900'
              }`}
            >
              <span className="text-[11px] font-medium truncate">{v.label}</span>
              {v.ok ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs">
        <div>
          <h3 className="text-sm font-bold text-zinc-950">Resumen y Cálculo de Pre-Nómina</h3>
          <p className="text-[11px] text-zinc-500">
            Percepciones: <strong>{formatCurrency(totalPercepciones)}</strong> · Deducciones: <strong>{formatCurrency(totalDeducciones)}</strong> · Neto Total: <strong className="text-emerald-700 font-mono text-xs">{formatCurrency(totalNeto)}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => onTriggerToast('Plantilla de pre-nómina descargada · RTM_Prenomina_Semana36.xlsx', 'success')}
            className="px-3 py-2 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-xs font-semibold text-zinc-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-zinc-500" />
            <span>Descargar plantilla</span>
          </button>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-3 py-2 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-xs font-semibold text-zinc-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <UploadCloud className="w-3.5 h-3.5 text-theme-primary" />
            <span>Importar ajustes</span>
          </button>

          <button
            onClick={() => onTriggerToast('Pre-nómina validada al 100% contra catálogo fiscal y asistencia', 'success')}
            className="px-3 py-2 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-xs font-semibold text-zinc-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Validar pre-nómina</span>
          </button>

          {!isCerrada && (
            <button
              onClick={() => setIsCloseModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Cerrar Nómina</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabla de Pre-nómina */}
      <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
              <tr>
                <th className="px-4 py-3">Colaborador</th>
                <th className="px-4 py-3">Departamento</th>
                <th className="px-4 py-3 text-center">Días</th>
                <th className="px-4 py-3 text-center">Horas Ord</th>
                <th className="px-4 py-3 text-center">Extra</th>
                <th className="px-4 py-3 text-right">Percepciones</th>
                <th className="px-4 py-3 text-right">Deducciones</th>
                <th className="px-4 py-3 text-right">Neto a Pagar</th>
                <th className="px-4 py-3 text-center">Validaciones</th>
                <th className="px-4 py-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredCalculations.map((calc) => {
                const isReady = calc.estadoValidacion === 'listo';
                return (
                  <tr key={calc.empleadoId} className="hover:bg-zinc-50/70 transition-colors">
                    {/* Colaborador */}
                    <td className="px-4 py-3">
                      <div className="font-bold text-zinc-900">{calc.empleadoNombre}</div>
                      <div className="text-[10px] font-mono text-zinc-400">{calc.numeroEmpleado} · {calc.puesto}</div>
                    </td>

                    {/* Depto */}
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-800 text-[10px] font-semibold border border-zinc-200">
                        {calc.departamento}
                      </span>
                    </td>

                    {/* Días */}
                    <td className="px-4 py-3 text-center font-mono font-semibold text-zinc-900">
                      {calc.diasTrabajados}
                    </td>

                    {/* Horas Ord */}
                    <td className="px-4 py-3 text-center font-mono text-zinc-700">
                      {calc.horasOrdinarias} h
                    </td>

                    {/* Horas Extra */}
                    <td className="px-4 py-3 text-center font-mono font-bold text-amber-700">
                      {calc.horasAdicionales > 0 ? `+${calc.horasAdicionales} h` : '—'}
                    </td>

                    {/* Percepciones */}
                    <td className="px-4 py-3 text-right font-mono font-semibold text-zinc-900">
                      {formatCurrency(calc.totalPercepciones)}
                    </td>

                    {/* Deducciones */}
                    <td className="px-4 py-3 text-right font-mono font-medium text-rose-700">
                      -{formatCurrency(calc.totalDeducciones)}
                    </td>

                    {/* Neto a Pagar */}
                    <td className="px-4 py-3 text-right font-mono font-black text-emerald-700 text-xs">
                      {formatCurrency(calc.netoAPagar)}
                    </td>

                    {/* Validaciones */}
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 shadow-2xs ${
                        isReady
                          ? 'border border-emerald-500'
                          : 'border border-amber-500'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isReady ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                        <span>{isReady ? 'Listo' : 'Revisar'}</span>
                      </span>
                    </td>

                    {/* Acción */}
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setSelectedCalcDetail(calc)}
                        className="px-2.5 py-1 rounded-lg border border-zinc-200 hover:bg-zinc-100 text-[11px] font-bold text-zinc-800 transition-colors flex items-center gap-1 ml-auto cursor-pointer"
                        title="Ver desglose fiscal y origen de conceptos"
                      >
                        <Eye className="w-3.5 h-3.5 text-zinc-500" />
                        <span>Detalle</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalle de Cálculo (Sección 12.3) */}
      {selectedCalcDetail && (
        <ModalPortal isOpen={!!selectedCalcDetail} onClose={() => setSelectedCalcDetail(null)}>
          <div className="bg-white border border-zinc-200 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col text-zinc-900 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white text-zinc-900 border border-zinc-300 shadow-2xs">
                  DETALLE DE CÁLCULO DE NÓMINA
                </span>
                <h3 className="text-base font-bold text-zinc-950 mt-1">{selectedCalcDetail.empleadoNombre}</h3>
                <p className="text-xs text-zinc-500">
                  {selectedCalcDetail.puesto} · <strong className="text-zinc-800">{selectedCalcDetail.departamento}</strong>
                </p>
              </div>
              <button
                onClick={() => setSelectedCalcDetail(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* Percepciones */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-zinc-950 uppercase tracking-wider">
                  <span>Percepciones Ordinarias y Extraordinarias</span>
                  <span className="font-mono text-emerald-700">{formatCurrency(selectedCalcDetail.totalPercepciones)}</span>
                </div>

                <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-bold text-zinc-500 uppercase">
                      <tr>
                        <th className="px-3 py-2">Clave SAT</th>
                        <th className="px-3 py-2">Concepto</th>
                        <th className="px-3 py-2">Origen / Justificación</th>
                        <th className="px-3 py-2 text-right">Importe</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 font-mono">
                      {selectedCalcDetail.percepciones.map((p) => (
                        <tr key={p.id}>
                          <td className="px-3 py-2 text-zinc-400 text-[11px]">{p.claveSat}</td>
                          <td className="px-3 py-2 font-sans font-semibold text-zinc-900">{p.descripcion}</td>
                          <td className="px-3 py-2 font-sans text-zinc-500 text-[11px]">{p.origen || 'Cálculo de sistema'}</td>
                          <td className="px-3 py-2 text-right font-bold text-zinc-900">{formatCurrency(p.importe)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Deducciones */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-zinc-950 uppercase tracking-wider">
                  <span>Deducciones Fiscales y Seguridad Social</span>
                  <span className="font-mono text-rose-700">-{formatCurrency(selectedCalcDetail.totalDeducciones)}</span>
                </div>

                <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-bold text-zinc-500 uppercase">
                      <tr>
                        <th className="px-3 py-2">Clave SAT</th>
                        <th className="px-3 py-2">Concepto</th>
                        <th className="px-3 py-2 text-right">Importe</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 font-mono">
                      {selectedCalcDetail.deducciones.map((d) => (
                        <tr key={d.id}>
                          <td className="px-3 py-2 text-zinc-400 text-[11px]">{d.claveSat}</td>
                          <td className="px-3 py-2 font-sans font-semibold text-zinc-900">{d.descripcion}</td>
                          <td className="px-3 py-2 text-right font-bold text-rose-700">-{formatCurrency(d.importe)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total Balance */}
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 flex justify-between items-center text-sm font-bold">
                <span className="text-zinc-900">Neto a Pagar por Transferencia Electrónica:</span>
                <span className="font-mono font-black text-emerald-700 text-base">{formatCurrency(selectedCalcDetail.netoAPagar)}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-zinc-200 bg-zinc-50 flex justify-end">
              <button
                onClick={() => setSelectedCalcDetail(null)}
                className="px-5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Cerrar Detalle
              </button>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* Modal de Cierre de Nómina con Checklist (Sección 13) */}
      <ModalPortal isOpen={isCloseModalOpen} onClose={() => setIsCloseModalOpen(false)}>
        <div className="bg-white border border-zinc-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col text-zinc-900 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-theme-primary/10 border border-theme-primary/20 flex items-center justify-center text-theme-primary">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-950">Cierre y Bloqueo de Nómina</h3>
                <p className="text-xs text-zinc-500">{period.nombre}</p>
              </div>
            </div>
            <button
              onClick={() => setIsCloseModalOpen(false)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto space-y-4 text-xs">
            <p className="text-zinc-700">
              Estás por cerrar formalmente la nómina semanal <strong>31 ago – 06 sep 2026</strong>. Valida los puntos del checklist oficial antes de proceder:
            </p>

            <div className="space-y-2.5 border border-zinc-200 rounded-xl p-4 bg-zinc-50/50">
              {[
                { state: check1, setter: setCheck1, label: '30 empleados de planta incluidos y registrados' },
                { state: check2, setter: setCheck2, label: '30 asistencias semanales revisadas contra reloj ZKTeco' },
                { state: check3, setter: setCheck3, label: '5 incidencias resueltas y autorizadas por supervisión' },
                { state: check4, setter: setCheck4, label: '30 cálculos de percepciones y retenciones validados' },
                { state: check5, setter: setCheck5, label: '30 datos fiscales y cuentas bancarias confirmados' },
              ].map((item, idx) => (
                <label key={idx} className="flex items-center gap-2.5 cursor-pointer text-xs text-zinc-800">
                  <input
                    type="checkbox"
                    checked={item.state}
                    onChange={(e) => item.setter(e.target.checked)}
                    className="rounded border-zinc-300 text-theme-primary focus:ring-theme-primary/20"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
              <strong>Aviso de seguridad RTM:</strong> Una vez cerrada la nómina, se emitirá el bloqueo de cambios en asistencias y montos. Cualquier cambio posterior requerirá reapertura formal con justificación documentada.
            </div>
          </div>

          <div className="px-6 py-4 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between">
            <button
              onClick={() => setIsCloseModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-zinc-200 hover:bg-zinc-100 text-xs font-semibold text-zinc-700 transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              onClick={handleConfirmClose}
              disabled={!check1 || !check2 || !check3 || !check4 || !check5}
              className="px-5 py-2 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Cerrar Nómina</span>
            </button>
          </div>
        </div>
      </ModalPortal>
      
      {/* Modal de Solicitud de Reapertura con Motivo Obligatorio (Sección 13) */}
      <ModalPortal isOpen={isReopenModalOpen} onClose={() => setIsReopenModalOpen(false)}>
        <div className="bg-white border border-zinc-200 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col text-zinc-900 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Unlock className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-zinc-950">Solicitar Reapertura de Nómina</h3>
            </div>
            <button
              onClick={() => setIsReopenModalOpen(false)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-4 text-xs">
            <p className="text-zinc-600">
              Para desbloquear el periodo semanal se requiere justificar el motivo para la bitácora de auditoría y control de calidad RTM.
            </p>

            <div>
              <label className="block text-zinc-700 font-bold text-[11px] mb-1 uppercase tracking-wider">
                Motivo Obligatorio de Reapertura *
              </label>
              <textarea
                value={reopenMotive}
                onChange={(e) => setReopenMotive(e.target.value)}
                rows={3}
                placeholder="Ej: Corrección de marcaje de horas extra solicitado por supervisor de Flexografía..."
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-zinc-900 text-xs focus:ring-2 focus:ring-theme-primary/20 outline-none"
              />
            </div>
          </div>

          <div className="px-6 py-4 border-t border-zinc-200 bg-zinc-50 flex justify-end gap-2">
            <button
              onClick={() => setIsReopenModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-zinc-200 hover:bg-zinc-100 text-xs font-semibold text-zinc-700 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmReopen}
              disabled={!reopenMotive.trim()}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Confirmar Reapertura</span>
            </button>
          </div>
        </div>
      </ModalPortal>

      {/* Modal de Importar Ajustes Fake */}
      <ImportModalFake
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Importar Ajustes de Pre-Nómina"
        subtitle="Carga de bonos y ajustes manuales autorizados desde Excel"
        templateFileName="RTM_Ajustes_Nomina_W36.xlsx"
        sampleColumns={['No. Emp', 'Colaborador', 'Tipo Ajuste', 'Clave SAT', 'Importe', 'Motivo']}
        sampleRows={[
          ['RTM-001', 'Carlos Mendoza Ruiz', 'Bono', '010', '$250.00', 'Premio de puntualidad'],
          ['RTM-002', 'José Luis Herrera Soto', 'Bono', '010', '$250.00', 'Premio de puntualidad'],
          ['RTM-009', 'Martín González Leal', 'Bono', '010', '$250.00', 'Premio de puntualidad'],
          ['RTM-014', 'Mario Hernández Silva', 'Bono', '010', '$150.00', 'Premio de asistencia'],
          ['RTM-024', 'Fernando Rangel Ibarra', 'Bono', '010', '$150.00', 'Premio de asistencia'],
        ]}
        onSuccessMessage="Ajustes de pre-nómina aplicados y recalculados exitosamente"
        onSuccess={() => {
          onTriggerToast('Ajustes de pre-nómina aplicados y recalculados exitosamente', 'success');
        }}
      />
    </div>
  );
};
