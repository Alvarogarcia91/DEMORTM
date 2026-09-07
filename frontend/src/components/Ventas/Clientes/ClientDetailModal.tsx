import React, { useState } from 'react';
import {
 X,
 User,
 Building2,
 Phone,
 Mail,
 MapPin,
 FileText,
 ShoppingBag,
 DollarSign,
 Calendar,
 History,
 ShieldCheck,
 Plus,
 ArrowRight
} from 'lucide-react';
import { SalesCustomer, SalesQuote, SalesOrder } from '../../../data/mockSalesData';
import {
  formatCurrencyMXN,
  formatPercentage,
  formatDateMX,
} from '../../../utils/formatters';

interface ClientDetailModalProps {
 customer: SalesCustomer | null;
 isOpen: boolean;
 onClose: () => void;
 quotes: SalesQuote[];
 orders: SalesOrder[];
 onStartQuoteForCustomer?: (customer: SalesCustomer) => void;
}

export const ClientDetailModal: React.FC<ClientDetailModalProps> = ({
 customer,
 isOpen,
 onClose,
 quotes,
 orders,
 onStartQuoteForCustomer,
}) => {
 const [activeTab, setActiveTab] = useState<
 'resumen' | 'contactos' | 'direcciones' | 'cotizaciones' | 'pedidos' | 'condiciones' | 'historial'
 >('resumen');

 if (!isOpen || !customer) return null;

 const customerQuotes = quotes.filter((q) => q.customerId === customer.id);
 const customerOrders = orders.filter((o) => o.customerId === customer.id);

 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-150">
 <div className="w-full max-w-4xl max-h-[90vh] bg-white border border-zinc-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
 {/* Header */}
 <div className="p-6 border-b border-zinc-200 flex items-center justify-between bg-white">
 <div className="flex items-center gap-3">
 <div className="w-12 h-12 rounded-2xl bg-white border border-zinc-200 shadow-2xs text-rose-600 flex items-center justify-center">
 <User className="w-6 h-6" />
 </div>
 <div>
 <div className="flex items-center gap-2.5 flex-wrap">
 <span className="font-mono text-base font-black text-rose-600">{customer.code}</span>
 <h3 className="text-base font-bold text-zinc-900">{customer.name}</h3>
 <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-zinc-300 shadow-2xs bg-white text-zinc-900">
 {customer.type}
 </span>
 </div>
 <p className="text-xs text-zinc-500 mt-0.5">
 RFC: {customer.rfc} &bull; {customer.preferredBranchName} &bull; Lista: {customer.preferredPriceListName}
 </p>
 </div>
 </div>

 <button
 onClick={onClose}
 className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 {/* Subtabs Bar */}
 <div className="px-6 py-2.5 bg-zinc-50 border-b border-zinc-200 flex items-center gap-2 overflow-x-auto text-xs">
 {[
 { id: 'resumen', label: 'Resumen' },
 { id: 'contactos', label: `Contactos (${customer.contacts.length})` },
 { id: 'direcciones', label: `Direcciones (${customer.addresses.length})` },
 { id: 'cotizaciones', label: `Cotizaciones (${customerQuotes.length})` },
 { id: 'pedidos', label: `Pedidos (${customerOrders.length})` },
 { id: 'condiciones', label: 'Condiciones Comerciales' },
 { id: 'historial', label: 'Historial' },
 ].map((tab) => (
 <button
 key={tab.id}
 type="button"
 onClick={() => setActiveTab(tab.id as any)}
 className={`px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer ${
 activeTab === tab.id
 ? 'bg-rose-600 text-white shadow-xs'
 : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100 shadow-2xs'
 }`}
 >
 {tab.label}
 </button>
 ))}
 </div>

 {/* Tab Body */}
 <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
 
 {/* TAB: RESUMEN */}
 {activeTab === 'resumen' && (
 <div className="space-y-6">
 {/* KPIs 4 Cards */}
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-zinc-500 block">Ventas Acumuladas</span>
              <span className="text-xl font-black font-mono text-zinc-900 block">
                {formatCurrencyMXN(customer.totalSpent, false)}
              </span>
              <span className="text-[10px] text-emerald-600 font-bold">Cliente recurrente</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-zinc-500 block">Pedidos Totales</span>
              <span className="text-xl font-black font-mono text-zinc-900 block">
                {customer.totalOrdersCount}
              </span>
              <span className="text-[10px] text-zinc-500">Órdenes cerradas</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-zinc-500 block">Cotizaciones</span>
              <span className="text-xl font-black font-mono text-zinc-900 block">
                {customer.totalQuotesCount}
              </span>
              <span className="text-[10px] text-zinc-500">Propuestas activas</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-zinc-500 block">Última Compra</span>
              <span className="text-sm font-black font-mono text-zinc-900 block mt-1">
                {formatDateMX(customer.lastPurchaseDate) || 'Sin compras'}
              </span>
              <span className="text-[10px] text-zinc-500">Alta: {formatDateMX(customer.createdAt)}</span>
            </div>
          </div>

          {/* Info General Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-2">
              <span className="text-[10px] uppercase font-bold text-zinc-500 block">Datos Fiscales y Generales</span>
              <div className="space-y-1">
                <p className="font-bold text-zinc-900 text-sm">{customer.legalName}</p>
                <p className="font-mono text-zinc-600">RFC: {customer.rfc}</p>
                <p className="text-zinc-600">Tipo de Cliente: <strong className="text-zinc-900">{customer.type}</strong></p>
                <p className="text-zinc-600">Sucursal Preferida: <strong className="text-zinc-900">{customer.preferredBranchName}</strong></p>
                <p className="text-zinc-600">Lista Asignada: <strong className="text-zinc-900">{customer.preferredPriceListName}</strong></p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-2">
              <span className="text-[10px] uppercase font-bold text-zinc-500 block">Condiciones y Notas</span>
              <div className="space-y-1">
                <p className="text-zinc-600">Descuento Base: <strong className="text-emerald-700 font-mono">{formatPercentage(customer.baseDiscountPct, 0)}</strong></p>
                <p className="text-zinc-600">Días de Crédito: <strong className="text-zinc-900 font-mono">{customer.creditDays} días naturales</strong></p>
                <p className="text-zinc-600">Estado de Cuenta: <strong className="text-emerald-700">{customer.status}</strong></p>
                {customer.notes && (
                  <p className="text-zinc-500 text-[11px] italic pt-1 border-t border-zinc-100">
                    "{customer.notes}"
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        )}

        {/* TAB: CONTACTOS */}
        {activeTab === 'contactos' && (
          <div className="space-y-3">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
              Contactos Registrados ({customer.contacts.length})
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {customer.contacts.map((con) => (
                <div key={con.id} className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <strong className="text-zinc-900 text-sm block">{con.name}</strong>
                    {con.isMain && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white text-zinc-900 border border-emerald-600 shadow-2xs">
                        Principal
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-600">{con.role}</p>
                  <div className="pt-2 border-t border-zinc-100 space-y-1 text-[11px] text-zinc-600">
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{con.phone}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{con.email}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: DIRECCIONES */}
        {activeTab === 'direcciones' && (
          <div className="space-y-3">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
              Direcciones de Entrega y Fiscales ({customer.addresses.length})
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {customer.addresses.map((addr) => (
                <div key={addr.id} className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-900 text-xs uppercase flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-600" />
                      {addr.type}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-800">
                    {addr.street} #{addr.extNumber} {addr.intNumber ? `Int. ${addr.intNumber}` : ''}
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    Col. {addr.neighborhood}, {addr.city}, {addr.state}, C.P. {addr.postalCode}
                  </p>
                  {addr.reference && (
                    <p className="text-[10px] text-zinc-400 italic bg-zinc-50 p-2 rounded-xl border border-zinc-200">
                      Ref: {addr.reference}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: COTIZACIONES */}
        {activeTab === 'cotizaciones' && (
          <div className="space-y-3">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
              Historial de Cotizaciones
            </span>
            {customerQuotes.length === 0 ? (
              <p className="text-zinc-500 italic">No hay cotizaciones registradas para este cliente.</p>
            ) : (
              <div className="border border-zinc-200 rounded-2xl overflow-hidden shadow-xs bg-white">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-bold text-[10px] uppercase">
                      <th className="py-2.5 px-3">Folio</th>
                      <th className="py-2.5 px-3">Fecha</th>
                      <th className="py-2.5 px-3">Sucursal</th>
                      <th className="py-2.5 px-3 text-right">Total</th>
                      <th className="py-2.5 px-3 text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {customerQuotes.map((q) => (
                      <tr key={q.id}>
                        <td className="py-2.5 px-3 font-mono font-bold text-rose-600">{q.folio}</td>
                        <td className="py-2.5 px-3 text-zinc-500">{formatDateMX(q.createdAt)}</td>
                        <td className="py-2.5 px-3 text-zinc-600">{q.branchName}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-zinc-900">
                          {formatCurrencyMXN(q.financials.total)}
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold">{q.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB: PEDIDOS */}
        {activeTab === 'pedidos' && (
          <div className="space-y-3">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
              Historial de Pedidos
            </span>
            {customerOrders.length === 0 ? (
              <p className="text-zinc-500 italic">No hay pedidos registrados para este cliente.</p>
            ) : (
              <div className="border border-zinc-200 rounded-2xl overflow-hidden shadow-xs bg-white">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-bold text-[10px] uppercase">
                      <th className="py-2.5 px-3">Pedido</th>
                      <th className="py-2.5 px-3">Cotización</th>
                      <th className="py-2.5 px-3">Fecha</th>
                      <th className="py-2.5 px-3 text-right">Total</th>
                      <th className="py-2.5 px-3 text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {customerOrders.map((o) => (
                      <tr key={o.id}>
                        <td className="py-2.5 px-3 font-mono font-bold text-rose-600">{o.folio}</td>
                        <td className="py-2.5 px-3 font-mono text-zinc-500">{o.originQuoteFolio || '-'}</td>
                        <td className="py-2.5 px-3 text-zinc-500">{formatDateMX(o.createdAt)}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-zinc-900">
                          {formatCurrencyMXN(o.financials.total)}
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold">{o.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB: CONDICIONES */}
        {activeTab === 'condiciones' && (
          <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-3">
            <span className="font-bold text-zinc-900 text-xs block">Configuración Comercial y Crédito</span>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-zinc-500 block">Lista de Precios Base:</span>
                <span className="font-semibold text-zinc-900">{customer.preferredPriceListName}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Descuento Base Autorizado:</span>
                <span className="font-mono font-bold text-emerald-600">{formatPercentage(customer.baseDiscountPct, 0)}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Días de Crédito:</span>
                <span className="font-mono font-bold text-zinc-900">{customer.creditDays} días naturales</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB: HISTORIAL */}
        {activeTab === 'historial' && (
          <div className="space-y-3">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
              Historial y Notas Comerciales
            </span>
            <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-2">
              <span className="text-zinc-900 font-bold block">Notas del Expediente:</span>
              <p className="text-zinc-700">{customer.notes || 'Sin notas especiales registradas.'}</p>
              <div className="text-[10px] text-zinc-500 pt-2 border-t border-zinc-200">
                Fecha de registro en sistema: <strong>{formatDateMX(customer.createdAt)}</strong>
              </div>
            </div>
          </div>
        )}
 </div>

 {/* Modal Footer */}
 <div className="p-4 bg-white border-t border-zinc-200 flex items-center justify-between gap-3">
 {onStartQuoteForCustomer && (
 <button
 type="button"
 onClick={() => onStartQuoteForCustomer(customer)}
 className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
 >
 <FileText className="w-4 h-4" />
 <span>Cotizar a este cliente</span>
 </button>
 )}

 <button
 type="button"
 onClick={onClose}
 className="px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-900 font-semibold text-xs transition-colors cursor-pointer"
 >
 Cerrar
 </button>
 </div>
 </div>
 </div>
 );
};
