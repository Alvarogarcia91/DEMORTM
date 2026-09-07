import React, { useState } from 'react';
import { ProductionOrder } from '../../data/mockProduccionData';
import { ModalPortal } from '../common/ModalPortal';
import { Printer, X, CheckCircle2, Clock, AlertTriangle, FileText, Download } from 'lucide-react';

interface Props {
  order: ProductionOrder;
  onClose: () => void;
  onConfirmPrint: (order: ProductionOrder) => void;
}

export const HojaOpPreviewModal: React.FC<Props> = ({ order, onClose, onConfirmPrint }) => {
  const isAlreadyPrinted = order.sheetPrintedStatus?.isPrinted;
  const currentReprintCount = order.sheetPrintedStatus?.reprintCount ?? 0;
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      onConfirmPrint(order);
      setIsPrinting(false);
      onClose();
    }, 600);
  };

  return (
    <ModalPortal onClose={onClose}>
      <div className="flex h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-theme-subtle bg-theme-surface shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Header con estado */}
        <div className="flex items-center justify-between border-b border-theme-subtle bg-theme-surface px-6 py-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-theme-primary/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-theme-primary">
                DOCUMENTO OPERATIVO OFICIAL RTM · FM-PR-024
              </span>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                  isAlreadyPrinted
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                }`}
              >
                {isAlreadyPrinted ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                {isAlreadyPrinted
                  ? `Impresa ✓ (${currentReprintCount > 0 ? `Copia #${currentReprintCount + 1}` : 'Original emitida'})`
                  : 'No impresa · Pendiente'}
              </span>
            </div>
            <h2 className="text-lg font-black text-theme-main mt-0.5">
              Hoja de Ruta de Orden de Producción ({order.folio})
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              disabled={isPrinting}
              className="flex items-center gap-1.5 rounded-xl bg-theme-primary px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-theme-primary/90 transition-all"
            >
              <Printer className="h-4 w-4" />
              {isPrinting ? 'Generando impresión...' : isAlreadyPrinted ? '🖨 Reimprimir Hoja OP' : '🖨 Imprimir Hoja OP'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-theme-subtle p-2 text-theme-muted hover:bg-theme-muted/30"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Hoja de papel simulada para impresión */}
        <div className="flex-1 overflow-y-auto bg-theme-muted/30 p-6 flex justify-center">
          <div className="w-full max-w-3xl rounded-xl border border-theme-subtle bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 p-8 shadow-md font-sans text-xs space-y-5">
            {/* Encabezado formal de la hoja de viajera */}
            <div className="border-b-2 border-zinc-800 dark:border-zinc-300 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black tracking-tight text-blue-900 dark:text-blue-400">RTM</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">
                      Rótulos y Troqueles de Monterrey
                    </span>
                  </div>
                  <h1 className="text-base font-black uppercase tracking-wide mt-1">
                    ORDEN DE FABRICACIÓN Y HOJA VIAJERA DE PRODUCCIÓN
                  </h1>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    Código: FM-PR-024 · Rev. 04 · Sistema de Gestión SGC
                  </span>
                </div>

                <div className="text-right">
                  <div className="rounded-lg border-2 border-blue-600 dark:border-blue-400 p-2 font-mono text-center">
                    <span className="block text-[9px] uppercase font-bold text-zinc-500">Folio de Producción</span>
                    <span className="text-base font-black text-blue-800 dark:text-blue-300">{order.folio}</span>
                  </div>
                  <span className="block text-[10px] text-zinc-500 mt-1">
                    Pedido: <b>{order.pedido}</b>
                  </span>
                </div>
              </div>
            </div>

            {/* Metadatos principales en tabla */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] bg-zinc-50 dark:bg-zinc-800/40 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700">
              <div>
                <span className="text-zinc-500 block">Cliente:</span>
                <b className="font-bold text-zinc-900 dark:text-zinc-100">{order.cliente}</b>
              </div>
              <div>
                <span className="text-zinc-500 block">No. de Parte / Rev:</span>
                <b className="font-mono text-zinc-900 dark:text-zinc-100">{order.partNumber} ({order.revision})</b>
              </div>
              <div>
                <span className="text-zinc-500 block">Línea de Proceso:</span>
                <b className="text-zinc-900 dark:text-zinc-100">{order.area}</b>
              </div>
              <div>
                <span className="text-zinc-500 block">Máquina Asignada:</span>
                <b className="text-blue-700 dark:text-blue-300 font-bold">{order.machine}</b>
              </div>

              <div>
                <span className="text-zinc-500 block">Cantidad a Producir:</span>
                <b className="font-mono text-sm text-zinc-900 dark:text-zinc-100">{order.quantity.toLocaleString('es-MX')} piezas</b>
              </div>
              <div>
                <span className="text-zinc-500 block">Fecha Compromiso Cliente:</span>
                <b className="text-zinc-900 dark:text-zinc-100">{order.due}</b>
              </div>
              <div>
                <span className="text-zinc-500 block">Fecha Interna Planta:</span>
                <b className="text-zinc-900 dark:text-zinc-100">{order.internalTargetDate || '12 Sep'}</b>
              </div>
              <div>
                <span className="text-zinc-500 block">Prioridad / Riesgo:</span>
                <b className="text-zinc-900 dark:text-zinc-100">{order.priority} · Riesgo {order.deliveryRisk || 'Bajo'}</b>
              </div>
            </div>

            {/* Especificaciones técnicas del producto */}
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-3 space-y-2">
              <h3 className="text-[11px] font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                1. Especificaciones Técnicas y Herramental
              </h3>
              {order.area === 'Offset' && order.offsetSpecs && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div>
                    <span className="text-zinc-500 block">Páginas / Formas:</span>
                    <b>{order.offsetSpecs.pages} págs ({order.offsetSpecs.formsDetail?.join(' + ') || `${order.offsetSpecs.formCount || 2} formas`})</b>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Papel / Gramaje:</span>
                    <b>{order.offsetSpecs.paperType} ({order.offsetSpecs.paperWeightGsm} g)</b>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Tintas Frente / Vuelta:</span>
                    <b>{order.offsetSpecs.inksFront} x {order.offsetSpecs.inksBack}</b>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Acabado / Grapado:</span>
                    <b>{order.offsetSpecs.stapleType}</b>
                  </div>
                </div>
              )}

              {order.area === 'Flexografía' && order.flexoSpecs && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div>
                    <span className="text-zinc-500 block">Sustrato / Ancho:</span>
                    <b>{order.flexoSpecs.substrate} ({order.flexoSpecs.widthMm} mm)</b>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Tintas / Acabado:</span>
                    <b>{order.flexoSpecs.cmykOrPantone}</b>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Grabado / Cliché:</span>
                    <b className="font-mono">{order.flexoSpecs.engravingRef} ({order.flexoSpecs.engravingStatus})</b>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Suaje / Repetición:</span>
                    <b>{order.flexoSpecs.dieTeeth} dientes · Rep {order.flexoSpecs.dieRepeat}</b>
                  </div>
                </div>
              )}

              <div className="pt-2 text-[10px] text-zinc-500 border-t border-zinc-200 dark:border-zinc-700 flex justify-between">
                <span>Herramental verificado: <b>{order.tooling}</b></span>
                {order.expedited && (
                  <span className="font-bold text-amber-700 dark:text-amber-400">
                    ⚡ OP EXPEDITADA BAJO AUTORIZACIÓN GERENCIAL
                  </span>
                )}
              </div>
            </div>

            {/* Materiales requeridos y entregados a pie de máquina */}
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-3 space-y-2">
              <h3 className="text-[11px] font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                2. Control de Insumos y Materia Prima Entregada a Máquina
              </h3>
              <table className="w-full text-[11px] border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-700 text-left text-zinc-500">
                    <th className="py-1">Insumo</th>
                    <th className="py-1">Requerido</th>
                    <th className="py-1">Entregado</th>
                    <th className="py-1">Lote / Almacén</th>
                    <th className="py-1 text-center">Firma Recibido Almacén</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {(order.materials && order.materials.length > 0 ? order.materials : [
                    { id: 'm1', item: 'Papel Bond 60g 57x87 cm', required: '12,500 pliegos', delivered: '12,500 pliegos', lot: 'BND-260815' }
                  ]).map((mat, i) => (
                    <tr key={i}>
                      <td className="py-1.5 font-medium">{mat.item}</td>
                      <td className="py-1.5 font-mono">{mat.required}</td>
                      <td className="py-1.5 font-mono font-bold text-emerald-700 dark:text-emerald-400">{mat.delivered}</td>
                      <td className="py-1.5 font-mono text-zinc-500">{mat.lot || 'LOTE-STD'}</td>
                      <td className="py-1.5 text-center text-zinc-400">____________________</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Ruta de procesos con casillas físicas de firma para el operador */}
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-3 space-y-2">
              <h3 className="text-[11px] font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                3. Secuencia de Procesos y Firmas Físicas de Operación
              </h3>
              <table className="w-full text-[11px] border-collapse">
                <thead>
                  <tr className="border-b-2 border-zinc-300 dark:border-zinc-700 text-left text-zinc-600 dark:text-zinc-400 text-[10px] uppercase">
                    <th className="py-1">Paso</th>
                    <th className="py-1">Operación</th>
                    <th className="py-1">Estación / Máq</th>
                    <th className="py-1 text-center">Setup / Run</th>
                    <th className="py-1 text-center">Buenas / Scrap</th>
                    <th className="py-1 text-center">1ra Pieza QA</th>
                    <th className="py-1 text-center">Firma Operador</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 font-mono text-[10px]">
                  {(order.routing && order.routing.length > 0 ? order.routing : [
                    { stepNumber: 1, process: 'Impresión', machine: order.machine, setupMinutes: 30, runMinutes: 120, requiresFirstPieceQuality: true },
                    { stepNumber: 2, process: 'Corte / Acabado', machine: 'Guillotina 2', setupMinutes: 15, runMinutes: 45, requiresFirstPieceQuality: false },
                  ]).map((st, i) => (
                    <tr key={i} className="h-9">
                      <td className="font-bold">#{st.stepNumber}</td>
                      <td className="font-sans font-semibold text-zinc-900 dark:text-zinc-100">{st.process}</td>
                      <td>{st.machine}</td>
                      <td className="text-center">{st.setupMinutes}m / {st.runMinutes}m</td>
                      <td className="text-center text-zinc-400">[ ____ / ____ ]</td>
                      <td className="text-center">
                        {st.requiresFirstPieceQuality ? (
                          <span className="font-bold text-blue-700 dark:text-blue-300">[ QA Obligatorio ]</span>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td className="text-center text-zinc-400">________________</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pie de página con código de barras y estado de emisión */}
            <div className="pt-3 border-t border-zinc-200 dark:border-zinc-700 flex flex-wrap items-center justify-between gap-3 text-[10px] text-zinc-500">
              <div>
                <span className="block font-mono">|||| | ||||| ||||||| ||| |||||| |||||||| |||||</span>
                <span className="font-mono text-[9px]">{order.folio}-{order.pedido}</span>
              </div>
              <div className="text-right">
                <span>Emitida por: <b>Planner RTM</b></span>
                <span className="block">Fecha de emisión física: <b>{order.sheetPrintedStatus?.printedAt || 'Pendiente'}</b></span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-theme-subtle bg-theme-surface px-6 py-4">
          <span className="text-xs text-theme-muted">
            {isAlreadyPrinted
              ? `Hoja física ya fue impresa previamente. Al confirmar se registrará como reimpresión (copia #${currentReprintCount + 1}).`
              : 'Al imprimir, la OP pasará al estado "Impresa ✓" y quedará registrada en la trazabilidad para entrega a piso.'}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-theme-subtle px-4 py-2 text-xs font-bold text-theme-muted hover:bg-theme-muted/30"
            >
              Cerrar
            </button>
            <button
              type="button"
              onClick={handlePrint}
              disabled={isPrinting}
              className="flex items-center gap-1.5 rounded-xl bg-theme-primary px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-theme-primary/90"
            >
              <Printer className="h-4 w-4" />
              {isPrinting ? 'Imprimiendo...' : isAlreadyPrinted ? 'Confirmar Reimpresión' : 'Confirmar e Imprimir'}
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};
