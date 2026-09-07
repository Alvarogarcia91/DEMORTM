import React from 'react';
import {
  Users,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle2,
  FileCheck2,
  ArrowRight,
  TrendingUp,
  BarChart3,
  PieChart,
  ShieldCheck,
  Building2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { PayrollPeriod, Employee, Incident, EmployeePayroll } from '../../data/mockNominaData';
import { formatCurrency } from '../../utils/payrollDemoHelpers';

interface PayrollDashboardProps {
  period: PayrollPeriod;
  employees: Employee[];
  incidents: Incident[];
  calculations: EmployeePayroll[];
  onSelectTab: (tab: string) => void;
  onOpenReconciliation: () => void;
  isTimbrada: boolean;
  timbradosCount: number;
}

export const PayrollDashboard: React.FC<PayrollDashboardProps> = ({
  period,
  employees,
  incidents,
  calculations,
  onSelectTab,
  onOpenReconciliation,
  isTimbrada,
  timbradosCount,
}) => {
  const incidenciasAbiertas = incidents.filter((i) => i.estado === 'pendiente_revision' || i.estado === 'detectada').length;
  const listosParaTimbrar = calculations.filter((c) => c.estadoValidacion === 'listo').length;
  const netoTotal = calculations.reduce((acc, c) => acc + c.netoAPagar, 0);
  const totalHorasExtra = calculations.reduce((acc, c) => acc + c.horasAdicionales, 0);

  // Department cost breakdown
  const deptCostMap = employees.reduce((acc, emp) => {
    const calc = calculations.find((c) => c.empleadoId === emp.id);
    const amount = calc ? calc.netoAPagar : 0;
    acc[emp.departamento] = (acc[emp.departamento] || 0) + amount;
    return acc;
  }, {} as Record<string, number>);

  const deptCostEntries = Object.entries(deptCostMap).sort((a, b) => b[1] - a[1]);
  const maxDeptCost = Math.max(...Object.values(deptCostMap), 1);

  // Overtime by area
  const deptOtMap = employees.reduce((acc, emp) => {
    const calc = calculations.find((c) => c.empleadoId === emp.id);
    const ot = calc ? calc.horasAdicionales : 0;
    acc[emp.departamento] = (acc[emp.departamento] || 0) + ot;
    return acc;
  }, {} as Record<string, number>);

  // Trend data of last 8 weeks (in thousands MXN)
  const trendWeeks = [
    { label: 'S29', cost: 122.4 },
    { label: 'S30', cost: 125.1 },
    { label: 'S31', cost: 121.8 },
    { label: 'S32', cost: 129.0 },
    { label: 'S33', cost: 124.3 },
    { label: 'S34', cost: 126.2 },
    { label: 'S35', cost: 126.8 },
    { label: 'S36 (Hoy)', cost: 128.4 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 0. Tarjeta Principal del Ciclo de Nómina (Requisito Doc V2 Sección 14) */}
      <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-zinc-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-theme-primary/10 border border-theme-primary/20 flex items-center justify-center text-theme-primary shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-zinc-950">{period.nombre}</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  period.estado === 'timbrada'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                    : period.estado === 'cerrada'
                    ? 'bg-blue-50 text-blue-700 border border-blue-300'
                    : 'bg-amber-50 text-amber-700 border border-amber-300'
                }`}>
                  {period.estado === 'timbrada' ? 'Timbrada CFDI 4.0' : period.estado === 'cerrada' ? 'Cerrada' : 'En Revisión'}
                </span>
              </div>
              <p className="text-xs text-zinc-500">
                Periodo: <strong className="text-zinc-700 font-mono">{period.fechaInicio} al {period.fechaFin}</strong> · Fecha de pago: <strong className="text-zinc-700 font-mono">{period.fechaPago}</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onSelectTab('asistencia')}
              className="px-3 py-1.5 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-xs font-semibold text-zinc-700 transition-colors cursor-pointer"
            >
              Revisar asistencia
            </button>
            <button
              onClick={() => onSelectTab('prenomina')}
              className="px-3 py-1.5 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-xs font-semibold text-zinc-700 transition-colors cursor-pointer"
            >
              Recalcular pre-nómina
            </button>
            <button
              onClick={() => onSelectTab('prenomina')}
              className="px-3 py-1.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              Enviar a autorización
            </button>
          </div>
        </div>

        {/* Resumen numérico del ciclo */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100">
            <span className="text-[10px] uppercase font-bold text-zinc-400 block">Colaboradores</span>
            <span className="font-mono font-bold text-zinc-900 text-sm">{employees.length} activos</span>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100">
            <span className="text-[10px] uppercase font-bold text-zinc-400 block">Horas Ordinarias</span>
            <span className="font-mono font-bold text-zinc-900 text-sm">1,153.3 h</span>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100">
            <span className="text-[10px] uppercase font-bold text-zinc-400 block">Horas Extra</span>
            <span className="font-mono font-bold text-amber-700 text-sm">33.8 h</span>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100">
            <span className="text-[10px] uppercase font-bold text-zinc-400 block">Horas Ausentes</span>
            <span className="font-mono font-bold text-rose-700 text-sm">6.7 h</span>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100">
            <span className="text-[10px] uppercase font-bold text-zinc-400 block">Incidencias</span>
            <span className="font-mono font-bold text-zinc-900 text-sm">{incidents.length} registradas</span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200">
            <span className="text-[10px] uppercase font-bold text-emerald-800 block">Neto Estimado</span>
            <span className="font-mono font-black text-emerald-700 text-sm">{formatCurrency(netoTotal)}</span>
          </div>
        </div>
      </div>

      {/* 1. KPIs Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        {/* Empleados en periodo */}
        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-500 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider">Empleados</span>
            <Users className="w-4 h-4 text-theme-primary" />
          </div>
          <div className="text-2xl font-black text-zinc-950 font-mono">
            {employees.length}
          </div>
          <p className="text-[10px] text-zinc-500 mt-0.5">24 piso · 6 admin</p>
        </div>

        {/* Nómina neta estimada */}
        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-500 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider">Neto Estimado</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-black text-zinc-950 font-mono truncate">
            {formatCurrency(netoTotal)}
          </div>
          <p className="text-[10px] text-zinc-500 mt-0.5">Semana 36 Reynosa</p>
        </div>

        {/* Horas extra */}
        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-500 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider">Horas Extra</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-zinc-950 font-mono">
            {totalHorasExtra > 0 ? `${totalHorasExtra} h` : '41.5 h'}
          </div>
          <p className="text-[10px] text-zinc-500 mt-0.5">Autorizadas por supervisor</p>
        </div>

        {/* Incidencias abiertas */}
        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-500 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider">Incidencias</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-700 font-mono">
            {incidenciasAbiertas}
          </div>
          <p className="text-[10px] text-zinc-500 mt-0.5">Pendientes de resolver</p>
        </div>

        {/* Listos para timbrar */}
        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-500 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider">Listos Timbre</span>
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-700 font-mono">
            {listosParaTimbrar} <span className="text-xs font-normal text-zinc-500">/ 30</span>
          </div>
          <p className="text-[10px] text-zinc-500 mt-0.5">Cálculo validado 100%</p>
        </div>

        {/* CFDI Timbrados */}
        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-500 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider">CFDI Timbrados</span>
            <FileCheck2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 font-mono">
            {timbradosCount} <span className="text-xs font-normal text-zinc-500">/ 30</span>
          </div>
          <p className="text-[10px] text-zinc-500 mt-0.5">{isTimbrada ? '100% dispersable' : '0% al inicio'}</p>
        </div>
      </div>

      {/* 2. Centro de Atención Requerida (Sección 5.2) */}
      <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <h3 className="text-sm font-bold text-zinc-950 uppercase tracking-wider">
              Centro de Atención Operativa · Pendientes del Periodo
            </h3>
          </div>
          <span className="text-[11px] text-zinc-500 font-medium">
            Haz clic en cualquier fila para resolver la excepción
          </span>
        </div>

        <div className="divide-y divide-zinc-100 border border-zinc-200 rounded-xl overflow-hidden bg-white">
          {/* Fila 1: Checadas incompletas */}
          <div
            onClick={() => onSelectTab('asistencia')}
            className="p-3.5 hover:bg-zinc-50 transition-colors flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 border border-amber-500 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span>Asistencia</span>
              </span>
              <div>
                <p className="text-xs font-bold text-zinc-950 group-hover:text-theme-primary transition-colors">
                  2 colaboradores con registro o retardo pendiente de validar
                </p>
                <p className="text-[11px] text-zinc-500">
                  Juan Pablo Castillo (RTM-006: omisión de salida viernes) · Ricardo Salinas (RTM-004: retardo 18 min)
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-theme-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Revisar asistencia</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Fila 2: Permiso pendiente de autorizar */}
          <div
            onClick={() => onSelectTab('incidencias')}
            className="p-3.5 hover:bg-zinc-50 transition-colors flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 border border-blue-500 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span>Permiso RTM</span>
              </span>
              <div>
                <p className="text-xs font-bold text-zinc-950 group-hover:text-theme-primary transition-colors">
                  1 permiso especial con reposición de horas programada
                </p>
                <p className="text-[11px] text-zinc-500">
                  Jesús Alberto Peña (RTM-005: 2.0 h solicitadas el viernes 04-sep · Reposición pactada en piso)
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-theme-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Ver reposición</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Fila 3: Conciliación Reloj vs Producción */}
          <div
            onClick={onOpenReconciliation}
            className="p-3.5 hover:bg-zinc-50 transition-colors flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 border border-rose-500 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                <span>Conciliación</span>
              </span>
              <div>
                <p className="text-xs font-bold text-zinc-950 group-hover:text-theme-primary transition-colors">
                  1 diferencia relevante entre horas reloj y horas capturadas en producción
                </p>
                <p className="text-[11px] text-zinc-500">
                  Miguel Ángel Treviño (RTM-003: 9.10 h reloj vs 6.75 h producción en OP-95839 · Paro reportado)
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-theme-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Abrir conciliación</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Fila 4: Dato fiscal pendiente */}
          <div
            onClick={() => onSelectTab('timbrado')}
            className="p-3.5 hover:bg-zinc-50 transition-colors flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 border border-purple-500 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                <span>Fiscal SAT</span>
              </span>
              <div>
                <p className="text-xs font-bold text-zinc-950 group-hover:text-theme-primary transition-colors">
                  2 colaboradores con inconsistencia fiscal antes de timbrar CFDI 4.0
                </p>
                <p className="text-[11px] text-zinc-500">
                  Alan Rodríguez (CP desactualizado 88799) · Eduardo Villarreal (homoclave RFC a validar)
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-theme-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Resolver en timbrado</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>

      {/* 3. Visualizaciones Ligeras (Sección 5.3) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Costo de nómina por departamento */}
        <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-theme-primary" />
              <h4 className="text-xs font-bold text-zinc-950 uppercase tracking-wider">
                Distribución de Costo por Departamento
              </h4>
            </div>
            <span className="text-[10px] text-zinc-500 font-mono">Semana 36</span>
          </div>

          <div className="space-y-2.5">
            {deptCostEntries.map(([dept, cost]) => {
              const pct = Math.round((cost / maxDeptCost) * 100);
              return (
                <div key={dept} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-zinc-800">{dept}</span>
                    <span className="font-mono text-zinc-950">{formatCurrency(cost)}</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-theme-primary rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tendencia de costo de últimas 8 semanas (SVG) */}
        <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-bold text-zinc-950 uppercase tracking-wider">
                  Tendencia de Gasto de Nómina (Últimas 8 Semanas)
                </h4>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">Miles MXN</span>
            </div>
            <p className="text-[11px] text-zinc-500">
              Estabilidad operativa promedio en $125.8k semanales para planta de 30 colaboradores.
            </p>
          </div>

          {/* SVG Clean Chart */}
          <div className="relative h-44 w-full pt-2">
            <svg viewBox="0 0 400 140" className="w-full h-full overflow-visible">
              {/* Grid Horizontal */}
              <line x1="30" y1="20" x2="390" y2="20" stroke="#f4f4f5" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="30" y1="60" x2="390" y2="60" stroke="#f4f4f5" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="30" y1="100" x2="390" y2="100" stroke="#f4f4f5" strokeWidth="1" strokeDasharray="3,3" />

              <text x="22" y="24" textAnchor="end" className="text-[9px] fill-zinc-400 font-mono">$130k</text>
              <text x="22" y="64" textAnchor="end" className="text-[9px] fill-zinc-400 font-mono">$125k</text>
              <text x="22" y="104" textAnchor="end" className="text-[9px] fill-zinc-400 font-mono">$120k</text>

              {/* Bars */}
              {trendWeeks.map((item, idx) => {
                const x = 50 + idx * 43;
                // mapping 115k to 135k onto 110px to 15px
                const height = Math.max(10, ((item.cost - 118) / 14) * 80);
                const y = 105 - height;
                const isCurrent = idx === trendWeeks.length - 1;

                return (
                  <g key={item.label} className="group cursor-pointer">
                    <rect
                      x={x - 12}
                      y={y}
                      width="24"
                      height={height}
                      rx="4"
                      className={`transition-colors ${isCurrent ? 'fill-[var(--color-primary)]' : 'fill-zinc-300 hover:fill-zinc-400'}`}
                    />
                    <text
                      x={x}
                      y={y - 4}
                      textAnchor="middle"
                      className="text-[9px] fill-zinc-700 font-mono font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ${item.cost}k
                    </text>
                    <text
                      x={x}
                      y="122"
                      textAnchor="middle"
                      className={`text-[9px] font-mono ${isCurrent ? 'font-bold fill-zinc-950' : 'fill-zinc-400'}`}
                    >
                      {item.label.split(' ')[0]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
            <span>Variación vs semana previa: <strong className="text-emerald-700 font-mono">+1.2%</strong></span>
            <span>Horas extra promedio: <strong className="text-zinc-800 font-mono">1.38 h / emp</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
