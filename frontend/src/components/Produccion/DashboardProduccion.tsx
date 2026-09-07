import React from 'react';
import { AlertTriangle, Factory, Gauge, PackageCheck } from 'lucide-react';
import { PRODUCTION_MACHINES, ProductionOrder } from '../../data/mockProduccionData';
import { ProductionCard, ProgressBar } from './productionUi';

interface Props { orders: ProductionOrder[]; onOpenOrder: (order: ProductionOrder) => void; }
export const DashboardProduccion: React.FC<Props> = ({ orders, onOpenOrder }) => {
  const active = orders.filter(order => !['Terminada', 'Liberada'].includes(order.status));
  const areas = ['Offset', 'Flexografía', 'Acabados'] as const;
  const attention = orders.filter(order => order.materialAlert || order.status === 'Detenida').slice(0, 5);
  const kpis = [
    ['OP activas', active.length, 'Planeadas y en ejecución'], ['En proceso', orders.filter(order => order.status === 'En proceso').length, 'Piso activo'],
    ['Detenidas', orders.filter(order => order.status === 'Detenida').length, 'Requieren acción'], ['Cumplimiento', '92.4%', 'Plan semanal'],
    ['Material en riesgo', orders.filter(order => order.materialAlert).length, 'Reservas por revisar'],
  ];
  return <div className="space-y-4">
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">{kpis.map(([label, value, note]) => <ProductionCard key={label}><div className="p-4"><p className="text-[10px] font-bold uppercase text-theme-muted">{label}</p><b className="mt-2 block font-mono text-xl text-theme-main">{value}</b><small className="text-theme-muted">{note}</small></div></ProductionCard>)}</div>
    <div className="grid gap-4 xl:grid-cols-2">
      <ProductionCard><div className="p-5"><div className="flex items-center gap-2"><Gauge className="h-4 w-4 text-theme-primary" /><b>Carga de planta</b></div><p className="mt-1 text-xs text-theme-muted">Capacidad semanal consumida por área.</p>{areas.map(area => { const machines = PRODUCTION_MACHINES.filter(machine => machine.area === area); const load = Math.round(machines.reduce((sum, machine) => sum + machine.load, 0) / machines.length); return <div className="mt-5" key={area}><div className="flex justify-between text-xs"><b>{area}</b><b>{load}%</b></div><div className="mt-2"><ProgressBar value={load} tone={load > 90 ? 'bg-rose-500' : load > 80 ? 'bg-amber-500' : 'bg-theme-primary'} /></div></div>; })}</div></ProductionCard>
      <ProductionCard><div className="border-b border-theme-subtle p-5"><div className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-amber-600" /><b>Atención requerida</b></div><p className="mt-1 text-xs text-theme-muted">Órdenes con material o ejecución detenida.</p></div>{attention.map(order => <button onClick={() => onOpenOrder(order)} key={order.id} className="flex w-full justify-between border-b border-theme-subtle p-4 text-left text-xs transition-colors hover:bg-theme-muted/30"><span><b>{order.folio} · {order.cliente}</b><small className="block text-theme-muted">{order.materialAlert ? 'Material insuficiente' : `Detenida ${order.stopMinutes} min`} · {order.machine}</small></span><AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" /></button>)}</ProductionCard>
    </div>
    <ProductionCard><div className="flex items-center gap-2 border-b border-theme-subtle p-5"><Factory className="h-4 w-4 text-theme-primary" /><div><b>Órdenes activas</b><p className="mt-1 text-xs text-theme-muted">Vista operativa de pedido → OP → ejecución.</p></div></div><div className="divide-y divide-theme-subtle">{active.slice(0, 6).map(order => <button key={order.id} onClick={() => onOpenOrder(order)} className="grid w-full grid-cols-[1.1fr_.8fr_1fr] gap-3 p-4 text-left text-xs hover:bg-theme-muted/30 sm:grid-cols-[1fr_1fr_1fr_1fr]"><span><b>{order.folio}</b><small className="block text-theme-muted">{order.cliente}</small></span><span className="hidden sm:block">{order.machine}</span><span><ProgressBar value={order.progress} /><small className="mt-1 block text-theme-muted">{order.progress}% · {order.good.toLocaleString('es-MX')} buenas</small></span><span className="text-right font-bold text-theme-primary"><PackageCheck className="mr-1 inline h-3.5 w-3.5" />Abrir</span></button>)}</div></ProductionCard>
  </div>;
};
