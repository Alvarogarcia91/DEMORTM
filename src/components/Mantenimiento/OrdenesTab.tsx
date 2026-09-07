import React, { useState } from 'react';
import { 
  Wrench, Search, Filter, Plus, AlertTriangle, CheckCircle, 
  Clock, ArrowRight, User, Calendar, Shield, MoreHorizontal
} from 'lucide-react';
import { 
  MaintenanceWorkOrder, 
  PRIORITY_LABELS, 
  STATUS_LABELS 
} from '../../data/mockMaintenanceData';

interface OrdenesTabProps {
  workOrders: MaintenanceWorkOrder[];
  onSelectOrder: (order: MaintenanceWorkOrder) => void;
  onNewOrder: () => void;
}

export const OrdenesTab: React.FC<OrdenesTabProps> = ({
  workOrders,
  onSelectOrder,
  onNewOrder
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  const filteredOrders = workOrders.filter(o => {
    const tech = o.assignedTechnician || '';
    const matchesSearch = 
      o.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.issueDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.machineCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.machineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || o.status === selectedStatus;
    const matchesType = selectedType === 'all' || o.type === selectedType;
    const matchesPriority = selectedPriority === 'all' || o.priority === selectedPriority;

    return matchesSearch && matchesStatus && matchesType && matchesPriority;
  });

  const getStatusBadge = (status: MaintenanceWorkOrder['status']) => {
    switch (status) {
      case 'Terminada':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="w-3 h-3" />
            {status}
          </span>
        );
      case 'En espera de refacción':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 animate-pulse">
            <AlertTriangle className="w-3 h-3" />
            {status}
          </span>
        );
      case 'En proceso':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Clock className="w-3 h-3" />
            {status}
          </span>
        );
      case 'Programada':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Calendar className="w-3 h-3" />
            {status}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20">
            {status}
          </span>
        );
    }
  };

  const getPriorityBadge = (priority: MaintenanceWorkOrder['priority']) => {
    const meta = PRIORITY_LABELS[priority] || PRIORITY_LABELS['Normal'];
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border ${meta.bgColor} ${meta.color} ${meta.borderColor}`}>
        <Shield className="w-3 h-3" />
        {meta.label}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Search and Action Bar */}
      <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-1 relative">
              <Search className="w-4 h-4 text-theme-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Buscar por folio, máquina, técnico..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-theme-subtle bg-theme-surface text-theme-main text-xs focus:border-theme-primary outline-none"
              />
            </div>

            <div>
              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-theme-subtle bg-theme-surface text-theme-main text-xs focus:border-theme-primary outline-none"
              >
                <option value="all">Todos los Estados</option>
                <option value="Solicitada">Solicitada</option>
                <option value="Programada">Programada</option>
                <option value="En proceso">En proceso</option>
                <option value="En espera de refacción">En espera de refacción</option>
                <option value="Terminada">Terminada</option>
                <option value="Cancelada">Cancelada</option>
              </select>
            </div>

            <div>
              <select
                value={selectedType}
                onChange={e => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-theme-subtle bg-theme-surface text-theme-main text-xs focus:border-theme-primary outline-none"
              >
                <option value="all">Tipo (Todos)</option>
                <option value="Correctivo">Correctivo</option>
                <option value="Preventivo">Preventivo</option>
                <option value="Inspección">Inspección</option>
              </select>
            </div>

            <div>
              <select
                value={selectedPriority}
                onChange={e => setSelectedPriority(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-theme-subtle bg-theme-surface text-theme-main text-xs focus:border-theme-primary outline-none"
              >
                <option value="all">Prioridad (Todas)</option>
                <option value="Urgente">Urgente</option>
                <option value="Alta">Alta</option>
                <option value="Normal">Normal</option>
                <option value="Baja">Baja</option>
              </select>
            </div>
          </div>

          <button
            onClick={onNewOrder}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-theme-primary text-theme-primary-contrast hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            Nueva Orden de Trabajo
          </button>
        </div>

        <div className="flex items-center justify-between text-xs text-theme-muted pt-2 border-t border-theme-subtle">
          <span>
            Mostrando <strong className="text-theme-main">{filteredOrders.length}</strong> de {workOrders.length} órdenes registradas
          </span>
          {(searchTerm || selectedStatus !== 'all' || selectedType !== 'all' || selectedPriority !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedStatus('all');
                setSelectedType('all');
                setSelectedPriority('all');
              }}
              className="text-theme-primary font-semibold hover:underline"
            >
              Limpiar Filtros
            </button>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-theme-surface border border-theme-subtle shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-theme-subtle bg-theme-subtle/20 text-theme-muted font-medium">
                <th className="py-3 px-4">Folio / Fecha</th>
                <th className="py-3 px-4">Máquina / Equipo</th>
                <th className="py-3 px-4">Tipo & Prioridad</th>
                <th className="py-3 px-4">Descripción de Falla</th>
                <th className="py-3 px-4">Técnico Asignado</th>
                <th className="py-3 px-4 text-center">Tiempo Paro</th>
                <th className="py-3 px-4 text-center">Estado</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-subtle">
              {filteredOrders.map(order => (
                <tr
                  key={order.id}
                  onClick={() => onSelectOrder(order)}
                  className="hover:bg-theme-subtle/20 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-mono font-bold text-theme-primary block">
                      {order.folio}
                    </span>
                    <span className="text-[10px] text-theme-muted font-mono block mt-0.5">
                      {order.openedAt}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-theme-main block">
                      {order.machineName}
                    </span>
                    <span className="font-mono text-[10px] text-theme-muted">
                      {order.machineCode}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-theme-subtle text-theme-muted">
                        {order.type}
                      </span>
                      {getPriorityBadge(order.priority)}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 max-w-xs">
                    <p className="font-medium text-theme-main truncate">{order.issueDescription}</p>
                    <p className="text-[11px] text-theme-muted truncate">{order.diagnosis || order.requestedBy}</p>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="text-theme-main font-medium flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-theme-muted" />
                      {order.assignedTechnician || 'Sin asignar'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center whitespace-nowrap font-mono">
                    {order.downtimeHours > 0 ? (
                      <span className="text-rose-600 dark:text-rose-400 font-bold">
                        {order.downtimeHours} hrs
                      </span>
                    ) : (
                      <span className="text-theme-muted">0 hrs</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectOrder(order);
                      }}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-theme-subtle hover:bg-theme-primary hover:text-theme-primary-contrast transition-all inline-flex items-center gap-1"
                    >
                      Gestionar
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
