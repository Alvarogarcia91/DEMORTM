import React, { useState } from 'react';
import {
  Search,
  X,
  Building2,
  Calendar,
  User,
  Truck,
  Plus,
  FileText,
  AlertTriangle,
  Eye,
  ShoppingBag,
  ArrowRight,
  Boxes,
  CheckCircle2,
  Layers,
  Filter,
  Package
} from 'lucide-react';
import { Requisition, DESTINATION_WAREHOUSES, RequisitionItem } from '../../../data/mockRequisitionsData';
import { RequisitionDetailModal } from '../Requisiciones/RequisitionDetailModal';
import { PriorityBadge } from '../../common/PriorityBadge';

interface PorComprarListProps {
  requisitions: Requisition[];
  onOpenCreateOrderWizard: (req: Requisition, selectedItemIds?: string[]) => void;
  onUpdateRequisition?: (updated: Requisition) => void;
}

type ViewMode = 'needs' | 'requisitions';

export const PorComprarList: React.FC<PorComprarListProps> = ({
  requisitions,
  onOpenCreateOrderWizard,
  onUpdateRequisition,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('needs');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('ALL');
  const [selectedOrigin, setSelectedOrigin] = useState('ALL');
  const [detailedRequisition, setDetailedRequisition] = useState<Requisition | null>(null);

  // Filter only requisitions with status "Lista para compra"
  const readyRequisitions = requisitions.filter((r) => r.status === 'Lista para compra');

  // Flatten items for "Vista por Necesidad de Material"
  const materialNeeds = readyRequisitions.flatMap((req) =>
    req.items.map((item) => {
      const availableQty = item.availableQuantity ?? item.availableStock ?? 0;
      const missingQty = item.missingQuantity ?? Math.max(0, item.quantity - availableQty);
      const origin = item.origin || 'stock mínimo';

      return {
        id: `${req.id}-${item.id}`,
        req,
        item,
        availableQty,
        missingQty,
        origin,
      };
    })
  );

  // Filtered Needs
  const filteredNeeds = materialNeeds.filter((need) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchMaterial = need.item.name.toLowerCase().includes(q);
      const matchSku = need.item.sku.toLowerCase().includes(q);
      const matchReq = need.req.folio.toLowerCase().includes(q);
      const matchSupplier = need.req.suggestedSupplier?.toLowerCase().includes(q);
      const matchRequester = need.req.requester.toLowerCase().includes(q);

      if (!matchMaterial && !matchSku && !matchReq && !matchSupplier && !matchRequester) {
        return false;
      }
    }

    if (selectedWarehouse !== 'ALL' && need.req.targetWarehouseId !== selectedWarehouse) {
      return false;
    }

    if (selectedOrigin !== 'ALL' && need.origin !== selectedOrigin) {
      return false;
    }

    return true;
  });

  // Filtered Requisitions (consolidated view)
  const filteredRequisitions = readyRequisitions.filter((req) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchFolio = req.folio.toLowerCase().includes(q);
      const matchRequester = req.requester.toLowerCase().includes(q);
      const matchSupplier = req.suggestedSupplier?.toLowerCase().includes(q);
      const matchTarget = req.targetWarehouseName.toLowerCase().includes(q);
      const matchItem = req.items.some(
        (it) => it.name.toLowerCase().includes(q) || it.sku.toLowerCase().includes(q)
      );

      if (!matchFolio && !matchRequester && !matchSupplier && !matchTarget && !matchItem) {
        return false;
      }
    }

    if (selectedWarehouse !== 'ALL' && req.targetWarehouseId !== selectedWarehouse) {
      return false;
    }

    if (selectedOrigin !== 'ALL' && !req.items.some((i) => (i.origin || 'stock mínimo') === selectedOrigin)) {
      return false;
    }

    return true;
  });

  const totalPendingUnits = readyRequisitions.reduce(
    (acc, r) => acc + r.items.reduce((sub, i) => sub + (Number(i.quantity) || 0), 0),
    0
  );

  const totalMissingUnits = materialNeeds.reduce((acc, n) => acc + n.missingQty, 0);

  const getOriginBadge = (origin: string) => {
    switch (origin) {
      case 'pedido cliente':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/30 whitespace-nowrap">
            Pedido cliente
          </span>
        );
      case 'stock mínimo':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/30 whitespace-nowrap">
            Stock mínimo
          </span>
        );
      case 'OP/planeación':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/30 whitespace-nowrap">
            OP / Planeación
          </span>
        );
      case 'reposición manual':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-500/10 text-zinc-700 dark:text-zinc-300 border border-zinc-500/30 whitespace-nowrap">
            Reposición manual
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-theme-muted text-theme-muted border border-theme-subtle whitespace-nowrap">
            {origin}
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Informative Banner */}
      <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-theme-primary/10 text-theme-primary border border-theme-primary/30 shadow-2xs flex items-center justify-center font-bold text-xs">
              <Package className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-black text-theme-main">
              Necesidades de Material & Insumos por Comprar
            </h3>
          </div>
          <p className="text-xs text-theme-muted">
            Insumos autorizados requeridos por pedidos de clientes, niveles de stock mínimo o planeación de producción RTM.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs flex-wrap">
          <span className="px-3.5 py-1.5 rounded-xl font-bold bg-theme-surface text-theme-main border border-theme-subtle shadow-2xs">
            {materialNeeds.length} partidas requeridas ({readyRequisitions.length} reqs)
          </span>
          <span className="px-3.5 py-1.5 rounded-xl font-mono font-bold bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20">
            {totalMissingUnits} faltantes por surtir
          </span>
        </div>
      </div>

      {/* View Switcher & Filter Toolbar */}
      <div className="bg-theme-surface p-4 border border-theme-subtle rounded-3xl shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 bg-theme-muted/60 rounded-2xl border border-theme-subtle w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setViewMode('needs')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer flex-1 sm:flex-none justify-center ${
                viewMode === 'needs'
                  ? 'bg-theme-surface text-theme-primary shadow-xs'
                  : 'text-theme-muted hover:text-theme-main'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Por Necesidad de Material</span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-theme-primary/10 text-theme-primary">
                {materialNeeds.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('requisitions')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer flex-1 sm:flex-none justify-center ${
                viewMode === 'requisitions'
                  ? 'bg-theme-surface text-theme-primary shadow-xs'
                  : 'text-theme-muted hover:text-theme-main'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Por Requisición</span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-theme-primary/10 text-theme-primary">
                {readyRequisitions.length}
              </span>
            </button>
          </div>

          {/* Quick Stats or Subtitle */}
          <span className="text-[11px] text-theme-muted hidden md:inline-block">
            {viewMode === 'needs'
              ? 'Mostrando desglose partida por partida para consolidación en OC'
              : 'Mostrando solicitudes completas autorizadas listas para compra'}
          </span>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-theme-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por material, SKU, folio, solicitante, proveedor..."
              className="w-full bg-theme-muted/50 border border-theme-subtle rounded-2xl pl-9 pr-8 py-2 text-xs text-theme-main font-semibold focus:outline-none focus:ring-2 focus:ring-theme-primary/30"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-theme-muted hover:text-theme-main cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Origin Filter */}
          <select
            value={selectedOrigin}
            onChange={(e) => setSelectedOrigin(e.target.value)}
            className="bg-theme-muted border border-theme-subtle rounded-2xl px-3 py-2 text-xs font-semibold text-theme-main focus:outline-none cursor-pointer w-full sm:w-auto"
          >
            <option value="ALL">Todos los orígenes</option>
            <option value="pedido cliente">Pedido cliente</option>
            <option value="stock mínimo">Stock mínimo</option>
            <option value="OP/planeación">OP / Planeación</option>
            <option value="reposición manual">Reposición manual</option>
          </select>

          {/* Warehouse Filter */}
          <select
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
            className="bg-theme-muted border border-theme-subtle rounded-2xl px-3 py-2 text-xs font-semibold text-theme-main focus:outline-none cursor-pointer w-full sm:w-auto"
          >
            <option value="ALL">Todos los destinos</option>
            {DESTINATION_WAREHOUSES.map((wh) => (
              <option key={wh.id} value={wh.id}>
                {wh.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* VIEW 1: MATERIAL NEEDS (PARTIDAS INDIVIDUALES) */}
      {viewMode === 'needs' && (
        <div className="bg-theme-surface border border-theme-subtle rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-theme-muted/60 border-b border-theme-subtle text-theme-muted font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Material / Insumo</th>
                  <th className="py-3 px-3">Clave / SKU</th>
                  <th className="py-3 px-2 text-center">UOM</th>
                  <th className="py-3 px-3 text-center">Requerido</th>
                  <th className="py-3 px-3 text-center">Disponible</th>
                  <th className="py-3 px-3 text-center">Faltante</th>
                  <th className="py-3 px-3">Fecha Requerida</th>
                  <th className="py-3 px-3">Origen</th>
                  <th className="py-3 px-3">Prioridad</th>
                  <th className="py-3 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-subtle font-sans">
                {filteredNeeds.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-theme-muted">
                      <Boxes className="w-8 h-8 mx-auto mb-2 opacity-40 text-theme-muted" />
                      <p className="font-semibold text-xs text-theme-main">No hay necesidades de material pendientes.</p>
                      <p className="text-[11px]">No hay partidas que coincidan con los filtros seleccionados.</p>
                    </td>
                  </tr>
                ) : (
                  filteredNeeds.map((need) => (
                    <tr key={need.id} className="hover:bg-theme-muted/30 transition-colors">
                      {/* Material / Insumo */}
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <strong className="font-bold text-theme-main block text-xs">
                            {need.item.name}
                          </strong>
                          <div className="flex items-center gap-1.5 text-[10px] text-theme-muted">
                            <span className="font-mono text-theme-primary font-semibold">
                              {need.req.folio}
                            </span>
                            <span>&bull;</span>
                            <span className="truncate max-w-[200px]" title={need.item.comments || need.req.notes}>
                              {need.item.comments || need.req.suggestedSupplier || 'Sin notas'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="py-3 px-3 font-mono font-bold text-theme-main whitespace-nowrap">
                        {need.item.sku}
                      </td>

                      {/* UOM */}
                      <td className="py-3 px-2 text-center text-theme-muted uppercase font-mono font-semibold whitespace-nowrap">
                        {need.item.unit}
                      </td>

                      {/* Requerido */}
                      <td className="py-3 px-3 text-center font-mono font-bold text-theme-main whitespace-nowrap">
                        {need.item.quantity}
                      </td>

                      {/* Disponible */}
                      <td className="py-3 px-3 text-center font-mono text-theme-muted whitespace-nowrap">
                        {need.availableQty}
                      </td>

                      {/* Faltante */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span
                          className={`font-mono font-black ${
                            need.missingQty > 0
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-theme-muted'
                          }`}
                        >
                          {need.missingQty > 0 ? `-${need.missingQty}` : '0'}
                        </span>
                      </td>

                      {/* Fecha Requerida */}
                      <td className="py-3 px-3 font-mono text-theme-muted whitespace-nowrap">
                        {need.req.requiredDate}
                      </td>

                      {/* Origen */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        {getOriginBadge(need.origin)}
                      </td>

                      {/* Prioridad */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <PriorityBadge priority={need.req.priority} size="sm" />
                      </td>

                      {/* Accion */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setDetailedRequisition(need.req)}
                            className="p-1.5 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main transition-colors cursor-pointer"
                            title="Ver requisición de origen"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onOpenCreateOrderWizard(need.req, [need.item.id])}
                            className="px-3 py-1.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                            title="Generar Orden de Compra para este insumo"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Atender en OC</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: CONSOLIDATED REQUISITIONS */}
      {viewMode === 'requisitions' && (
        <div className="bg-theme-surface border border-theme-subtle rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-theme-muted/60 border-b border-theme-subtle text-theme-muted font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Requisición</th>
                  <th className="py-3 px-3">Destino</th>
                  <th className="py-3 px-3">Solicitante</th>
                  <th className="py-3 px-3 text-center">Partidas</th>
                  <th className="py-3 px-3 text-center">Unidades</th>
                  <th className="py-3 px-3">Fecha Requerida</th>
                  <th className="py-3 px-3">Proveedor Sugerido</th>
                  <th className="py-3 px-3">Prioridad</th>
                  <th className="py-3 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-subtle font-sans">
                {filteredRequisitions.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-theme-muted">
                      <Boxes className="w-8 h-8 mx-auto mb-2 opacity-40 text-theme-muted" />
                      <p className="font-semibold text-xs text-theme-main">No hay requisiciones pendientes de compra.</p>
                      <p className="text-[11px]">Todas las solicitudes autorizadas han sido consolidadas o no coinciden con los filtros.</p>
                    </td>
                  </tr>
                ) : (
                  filteredRequisitions.map((req) => {
                    const totalUnits = req.items.reduce((acc, i) => acc + (Number(i.quantity) || 0), 0);

                    return (
                      <tr key={req.id} className="hover:bg-theme-muted/30 transition-colors">
                        {/* Requisicion */}
                        <td className="py-3 px-4 font-mono font-black text-theme-main whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setDetailedRequisition(req)}
                              className="hover:underline text-theme-primary font-mono text-left cursor-pointer"
                            >
                              {req.folio}
                            </button>
                            {req.purchaseOrderCoverage && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-white text-zinc-900 border border-amber-500 shadow-2xs">
                                {req.purchaseOrderCoverage.coveredItems}/{req.purchaseOrderCoverage.totalItems} atendidas
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Destino */}
                        <td className="py-3 px-3 whitespace-nowrap font-semibold text-theme-main">
                          {req.targetWarehouseName}
                        </td>

                        {/* Solicitante */}
                        <td className="py-3 px-3 whitespace-nowrap text-theme-main">
                          {req.requester}
                        </td>

                        {/* Articulos */}
                        <td className="py-3 px-3 text-center whitespace-nowrap font-mono font-bold text-theme-main">
                          {req.items.length}
                        </td>

                        {/* Unidades */}
                        <td className="py-3 px-3 text-center whitespace-nowrap font-mono font-black text-theme-primary">
                          {totalUnits}
                        </td>

                        {/* Fecha requerida */}
                        <td className="py-3 px-3 font-mono text-theme-muted whitespace-nowrap">
                          {req.requiredDate}
                        </td>

                        {/* Proveedor sugerido */}
                        <td
                          className="py-3 px-3 whitespace-nowrap text-theme-muted truncate max-w-[150px]"
                          title={req.suggestedSupplier || 'Sin asignar'}
                        >
                          {req.suggestedSupplier || '—'}
                        </td>

                        {/* Prioridad */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          <PriorityBadge priority={req.priority} size="sm" />
                        </td>

                        {/* Accion */}
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setDetailedRequisition(req)}
                              className="p-1.5 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main transition-colors cursor-pointer"
                              title="Ver detalle completo de requisición"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => setDetailedRequisition(req)}
                              className="px-3.5 py-1.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Atender requisición</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Requisition Detailed Decision-Making Modal */}
      {detailedRequisition && (
        <RequisitionDetailModal
          requisition={detailedRequisition}
          onClose={() => setDetailedRequisition(null)}
          onUpdateRequisition={(updated) => {
            if (onUpdateRequisition) onUpdateRequisition(updated);
            setDetailedRequisition(updated);
          }}
          onCreatePurchaseOrder={(req, selectedItemIds) => {
            setDetailedRequisition(null);
            onOpenCreateOrderWizard(req, selectedItemIds);
          }}
        />
      )}
    </div>
  );
};
