import React, { useState } from 'react';
import { 
 QrCode, 
 MapPin, 
 History, 
 Printer, 
 CheckCircle2, 
 Sparkles, 
 Tag 
} from 'lucide-react';
import { 
 INITIAL_UNIT_REPRINT_CANDIDATES, 
 INITIAL_LOCATION_REPRINT_CANDIDATES, 
 INITIAL_REPRINT_AUDIT_LOGS, 
 ReprintAuditRecord, 
 UnitReprintCandidate, 
 LocationReprintCandidate 
} from '../../../data/mockReprintData';
import { UnitReprintSection } from './UnitReprintSection';
import { LocationReprintSection } from './LocationReprintSection';
import { ReprintAuditHistorySection } from './ReprintAuditHistorySection';
import { useVerificationDeskCedis } from '../../../context/VerificationDeskContext';

export type ReprintSubTab = 'units' | 'locations' | 'history';

interface ReprintDeskTabProps {
 initialUid?: string;
 initialIncidentRef?: string;
}

export const ReprintDeskTab: React.FC<ReprintDeskTabProps> = ({
 initialUid,
 initialIncidentRef,
}) => {
 const { selectedCedisId, selectedCedis } = useVerificationDeskCedis();
 const [activeSubTab, setActiveSubTab] = useState<ReprintSubTab>(() => (initialUid ? 'units' : 'units'));
 const [unitCandidates, setUnitCandidates] = useState<UnitReprintCandidate[]>(INITIAL_UNIT_REPRINT_CANDIDATES);
 const [locations, setLocations] = useState<LocationReprintCandidate[]>(INITIAL_LOCATION_REPRINT_CANDIDATES);
 const [auditLogs, setAuditLogs] = useState<ReprintAuditRecord[]>(INITIAL_REPRINT_AUDIT_LOGS);
 const [toastMessage, setToastMessage] = useState<string | null>(null);

 // Scoped to global CEDIS
 const visibleUnitCandidates = unitCandidates.filter((u) => u.warehouseId === selectedCedisId);
 const visibleLocations = locations.filter((l) => l.warehouseId === selectedCedisId);
 const visibleAuditLogs = auditLogs.filter(
 (l) =>
 !l.warehouseName ||
 (selectedCedisId === 'wh-mty-norte'
 ? l.warehouseName.includes('Norte')
 : l.warehouseName.includes('Sur'))
 );

 const showToast = (msg: string) => {
 setToastMessage(msg);
 setTimeout(() => setToastMessage(null), 4000);
 };

 const handleRecordReprint = (record: ReprintAuditRecord) => {
 setAuditLogs((prev) => [record, ...prev]);
 };

 return (
 <div className="space-y-6">
 
 {/* Toast Notification */}
 {toastMessage && (
 <div className="fixed top-5 right-5 z-50 bg-zinc-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-zinc-700 flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-top-3 duration-200">
 <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
 <span>{toastMessage}</span>
 </div>
 )}

 {/* Subtab Switcher Header */}
 <div className="bg-theme-surface p-2.5 border border-theme-subtle rounded-3xl shadow-xs flex items-center gap-1.5 flex-wrap">
 <button
 type="button"
 onClick={() => setActiveSubTab('units')}
 className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
 activeSubTab === 'units'
 ? 'bg-theme-primary text-white shadow-md'
 : 'bg-theme-muted/40 hover:bg-theme-muted text-theme-main border border-theme-subtle'
 }`}
 >
 <QrCode className="w-3.5 h-3.5" />
 <span>1. Unidades</span>
 </button>

 <button
 type="button"
 onClick={() => setActiveSubTab('locations')}
 className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
 activeSubTab === 'locations'
 ? 'bg-theme-primary text-white shadow-md'
 : 'bg-theme-muted/40 hover:bg-theme-muted text-theme-main border border-theme-subtle'
 }`}
 >
 <MapPin className="w-3.5 h-3.5" />
 <span>2. Ubicaciones</span>
 </button>

 <button
 type="button"
 onClick={() => setActiveSubTab('history')}
 className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
 activeSubTab === 'history'
 ? 'bg-theme-primary text-white shadow-md'
 : 'bg-theme-muted/40 hover:bg-theme-muted text-theme-main border border-theme-subtle'
 }`}
 >
 <History className="w-3.5 h-3.5" />
 <span>3. Historial</span>
 <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
 activeSubTab === 'history' ? 'bg-white/20 text-white' : 'bg-theme-surface text-theme-muted'
 }`}>
 {visibleAuditLogs.length}
 </span>
 </button>
 </div>

 {/* Main Subtab Render */}
 {activeSubTab === 'units' && (
 <UnitReprintSection
 candidates={visibleUnitCandidates}
 initialUid={initialUid}
 initialIncidentRef={initialIncidentRef}
 onRecordReprint={handleRecordReprint}
 onShowToast={showToast}
 />
 )}

 {activeSubTab === 'locations' && (
 <LocationReprintSection
 locations={visibleLocations}
 onRecordReprint={handleRecordReprint}
 onShowToast={showToast}
 />
 )}

 {activeSubTab === 'history' && (
 <ReprintAuditHistorySection
 logs={visibleAuditLogs}
 />
 )}
 </div>
 );
};

