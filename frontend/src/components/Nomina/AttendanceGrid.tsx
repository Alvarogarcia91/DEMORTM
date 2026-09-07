import React, { useState } from 'react';
import {
  Clock,
  Download,
  UploadCloud,
  RefreshCw,
  FileSpreadsheet,
  Scale,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  AlertTriangle,
  AlertCircle
} from 'lucide-react';
import { Employee, AttendanceWeek, DayAttendance, ProductionReconciliation } from '../../data/mockNominaData';
import { AttendanceDetailDrawer } from './AttendanceDetailDrawer';
import { ProductionReconciliationModal } from './ProductionReconciliationModal';
import { ImportModalFake } from './ImportModalFake';

interface AttendanceGridProps {
  employees: Employee[];
  attendanceWeeks: AttendanceWeek[];
  reconciliations: ProductionReconciliation[];
  onTriggerToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const AttendanceGrid: React.FC<AttendanceGridProps> = ({
  employees,
  attendanceWeeks,
  reconciliations,
  onTriggerToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('TODOS');
  const [isRecalculating, setIsRecalculating] = useState(false);

  // Modals & Drawers
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedDay, setSelectedDay] = useState<DayAttendance | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isReconciliationOpen, setIsReconciliationOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const departments = ['TODOS', 'Flexografía', 'Offset', 'Acabado', 'Serigrafía', 'Almacén', 'Mantenimiento', 'Calidad', 'Planeación', 'Manufactura', 'RH'];

  const filteredEmployees = employees.filter((emp) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      emp.nombre.toLowerCase().includes(term) ||
      emp.numeroEmpleado.toLowerCase().includes(term) ||
      emp.puesto.toLowerCase().includes(term);

    const matchesDept = selectedDept === 'TODOS' || emp.departamento === selectedDept;
    return matchesSearch && matchesDept;
  });

  const handleRecalculateWeek = () => {
    setIsRecalculating(true);
    setTimeout(() => {
      setIsRecalculating(false);
      onTriggerToast('Asistencia recalculada · 30 colaboradores · 5 incidencias detectadas en piso', 'success');
    }, 1200);
  };

  const handleDownloadTemplate = () => {
    onTriggerToast('Plantilla de checadas descargada correctamente · RTM_Checadas_Semana36.xlsx', 'success');
  };

  const handleExportAttendance = () => {
    onTriggerToast('Exportación completada · Matriz de asistencia semanal exportada a Excel', 'success');
  };

  const handleOpenDayDetail = (emp: Employee, day: DayAttendance) => {
    setSelectedEmployee(emp);
    setSelectedDay(day);
    setIsDetailDrawerOpen(true);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Toolbar Superior */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-zinc-950">Matriz de Asistencia Semanal</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 border border-zinc-300 shadow-2xs">
              31 ago – 06 sep 2026
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">Control de entradas, salidas, tiempos de comida, horas extra y retardos</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Botón Conciliación RTM */}
          <button
            onClick={() => setIsReconciliationOpen(true)}
            className="px-3 py-2 rounded-xl bg-theme-primary/10 border border-theme-primary/30 hover:bg-theme-primary/20 text-xs font-bold text-theme-primary flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Comparar horas reloj contra órdenes de producción"
          >
            <Scale className="w-4 h-4" />
            <span>Conciliación Reloj vs Producción</span>
          </button>

          <button
            onClick={handleDownloadTemplate}
            className="px-3 py-2 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-xs font-semibold text-zinc-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-zinc-500" />
            <span>Plantilla</span>
          </button>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-3 py-2 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-xs font-semibold text-zinc-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <UploadCloud className="w-3.5 h-3.5 text-theme-primary" />
            <span>Importar checadas</span>
          </button>

          <button
            onClick={handleRecalculateWeek}
            disabled={isRecalculating}
            className="px-3 py-2 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-xs font-semibold text-zinc-700 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isRecalculating ? 'animate-spin' : ''}`} />
            <span>{isRecalculating ? 'Recalculando...' : 'Recalcular'}</span>
          </button>

          <button
            onClick={handleExportAttendance}
            className="px-3 py-2 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-xs font-semibold text-zinc-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Barra de Búsqueda y Filtros */}
      <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por colaborador, número de empleado o puesto..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-900 text-xs focus:bg-white focus:ring-2 focus:ring-theme-primary/20 outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-zinc-500 font-semibold">Departamento:</span>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 rounded-xl border border-zinc-200 bg-white text-zinc-900 text-xs font-medium focus:ring-2 focus:ring-theme-primary/20 outline-none"
          >
            {departments.map((d) => (
              <option key={d} value={d}>{d === 'TODOS' ? 'Todos los departamentos' : d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Matriz Semanal Tipo Grid */}
      <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
              <tr>
                <th className="px-3.5 py-3 sticky left-0 bg-zinc-50 z-10">Colaborador</th>
                <th className="px-3 py-3 text-center min-w-[105px]">Lun 31</th>
                <th className="px-3 py-3 text-center min-w-[105px]">Mar 01</th>
                <th className="px-3 py-3 text-center min-w-[105px]">Mié 02</th>
                <th className="px-3 py-3 text-center min-w-[105px]">Jue 03</th>
                <th className="px-3 py-3 text-center min-w-[105px]">Vie 04</th>
                <th className="px-3 py-3 text-center min-w-[105px]">Sáb 05</th>
                <th className="px-3 py-3 text-center">Horas Ord</th>
                <th className="px-3 py-3 text-center">Extra</th>
                <th className="px-3 py-3 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredEmployees.map((emp) => {
                const attWeek = attendanceWeeks.find((w) => w.empleadoId === emp.id);
                if (!attWeek) return null;

                return (
                  <tr key={emp.id} className="hover:bg-zinc-50/70 transition-colors">
                    {/* Empleado Fijo */}
                    <td className="px-3.5 py-3 sticky left-0 bg-white hover:bg-zinc-50 transition-colors z-10 border-r border-zinc-100 shadow-2xs">
                      <div className="font-bold text-zinc-900 text-xs truncate max-w-[170px]">{emp.nombre}</div>
                      <div className="text-[10px] text-zinc-400 font-mono">
                        {emp.numeroEmpleado} · <span className="text-zinc-600">{emp.departamento}</span>
                      </div>
                    </td>

                    {/* Días Lun a Sáb */}
                    {attWeek.dias.map((day) => {
                      const isVac = day.tipoDia === 'vacaciones';
                      const isIncap = day.tipoDia === 'incapacidad';
                      const isIncomp = day.tipoDia === 'checada_incompleta';
                      const isRet = day.retardoMinutos > 0;
                      const isExtra = day.horasAdicionales > 0;
                      const isRep = day.tipoDia === 'permiso_reposicion';

                      return (
                        <td
                          key={day.dia}
                          onClick={() => handleOpenDayDetail(emp, day)}
                          className="px-2 py-2 text-center cursor-pointer hover:bg-zinc-100/70 transition-colors border-r border-zinc-100"
                        >
                          {isVac ? (
                            <span className="inline-block px-2 py-1 rounded-md text-[10px] font-bold bg-white text-zinc-900 border border-blue-400 shadow-2xs">
                              Vacaciones
                            </span>
                          ) : isIncap ? (
                            <span className="inline-block px-2 py-1 rounded-md text-[10px] font-bold bg-white text-zinc-900 border border-amber-500 shadow-2xs">
                              Incapacidad
                            </span>
                          ) : isIncomp ? (
                            <div className="space-y-0.5">
                              <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-white text-zinc-900 border border-rose-500 shadow-2xs animate-pulse">
                                Salida omitida
                              </span>
                              <div className="font-mono text-[9px] text-zinc-400">{day.entrada} &rarr; --:--</div>
                            </div>
                          ) : (
                            <div className="space-y-0.5">
                              <div className="font-mono text-[10px] text-zinc-700 font-medium">
                                {day.entrada} &rarr; {day.salida}
                              </div>
                              <div className="flex items-center justify-center gap-1 text-[9px]">
                                <span className="font-mono text-zinc-500">{day.horasTrabajadas.toFixed(1)}h</span>
                                {isExtra && (
                                  <span className="px-1 rounded bg-white text-zinc-900 border border-amber-500 font-bold font-mono text-[8px] shadow-2xs">
                                    +{day.horasAdicionales}h
                                  </span>
                                )}
                                {isRet && (
                                  <span className="px-1 rounded bg-white text-zinc-900 border border-rose-500 font-bold font-mono text-[8px] shadow-2xs">
                                    +{day.retardoMinutos}m
                                  </span>
                                )}
                                {isRep && (
                                  <span className="px-1 rounded bg-white text-zinc-900 border border-blue-500 font-bold font-mono text-[8px] shadow-2xs">
                                    Rep.
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </td>
                      );
                    })}

                    {/* Totales */}
                    <td className="px-3 py-3 text-center font-mono font-bold text-zinc-900">
                      {attWeek.totalHorasOrdinarias.toFixed(1)} h
                    </td>

                    <td className="px-3 py-3 text-center font-mono font-bold text-amber-700">
                      {attWeek.totalHorasAdicionales > 0 ? `+${attWeek.totalHorasAdicionales.toFixed(1)} h` : '—'}
                    </td>

                    <td className="px-3 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 shadow-2xs ${
                        attWeek.estadoRevision === 'completo'
                          ? 'border border-emerald-500'
                          : attWeek.estadoRevision === 'checada_incompleta'
                          ? 'border border-rose-500'
                          : 'border border-amber-500'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          attWeek.estadoRevision === 'completo' ? 'bg-emerald-500' : 'bg-rose-500'
                        }`} />
                        <span>{attWeek.estadoRevision === 'completo' ? 'OK' : 'Revisar'}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer de Detalle Diario */}
      <AttendanceDetailDrawer
        employee={selectedEmployee}
        dayAttendance={selectedDay}
        isOpen={isDetailDrawerOpen}
        onClose={() => {
          setIsDetailDrawerOpen(false);
          setSelectedEmployee(null);
          setSelectedDay(null);
        }}
      />

      {/* Modal de Conciliación RTM Reloj vs Producción */}
      <ProductionReconciliationModal
        isOpen={isReconciliationOpen}
        onClose={() => setIsReconciliationOpen(false)}
        reconciliations={reconciliations}
      />

      {/* Modal de Importar Checadas Fake */}
      <ImportModalFake
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Importar Checadas de Reloj Biométrico"
        subtitle="Simulación de archivo de reloj checador: Excel (.xlsx), CSV o exportación .dat (ZKTeco / biométrico)"
        templateFileName="RTM_Checadas_ZKTeco_W36.dat"
        sampleColumns={['ID Marcaje', 'No. Emp', 'Fecha', 'Hora', 'Torniquete / Lector', 'Tipo']}
        sampleRows={[
          ['CHK-90481', 'RTM-001', '31/08/2026', '06:58:12', 'Acceso Principal 01', 'Entrada'],
          ['CHK-90482', 'RTM-002', '31/08/2026', '06:55:40', 'Acceso Principal 01', 'Entrada'],
          ['CHK-90483', 'RTM-003', '31/08/2026', '14:52:10', 'Acceso Principal 02', 'Entrada'],
          ['CHK-90484', 'RTM-004', '31/08/2026', '14:58:30', 'Acceso Principal 02', 'Entrada'],
          ['CHK-90485', 'RTM-005', '31/08/2026', '06:59:05', 'Acceso Principal 01', 'Entrada'],
        ]}
        onSuccessMessage="1,284 checadas procesadas · 1,279 válidas · 5 requieren revisión"
        onSuccess={() => {
          onTriggerToast('1,284 checadas procesadas · 1,279 válidas · 5 requieren revisión en planta', 'info');
        }}
      />
    </div>
  );
};
