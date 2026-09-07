import React, { useState, useMemo } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  ArrowRight, 
  Check, 
  Calendar, 
  RotateCcw,
  Boxes,
  ShoppingCart,
  TrendingUp,
  Truck,
  Receipt,
  CreditCard,
  Scale,
  Wrench,
  Users,
  Layers,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
  Info
} from 'lucide-react';
import { useAlertas } from '../context/AlertasContext';
import { DemoAlert, AlertPriority, AlertModule, AlertStatus } from '../data/mockAlertasData';

interface CentroAlertasPageProps {
  onNavigateAlert: (alert: DemoAlert) => void;
}

type TabKey = 'pendientes' | 'hoy' | 'proximas' | 'resueltas';

const getModuleIcon = (modulo: AlertModule) => {
  switch (modulo) {
    case 'Inventario':
      return Boxes;
    case 'Compras':
      return ShoppingCart;
    case 'Ventas':
      return TrendingUp;
    case 'Órdenes de Salida':
      return Truck;
    case 'Facturación':
      return Receipt;
    case 'Cuentas por Cobrar':
      return CreditCard;
    case 'Cuentas por Pagar':
      return Scale;
    case 'Mantenimiento':
      return Wrench;
    case 'Nómina':
      return Users;
    default:
      return AlertTriangle;
  }
};

const getPriorityBadge = (prioridad: AlertPriority) => {
  switch (prioridad) {
    case 'Crítica':
      return {
        badge: 'bg-rose-500/10 text-rose-600 border-rose-500/20 dark:bg-rose-500/20 dark:text-rose-400',
        dot: 'bg-rose-500',
      };
    case 'Alta':
      return {
        badge: 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400',
        dot: 'bg-amber-500',
      };
    case 'Media':
      return {
        badge: 'bg-blue-500/10 text-blue-700 border-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400',
        dot: 'bg-blue-500',
      };
    case 'Informativa':
    default:
      return {
        badge: 'bg-zinc-500/10 text-zinc-700 border-zinc-500/20 dark:bg-zinc-500/20 dark:text-zinc-400',
        dot: 'bg-zinc-400',
      };
  }
};

export const CentroAlertasPage: React.FC<CentroAlertasPageProps> = ({ onNavigateAlert }) => {
  const { alerts, markAsAttended, markAsResolved, resetAlerts } = useAlertas();

  const [activeTab, setActiveTab] = useState<TabKey>('pendientes');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('todos');
  const [selectedPriority, setSelectedPriority] = useState<string>('todos');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');

  // KPIs
  const kpis = useMemo(() => {
    const pendientes = alerts.filter((a) => a.estado === 'Pendiente').length;
    const criticas = alerts.filter((a) => a.estado === 'Pendiente' && a.prioridad === 'Crítica').length;
    const hoy = alerts.filter((a) => a.timing === 'Hoy' && a.estado !== 'Resuelta').length;
    const resueltasHoy = alerts.filter((a) => a.estado === 'Resuelta').length;
    return { pendientes, criticas, hoy, resueltasHoy };
  }, [alerts]);

  // Resumen por dominio/módulo
  const moduleSummary = useMemo(() => {
    const modules: { name: string; icon: any; count: number; category: string }[] = [
      {
        name: 'Operaciones',
        icon: Boxes,
        count: alerts.filter((a) => a.estado !== 'Resuelta' && ['Inventario', 'Órdenes de Salida'].includes(a.modulo)).length,
        category: 'Almacén & Despacho',
      },
      {
        name: 'Compras',
        icon: ShoppingCart,
        count: alerts.filter((a) => a.estado !== 'Resuelta' && a.modulo === 'Compras').length,
        category: 'Suministros',
      },
      {
        name: 'Ventas',
        icon: TrendingUp,
        count: alerts.filter((a) => a.estado !== 'Resuelta' && a.modulo === 'Ventas').length,
        category: 'Comercial',
      },
      {
        name: 'Finanzas',
        icon: Receipt,
        count: alerts.filter((a) => a.estado !== 'Resuelta' && ['Facturación', 'Cuentas por Cobrar', 'Cuentas por Pagar'].includes(a.modulo)).length,
        category: 'Fiscal & Tesorería',
      },
      {
        name: 'Mantenimiento',
        icon: Wrench,
        count: alerts.filter((a) => a.estado !== 'Resuelta' && a.modulo === 'Mantenimiento').length,
        category: 'Planta & Equipos',
      },
      {
        name: 'Nómina',
        icon: Users,
        count: alerts.filter((a) => a.estado !== 'Resuelta' && a.modulo === 'Nómina').length,
        category: 'Personal & Asistencia',
      },
    ];
    return modules;
  }, [alerts]);

  // Filtered alerts based on tab & filters
  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      // 1. Tab filter
      if (activeTab === 'pendientes') {
        if (alert.estado === 'Resuelta') return false;
      } else if (activeTab === 'hoy') {
        if (alert.timing !== 'Hoy' || alert.estado === 'Resuelta') return false;
      } else if (activeTab === 'proximas') {
        if (alert.timing !== 'Próximas' || alert.estado === 'Resuelta') return false;
      } else if (activeTab === 'resueltas') {
        if (alert.estado !== 'Resuelta') return false;
      }

      // 2. Module filter
      if (selectedModule !== 'todos' && alert.modulo !== selectedModule) return false;

      // 3. Priority filter
      if (selectedPriority !== 'todos' && alert.prioridad !== selectedPriority) return false;

      // 4. Status filter (in pendientes tab)
      if (selectedStatus !== 'todos' && alert.estado !== selectedStatus) return false;

      // 5. Search
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchTitle = alert.titulo.toLowerCase().includes(query);
        const matchDesc = alert.descripcion.toLowerCase().includes(query);
        const matchRef = alert.referencia.toLowerCase().includes(query);
        const matchMod = alert.modulo.toLowerCase().includes(query);
        if (!matchTitle && !matchDesc && !matchRef && !matchMod) return false;
      }

      return true;
    });
  }, [alerts, activeTab, selectedModule, selectedPriority, selectedStatus, searchTerm]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white text-zinc-900 border border-theme-primary shadow-2xs">
              Supervisión Operativa & Alertas
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-theme-main flex items-center gap-2.5">
            <Bell className="w-7 h-7 text-theme-primary" />
            <span>Centro de Alertas RTM</span>
          </h1>
          <p className="text-xs sm:text-sm text-theme-muted">
            Monitoreo en tiempo real de eventos críticos, discrepancias operativas y acciones transversales del ERP.
          </p>
        </div>

        {/* Demo reset button */}
        <button
          onClick={resetAlerts}
          className="self-start sm:self-center px-3 py-1.5 rounded-xl border border-theme-subtle hover:bg-theme-muted text-xs font-semibold text-theme-muted hover:text-theme-main transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          title="Restablecer alertas originales de la demostración"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restablecer Demo</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-theme-muted uppercase tracking-wider">Pendientes Totales</p>
            <p className="text-2xl font-black text-theme-main mt-0.5">{kpis.pendientes}</p>
            <p className="text-[10px] text-theme-muted mt-1">Requieren acción en planta</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Críticas / Urgentes</p>
            <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-0.5">{kpis.criticas}</p>
            <p className="text-[10px] text-theme-muted mt-1">Impactan producción o flujo</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Para Hoy</p>
            <p className="text-2xl font-black text-theme-main mt-0.5">{kpis.hoy}</p>
            <p className="text-[10px] text-theme-muted mt-1">Vencimientos del día actual</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Resueltas</p>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{kpis.resueltasHoy}</p>
            <p className="text-[10px] text-theme-muted mt-1">Historial atendido con éxito</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Module Summary Pills */}
      <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-theme-main uppercase tracking-wider">Resumen por Dominio Operativo</h3>
          <span className="text-[11px] text-theme-muted">Distribución de eventos activos</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {moduleSummary.map((mod) => {
            const Icon = mod.icon;
            return (
              <div 
                key={mod.name}
                className="p-2.5 rounded-xl bg-theme-muted/40 border border-theme-subtle/60 flex items-center gap-2.5"
              >
                <div className="w-8 h-8 rounded-lg bg-theme-surface border border-theme-subtle flex items-center justify-center text-theme-main shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-theme-main truncate">{mod.name}</p>
                  <p className="text-[10px] text-theme-muted font-medium">
                    {mod.count} {mod.count === 1 ? 'activa' : 'activas'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="border-b border-theme-subtle">
        <div className="flex flex-wrap gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('pendientes')}
            className={`flex items-center gap-1.5 border-b-2 px-1 pb-2.5 text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'pendientes'
                ? 'border-theme-primary text-theme-primary'
                : 'border-transparent text-theme-muted hover:text-theme-main'
            }`}
          >
            <Bell className="h-4 w-4" />
            <span>Pendientes</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-white text-zinc-900 border border-zinc-300 shadow-2xs">
              {kpis.pendientes}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('hoy')}
            className={`flex items-center gap-1.5 border-b-2 px-1 pb-2.5 text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'hoy'
                ? 'border-theme-primary text-theme-primary'
                : 'border-transparent text-theme-muted hover:text-theme-main'
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>Hoy</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-white text-zinc-900 border border-zinc-300 shadow-2xs">
              {kpis.hoy}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('proximas')}
            className={`flex items-center gap-1.5 border-b-2 px-1 pb-2.5 text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'proximas'
                ? 'border-theme-primary text-theme-primary'
                : 'border-transparent text-theme-muted hover:text-theme-main'
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>Próximas</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-white text-zinc-900 border border-zinc-300 shadow-2xs">
              {alerts.filter((a) => a.timing === 'Próximas' && a.estado !== 'Resuelta').length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('resueltas')}
            className={`flex items-center gap-1.5 border-b-2 px-1 pb-2.5 text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'resueltas'
                ? 'border-theme-primary text-theme-primary'
                : 'border-transparent text-theme-muted hover:text-theme-main'
            }`}
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Resueltas</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-white text-zinc-900 border border-zinc-300 shadow-2xs">
              {kpis.resueltasHoy}
            </span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-3.5 rounded-2xl bg-theme-surface border border-theme-subtle shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-theme-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por alerta, referencia, SKU, folio o responsable..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-theme-subtle bg-theme-muted/30 text-xs text-theme-main placeholder:text-theme-muted focus:outline-hidden focus:border-theme-primary"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Module */}
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-theme-subtle bg-theme-surface text-theme-main font-medium focus:outline-hidden"
          >
            <option value="todos">Todos los módulos</option>
            <option value="Inventario">Inventario</option>
            <option value="Compras">Compras</option>
            <option value="Ventas">Ventas</option>
            <option value="Órdenes de Salida">Órdenes de Salida</option>
            <option value="Facturación">Facturación</option>
            <option value="Cuentas por Cobrar">Cuentas por Cobrar</option>
            <option value="Cuentas por Pagar">Cuentas por Pagar</option>
            <option value="Mantenimiento">Mantenimiento</option>
            <option value="Nómina">Nómina</option>
          </select>

          {/* Priority */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-theme-subtle bg-theme-surface text-theme-main font-medium focus:outline-hidden"
          >
            <option value="todos">Todas las prioridades</option>
            <option value="Crítica">Crítica</option>
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Informativa">Informativa</option>
          </select>

          {/* Status (if not in resueltas tab) */}
          {activeTab !== 'resueltas' && (
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-theme-subtle bg-theme-surface text-theme-main font-medium focus:outline-hidden"
            >
              <option value="todos">Todos los estados</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Atendida">Atendida</option>
            </select>
          )}
        </div>
      </div>

      {/* Main Alerts List / Table */}
      <div className="rounded-2xl bg-theme-surface border border-theme-subtle shadow-2xs overflow-hidden">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center text-theme-muted space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto opacity-80" />
            <h3 className="text-sm font-bold text-theme-main">Sin alertas en este criterio</h3>
            <p className="text-xs max-w-sm mx-auto">
              No se encontraron alertas en la categoría y filtros seleccionados. Todas las operaciones se encuentran en regla.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-theme-subtle">
            {filteredAlerts.map((alert) => {
              const Icon = getModuleIcon(alert.modulo);
              const styling = getPriorityBadge(alert.prioridad);

              return (
                <div
                  key={alert.id}
                  className={`p-4 sm:p-5 transition-colors hover:bg-theme-muted/40 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    alert.estado === 'Pendiente' ? 'bg-theme-surface' : 'opacity-90 bg-theme-muted/10'
                  }`}
                >
                  {/* Left Column: Icon + Details */}
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    {/* Icon */}
                    <div className="relative shrink-0 mt-0.5">
                      <div className="w-10 h-10 rounded-xl bg-theme-muted border border-theme-subtle flex items-center justify-center text-theme-main shadow-2xs">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-zinc-900 ${styling.dot}`} />
                    </div>

                    {/* Meta & Descriptions */}
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded border ${styling.badge}`}>
                          {alert.prioridad}
                        </span>

                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-theme-muted text-theme-main border border-theme-subtle">
                          {alert.modulo}
                        </span>

                        <span className="text-xs font-mono font-bold text-theme-primary bg-theme-primary/10 px-2 py-0.5 rounded">
                          {alert.referencia}
                        </span>

                        <span className="text-[11px] text-theme-muted flex items-center gap-1 font-medium ml-auto">
                          <Clock className="w-3 h-3" />
                          <span>{alert.fechaHora}</span>
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-theme-main leading-snug">
                        {alert.titulo}
                      </h3>

                      <p className="text-xs text-theme-muted leading-relaxed">
                        {alert.descripcion}
                      </p>

                      {/* Responsable & History footer */}
                      <div className="pt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-theme-muted">
                        {alert.responsable && (
                          <span>
                            <strong className="font-semibold text-theme-main">Responsable:</strong> {alert.responsable}
                          </span>
                        )}

                        <span>
                          <strong className="font-semibold text-theme-main">Estado:</strong>{' '}
                          <span
                            className={
                              alert.estado === 'Pendiente'
                                ? 'text-amber-600 dark:text-amber-400 font-bold'
                                : alert.estado === 'Atendida'
                                ? 'text-blue-600 dark:text-blue-400 font-bold'
                                : 'text-emerald-600 dark:text-emerald-400 font-bold'
                            }
                          >
                            {alert.estado}
                          </span>
                        </span>

                        {alert.resolucion && (
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                            ✓ {alert.resolucion.accionRealizada} ({alert.resolucion.fecha})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0 md:self-center">
                    {/* Mark as attended */}
                    {alert.estado === 'Pendiente' && (
                      <button
                        onClick={() => markAsAttended(alert.id)}
                        className="px-3 py-1.5 rounded-xl border border-theme-subtle hover:bg-theme-muted text-xs font-semibold text-theme-muted hover:text-theme-main transition-colors flex items-center gap-1 cursor-pointer"
                        title="Marcar como atendida"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Atender</span>
                      </button>
                    )}

                    {/* Mark as resolved */}
                    {alert.estado !== 'Resuelta' && (
                      <button
                        onClick={() => markAsResolved(alert.id)}
                        className="px-3 py-1.5 rounded-xl border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                        title="Marcar alerta como resuelta"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Resolver</span>
                      </button>
                    )}

                    {/* Main CTA to navigate */}
                    <button
                      onClick={() => {
                        markAsAttended(alert.id);
                        onNavigateAlert(alert);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-theme-primary text-white hover:opacity-95 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ml-auto sm:ml-0"
                    >
                      <span>{alert.ctaPrincipal}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
