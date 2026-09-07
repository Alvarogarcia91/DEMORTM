import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Download,
  UploadCloud,
  FileSpreadsheet,
  Eye,
  Building2,
  Users,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Employee, EmployeePayroll, VacationBalance, VacationRequest, EmployeeLoan } from '../../data/mockNominaData';
import { EmployeeDrawer } from './EmployeeDrawer';
import { ImportModalFake } from './ImportModalFake';

interface EmployeesTableProps {
  employees: Employee[];
  payrollCalculations: EmployeePayroll[];
  onTriggerToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  vacationBalances?: VacationBalance[];
  vacationRequests?: VacationRequest[];
  loans?: EmployeeLoan[];
}

export const EmployeesTable: React.FC<EmployeesTableProps> = ({
  employees,
  payrollCalculations,
  onTriggerToast,
  vacationBalances = [],
  vacationRequests = [],
  loans = [],
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('TODOS');
  const [selectedShift, setSelectedShift] = useState('TODOS');
  const [selectedNominaType, setSelectedNominaType] = useState('TODOS');
  const [selectedStatus, setSelectedStatus] = useState('TODOS');

  // Drawers and Modals
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Departments list for filter
  const departments = ['TODOS', 'Flexografía', 'Offset', 'Acabado', 'Serigrafía', 'Almacén', 'Mantenimiento', 'Calidad', 'Planeación', 'Manufactura', 'RH'];

  const filteredEmployees = employees.filter((emp) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      emp.nombre.toLowerCase().includes(term) ||
      emp.numeroEmpleado.toLowerCase().includes(term) ||
      emp.puesto.toLowerCase().includes(term) ||
      emp.rfc.toLowerCase().includes(term);

    const matchesDept = selectedDept === 'TODOS' || emp.departamento === selectedDept;
    const matchesShift = selectedShift === 'TODOS' || emp.turno.includes(selectedShift);
    const matchesNomina = selectedNominaType === 'TODOS' || emp.tipoNomina === selectedNominaType;
    const matchesStatus = selectedStatus === 'TODOS' || emp.estatus === selectedStatus;

    return matchesSearch && matchesDept && matchesShift && matchesNomina && matchesStatus;
  });

  const handleDownloadTemplate = () => {
    onTriggerToast('Plantilla de empleados descargada correctamente · RTM_Plantilla_Empleados_2026.xlsx', 'success');
  };

  const handleExportEmployees = () => {
    onTriggerToast(`Exportación completada · ${filteredEmployees.length} colaboradores exportados a Excel`, 'success');
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Toolbar Superior */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-zinc-950">Catálogo Maestro de Colaboradores</h2>
          <p className="text-xs text-zinc-500">30 colaboradores activos en Planta Reynosa (24 de piso / 6 administrativos)</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleDownloadTemplate}
            className="px-3 py-2 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-xs font-semibold text-zinc-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Descargar formato Excel"
          >
            <Download className="w-3.5 h-3.5 text-zinc-500" />
            <span>Descargar plantilla</span>
          </button>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-3 py-2 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-xs font-semibold text-zinc-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Importar registros desde Excel"
          >
            <UploadCloud className="w-3.5 h-3.5 text-theme-primary" />
            <span>Importar plantilla</span>
          </button>

          <button
            onClick={handleExportEmployees}
            className="px-3 py-2 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-xs font-semibold text-zinc-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Exportar</span>
          </button>

          <button
            onClick={() => {
              setSelectedEmployee(employees[0]);
              setIsDrawerOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo empleado</span>
          </button>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por colaborador, número, puesto o RFC..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-900 text-xs focus:bg-white focus:ring-2 focus:ring-theme-primary/20 outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 text-zinc-500 font-semibold">
            <Filter className="w-3.5 h-3.5" />
            <span>Filtros:</span>
          </div>

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 rounded-xl border border-zinc-200 bg-white text-zinc-900 text-xs font-medium focus:ring-2 focus:ring-theme-primary/20 outline-none"
          >
            {departments.map((d) => (
              <option key={d} value={d}>{d === 'TODOS' ? 'Depto: Todos' : d}</option>
            ))}
          </select>

          <select
            value={selectedNominaType}
            onChange={(e) => setSelectedNominaType(e.target.value)}
            className="px-3 py-2 rounded-xl border border-zinc-200 bg-white text-zinc-900 text-xs font-medium focus:ring-2 focus:ring-theme-primary/20 outline-none"
          >
            <option value="TODOS">Nómina: Todas</option>
            <option value="Semanal">Semanal (Piso)</option>
            <option value="Quincenal">Quincenal (Admin)</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-zinc-200 bg-white text-zinc-900 text-xs font-medium focus:ring-2 focus:ring-theme-primary/20 outline-none"
          >
            <option value="TODOS">Estatus: Todos</option>
            <option value="Activo">Activo</option>
            <option value="Vacaciones">Vacaciones</option>
            <option value="Incapacidad">Incapacidad</option>
          </select>
        </div>
      </div>

      {/* Tabla de Empleados */}
      <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
              <tr>
                <th className="px-4 py-3">No. Emp</th>
                <th className="px-4 py-3">Colaborador / RFC</th>
                <th className="px-4 py-3">Puesto</th>
                <th className="px-4 py-3">Departamento</th>
                <th className="px-4 py-3">Turno</th>
                <th className="px-4 py-3">Frecuencia</th>
                <th className="px-4 py-3 text-center">Estatus</th>
                <th className="px-4 py-3 text-center">Estado Fiscal</th>
                <th className="px-4 py-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-zinc-400">
                    No se encontraron colaboradores con los criterios seleccionados.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => {
                  const isFiscalOk = emp.estadoFiscal === 'Validado SAT';
                  return (
                    <tr key={emp.id} className="hover:bg-zinc-50/70 transition-colors">
                      {/* No. Emp */}
                      <td className="px-4 py-3 font-mono font-bold text-zinc-950">
                        {emp.numeroEmpleado}
                      </td>

                      {/* Nombre & RFC */}
                      <td className="px-4 py-3">
                        <div className="font-bold text-zinc-900">{emp.nombre}</div>
                        <div className="text-[10px] font-mono text-zinc-400">{emp.rfc}</div>
                      </td>

                      {/* Puesto */}
                      <td className="px-4 py-3 text-zinc-700 font-medium">
                        {emp.puesto}
                      </td>

                      {/* Departamento */}
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-800 text-[10px] font-semibold border border-zinc-200">
                          {emp.departamento}
                        </span>
                      </td>

                      {/* Turno */}
                      <td className="px-4 py-3 text-zinc-600 text-[11px]">
                        {emp.turno.split(' ')[0]} {emp.turno.split(' ')[1] || ''}
                      </td>

                      {/* Tipo Nómina */}
                      <td className="px-4 py-3 font-semibold text-zinc-700">
                        {emp.tipoNomina}
                      </td>

                      {/* Estatus */}
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 shadow-2xs ${
                          emp.estatus === 'Activo'
                            ? 'border border-emerald-500'
                            : emp.estatus === 'Vacaciones'
                            ? 'border border-blue-500'
                            : 'border border-amber-500'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            emp.estatus === 'Activo' ? 'bg-emerald-500' : emp.estatus === 'Vacaciones' ? 'bg-blue-500' : 'bg-amber-500'
                          }`} />
                          <span>{emp.estatus}</span>
                        </span>
                      </td>

                      {/* Estado Fiscal */}
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 shadow-2xs ${
                          isFiscalOk
                            ? 'border border-emerald-500'
                            : 'border border-amber-500'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isFiscalOk ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                          <span>{emp.estadoFiscal}</span>
                        </span>
                      </td>

                      {/* Acción */}
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedEmployee(emp);
                            setIsDrawerOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-lg border border-zinc-200 hover:bg-zinc-100 text-[11px] font-bold text-zinc-800 transition-colors flex items-center gap-1 ml-auto cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-zinc-500" />
                          <span>Ver Ficha</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer de Empleado */}
      <EmployeeDrawer
        employee={selectedEmployee}
        payrollCalc={payrollCalculations.find((c) => c.empleadoId === selectedEmployee?.id)}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedEmployee(null);
        }}
        vacationBalance={vacationBalances.find((balance) => balance.employeeId === selectedEmployee?.id)}
        vacationRequests={vacationRequests.filter((request) => request.employeeId === selectedEmployee?.id)}
        loans={loans.filter((loan) => loan.employeeId === selectedEmployee?.id)}
      />

      {/* Modal de Importación Fake */}
      <ImportModalFake
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Importar Catálogo de Colaboradores"
        subtitle="Carga masiva de plantilla desde archivo Excel o export de CONTPAQi"
        templateFileName="RTM_Plantilla_Empleados_2026.xlsx"
        sampleColumns={['No. Emp', 'Nombre Completo', 'Puesto', 'Departamento', 'Turno', 'Salario Diario', 'RFC', 'CURP', 'NSS']}
        sampleRows={[
          ['RTM-001', 'Carlos Mendoza Ruiz', 'Operador Mark Andy 830 7”', 'Flexografía', 'Turno 1', '$485.50', 'MERC890412H91', 'MERC890412HDFNR03', '12148901248'],
          ['RTM-002', 'José Luis Herrera Soto', 'Operador Mark Andy 830 10”', 'Flexografía', 'Turno 1', '$495.00', 'HESJ840219LK2', 'HESJ840219HDFRTL08', '12108402195'],
          ['RTM-003', 'Miguel Ángel Treviño', 'Operador Mark Andy Scout', 'Flexografía', 'Turno 2', '$460.00', 'TRMA920703P82', 'TRMA920703HDFRNG02', '12169207031'],
          ['RTM-004', 'Ricardo Salinas Garza', 'Operador Mark Andy 4120', 'Flexografía', 'Turno 2', '$475.00', 'SAGR871114TA4', 'SAGR871114HDFRZD01', '12128711148'],
          ['RTM-005', 'Jesús Alberto Peña', 'Operador BGM', 'Flexografía', 'Turno 1', '$440.00', 'PEAJ940508N71', 'PEAJ940508HDFRSC05', '12189405084'],
        ]}
        onSuccessMessage="Importación completada · 30 registros procesados · 30 correctos · 0 rechazados"
        onSuccess={() => {
          onTriggerToast('Importación completada · 30 registros procesados · 30 correctos · 0 rechazados', 'success');
        }}
      />
    </div>
  );
};
