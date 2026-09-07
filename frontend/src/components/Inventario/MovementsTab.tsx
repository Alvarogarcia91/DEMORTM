import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  QrCode, 
  ArrowRight, 
  User, 
  RotateCcw,
  CheckCircle2,
  FileText,
  Boxes
} from 'lucide-react';
import { MOCK_INVENTORY_MOVEMENTS, InventoryMovement } from '../../data/mockInventoryData';

export const MovementsTab: React.FC = () => {
  const [movements] = useState<InventoryMovement[]>(MOCK_INVENTORY_MOVEMENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredMovements = movements.filter((m) => {
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch = 
      !q ||
      m.uid.toLowerCase().includes(q) ||
      m.sku.toLowerCase().includes(q) ||
      m.productName.toLowerCase().includes(q) ||
      (m.lotNumber && m.lotNumber.toLowerCase().includes(q)) ||
      (m.reference && m.reference.toLowerCase().includes(q)) ||
      m.origin.toLowerCase().includes(q) ||
      m.destination.toLowerCase().includes(q) ||
      m.user.toLowerCase().includes(q);

    const matchesType = filterType === 'all' || m.movementType === filterType;

    return matchesSearch && matchesType;
  });

  const getMovementBadge = (type: string) => {
    switch (type) {
      case 'RECEPCIÓN':
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30';
      case 'ACOMODO':
        return 'bg-blue-500/10 text-blue-700 border-blue-500/30';
      case 'RESERVA':
        return 'bg-amber-500/10 text-amber-700 border-amber-500/30';
      case 'SURTIDO OP':
      case 'SURTIDO':
      case 'PICKING':
        return 'bg-purple-500/10 text-purple-700 border-purple-500/30';
      case 'DEVOLUCIÓN PRODUCCIÓN':
      case 'REMANENTE':
        return 'bg-indigo-500/10 text-indigo-700 border-indigo-500/30';
      case 'CUARENTENA QA':
      case 'SCRAP':
      case 'RETRABAJO':
        return 'bg-rose-500/10 text-rose-700 border-rose-500/30';
      case 'LIBERACIÓN QA':
      case 'PRODUCTO TERMINADO':
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30';
      case 'EMBARQUE':
        return 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-700';
      default:
        return 'bg-theme-muted text-theme-main border-theme-subtle';
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      
      {/* Header Info */}
      <div className="bg-theme-surface p-4 sm:p-5 border border-theme-subtle rounded-3xl shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-theme-primary/10 text-theme-primary flex items-center justify-center border border-theme-primary/20">
              <History className="w-5 h-5" />
            </div>
            <h2 className="text-sm sm:text-base font-extrabold text-theme-main">
              Kardex & Trazabilidad de Movimientos
            </h2>
          </div>
          <p className="text-xs text-theme-muted mt-1">
            Registro cronológico inmutable (append-only) de recepciones, acomodos, reservas OP, surtidos a producción y embarques.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-theme-muted" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por material, lote, OP, usuario..."
              className="w-full bg-theme-muted border border-theme-subtle rounded-xl pl-9 pr-3 py-2 text-xs text-theme-main placeholder-theme-muted focus:bg-theme-surface focus:outline-none focus:border-theme-primary"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2.5 text-theme-muted hover:text-theme-main"
              >
                ×
              </button>
            )}
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-theme-muted border border-theme-subtle text-xs font-semibold text-theme-main py-2 px-3 rounded-xl focus:outline-none focus:border-theme-primary cursor-pointer"
          >
            <option value="all">Todos los movimientos</option>
            <option value="RECEPCIÓN">RECEPCIÓN</option>
            <option value="ACOMODO">ACOMODO</option>
            <option value="RESERVA">RESERVA</option>
            <option value="SURTIDO OP">SURTIDO OP</option>
            <option value="DEVOLUCIÓN PRODUCCIÓN">DEVOLUCIÓN PRODUCCIÓN</option>
            <option value="CUARENTENA QA">CUARENTENA QA</option>
            <option value="LIBERACIÓN QA">LIBERACIÓN QA</option>
            <option value="PRODUCTO TERMINADO">PRODUCTO TERMINADO</option>
            <option value="EMBARQUE">EMBARQUE</option>
          </select>
        </div>
      </div>

      {/* Movements Table */}
      <div className="bg-theme-surface border border-theme-subtle rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[950px]">
            <thead>
              <tr className="bg-theme-muted/40 border-b border-theme-subtle text-theme-muted font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Fecha / Hora</th>
                <th className="py-3 px-3">Tipo Movimiento</th>
                <th className="py-3 px-4">Material / Insumo</th>
                <th className="py-3 px-3">Lote</th>
                <th className="py-3 px-3 text-right">Cantidad</th>
                <th className="py-3 px-3">Origen</th>
                <th className="py-3 px-3">Destino</th>
                <th className="py-3 px-3">Referencia</th>
                <th className="py-3 px-3">Usuario</th>
                <th className="py-3 px-4">Observaciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-subtle">
              {filteredMovements.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-theme-muted text-xs">
                    No se encontraron movimientos registrados con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredMovements.map((mov) => (
                  <tr key={mov.id} className="hover:bg-theme-muted/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-theme-main whitespace-nowrap">
                      {mov.timestamp}
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getMovementBadge(mov.movementType)}`}>
                        {mov.movementType}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-extrabold text-theme-main block">{mov.productName}</span>
                      <span className="font-mono text-[10px] text-theme-muted">{mov.sku}</span>
                    </td>

                    <td className="py-3 px-3 font-mono text-theme-muted whitespace-nowrap">
                      {mov.lotNumber || '—'}
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-theme-main whitespace-nowrap">
                      {mov.quantity ? `${mov.quantity.toLocaleString()} ${mov.uom || ''}` : '—'}
                    </td>

                    <td className="py-3 px-3 text-theme-muted font-medium">
                      {mov.origin}
                    </td>

                    <td className="py-3 px-3 font-semibold text-theme-primary">
                      {mov.destination}
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      {mov.reference ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-700 border border-amber-500/20">
                          {mov.reference}
                        </span>
                      ) : (
                        <span className="text-theme-muted">—</span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-theme-main whitespace-nowrap">
                      <span className="flex items-center gap-1 font-medium">
                        <User className="w-3 h-3 text-theme-muted" />
                        <span>{mov.user}</span>
                      </span>
                    </td>

                    <td className="py-3 px-4 text-theme-muted text-[11px] max-w-xs">
                      {mov.notes || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3.5 border-t border-theme-subtle bg-theme-muted/20 text-xs text-theme-muted flex items-center justify-between">
          <span>{filteredMovements.length} movimientos en bitácora de auditoría</span>
          <span className="font-mono text-[10px]">Trazabilidad append-only · No se permite borrado de registros</span>
        </div>
      </div>
    </div>
  );
};
