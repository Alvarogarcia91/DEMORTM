import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  ChevronDown, 
  ChevronUp, 
  Boxes, 
  QrCode, 
  Calendar, 
  Clock, 
  MapPin, 
  Printer, 
  Eye, 
  Sparkles,
  Layers,
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  History,
  FileText,
  AlertTriangle,
  ArrowRight,
  User,
  CheckCircle2
} from 'lucide-react';
import { StockItemRecord, PositionSerializedItem, InventoryMovement, MOCK_INVENTORY_MOVEMENTS } from '../../data/mockInventoryData';
import { ModalPortal } from '../common/ModalPortal';
import { StatusBadge } from '../common/StatusBadge';
import { SemanticVariant } from '../common/semanticTokens';

export interface ArticleLotBreakdown {
  lotNumber: string;
  qaStatus: 'Pendiente QA' | 'Liberado' | 'Cuarentena' | 'Rechazado';
  physicalQuantity: number;
  reservedQuantity: number;
  qaBlockedQuantity: number;
  availableQuantity: number;
  location: string;
  entryDate: string;
  notes?: string;
}

export interface ArticleStockSummary {
  sku: string;
  productName: string;
  brand: string;
  size: string;
  category: string;
  uom: string;
  mainLocation: string;
  defaultLot: string;
  relatedOp?: string;
  totalPhysical: number;
  availableQuantity: number;
  reservedQuantity: number;
  qaBlockedQuantity: number;
  lots: ArticleLotBreakdown[];
  locations: { locationCode: string; quantity: number }[];
  allUnits: StockItemRecord[];
  recentMovements: InventoryMovement[];
  // compatibility fields
  totalUnits?: number;
  availableUnits?: number;
  committedUnits?: number;
  stagingUnits?: number;
  shippingUnits?: number;
  reworkUnits?: number;
  inTransitUnits?: number;
  warehouses?: any[];
}

interface ArticleStockDrawerProps {
  article: ArticleStockSummary | null;
  onClose: () => void;
  onOpenUnitDetail: (unit: PositionSerializedItem) => void;
  onOpenQr: (unit: PositionSerializedItem) => void;
  onPrintQr: (unit: PositionSerializedItem) => void;
  onLocateInMap?: (locationCode: string) => void;
}

export const ArticleStockDrawer: React.FC<ArticleStockDrawerProps> = ({
  article,
  onClose,
  onOpenUnitDetail,
  onOpenQr,
  onPrintQr,
  onLocateInMap,
}) => {
  const [activeTab, setActiveTab] = useState<'lotes' | 'unidades' | 'kardex'>('lotes');

  if (!article) return null;

  const getQaVariant = (qaStatus: string): SemanticVariant => {
    switch (qaStatus) {
      case 'Liberado':
        return 'success';
      case 'Pendiente QA':
        return 'warning';
      case 'Cuarentena':
      case 'Rechazado':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  const toSerializedItem = (item: StockItemRecord): PositionSerializedItem => {
    const locParts = item.location.split('-');
    const levelCode = (locParts[1] === 'C' || locParts[1] === 'B' || locParts[1] === 'A') ? locParts[1] : 'A';

    return {
      uid: item.uid,
      sku: item.sku,
      productName: item.productName,
      brand: item.brand,
      size: item.size,
      category: item.category,
      uom: item.uom,
      levelCode: levelCode as 'C' | 'B' | 'A',
      locationCode: item.location,
      lotNumber: item.lotNumber,
      entryDate: item.entryDate,
      ageDays: item.ageDays,
      status: item.status,
      qaStatus: item.qaStatus,
      physicalQuantity: item.physicalQuantity,
      reservedQuantity: item.reservedQuantity,
      qaBlockedQuantity: item.qaBlockedQuantity,
      availableQuantity: item.availableQuantity,
      relatedOp: item.relatedOp,
      classification: item.category,
      notes: `Material verificado en ${item.warehouseName}.`,
    };
  };

  return (
    <ModalPortal onClose={onClose}>
      <div className="w-full max-w-4xl bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-surface">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-theme-primary/10 text-theme-primary flex items-center justify-center font-mono font-bold text-sm border border-theme-primary/20 shrink-0">
              <Boxes className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-black text-theme-primary">{article.sku}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-theme-muted text-theme-main border border-theme-subtle">
                  {article.category}
                </span>
                <span className="text-[11px] font-semibold text-theme-muted">
                  {article.brand} &middot; {article.size}
                </span>
                {article.relatedOp && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-700 border border-amber-500/20">
                    Asignado a {article.relatedOp}
                  </span>
                )}
              </div>
              <h2 className="text-sm sm:text-base font-extrabold text-theme-main truncate mt-0.5">
                {article.productName}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-theme-muted hover:text-theme-main hover:bg-theme-muted transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          
          {/* Resumen Global de Existencias (KPIs Industriales) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-theme-muted/30 border border-theme-subtle text-center shadow-2xs">
              <span className="text-[9px] uppercase font-bold text-theme-muted block tracking-wider">Físico Total</span>
              <strong className="text-base sm:text-lg font-mono font-black text-theme-main block mt-0.5">
                {article.totalPhysical.toLocaleString()} <span className="text-xs font-sans font-semibold text-theme-muted">{article.uom}s</span>
              </strong>
              <span className="text-[10px] text-theme-muted mt-0.5 block">Existencia en almacén</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-center shadow-2xs">
              <span className="text-[9px] uppercase font-bold text-amber-700 block tracking-wider">Reservado OP</span>
              <strong className="text-base sm:text-lg font-mono font-black text-amber-700 block mt-0.5">
                {article.reservedQuantity.toLocaleString()} <span className="text-xs font-sans font-semibold text-amber-600/80">{article.uom}s</span>
              </strong>
              <span className="text-[10px] text-amber-600 font-semibold mt-0.5 block">
                {article.relatedOp ? `Comprometido (${article.relatedOp})` : 'Asignado a producción'}
              </span>
            </div>

            <div className={`p-3.5 rounded-2xl text-center shadow-2xs ${
              article.qaBlockedQuantity > 0 
                ? 'bg-rose-500/10 border border-rose-500/30' 
                : 'bg-theme-muted/20 border border-theme-subtle'
            }`}>
              <span className={`text-[9px] uppercase font-bold block tracking-wider ${
                article.qaBlockedQuantity > 0 ? 'text-rose-700' : 'text-theme-muted'
              }`}>
                Bloqueado QA
              </span>
              <strong className={`text-base sm:text-lg font-mono font-black block mt-0.5 ${
                article.qaBlockedQuantity > 0 ? 'text-rose-700' : 'text-theme-muted'
              }`}>
                {article.qaBlockedQuantity.toLocaleString()} <span className="text-xs font-sans font-semibold text-theme-muted">{article.uom}s</span>
              </strong>
              <span className={`text-[10px] mt-0.5 block font-semibold ${
                article.qaBlockedQuantity > 0 ? 'text-rose-600' : 'text-theme-muted'
              }`}>
                {article.qaBlockedQuantity > 0 ? 'En Cuarentena / Rechazado' : 'Sin retenciones QA'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center shadow-2xs">
              <span className="text-[9px] uppercase font-bold text-emerald-700 block tracking-wider">Disponible Real</span>
              <strong className="text-base sm:text-lg font-mono font-black text-emerald-700 block mt-0.5">
                {article.availableQuantity.toLocaleString()} <span className="text-xs font-sans font-semibold text-emerald-600/80">{article.uom}s</span>
              </strong>
              <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">Físico - Reservado - Bloqueado</span>
            </div>
          </div>

          {/* Subtabs del Drawer */}
          <div className="flex items-center gap-2 border-b border-theme-subtle pb-2">
            <button
              onClick={() => setActiveTab('lotes')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'lotes'
                  ? 'bg-theme-primary text-white shadow-xs'
                  : 'text-theme-muted hover:text-theme-main hover:bg-theme-muted'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Desglose por Lotes ({article.lots.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('unidades')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'unidades'
                  ? 'bg-theme-primary text-white shadow-xs'
                  : 'text-theme-muted hover:text-theme-main hover:bg-theme-muted'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Unidades Físicas & Tarimas ({article.allUnits.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('kardex')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'kardex'
                  ? 'bg-theme-primary text-white shadow-xs'
                  : 'text-theme-muted hover:text-theme-main hover:bg-theme-muted'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Kardex / Movimientos Recientes</span>
            </button>
          </div>

          {/* TAB 1: DESGLOSE POR LOTES */}
          {activeTab === 'lotes' && (
            <div className="space-y-3">
              <div className="overflow-x-auto rounded-2xl border border-theme-subtle">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-theme-muted/40 border-b border-theme-subtle text-[10px] uppercase font-bold text-theme-muted tracking-wider">
                      <th className="py-2.5 px-4">Lote</th>
                      <th className="py-2.5 px-3">Estado QA</th>
                      <th className="py-2.5 px-3">Ubicación</th>
                      <th className="py-2.5 px-3 text-right">Físico</th>
                      <th className="py-2.5 px-3 text-right">Reservado</th>
                      <th className="py-2.5 px-3 text-right">Bloqueado</th>
                      <th className="py-2.5 px-3 text-right font-bold text-theme-primary">Disponible</th>
                      <th className="py-2.5 px-3">Fecha Entrada</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-theme-subtle">
                    {article.lots.map((lot) => (
                      <tr key={lot.lotNumber} className="hover:bg-theme-muted/20 transition-colors">
                        <td className="py-2.5 px-4 font-mono font-bold text-theme-main">
                          {lot.lotNumber}
                        </td>
                        <td className="py-2.5 px-3">
                          <StatusBadge
                            variant={getQaVariant(lot.qaStatus)}
                            label={lot.qaStatus}
                            size="sm"
                          />
                        </td>
                        <td className="py-2.5 px-3 font-mono font-semibold text-theme-primary">
                          {lot.location}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-theme-main">
                          {lot.physicalQuantity.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-amber-600">
                          {lot.reservedQuantity > 0 ? lot.reservedQuantity.toLocaleString() : '—'}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-rose-600 font-bold">
                          {lot.qaBlockedQuantity > 0 ? lot.qaBlockedQuantity.toLocaleString() : '—'}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">
                          {lot.availableQuantity.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-theme-muted text-[11px]">
                          {lot.entryDate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {article.qaBlockedQuantity > 0 && (
                <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-800 text-[11px] flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">Regla Demo de Calidad QA:</strong> El material en estado <em>Cuarentena</em> o <em>Rechazado</em> está físicamente identificado en almacén pero su disponibilidad para producción o surtido es <strong>0</strong>.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: UNIDADES FÍSICAS ASOCIADAS */}
          {activeTab === 'unidades' && (
            <div className="space-y-3">
              <div className="overflow-x-auto rounded-2xl border border-theme-subtle">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-theme-muted/40 border-b border-theme-subtle text-[10px] uppercase font-bold text-theme-muted tracking-wider">
                      <th className="py-2.5 px-4">UID / Identificador</th>
                      <th className="py-2.5 px-3">Ubicación</th>
                      <th className="py-2.5 px-3">Lote</th>
                      <th className="py-2.5 px-3">Estado</th>
                      <th className="py-2.5 px-3 text-right">Cant. Física</th>
                      <th className="py-2.5 px-4 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-theme-subtle">
                    {article.allUnits.map((unit) => {
                      const serialized = toSerializedItem(unit);
                      return (
                        <tr key={unit.uid} className="hover:bg-theme-muted/20 transition-colors">
                          <td className="py-2.5 px-4 font-mono font-bold text-theme-main flex items-center gap-1.5">
                            <QrCode className="w-3.5 h-3.5 text-theme-primary shrink-0" />
                            <span>{unit.uid}</span>
                          </td>
                          <td className="py-2.5 px-3 font-mono font-semibold text-theme-primary">
                            {unit.location}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-theme-muted">
                            {unit.lotNumber}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                              unit.status === 'Disponible'
                                ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30'
                                : unit.status === 'Comprometido'
                                ? 'bg-amber-500/10 text-amber-700 border-amber-500/30'
                                : unit.status === 'Cuarentena'
                                ? 'bg-rose-500/10 text-rose-700 border-rose-500/30'
                                : 'bg-blue-500/10 text-blue-700 border-blue-500/30'
                            }`}>
                              {unit.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-semibold text-theme-main">
                            {unit.physicalQuantity.toLocaleString()} {article.uom}s
                          </td>
                          <td className="py-2.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => onOpenUnitDetail(serialized)}
                                className="p-1.5 rounded-lg bg-theme-muted hover:bg-theme-subtle text-theme-main transition-colors cursor-pointer border border-theme-subtle"
                                title="Ver detalle de trazabilidad"
                              >
                                <Eye className="w-3.5 h-3.5 text-theme-muted" />
                              </button>
                              <button
                                onClick={() => onOpenQr(serialized)}
                                className="p-1.5 rounded-lg bg-theme-muted hover:bg-theme-subtle text-purple-600 transition-colors cursor-pointer border border-purple-200/40"
                                title="Ver QR"
                              >
                                <QrCode className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onPrintQr(serialized)}
                                className="p-1.5 rounded-lg bg-theme-primary hover:bg-theme-primary-hover text-white transition-colors cursor-pointer shadow-xs"
                                title="Imprimir etiqueta"
                              >
                                <Printer className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: KARDEX / MOVIMIENTOS RECIENTES */}
          {activeTab === 'kardex' && (
            <div className="space-y-3">
              <div className="overflow-x-auto rounded-2xl border border-theme-subtle">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-theme-muted/40 border-b border-theme-subtle text-[10px] uppercase font-bold text-theme-muted tracking-wider">
                      <th className="py-2.5 px-4">Fecha / Hora</th>
                      <th className="py-2.5 px-3">Tipo Movimiento</th>
                      <th className="py-2.5 px-3">Lote</th>
                      <th className="py-2.5 px-3">Cantidad</th>
                      <th className="py-2.5 px-3">Origen</th>
                      <th className="py-2.5 px-3">Destino</th>
                      <th className="py-2.5 px-3">Referencia</th>
                      <th className="py-2.5 px-4">Observaciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-theme-subtle">
                    {article.recentMovements.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-6 text-center text-theme-muted">
                          Sin movimientos recientes registrados para este SKU.
                        </td>
                      </tr>
                    ) : (
                      article.recentMovements.map((mov) => (
                        <tr key={mov.id} className="hover:bg-theme-muted/20 transition-colors">
                          <td className="py-2.5 px-4 font-mono font-semibold text-theme-main whitespace-nowrap">
                            {mov.timestamp}
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-theme-muted text-theme-main border border-theme-subtle">
                              {mov.movementType}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-theme-muted whitespace-nowrap">
                            {mov.lotNumber || '—'}
                          </td>
                          <td className="py-2.5 px-3 font-mono font-bold text-theme-main whitespace-nowrap">
                            {mov.quantity ? `${mov.quantity.toLocaleString()} ${mov.uom || ''}` : '—'}
                          </td>
                          <td className="py-2.5 px-3 text-theme-muted">
                            {mov.origin}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-theme-primary">
                            {mov.destination}
                          </td>
                          <td className="py-2.5 px-3 font-mono font-bold text-amber-700 whitespace-nowrap">
                            {mov.reference || '—'}
                          </td>
                          <td className="py-2.5 px-4 text-theme-muted text-[11px]">
                            {mov.notes || '—'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-theme-subtle bg-theme-muted/40 flex items-center justify-between text-xs text-theme-muted">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-theme-primary" />
            <span>Almacén Principal RTM (ALM-RTM) &middot; Trazabilidad Gráfica</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-semibold transition-colors cursor-pointer border border-theme-subtle"
          >
            Cerrar
          </button>
        </div>
      </div>
    </ModalPortal>
  );
};
