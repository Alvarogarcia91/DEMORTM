import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  AlertTriangle,
  Receipt,
  FileCheck2,
  History,
  RefreshCw,
  CheckCircle2,
  X,
  AlertCircle,
  Info,
  Calendar,
} from 'lucide-react';

import {
  Employee,
  AttendanceWeek,
  Incident,
  ProductionReconciliation,
  EmployeePayroll,
  PayrollPeriod,
  PayrollAuditEntry,
  INITIAL_MOCK_EMPLOYEES,
  INITIAL_MOCK_INCIDENTS,
  INITIAL_MOCK_ATTENDANCE,
  INITIAL_MOCK_RECONCILIATIONS,
  INITIAL_MOCK_PAYROLL_CALCULATIONS,
  INITIAL_MOCK_PAYROLL_PERIODS,
  INITIAL_MOCK_AUDIT_LOG,
} from '../../data/mockNominaData';

// Child components
import { PayrollCloseStepper } from './PayrollCloseStepper';
import { PayrollDashboard } from './PayrollDashboard';
import { EmployeesTable } from './EmployeesTable';
import { AttendanceGrid } from './AttendanceGrid';
import { IncidentCenter } from './IncidentCenter';
import { PayrollReviewTable } from './PayrollReviewTable';
import { StampCenter } from './StampCenter';
import { PayrollHistory } from './PayrollHistory';
import { PayrollAuditDrawer } from './PayrollAuditDrawer';
import { CiclosNominaTab } from './CiclosNominaTab';
import { NuevoCicloWizardModal } from './NuevoCicloWizardModal';
import { ChevronDown, Plus } from 'lucide-react';

export type NominaSubTab =
  | 'ciclos'
  | 'resumen'
  | 'personal'
  | 'asistencia'
  | 'incidencias'
  | 'prenomina'
  | 'timbrado'
  | 'historial';

interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export const NominaPage: React.FC = () => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<NominaSubTab>('ciclos');
  const [isAuditDrawerOpen, setIsAuditDrawerOpen] = useState<boolean>(false);
  const [isNewCycleWizardOpen, setIsNewCycleWizardOpen] = useState<boolean>(false);
  const [wizardInitialValues, setWizardInitialValues] = useState<Partial<PayrollPeriod> | undefined>(undefined);

  // Core Data State
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_MOCK_EMPLOYEES);
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_MOCK_INCIDENTS);
  const [attendance, setAttendance] = useState<AttendanceWeek[]>(INITIAL_MOCK_ATTENDANCE);
  const [reconciliations] = useState<ProductionReconciliation[]>(INITIAL_MOCK_RECONCILIATIONS);
  const [calculations, setCalculations] = useState<EmployeePayroll[]>(INITIAL_MOCK_PAYROLL_CALCULATIONS);
  const [periods, setPeriods] = useState<PayrollPeriod[]>(INITIAL_MOCK_PAYROLL_PERIODS);
  const [currentPeriodId, setCurrentPeriodId] = useState<string>('per-2026-36');
  const [auditLog, setAuditLog] = useState<PayrollAuditEntry[]>(INITIAL_MOCK_AUDIT_LOG);

  // Period Closing State
  const [isPayrollClosed, setIsPayrollClosed] = useState<boolean>(false);

  // Toast Notification System (replaces all browser alert())
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const addToast = (
    title: string,
    message: string,
    type: 'success' | 'info' | 'warning' | 'error' = 'info'
  ) => {
    const newToast: ToastNotification = {
      id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title,
      message,
      type,
    };
    setToasts((prev) => [...prev, newToast]);

    // Auto dismiss after 4.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4500);
  };

  const handleToast = (message: string, type?: 'success' | 'info' | 'warning') => {
    addToast(
      type === 'success'
        ? 'Operación Exitosa'
        : type === 'warning'
        ? 'Atención Requerida'
        : 'Información RTM',
      message,
      type || 'info'
    );
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Add audit log helper
  const recordAuditAction = (
    accion: string,
    detalle: string,
    motivo?: string,
    usuario: string = 'Paola Jiménez Lara (Nóminas)'
  ) => {
    const newEntry: PayrollAuditEntry = {
      id: `aud-${Date.now().toString().slice(-4)}`,
      fechaHora: new Date().toISOString().replace('T', ' ').slice(0, 16),
      usuario,
      accion,
      detalle,
      motivo,
    };
    setAuditLog((prev) => [newEntry, ...prev]);
  };

  // Handler for closing payroll period
  const handleClosePayroll = () => {
    setIsPayrollClosed(true);
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);

    // Update current period state in periods list
    setPeriods((prev) =>
      prev.map((p) =>
        p.id === 'per-2026-36'
          ? {
              ...p,
              estado: 'cerrada',
              fechaCierre: nowStr,
              cerradoPor: 'Paola Jiménez Lara (Nóminas)',
            }
          : p
      )
    );

    recordAuditAction(
      'Cierre de Periodo',
      'Periodo SEM-2026-36 cerrado exitosamente tras validar lista de 5 puntos de control.',
      'Cierre ordinario de nómina para inicio de dispersión bancaria y timbrado CFDI.'
    );

    addToast(
      'Nómina Cerrada',
      'Periodo SEM-2026-36 cerrado exitosamente. Ya puedes proceder al paso de Timbrado CFDI 4.0.',
      'success'
    );
  };

  // Handler for reopening payroll period
  const handleReopenPayroll = (justification: string) => {
    setIsPayrollClosed(false);
    setPeriods((prev) =>
      prev.map((p) => (p.id === 'per-2026-36' ? { ...p, estado: 'en_revision', fechaCierre: undefined } : p))
    );

    recordAuditAction(
      'Reapertura de Periodo',
      'Periodo SEM-2026-36 reabierto para ajustes operativos.',
      justification
    );

    addToast(
      'Nómina Reabierta',
      'El periodo ahora permite modificaciones y ajustes antes de volver a cerrar.',
      'warning'
    );
  };

  // Handle Incidents Authorize/Reject
  const handleAuthorizeIncident = (id: string) => {
    const target = incidents.find((i) => i.id === id);
    if (!target) return;

    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === id
          ? {
              ...inc,
              estado: 'autorizada',
              autorizadoPor: 'Andrea Salazar Ruiz (RH)',
              fechaAutorizacion: new Date().toISOString().replace('T', ' ').slice(0, 16),
            }
          : inc
      )
    );

    recordAuditAction(
      'Autorización de Incidencia',
      `Incidencia ${id} (${target.tipo}) autorizada para ${target.empleadoNombre}.`,
      target.motivo
    );

    handleToast(`Incidencia ${id} autorizada exitosamente.`, 'success');
  };

  const handleRejectIncident = (id: string) => {
    const target = incidents.find((i) => i.id === id);
    if (!target) return;

    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === id
          ? {
              ...inc,
              estado: 'rechazada',
            }
          : inc
      )
    );

    recordAuditAction(
      'Rechazo de Incidencia',
      `Incidencia ${id} (${target.tipo}) rechazada para ${target.empleadoNombre}.`,
      'No procede según criterio de supervisión de planta.'
    );

    handleToast(`Incidencia ${id} rechazada.`, 'warning');
  };

  const isAllStamped = calculations.every((c) => c.cfdiStatus === 'timbrado');
  const timbradosCount = calculations.filter((c) => c.cfdiStatus === 'timbrado').length;
  const currentPeriod = periods.find((p) => p.id === currentPeriodId) || periods[0] || INITIAL_MOCK_PAYROLL_PERIODS[0];

  const tabsConfig: { id: NominaSubTab; label: string; icon: React.ReactNode; badgeCount?: number }[] = [
    { id: 'ciclos', label: 'Ciclos', icon: <Calendar className="w-4 h-4" />, badgeCount: periods.length },
    { id: 'resumen', label: 'Resumen', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'personal', label: 'Personal', icon: <Users className="w-4 h-4" />, badgeCount: employees.length },
    {
      id: 'asistencia',
      label: 'Asistencia',
      icon: <CalendarCheck className="w-4 h-4" />,
      badgeCount: attendance.filter((a) => a.estadoRevision !== 'completo').length,
    },
    {
      id: 'incidencias',
      label: 'Incidencias',
      icon: <AlertTriangle className="w-4 h-4" />,
      badgeCount: incidents.filter((i) => i.estado === 'pendiente_revision' || i.estado === 'detectada').length,
    },
    {
      id: 'prenomina',
      label: 'Pre-nómina',
      icon: <Receipt className="w-4 h-4" />,
      badgeCount: isPayrollClosed ? undefined : calculations.filter((c) => c.estadoValidacion === 'requiere_revision').length,
    },
    { id: 'timbrado', label: 'Timbrado CFDI', icon: <FileCheck2 className="w-4 h-4" />, badgeCount: isPayrollClosed && !isAllStamped ? 30 - timbradosCount : undefined },
    { id: 'historial', label: 'Historial', icon: <History className="w-4 h-4" /> },
  ];

  const handleCreateNewCycle = (newPeriod: PayrollPeriod) => {
    setPeriods((prev) => [newPeriod, ...prev]);
    setCurrentPeriodId(newPeriod.id);
    recordAuditAction(
      'Creación de Ciclo',
      `Ciclo ${newPeriod.codigo} (${newPeriod.nombre}) creado con éxito en estado Borrador.`
    );
    addToast(
      'Ciclo Creado',
      `Ciclo ${newPeriod.tipo.toLowerCase()} ${newPeriod.fechaInicio} al ${newPeriod.fechaFin} creado correctamente.`,
      'success'
    );
  };

  const handleDuplicateCycle = (sourcePeriod: PayrollPeriod) => {
    setWizardInitialValues({
      tipo: sourcePeriod.tipo,
      nombre: `${sourcePeriod.tipo} · Copia de ${sourcePeriod.codigo}`,
      fechaInicio: '2026-09-07',
      fechaFin: '2026-09-13',
      fechaPago: '2026-09-14',
    });
    setIsNewCycleWizardOpen(true);
  };

  return (
    <div className="min-h-screen bg-zinc-50/50 pb-16">
      {/* Non-sticky Normal Header in page flow (Doc V2 Sección 2) */}
      <div className="bg-white border-b border-zinc-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Title Row */}
          <div className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-bold text-base shadow-sm">
                  RTM
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg font-bold text-zinc-900">Módulo de Nómina, Asistencia y CFDI</h1>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-white text-zinc-700 border border-zinc-300">
                      Planta Reynosa
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500">
                    Control de ciclos de nómina, checadas biométricas, incidencias de piso, cálculo fiscal y timbrado
                  </p>
                </div>
              </div>
            </div>

            {/* Cycle Selector & Quick Actions Bar (Doc V2 Sección 17) */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Selector de Ciclo Activo */}
              <div className="flex items-center gap-1.5 bg-zinc-100/90 border border-zinc-300 rounded-xl px-2.5 py-1.5 text-xs">
                <span className="text-zinc-500 font-semibold">Ciclo:</span>
                <select
                  value={currentPeriodId}
                  onChange={(e) => {
                    setCurrentPeriodId(e.target.value);
                    const sel = periods.find((p) => p.id === e.target.value);
                    if (sel) {
                      addToast('Ciclo Activo', `Se cambió al ciclo ${sel.codigo} (${sel.nombre})`, 'info');
                    }
                  }}
                  className="bg-transparent font-bold text-zinc-900 focus:outline-none cursor-pointer pr-1"
                >
                  {periods.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.codigo} · {p.tipo} ({p.estado})
                    </option>
                  ))}
                </select>
              </div>

              {/* Botón + Nuevo ciclo */}
              <button
                onClick={() => {
                  setWizardInitialValues(undefined);
                  setIsNewCycleWizardOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-theme-primary hover:bg-theme-primary-hover rounded-xl transition-all shadow-xs cursor-pointer"
                title="Crear un nuevo ciclo de nómina mediante el asistente guiado"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Nuevo ciclo</span>
              </button>

              <button
                onClick={() => setIsAuditDrawerOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-700 bg-white border border-zinc-300 rounded-xl hover:bg-zinc-50 transition-colors shadow-2xs cursor-pointer"
                title="Ver registro de auditoría e historial"
              >
                <History className="w-4 h-4 text-zinc-500" />
                <span>Bitácora ({auditLog.length})</span>
              </button>

              <button
                onClick={() => {
                  addToast('Recálculo Completo', `Pre-nómina recalculada con éxito para ${currentPeriod.codigo}.`, 'info');
                  recordAuditAction('Recálculo de Nómina', `Recálculo masivo de colaboradores del ciclo ${currentPeriod.codigo}.`);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-700 bg-white border border-zinc-300 rounded-xl hover:bg-zinc-50 transition-colors shadow-2xs cursor-pointer"
                title="Recalcular importes a partir de incidencias y checadas"
              >
                <RefreshCw className="w-3.5 h-3.5 text-zinc-500" />
                <span>Recalcular</span>
              </button>
            </div>
          </div>

          {/* Subtabs Navigation (Navegación en flujo normal) */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-1">
            {tabsConfig.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? 'border-zinc-900 text-zinc-900 font-semibold'
                      : 'border-transparent text-zinc-500 hover:text-zinc-800 hover:border-zinc-300'
                  }`}
                >
                  <span className={isActive ? 'text-zinc-900' : 'text-zinc-400'}>{tab.icon}</span>
                  <span>{tab.label}</span>
                  {tab.badgeCount !== undefined && tab.badgeCount > 0 && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                        isActive
                          ? 'bg-zinc-900 text-white'
                          : 'bg-zinc-100 text-zinc-600'
                      }`}
                    >
                      {tab.badgeCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Tarjeta compacta no-sticky de resumen de progreso de flujo (visible en pestañas operativas) */}
        {activeTab !== 'ciclos' && activeTab !== 'historial' && (
          <PayrollCloseStepper
            period={currentPeriod}
            activeTab={activeTab}
            onSelectTab={(tabKey) => setActiveTab(tabKey as NominaSubTab)}
            incidenciasPendientesCount={incidents.filter((i) => i.estado === 'pendiente_revision' || i.estado === 'detectada').length}
            empleadosRequierenRevisionCount={calculations.filter((c) => c.estadoValidacion === 'requiere_revision').length}
            isTimbrada={isAllStamped}
            isCerrada={isPayrollClosed}
          />
        )}

        {/* Tab 1: Ciclos de Nómina (Puerta de entrada V2) */}
        {activeTab === 'ciclos' && (
          <CiclosNominaTab
            periods={periods}
            currentPeriodId={currentPeriodId}
            onSelectPeriod={(pId) => {
              setCurrentPeriodId(pId);
              setActiveTab('resumen');
            }}
            onOpenNewCycleWizard={() => {
              setWizardInitialValues(undefined);
              setIsNewCycleWizardOpen(true);
            }}
            onDuplicateCycle={handleDuplicateCycle}
            onTriggerToast={handleToast}
          />
        )}

        {activeTab === 'resumen' && (
          <PayrollDashboard
            period={currentPeriod}
            employees={employees}
            incidents={incidents}
            calculations={calculations}
            onSelectTab={(tab) => setActiveTab(tab as NominaSubTab)}
            onOpenReconciliation={() => setActiveTab('asistencia')}
            isTimbrada={isAllStamped}
            timbradosCount={timbradosCount}
          />
        )}

        {activeTab === 'personal' && (
          <EmployeesTable
            employees={employees}
            payrollCalculations={calculations}
            onTriggerToast={handleToast}
          />
        )}

        {activeTab === 'asistencia' && (
          <AttendanceGrid
            employees={employees}
            attendanceWeeks={attendance}
            reconciliations={reconciliations}
            onTriggerToast={handleToast}
            onUpdateAttendance={(updated) => setAttendance(updated)}
          />
        )}

        {activeTab === 'incidencias' && (
          <IncidentCenter
            incidents={incidents}
            onAuthorizeIncident={handleAuthorizeIncident}
            onRejectIncident={handleRejectIncident}
            onTriggerToast={handleToast}
          />
        )}

        {activeTab === 'prenomina' && (
          <PayrollReviewTable
            period={currentPeriod}
            calculations={calculations}
            employees={employees}
            isCerrada={isPayrollClosed}
            onClosePayroll={handleClosePayroll}
            onReopenPayroll={handleReopenPayroll}
            onTriggerToast={handleToast}
            onProceedToStamp={() => setActiveTab('timbrado')}
          />
        )}

        {activeTab === 'timbrado' && (
          <StampCenter
            calculations={calculations}
            employees={employees}
            isCerrada={isPayrollClosed}
            isTimbrada={isAllStamped}
            onStampSuccess={(updated) => {
              setCalculations(updated);
              recordAuditAction(
                'Timbrado CFDI 4.0',
                `Timbrado completado para 30 empleados ante PAC y SAT con sellos digitales.`
              );
            }}
            onTriggerToast={handleToast}
          />
        )}

        {activeTab === 'historial' && (
          <PayrollHistory
            periods={periods}
            onTriggerToast={addToast}
            onSelectPeriodForReview={(pId) => {
              setCurrentPeriodId(pId);
              setActiveTab('prenomina');
            }}
          />
        )}
      </main>

      {/* Wizard Modal: Nuevo Ciclo de Nómina (4 pasos) */}
      <NuevoCicloWizardModal
        isOpen={isNewCycleWizardOpen}
        onClose={() => setIsNewCycleWizardOpen(false)}
        employees={employees}
        onCreateCycle={handleCreateNewCycle}
        initialValues={wizardInitialValues}
      />

      {/* Audit & Traceability Drawer */}
      <PayrollAuditDrawer
        isOpen={isAuditDrawerOpen}
        onClose={() => setIsAuditDrawerOpen(false)}
        auditEntries={auditLog}
        onTriggerToast={addToast}
      />

      {/* Floating Toast Notification Stack */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl border bg-white shadow-xl flex items-start gap-3 animate-in slide-in-from-bottom-2 duration-150 ${
              toast.type === 'success'
                ? 'border-emerald-500 text-zinc-900'
                : toast.type === 'error'
                ? 'border-rose-500 text-zinc-900'
                : toast.type === 'warning'
                ? 'border-amber-500 text-zinc-900'
                : 'border-zinc-300 text-zinc-900'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />}
            {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-zinc-700 flex-shrink-0 mt-0.5" />}

            <div className="flex-1 text-xs">
              <div className="font-semibold text-zinc-900">{toast.title}</div>
              <div className="text-zinc-600 mt-0.5 leading-relaxed">{toast.message}</div>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 text-zinc-400 hover:text-zinc-700 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
