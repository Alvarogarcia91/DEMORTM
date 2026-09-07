import React, { useState } from 'react';
import {
  Search,
  Eye,
  UserCheck,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { SalesQuote } from '../../../data/mockSalesData';
import { SemanticBadge } from '../../common/SemanticBadge';
import { formatCurrencyMXN, formatDateMX } from '../../../utils/formatters';

interface CotizacionesListProps {
  quotes: SalesQuote[];
  onOpenDetail: (quote: SalesQuote) => void;
  onOpenCreateWizard?: () => void;
  onOpenAuthorizationModal?: (quote: SalesQuote) => void;
  onGenerateOrder?: (quote: SalesQuote) => void;
  onNavigateToOrder?: (orderFolio: string) => void;
}

export const CotizacionesList: React.FC<CotizacionesListProps> = ({
  quotes,
  onOpenDetail,
  onOpenAuthorizationModal,
  onGenerateOrder,
  onNavigateToOrder,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBranch, setFilterBranch] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredQuotes = quotes.filter((q) => {
    const matchSearch =
      q.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.customerRfc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.sellerName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchBranch = filterBranch === 'all' || q.branchId === filterBranch;
    const matchStatus = filterStatus === 'all' || q.status === filterStatus;

    return matchSearch && matchBranch && matchStatus;
  });

  const getSemanticTone = (status: SalesQuote['status']) => {
    switch (status) {
      case 'Borrador':
        return 'neutral';
      case 'Pendiente de autorización':
        return 'warning';
      case 'Autorizada':
        return 'success';
      case 'Enviada al cliente':
        return 'info';
      case 'Aceptada':
        return 'success';
      case 'Rechazada':
        return 'danger';
      case 'Vencida':
        return 'neutral';
      case 'Convertida en pedido':
        return 'smart';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Filter Bar (Cleaned, no duplicate create button) */}
      <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 w-full flex-1">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por folio, cliente, RFC o vendedor..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-zinc-300 text-zinc-900 text-xs focus:outline-none focus:border-rose-500 shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider hidden sm:inline">Sucursal:</span>
            <select
              value={filterBranch}
              onChange={(e) => setFilterBranch(e.target.value)}
              className="p-2 rounded-xl bg-white border border-zinc-300 text-zinc-900 text-xs font-semibold shadow-2xs focus:outline-none"
            >
              <option value="all">Todas las sucursales</option>
              <option value="wh-suc-valle-oriente">Sucursal Valle Oriente</option>
              <option value="wh-suc-cumbres">Sucursal Cumbres</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider hidden sm:inline">Estado:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-2 rounded-xl bg-white border border-zinc-300 text-zinc-900 text-xs font-semibold shadow-2xs focus:outline-none"
            >
              <option value="all">Todos los estados</option>
              <option value="Pendiente de autorización">Pendientes de autorización</option>
              <option value="Autorizada">Autorizadas</option>
              <option value="Enviada al cliente">Enviadas al cliente</option>
              <option value="Aceptada">Aceptadas</option>
              <option value="Convertida en pedido">Convertidas en pedido</option>
              <option value="Vencida">Vencidas</option>
              <option value="Rechazada">Rechazadas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quotes Table */}
      <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[980px]">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-bold text-[10px] uppercase tracking-wider">
                <th className="py-3.5 px-4">Folio</th>
                <th className="py-3.5 px-3">Fecha</th>
                <th className="py-3.5 px-4">Cliente</th>
                <th className="py-3.5 px-3">Sucursal</th>
                <th className="py-3.5 px-2 text-center">Partidas</th>
                <th className="py-3.5 px-2 text-center">Unidades</th>
                <th className="py-3.5 px-4 text-right">Total Cotizado</th>
                <th className="py-3.5 px-3">Vigencia</th>
                <th className="py-3.5 px-3">Vendedor</th>
                <th className="py-3.5 px-3 text-center">Estado</th>
                <th className="py-3.5 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {filteredQuotes.map((quote) => {
                const totalUnits = quote.items.reduce((acc, i) => acc + i.quantity, 0);
                const isPendingAuth = quote.status === 'Pendiente de autorización';
                const isAccepted = quote.status === 'Aceptada';
                const isConverted = quote.status === 'Convertida en pedido' || Boolean(quote.generatedOrderFolio);

                return (
                  <tr key={quote.id} className="hover:bg-zinc-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-rose-600 whitespace-nowrap">
                      {quote.folio}
                    </td>
                    <td className="py-3 px-3 text-zinc-500 whitespace-nowrap">
                      {formatDateMX(quote.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      <strong className="text-zinc-900 block">{quote.customerName}</strong>
                      <span className="text-[10px] text-zinc-500 font-mono">RFC: {quote.customerRfc}</span>
                    </td>
                    <td className="py-3 px-3 text-zinc-600 whitespace-nowrap">
                      {quote.branchName}
                    </td>
                    <td className="py-3 px-2 text-center font-bold text-zinc-900">
                      {quote.items.length}
                    </td>
                    <td className="py-3 px-2 text-center font-bold text-zinc-900 font-mono">
                      {totalUnits}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-black text-zinc-900 whitespace-nowrap">
                      {formatCurrencyMXN(quote.financials.total)}
                    </td>
                    <td className="py-3 px-3 text-zinc-500 text-[11px] whitespace-nowrap">
                      {formatDateMX(quote.validUntil)}
                    </td>
                    <td className="py-3 px-3 text-zinc-700 text-xs whitespace-nowrap" title={quote.sellerName}>
                      <span className="truncate block max-w-[160px] font-medium">
                        {quote.sellerName}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <SemanticBadge
                        tone={getSemanticTone(quote.status) as any}
                        label={quote.status}
                        size="sm"
                      />
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onOpenDetail(quote)}
                          className="px-2.5 py-1.5 rounded-lg bg-white border border-zinc-300 hover:bg-zinc-50 text-zinc-900 font-semibold text-[11px] shadow-2xs transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5 text-zinc-600" />
                          <span>Detalle</span>
                        </button>

                        {isPendingAuth && onOpenAuthorizationModal && (
                          <button
                            type="button"
                            onClick={() => onOpenAuthorizationModal(quote)}
                            className="px-2.5 py-1.5 rounded-lg bg-white border border-amber-500 text-zinc-900 font-bold text-[11px] shadow-2xs hover:bg-zinc-50 cursor-pointer inline-flex items-center gap-1"
                            title="Dictaminar o autorizar cotización"
                          >
                            <UserCheck className="w-3.5 h-3.5 text-amber-600" />
                            <span>Autorizar</span>
                          </button>
                        )}

                        {isAccepted && !isConverted && onGenerateOrder && (
                          <button
                            type="button"
                            onClick={() => onGenerateOrder(quote)}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] shadow-xs cursor-pointer inline-flex items-center gap-1.5 transition-all"
                            title="Generar pedido comercial"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Generar pedido</span>
                          </button>
                        )}

                        {isConverted && (
                          <button
                            type="button"
                            onClick={() => onNavigateToOrder && onNavigateToOrder(quote.generatedOrderFolio || '')}
                            className="px-2.5 py-1.5 rounded-lg bg-white border border-purple-500 hover:bg-purple-50 text-zinc-900 font-bold text-[11px] shadow-2xs cursor-pointer inline-flex items-center gap-1.5 transition-all"
                            title={`Ver pedido ${quote.generatedOrderFolio || ''}`}
                          >
                            <ShoppingBag className="w-3.5 h-3.5 text-purple-600" />
                            <span>Ver pedido</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
