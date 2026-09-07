import React, { useState } from 'react';
import { Printer, CheckCircle2, X, Barcode, QrCode, Tag, ArrowRight } from 'lucide-react';
import { ModalPortal } from '../common/ModalPortal';
import { ZebraLabelConfig } from '../../data/mockCalidadData';

interface Props {
  initialConfig?: Partial<ZebraLabelConfig>;
  onClose: () => void;
  onPrint?: (config: ZebraLabelConfig) => void;
}

export const ZebraLabelPreviewModal: React.FC<Props> = ({
  initialConfig,
  onClose,
  onPrint,
}) => {
  const [labelType, setLabelType] = useState<ZebraLabelConfig['type']>(
    initialConfig?.type || 'Identificación de Caja'
  );
  const [isPrinting, setIsPrinting] = useState(false);
  const [printSuccess, setPrintSuccess] = useState(false);

  const getStandardCode = (type: ZebraLabelConfig['type']) => {
    switch (type) {
      case 'Identificación de Caja':
        return 'FM-QA-153';
      case 'Parcial de Producción':
        return 'FM-QA-154';
      case 'Batch / Lote':
        return 'FM-QA-155';
      case 'Primera Pieza Aprobada':
        return 'FM-QA-172';
      case 'Material en HOLD':
        return 'FM-QA-180';
    }
  };

  const config: ZebraLabelConfig = {
    id: `LBL-${Date.now()}`,
    type: labelType,
    standardCode: getStandardCode(labelType),
    opFolio: initialConfig?.opFolio || 'OP-2026-95250',
    client: initialConfig?.client || 'Panasonic Industrial',
    partNumber: initialConfig?.partNumber || '526412 | G |',
    revision: initialConfig?.revision || 'Rev G',
    lotNumber: initialConfig?.lotNumber || 'PT-260907-00381',
    quantity: initialConfig?.quantity || 1000,
    boxNumber: initialConfig?.boxNumber || '01',
    totalBoxes: initialConfig?.totalBoxes || '25',
    auditor: initialConfig?.auditor || 'Alicia Ramírez (Calidad)',
    date: '07-SEP-2026 11:30',
    status: labelType === 'Material en HOLD' ? 'HOLD / Cuarentena' : 'Aprobado',
  };

  const handleSendToPrinter = () => {
    setIsPrinting(true);
    setTimeout(() => {
      setIsPrinting(false);
      setPrintSuccess(true);
      if (onPrint) onPrint(config);
      setTimeout(() => {
        setPrintSuccess(false);
      }, 3000);
    }, 1200);
  };

  const isHold = labelType === 'Material en HOLD';

  return (
    <ModalPortal onClose={onClose}>
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-theme-subtle bg-theme-surface shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-theme-subtle p-5">
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-theme-primary" />
            <div>
              <h2 className="text-base font-black text-theme-main">
                Preview de Etiqueta Térmica Zebra (ZPL)
              </h2>
              <p className="text-xs text-theme-muted">
                Emisión de rótulo para identificación de caja, bache, primera pieza o producto en cuarentena.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-xl p-2 text-theme-muted hover:bg-theme-muted/30"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Selector de tipo de etiqueta */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-theme-muted">
              Seleccionar Formato Estándar RTM:
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 text-xs">
              {(
                [
                  'Identificación de Caja',
                  'Parcial de Producción',
                  'Batch / Lote',
                  'Primera Pieza Aprobada',
                  'Material en HOLD',
                ] as ZebraLabelConfig['type'][]
              ).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setLabelType(type)}
                  className={`rounded-xl border p-2.5 text-center font-bold transition-all ${
                    labelType === type
                      ? type === 'Material en HOLD'
                        ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 shadow-xs'
                        : 'border-theme-primary bg-theme-primary/10 text-theme-primary shadow-xs'
                      : 'border-theme-subtle bg-theme-surface text-theme-muted hover:border-theme-primary/50'
                  }`}
                >
                  <span className="block text-[10px] font-mono opacity-70">
                    {getStandardCode(type)}
                  </span>
                  <span className="mt-0.5 block line-clamp-2 leading-tight">{type}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Render de Etiqueta Estilo Térmica (Zebra 4x6 / 4x4 in) */}
          <div className="flex justify-center p-4 bg-zinc-200 dark:bg-zinc-950 rounded-2xl border border-theme-subtle">
            <div
              className={`w-full max-w-md rounded-lg border-2 bg-white text-zinc-900 p-5 shadow-lg font-sans transition-colors ${
                isHold ? 'border-rose-600' : 'border-zinc-900'
              }`}
            >
              {/* Header de la etiqueta */}
              <div
                className={`flex items-start justify-between border-b-2 pb-3 ${
                  isHold ? 'border-rose-600 bg-rose-50/50 -m-5 p-5 mb-3' : 'border-zinc-900'
                }`}
              >
                <div>
                  <h3 className="font-black text-sm tracking-tighter uppercase">
                    IMPRESOS RTM, S.A. DE C.V.
                  </h3>
                  <p className="text-[10px] font-bold text-zinc-600 uppercase">
                    CONTROL DE CALIDAD & ASEGURAMIENTO
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block rounded px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                      isHold
                        ? 'bg-rose-600 text-white'
                        : 'bg-zinc-900 text-white'
                    }`}
                  >
                    {config.standardCode}
                  </span>
                  <span className="block font-mono text-[9px] mt-0.5 text-zinc-600">
                    {config.type}
                  </span>
                </div>
              </div>

              {/* Status Banner */}
              <div
                className={`my-3 text-center py-1 rounded font-black tracking-widest text-xs uppercase border ${
                  isHold
                    ? 'bg-rose-100 text-rose-900 border-rose-600'
                    : 'bg-emerald-100 text-emerald-900 border-emerald-600'
                }`}
              >
                {isHold ? '⚠ MATERIAL EN HOLD / NO USAR' : '✓ PRODUCTO LIBERADO CONFORME'}
              </div>

              {/* Datos Técnicos Principales */}
              <div className="grid grid-cols-2 gap-3 text-xs border-b border-zinc-300 pb-3">
                <div>
                  <span className="block text-[9px] uppercase font-bold text-zinc-500">
                    CLIENTE:
                  </span>
                  <b className="text-zinc-950 text-sm font-black uppercase">{config.client}</b>
                </div>
                <div>
                  <span className="block text-[9px] uppercase font-bold text-zinc-500">
                    ORDEN DE PROD:
                  </span>
                  <b className="font-mono text-zinc-950 font-black text-sm">{config.opFolio}</b>
                </div>
                <div>
                  <span className="block text-[9px] uppercase font-bold text-zinc-500">
                    NO. PARTE:
                  </span>
                  <b className="font-mono text-zinc-950 font-bold">{config.partNumber}</b>
                </div>
                <div>
                  <span className="block text-[9px] uppercase font-bold text-zinc-500">
                    REVISIÓN:
                  </span>
                  <b className="font-mono text-zinc-950 font-bold">{config.revision}</b>
                </div>
              </div>

              {/* Cantidad y Lote */}
              <div className="grid grid-cols-3 gap-2 text-xs py-3 border-b border-zinc-300">
                <div>
                  <span className="block text-[9px] uppercase font-bold text-zinc-500">
                    CANTIDAD:
                  </span>
                  <b className="font-mono text-base text-zinc-950 font-black">
                    {config.quantity.toLocaleString('es-MX')}
                  </b>
                </div>
                <div>
                  <span className="block text-[9px] uppercase font-bold text-zinc-500">
                    CAJA / ROLLO:
                  </span>
                  <b className="font-mono text-base text-zinc-950 font-black">
                    {config.boxNumber} / {config.totalBoxes}
                  </b>
                </div>
                <div>
                  <span className="block text-[9px] uppercase font-bold text-zinc-500">
                    LOTE PT:
                  </span>
                  <b className="font-mono text-xs text-zinc-950 font-bold">{config.lotNumber}</b>
                </div>
              </div>

              {/* Simulación de Código de Barras Code 128 */}
              <div className="my-3 text-center space-y-1">
                <div className="flex justify-center items-center h-12 bg-white px-2">
                  <div className="flex items-center gap-[2px] h-10">
                    {[3, 1, 2, 1, 3, 2, 1, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 1, 2, 4, 2, 1, 3, 2, 1, 4, 1, 2, 3, 2, 1, 3, 1, 4, 2].map(
                      (w, idx) => (
                        <span
                          key={idx}
                          className="bg-zinc-950 h-full inline-block"
                          style={{ width: `${w}px` }}
                        />
                      )
                    )}
                  </div>
                </div>
                <p className="font-mono text-[10px] tracking-widest font-bold text-zinc-800">
                  *{config.opFolio}*{config.lotNumber}*
                </p>
              </div>

              {/* Footer de la etiqueta */}
              <div className="flex items-center justify-between text-[10px] text-zinc-600 pt-2 border-t border-zinc-200">
                <span>
                  AUDITOR: <b className="text-zinc-900">{config.auditor}</b>
                </span>
                <span>{config.date}</span>
              </div>
            </div>
          </div>

          {/* Notificación de éxito */}
          {printSuccess && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 p-3 text-xs font-bold text-emerald-800 dark:text-emerald-200 animate-in fade-in">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              Etiqueta enviada con éxito a impresora Zebra térmica QA-02 (IP: 192.168.1.140).
            </div>
          )}

          {/* Acciones de impresión */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-theme-subtle pt-4">
            <div className="text-xs text-theme-muted">
              Dispositivo destino: <b className="text-theme-main">Zebra ZT411 (Cuarto de Calidad QA-02)</b>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-theme-subtle px-4 py-2 text-xs font-bold text-theme-muted hover:text-theme-main"
              >
                Cerrar
              </button>
              <button
                type="button"
                disabled={isPrinting}
                onClick={handleSendToPrinter}
                className={`flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-bold text-white shadow-md transition-all ${
                  isHold
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-theme-primary hover:bg-theme-primary/90'
                }`}
              >
                <Printer className="h-4 w-4" />
                {isPrinting ? 'Enviando comando ZPL...' : 'Enviar a Zebra QA-02 · Demo'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};
