import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Navigation, 
  Clock, 
  Truck, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Info,
  CheckCircle2,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { RouteStop, RouteAlternative, RouteStrategyType } from '../../data/mockShippingData';

interface ShippingRouteInteractiveMapProps {
  origin: { x: number; y: number; name: string };
  stops: RouteStop[];
  activeAlternative: RouteAlternative;
  selectedStopId?: string;
  onSelectStop?: (stopId: string) => void;
  className?: string;
}

export const ShippingRouteInteractiveMap: React.FC<ShippingRouteInteractiveMapProps> = ({
  origin,
  stops,
  activeAlternative,
  selectedStopId,
  onSelectStop,
  className = '',
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [hoveredStop, setHoveredStop] = useState<RouteStop | null>(null);

  // Generate SVG path through origin and all ordered stops
  const generateRoutePath = (): string => {
    if (!stops || stops.length === 0) return '';
    
    let path = `M ${origin.x} ${origin.y}`;
    
    // Add smooth bezier curves between waypoints
    let prevX = origin.x;
    let prevY = origin.y;
    
    stops.forEach((stop) => {
      const midX = (prevX + stop.coordinates.x) / 2;
      const midY = (prevY + stop.coordinates.y) / 2;
      // Slight curve offset
      const curveOffsetX = (stop.coordinates.y - prevY) * 0.15;
      const curveOffsetY = (prevX - stop.coordinates.x) * 0.15;
      
      path += ` Q ${midX + curveOffsetX} ${midY + curveOffsetY}, ${stop.coordinates.x} ${stop.coordinates.y}`;
      prevX = stop.coordinates.x;
      prevY = stop.coordinates.y;
    });

    return path;
  };

  const routeD = generateRoutePath();

  return (
    <div className={`relative bg-slate-900 text-white rounded-3xl overflow-hidden border border-zinc-800 shadow-xl select-none flex flex-col ${className}`}>
      
      {/* Map Top Floating Header / HUD */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pointer-events-none">
        
        {/* Left Badge: Strategy & Trajectory */}
        <div className="bg-zinc-950/85 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-zinc-700/80 shadow-lg pointer-events-auto flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-theme-primary-light text-theme-primary flex items-center justify-center border border-theme-primary/30 shrink-0">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-white uppercase tracking-wider">
                {activeAlternative.title}
              </span>
              <span className="px-2 py-0.2 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Tráfico dinámico
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 font-mono">
              {stops.length === 1 ? 'Trayecto directo punto a punto' : `${stops.length} paradas en secuencia óptima`}
            </p>
          </div>
        </div>

        {/* Right Floating KPI Box */}
        <div className="bg-zinc-950/85 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-zinc-700/80 shadow-lg pointer-events-auto flex items-center gap-4 text-xs font-mono">
          <div className="text-right">
            <span className="text-[9px] text-zinc-400 uppercase block font-sans font-bold">Distancia Total</span>
            <strong className="text-white text-sm font-black">{activeAlternative.distanceKm} km</strong>
          </div>
          <div className="h-7 w-px bg-zinc-700" />
          <div className="text-right">
            <span className="text-[9px] text-zinc-400 uppercase block font-sans font-bold">Tiempo Estimado</span>
            <strong className="text-emerald-400 text-sm font-black">
              {Math.floor(activeAlternative.estimatedTimeMinutes / 60) > 0 
                ? `${Math.floor(activeAlternative.estimatedTimeMinutes / 60)} h ${activeAlternative.estimatedTimeMinutes % 60} min` 
                : `${activeAlternative.estimatedTimeMinutes} min`}
            </strong>
          </div>
          <div className="h-7 w-px bg-zinc-700" />
          <div className="text-right">
            <span className="text-[9px] text-zinc-400 uppercase block font-sans font-bold">En Tráfico</span>
            <span className="text-amber-400 font-bold">{activeAlternative.trafficDelayMinutes} min</span>
          </div>
        </div>

      </div>

      {/* Map Interactive Canvas (SVG Viewport) */}
      <div className="relative w-full h-[380px] sm:h-[430px] overflow-hidden bg-[#0f172a] flex items-center justify-center">
        
        <svg
          viewBox="0 0 800 460"
          className="w-full h-full object-cover transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <defs>
            {/* Background Grid Pattern */}
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.8" />
            </pattern>

            {/* Glowing route filters */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Pulsing radar circle animation */}
            <radialGradient id="radar-pulse" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#e11d48" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#e11d48" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Grid Layer */}
          <rect width="800" height="460" fill="#0f172a" />
          <rect width="800" height="460" fill="url(#grid-pattern)" />

          {/* Geographical Terrain / Mountains Silhouette (Sierra Madre & Cerro de la Silla) */}
          <path
            d="M 600,460 L 640,320 L 680,260 L 710,300 L 740,240 L 780,360 L 800,460 Z"
            fill="#1e293b"
            opacity="0.4"
          />
          <text x="680" y="310" fill="#475569" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
            Cerro de la Silla
          </text>

          <path
            d="M 0,460 L 120,400 L 220,380 L 320,410 L 480,440 L 520,460 Z"
            fill="#1e293b"
            opacity="0.4"
          />
          <text x="180" y="420" fill="#475569" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
            Sierra Madre Oriental / Chipinque
          </text>

          {/* Santa Catarina River Line */}
          <path
            d="M 0,330 Q 180,320 320,310 T 520,290 T 800,280"
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="3"
            strokeOpacity="0.25"
          />
          <text x="360" y="300" fill="#0284c7" fontSize="8" fontWeight="bold" opacity="0.6" fontFamily="sans-serif">
            Río Santa Catarina
          </text>

          {/* Major Metropolitan Arteries / Road Network */}
          {/* Av. Industrial del Norte / Libramiento Reynosa */}
          <path d="M 260,70 L 280,180 L 320,280 L 330,340" fill="none" stroke="#334155" strokeWidth="4" />
          <path d="M 260,70 L 280,180 L 320,280 L 330,340" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="6,3" />

          {/* Carretera Matamoros - Reynosa */}
          <path d="M 80,325 L 300,315 L 500,295 L 750,280" fill="none" stroke="#334155" strokeWidth="5" />
          <path d="M 80,325 L 300,315 L 500,295 L 750,280" fill="none" stroke="#eab308" strokeWidth="2" strokeDasharray="10,4" />

          {/* Av. Industrias (Parque Industrial) */}
          <path d="M 310,340 L 440,340 L 520,350 L 620,320" fill="none" stroke="#334155" strokeWidth="4" />
          <path d="M 310,340 L 440,340 L 520,350 L 620,320" fill="none" stroke="#22c55e" strokeWidth="1.5" />

          {/* Av. Maquiladoras (Parque del Norte) */}
          <path d="M 120,180 L 220,195 L 280,210" fill="none" stroke="#334155" strokeWidth="4" />
          <path d="M 120,180 L 220,195 L 280,210" fill="none" stroke="#22c55e" strokeWidth="1.5" />

          {/* Carretera Ribereña / Puente Internacional Pharr */}
          <path d="M 430,280 L 500,340 L 580,410 L 660,460" fill="none" stroke="#334155" strokeWidth="5" />
          <path d="M 430,280 L 500,340 L 580,410 L 660,460" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="12,5" />

          {/* Libramiento Sur II */}
          <path d="M 180,60 L 260,70 L 420,90 L 600,100" fill="none" stroke="#334155" strokeWidth="4" />

          {/* Zone Watermark Labels */}
          <text x="240" y="50" fill="#64748b" fontSize="10" fontWeight="bold" fontFamily="sans-serif">Parque Industrial Maquilpark</text>
          <text x="140" y="170" fill="#64748b" fontSize="10" fontWeight="bold" fontFamily="sans-serif">Parque del Norte</text>
          <text x="400" y="240" fill="#64748b" fontSize="10" fontWeight="bold" fontFamily="sans-serif">Reynosa Centro</text>
          <text x="310" y="295" fill="#64748b" fontSize="10" fontWeight="bold" fontFamily="sans-serif">Parque Industrial Reynosa</text>
          <text x="430" y="375" fill="#64748b" fontSize="10" fontWeight="bold" fontFamily="sans-serif">Parque Industrial</text>
          <text x="560" y="390" fill="#64748b" fontSize="10" fontWeight="bold" fontFamily="sans-serif">Parque Industrial Villa Florida</text>

          {/* ACTIVE DISPATCH TRAJECTORY PATH */}
          {routeD && (
            <>
              {/* Outer Glow Outline */}
              <path
                d={routeD}
                fill="none"
                stroke="#e11d48"
                strokeWidth="7"
                strokeOpacity="0.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow)"
              />
              {/* Core Route Line */}
              <path
                d={routeD}
                fill="none"
                stroke="#ffffff"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Animated Dashed Flow Line */}
              <path
                d={routeD}
                fill="none"
                stroke="#e11d48"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="8,6"
                className="animate-[dash_1.5s_linear_infinite]"
              />
            </>
          )}

          {/* ORIGIN WAREHOUSE MARKER PIN */}
          <g transform={`translate(${origin.x}, ${origin.y})`} className="cursor-pointer">
            {/* Pulsing ring */}
            <circle r="22" fill="url(#radar-pulse)" className="animate-ping opacity-60" />
            <circle r="14" fill="#09090b" stroke="#e11d48" strokeWidth="2.5" />
            <circle r="5" fill="#ffffff" />
            
            {/* Origin Label Tag */}
            <g transform="translate(0, -22)">
              <rect x="-65" y="-14" width="130" height="18" rx="9" fill="#09090b" stroke="#e11d48" strokeWidth="1.5" />
              <text x="0" y="-2" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                ORIGEN · {origin.name.includes('Norte') ? 'CEDIS Norte' : 'CEDIS Sur'}
              </text>
            </g>
          </g>

          {/* DESTINATION STOPS MARKER PINS */}
          {stops.map((stop, index) => {
            const isSelected = selectedStopId === stop.id;
            const isHovered = hoveredStop?.id === stop.id;

            return (
              <g
                key={stop.id}
                transform={`translate(${stop.coordinates.x}, ${stop.coordinates.y})`}
                className="cursor-pointer transition-transform duration-200"
                onClick={() => onSelectStop && onSelectStop(stop.id)}
                onMouseEnter={() => setHoveredStop(stop)}
                onMouseLeave={() => setHoveredStop(null)}
              >
                {/* Selection Halo */}
                {(isSelected || isHovered) && (
                  <circle r="24" fill="#38bdf8" fillOpacity="0.3" className="animate-pulse" />
                )}

                {/* Pin Shadow */}
                <ellipse cx="0" cy="14" rx="8" ry="3" fill="#000000" opacity="0.5" />

                {/* Marker Body Pin */}
                <path
                  d="M 0,0 C -12,-12 -12,-26 0,-26 C 12,-26 12,-12 0,0 Z"
                  fill={isSelected ? '#e11d48' : '#ffffff'}
                  stroke={isSelected ? '#ffffff' : '#0f172a'}
                  strokeWidth="2"
                  filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))"
                />

                {/* Sequence Number in Pin */}
                <text
                  x="0"
                  y="-14"
                  fill={isSelected ? '#ffffff' : '#09090b'}
                  fontSize="11"
                  fontWeight="900"
                  textAnchor="middle"
                  fontFamily="sans-serif"
                >
                  {index + 1}
                </text>

                {/* Floating Destination Tag Pill */}
                <g transform="translate(0, 18)">
                  <rect
                    x="-65"
                    y="0"
                    width="130"
                    height="18"
                    rx="6"
                    fill={isSelected ? '#e11d48' : '#09090b'}
                    stroke={isSelected ? '#ffffff' : '#334155'}
                    strokeWidth="1"
                    opacity="0.95"
                  />
                  <text
                    x="0"
                    y="12"
                    fill="#ffffff"
                    fontSize="9"
                    fontWeight="bold"
                    textAnchor="middle"
                    fontFamily="sans-serif"
                  >
                    {stop.destinationName.length > 20 ? stop.destinationName.substring(0, 18) + '…' : stop.destinationName}
                  </text>
                </g>

                {/* Delivery Units Indicator Tag */}
                <g transform="translate(18, -26)">
                  <rect x="0" y="0" width="28" height="14" rx="4" fill="#22c55e" stroke="#ffffff" strokeWidth="1" />
                  <text x="14" y="10" fill="#09090b" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                    {stop.totalUnits} u
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* Hover / Selected Stop Tooltip Popup Overlay */}
        {(hoveredStop || (selectedStopId && stops.find(s => s.id === selectedStopId))) && (
          <div className="absolute bottom-12 left-4 z-30 bg-zinc-950/90 backdrop-blur-md p-3.5 rounded-2xl border border-zinc-700 shadow-2xl text-xs space-y-1 max-w-xs animate-in fade-in zoom-in-95 pointer-events-none">
            {(() => {
              const current = hoveredStop || stops.find(s => s.id === selectedStopId)!;
              return (
                <>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-theme-primary font-bold">
                      Parada #{current.sequenceNumber}
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {current.timeWindow}
                    </span>
                  </div>
                  <strong className="text-white block text-xs">{current.destinationName}</strong>
                  <p className="text-[10px] text-zinc-400">{current.address}</p>
                  <div className="flex items-center justify-between pt-1 border-t border-zinc-800 text-[10px] font-mono text-zinc-300">
                    <span>Remisión: {current.remisionFolio}</span>
                    <span className="text-emerald-400 font-bold">{current.totalUnits} piezas</span>
                  </div>
                </>
              );
            })()}
          </div>
        )}

      </div>

      {/* Map Bottom Footer / Legend / Controls */}
      <div className="p-3 bg-zinc-950 border-t border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-zinc-400">
        
        {/* Map Legend */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-theme-primary border border-white" />
            <span className="text-zinc-300 font-medium">CEDIS Origen</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-white border border-zinc-900" />
            <span className="text-zinc-300 font-medium">Paradas de Entrega</span>
          </div>

          <div className="flex items-center gap-2 border-l border-zinc-800 pl-3">
            <span className="text-zinc-500 text-[10px]">Tráfico:</span>
            <span className="flex items-center gap-1 text-[10px] text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Fluido
            </span>
            <span className="flex items-center gap-1 text-[10px] text-amber-400">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Moderado
            </span>
            <span className="flex items-center gap-1 text-[10px] text-rose-400">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Congestión
            </span>
          </div>
        </div>

        {/* Zoom & Reset Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setZoomLevel((prev) => Math.min(prev + 0.2, 1.8))}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 transition-colors cursor-pointer"
            title="Acercar mapa"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel((prev) => Math.max(prev - 0.2, 0.8))}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 transition-colors cursor-pointer"
            title="Alejar mapa"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel(1)}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 transition-colors cursor-pointer"
            title="Restablecer vista"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Discrete Simulation Notice */}
      <div className="px-4 py-1.5 bg-zinc-950/95 border-t border-zinc-900 text-center text-[9px] text-zinc-500 font-mono">
        Datos cartográficos y de tráfico simulados para fines de demostración &bull; Referencia de tráfico tipo Google Maps
      </div>

    </div>
  );
};
