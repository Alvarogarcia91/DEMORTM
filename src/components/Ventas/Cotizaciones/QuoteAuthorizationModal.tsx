import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { SalesQuote } from '../../../data/mockSalesData';
import { formatCurrencyMXN, formatPercentage } from '../../../utils/formatters';

interface QuoteAuthorizationModalProps {
 quote: SalesQuote | null;
 isOpen: boolean;
 onClose: () => void;
 onAuthorize: (quoteId: string, notes: string) => void;
 onRequestAdjustment: (quoteId: string, notes: string) => void;
 onReject: (quoteId: string, notes: string) => void;
}

export const QuoteAuthorizationModal: React.FC<QuoteAuthorizationModalProps> = ({
 quote,
 isOpen,
 onClose,
 onAuthorize,
 onRequestAdjustment,
 onReject,
}) => {
 const [notes, setNotes] = useState('');

 if (!isOpen || !quote) return null;

 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-150">
 <div className="w-full max-w-lg bg-white border border-zinc-200 rounded-3xl shadow-2xl overflow-hidden">
 {/* Header */}
 <div className="p-5 border-b border-zinc-200 flex items-center justify-between bg-white">
 <div className="flex items-center gap-2.5">
 <div className="w-10 h-10 rounded-xl bg-white border border-amber-500 shadow-2xs text-amber-600 flex items-center justify-center">
 <ShieldAlert className="w-5 h-5" />
 </div>
 <div>
 <h3 className="text-sm font-black text-zinc-900">
 Autorización Comercial
 </h3>
 <p className="text-xs text-zinc-500 font-mono">
 {quote.folio} &bull; {quote.customerName}
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
 <div className="p-4 rounded-2xl bg-white border border-amber-500 shadow-2xs space-y-2">
 <span className="font-bold text-zinc-900 block flex items-center gap-1.5">
 <AlertTriangle className="w-4 h-4 text-amber-600" />
 Motivos de Autorización Requerida
 </span>
 <ul className="list-disc list-inside text-zinc-700 space-y-1">
 {quote.policyReasons.map((r, i) => (
 <li key={i}>{r}</li>
 ))}
 </ul>
 </div>

 <div className="grid grid-cols-3 gap-2 text-center">
 <div className="p-2.5 rounded-xl bg-white border border-zinc-200 shadow-2xs">
 <span className="text-[10px] text-zinc-500 block">Total Cotizado</span>
 <span className="font-bold font-mono text-zinc-900">
 {formatCurrencyMXN(quote.financials.total)}
 </span>
 </div>
 <div className="p-2.5 rounded-xl bg-white border border-zinc-200 shadow-2xs">
 <span className="text-[10px] text-zinc-500 block">Descuento Total</span>
 <span className="font-bold font-mono text-theme-primary">
 {formatCurrencyMXN(quote.financials.totalDiscountAmount)}
 </span>
 </div>
 <div className="p-2.5 rounded-xl bg-white border border-zinc-200 shadow-2xs">
 <span className="text-[10px] text-zinc-500 block">Margen Est. %</span>
 <span className="font-black font-mono text-emerald-700">
 {formatPercentage(quote.financials.estimatedMarginPct, 1)}
 </span>
 </div>
 </div>

 <div className="space-y-1.5">
 <label className="text-[11px] font-bold text-zinc-900 block">
 Comentarios del Autorizador / Dictamen:
 </label>
 <textarea
 rows={3}
 value={notes}
 onChange={(e) => setNotes(e.target.value)}
 placeholder="Escribe observaciones o condiciones de autorización..."
 className="w-full p-2.5 rounded-xl bg-white border border-zinc-300 text-zinc-900 focus:outline-none focus:border-theme-primary text-xs resize-none shadow-2xs"
 />
 </div>
 </div>

 {/* Footer Actions */}
 <div className="p-4 bg-white border-t border-zinc-200 flex items-center justify-between gap-2">
 <button
 type="button"
 onClick={() => {
 onReject(quote.id, notes);
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
 onRequestAdjustment(quote.id, notes);
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
 onAuthorize(quote.id, notes);
 onClose();
 }}
 className="px-4 py-2 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-bold text-xs shadow-sm cursor-pointer flex items-center gap-1.5"
 >
 <CheckCircle2 className="w-4 h-4" />
 <span>Autorizar</span>
 </button>
 </div>
 </div>
 </div>
 </div>
 );
};
