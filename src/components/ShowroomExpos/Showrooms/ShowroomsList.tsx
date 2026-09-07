import React, { useState } from 'react';
import { 
  Store, 
  Building2, 
  MapPin, 
  Sparkles, 
  ArrowLeftRight, 
  QrCode, 
  Eye, 
  CheckCircle2, 
  AlertTriangle, 
  Clock,
  Boxes,
  ChevronRight
} from 'lucide-react';
import { ShowroomBayRecord, ShowroomBayStatus } from '../../../data/mockShowroomExposData';
import { StatusBadge } from '../../common/StatusBadge';
import { SemanticVariant } from '../../common/semanticTokens';

interface ShowroomsListProps {
  bays: ShowroomBayRecord[];
  onSelectBay: (bay: ShowroomBayRecord) => void;
  onOpenMountWizard: (bay: ShowroomBayRecord) => void;
  onOpenWithdrawModal: (bay: ShowroomBayRecord) => void;
  onOpenQrModal: (bay: ShowroomBayRecord) => void;
}

export const ShowroomsList: React.FC<ShowroomsListProps> = ({
  bays,
  onSelectBay,
  onOpenMountWizard,
  onOpenWithdrawModal,
  onOpenQrModal,
}) => {
  const [selectedBranch, setSelectedBranch] = useState<'ALL' | 'wh-reynosa' | 'wh-matamoros'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | ShowroomBayStatus>('ALL');

  const filteredBays = bays.filter((b) => {
    if (selectedBranch !== 'ALL' && b.branchId !== selectedBranch) return false;
    if (statusFilter !== 'ALL' && b.status !== statusFilter) return false;
    return true;
  });

  const getBayVariant = (status: ShowroomBayStatus): SemanticVariant => {
    switch (status) {
      case 'En exhibición':
        return 'smart';
      case 'Disponible':
        return 'success';
      case 'Pendiente de montaje':
        return 'warning';
      case 'Pendiente de retiro':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  const valleBays = bays.filter((b) => b.branchId === 'wh-reynosa');
  const cumbresBays = bays.filter((b) => b.branchId === 'wh-matamoros');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Filter Bar */}
      <div className="bg-theme-surface p-4 border border-theme-subtle rounded-3xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Branch Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setSelectedBranch('ALL')}
            className={`px-3 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              selectedBranch === 'ALL'
                ? 'bg-theme-primary text-white shadow-xs'
                : 'bg-theme-muted hover:bg-theme-subtle text-theme-main border border-theme-subtle'
            }`}
          >
            Todas las bahías ({bays.length})
          </button>
          <button
            onClick={() => setSelectedBranch('wh-reynosa')}
            className={`px-3 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedBranch === 'wh-reynosa'
                ? 'bg-theme-primary text-white shadow-xs'
                : 'bg-theme-muted hover:bg-theme-subtle text-theme-main border border-theme-subtle'
            }`}
          >
            <Store className="w-3.5 h-3.5 text-purple-500" />
            <span>Planta Principal Reynosa ({valleBays.length})</span>
          </button>
          <button
            onClick={() => setSelectedBranch('wh-matamoros')}
            className={`px-3 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedBranch === 'wh-matamoros'
                ? 'bg-theme-primary text-white shadow-xs'
                : 'bg-theme-muted hover:bg-theme-subtle text-theme-main border border-theme-subtle'
            }`}
          >
            <Store className="w-3.5 h-3.5 text-emerald-500" />
            <span>Almacén Satélite Matamoros ({cumbresBays.length})</span>
          </button>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-theme-muted font-bold text-[11px] uppercase">Estado:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-theme-surface border border-theme-subtle text-theme-main font-bold text-xs focus:outline-none focus:border-theme-primary"
          >
            <option value="ALL">Todos los estados</option>
            <option value="En exhibición">En exhibición</option>
            <option value="Disponible">Disponible</option>
            <option value="Pendiente de montaje">Pendiente de montaje</option>
            <option value="Pendiente de retiro">Pendiente de retiro</option>
          </select>
        </div>
      </div>

      {/* Grid of 12 Bays */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBays.map((bay) => {
          const isOccupied = bay.status === 'En exhibición' || bay.status === 'Pendiente de retiro';
          const isOverdue = (bay.currentUnit?.daysInExhibition || 0) >= 40;

          return (
            <div
              key={bay.id}
              className={`p-5 rounded-3xl bg-theme-surface border transition-all flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-md ${
                isOverdue
                  ? 'border-rose-500/40'
                  : 'border-theme-subtle hover:border-theme-main'
              }`}
            >
              {/* Card Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-xl bg-white border border-purple-500 text-purple-700 text-xs font-mono font-black shadow-2xs">
                      {bay.code}
                    </span>
                    <span className="text-xs font-bold text-theme-muted">
                      {bay.branchCode}
                    </span>
                  </div>
                  <StatusBadge variant={getBayVariant(bay.status)} label={bay.status} size="sm" />
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-theme-muted">
                  <MapPin className="w-3.5 h-3.5 text-theme-primary shrink-0" />
                  <span>{bay.branchName}</span>
                </div>
              </div>

              {/* Card Body / Article */}
              <div className="flex-1 space-y-2 pt-1">
                {bay.currentArticle ? (
                  <div className="p-3.5 rounded-2xl bg-white border border-zinc-200 space-y-2 shadow-2xs">
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-mono font-bold text-theme-primary block">
                        {bay.currentArticle.sku}
                      </span>
                      <strong className="text-xs font-bold text-zinc-900 block line-clamp-1">
                        {bay.currentArticle.productName}
                      </strong>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] pt-1.5 border-t border-zinc-100">
                      <div>
                        <span className="text-zinc-500 block">UID Montado</span>
                        <span className="font-mono font-bold text-zinc-900">{bay.currentUnit?.uid || 'Pendiente'}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">Días en piso</span>
                        <span className={`font-mono font-bold ${isOverdue ? 'text-rose-600' : 'text-zinc-900'}`}>
                          {bay.currentUnit?.daysInExhibition || 0}d {isOverdue && '⚠️'}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl bg-theme-muted/20 border border-dashed border-theme-subtle text-center space-y-1">
                    <span className="text-xs font-bold text-emerald-600 block">Bahía Libre</span>
                    <span className="text-[10px] text-theme-muted block">Lista para montar Muestrario de demostración</span>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="pt-2 border-t border-theme-subtle flex items-center justify-between gap-2">
                <button
                  onClick={() => onOpenQrModal(bay)}
                  className="p-2 rounded-xl text-theme-muted hover:text-theme-main hover:bg-theme-muted transition-colors cursor-pointer"
                  title="Ver QR de bahía"
                >
                  <QrCode className="w-4 h-4 text-purple-600" />
                </button>

                <div className="flex items-center gap-1.5">
                  {bay.status === 'Disponible' && (
                    <button
                      onClick={() => onOpenMountWizard(bay)}
                      className="px-3 py-1.5 rounded-xl bg-theme-primary text-white text-xs font-bold hover:bg-theme-primary/90 transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Montar</span>
                    </button>
                  )}

                  {bay.status === 'En exhibición' && (
                    <button
                      onClick={() => onOpenWithdrawModal(bay)}
                      className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                      <span>Retirar</span>
                    </button>
                  )}

                  <button
                    onClick={() => onSelectBay(bay)}
                    className="px-3 py-1.5 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main text-xs font-bold border border-theme-subtle transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>Detalle</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
