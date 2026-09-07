import React from 'react';
import { Download, Filter, RotateCcw, Search, SlidersHorizontal, Users } from 'lucide-react';
import { AuditModuleKey } from '../../data/mockAuditTrailData';

interface AuditTrailFiltersProps {
  selectedPeriod: string; // 'Hoy' | '7 días' | '30 días' | '90 días'
  onSelectPeriod: (period: string) => void;
  selectedModule: string;
  onSelectModule: (module: string) => void;
  selectedUser: string;
  onSelectUser: (user: string) => void;
  selectedActionType: string;
  onSelectActionType: (actionType: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onResetFilters: () => void;
  onExportAudit: () => void;
  availableUsers: string[];
}

export const AuditTrailFilters: React.FC<AuditTrailFiltersProps> = ({
  selectedPeriod,
  onSelectPeriod,
  selectedModule,
  onSelectModule,
  selectedUser,
  onSelectUser,
  selectedActionType,
  onSelectActionType,
  searchQuery,
  onSearchChange,
  onResetFilters,
  onExportAudit,
  availableUsers,
}) => {
  return (
    <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm space-y-4">
      {/* Fila 1: Filtros de Rango Temporal y Buscador */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Rango de Tiempo */}
        <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl self-start sm:self-auto">
          {['Hoy', '7 días', '30 días', '90 días'].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onSelectPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedPeriod === p
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Buscador Universal y Botón Exportar */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar por folio, OP, lote, cliente..."
              className="w-full pl-8 pr-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 outline-none focus:ring-1 focus:ring-zinc-900"
            />
          </div>

          <button
            type="button"
            onClick={onExportAudit}
            className="px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer shadow-2xs"
            title="Exportar bitácora oficial"
          >
            <Download className="w-3.5 h-3.5 text-zinc-500" />
            <span className="hidden sm:inline">Exportar</span>
          </button>
        </div>
      </div>

      {/* Fila 2: Selectores de Módulo, Usuario y Tipo de Acción */}
      <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center gap-3">
        {/* Selector de Módulo */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-zinc-400 font-bold">Módulo:</span>
          <select
            value={selectedModule}
            onChange={(e) => onSelectModule(e.target.value)}
            className="p-1.5 px-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 outline-none cursor-pointer"
          >
            <option value="Todos">Todos los módulos</option>
            <option value="Producción">Producción</option>
            <option value="Calidad">Calidad</option>
            <option value="Inventario">Inventario</option>
            <option value="Compras">Compras</option>
            <option value="Comercial">Comercial</option>
            <option value="Finanzas">Finanzas</option>
            <option value="Nómina">Nómina</option>
            <option value="Mantenimiento">Mantenimiento</option>
          </select>
        </div>

        {/* Selector de Usuario */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-zinc-400 font-bold">Usuario:</span>
          <select
            value={selectedUser}
            onChange={(e) => onSelectUser(e.target.value)}
            className="p-1.5 px-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 outline-none cursor-pointer"
          >
            <option value="Todos">Todos los usuarios</option>
            {availableUsers.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>

        {/* Selector de Tipo de Acción */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-zinc-400 font-bold">Acción:</span>
          <select
            value={selectedActionType}
            onChange={(e) => onSelectActionType(e.target.value)}
            className="p-1.5 px-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 outline-none cursor-pointer"
          >
            <option value="Todas">Todas las acciones</option>
            <option value="Aprobaciones">Aprobaciones y firmas</option>
            <option value="Cambios">Cambios de estado</option>
            <option value="Ajustes">Reaperturas y ajustes</option>
            <option value="ConMotivo">Solo eventos con motivo</option>
          </select>
        </div>

        {/* Botón Reset */}
        {(selectedModule !== 'Todos' ||
          selectedUser !== 'Todos' ||
          selectedActionType !== 'Todas' ||
          searchQuery.trim() !== '') && (
          <button
            type="button"
            onClick={onResetFilters}
            className="ml-auto text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Limpiar filtros</span>
          </button>
        )}
      </div>
    </div>
  );
};
