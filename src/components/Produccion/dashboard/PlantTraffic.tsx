import React, { useState } from 'react';
import {
  ArrowRight,
  Layers,
  AlertTriangle,
  AlertOctagon,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';
import {
  PLANT_TRAFFIC_NODES_V8,
  TrafficNodeDetail,
} from '../../../data/mockProductionDashboardV8';
import { PlantTrafficDetailModal } from './PlantTrafficDetailModal';

interface Props {
  onNavigateToPlanning: (opFolio?: string) => void;
  onOpenOrder: (folio: string) => void;
}

export const PlantTraffic: React.FC<Props> = ({
  onNavigateToPlanning,
  onOpenOrder,
}) => {
  const [selectedNode, setSelectedNode] = useState<TrafficNodeDetail | null>(null);

  const offsetNodes = [
    { key: 'offset-impresion', label: '1. Impresión Offset', count: '4 OP', sub: 'Heidelberg · 78%', alert: false },
    { key: 'offset-corte', label: '2. Guillotina / Corte', count: '3 OP', sub: 'Polar 115 · 55%', alert: false },
    { key: 'offset-doblado', label: '3. Doblado', count: '5 OP', sub: 'Stahl 2 · +17m', alert: true, alertText: '⚠ Cola' },
    { key: 'offset-intercalado', label: '4. Intercalado', count: '2 OP', sub: 'Alzadora · 40%', alert: false },
    { key: 'offset-grapado', label: '5. Grapado al lomo', count: '3 OP', sub: 'Muller · 30%', alert: false },
    { key: 'offset-empaque', label: '6. Empaque & PT', count: '2 OP', sub: 'Mesa final · 90%', alert: false },
  ];

  const flexoNodes = [
    {
      key: 'flexo-prensa',
      label: '1. Prensa Flexo (En Línea)',
      count: '5 OP',
      sub: 'Impresión · Barniz · Troquel',
      detailSub: 'Mark Andy 830 · 🔴 Paro 47m',
      alert: true,
      alertText: '🔴 Detenida',
    },
    {
      key: 'flexo-rebobinado',
      label: '2. Rebobinado / Inspección',
      count: '3 OP',
      sub: 'Rotoflex I / BGM 2',
      detailSub: 'Conteo y banderas · 60%',
      alert: false,
    },
    {
      key: 'flexo-empaque',
      label: '3. Empaque de Rollos',
      count: '2 OP',
      sub: 'Etiqueta Zebra & Caja',
      detailSub: 'Rollos flejados · 85%',
      alert: false,
    },
  ];

  const handleNodeClick = (nodeKey: string) => {
    const detail = PLANT_TRAFFIC_NODES_V8[nodeKey];
    if (detail) setSelectedNode(detail);
  };

  return (
    <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-5 shadow-2xs space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-theme-subtle pb-3">
        <div className="flex items-center gap-2.5">
          <div className="rounded-xl bg-theme-primary/10 p-2 text-theme-primary">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-black text-theme-main">
              Tráfico de Planta (WIP en Curso & Colas por Etapa)
            </h2>
            <p className="text-xs text-theme-muted">
              Visualización interactiva del flujo secuencial de planta. Haz clic en cualquier estación para auditar cola y tiempos.
            </p>
          </div>
        </div>
        <span className="rounded-full bg-theme-muted/10 border border-theme-subtle px-3 py-1 text-[11px] font-mono text-theme-muted">
          Drill-down operativo activo
        </span>
      </div>

      {/* 1. FLUJO OFFSET (Secuencial completo) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-theme-main flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-blue-500"></span>
            Ruta Técnica Offset (6 Estaciones Secuenciales)
          </span>
          <span className="text-[10px] text-theme-muted font-mono">
            Manuales, folletos, revistas y pliegos comerciales
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
          {offsetNodes.map((node, idx) => (
            <button
              key={node.key}
              type="button"
              onClick={() => handleNodeClick(node.key)}
              className={`group relative rounded-2xl border p-3 text-left transition-all hover:scale-[1.02] hover:shadow-md ${
                node.alert
                  ? 'border-amber-400/80 bg-amber-50/50 dark:bg-amber-950/20'
                  : 'border-theme-subtle bg-theme-surface hover:border-theme-primary/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[11px] text-theme-main truncate block">
                  {node.label}
                </span>
                {node.alert && (
                  <span className="rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 px-1.5 py-0.2 text-[9px] font-black shrink-0">
                    {node.alertText}
                  </span>
                )}
              </div>

              <div className="mt-2 flex items-baseline justify-between">
                <span className="font-mono text-base font-black text-theme-primary">
                  {node.count}
                </span>
                {idx < offsetNodes.length - 1 && (
                  <ArrowRight className="hidden xl:block h-3.5 w-3.5 text-theme-muted group-hover:text-theme-primary transition-colors" />
                )}
              </div>

              <small className="mt-1 block text-[10px] text-theme-muted truncate font-mono">
                {node.sub}
              </small>
            </button>
          ))}
        </div>
      </div>

      {/* 2. FLUJO FLEXOGRAFÍA (Prensa inline + Rebobinado + Empaque) */}
      <div className="space-y-2 pt-2 border-t border-theme-subtle">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-theme-main flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            Ruta Técnica Flexografía (Proceso en Línea + Acabado)
          </span>
          <span className="text-[10px] text-theme-muted font-mono">
            Etiquetas autoadheribles, poliéster, BOPP y sustratos sensibles
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {flexoNodes.map((node, idx) => (
            <button
              key={node.key}
              type="button"
              onClick={() => handleNodeClick(node.key)}
              className={`group relative rounded-2xl border p-3.5 text-left transition-all hover:scale-[1.02] hover:shadow-md ${
                node.alert
                  ? 'border-rose-400/80 bg-rose-50/40 dark:bg-rose-950/20'
                  : 'border-theme-subtle bg-theme-surface hover:border-theme-primary/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-theme-main">
                  {node.label}
                </span>
                {node.alert && (
                  <span className="rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 px-2 py-0.5 text-[9px] font-black shrink-0 flex items-center gap-1">
                    <AlertOctagon className="h-3 w-3" />
                    {node.alertText}
                  </span>
                )}
              </div>

              <div className="mt-2 flex items-baseline justify-between">
                <span className="font-mono text-xl font-black text-theme-primary">
                  {node.count}
                </span>
                {idx < flexoNodes.length - 1 && (
                  <ArrowRight className="hidden md:block h-4 w-4 text-theme-muted group-hover:text-theme-primary transition-colors" />
                )}
              </div>

              <p className="mt-1 text-[11px] text-theme-muted">
                {node.sub}
              </p>
              <small className="block text-[10px] font-mono text-theme-muted pt-1">
                {node.detailSub}
              </small>
            </button>
          ))}
        </div>
      </div>

      {/* Modal de Detalle al hacer click */}
      {selectedNode && (
        <PlantTrafficDetailModal
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          onNavigateToPlanning={onNavigateToPlanning}
          onOpenOrder={onOpenOrder}
        />
      )}
    </div>
  );
};
