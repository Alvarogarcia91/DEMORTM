import React, { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import {
  PRODUCTION_ORDERS,
  ProductionOrder,
  MasterManufacturingRecipe,
  OperatorDailyReportEntry,
  OPERATOR_DAILY_REPORTS,
} from '../../data/mockProduccionData';
import { DashboardProduccion } from './DashboardProduccion';
import { PlaneacionProduccion } from './PlaneacionProduccion';
import { OrdenesProduccion } from './OrdenesProduccion';
import { OrdenProduccionDetail } from './OrdenProduccionDetail';
import { PisoProduccion } from './PisoProduccion';
import { PisoOperadorWorkspace } from './PisoOperadorWorkspace';
import { MaquinasCapacidad } from './MaquinasCapacidad';
import { AnaliticaProduccion } from './AnaliticaProduccion';
import { ScrapPérdidasWorkspace } from './ScrapPérdidasWorkspace';
import { ReportarIncidenciaModal } from './ReportarIncidenciaModal';
import { NewProductionOrderWizard } from './NewProductionOrderWizard';
import { ConfiguracionFabricacion } from './ConfiguracionFabricacion';
import { HojaOpPreviewModal } from './HojaOpPreviewModal';

type ProductionTab = 'Dashboard' | 'Planeación' | 'Órdenes' | 'Piso' | 'Procesos' | 'Máquinas' | 'Scrap y pérdidas' | 'Analítica';

interface ProduccionPageProps {
  orders?: ProductionOrder[];
  onUpdateOrder?: (id: string, patch: Partial<ProductionOrder>) => void;
  onAddOrder?: (newOrder: ProductionOrder) => void;
  onNavigateToCalidad?: (opFolio?: string) => void;
}

export const ProduccionPage: React.FC<ProduccionPageProps> = ({
  orders: externalOrders,
  onUpdateOrder: externalUpdateOrder,
  onAddOrder: externalAddOrder,
  onNavigateToCalidad,
}) => {
  const [tab, setTab] = useState<ProductionTab>('Dashboard');
  const [localOrders, setLocalOrders] = useState<ProductionOrder[]>(PRODUCTION_ORDERS);
  const orders = externalOrders || localOrders;
  const [selected, setSelected] = useState<ProductionOrder | null>(null);
  const [incidence, setIncidence] = useState<ProductionOrder | null>(null);
  const [notice, setNotice] = useState('');
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [initialRecipe, setInitialRecipe] = useState<MasterManufacturingRecipe | null>(null);
  const [dailyReports, setDailyReports] = useState<OperatorDailyReportEntry[]>(OPERATOR_DAILY_REPORTS);
  const [sheetPreviewOrder, setSheetPreviewOrder] = useState<ProductionOrder | null>(null);
  const [isOperatorTerminalOpen, setIsOperatorTerminalOpen] = useState(false);

  const activeOrders = useMemo(
    () => orders.filter((order) => !['Terminada', 'Liberada'].includes(order.status)),
    [orders]
  );

  const updateOrder = (id: string, patch: Partial<ProductionOrder>) => {
    if (externalUpdateOrder) {
      externalUpdateOrder(id, patch);
    } else {
      setLocalOrders((current) => current.map((order) => (order.id === id ? { ...order, ...patch } : order)));
    }
  };

  const openOrder = (order: ProductionOrder) => {
    setSelected(orders.find((item) => item.id === order.id) ?? order);
  };

  const handleCreateOrderFromWizard = (newOrder: ProductionOrder) => {
    if (externalAddOrder) {
      externalAddOrder(newOrder);
    } else {
      setLocalOrders((prev) => [newOrder, ...prev]);
    }
    setNotice(
      `✓ ${newOrder.folio} creada exitosamente para ${newOrder.cliente} (${newOrder.area}). Programada en ${newOrder.machine} y disponible en Planeación y Piso.`
    );
    // Cambiar a pestaña Planeación para mostrar que la OP ya llegó
    setTab('Planeación');
  };

  const saveIncident = (minutes: number, category: string, comment: string) => {
    if (!incidence) return;
    updateOrder(incidence.id, {
      status: 'Detenida',
      stopMinutes: (incidence.stopMinutes ?? 0) + minutes,
    });
    setNotice(
      `Incidencia ${category} registrada en ${incidence.folio}${
        comment ? ` · ${comment}` : ''
      }. ${minutes} min reflejados en el piso.`
    );
    setIncidence(null);
  };

  const requestFinalAudit = () => {
    if (!selected) return;
    updateOrder(selected.id, {
      status: 'Pendiente de calidad',
      traceability: [
        {
          id: `tr-req-fin-${Date.now()}`,
          timestamp: '07 Sep · 12:00',
          user: 'Supervisor de Turno',
          station: 'Piso de Producción',
          event: 'Auditoría Final solicitada a Calidad',
          notes: 'Tiraje terminado. Esperando inspección por muestreo de Alicia Ramírez (Calidad).',
          badgeTone: 'primary',
        },
        ...(selected.traceability ?? []),
      ],
    });
    setNotice(`✓ Auditoría final de ${selected.folio} solicitada a Calidad. Ve al módulo de Calidad para emitir el dictamen.`);
    setSelected(null);
  };

  const handleMoveOrder = (order: ProductionOrder, newMachine?: string, newDate?: string, reason?: string) => {
    const updatedPatch: Partial<ProductionOrder> = {
      due: newDate || '12 Sep',
      machine: newMachine || order.machine,
      traceability: [
        {
          id: `tr-move-${Date.now()}`,
          timestamp: '07 Sep · 09:40',
          user: 'Planner RTM',
          station: 'Planeación',
          event: `Reprogramada a ${newDate || '12 Sep'} en ${newMachine || order.machine}`,
          notes: reason || 'Nivelación de carga en planta',
          badgeTone: 'primary',
        },
        ...(order.traceability ?? []),
      ],
    };
    updateOrder(order.id, updatedPatch);
    setNotice(
      `${order.folio} reprogramada a ${newDate || '12 Sep'} en ${newMachine || order.machine}. Capacidad semanal recalculada.`
    );
  };

  const handlePrintSheet = (order: ProductionOrder) => {
    setSheetPreviewOrder(order);
  };

  const confirmPrintSheet = (order: ProductionOrder) => {
    const isAlreadyPrinted = order.sheetPrintedStatus?.isPrinted;
    const currentReprintCount = order.sheetPrintedStatus?.reprintCount ?? 0;
    const updatedStatus = {
      isPrinted: true,
      printedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      printedBy: 'Planner RTM',
      reprintCount: isAlreadyPrinted ? currentReprintCount + 1 : 0,
    };
    updateOrder(order.id, {
      sheetPrintedStatus: updatedStatus,
      traceability: [
        {
          id: `tr-print-${Date.now()}`,
          timestamp: '07 Sep · 10:30',
          user: 'Planner RTM',
          station: 'Oficina de Producción',
          event: isAlreadyPrinted ? `Hoja de OP Reimpresa (copia #${updatedStatus.reprintCount})` : 'Hoja de OP Física Impresa para Piso',
          notes: 'Entregada al operador para control físico en máquina (FM-PR-024).',
          badgeTone: 'primary',
        },
        ...(order.traceability ?? []),
      ],
    });
    setNotice(
      isAlreadyPrinted
        ? `Hoja de OP física reimpresa para ${order.folio} (copia #${updatedStatus.reprintCount}).`
        : `✓ Hoja de OP física para ${order.folio} marcada como impresa y entregada a piso.`
    );
    setSheetPreviewOrder(null);
  };

  const handleMarkMaterialDelivered = (order: ProductionOrder) => {
    const newStatus = order.toolingAlert ? 'Por surtir' : 'Lista para producir';
    updateOrder(order.id, {
      status: newStatus,
      traceability: [
        {
          id: `tr-mat-del-${Date.now()}`,
          timestamp: '07 Sep · 09:50',
          user: 'Almacén MP / Logística RTM',
          station: 'Almacén MP',
          event: 'Material surtido a pie de máquina (Ventana 24h)',
          notes: 'Bobinas, pliegos y tintas posicionados físicamente en máquina.',
          badgeTone: 'success',
        },
        ...(order.traceability ?? []),
      ],
    });
    setNotice(`✓ Material de ${order.folio} surtido a pie de máquina. Estado actualizado a "${newStatus}".`);
  };

  const handleSaveDailyReport = (entry: OperatorDailyReportEntry) => {
    setDailyReports((prev) => [entry, ...prev]);
    const ord = orders.find((o) => o.folio === entry.opFolio);
    if (ord) {
      updateOrder(ord.id, {
        good: (ord.good ?? 0) + entry.producedQuantity,
        traceability: [
          {
            id: `tr-rep-${entry.id}`,
            timestamp: '07 Sep · 14:00',
            user: entry.operator,
            station: entry.areaMachine,
            event: `Reporte Diario de Turno (${entry.shift})`,
            notes: `${entry.producedQuantity.toLocaleString()} unidades producidas. Código: ${entry.code} - ${entry.codeDescription}. ${entry.comments}`,
            badgeTone: 'primary',
          },
          ...(ord.traceability ?? []),
        ],
      });
    }
    setNotice(
      `✓ Reporte de operador persistido para ${entry.opFolio} (${entry.areaMachine}, ${entry.operator}). Unidades y trazabilidad actualizadas en la orden.`
    );
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header superior */}
      <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-[10px] font-black tracking-widest text-theme-primary">PRODUCCIÓN · RTM</p>
          <h1 className="text-2xl font-black text-theme-main">Producción y piso</h1>
          <p className="text-xs text-theme-muted">
            Del pedido a la liberación: recetas maestras, paginación, insumos, planeación, ejecución y trazabilidad.
          </p>
        </div>

        {/* Botón Nueva OP real: abre wizard */}
        <button
          type="button"
          onClick={() => {
            setInitialRecipe(null);
            setIsWizardOpen(true);
          }}
          className="flex items-center gap-1.5 w-fit rounded-xl bg-theme-primary px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-theme-primary/90 transition-all hover:scale-[1.02]"
        >
          <Plus className="h-4 w-4" />
          Nueva OP
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-theme-subtle">
        {(['Dashboard', 'Planeación', 'Órdenes', 'Piso', 'Procesos', 'Máquinas', 'Scrap y pérdidas', 'Analítica'] as ProductionTab[]).map((item) => (
          <button
            type="button"
            onClick={() => setTab(item)}
            key={item}
            className={`shrink-0 border-b-2 px-4 py-3 text-xs font-bold transition-colors ${
              tab === item
                ? 'border-theme-primary text-theme-primary'
                : 'border-transparent text-theme-muted hover:text-theme-main'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Notificación toast/banner */}
      {notice && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-emerald-400 bg-theme-surface p-3 text-xs shadow-xs animate-in fade-in">
          <span className="text-theme-main">{notice}</span>
          <button
            type="button"
            onClick={() => setNotice('')}
            className="font-bold text-emerald-700 hover:underline"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Contenido según pestaña */}
      {tab === 'Dashboard' && (
        <DashboardProduccion
          orders={orders}
          onOpenOrder={openOrder}
          onNavigateTab={(targetTab) => setTab(targetTab)}
          onNewOrder={() => {
            setInitialRecipe(null);
            setIsWizardOpen(true);
          }}
        />
      )}

      {tab === 'Planeación' && (
        <PlaneacionProduccion
          orders={orders}
          onOpenOrder={openOrder}
          onMoveOrder={handleMoveOrder}
          onMarkMaterialDelivered={handleMarkMaterialDelivered}
        />
      )}

      {tab === 'Órdenes' && (
        <OrdenesProduccion
          orders={orders}
          onOpenOrder={openOrder}
          onPrintSheet={handlePrintSheet}
        />
      )}

      {tab === 'Piso' && (
        isOperatorTerminalOpen ? (
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setIsOperatorTerminalOpen(false)}
              className="flex items-center gap-1.5 rounded-xl border border-theme-subtle px-3.5 py-2 text-xs font-bold text-theme-muted hover:text-theme-main bg-theme-surface shadow-xs transition-colors"
            >
              &larr; Volver a Consola Supervisor de Piso
            </button>
            <PisoOperadorWorkspace
              orders={orders}
              onUpdateOrder={updateOrder}
              onNavigateToProduccion={() => setIsOperatorTerminalOpen(false)}
              onNavigateToCalidad={onNavigateToCalidad}
            />
          </div>
        ) : (
          <PisoProduccion
            orders={activeOrders}
            onOpenOrder={openOrder}
            onUpdate={updateOrder}
            onIncident={setIncidence}
            onSaveDailyReport={handleSaveDailyReport}
            dailyReports={dailyReports}
            onOpenTerminal={() => setIsOperatorTerminalOpen(true)}
          />
        )
      )}

      {tab === 'Procesos' && (
        <ConfiguracionFabricacion
          onSelectRecipeForNewOrder={(recipe) => {
            setInitialRecipe(recipe);
            setIsWizardOpen(true);
          }}
        />
      )}

      {tab === 'Máquinas' && (
        <MaquinasCapacidad
          onNavigateTab={(targetTab) => setTab(targetTab as any)}
          onNotice={setNotice}
        />
      )}
 
      {tab === 'Scrap y pérdidas' && (
        <ScrapPérdidasWorkspace orders={orders} onOpenOrder={openOrder} onNotice={setNotice} />
      )}

      {tab === 'Analítica' && (
        <AnaliticaProduccion
          orders={orders}
          onNotice={setNotice}
          onOpenOrder={(folio) => {
            const found = orders.find((o) => o.folio === folio);
            if (found) {
              openOrder(found);
            } else {
              setNotice(`Orden ${folio} referenciada en analítica.`);
            }
          }}
          onNavigateTab={(targetTab) => setTab(targetTab)}
        />
      )}

      {/* Modal Wizard de Nueva OP */}
      {isWizardOpen && (
        <NewProductionOrderWizard
          initialRecipe={initialRecipe || undefined}
          onClose={() => {
            setIsWizardOpen(false);
            setInitialRecipe(null);
          }}
          onCreateOrder={(newOrder) => {
            handleCreateOrderFromWizard(newOrder);
            setIsWizardOpen(false);
            setInitialRecipe(null);
          }}
        />
      )}

      {/* Modal Detalle de OP */}
      {selected && (
        <OrdenProduccionDetail
          order={orders.find((order) => order.id === selected.id) ?? selected}
          onClose={() => setSelected(null)}
          onIncident={() => {
            setIncidence(selected);
            setSelected(null);
          }}
          onRelease={requestFinalAudit}
          onPrintSheet={handlePrintSheet}
          onRequestMaterialExtra={() => {
            const ord = orders.find((order) => order.id === selected.id) ?? selected;
            setSelected(null);
            setTab('Piso');
            setNotice(`Para solicitar material adicional de ${ord.folio}, usa el botón en la consola de Piso.`);
          }}
        />
      )}

      {/* Modal Incidencia 4M */}
      {incidence && (
        <ReportarIncidenciaModal
          order={incidence}
          onClose={() => setIncidence(null)}
          onSave={saveIncident}
        />
      )}

      {/* Modal Vista Previa / Reimpresión de Hoja OP */}
      {sheetPreviewOrder && (
        <HojaOpPreviewModal
          order={orders.find((o) => o.id === sheetPreviewOrder.id) ?? sheetPreviewOrder}
          onClose={() => setSheetPreviewOrder(null)}
          onConfirmPrint={confirmPrintSheet}
        />
      )}
    </div>
  );
};
