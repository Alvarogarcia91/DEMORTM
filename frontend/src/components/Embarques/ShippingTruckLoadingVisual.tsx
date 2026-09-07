import React, { useState } from 'react';
import { 
  Truck, 
  Layers, 
  ArrowRight, 
  ArrowLeft, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle, 
  QrCode, 
  FileText, 
  Info, 
  Sparkles,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  PackageCheck
} from 'lucide-react';
import { LoadingZone, ShippingVehicle, RouteStop } from '../../data/mockShippingData';

interface ShippingTruckLoadingVisualProps {
  vehicle?: ShippingVehicle;
  loadingZones: LoadingZone[];
  totalUnits: number;
  isMultiStop: boolean;
  isManualMode: boolean;
  onMoveZone?: (index: number, direction: 'left' | 'right') => void;
  onToggleManualMode?: () => void;
  onRestoreRecommendation?: () => void;
}

export const ShippingTruckLoadingVisual: React.FC<ShippingTruckLoadingVisualProps> = ({
  vehicle,
  loadingZones,
  totalUnits,
  isMultiStop,
  isManualMode,
  onMoveZone,
  onToggleManualMode,
  onRestoreRecommendation,
}) => {
  const [expandedZoneId, setExpandedZoneId] = useState<string | null>(null);

  const capacity = vehicle?.maxUnitsCapacity || 32;
  const occupancyPercentage = Math.min(100, Math.round((totalUnits / capacity) * 100));
  const isCapacitySufficient = capacity >= totalUnits;

  const toggleExpand = (id: string) => {
    setExpandedZoneId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-4">
      
      {/* Vehicle Capacity Bar Card */}
      <div className="p-4 rounded-3xl bg-white border border-zinc-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white border border-zinc-300 text-zinc-800 flex items-center justify-center shadow-2xs">
              <Truck className="w-4 h-4 text-theme-primary" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-500 block">Unidad de Carga Asignada</span>
              <strong className="text-zinc-950 text-xs font-black">
                {vehicle ? `${vehicle.name} (Placas: ${vehicle.plate})` : 'Camión #08 · Isuzu NPR'}
              </strong>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right font-mono text-xs">
              <span className="text-zinc-500 text-[10px] block">Capacidad / Ocupación</span>
              <strong className="text-zinc-950 font-black">
                {totalUnits} / {capacity} unidades ({occupancyPercentage}%)
              </strong>
            </div>

            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-2xs bg-white ${
              isCapacitySufficient ? 'border-emerald-600 text-emerald-700' : 'border-amber-500 text-amber-800'
            }`}>
              {isCapacitySufficient ? 'Capacidad suficiente' : 'Carga superior a la capacidad estimada'}
            </span>
          </div>
        </div>

        {/* Capacity Progress Bar */}
        <div className="space-y-1">
          <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                occupancyPercentage > 90 
                  ? 'bg-amber-500' 
                  : occupancyPercentage > 100 
                  ? 'bg-theme-primary' 
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${occupancyPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Truck Cargo Bed Container (Diagram) */}
      <div className="p-5 rounded-3xl bg-white border border-zinc-300 shadow-xs space-y-4">
        
        {/* Diagram Header / Mode Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-zinc-950">
                Esquema de Estiba & Acomodo Físico en Caja
              </h4>
              {isMultiStop && (
                <span className={`px-2 py-0.2 rounded-full text-[9px] font-bold border shadow-2xs bg-white ${
                  isManualMode ? 'border-purple-500 text-purple-700' : 'border-theme-primary text-theme-primary'
                }`}>
                  {isManualMode ? 'Secuencia personalizada' : 'Secuencia recomendada'}
                </span>
              )}
            </div>
            <p className="text-[11px] text-zinc-500">
              {isMultiStop
                ? 'La última entrega se carga primero y la primera entrega queda al final, más cercana a la descarga.'
                : 'Esta orden tiene un único destino, por lo que no requiere secuencia especial de carga.'}
            </p>
          </div>

          {/* Manual Mode Buttons (Only for multi-stop) */}
          {isMultiStop && onToggleManualMode && (
            <div className="flex items-center gap-2 shrink-0">
              {isManualMode && onRestoreRecommendation && (
                <button
                  type="button"
                  onClick={onRestoreRecommendation}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-zinc-50 text-zinc-700 font-bold text-xs border border-zinc-300 transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-zinc-600" />
                  <span>Restaurar recomendación</span>
                </button>
              )}

              <button
                type="button"
                onClick={onToggleManualMode}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs border transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer ${
                  isManualMode 
                    ? 'bg-purple-50 text-purple-800 border-purple-400' 
                    : 'bg-white hover:bg-zinc-50 text-zinc-800 border-zinc-300'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-theme-primary" />
                <span>{isManualMode ? 'Modo manual activo' : 'Cambiar a carga manual'}</span>
              </button>
            </div>
          )}
        </div>

        {/* The Graphic Truck Bed Representation (Left to Right) */}
        <div className="relative border-2 border-zinc-400 rounded-2xl bg-zinc-50/80 p-3 sm:p-4 overflow-x-auto">
          
          {/* Truck Visual Layout: Cab -> Zones -> Rear Doors */}
          <div className="flex items-stretch gap-3 min-w-[620px]">
            
            {/* 1. FRONT CABIN (Left) */}
            <div className="w-24 bg-white border-2 border-zinc-300 rounded-xl p-3 flex flex-col items-center justify-center text-center space-y-1.5 shrink-0 shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-600 border border-zinc-200">
                <Truck className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-wider text-zinc-700 block leading-tight">
                Frente de la Unidad
              </span>
              <span className="text-[8px] font-mono text-zinc-400">
                Cabina / Motor
              </span>
            </div>

            {/* 2. CARGO BED ZONES (Center) */}
            <div className="flex-1 grid grid-flow-col auto-cols-fr gap-2.5">
              {loadingZones.map((zone, idx) => {
                const isExpanded = expandedZoneId === zone.id;

                return (
                  <div
                    key={zone.id}
                    className={`bg-white rounded-xl border-2 p-3 flex flex-col justify-between space-y-2 shadow-xs transition-all relative ${
                      zone.zonePosition === 'Fondo'
                        ? 'border-indigo-500/80'
                        : zone.zonePosition === 'Puertas'
                        ? 'border-theme-primary/80'
                        : 'border-zinc-300'
                    }`}
                  >
                    {/* Zone Header Tag */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-black text-[10px] uppercase text-zinc-900 tracking-wider">
                          {zone.zoneCode} &bull; Parada {zone.stopSequenceNumber}
                        </span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-zinc-100 text-zinc-700 border border-zinc-300">
                          {zone.zonePosition}
                        </span>
                      </div>

                      <strong className="text-zinc-950 text-xs block leading-tight truncate" title={zone.destinationName}>
                        {zone.destinationName}
                      </strong>
                      <span className="text-[10px] text-zinc-500 block truncate">
                        {zone.zoneName}
                      </span>
                    </div>

                    {/* Zone Units & Remisión Badge */}
                    <div className="p-2 rounded-lg bg-zinc-50 border border-zinc-200 space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-zinc-500">Unidades:</span>
                        <strong className="text-zinc-950 font-mono font-black">{zone.totalUnits} piezas</strong>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-zinc-500">Remisión:</span>
                        <span className="font-mono font-bold text-theme-primary">{zone.remisionFolio}</span>
                      </div>
                    </div>

                    {/* UIDs Expandable Trigger */}
                    <div className="space-y-1 pt-1 border-t border-zinc-100">
                      <button
                        type="button"
                        onClick={() => toggleExpand(zone.id)}
                        className="w-full flex items-center justify-between text-[10px] font-bold text-zinc-700 hover:text-zinc-950 cursor-pointer"
                      >
                        <span className="flex items-center gap-1">
                          <QrCode className="w-3 h-3 text-theme-primary" />
                          <span>{zone.uids.length} UIDs asociados</span>
                        </span>
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>

                      {/* Expanded UIDs list */}
                      {isExpanded && (
                        <div className="p-2 rounded-lg bg-zinc-100 border border-zinc-200 space-y-1 max-h-24 overflow-y-auto animate-in fade-in">
                          {zone.uids.map((uid) => (
                            <span
                              key={uid}
                              className="font-mono text-[9px] font-bold block px-1.5 py-0.5 rounded bg-white text-zinc-900 border border-zinc-300"
                            >
                              {uid}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Manual Move Buttons (if in manual mode) */}
                    {isManualMode && isMultiStop && onMoveZone && (
                      <div className="flex items-center justify-between pt-1 border-t border-zinc-100 text-[10px]">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => onMoveZone(idx, 'left')}
                          className="px-2 py-0.5 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed border border-zinc-300 flex items-center gap-1 font-bold"
                          title="Mover hacia el fondo"
                        >
                          <ArrowLeft className="w-3 h-3" />
                          <span>Fondo</span>
                        </button>
                        <button
                          type="button"
                          disabled={idx === loadingZones.length - 1}
                          onClick={() => onMoveZone(idx, 'right')}
                          className="px-2 py-0.5 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed border border-zinc-300 flex items-center gap-1 font-bold"
                          title="Mover hacia puertas"
                        >
                          <span>Puertas</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>

            {/* 3. REAR DISCHARGE DOORS (Right) */}
            <div className="w-24 bg-white border-2 border-theme-primary rounded-xl p-3 flex flex-col items-center justify-center text-center space-y-1.5 shrink-0 shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-theme-primary-light flex items-center justify-center text-theme-primary border border-theme-primary/20">
                <PackageCheck className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-wider text-theme-primary block leading-tight">
                Puertas de Descarga
              </span>
              <span className="text-[8px] font-mono text-zinc-500">
                Primer acceso en ruta
              </span>
            </div>

          </div>

          {/* Flow Direction Indicator Bars */}
          {isMultiStop && (
            <div className="mt-4 pt-3 border-t border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] font-mono">
              <div className="flex items-center gap-2 text-indigo-700 font-bold">
                <span className="px-2 py-0.5 rounded bg-white border border-indigo-400">
                  Orden de Carga: {loadingZones.map((z) => z.stopSequenceNumber).join(' → ')}
                </span>
                <span className="text-zinc-500 font-normal font-sans">(Fondo &rarr; Puertas)</span>
              </div>

              <div className="flex items-center gap-2 text-rose-700 font-bold">
                <span className="px-2 py-0.5 rounded bg-white border border-rose-400">
                  Orden de Entrega: {loadingZones.map((z) => z.stopSequenceNumber).reverse().join(' → ')}
                </span>
                <span className="text-zinc-500 font-normal font-sans">(Puertas &rarr; Fondo)</span>
              </div>
            </div>
          )}

        </div>

        {/* 2 Comparative Sequence Panels (Loading Sequence vs Delivery Sequence) */}
        {isMultiStop ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            
            {/* Panel 1: Secuencia de Carga */}
            <div className="p-3.5 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-2">
              <div className="flex items-center gap-1.5 text-zinc-900 font-black text-xs uppercase">
                <Layers className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>1. Secuencia de Carga en CEDIS</span>
              </div>
              <p className="text-[10px] text-zinc-500 leading-tight">
                Orden físico en que el equipo de andén debe ingresar las piezas al vehículo:
              </p>
              <div className="space-y-1.5 pt-1">
                {loadingZones.map((zone, idx) => (
                  <div key={zone.id} className="p-2 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-zinc-900 text-white font-black text-[10px] flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div>
                        <strong className="text-zinc-900 block">Cargar {zone.zoneCode} (Parada {zone.stopSequenceNumber})</strong>
                        <span className="text-[10px] text-zinc-500">{zone.destinationName}</span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-zinc-900">{zone.totalUnits} u.</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Panel 2: Descarga Esperada */}
            <div className="p-3.5 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-2">
              <div className="flex items-center gap-1.5 text-zinc-900 font-black text-xs uppercase">
                <PackageCheck className="w-3.5 h-3.5 text-theme-primary shrink-0" />
                <span>2. Descarga Esperada en Ruta</span>
              </div>
              <p className="text-[10px] text-zinc-500 leading-tight">
                Disponibilidad inmediata al abrir las puertas del camión en cada parada:
              </p>
              <div className="space-y-1.5 pt-1">
                {[...loadingZones].reverse().map((zone, idx) => (
                  <div key={zone.id} className="p-2 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-theme-primary text-white font-black text-[10px] flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div>
                        <strong className="text-zinc-900 block">Parada {zone.stopSequenceNumber}: {zone.destinationName}</strong>
                        <span className="text-[10px] text-zinc-500">{zone.zoneName} &bull; {zone.remisionFolio}</span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-emerald-700">{zone.totalUnits} u.</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-1 text-xs">
            <div className="flex items-center gap-2 text-zinc-900 font-black">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Carga Simple Consolidada</span>
            </div>
            <p className="text-[11px] text-zinc-600 leading-relaxed">
              La orden completa (<strong>{totalUnits} piezas</strong>) corresponde a un único destino (<strong>{loadingZones[0]?.destinationName}</strong>). Todo el volumen se descarga en un solo punto sin requerir segregación por zonas.
            </p>
          </div>
        )}

      </div>

    </div>
  );
};
