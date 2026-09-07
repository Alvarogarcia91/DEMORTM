import React, { useState } from 'react';
import {
  Calendar,
  Search,
  Download,
  Filter,
  Eye,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck2,
  X,
  Layers,
  Users,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import {
  PayrollPeriod,
  EmployeePayroll,
  INITIAL_MOCK_PAYROLL_PERIODS,
  INITIAL_MOCK_PAYROLL_CALCULATIONS,
} from '../../data/mockNominaData';
import { formatCurrency } from '../../utils/payrollDemoHelpers';

interface PayrollHistoryProps {
  periods?: PayrollPeriod[];
  onTriggerToast: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  onSelectPeriodForReview?: (periodId: string) => void;
}

export const PayrollHistory: React.FC<PayrollHistoryProps> = ({
  periods = INITIAL_MOCK_PAYROLL_PERIODS,
  onTriggerToast,
  onSelectPeriodForReview,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'Todos' | 'Semanal' | 'Quincenal'>('Todos');
  const [statusFilter, setStatusFilter] = useState<'Todos' | 'timbrada' | 'cerrada' | 'en_revision'>('Todos');
  const [selectedPeriod, setSelectedPeriod] = useState<PayrollPeriod | null>(null);
  const [periodDetailTab, setPeriodDetailTab] = useState<'resumen' | 'empleados' | 'incidencias' | 'timbrado'>('resumen');

  // Filter periods
  const filteredPeriods = periods.filter((p) => {
    const matchesSearch =
      p.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'Todos' || p.tipo === typeFilter;
    const matchesStatus = statusFilter === 'Todos' || p.estado === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadge = (status: PayrollPeriod['estado']) => {
    switch (status) {
      case 'timbrada':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-emerald-800 border border-emerald-500 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Timbrada CFDI 4.0
          </span>
        );
      case 'cerrada':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-blue-800 border border-blue-500 shadow-sm">
            <CheckCircle2 className="w-3 h-3 text-blue-600" />
            Cerrada (Pendiente Timbrar)
          </span>
        );
      case 'en_revision':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-amber-800 border border-amber-500 shadow-sm">
            <Clock className="w-3 h-3 text-amber-600" />
            En Revisión
          </span>
        );
      case 'autorizada':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-purple-800 border border-purple-500 shadow-sm">
            <FileCheck2 className="w-3 h-3 text-purple-600" />
            Autorizada
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-zinc-700 border border-zinc-300">
            Borrador
          </span>
        );
    }
  };

  const handleExportHistory = () => {
    onTriggerToast('Exportando Histórico', 'Generando reporte acumulado de periodos RTM en Excel...', 'info');
    setTimeout(() => {
      onTriggerToast('Reporte Generado', 'Descarga completada: Historico_Nominas_RTM_2026.xlsx', 'success');
    }, 800);
  };

  const handleExportAccountingPolicy = (period: PayrollPeriod) => {
    onTriggerToast('Póliza Contable', `Generando póliza de diario para periodo ${period.codigo}...`, 'info');
    setTimeout(() => {
      onTriggerToast('Póliza Generada', `Poliza_Diario_${period.codigo}_CONTPAQ.xml exportada exitosamente.`, 'success');
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Summary */}
      <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex p-1.5 rounded-lg bg-zinc-100 text-zinc-700">
                <Calendar className="w-4 h-4 text-zinc-600" />
              </span>
              <h3 className="text-base font-bold text-zinc-900">Historial de Periodos de Nómina</h3>
            </div>
            <p className="text-xs text-zinc-500 max-w-2xl">
              Registro histórico de nóminas semanales y quincenales timbradas ante el SAT, pólizas de diario contable y acumulados acumulados por centro de costo en Planta Reynosa.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportHistory}
              className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-zinc-700 bg-white border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors shadow-sm"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              Exportar Acumulado (Excel)
            </button>
          </div>
        </div>

        {/* Aggregate Mini Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-4 border-t border-zinc-100">
          <div>
            <span className="text-xs text-zinc-500">Periodos Registrados</span>
            <div className="text-lg font-bold text-zinc-900 mt-0.5">{periods.length} periodos</div>
            <span className="text-[10px] text-zinc-400">Año fiscal 2026</span>
          </div>
          <div>
            <span className="text-xs text-zinc-500">Total Dispersado Histórico</span>
            <div className="text-lg font-bold text-zinc-900 mt-0.5">
              {formatCurrency(periods.reduce((acc, p) => acc + p.netoTotal, 0))}
            </div>
            <span className="text-[10px] text-emerald-600 font-medium">100% conciliado con bancos</span>
          </div>
          <div>
            <span className="text-xs text-zinc-500">Retenciones ISR Acumuladas</span>
            <div className="text-lg font-bold text-zinc-900 mt-0.5">
              {formatCurrency(periods.reduce((acc, p) => acc + p.deduccionesTotales * 0.65, 0))}
            </div>
            <span className="text-[10px] text-zinc-400">Provisionado en contabilidad</span>
          </div>
          <div>
            <span className="text-xs text-zinc-500">CFDIs 4.0 Emitidos</span>
            <div className="text-lg font-bold text-zinc-900 mt-0.5">
              {periods.filter((p) => p.estado === 'timbrada').reduce((acc, p) => acc + p.totalEmpleados, 0)} timbres
            </div>
            <span className="text-[10px] text-emerald-600 font-medium">Validación SAT 100% OK</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar por código o nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-1 text-xs text-zinc-500 mr-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Frecuencia:</span>
            </div>
            {(['Todos', 'Semanal', 'Quincenal'] as const).map((freq) => (
              <button
                key={freq}
                onClick={() => setTypeFilter(freq)}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                  typeFilter === freq
                    ? 'bg-zinc-900 text-white'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                {freq}
              </button>
            ))}

            <div className="h-4 w-px bg-zinc-200 mx-1 hidden sm:block" />

            <div className="flex items-center gap-1 text-xs text-zinc-500 mr-1">
              <span>Estado:</span>
            </div>
            {(['Todos', 'timbrada', 'en_revision'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                  statusFilter === st
                    ? 'bg-zinc-900 text-white'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                {st === 'Todos' ? 'Todos' : st === 'timbrada' ? 'Timbradas' : 'En Revisión'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Historical Periods Table */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50/80 border-b border-zinc-200 text-zinc-600 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Periodo</th>
                <th className="py-3 px-3">Frecuencia</th>
                <th className="py-3 px-3 text-center">Colaboradores</th>
                <th className="py-3 px-3 text-right">Percepciones</th>
                <th className="py-3 px-3 text-right">Deducciones</th>
                <th className="py-3 px-3 text-right font-bold text-zinc-800">Neto a Pagar</th>
                <th className="py-3 px-3 text-center">Horas Extra</th>
                <th className="py-3 px-3">Estado</th>
                <th className="py-3 px-3">Fechas Clave</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {filteredPeriods.map((period) => (
                <tr
                  key={period.id}
                  className={`hover:bg-zinc-50/60 transition-colors ${
                    period.estado === 'en_revision' ? 'bg-amber-50/20' : ''
                  }`}
                >
                  <td className="py-3.5 px-4 font-medium text-zinc-900">
                    <div className="font-semibold text-zinc-900">{period.codigo}</div>
                    <div className="text-[11px] text-zinc-500 font-normal">{period.nombre}</div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-zinc-100 text-zinc-700">
                      {period.tipo}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span className="font-semibold text-zinc-900">{period.totalEmpleados}</span>
                    <span className="text-[10px] text-zinc-400 block">empleados</span>
                  </td>
                  <td className="py-3.5 px-3 text-right text-zinc-700">
                    {formatCurrency(period.percepcionesTotales)}
                  </td>
                  <td className="py-3.5 px-3 text-right text-zinc-700">
                    {formatCurrency(period.deduccionesTotales)}
                  </td>
                  <td className="py-3.5 px-3 text-right font-bold text-zinc-900">
                    {formatCurrency(period.netoTotal)}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    {period.horasExtraTotales > 0 ? (
                      <span className="inline-flex items-center gap-1 font-semibold text-zinc-800">
                        {period.horasExtraTotales} h
                      </span>
                    ) : (
                      <span className="text-zinc-400">—</span>
                    )}
                  </td>
                  <td className="py-3.5 px-3">{getStatusBadge(period.estado)}</td>
                  <td className="py-3.5 px-3 text-zinc-500 text-[11px] space-y-0.5">
                    <div>
                      <span className="text-zinc-400">Pago:</span> {period.fechaPago}
                    </div>
                    {period.fechaTimbrado && (
                      <div className="text-emerald-700 font-medium">
                        <span className="text-zinc-400">SAT:</span> {period.fechaTimbrado}
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => setSelectedPeriod(period)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-zinc-700 bg-white border border-zinc-300 rounded hover:bg-zinc-50 shadow-sm transition-colors"
                        title="Ver detalle del periodo"
                      >
                        <Eye className="w-3.5 h-3.5 text-zinc-600" />
                        <span>Detalle</span>
                      </button>

                      <button
                        onClick={() => handleExportAccountingPolicy(period)}
                        className="p-1.5 text-zinc-500 hover:text-zinc-800 border border-zinc-200 rounded hover:bg-zinc-100 transition-colors"
                        title="Descargar póliza contable"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredPeriods.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-zinc-500 text-xs">
                    No se encontraron periodos con los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Period Detail Modal */}
      {selectedPeriod && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-bold text-sm">
                  {selectedPeriod.codigo.split('-')[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-zinc-900">Periodo {selectedPeriod.codigo}</h3>
                    {getStatusBadge(selectedPeriod.estado)}
                  </div>
                  <p className="text-xs text-zinc-500">{selectedPeriod.nombre}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedPeriod(null)}
                className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="px-6 border-b border-zinc-200 bg-white flex items-center gap-4 text-xs font-medium">
              {[
                { id: 'resumen', label: 'Resumen Financiero' },
                { id: 'empleados', label: `Colaboradores (${selectedPeriod.totalEmpleados})` },
                { id: 'incidencias', label: `Incidencias (${selectedPeriod.incidenciasTotales})` },
                { id: 'timbrado', label: 'CFDI 4.0 & Timbrado' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setPeriodDetailTab(tab.id as any)}
                  className={`py-3 border-b-2 transition-colors ${
                    periodDetailTab === tab.id
                      ? 'border-zinc-900 text-zinc-900 font-semibold'
                      : 'border-transparent text-zinc-500 hover:text-zinc-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex-1 text-xs">
              {periodDetailTab === 'resumen' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl border border-zinc-200 bg-white">
                      <span className="text-xs text-zinc-500">Percepciones Brutas</span>
                      <div className="text-xl font-bold text-zinc-900 mt-1">
                        {formatCurrency(selectedPeriod.percepcionesTotales)}
                      </div>
                      <span className="text-[11px] text-zinc-400">Sueldos, bonos y horas extras</span>
                    </div>

                    <div className="p-4 rounded-xl border border-zinc-200 bg-white">
                      <span className="text-xs text-zinc-500">Retenciones (Deducciones)</span>
                      <div className="text-xl font-bold text-rose-700 mt-1">
                        - {formatCurrency(selectedPeriod.deduccionesTotales)}
                      </div>
                      <span className="text-[11px] text-zinc-400">ISR Art. 96 + Cuota Obrera IMSS</span>
                    </div>

                    <div className="p-4 rounded-xl border border-emerald-500 bg-white shadow-sm">
                      <span className="text-xs text-emerald-800 font-medium">Neto Total Dispersado</span>
                      <div className="text-xl font-bold text-emerald-900 mt-1">
                        {formatCurrency(selectedPeriod.netoTotal)}
                      </div>
                      <span className="text-[11px] text-emerald-700">100% dispersado vía banco</span>
                    </div>
                  </div>

                  <div className="border border-zinc-200 rounded-xl p-4 bg-zinc-50/50 space-y-3">
                    <h4 className="font-semibold text-zinc-900 text-xs flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Trazabilidad y Validación del Cierre
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-zinc-600">
                      <div>
                        <span className="text-zinc-400">Fecha de Inicio:</span> {selectedPeriod.fechaInicio}
                      </div>
                      <div>
                        <span className="text-zinc-400">Fecha de Corte:</span> {selectedPeriod.fechaFin}
                      </div>
                      <div>
                        <span className="text-zinc-400">Fecha de Pago:</span> {selectedPeriod.fechaPago}
                      </div>
                      <div>
                        <span className="text-zinc-400">Cerrado por:</span> {selectedPeriod.cerradoPor || 'Paola Jiménez Lara (Nóminas)'}
                      </div>
                      {selectedPeriod.fechaTimbrado && (
                        <div>
                          <span className="text-zinc-400">Timbrado SAT:</span> {selectedPeriod.fechaTimbrado}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {periodDetailTab === 'empleados' && (
                <div className="space-y-3">
                  <p className="text-zinc-500 text-xs">
                    Muestra de colaboradores con desglose individual de percepciones y neto en este periodo.
                  </p>
                  <div className="border border-zinc-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600">
                        <tr>
                          <th className="py-2.5 px-3">Num</th>
                          <th className="py-2.5 px-3">Nombre</th>
                          <th className="py-2.5 px-3">Departamento</th>
                          <th className="py-2.5 px-3 text-right">Percepciones</th>
                          <th className="py-2.5 px-3 text-right">Deducciones</th>
                          <th className="py-2.5 px-3 text-right font-bold">Neto</th>
                          <th className="py-2.5 px-3 text-center">CFDI</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200">
                        {INITIAL_MOCK_PAYROLL_CALCULATIONS.slice(0, 8).map((calc) => (
                          <tr key={calc.empleadoId} className="hover:bg-zinc-50/50">
                            <td className="py-2 px-3 font-mono text-zinc-500">{calc.numeroEmpleado}</td>
                            <td className="py-2 px-3 font-medium text-zinc-900">{calc.empleadoNombre}</td>
                            <td className="py-2 px-3 text-zinc-600">{calc.departamento}</td>
                            <td className="py-2 px-3 text-right text-zinc-700">{formatCurrency(calc.totalPercepciones)}</td>
                            <td className="py-2 px-3 text-right text-zinc-700">{formatCurrency(calc.totalDeducciones)}</td>
                            <td className="py-2 px-3 text-right font-bold text-zinc-900">{formatCurrency(calc.netoAPagar)}</td>
                            <td className="py-2 px-3 text-center">
                              <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium bg-white text-emerald-700 border border-emerald-500">
                                Timbrado
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {periodDetailTab === 'incidencias' && (
                <div className="space-y-3">
                  <p className="text-zinc-500 text-xs">
                    Incidencias operativas autorizadas y procesadas para el cálculo de este periodo.
                  </p>
                  <div className="space-y-2">
                    <div className="p-3 border border-zinc-200 rounded-lg bg-white flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-zinc-900">Horas Extra Dobles Flexografía</div>
                        <div className="text-[11px] text-zinc-500">Carlos Mendoza Ruiz & José Luis Herrera · OP-95842</div>
                      </div>
                      <span className="font-bold text-zinc-900">3.5 h ($536.96)</span>
                    </div>

                    <div className="p-3 border border-zinc-200 rounded-lg bg-white flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-zinc-900">Permiso con Reposición (Regla RTM)</div>
                        <div className="text-[11px] text-zinc-500">Jesús Alberto Peña · 2.0 h solicitadas, 2.0 h repuestas en piso</div>
                      </div>
                      <span className="text-emerald-700 font-medium">Saldo: 0.0 h</span>
                    </div>

                    <div className="p-3 border border-zinc-200 rounded-lg bg-white flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-zinc-900">Incapacidad IMSS Enfermedad General</div>
                        <div className="text-[11px] text-zinc-500">Óscar Daniel Rocha · Folio EG-2026-904</div>
                      </div>
                      <span className="text-zinc-500 font-medium">Subsidio IMSS</span>
                    </div>
                  </div>
                </div>
              )}

              {periodDetailTab === 'timbrado' && (
                <div className="space-y-4">
                  <div className="p-4 border border-zinc-200 rounded-xl bg-zinc-50/50 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-zinc-900 text-sm">Proveedor Autorizado de Certificación (PAC)</div>
                      <div className="text-xs text-zinc-500 mt-0.5">CFDI Nómina Versión 4.0 · Complemento Nómina 1.2</div>
                    </div>
                    <span className="px-3 py-1 bg-white border border-emerald-500 text-emerald-800 rounded-full font-bold text-xs shadow-sm">
                      PAC Certificado SAT
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 border border-zinc-200 rounded-lg bg-white">
                      <span className="text-zinc-400">Total Comprobantes:</span>
                      <div className="font-bold text-zinc-900 text-sm mt-0.5">{selectedPeriod.totalEmpleados} CFDIs</div>
                    </div>
                    <div className="p-3 border border-zinc-200 rounded-lg bg-white">
                      <span className="text-zinc-400">Sello Digital SAT:</span>
                      <div className="font-mono text-[11px] text-zinc-600 truncate mt-0.5">FEA729A0-3819-4A92-B817-910482019481</div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => {
                        onTriggerToast('Descarga ZIP', 'Descargando paquete de 30 recibos PDF y XML...', 'info');
                        setTimeout(() => onTriggerToast('Descarga Completa', 'Archivo Nominas_CFDI_RTM.zip generado.', 'success'), 700);
                      }}
                      className="px-3 py-2 bg-zinc-900 text-white rounded-lg text-xs font-medium hover:bg-zinc-800 transition-colors shadow-sm"
                    >
                      Descargar Recibos (ZIP)
                    </button>
                    <button
                      onClick={() => handleExportAccountingPolicy(selectedPeriod)}
                      className="px-3 py-2 bg-white border border-zinc-300 text-zinc-700 rounded-lg text-xs font-medium hover:bg-zinc-50 transition-colors"
                    >
                      Exportar Póliza Contable
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-zinc-200 bg-zinc-50 flex items-center justify-end">
              <button
                onClick={() => setSelectedPeriod(null)}
                className="px-4 py-2 bg-white border border-zinc-300 text-zinc-700 text-xs font-medium rounded-lg hover:bg-zinc-100 transition-colors"
              >
                Cerrar Detalle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
