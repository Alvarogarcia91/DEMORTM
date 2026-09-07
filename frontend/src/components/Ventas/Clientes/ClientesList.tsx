import React, { useState } from 'react';
import {
 Search,
 Eye,
 User,
 Building2,
 FileText,
 ShoppingBag
} from 'lucide-react';
import { SalesCustomer } from '../../../data/mockSalesData';
import { SemanticBadge } from '../../common/SemanticBadge';
import { formatCurrencyMXN } from '../../../utils/formatters';

interface ClientesListProps {
 customers: SalesCustomer[];
 onOpenDetail: (customer: SalesCustomer) => void;
 onOpenQuickForm: () => void;
 onStartQuoteForCustomer?: (customer: SalesCustomer) => void;
}

export const ClientesList: React.FC<ClientesListProps> = ({
 customers,
 onOpenDetail,
 onOpenQuickForm,
 onStartQuoteForCustomer,
}) => {
 const [searchTerm, setSearchTerm] = useState('');
 const [filterType, setFilterType] = useState('all');
 const [filterBranch, setFilterBranch] = useState('all');

 const filteredCustomers = customers.filter((c) => {
 const matchSearch =
 c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
 c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
 c.rfc.toLowerCase().includes(searchTerm.toLowerCase()) ||
 c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
 c.phone.includes(searchTerm);
 const matchType = filterType === 'all' || c.type === filterType;
 const matchBranch = filterBranch === 'all' || c.preferredBranch === filterBranch;
 return matchSearch && matchType && matchBranch;
 });

 return (
 <div className="space-y-4">
 {/* Top Filter Bar */}
 <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
 <div className="flex items-center gap-3 w-full md:w-auto flex-1">
 <div className="relative flex-1 max-w-md">
 <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
 <input
 type="text"
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 placeholder="Buscar por código, cliente, RFC, teléfono o correo..."
 className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-zinc-300 text-zinc-900 text-xs focus:outline-none focus:border-theme-primary shadow-2xs"
 />
 </div>

 <select
 value={filterType}
 onChange={(e) => setFilterType(e.target.value)}
 className="p-2 rounded-xl bg-white border border-zinc-300 text-zinc-900 text-xs font-semibold shadow-2xs focus:outline-none"
 >
 <option value="all">Todos los tipos</option>
 <option value="Persona">Persona</option>
 <option value="Empresa">Empresa</option>
 <option value="Convenio">Convenio</option>
 </select>

        <select
          value={filterBranch}
          onChange={(e) => setFilterBranch(e.target.value)}
          className="p-2 rounded-xl bg-white border border-zinc-300 text-zinc-900 text-xs font-semibold shadow-2xs focus:outline-none"
        >
          <option value="all">Todas las plantas / destinos</option>
          <option value="wh-alm-rtm">Planta Principal RTM</option>
          <option value="wh-alm-virtual">Almacén Virtual / Control</option>
        </select>
      </div>
    </div>

 {/* Customers Table */}
 <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-xs">
 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs border-collapse min-w-[950px]">
 <thead>
 <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-bold text-[10px] uppercase tracking-wider">
 <th className="py-3.5 px-4">Código</th>
 <th className="py-3.5 px-4">Cliente / Razón Social</th>
 <th className="py-3.5 px-3 text-center">Tipo</th>
 <th className="py-3.5 px-3">Contacto</th>
 <th className="py-3.5 px-3">Planta / Destino Habitual</th>
 <th className="py-3.5 px-3">Lista Precios</th>
 <th className="py-3.5 px-2 text-center">Cotizaciones</th>
 <th className="py-3.5 px-2 text-center">Pedidos</th>
 <th className="py-3.5 px-3 text-right">Venta Total</th>
 <th className="py-3.5 px-4 text-center">Acción</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-zinc-200">
 {filteredCustomers.map((cust) => (
 <tr key={cust.id} className="hover:bg-zinc-50/60 transition-colors">
 <td className="py-3 px-4 font-mono font-bold text-theme-primary whitespace-nowrap">
 {cust.code}
 </td>
 <td className="py-3 px-4">
 <strong className="text-zinc-900 block">{cust.name}</strong>
 <span className="text-[10px] text-zinc-500 font-mono">RFC: {cust.rfc}</span>
 </td>
 <td className="py-3 px-3 text-center whitespace-nowrap">
 <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-zinc-300 shadow-2xs bg-white text-zinc-900">
 {cust.type}
 </span>
 </td>
 <td className="py-3 px-3 text-zinc-600 whitespace-nowrap">
 <span className="text-zinc-900 font-semibold block">{cust.phone}</span>
 <span className="text-[10px] text-zinc-500">{cust.email}</span>
 </td>
 <td className="py-3 px-3 text-zinc-600 whitespace-nowrap">
 {cust.preferredBranchName || 'Planta Principal RTM'}
 </td>
 <td className="py-3 px-3 text-zinc-600 whitespace-nowrap truncate max-w-[150px]">
 {cust.preferredPriceListName}
 </td>
 <td className="py-3 px-2 text-center font-bold text-zinc-900 font-mono">
 {cust.totalQuotesCount}
 </td>
 <td className="py-3 px-2 text-center font-bold text-zinc-900 font-mono">
 {cust.totalOrdersCount}
 </td>
 <td className="py-3 px-3 text-right font-mono font-black text-zinc-900 whitespace-nowrap">
 {formatCurrencyMXN(cust.totalSpent, false)}
 </td>
 <td className="py-3 px-4 text-center whitespace-nowrap">
 <div className="flex items-center justify-center gap-1.5">
 <button
 type="button"
 onClick={() => onOpenDetail(cust)}
 className="px-2.5 py-1 rounded-lg bg-white border border-zinc-300 hover:bg-zinc-50 text-zinc-900 font-semibold text-[11px] shadow-2xs transition-colors cursor-pointer inline-flex items-center gap-1"
 >
 <Eye className="w-3.5 h-3.5 text-zinc-600" />
 <span>Expediente</span>
 </button>

 {onStartQuoteForCustomer && (
 <button
 type="button"
 onClick={() => onStartQuoteForCustomer(cust)}
 className="px-2.5 py-1 rounded-lg bg-theme-primary hover:bg-theme-primary-hover text-white font-bold text-[11px] shadow-xs cursor-pointer inline-flex items-center gap-1"
 title="Cotizar a este cliente"
 >
 <FileText className="w-3.5 h-3.5" />
 <span>Cotizar</span>
 </button>
 )}
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 );
};
