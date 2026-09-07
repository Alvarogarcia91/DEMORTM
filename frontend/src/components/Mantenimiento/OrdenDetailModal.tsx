import React, { useState } from 'react';
import { 
  X, Wrench, AlertTriangle, CheckCircle, Clock, Package, 
  ShoppingCart, Plus, Trash2, ArrowRight, User, DollarSign,
  AlertCircle, ChevronRight, Activity, Calendar, FileText
} from 'lucide-react';
import { ModalPortal } from '../common/ModalPortal';
import { 
  MaintenanceWorkOrder, 
  WorkOrderStatus, 
  MaintenanceSparePart,
  WorkOrderSparePart,
  mockSparePartsCatalog,
  PRIORITY_LABELS,
  STATUS_LABELS,
  MOCK_TECHNICIANS
} from '../../data/mockMaintenanceData';

interface OrdenDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: MaintenanceWorkOrder | null;
  onUpdateOrder: (updatedOrder: MaintenanceWorkOrder) => void;
  onNavigateToRequisitions?: (prefilledItem: {
    sku: string;
    productName: string;
    brand: string;
    quantity: number;
    targetWarehouseId?: string;
    note?: string;
  }) => void;
}

export const OrdenDetailModal: React.FC<OrdenDetailModalProps> = ({
  isOpen,
  onClose,
  order,
  onUpdateOrder,
  onNavigateToRequisitions
}) => {
  if (!isOpen || !order) return null;

  // Local editing state
  const [currentStatus, setCurrentStatus] = useState<WorkOrderStatus>(order.status);
  const [assignedTechnician, setAssignedTechnician] = useState(order.assignedTechnician || MOCK_TECHNICIANS[0]);
  const [downtimeHours, setDowntimeHours] = useState(order.downtimeHours.toString());
  const [laborHours, setLaborHours] = useState((order.downtimeHours || 2.0).toFixed(1));
  const [diagnosis, setDiagnosis] = useState(order.diagnosis || '');
  const [workPerformed, setWorkPerformed] = useState(order.workPerformed || '');
  const [spareParts, setSpareParts] = useState<WorkOrderSparePart[]>(order.spareParts || []);

  // Add spare part form state
  const [selectedSparePartId, setSelectedSparePartId] = useState<string>(mockSparePartsCatalog[0].id);
  const [sparePartQty, setSparePartQty] = useState<number>(1);
  const [insufficientStockAlert, setInsufficientStockAlert] = useState<{
    part: MaintenanceSparePart;
    requested: number;
  } | null>(() => {
    // Check if any existing spare part in this order has insufficient stock
    const badPart = order.spareParts.find(p => {
      const cat = mockSparePartsCatalog.find(c => c.id === p.partId || c.sku === p.sku);
      return cat && cat.stockQuantity < p.quantityUsed;
    });
    if (badPart) {
      const cat = mockSparePartsCatalog.find(c => c.id === badPart.partId || c.sku === badPart.sku);
      if (cat) return { part: cat, requested: badPart.quantityUsed };
    }
    return null;
  });

  const selectedCatalogItem = mockSparePartsCatalog.find(p => p.id === selectedSparePartId);

  // Status transitions
  const handleStatusChange = (newStatus: WorkOrderStatus) => {
    setCurrentStatus(newStatus);
  };

  const handleAddSparePart = () => {
    if (!selectedCatalogItem || sparePartQty <= 0) return;

    const hasSufficient = selectedCatalogItem.stockQuantity >= sparePartQty;

    if (!hasSufficient) {
      setInsufficientStockAlert({
        part: selectedCatalogItem,
        requested: sparePartQty
      });
    } else {
      setInsufficientStockAlert(null);
    }

    const existingIdx = spareParts.findIndex(p => p.partId === selectedCatalogItem.id || p.sku === selectedCatalogItem.sku);
    let updatedParts: WorkOrderSparePart[];

    if (existingIdx >= 0) {
      updatedParts = [...spareParts];
      const newQty = updatedParts[existingIdx].quantityUsed + sparePartQty;
      updatedParts[existingIdx] = {
        ...updatedParts[existingIdx],
        quantityUsed: newQty,
        isSufficientStock: selectedCatalogItem.stockQuantity >= newQty,
        status: (selectedCatalogItem.stockQuantity >= newQty) ? 'Surtido' : 'Pendiente de compra'
      };
    } else {
      const newPart: WorkOrderSparePart = {
        id: `sp-${Date.now()}`,
        partId: selectedCatalogItem.id,
        sku: selectedCatalogItem.sku,
        name: selectedCatalogItem.name,
        quantityUsed: sparePartQty,
        unitCostMxn: selectedCatalogItem.unitCostMxn,
        isSufficientStock: hasSufficient,
        status: hasSufficient ? 'Surtido' : 'Pendiente de compra'
      };
      updatedParts = [...spareParts, newPart];
    }

    setSpareParts(updatedParts);
  };

  const handleRemoveSparePart = (partId: string) => {
    const updated = spareParts.filter(p => p.id !== partId && p.partId !== partId);
    setSpareParts(updated);
    if (insufficientStockAlert && insufficientStockAlert.part.id === partId) {
      setInsufficientStockAlert(null);
    }
  };

  const calculateLaborCost = () => {
    const hrs = parseFloat(laborHours) || 0;
    return hrs * 350; // $350 MXN / hr
  };

  const calculateSparePartsCost = () => {
    return spareParts.reduce((acc, p) => acc + (p.quantityUsed * p.unitCostMxn), 0);
  };

  const calculateTotalCost = () => {
    return calculateLaborCost() + calculateSparePartsCost();
  };

  const handleSaveChanges = (overrideStatus?: WorkOrderStatus) => {
    const statusToSave = overrideStatus || currentStatus;
    const dHours = parseFloat(downtimeHours) || 0;

    const timeline = [...order.timeline];
    if (statusToSave !== order.status) {
      timeline.push({
        id: `time-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        actor: 'Ing. Mantenimiento',
        role: 'Supervisor de Mantenimiento',
        type: statusToSave === 'Terminada' ? 'completed' : statusToSave === 'En espera de refacción' ? 'waiting_parts' : 'note',
        message: `Cambio de estado a ${statusToSave}. ${workPerformed ? `Procedimiento: ${workPerformed}` : ''}`
      });
    }

    const updatedOrder: MaintenanceWorkOrder = {
      ...order,
      status: statusToSave,
      assignedTechnician,
      downtimeHours: dHours,
      isMachineDown: statusToSave !== 'Terminada' && dHours > 0,
      diagnosis: diagnosis.trim() || undefined,
      workPerformed: workPerformed.trim() || undefined,
      spareParts,
      completedAt: statusToSave === 'Terminada' ? new Date().toISOString().substring(0, 16).replace('T', ' ') : order.completedAt,
      timeline
    };

    onUpdateOrder(updatedOrder);
    onClose();
  };

  const handleCreateRequisitionFromPart = (part: MaintenanceSparePart, qty: number) => {
    if (onNavigateToRequisitions) {
      onNavigateToRequisitions({
        sku: part.sku,
        productName: part.name,
        brand: part.suggestedSupplier,
        quantity: qty > 0 ? qty : 2,
        targetWarehouseId: 'alm-rtm-mp',
        note: `Requisición generada automáticamente por falta de stock para atender la orden de mantenimiento ${order.folio} (${order.machineCode}).`
      });
      // Also suggest putting order in 'En espera de refacción'
      setCurrentStatus('En espera de refacción');
      onClose();
    } else {
      alert(`Requisición para ${part.sku} (${qty} ${part.uom}) enviada a Compras.`);
    }
  };

  const priorityMeta = PRIORITY_LABELS[order.priority] || PRIORITY_LABELS['Normal'];

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-theme-surface border border-theme-subtle rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
          {/* Top Header */}
          <div className="p-5 border-b border-theme-subtle bg-theme-surface flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-3 rounded-xl bg-theme-primary/10 border border-theme-primary/20 text-theme-primary">
                <Wrench className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono text-sm font-bold text-theme-primary bg-theme-primary/10 px-2.5 py-0.5 rounded border border-theme-primary/20">
                    {order.folio}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${priorityMeta.bgColor} ${priorityMeta.color} ${priorityMeta.borderColor}`}>
                    Prioridad: {priorityMeta.label}
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-theme-subtle text-theme-muted">
                    {order.type}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-theme-main mt-1">
                  {order.folio} - {order.issueDescription}
                </h2>
                <p className="text-xs text-theme-muted mt-0.5">
                  Máquina: <strong className="text-theme-main font-mono">[{order.machineCode}] {order.machineName}</strong>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-theme-muted hover:text-theme-main hover:bg-theme-subtle/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper / Status Workflow */}
          <div className="px-6 py-3 border-b border-theme-subtle bg-theme-subtle/20 flex items-center justify-between overflow-x-auto gap-2 text-xs">
            {(['Solicitada', 'Programada', 'En proceso', 'En espera de refacción', 'Terminada'] as WorkOrderStatus[]).map((st, i) => {
              const isActive = currentStatus === st;
              const isPast = ['Solicitada', 'Programada', 'En proceso', 'En espera de refacción', 'Terminada'].indexOf(currentStatus) > i;

              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => handleStatusChange(st)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                    isActive
                      ? 'bg-theme-primary text-theme-primary-contrast font-bold shadow-sm'
                      : isPast
                      ? 'text-theme-main bg-theme-subtle/60 hover:bg-theme-subtle'
                      : 'text-theme-muted hover:text-theme-main hover:bg-theme-subtle/40'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] border border-current">
                    {i + 1}
                  </span>
                  <span>{st}</span>
                </button>
              );
            })}
          </div>

          {/* Insufficient Stock Banner if triggered */}
          {insufficientStockAlert && (
            <div className="mx-6 mt-4 p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 flex items-start justify-between gap-4 animate-in fade-in">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400">
                    Existencia Insuficiente en Almacén
                  </h4>
                  <p className="text-xs text-theme-muted mt-0.5">
                    La refacción <strong className="text-theme-main font-mono">{insufficientStockAlert.part.sku}</strong> ({insufficientStockAlert.part.name})
                    cuenta con <span className="font-bold text-rose-600 dark:text-rose-400">{insufficientStockAlert.part.stockQuantity} {insufficientStockAlert.part.uom}</span> en existencia física (Requerido: {insufficientStockAlert.requested} {insufficientStockAlert.part.uom}).
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleCreateRequisitionFromPart(insufficientStockAlert.part, insufficientStockAlert.requested)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm flex items-center gap-1.5 transition-all"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  Crear Requisición a Compras
                </button>
              </div>
            </div>
          )}

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
            {/* Section 1: General Info & Failure Symptoms */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 p-4 rounded-xl border border-theme-subtle bg-theme-surface space-y-3">
                <h3 className="font-bold text-theme-main text-xs flex items-center gap-2">
                  <Activity className="w-4 h-4 text-theme-primary" />
                  Diagnóstico y Síntomas Reportados
                </h3>
                <div className="p-3 rounded-lg bg-theme-subtle/30 border border-theme-subtle text-theme-main">
                  {order.issueDescription}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-[11px]">
                  <div>
                    <span className="text-theme-muted block">Reportado por:</span>
                    <span className="font-semibold text-theme-main">{order.requestedBy}</span>
                  </div>
                  <div>
                    <span className="text-theme-muted block">Fecha de Reporte:</span>
                    <span className="font-mono text-theme-main">{order.openedAt}</span>
                  </div>
                  <div>
                    <span className="text-theme-muted block">Fecha Programada:</span>
                    <span className="font-mono text-theme-main">{order.scheduledDate || 'Inmediata'}</span>
                  </div>
                </div>
              </div>

              {/* Assignment & Controls */}
              <div className="p-4 rounded-xl border border-theme-subtle bg-theme-surface space-y-3">
                <h3 className="font-bold text-theme-main text-xs flex items-center gap-2">
                  <User className="w-4 h-4 text-theme-primary" />
                  Asignación y Tiempos
                </h3>

                <div>
                  <label className="text-theme-muted block mb-1">Técnico Responsable:</label>
                  <select
                    value={assignedTechnician}
                    onChange={e => setAssignedTechnician(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-theme-subtle bg-theme-surface text-theme-main text-xs focus:border-theme-primary outline-none"
                  >
                    {MOCK_TECHNICIANS.map((t: string) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-theme-muted block mb-1">Tiempo Muerto Máquina (Hrs):</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={downtimeHours}
                    onChange={e => setDowntimeHours(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-theme-subtle bg-theme-surface text-theme-main text-xs font-mono focus:border-theme-primary outline-none"
                  />
                </div>

                <div>
                  <label className="text-theme-muted block mb-1">Horas Hombre Técnicas (Hrs):</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={laborHours}
                    onChange={e => setLaborHours(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-theme-subtle bg-theme-surface text-theme-main text-xs font-mono focus:border-theme-primary outline-none"
                  />
                  <span className="text-[10px] text-theme-muted block mt-0.5">Tarifa estándar: $350.00 MXN / hr</span>
                </div>
              </div>
            </div>

            {/* Section 2: Spare Parts Management */}
            <div className="p-4 rounded-xl border border-theme-subtle bg-theme-surface space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-theme-main text-xs flex items-center gap-2">
                  <Package className="w-4 h-4 text-theme-primary" />
                  Refacciones y Consumibles Utilizados
                </h3>
                <span className="text-theme-muted text-[11px]">
                  Total refacciones: <strong className="text-theme-main">${calculateSparePartsCost().toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN</strong>
                </span>
              </div>

              {/* Add part form */}
              <div className="p-3 rounded-xl bg-theme-subtle/20 border border-theme-subtle grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                <div className="sm:col-span-7">
                  <label className="block text-[10px] text-theme-muted mb-1">Seleccionar Refacción del Catálogo:</label>
                  <select
                    value={selectedSparePartId}
                    onChange={e => setSelectedSparePartId(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-theme-subtle bg-theme-surface text-theme-main text-xs focus:border-theme-primary outline-none"
                  >
                    {mockSparePartsCatalog.map((item: MaintenanceSparePart) => (
                      <option key={item.id} value={item.id}>
                        [{item.sku}] {item.name} - Stock: {item.stockQuantity} {item.uom} (${item.unitCostMxn.toLocaleString('es-MX')} MXN)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-theme-muted mb-1">Cantidad:</label>
                  <input
                    type="number"
                    min="1"
                    value={sparePartQty}
                    onChange={e => setSparePartQty(parseInt(e.target.value) || 1)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-theme-subtle bg-theme-surface text-theme-main text-xs font-mono focus:border-theme-primary outline-none"
                  />
                </div>

                <div className="sm:col-span-3 flex items-end">
                  <button
                    type="button"
                    onClick={handleAddSparePart}
                    className="w-full mt-4 sm:mt-0 py-1.5 px-3 rounded-lg text-xs font-semibold bg-theme-primary text-theme-primary-contrast hover:opacity-90 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Asignar Refacción
                  </button>
                </div>
              </div>

              {/* Parts table */}
              {spareParts.length === 0 ? (
                <div className="p-6 text-center text-theme-muted text-xs border border-dashed border-theme-subtle rounded-xl">
                  No se han registrado refacciones consumidas en esta orden de trabajo.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-theme-subtle text-theme-muted">
                        <th className="pb-2 font-medium">Código SKU</th>
                        <th className="pb-2 font-medium">Descripción</th>
                        <th className="pb-2 font-medium text-center">Cantidad</th>
                        <th className="pb-2 font-medium text-right">Costo Unitario</th>
                        <th className="pb-2 font-medium text-right">Subtotal</th>
                        <th className="pb-2 font-medium text-center">Estado Stock</th>
                        <th className="pb-2 font-medium text-center">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-theme-subtle">
                      {spareParts.map(sp => {
                        const catItem = mockSparePartsCatalog.find(c => c.id === sp.partId || c.sku === sp.sku);
                        const hasStock = catItem ? catItem.stockQuantity >= sp.quantityUsed : sp.isSufficientStock;

                        return (
                          <tr key={sp.id || sp.sku} className="hover:bg-theme-subtle/20">
                            <td className="py-2.5 font-mono font-semibold text-theme-primary">{sp.sku}</td>
                            <td className="py-2.5 text-theme-main font-medium">{sp.name}</td>
                            <td className="py-2.5 text-center font-mono">{sp.quantityUsed}</td>
                            <td className="py-2.5 text-right font-mono">${sp.unitCostMxn.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                            <td className="py-2.5 text-right font-mono font-bold">${(sp.quantityUsed * sp.unitCostMxn).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                            <td className="py-2.5 text-center">
                              {hasStock ? (
                                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">
                                  <CheckCircle className="w-3 h-3" />
                                  Disponible ({catItem?.stockQuantity})
                                </span>
                              ) : (
                                <div className="inline-flex flex-col items-center">
                                  <span className="inline-flex items-center gap-1 text-[10px] text-rose-600 dark:text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded">
                                    <AlertTriangle className="w-3 h-3" />
                                    Insuficiente (Stock {catItem?.stockQuantity})
                                  </span>
                                  {catItem && (
                                    <button
                                      type="button"
                                      onClick={() => handleCreateRequisitionFromPart(catItem, sp.quantityUsed)}
                                      className="text-[10px] text-theme-primary underline hover:text-theme-primary/80 mt-0.5 font-bold"
                                    >
                                      Requisitar a Compras
                                    </button>
                                  )}
                                </div>
                              )}
                            </td>
                            <td className="py-2.5 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveSparePart(sp.id || sp.partId)}
                                className="p-1 text-theme-muted hover:text-rose-500 transition-colors"
                                title="Eliminar refacción"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Section 3: Causa Raíz y Solución */}
            <div className="p-4 rounded-xl border border-theme-subtle bg-theme-surface space-y-4">
              <h3 className="font-bold text-theme-main text-xs flex items-center gap-2">
                <FileText className="w-4 h-4 text-theme-primary" />
                Diagnóstico Técnico y Procedimiento de Solución
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-theme-muted mb-1 font-medium">
                    Diagnóstico de Falla:
                  </label>
                  <textarea
                    value={diagnosis}
                    onChange={e => setDiagnosis(e.target.value)}
                    rows={3}
                    placeholder="Ej. Desgaste por fricción debido a ciclo de vida cumplido en rodamiento. Falta de lubricación periódica..."
                    className="w-full px-3 py-2 rounded-xl border border-theme-subtle bg-theme-surface text-theme-main text-xs focus:border-theme-primary outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-theme-muted mb-1 font-medium">
                    Trabajos Realizados / Procedimiento de Solución:
                  </label>
                  <textarea
                    value={workPerformed}
                    onChange={e => setWorkPerformed(e.target.value)}
                    rows={3}
                    placeholder="Ej. Desmontaje de soporte lateral, extracción con extractor hidráulico, montaje de rodamiento SKF 6205-2RS nuevo, lubricación con Shell Omala y prueba sin vibraciones."
                    className="w-full px-3 py-2 rounded-xl border border-theme-subtle bg-theme-surface text-theme-main text-xs focus:border-theme-primary outline-none resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Cost Breakdown & Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Cost Card */}
              <div className="p-4 rounded-xl border border-theme-subtle bg-theme-subtle/20 space-y-3">
                <h4 className="font-bold text-theme-main text-xs flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-theme-primary" />
                  Liquidación de Costos de Mantenimiento
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-theme-muted">
                    <span>Mano de obra ({laborHours} hrs @ $350/hr):</span>
                    <span className="font-mono text-theme-main">${calculateLaborCost().toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN</span>
                  </div>
                  <div className="flex justify-between text-theme-muted">
                    <span>Refacciones y consumibles:</span>
                    <span className="font-mono text-theme-main">${calculateSparePartsCost().toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN</span>
                  </div>
                  <div className="pt-2 border-t border-theme-subtle flex justify-between text-sm font-bold text-theme-main">
                    <span>Costo Total Acumulado:</span>
                    <span className="font-mono text-theme-primary">${calculateTotalCost().toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN</span>
                  </div>
                </div>
              </div>

              {/* Timeline Card */}
              <div className="p-4 rounded-xl border border-theme-subtle bg-theme-surface space-y-2 max-h-48 overflow-y-auto">
                <h4 className="font-bold text-theme-main text-xs flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-theme-primary" />
                  Bitácora de Eventos y Trazabilidad
                </h4>

                <div className="space-y-3">
                  {order.timeline.map((event, idx) => (
                    <div key={event.id || idx} className="text-[11px] border-l-2 border-theme-primary/40 pl-3 relative">
                      <div className="flex items-center justify-between text-theme-muted">
                        <span className="font-semibold text-theme-main">{event.actor} ({event.role})</span>
                        <span className="font-mono text-[10px]">{event.timestamp}</span>
                      </div>
                      <p className="text-theme-muted mt-0.5">{event.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="p-4 px-6 border-t border-theme-subtle bg-theme-surface flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-theme-muted">Estado actual:</span>
              <span className="font-semibold text-xs text-theme-main px-2 py-0.5 rounded bg-theme-subtle">
                {currentStatus}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-theme-subtle text-theme-main hover:bg-theme-subtle/80 transition-colors"
              >
                Cerrar
              </button>

              <button
                type="button"
                onClick={() => handleSaveChanges()}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-theme-subtle text-theme-main hover:bg-theme-subtle/80 transition-colors"
              >
                Guardar Avance
              </button>

              {currentStatus !== 'Terminada' && (
                <button
                  type="button"
                  onClick={() => handleSaveChanges('Terminada')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all flex items-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  Finalizar y Cerrar OT
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};
