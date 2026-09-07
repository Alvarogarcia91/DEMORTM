import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  Calendar, 
  QrCode, 
  Scan, 
  RotateCcw, 
  Plus, 
  ChevronRight, 
  CheckCircle2, 
  Clock,
  Boxes
} from 'lucide-react';
import { ExpoRecord, ExpoStatus } from '../../../data/mockShowroomExposData';
import { StatusBadge } from '../../common/StatusBadge';
import { SemanticVariant } from '../../common/semanticTokens';

interface ExposListProps {
  expos: ExpoRecord[];
  onSelectExpo: (expo: ExpoRecord) => void;
  onOpenCreateWizard: () => void;
  onOpenQrModal: (expo: ExpoRecord) => void;
  onOpenMountScanModal: (expo: ExpoRecord) => void;
  onOpenReturnModal: (expo: ExpoRecord) => void;
}

export const ExposList: React.FC<ExposListProps> = ({
  expos,
  onSelectExpo,
  onOpenCreateWizard,
  onOpenQrModal,
  onOpenMountScanModal,
  onOpenReturnModal,
}) => {
  const [statusTab, setStatusTab] = useState<'ALL' | 'Planeadas' | 'Activas' | 'Por regresar' | 'Cerradas'>('ALL');

  const filteredExpos = expos.filter((e) => {
    if (statusTab === 'Planeadas') return e.status === 'Planeada' || e.status === 'Preparando';
    if (statusTab === 'Activas') return e.status === 'En exposición externa' || e.status === 'En tránsito';
    if (statusTab === 'Por regresar') return e.status === 'Por regresar' || e.status === 'En retorno';
    if (statusTab === 'Cerradas') return e.status === 'Cerrada';
    return true;
  });

  const getStatusVariant = (status: ExpoStatus): SemanticVariant => {
    switch (status) {
      case 'En exposición externa':
        return 'smart';
      case 'Preparando':
      case 'En tránsito':
        return 'info';
      case 'Planeada':
        return 'warning';
      case 'Por regresar':
      case 'En retorno':
        return 'danger';
      case 'Cerrada':
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Filter Bar */}
      <div className="bg-theme-surface p-4 border border-theme-subtle rounded-3xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setStatusTab('ALL')}
            className={`px-3 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              statusTab === 'ALL'
                ? 'bg-theme-primary text-white shadow-xs'
                : 'bg-theme-muted hover:bg-theme-subtle text-theme-main border border-theme-subtle'
            }`}
          >
            Todas ({expos.length})
          </button>
          <button
            onClick={() => setStatusTab('Activas')}
            className={`px-3 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              statusTab === 'Activas'
                ? 'bg-theme-primary text-white shadow-xs'
                : 'bg-theme-muted hover:bg-theme-subtle text-theme-main border border-theme-subtle'
            }`}
          >
            Activas en sede ({expos.filter(e => e.status === 'En exposición externa' || e.status === 'En tránsito').length})
          </button>
          <button
            onClick={() => setStatusTab('Planeadas')}
            className={`px-3 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              statusTab === 'Planeadas'
                ? 'bg-theme-primary text-white shadow-xs'
                : 'bg-theme-muted hover:bg-theme-subtle text-theme-main border border-theme-subtle'
            }`}
          >
            Planeadas ({expos.filter(e => e.status === 'Planeada' || e.status === 'Preparando').length})
          </button>
          <button
            onClick={() => setStatusTab('Por regresar')}
            className={`px-3 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              statusTab === 'Por regresar'
                ? 'bg-theme-primary text-white shadow-xs'
                : 'bg-theme-muted hover:bg-theme-subtle text-theme-main border border-theme-subtle'
            }`}
          >
            Por regresar ({expos.filter(e => e.status === 'Por regresar' || e.status === 'En retorno').length})
          </button>
          <button
            onClick={() => setStatusTab('Cerradas')}
            className={`px-3 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              statusTab === 'Cerradas'
                ? 'bg-theme-primary text-white shadow-xs'
                : 'bg-theme-muted hover:bg-theme-subtle text-theme-main border border-theme-subtle'
            }`}
          >
            Cerradas ({expos.filter(e => e.status === 'Cerrada').length})
          </button>
        </div>

        {/* Primary CTA */}
        <button
          onClick={onOpenCreateWizard}
          className="px-4 py-2.5 rounded-2xl bg-theme-primary text-white text-xs font-bold hover:bg-theme-primary/90 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Expo</span>
        </button>
      </div>

      {/* Grid of Expos Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredExpos.map((expo) => (
          <div
            key={expo.id}
            className="p-5 rounded-3xl bg-theme-surface border border-theme-subtle hover:border-theme-main transition-all flex flex-col justify-between space-y-4 shadow-2xs"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-theme-primary text-xs">
                  {expo.folio}
                </span>
                <StatusBadge variant={getStatusVariant(expo.status)} label={expo.status} size="sm" />
              </div>

              <strong className="text-sm font-bold text-theme-main block line-clamp-1">
                {expo.name}
              </strong>

              <div className="space-y-1 text-xs text-theme-muted">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-theme-primary shrink-0" />
                  <span className="line-clamp-1">{expo.venue}</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>{expo.startDate} &ndash; {expo.endDate}</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-zinc-200 flex items-center justify-between text-xs shadow-2xs">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase font-bold block">Unidades asignadas</span>
                <strong className="font-mono font-black text-theme-primary text-sm">
                  {expo.totalUnits} colchones
                </strong>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-zinc-500 uppercase font-bold block">Origen</span>
                <span className="text-zinc-800 font-semibold text-[11px]">{expo.originFacilityName}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-theme-subtle flex items-center justify-between gap-2">
              <button
                onClick={() => onOpenQrModal(expo)}
                className="p-2 rounded-xl text-theme-muted hover:text-theme-main hover:bg-theme-muted transition-colors cursor-pointer"
                title="Ver QR Expo"
              >
                <QrCode className="w-4 h-4 text-blue-600" />
              </button>

              <div className="flex items-center gap-1.5">
                {expo.status === 'Preparando' && (
                  <button
                    onClick={() => onOpenMountScanModal(expo)}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Scan className="w-3.5 h-3.5" />
                    <span>Montaje</span>
                  </button>
                )}

                {(expo.status === 'En exposición externa' || expo.status === 'Por regresar') && (
                  <button
                    onClick={() => onOpenReturnModal(expo)}
                    className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retorno</span>
                  </button>
                )}

                <button
                  onClick={() => onSelectExpo(expo)}
                  className="px-3 py-1.5 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main text-xs font-bold border border-theme-subtle transition-all cursor-pointer flex items-center gap-1"
                >
                  <span>Detalle</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
