import React, { useState } from 'react';
import {
  X,
  History,
  Search,
  Filter,
  User,
  Clock,
  ShieldAlert,
  FileCheck2,
  CheckCircle2,
  Layers,
  ArrowRight,
  Download,
} from 'lucide-react';
import { PayrollAuditEntry } from '../../data/mockNominaData';

interface PayrollAuditDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  auditEntries: PayrollAuditEntry[];
  onTriggerToast: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const PayrollAuditDrawer: React.FC<PayrollAuditDrawerProps> = ({
  isOpen,
  onClose,
  auditEntries,
  onTriggerToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState<string>('Todos');

  if (!isOpen) return null;

  const filteredEntries = auditEntries.filter((entry) => {
    const matchesSearch =
      entry.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.accion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.detalle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.motivo && entry.motivo.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesAction = filterAction === 'Todos' || entry.accion.includes(filterAction);
    return matchesSearch && matchesAction;
  });

  const handleExportAudit = () => {
    onTriggerToast('Auditoría Exportada', 'Generando bitácora de trazabilidad en CSV conforme a norma IATF...', 'info');
    setTimeout(() => {
      onTriggerToast('Archivo Listo', 'Bitacora_Auditoria_Nomina_RTM.csv descargado.', 'success');
    }, 700);
  };

  const getActionBadge = (accion: string) => {
    if (accion.toLowerCase().includes('autoriz')) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-white text-emerald-800 border border-emerald-500">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          {accion}
        </span>
      );
    }
    if (accion.toLowerCase().includes('timbr')) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-white text-purple-800 border border-purple-500">
          <FileCheck2 className="w-3 h-3 text-purple-600" />
          {accion}
        </span>
      );
    }
    if (accion.toLowerCase().includes('reapert') || accion.toLowerCase().includes('ajust')) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-white text-amber-800 border border-amber-500">
          <Clock className="w-3 h-3 text-amber-600" />
          {accion}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-white text-zinc-700 border border-zinc-300">
        {accion}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-zinc-900 text-white">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900">Historial de Cambios y Trazabilidad</h3>
              <p className="text-xs text-zinc-500">
                Registro inmutable de movimientos, autorizaciones y ajustes en el módulo de Nómina (IATF / ISO)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Actions Bar */}
        <div className="p-4 border-b border-zinc-200 bg-white space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
              <input
                type="text"
                placeholder="Buscar por usuario, acción o motivo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900"
              />
            </div>
            <button
              onClick={handleExportAudit}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 bg-white border border-zinc-300 rounded-lg hover:bg-zinc-50 shadow-sm transition-colors"
              title="Exportar bitácora"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto text-[11px] pb-1">
            <span className="text-zinc-400 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Filtro:
            </span>
            {['Todos', 'Ajuste', 'Autorización', 'Conciliación', 'Importación', 'Timbrado'].map((action) => (
              <button
                key={action}
                onClick={() => setFilterAction(action)}
                className={`px-2 py-0.5 rounded-full font-medium transition-colors ${
                  filterAction === action
                    ? 'bg-zinc-900 text-white'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                {action}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Entries List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {filteredEntries.map((entry, index) => (
            <div
              key={entry.id || index}
              className="relative pl-6 pb-4 border-l-2 border-zinc-200 last:border-l-transparent last:pb-0"
            >
              {/* Timeline Dot */}
              <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-white border-2 border-zinc-900" />

              <div className="bg-white border border-zinc-200 rounded-xl p-3.5 shadow-sm space-y-2 hover:border-zinc-300 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div>{getActionBadge(entry.accion)}</div>
                  <span className="text-[11px] text-zinc-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3 text-zinc-400" />
                    {entry.fechaHora}
                  </span>
                </div>

                <div className="text-xs text-zinc-800 font-medium leading-relaxed">
                  {entry.detalle}
                </div>

                {entry.motivo && (
                  <div className="text-[11px] text-zinc-500 bg-zinc-50 p-2 rounded border border-zinc-100 italic">
                    <span className="font-semibold not-italic text-zinc-700">Motivo: </span>
                    {entry.motivo}
                  </div>
                )}

                <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[10px] text-zinc-400">
                  <span className="flex items-center gap-1 text-zinc-600 font-medium">
                    <User className="w-3 h-3 text-zinc-400" />
                    {entry.usuario}
                  </span>
                  <span className="font-mono">ID: {entry.id}</span>
                </div>
              </div>
            </div>
          ))}

          {filteredEntries.length === 0 && (
            <div className="text-center py-12 text-zinc-400 text-xs">
              No se encontraron registros de auditoría que coincidan con la búsqueda.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-200 bg-zinc-50/80 flex items-center justify-between text-xs text-zinc-500">
          <span>{filteredEntries.length} eventos registrados</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-zinc-300 text-zinc-700 rounded-lg hover:bg-zinc-100 font-medium transition-colors"
          >
            Cerrar Bitácora
          </button>
        </div>
      </div>
    </div>
  );
};
