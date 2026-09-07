import React, { useState } from 'react';
import { 
 HourlyTrafficPoint, 
 DayHourHeatmapCell 
} from '../../../data/mockTrafficData';

interface HourlyActivityChartProps {
 data: HourlyTrafficPoint[];
}

export const HourlyActivityChart: React.FC<HourlyActivityChartProps> = ({ data }) => {
 const [hoveredPoint, setHoveredPoint] = useState<HourlyTrafficPoint | null>(null);

 const maxTotal = Math.max(...data.map((d) => d.total), 1);
 const chartHeight = 160;
 const chartWidth = 540;
 const paddingX = 35;
 const paddingY = 20;

 const pointsCount = data.length;
 const stepX = (chartWidth - paddingX * 2) / (pointsCount - 1);

 // Generate SVG path for a specific series
 const getSeriesPath = (key: 'inbound' | 'putaway' | 'picking' | 'outbound' | 'total') => {
 return data.map((d, idx) => {
 const x = paddingX + idx * stepX;
 const val = d[key];
 const y = chartHeight - paddingY - (val / maxTotal) * (chartHeight - paddingY * 2);
 return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
 }).join(' ');
 };

 const getSeriesArea = (key: 'total') => {
 const line = data.map((d, idx) => {
 const x = paddingX + idx * stepX;
 const val = d[key];
 const y = chartHeight - paddingY - (val / maxTotal) * (chartHeight - paddingY * 2);
 return `L ${x} ${y}`;
 }).join(' ');

 const firstX = paddingX;
 const lastX = paddingX + (pointsCount - 1) * stepX;
 const baselineY = chartHeight - paddingY;

 return `M ${firstX} ${baselineY} ${line} L ${lastX} ${baselineY} Z`;
 };

 return (
 <div className="space-y-3">
 
 {/* Legend */}
 <div className="flex items-center justify-between flex-wrap gap-2 text-[11px] font-bold">
 <div className="flex items-center gap-3 flex-wrap">
 <span className="flex items-center gap-1 text-theme-main">
 <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
 <span>Entradas</span>
 </span>
 <span className="flex items-center gap-1 text-theme-main">
 <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
 <span>Acomodo</span>
 </span>
 <span className="flex items-center gap-1 text-theme-main">
 <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
 <span>Recolección</span>
 </span>
 <span className="flex items-center gap-1 text-theme-main">
 <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
 <span>Salidas</span>
 </span>
 </div>

 <span className="text-[10px] text-theme-muted font-mono">
 Eje Y: Total de operaciones / hora
 </span>
 </div>

 {/* SVG Chart Container */}
 <div className="relative bg-theme-muted/20 border border-theme-subtle rounded-2xl p-2 overflow-hidden">
 <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-44 overflow-visible">
 <defs>
 <linearGradient id="totalAreaGrad" x1="0" y1="0" x2="0" y2="1">
 <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
 <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
 </linearGradient>
 </defs>

 {/* Grid lines */}
 {[0.25, 0.5, 0.75, 1].map((ratio) => {
 const y = chartHeight - paddingY - ratio * (chartHeight - paddingY * 2);
 return (
 <line
 key={ratio}
 x1={paddingX}
 y1={y}
 x2={chartWidth - paddingX}
 y2={y}
 stroke="currentColor"
 className="text-theme-subtle"
 strokeDasharray="3 3"
 strokeWidth="1"
 />
 );
 })}

 {/* Area under Total */}
 <path d={getSeriesArea('total')} fill="url(#totalAreaGrad)" />

 {/* Series Lines */}
 <path d={getSeriesPath('total')} fill="none" stroke="#e11d48" strokeWidth="2.5" strokeDasharray="4 2" />
 <path d={getSeriesPath('inbound')} fill="none" stroke="#ef4444" strokeWidth="2" />
 <path d={getSeriesPath('putaway')} fill="none" stroke="#3b82f6" strokeWidth="2" />
 <path d={getSeriesPath('picking')} fill="none" stroke="#a855f7" strokeWidth="2" />
 <path d={getSeriesPath('outbound')} fill="none" stroke="#f59e0b" strokeWidth="2" />

 {/* Data Points and Interaction Circles */}
 {data.map((d, idx) => {
 const x = paddingX + idx * stepX;
 const yTotal = chartHeight - paddingY - (d.total / maxTotal) * (chartHeight - paddingY * 2);
 const isHovered = hoveredPoint?.hour === d.hour;

 return (
 <g key={d.hour}>
 {/* Time Label on bottom */}
 <text
 x={x}
 y={chartHeight - 4}
 textAnchor="middle"
 className={`text-[9px] font-mono font-bold ${
 isHovered ? 'fill-rose-600 font-black' : 'fill-theme-muted'
 }`}
 >
 {d.hour}
 </text>

 {/* Visible dot on total */}
 <circle
 cx={x}
 cy={yTotal}
 r={isHovered ? 5 : 3.5}
 className="fill-rose-600 stroke-white stroke-2 transition-all cursor-pointer"
 />

 {/* Transparent wider hit zone */}
 <rect
 x={x - stepX / 2}
 y={0}
 width={stepX}
 height={chartHeight}
 fill="transparent"
 className="cursor-pointer"
 onMouseEnter={() => setHoveredPoint(d)}
 onMouseLeave={() => setHoveredPoint(null)}
 />
 </g>
 );
 })}
 </svg>

 {/* Hover Tooltip Overlay */}
 {hoveredPoint && (
 <div className="absolute top-2 right-2 bg-theme-surface/95 backdrop-blur-xs border border-theme-subtle p-3 rounded-2xl shadow-xl text-xs space-y-1 font-mono animate-in fade-in duration-100 z-10">
 <div className="flex items-center justify-between gap-4 border-b border-theme-subtle pb-1">
 <strong className="text-rose-600 font-black">{hoveredPoint.hour} hrs</strong>
 <span className="text-[10px] text-theme-muted">Total: {hoveredPoint.total} movs</span>
 </div>
 <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[10px]">
 <span className="text-rose-600 font-semibold">Entradas: <b>{hoveredPoint.inbound}</b></span>
 <span className="text-blue-600 font-semibold">Acomodos: <b>{hoveredPoint.putaway}</b></span>
 <span className="text-purple-600 font-semibold">Recolección: <b>{hoveredPoint.picking}</b></span>
 <span className="text-amber-600 font-semibold">Salidas: <b>{hoveredPoint.outbound}</b></span>
 </div>
 </div>
 )}
 </div>
 </div>
 );
};

export const OperationalFunnel: React.FC<{
 volumes: { inbound: number; putaway: number; picking: number; outbound: number };
}> = ({ volumes }) => {
 const conv1 = Math.round((volumes.putaway / volumes.inbound) * 100) || 83;
 const conv2 = Math.round((volumes.picking / volumes.putaway) * 100) || 89;
 const conv3 = Math.round((volumes.outbound / volumes.picking) * 100) || 77;

 return (
 <div className="space-y-3">
 <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
 <div className="p-3 rounded-2xl bg-white border border-rose-500 shadow-2xs space-y-1">
 <span className="text-[9px] uppercase font-bold text-zinc-600 dark:text-zinc-400 block">1. Recibidas</span>
 <strong className="text-lg font-black text-zinc-900 block">{volumes.inbound}</strong>
 <span className="text-[9px] text-theme-muted font-sans">100% base</span>
 </div>

 <div className="p-3 rounded-2xl bg-white border border-blue-500 shadow-2xs space-y-1">
 <span className="text-[9px] uppercase font-bold text-zinc-600 dark:text-zinc-400 block">2. Acomodadas</span>
 <strong className="text-lg font-black text-zinc-900 block">{volumes.putaway}</strong>
 <span className="text-[9px] text-blue-600 font-bold">{conv1}% flujo</span>
 </div>

 <div className="p-3 rounded-2xl bg-white border border-purple-500 shadow-2xs space-y-1">
 <span className="text-[9px] uppercase font-bold text-zinc-600 dark:text-zinc-400 block">3. Recolectadas</span>
 <strong className="text-lg font-black text-zinc-900 block">{volumes.picking}</strong>
 <span className="text-[9px] text-purple-600 font-bold">{conv2}% flujo</span>
 </div>

 <div className="p-3 rounded-2xl bg-white border border-amber-500 shadow-2xs space-y-1">
 <span className="text-[9px] uppercase font-bold text-zinc-600 dark:text-zinc-400 block">4. Validadas</span>
 <strong className="text-lg font-black text-zinc-900 block">{volumes.outbound}</strong>
 <span className="text-[9px] text-amber-600 font-bold">{conv3}% flujo</span>
 </div>
 </div>

 <p className="text-[10px] text-theme-muted leading-tight font-sans">
 El porcentaje refleja actividad procesada dentro del periodo seleccionado, no necesariamente las mismas unidades.
 </p>
 </div>
 );
};

export const StageAvgDurationBars: React.FC<{
 minutes: { inbound: number; putaway: number; picking: number; outbound: number };
}> = ({ minutes }) => {
 const maxMins = 35;

 const stages = [
 { label: 'Entrada', mins: minutes.inbound, color: 'bg-rose-500' },
 { label: 'Acomodo', mins: minutes.putaway, color: 'bg-blue-500' },
 { label: 'Recolección', mins: minutes.picking, color: 'bg-purple-500' },
 { label: 'Verificación', mins: minutes.outbound, color: 'bg-amber-500' },
 ];

 return (
 <div className="space-y-2.5 text-xs">
 {stages.map((st) => {
 const percent = Math.min(100, Math.round((st.mins / maxMins) * 100));
 return (
 <div key={st.label} className="space-y-1">
 <div className="flex items-center justify-between text-[11px]">
 <span className="font-semibold text-theme-main">{st.label}</span>
 <strong className="font-mono text-theme-main">{st.mins} min</strong>
 </div>
 <div className="w-full bg-theme-muted/50 h-2 rounded-full overflow-hidden">
 <div
 className={`h-full rounded-full transition-all duration-300 ${st.color}`}
 style={{ width: `${percent}%` }}
 />
 </div>
 </div>
 );
 })}
 </div>
 );
};

export const DayHourMatrixHeatmap: React.FC<{
 data: DayHourHeatmapCell[];
}> = ({ data }) => {
 const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
 const hours = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];

 const getCell = (d: string, h: string) => {
 return data.find((c) => c.day === d && c.hour === h) || { intensity: 0, count: 0 };
 };

 const getHeatClass = (intensity: number) => {
 switch (intensity) {
 case 4: return 'bg-rose-600 text-white';
 case 3: return 'bg-amber-500 text-zinc-950 font-bold';
 case 2: return 'bg-yellow-400 text-zinc-950 font-bold';
 case 1: return 'bg-emerald-400 text-zinc-950 font-bold';
 default: return 'bg-theme-muted/30 text-theme-muted opacity-40';
 }
 };

 return (
 <div className="overflow-x-auto space-y-2">
 <div className="inline-block min-w-full text-xs font-mono">
 {/* Header Hours */}
 <div className="grid grid-cols-8 gap-1 text-center text-[10px] font-bold text-theme-muted mb-1">
 <div className="text-left font-sans">Día</div>
 {hours.map((h) => (
 <div key={h}>{h}</div>
 ))}
 </div>

 {/* Days Rows */}
 <div className="space-y-1">
 {days.map((day) => (
 <div key={day} className="grid grid-cols-8 gap-1 items-center">
 <div className="font-bold text-theme-main text-left text-[11px] font-sans">
 {day}
 </div>
 {hours.map((h) => {
 const cell = getCell(day, h);
 return (
 <div
 key={h}
 className={`h-7 rounded-lg flex items-center justify-center text-[10px] transition-all hover:scale-105 cursor-pointer shadow-2xs ${getHeatClass(cell.intensity)}`}
 title={`${day} ${h} hrs · ${cell.count} operaciones`}
 >
 {cell.count > 0 ? cell.count : '—'}
 </div>
 );
 })}
 </div>
 ))}
 </div>
 </div>
 </div>
 );
};
