import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Plus,
  ArrowRight,
  CheckCircle2,
  Clock,
  Lock,
  FileCheck2,
  Users,
  DollarSign,
  AlertTriangle,
  Search,
  Filter,
  Copy,
  FolderOpen
} from 'lucide-react';
import { PayrollPeriod } from '../../data/mockNominaData';
import { formatCurrency } from '../../utils/payrollDemoHelpers';

interface CiclosNominaTabProps {
  periods: PayrollPeriod[];
  currentPeriodId: string;
  onSelectPeriod: (periodId: string) => void;
  onOpenNewCycleWizard: () => void;
  onDuplicateCycle: (period: PayrollPeriod) => void;
  onTriggerToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const CiclosNominaTab: React.FC<CiclosNominaTabProps> = ({
  periods,
  currentPeriodId,
  onSelectPeriod,
  onOpenNewCycleWizard,
  onDuplicateCycle,
  onTriggerToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'Todos' | 'Semanal' | 'Quincenal'>('Todos');
  const [statusFilter, setStatusFilter] = useState<string>('Todos');

  const filteredPeriods = useMemo(() => {
    return periods.filter((p) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        p.codigo.toLowerCase().includes(term) ||
        p.nombre.toLowerCase().includes(term);
      const matchesType = typeFilter === 'Todos' || p.tipo === typeFilter;
      const matchesStatus = statusFilter === 'Todos' || p.estado === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [periods, searchTerm, typeFilter, statusFilter]);

  const getStatusBadge = (status: PayrollPeriod['estado']) => {
    switch (status) {
      case 'timbrada':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Timbrada
          </span>
        );
      case 'cerrada':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-300">
            <Lock className="w-3 h-3 text-blue-600" />
            Cerrada
          </span>
        );
      case 'en_revision':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-300">
            <Clock className="w-3 h-3 text-amber-600" />
            En Revisión
          </span>
        );
      case 'autorizada':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-300">
            <FileCheck2 className="w-3 h-3 text-purple-600" />
            Autorizada
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-zinc-100 text-zinc-700 border border-zinc-300">
            Borrador
          </span>
        );
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Top Banner / Explanation */}
      <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-zinc-950">Gestión de Ciclos de Nómina</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-800 border border-zinc-300">
              Planta Reynosa
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Periodos de pago preparados, revisados, autorizados y timbrados en el ERP RTM
          </p>
        </div>

        <button
          onClick={onOpenNewCycleWizard}
          className="px-4 py-2.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Nuevo ciclo de nómina</span>
        </button>
      </div>

      {/* KPI Cards Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-white border border-zinc-200 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Ciclos Registrados</span>
            <Calendar className="w-4 h-4 text-theme-primary" />
          </div>
          <div className="text-xl font-black text-zinc-900 font-mono">{periods.length}</div>
          <p className="text-[10px] text-zinc-500 mt-0.5">Semanales y quincenales</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-zinc-200 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">En Operación / Revisión</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-black text-amber-700 font-mono">
            {periods.filter((p) => p.estado === 'en_revision' || p.estado === 'borrador').length}
          </div>
          <p className="text-[10px] text-zinc-500 mt-0.5">Capturando incidencias y horas</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-zinc-200 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Timbrados SAT</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-black text-emerald-700 font-mono">
            {periods.filter((p) => p.estado === 'timbrada').length}
          </div>
          <p className="text-[10px] text-zinc-500 mt-0.5">Comprobantes CFDI 4.0 concluidos</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-zinc-200 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Ciclo Activo</span>
            <FolderOpen className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-sm font-bold text-blue-700 truncate font-mono">
            {periods.find((p) => p.id === currentPeriodId)?.codigo || 'SEM-2026-36'}
          </div>
          <p className="text-[10px] text-zinc-500 mt-0.5">Seleccionado para navegación</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por código, fechas o nombre del ciclo..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-900 text-xs focus:bg-white focus:ring-2 focus:ring-theme-primary/20 outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-zinc-200 bg-white text-zinc-900 text-xs font-medium focus:ring-2 focus:ring-theme-primary/20 outline-none"
          >
            <option value="Todos">Tipo: Todos</option>
            <option value="Semanal">Semanal</option>
            <option value="Quincenal">Quincenal</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-zinc-200 bg-white text-zinc-900 text-xs font-medium focus:ring-2 focus:ring-theme-primary/20 outline-none"
          >
            <option value="Todos">Estado: Todos</option>
            <option value="borrador">Borrador</option>
            <option value="en_revision">En revisión</option>
            <option value="autorizada">Autorizada</option>
            <option value="cerrada">Cerrada</option>
            <option value="timbrada">Timbrada</option>
          </select>
        </div>
      </div>

      {/* Cycles Table */}
      <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
              <tr>
                <th className="px-4 py-3">Código & Periodo</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Rango de Fechas</th>
                <th className="px-4 py-3">Fecha Pago</th>
                <th className="px-4 py-3 text-center">Colaboradores</th>
                <th className="px-4 py-3 text-center">Incidencias</th>
                <th className="px-4 py-3 text-right">Neto Estimado</th>
                <th className="px-4 py-3 text-center">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredPeriods.map((p) => {
                const isCurrent = p.id === currentPeriodId;
                return (
                  <tr
                    key={p.id}
                    className={`hover:bg-zinc-50/70 transition-colors ${
                      isCurrent ? 'bg-blue-50/30 font-medium' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-zinc-900 text-xs">
                          {p.codigo}
                        </span>
                        {isCurrent && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-100 text-blue-700 border border-blue-200">
                            Activo
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-zinc-500 truncate max-w-xs">{p.nombre}</div>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          p.tipo === 'Semanal'
                            ? 'bg-zinc-100 text-zinc-800 border-zinc-300'
                            : 'bg-purple-50 text-purple-700 border-purple-200'
                        }`}
                      >
                        {p.tipo}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-zinc-600 font-mono text-[11px]">
                      {p.fechaInicio} &rarr; {p.fechaFin}
                    </td>

                    <td className="px-4 py-3 text-zinc-700 font-mono text-[11px]">
                      {p.fechaPago}
                    </td>

                    <td className="px-4 py-3 text-center font-mono font-semibold text-zinc-900">
                      {p.totalEmpleados}
                    </td>

                    <td className="px-4 py-3 text-center font-mono">
                      <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 text-[10px] font-bold border border-zinc-200">
                        {p.incidenciasTotales}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right font-mono font-bold text-zinc-900">
                      {formatCurrency(p.netoTotal)}
                    </td>

                    <td className="px-4 py-3 text-center">
                      {getStatusBadge(p.estado)}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            onSelectPeriod(p.id);
                            onTriggerToast(`Ciclo ${p.codigo} seleccionado como periodo activo`, 'info');
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer ${
                            isCurrent
                              ? 'bg-blue-600 text-white'
                              : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-300'
                          }`}
                          title="Cargar y abrir este ciclo en el módulo"
                        >
                          <span>{isCurrent ? 'Abierto' : 'Abrir ciclo'}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>

                        <button
                          onClick={() => onDuplicateCycle(p)}
                          className="p-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-100 text-zinc-600 transition-colors cursor-pointer"
                          title="Duplicar configuración de este ciclo para crear el siguiente"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
