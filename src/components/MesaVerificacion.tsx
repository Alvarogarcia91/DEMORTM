import React, { useState, useEffect } from 'react';
import { 
 ArrowDownLeft, 
 ArrowRightLeft, 
 PackageSearch, 
 ArrowUpRight, 
 LayoutDashboard, 
 Activity, 
 QrCode, 
 AlertTriangle, 
 ArrowRight, 
 ShieldCheck, 
 CheckCircle2, 
 Clock, 
 Sparkles, 
 RotateCcw,
 Building2
} from 'lucide-react';
import { InboundReceiptsTab } from './MesaVerificacion/Inbound/InboundReceiptsTab';
import { PutawayTab } from './MesaVerificacion/Putaway/PutawayTab';
import { PickTab } from './MesaVerificacion/Picking/PickTab';
import { OutboundVerificationTab } from './MesaVerificacion/Outbound/OutboundVerificationTab';
import { IncidentsTab } from './MesaVerificacion/Incidents/IncidentsTab';
import { ReprintDeskTab } from './MesaVerificacion/Reprint/ReprintDeskTab';
import { OperationalSummaryTab } from './MesaVerificacion/Summary/OperationalSummaryTab';
import { WarehouseTrafficTab } from './MesaVerificacion/Traffic/WarehouseTrafficTab';
import { ReturnsTab } from './MesaVerificacion/Returns/ReturnsTab';
import { 
 VerificationDeskProvider, 
 useVerificationDeskCedis 
} from '../context/VerificationDeskContext';
import { PurchaseOrder } from '../data/mockPurchasesOrdersData';

export type VerificationDeskTabId = 
 | 'inbound' 
 | 'putaway' 
 | 'picking' 
 | 'outbound' 
 | 'summary' 
 | 'traffic' 
 | 'returns' 
 | 'reprint' 
 | 'incidents';

interface NavItemConfig {
 id: VerificationDeskTabId;
 label: string;
 icon: React.ComponentType<{ className?: string }>;
 isReady?: boolean;
}

interface NavGroupConfig {
 label: string;
 showFlow?: boolean;
 items: NavItemConfig[];
}

const DESK_NAV_GROUPS: NavGroupConfig[] = [
 {
 label: 'ENTRADAS',
 showFlow: true,
 items: [
 { id: 'inbound', label: 'Entradas', icon: ArrowDownLeft, isReady: true },
 { id: 'putaway', label: 'Acomodo', icon: ArrowRightLeft, isReady: true },
 ],
 },
 {
 label: 'SALIDAS',
 showFlow: true,
 items: [
 { id: 'picking', label: 'Recolección', icon: PackageSearch, isReady: true },
 { id: 'outbound', label: 'Verificación de Salida', icon: ArrowUpRight, isReady: true },
 ],
 },
 {
 label: 'CONTROL',
 showFlow: false,
 items: [
 { id: 'summary', label: 'Resumen', icon: LayoutDashboard, isReady: true },
 { id: 'traffic', label: 'Tráfico', icon: Activity, isReady: true },
 { id: 'returns', label: 'Devoluciones', icon: RotateCcw, isReady: true },
 { id: 'reprint', label: 'Reimpresión', icon: QrCode, isReady: true },
 { id: 'incidents', label: 'Incidencias', icon: AlertTriangle, isReady: true },
 ],
 },
];

interface MesaVerificacionProps {
 orders?: PurchaseOrder[];
 onUpdatePurchaseOrder?: (updated: PurchaseOrder) => void;
 initialInboundFolio?: string | null;
 onNavigateToPurchaseOrder?: (orderFolio: string) => void;
}

const MesaVerificacionInner: React.FC<MesaVerificacionProps> = ({
 orders = [],
 onUpdatePurchaseOrder,
 initialInboundFolio,
 onNavigateToPurchaseOrder,
}) => {
 const { 
 selectedFacilityId, 
 selectedFacility, 
 facilityOptions, 
 setSelectedFacilityId,
 isSucursal,
 isCedis 
 } = useVerificationDeskCedis();

 const [activeTab, setActiveTab] = useState<VerificationDeskTabId>(
 initialInboundFolio ? 'inbound' : 'summary'
 );
 const [reprintInitialUid, setReprintInitialUid] = useState<string | undefined>(undefined);
 const [reprintIncidentRef, setReprintIncidentRef] = useState<string | undefined>(undefined);

 useEffect(() => {
 if (initialInboundFolio) {
 setActiveTab('inbound');
 }
 }, [initialInboundFolio]);

 const handleNavigateToReprint = (uid?: string, ref?: string) => {
 setReprintInitialUid(uid);
 setReprintIncidentRef(ref);
 setActiveTab('reprint');
 };

 // Dynamic Navigation Groups depending on facility type
 const activeNavGroups: NavGroupConfig[] = isSucursal
 ? [
 {
 label: 'RECEPCIÓN & ACOMODO',
 showFlow: true,
 items: [
 { id: 'inbound', label: 'Traspasos por recibir', icon: ArrowDownLeft, isReady: true },
 { id: 'putaway', label: 'Acomodo en sucursal', icon: ArrowRightLeft, isReady: true },
 ],
 },
 {
 label: 'CONTROL SUCURSAL',
 showFlow: false,
 items: [
 { id: 'summary', label: 'Resumen', icon: LayoutDashboard, isReady: true },
 { id: 'reprint', label: 'Reimpresión', icon: QrCode, isReady: true },
 { id: 'incidents', label: 'Incidencias', icon: AlertTriangle, isReady: true },
 { id: 'returns', label: 'Devoluciones', icon: RotateCcw, isReady: true },
 ],
 },
 ]
 : DESK_NAV_GROUPS;

 return (
 <div className="space-y-6">
 
 {/* Page Header with Global Facility Selector */}
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
 <div>
 <div className="flex items-center gap-2">
 <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-600 border border-rose-500/20">
 Módulo Operativo
 </span>
 <span className="text-xs text-theme-muted font-mono">
 Operación de {isSucursal ? 'Sucursal' : 'CEDIS'} &middot; Mesa de Verificación
 </span>
 </div>
 <h1 className="text-xl font-extrabold text-theme-main tracking-tight mt-1">
 Mesa de Verificación
 </h1>
 <p className="text-xs text-theme-muted mt-0.5">
 {isSucursal
 ? 'Control de arribo de traspasos desde CEDIS, acomodo en piso de venta (showroom/reserva) e inventario físico.'
 : 'Control de flujo operativo, serialización de bultos, recepción de compras y validación de embarques.'}
 </p>
 </div>

 {/* Global Facility Selector */}
 <div className="flex items-center gap-2.5 bg-theme-surface p-2 rounded-2xl border border-theme-subtle shadow-xs self-start sm:self-auto">
 <div className="flex items-center gap-1.5 pl-1.5">
 <Building2 className="w-4 h-4 text-rose-600 shrink-0" />
 <span className="text-[10px] font-black uppercase tracking-wider text-theme-muted whitespace-nowrap">
 INSTALACIÓN OPERATIVA
 </span>
 </div>
 <select
 value={selectedFacilityId}
 onChange={(e) => setSelectedFacilityId(e.target.value)}
 className="bg-theme-muted hover:bg-theme-subtle text-theme-main font-extrabold text-xs px-3 py-1.5 rounded-xl border border-theme-subtle focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer transition-all"
 >
 <optgroup label="CEDIS">
 {facilityOptions
 .filter((opt) => opt.type === 'CEDIS')
 .map((opt) => (
 <option key={opt.id} value={opt.id}>
 {opt.name} ({opt.code})
 </option>
 ))}
 </optgroup>
 <optgroup label="SUCURSALES">
 {facilityOptions
 .filter((opt) => opt.type === 'SUCURSAL')
 .map((opt) => (
 <option key={opt.id} value={opt.id}>
 {opt.name} ({opt.code})
 </option>
 ))}
 </optgroup>
 </select>
 </div>
 </div>

 {/* Structured Navigation Groups (ADS ERP Style) */}
 <div className="p-3 bg-theme-surface border border-theme-subtle rounded-3xl shadow-xs space-y-3">
 <div className="flex flex-wrap items-center gap-4 lg:gap-6 divide-y lg:divide-y-0 lg:divide-x divide-theme-subtle">
 {activeNavGroups.map((group) => (
 <div key={group.label} className="flex items-center gap-2 pt-2 lg:pt-0 lg:first:pl-0 lg:pl-4 first:pt-0">
 <span className="text-[10px] font-extrabold uppercase tracking-widest text-theme-muted shrink-0 mr-1">
 {group.label}
 </span>

 <div className="flex items-center gap-1.5 flex-wrap">
 {group.items.map((item, idx) => {
 const Icon = item.icon;
 const isActive = activeTab === item.id;

 return (
 <React.Fragment key={item.id}>
 <button
 type="button"
 onClick={() => {
 if (item.id === 'reprint') {
 setReprintInitialUid(undefined);
 setReprintIncidentRef(undefined);
 }
 setActiveTab(item.id);
 }}
 className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
 isActive
 ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20 border border-rose-500'
 : 'bg-theme-muted/40 hover:bg-theme-muted text-theme-main border border-theme-subtle'
 }`}
 >
 <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-rose-600'}`} />
 <span>{item.label}</span>
 {!item.isReady && (
 <span className={`text-[8px] px-1.5 py-0.2 rounded font-mono uppercase ${
 isActive ? 'bg-white/20 text-white' : 'bg-theme-surface text-theme-muted'
 }`}>
 Próx
 </span>
 )}
 </button>

 {group.showFlow && idx < group.items.length - 1 && (
 <ArrowRight className="w-3.5 h-3.5 text-theme-muted shrink-0 opacity-60" />
 )}
 </React.Fragment>
 );
 })}
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Main Content Area */}
 {activeTab === 'summary' ? (
 <OperationalSummaryTab onNavigate={(tab) => setActiveTab(tab)} />
 ) : activeTab === 'traffic' ? (
 <WarehouseTrafficTab onNavigate={(tab) => setActiveTab(tab)} />
 ) : activeTab === 'returns' ? (
 <ReturnsTab
 onNavigateToPutaway={() => setActiveTab('putaway')}
 onNavigateToIncidents={(ref) => setActiveTab('incidents')}
 />
 ) : activeTab === 'inbound' ? (
 <InboundReceiptsTab
 orders={orders}
 onUpdatePurchaseOrder={onUpdatePurchaseOrder}
 initialSelectedFolio={initialInboundFolio}
 onNavigateToPurchaseOrder={onNavigateToPurchaseOrder}
 onNavigateToPutaway={() => setActiveTab('putaway')}
 />
 ) : activeTab === 'putaway' ? (
 <PutawayTab />
 ) : activeTab === 'picking' ? (
 <PickTab onNavigateToOutbound={() => setActiveTab('outbound')} />
 ) : activeTab === 'outbound' ? (
 <OutboundVerificationTab />
 ) : activeTab === 'reprint' ? (
 <ReprintDeskTab
 initialUid={reprintInitialUid}
 initialIncidentRef={reprintIncidentRef}
 />
 ) : activeTab === 'incidents' ? (
 <IncidentsTab onNavigateToReprint={handleNavigateToReprint} />
 ) : (
 /* Fallback */
 <div className="bg-theme-surface border border-theme-subtle rounded-3xl p-12 text-center space-y-4 shadow-xs">
 <div className="w-14 h-14 rounded-3xl bg-white text-rose-600 border border-rose-500 shadow-2xs flex items-center justify-center mx-auto">
 <Clock className="w-7 h-7" />
 </div>
 <div className="space-y-1 max-w-md mx-auto">
 <h3 className="text-base font-extrabold text-theme-main">
 Submódulo en Preparación
 </h3>
 </div>
 <button
 onClick={() => setActiveTab('inbound')}
 className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition-all shadow-md cursor-pointer inline-flex items-center gap-1.5"
 >
 <ArrowDownLeft className="w-4 h-4" />
 <span>Ir a Entradas</span>
 </button>
 </div>
 )}
 </div>
 );
};

export const MesaVerificacion: React.FC<MesaVerificacionProps> = (props) => {
 return (
 <VerificationDeskProvider>
 <MesaVerificacionInner {...props} />
 </VerificationDeskProvider>
 );
};
