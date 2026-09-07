import React, { useState } from 'react';
import { 
 History, 
 Search, 
 Filter, 
 QrCode, 
 ArrowRight, 
 User, 
 RotateCcw,
 CheckCircle2
} from 'lucide-react';
import { MOCK_INVENTORY_MOVEMENTS, InventoryMovement } from '../../data/mockInventoryData';

export const MovementsTab: React.FC = () => {
 const [movements, setMovements] = useState<InventoryMovement[]>(MOCK_INVENTORY_MOVEMENTS);
 const [searchTerm, setSearchTerm] = useState('');
 const [filterType, setFilterType] = useState('all');

 const filteredMovements = movements.filter((m) => {
 const matchesSearch = 
 m.uid.toLowerCase().includes(searchTerm.toLowerCase()) ||
 m.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
 m.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
 m.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
 m.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
 m.user.toLowerCase().includes(searchTerm.toLowerCase());

 const matchesType = filterType === 'all' || m.movementType === filterType;

 return matchesSearch && matchesType;
 });

 const getMovementBadge = (type: string) => {
 switch (type) {
 case 'ENTRADA':
 return 'bg-white text-zinc-900 border border-emerald-600 shadow-2xs';
 case 'ACOMODO':
 return 'bg-white text-zinc-900 border border-blue-500 shadow-2xs';
 case 'SURTIDO':
 case 'PICKING':
 return 'bg-white text-zinc-900 border border-purple-500 shadow-2xs';
 case 'RETRABAJO':
 return 'bg-white text-zinc-900 border border-amber-500 shadow-2xs';
 case 'TRASPASO':
 return 'bg-white text-zinc-900 border border-purple-500 shadow-2xs';
 default:
 return 'bg-white text-zinc-900 border border-zinc-400 shadow-2xs';
 }
 };

 return (
 <div className="space-y-4 animate-in fade-in duration-200">
 
 {/* Header Info */}
 <div className="bg-theme-surface p-4 border border-theme-subtle rounded-2xl shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
 <div>
 <div className="flex items-center gap-2">
 <History className="w-5 h-5 text-blue-600" />
 <h2 className="text-sm font-bold text-theme-main">Kardex & Movimientos de Inventario</h2>
 </div>
 <p className="text-xs text-theme-muted mt-0.5">
 Registro cronológico inmutable (append-only) de entradas, reacomodos, surtido y traspasos.
 </p>
 </div>

 {/* Search & Filter */}
 <div className="flex items-center gap-2 w-full md:w-auto">
 <div className="relative flex-1 md:w-64">
 <Search className="w-4 h-4 absolute left-3 top-2.5 text-theme-muted" />
 <input
 type="text"
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 placeholder="Buscar por UID, artículo, usuario..."
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl pl-9 pr-3 py-2 text-xs text-theme-main placeholder-theme-muted focus:bg-theme-surface focus:outline-none focus:border-theme-primary"
 />
 </div>

 <select
 value={filterType}
 onChange={(e) => setFilterType(e.target.value)}
 className="bg-theme-muted border border-theme-subtle text-xs font-semibold text-theme-main py-2 px-3 rounded-xl focus:outline-none focus:border-theme-primary"
 >
 <option value="all">Todos los movimientos</option>
 <option value="ENTRADA">ENTRADA</option>
 <option value="ACOMODO">ACOMODO</option>
 <option value="SURTIDO">SURTIDO</option>
 <option value="RETRABAJO">RETRABAJO</option>
 <option value="TRASPASO">TRASPASO</option>
 </select>
 </div>
 </div>

 {/* Movements Table */}
 <div className="bg-theme-surface border border-theme-subtle rounded-2xl overflow-hidden shadow-xs">
 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs border-collapse">
 <thead>
 <tr className="bg-theme-muted/60 border-b border-theme-subtle text-theme-muted font-bold uppercase tracking-wider text-[10px]">
 <th className="py-3 px-4">Fecha / Hora</th>
 <th className="py-3 px-4">UID / Serie</th>
 <th className="py-3 px-4">Artículo</th>
 <th className="py-3 px-4">Tipo Movimiento</th>
 <th className="py-3 px-4">Origen</th>
 <th className="py-3 px-4">Destino</th>
 <th className="py-3 px-4">Usuario</th>
 <th className="py-3 px-4">Notas / Auditoría</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle">
 {filteredMovements.length === 0 ? (
 <tr>
 <td colSpan={8} className="py-12 text-center text-theme-muted text-xs">
 No se encontraron movimientos registrados con los filtros aplicados.
 </td>
 </tr>
 ) : (
 filteredMovements.map((mov) => (
 <tr key={mov.id} className="hover:bg-theme-muted/40 transition-colors">
 <td className="py-3 px-4 font-mono font-semibold text-theme-main whitespace-nowrap">
 {mov.timestamp}
 </td>

 <td className="py-3 px-4 font-mono font-bold text-theme-main flex items-center gap-1.5 whitespace-nowrap">
 <QrCode className="w-3.5 h-3.5 text-theme-primary shrink-0" />
 <span>{mov.uid}</span>
 </td>

 <td className="py-3 px-4">
 <span className="font-bold text-theme-main block">{mov.productName}</span>
 <span className="font-mono text-[10px] text-theme-muted">{mov.sku}</span>
 </td>

 <td className="py-3 px-4 whitespace-nowrap">
 <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getMovementBadge(mov.movementType)}`}>
 {mov.movementType}
 </span>
 </td>

 <td className="py-3 px-4 text-theme-muted font-medium">
 {mov.origin}
 </td>

 <td className="py-3 px-4 font-semibold text-theme-primary">
 {mov.destination}
 </td>

 <td className="py-3 px-4 text-theme-main flex items-center gap-1">
 <User className="w-3 h-3 text-theme-muted" />
 <span>{mov.user}</span>
 </td>

 <td className="py-3 px-4 text-theme-muted text-[11px]">
 {mov.notes || '—'}
 </td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 );
};
