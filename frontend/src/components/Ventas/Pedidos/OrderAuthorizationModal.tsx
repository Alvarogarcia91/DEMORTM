import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { SalesOrder } from '../../../data/mockSalesData';
import { formatCurrencyMXN, formatPercentage } from '../../../utils/formatters';

interface OrderAuthorizationModalProps {
 order: SalesOrder | null;
 isOpen: boolean;
 onClose: () => void;
 onAuthorize: (orderId: string, notes: string) => void;
 onRequestAdjustment: (orderId: string, notes: string) => void;
 onReject: (orderId: string, notes: string) => void;
}

export const OrderAuthorizationModal: React.FC<OrderAuthorizationModalProps> = ({
 order,
 isOpen,
 onClose,
 onAuthorize,
 onRequestAdjustment,
 onReject,
}) => {
 const [notes, setNotes] = useState('');

 if (!isOpen || !order) return null;

 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-150">
 <div className="w-full max-w-lg bg-white border border-zinc-200 rounded-3xl shadow-2xl overflow-hidden">
 {/* Header */}
 <div className="p-5 border-b border-zinc-200 flex items-center justify-between bg-white">
 <div className="flex items-center gap-2.5">
 <div className="w-10 h-10 rounded-xl bg-white border border-amber-500 shadow-2xs text-amber-600 flex items-center justify-center">
 <ShieldCheck className="w-5 h-5" />
 </div>
 <div>
 <h3 className="text-sm font-black text-zinc-900">
 Autorizar Pedido Comercial
 </h3>
 <p className="text-xs text-zinc-500 font-mono">
 {order.folio} &bull; {order.customerName}
 </p>
 </div>
 </div>
 <button
 onClick={onClose}
 className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
 >
 <X className="w-4 h-4" />
 </button>
 </div>

 {/* Content */}
 <div className="p-6 space-y-4 text-xs">
 <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-2">
 <span className="font-bold text-zinc-900 block">
 Resumen para Liberación Operativa
 </span>
 <div className="grid grid-cols-2 gap-2 text-[11px]">
 <div>
 <span className="text-zinc-500 block">Cliente:</span>
 <span className="font-semibold text-zinc-900">{order.customerName}</span>
 </div>
 <div>
 <span className="text-zinc-500 block">Sucursal:</span>
 <span className="font-semibold text-zinc-900">{order.branchName}</span>
 </div>
 <div>
 <span className="text-zinc-500 block">Total Venta:</span>
 <span className="font-mono font-bold text-theme-primary">{formatCurrencyMXN(order.financials.total)}</span>
 </div>
 <div>
 <span className="text-zinc-500 block">Margen Estimado:</span>
 <span className="font-mono font-bold text-emerald-700">{formatPercentage(order.financials.estimatedMarginPct, 1)}</span>
 </div>
 </div>
 </div>

 <div className="space-y-1.5">
 <label className="text-[11px] font-bold text-zinc-900 block">
 Comentarios de Autorización:
 </label>
 <textarea
 rows={3}
 value={notes}
 onChange={(e) => setNotes(e.target.value)}
 placeholder="Instrucciones para surtido, confirmación de stock, etc..."
 className="w-full p-2.5 rounded-xl bg-white border border-zinc-300 text-zinc-900 focus:outline-none focus:border-theme-primary text-xs resize-none shadow-2xs"
 />
 </div>
 </div>

 {/* Footer */}
 <div className="p-4 bg-white border-t border-zinc-200 flex items-center justify-between gap-2">
 <button
 type="button"
 onClick={() => {
 onReject(order.id, notes);
 onClose();
 }}
 className="px-3 py-2 rounded-xl bg-white border border-rose-500 text-zinc-900 font-bold text-xs shadow-2xs hover:bg-zinc-50 cursor-pointer flex items-center gap-1.5"
 >
 <XCircle className="w-4 h-4 text-rose-600" />
 <span>Rechazar</span>
 </button>

 <div className="flex items-center gap-2">
 <button
 type="button"
 onClick={() => {
 onRequestAdjustment(order.id, notes);
 onClose();
 }}
 className="px-3 py-2 rounded-xl bg-white border border-amber-500 text-zinc-900 font-bold text-xs shadow-2xs hover:bg-zinc-50 cursor-pointer flex items-center gap-1.5"
 >
 <AlertTriangle className="w-4 h-4 text-amber-600" />
 <span>Solicitar Ajuste</span>
 </button>

 <button
 type="button"
 onClick={() => {
 onAuthorize(order.id, notes);
 onClose();
 }}
 className="px-4 py-2 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-bold text-xs shadow-sm cursor-pointer flex items-center gap-1.5"
 >
 <CheckCircle2 className="w-4 h-4" />
 <span>Autorizar Pedido</span>
 </button>
 </div>
 </div>
 </div>
 </div>
 );
};
