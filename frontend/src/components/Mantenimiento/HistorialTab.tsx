import React, { useState } from 'react';
import { 
  Clock, CheckCircle, Search, Filter, Download, 
  DollarSign, Activity, Wrench, Calendar, FileText
} from 'lucide-react';
import { MaintenanceWorkOrder } from '../../data/mockMaintenanceData';

interface HistorialTabProps {
  workOrders: MaintenanceWorkOrder[];
  onSelectOrder: (order: MaintenanceWorkOrder) => void;
}

export const HistorialTab: React.FC<HistorialTabProps> = ({
  workOrders,
  onSelectOrder
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMachine, setSelectedMachine] = useState<string>('all');

  const closedOrders = workOrders.filter(o => o.status === 'Terminada');

  const getOrderTotalCost = (o: MaintenanceWorkOrder) => {
    const partsCost = o.spareParts.reduce((sum, sp) => sum + (sp.quantityUsed * sp.unitCostMxn), 0);
    const laborCost = o.downtimeHours * 350;
    return partsCost + laborCost;
  };

  const filteredClosedOrders = closedOrders.filter(o => {
    const tech = o.assignedTechnician || '';
    const matchesSearch = 
      o.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.issueDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.machineCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.machineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMachine = selectedMachine === 'all' || o.machineId === selectedMachine;

    return matchesSearch && matchesMachine;
  });

  // Calculate metrics
  const totalCost = closedOrders.reduce((sum, o) => sum + getOrderTotalCost(o), 0);
  const totalDowntime = closedOrders.reduce((sum, o) => sum + o.downtimeHours, 0);
  const avgRepairTime = closedOrders.length > 0 ? (totalDowntime / closedOrders.length).toFixed(1) : '0';

  const machinesInHistory = Array.from(
    new Set(closedOrders.map(o => JSON.stringify({ id: o.machineId, code: o.machineCode, name: o.machineName })))
  ).map(str => JSON.parse(str));

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Industrial Maintenance KPI Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle shadow-sm">
          <div className="flex items-center justify-between text-theme-muted mb-1">
            <span className="text-xs font-medium">MTTR (Tiempo Medio Reparación)</span>
            <Activity className="w-4 h-4 text-theme-primary" />
          </div>
          <div className="text-2xl font-bold font-mono text-theme-main">
            {avgRepairTime} hrs
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block mt-1">
            Cumple estándar RTM (&lt; 3.5 hrs)
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle shadow-sm">
          <div className="flex items-center justify-between text-theme-muted mb-1">
            <span className="text-xs font-medium">MTBF (Tiempo Entre Fallas)</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-theme-main">
            218.4 hrs
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block mt-1">
            Confiabilidad operativa alta
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle shadow-sm">
          <div className="flex items-center justify-between text-theme-muted mb-1">
            <span className="text-xs font-medium">Gasto Acumulado Mantenimiento</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold font-mono text-theme-main">
            ${totalCost.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-theme-muted block mt-1">
            Refacciones + mano de obra
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle shadow-sm">
          <div className="flex items-center justify-between text-theme-muted mb-1">
            <span className="text-xs font-medium">OTs Cerradas Conformes</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {closedOrders.length}
          </div>
          <span className="text-[11px] text-theme-muted block mt-1">
            Histórico auditado y documentado
          </span>
        </div>
      </div>

      <div className="text-[11px] text-theme-muted/80 italic px-1">
        * Indicadores calculados sobre datos simulados del demo.
      </div>

      {/* Filter and Export Bar */}
      <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-theme-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar en el histórico por folio, máquina o falla..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-theme-subtle bg-theme-surface text-theme-main text-xs focus:border-theme-primary outline-none"
            />
          </div>

          <div>
            <select
              value={selectedMachine}
              onChange={e => setSelectedMachine(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-theme-subtle bg-theme-surface text-theme-main text-xs focus:border-theme-primary outline-none"
            >
              <option value="all">Filtrar por Máquina (Todas)</option>
              {machinesInHistory.map(m => (
                <option key={m.id} value={m.id}>[{m.code}] {m.name}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={() => alert('Generando reporte consolidado de mantenimiento en PDF/Excel...')}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-theme-subtle hover:bg-theme-subtle/80 text-theme-main flex items-center justify-center gap-2 transition-colors shrink-0"
        >
          <Download className="w-4 h-4" />
          Exportar Bitácora
        </button>
      </div>

      {/* History Table */}
      <div className="rounded-2xl bg-theme-surface border border-theme-subtle shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-theme-subtle bg-theme-subtle/20 text-theme-muted font-medium">
                <th className="py-3 px-4">Folio / Cierre</th>
                <th className="py-3 px-4">Máquina / Área</th>
                <th className="py-3 px-4">Tipo</th>
                <th className="py-3 px-4">Diagnóstico y Resolución</th>
                <th className="py-3 px-4">Técnico</th>
                <th className="py-3 px-4 text-center">Paro (Hrs)</th>
                <th className="py-3 px-4 text-right">Costo Total</th>
                <th className="py-3 px-4 text-right">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-subtle">
              {filteredClosedOrders.map(order => (
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
                      Cerrada: {order.completedAt || order.openedAt}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-semibold text-theme-main block">
                      {order.machineName}
                    </span>
                    <span className="font-mono text-[10px] text-theme-muted">
                      {order.machineCode}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-theme-subtle text-theme-muted">
                      {order.type}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 max-w-sm">
                    <p className="font-medium text-theme-main truncate">{order.issueDescription}</p>
                    <p className="text-[11px] text-theme-muted truncate">{order.workPerformed || order.diagnosis}</p>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="text-theme-main font-medium">{order.assignedTechnician || 'Sin asignar'}</span>
                  </td>

                  <td className="py-3.5 px-4 text-center whitespace-nowrap font-mono">
                    {order.downtimeHours} hrs
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono font-bold text-theme-main">
                    ${getOrderTotalCost(order).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectOrder(order);
                      }}
                      className="text-xs font-semibold text-theme-primary hover:underline"
                    >
                      Ver
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
