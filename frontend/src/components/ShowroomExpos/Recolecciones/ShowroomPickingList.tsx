import React, { useState } from 'react';
import { 
  Scan, 
  Store, 
  Truck, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Boxes, 
  ChevronRight,
  Filter
} from 'lucide-react';
import { ShowroomPickOrder, ShowroomPickOrderStatus } from '../../../data/mockShowroomExposData';
import { StatusBadge } from '../../common/StatusBadge';
import { SemanticVariant } from '../../common/semanticTokens';

interface ShowroomPickingListProps {
  orders: ShowroomPickOrder[];
  onExecuteOrder: (order: ShowroomPickOrder) => void;
}

export const ShowroomPickingList: React.FC<ShowroomPickingListProps> = ({
  orders,
  onExecuteOrder,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'Showroom' | 'Expo'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Pendiente' | 'En proceso' | 'Completa' | 'Con incidencia'>('ALL');

  const filteredOrders = orders.filter((o) => {
    if (categoryFilter !== 'ALL' && o.category !== categoryFilter) return false;
    if (statusFilter !== 'ALL' && o.status !== statusFilter) return false;
    return true;
  });

  const getStatusVariant = (status: ShowroomPickOrderStatus): SemanticVariant => {
    switch (status) {
      case 'Completa':
        return 'success';
      case 'En proceso':
        return 'info';
      case 'Pendiente':
        return 'warning';
      case 'Con incidencia':
        return 'danger';
      case 'Cancelada':
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Filters Bar */}
      <div className="bg-theme-surface p-4 border border-theme-subtle rounded-3xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setCategoryFilter('ALL')}
            className={`px-3 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              categoryFilter === 'ALL'
                ? 'bg-theme-primary text-white shadow-xs'
                : 'bg-theme-muted hover:bg-theme-subtle text-theme-main border border-theme-subtle'
            }`}
          >
            Todas las recolecciones ({orders.length})
          </button>
          <button
            onClick={() => setCategoryFilter('Showroom')}
            className={`px-3 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              categoryFilter === 'Showroom'
                ? 'bg-theme-primary text-white shadow-xs'
                : 'bg-theme-muted hover:bg-theme-subtle text-theme-main border border-theme-subtle'
            }`}
          >
            <Store className="w-3.5 h-3.5 text-purple-500" />
            <span>Showroom ({orders.filter(o => o.category === 'Showroom').length})</span>
          </button>
          <button
            onClick={() => setCategoryFilter('Expo')}
            className={`px-3 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              categoryFilter === 'Expo'
                ? 'bg-theme-primary text-white shadow-xs'
                : 'bg-theme-muted hover:bg-theme-subtle text-theme-main border border-theme-subtle'
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-blue-500" />
            <span>Expo ({orders.filter(o => o.category === 'Expo').length})</span>
          </button>
        </div>

        {/* Status Quick Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-theme-muted font-bold text-[11px] uppercase">Estado:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-theme-surface border border-theme-subtle text-theme-main font-bold text-xs focus:outline-none focus:border-theme-primary"
          >
            <option value="ALL">Todos los estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="En proceso">En proceso</option>
            <option value="Completa">Completa</option>
            <option value="Con incidencia">Con incidencia</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="p-5 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-theme-muted/30 border-b border-theme-subtle text-theme-muted font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3.5">Folio / Tipo</th>
                <th className="py-3 px-3">Categoría</th>
                <th className="py-3 px-3">Instalación</th>
                <th className="py-3 px-3">Origen &rarr; Destino</th>
                <th className="py-3 px-2 text-center">Unidades</th>
                <th className="py-3 px-3">Prioridad</th>
                <th className="py-3 px-3">Operador</th>
                <th className="py-3 px-3 text-center">Estado</th>
                <th className="py-3 px-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-subtle font-sans">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-theme-muted/20 transition-colors">
                  
                  {/* Folio & Type */}
                  <td className="py-3 px-3.5">
                    <span className="font-mono font-black text-theme-primary block text-xs">
                      {ord.folio}
                    </span>
                    <span className="text-[10px] text-theme-main font-semibold block">
                      {ord.type}
                    </span>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      ord.category === 'Showroom'
                        ? 'bg-purple-500/10 text-purple-700 border-purple-500/30'
                        : 'bg-blue-500/10 text-blue-700 border-blue-500/30'
                    }`}>
                      {ord.category}
                    </span>
                  </td>

                  {/* Branch */}
                  <td className="py-3 px-3 text-[11px] font-bold text-theme-main">
                    {ord.branchName}
                  </td>

                  {/* Route */}
                  <td className="py-3 px-3 text-[11px]">
                    <div className="space-y-0.5">
                      <span className="text-theme-muted block">{ord.sourceLocation}</span>
                      <span className="font-bold text-theme-main block">&rarr; {ord.destinationLocation}</span>
                    </div>
                  </td>

                  {/* Units */}
                  <td className="py-3 px-2 text-center font-mono font-bold text-theme-main">
                    {ord.completedUnits}/{ord.totalUnits}
                  </td>

                  {/* Priority */}
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      ord.priority === 'Urgente'
                        ? 'bg-rose-500/15 text-rose-700 border border-rose-500/30'
                        : ord.priority === 'Alta'
                        ? 'bg-amber-500/15 text-amber-800 border border-amber-500/30'
                        : 'bg-theme-muted text-theme-muted'
                    }`}>
                      {ord.priority}
                    </span>
                  </td>

                  {/* Operator */}
                  <td className="py-3 px-3 text-[11px] text-theme-muted">
                    {ord.operatorName || 'Sin asignar'}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <StatusBadge variant={getStatusVariant(ord.status)} label={ord.status} size="sm" />
                  </td>

                  {/* Action */}
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    {ord.status !== 'Completa' && ord.status !== 'Cancelada' ? (
                      <button
                        onClick={() => onExecuteOrder(ord)}
                        className="px-3 py-1.5 rounded-xl bg-theme-primary text-white font-bold text-xs hover:bg-theme-primary/90 transition-all shadow-xs flex items-center gap-1 ml-auto cursor-pointer"
                      >
                        <Scan className="w-3.5 h-3.5" />
                        <span>Recolectar</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-theme-muted font-mono">Cerrada</span>
                    )}
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
