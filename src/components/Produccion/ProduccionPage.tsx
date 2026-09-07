import React, { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { PRODUCTION_ORDERS, ProductionOrder } from '../../data/mockProduccionData';
import { DashboardProduccion } from './DashboardProduccion';
import { PlaneacionProduccion } from './PlaneacionProduccion';
import { OrdenesProduccion } from './OrdenesProduccion';
import { OrdenProduccionDetail } from './OrdenProduccionDetail';
import { PisoProduccion } from './PisoProduccion';
import { MaquinasCapacidad } from './MaquinasCapacidad';
import { AnaliticaProduccion } from './AnaliticaProduccion';
import { ReportarIncidenciaModal } from './ReportarIncidenciaModal';
import { NewProductionOrderWizard } from './NewProductionOrderWizard';

type ProductionTab = 'Dashboard' | 'Planeación' | 'Órdenes' | 'Piso' | 'Máquinas' | 'Analítica';

export const ProduccionPage: React.FC = () => {
  const [tab, setTab] = useState<ProductionTab>('Dashboard');
  const [orders, setOrders] = useState<ProductionOrder[]>(PRODUCTION_ORDERS);
  const [selected, setSelected] = useState<ProductionOrder | null>(null);
  const [incidence, setIncidence] = useState<ProductionOrder | null>(null);
  const [notice, setNotice] = useState('');
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const activeOrders = useMemo(
    () => orders.filter((order) => !['Terminada', 'Liberada'].includes(order.status)),
    [orders]
  );

  const updateOrder = (id: string, patch: Partial<ProductionOrder>) => {
    setOrders((current) => current.map((order) => (order.id === id ? { ...order, ...patch } : order)));
  };

  const openOrder = (order: ProductionOrder) => {
    setSelected(orders.find((item) => item.id === order.id) ?? order);
  };

  const handleCreateOrderFromWizard = (newOrder: ProductionOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
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

  const releaseOrder = () => {
    if (!selected) return;
    updateOrder(selected.id, {
      status: 'Liberada',
      progress: 100,
      good: selected.quantity,
      qualityGates: {
        ...(selected.qualityGates ?? { prepressReleased: true, firstPieceReleased: true }),
        finalAuditApproved: true,
      },
      traceability: [
        {
          id: `tr-rel-${Date.now()}`,
          timestamp: '07 Sep · 12:00',
          user: 'Alicia Ramírez (Calidad)',
          station: 'Mesa de Calidad',
          event: 'OP Liberada por Calidad Final',
          notes: 'Cumplimiento 100% especificaciones RTM. Traspaso a Almacén de Producto Terminado.',
          badgeTone: 'success',
        },
        ...(selected.traceability ?? []),
      ],
    });
    setNotice(`${selected.folio} liberada por Calidad y disponible para entrega a cliente.`);
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

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header superior */}
      <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-[10px] font-black tracking-widest text-theme-primary">PRODUCCIÓN · RTM</p>
          <h1 className="text-2xl font-black text-theme-main">Producción y piso</h1>
          <p className="text-xs text-theme-muted">
            Del pedido a la liberación: configuración técnica, paginación, insumos, planeación, ejecución y trazabilidad.
          </p>
        </div>

        {/* Botón Nueva OP real: abre wizard */}
        <button
          type="button"
          onClick={() => setIsWizardOpen(true)}
          className="flex items-center gap-1.5 w-fit rounded-xl bg-theme-primary px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-theme-primary/90 transition-all hover:scale-[1.02]"
        >
          <Plus className="h-4 w-4" />
          Nueva OP
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-theme-subtle">
        {(['Dashboard', 'Planeación', 'Órdenes', 'Piso', 'Máquinas', 'Analítica'] as ProductionTab[]).map((item) => (
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
      {tab === 'Dashboard' && <DashboardProduccion orders={orders} onOpenOrder={openOrder} />}

      {tab === 'Planeación' && (
        <PlaneacionProduccion
          orders={orders}
          onOpenOrder={openOrder}
          onMoveOrder={handleMoveOrder}
        />
      )}

      {tab === 'Órdenes' && <OrdenesProduccion orders={orders} onOpenOrder={openOrder} />}

      {tab === 'Piso' && (
        <PisoProduccion
          orders={activeOrders}
          onOpenOrder={openOrder}
          onUpdate={updateOrder}
          onIncident={setIncidence}
        />
      )}

      {tab === 'Máquinas' && <MaquinasCapacidad />}

      {tab === 'Analítica' && <AnaliticaProduccion orders={orders} onNotice={setNotice} />}

      {/* Modal Wizard de Nueva OP */}
      {isWizardOpen && (
        <NewProductionOrderWizard
          onClose={() => setIsWizardOpen(false)}
          onCreateOrder={handleCreateOrderFromWizard}
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
          onRelease={releaseOrder}
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
    </div>
  );
};
