import React, { useMemo, useState } from 'react';
import { Search, Printer, CheckCircle2 } from 'lucide-react';
import { ProductionArea, ProductionOrder } from '../../data/mockProduccionData';
import { ProductionCard, ProgressBar, StatusBadge } from './productionUi';

interface Props {
  orders: ProductionOrder[];
  onOpenOrder: (order: ProductionOrder) => void;
  onPrintSheet?: (order: ProductionOrder) => void;
  compact?: boolean;
}

export const OrdenesProduccion: React.FC<Props> = ({
  orders,
  onOpenOrder,
  onPrintSheet,
  compact = false,
}) => {
  const [query, setQuery] = useState('');
  const [area, setArea] = useState<'Todas' | ProductionArea>('Todas');

  const rows = useMemo(
    () =>
      orders.filter(
        (order) =>
          (area === 'Todas' || order.area === area) &&
          `${order.folio} ${order.cliente} ${order.partNumber}`.toLowerCase().includes(query.toLowerCase())
      ),
    [area, orders, query]
  );

  return (
    <ProductionCard>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-theme-subtle p-5">
        <div>
          <b>Órdenes de producción</b>
          <p className="mt-1 text-xs text-theme-muted">
            Pedido, capacidad, reserva de insumos, estado de impresión de hoja de OP y avance de piso.
          </p>
        </div>
        {!compact && (
          <div className="flex gap-2">
            <label className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-theme-muted" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-48 rounded-xl border border-theme-subtle bg-theme-surface py-2 pl-8 pr-3 text-xs"
                placeholder="Buscar OP o cliente"
              />
            </label>
            <select
              value={area}
              onChange={(event) => setArea(event.target.value as 'Todas' | ProductionArea)}
              className="rounded-xl border border-theme-subtle bg-theme-surface px-2 text-xs"
            >
              <option>Todas</option>
              <option>Offset</option>
              <option>Flexografía</option>
              <option>Acabados</option>
            </select>
          </div>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1150px] text-xs">
          <thead className="bg-theme-muted/50 text-[10px] uppercase text-theme-muted">
            <tr>
              {[
                'OP',
                'Pedido',
                'Cliente',
                'Parte / revisión',
                'Área',
                'Hoja OP (Física)',
                'Compromiso',
                'Estado',
                'Avance',
                '',
              ].map((label) => (
                <th className="p-3 text-left" key={label}>
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, compact ? 7 : rows.length).map((order) => {
              const isPrinted = order.sheetPrintedStatus?.isPrinted;

              return (
                <tr className="border-t border-theme-subtle hover:bg-theme-muted/30" key={order.id}>
                  <td className="p-3 font-mono font-bold">{order.folio}</td>
                  <td className="p-3 font-mono">{order.pedido}</td>
                  <td className="p-3 font-bold">{order.cliente}</td>
                  <td className="p-3">
                    {order.partNumber}
                    <small className="block text-theme-muted">{order.revision}</small>
                  </td>
                  <td className="p-3">{order.area}</td>

                  {/* Estado de Hoja de OP Impresa (Dolencia de Iván - Sección 9) */}
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          isPrinted
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300'
                        }`}
                      >
                        {isPrinted ? <CheckCircle2 className="h-3 w-3" /> : '○'}
                        {isPrinted ? 'Impresa ✓' : 'No impresa'}
                      </span>
                      {onPrintSheet && (
                        <button
                          type="button"
                          onClick={() => onPrintSheet(order)}
                          title={isPrinted ? 'Reimprimir hoja de OP' : 'Imprimir hoja de OP para piso'}
                          className="rounded p-1 hover:bg-theme-muted/40 text-theme-muted hover:text-theme-primary"
                        >
                          <Printer className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </td>

                  <td className="p-3">{order.due}</td>
                  <td className="p-3">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="min-w-36 p-3">
                    <ProgressBar value={order.progress} />
                    <small className="mt-1 block text-theme-muted">
                      {order.progress}% · {order.good.toLocaleString('es-MX')} buenas
                    </small>
                  </td>
                  <td className="p-3">
                    <button onClick={() => onOpenOrder(order)} className="font-bold text-theme-primary">
                      Abrir OP
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </ProductionCard>
  );
};
