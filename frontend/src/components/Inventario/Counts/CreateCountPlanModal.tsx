import React, { useState } from 'react';
import { 
 X, 
 ClipboardCheck, 
 Building2, 
 Store, 
 CheckCircle2, 
 Layers, 
 ChevronRight, 
 ChevronLeft, 
 EyeOff, 
 QrCode, 
 Boxes, 
 Sparkles, 
 Tag, 
 ShieldCheck,
 Search
} from 'lucide-react';
import { CountPlanRecord, CountTaskRecord } from '../../../data/mockCountsData';
import { MOCK_WAREHOUSES_LIST } from '../../../data/mockInventoryData';
import { MOCK_MASTER_ARTICLES } from '../../../data/mockArticlesData';
import { ModalPortal } from '../../common/ModalPortal';

interface CreateCountPlanModalProps {
 isOpen: boolean;
 onClose: () => void;
 onPlanCreated: (newPlan: CountPlanRecord, generatedTasks: CountTaskRecord[]) => void;
}

export const CreateCountPlanModal: React.FC<CreateCountPlanModalProps> = ({
 isOpen,
 onClose,
 onPlanCreated,
}) => {
 const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

 // Paso 1: Nodo
 const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>('wh-mty-norte');

 // Paso 2: Tipo
 const [countType, setCountType] = useState<'UBICACION' | 'ARTICULO' | 'CICLICO_SUGERIDO' | 'COMPLETO'>('UBICACION');

 // Paso 3: Alcance
 const [selectedAisle, setSelectedAisle] = useState<string>('A');
 const [selectedZones, setSelectedZones] = useState<string[]>(['RACKS', 'SHOWROOM']);
 const [selectedArticleSku, setSelectedArticleSku] = useState<string>('SC-NAYT-FLOW-IND');

 // Paso 4: Método
 const [method, setMethod] = useState<'QR_UID' | 'MANUAL'>('QR_UID');

 // Paso 5: Conteo Ciego
 const [isBlindCount, setIsBlindCount] = useState<boolean>(true);

 if (!isOpen) return null;

 const targetNode = MOCK_WAREHOUSES_LIST.find(w => w.id === selectedWarehouseId) || MOCK_WAREHOUSES_LIST[0];

 const handleGeneratePlan = () => {
 const nextNum = 20 + Math.floor(Math.random() * 15);
 const planFolio = `PLC-2026-00${nextNum}`;
 const nextTaskBase = 50 + Math.floor(Math.random() * 20);

 const scopeLabel =
 countType === 'UBICACION'
 ? `Pasillo ${selectedAisle} (Ubicaciones selectivas)`
 : countType === 'ARTICULO'
 ? `${selectedArticleSku} (Recorrido Multi-Ubicación)`
 : countType === 'CICLICO_SUGERIDO'
 ? 'Zonas de Alta Rotación & Retrabajo'
 : 'Inventario Completo del Almacén';

 const newPlan: CountPlanRecord = {
 id: `plan-${Date.now()}`,
 folio: planFolio,
 warehouseId: selectedWarehouseId,
 warehouseName: targetNode.name,
 type: countType,
 scope: scopeLabel,
 method,
 isBlindCount,
 totalLocations: countType === 'COMPLETO' ? 70 : 8,
 completedLocations: 0,
 totalUnitsEstimated: countType === 'COMPLETO' ? 240 : 28,
 status: 'Activo',
 createdAt: '28 Ago 2026',
 createdBy: 'Supervisor de Almacén (Carlos Medina)',
 };

 // Generate simulated tasks under this plan
 const newTasks: CountTaskRecord[] = [
 {
 id: `task-${Date.now()}-1`,
 folio: `CC-2026-00${nextTaskBase}`,
 planFolio,
 warehouseId: selectedWarehouseId,
 warehouseName: targetNode.name,
 locationCode: `${selectedAisle}-C-01`,
 locationName: `Pasillo ${selectedAisle} · Posición 01 · Nivel C`,
 zoneType: 'RACK',
 expectedUnitsCount: 2,
 expectedSerials: ['SC-UID-2026-000101', 'SC-UID-2026-000102'],
 countedUnitsCount: 0,
 countedSerials: [],
 isBlindCount,
 status: 'Pendiente',
 assignedTo: 'Operador RF Demo (Roberto Garza)',
 hasDifference: false,
 },
 {
 id: `task-${Date.now()}-2`,
 folio: `CC-2026-00${nextTaskBase + 1}`,
 planFolio,
 warehouseId: selectedWarehouseId,
 warehouseName: targetNode.name,
 locationCode: `${selectedAisle}-B-01`,
 locationName: `Pasillo ${selectedAisle} · Posición 01 · Nivel B`,
 zoneType: 'RACK',
 expectedUnitsCount: 3,
 expectedSerials: ['SC-UID-2026-000103', 'SC-UID-2026-000104', 'SC-UID-2026-000105'],
 countedUnitsCount: 0,
 countedSerials: [],
 isBlindCount,
 status: 'Pendiente',
 assignedTo: 'Operador RF Demo (Roberto Garza)',
 hasDifference: false,
 },
 {
 id: `task-${Date.now()}-3`,
 folio: `CC-2026-00${nextTaskBase + 2}`,
 planFolio,
 warehouseId: selectedWarehouseId,
 warehouseName: targetNode.name,
 locationCode: `${selectedAisle}-A-01`,
 locationName: `Pasillo ${selectedAisle} · Posición 01 · Nivel A (Piso)`,
 zoneType: 'RACK',
 expectedUnitsCount: 3,
 expectedSerials: ['SC-UID-2026-000106', 'SC-UID-2026-000107', 'SC-UID-2026-000108'],
 countedUnitsCount: 0,
 countedSerials: [],
 isBlindCount,
 status: 'Pendiente',
 assignedTo: 'Operador RF Demo (Roberto Garza)',
 hasDifference: false,
 },
 ];

 onPlanCreated(newPlan, newTasks);
 onClose();
 };

 return (
 <ModalPortal isOpen={isOpen} onClose={onClose}>
 <div className="w-full max-w-2xl bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[92vh]">
 
 {/* Header */}
 <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-surface">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-2xl bg-white text-rose-600 border border-rose-500 shadow-2xs flex items-center justify-center font-bold text-sm shrink-0">
 <ClipboardCheck className="w-5 h-5" />
 </div>
 <div>
 <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted">
 Configuración de Conteo Físico &middot; Paso {step} de 6
 </span>
 <h2 className="text-sm font-extrabold text-theme-main mt-0.5">
 Nuevo Plan de Conteo Cíclico
 </h2>
 </div>
 </div>

 <button
 onClick={onClose}
 className="p-1.5 rounded-xl text-theme-muted hover:text-theme-main hover:bg-theme-muted transition-colors cursor-pointer"
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 {/* Wizard Steps Bar */}
 <div className="px-6 py-2.5 bg-theme-muted/30 border-b border-theme-subtle flex items-center justify-between text-[11px] font-bold overflow-x-auto">
 {['1. Almacén', '2. Tipo', '3. Alcance', '4. Método', '5. Ciego', '6. Resumen'].map((label, idx) => {
 const stepNum = idx + 1;
 const isActive = step === stepNum;
 const isPassed = step > stepNum;
 return (
 <div
 key={label}
 className={`flex items-center gap-1.5 whitespace-nowrap ${
 isActive ? 'text-rose-600 font-black' : isPassed ? 'text-emerald-600' : 'text-theme-muted'
 }`}
 >
 <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-mono ${
 isActive ? 'bg-rose-600 text-white' : isPassed ? 'bg-emerald-500 text-white' : 'bg-theme-muted text-theme-muted'
 }`}>
 {stepNum}
 </div>
 <span>{label}</span>
 </div>
 );
 })}
 </div>

 {/* Body Content */}
 <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
 
 {/* PASO 1: NODO */}
 {step === 1 && (
 <div className="space-y-4">
 <div className="p-3.5 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Selección de Instalación</span>
 <p className="text-xs text-theme-main font-semibold">
 Selecciona el Centro de Distribución o Sucursal donde se ejecutará el conteo físico.
 </p>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 {MOCK_WAREHOUSES_LIST.map((wh) => {
 const isSelected = selectedWarehouseId === wh.id;
 const isCedis = wh.type.includes('Distribución') || wh.type.includes('Primario');

 return (
 <div
 key={wh.id}
 onClick={() => setSelectedWarehouseId(wh.id)}
 className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
 isSelected
 ? 'bg-rose-500/10 border-rose-500 ring-2 ring-rose-300 shadow-sm'
 : 'bg-theme-surface border-theme-subtle hover:bg-theme-muted/40'
 }`}
 >
 <div className="flex items-center justify-between">
 <span className="font-mono text-xs font-black text-rose-600">{wh.code}</span>
 <span className="px-2 py-0.2 rounded text-[9px] font-bold bg-theme-muted text-theme-main border border-theme-subtle">
 {isCedis ? 'CEDIS' : 'SUCURSAL'}
 </span>
 </div>
 <h4 className="text-xs font-bold text-theme-main">{wh.name}</h4>
 <p className="text-[10px] text-theme-muted">{wh.address}</p>
 </div>
 );
 })}
 </div>
 </div>
 )}

 {/* PASO 2: TIPO */}
 {step === 2 && (
 <div className="space-y-4">
 <div className="p-3.5 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Estrategia de Conteo</span>
 <p className="text-xs text-theme-main font-semibold">
 Elige la modalidad operativa para auditar las existencias.
 </p>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 {[
 {
 id: 'UBICACION',
 title: 'Por Ubicación Física',
 desc: 'Auditar pasillos, racks específicos, recepción, retrabajo o showroom.',
 badge: 'Recomendado',
 },
 {
 id: 'ARTICULO',
 title: 'Por Artículo / SKU',
 desc: 'Rastrear todas las ubicaciones donde el sistema registra un SKU.',
 badge: 'Cíclico A/B/C',
 },
 {
 id: 'CICLICO_SUGERIDO',
 title: 'Sugerido por Sistema',
 desc: 'Ubicaciones con alta rotación o mayor tiempo sin auditar.',
 badge: 'Inteligente',
 },
 {
 id: 'COMPLETO',
 title: 'Inventario General',
 desc: 'Barrido total de todas las posiciones del almacén.',
 badge: 'Anual / Semestral',
 },
 ].map((t) => (
 <div
 key={t.id}
 onClick={() => setCountType(t.id as any)}
 className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 flex flex-col justify-between ${
 countType === t.id
 ? 'bg-rose-500/10 border-rose-500 ring-2 ring-rose-300 shadow-sm'
 : 'bg-theme-surface border-theme-subtle hover:bg-theme-muted/40'
 }`}
 >
 <div className="space-y-1">
 <div className="flex items-center justify-between">
 <strong className="text-xs font-bold text-theme-main">{t.title}</strong>
 <span className="px-2 py-0.2 rounded text-[9px] font-bold bg-rose-500/10 text-rose-700">
 {t.badge}
 </span>
 </div>
 <p className="text-[11px] text-theme-muted leading-relaxed">
 {t.desc}
 </p>
 </div>
 </div>
 ))}
 </div>
 </div>
 )}

 {/* PASO 3: ALCANCE */}
 {step === 3 && (
 <div className="space-y-4">
 <div className="p-3.5 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Definición de Alcance</span>
 <p className="text-xs text-theme-main font-semibold">
 Selecciona los pasillos, áreas operativas o artículo a incluir.
 </p>
 </div>

 {countType === 'UBICACION' && (
 <div className="space-y-3">
 <label className="text-[11px] font-bold text-theme-muted uppercase block">
 Seleccionar Pasillo:
 </label>
 <div className="grid grid-cols-5 gap-2">
 {['A', 'B', 'C', 'D', 'E'].map((aisle) => (
 <button
 key={aisle}
 type="button"
 onClick={() => setSelectedAisle(aisle)}
 className={`py-3 rounded-2xl font-mono text-sm font-black border transition-all cursor-pointer ${
 selectedAisle === aisle
 ? 'bg-rose-600 text-white border-rose-600 shadow-md'
 : 'bg-theme-surface border-theme-subtle text-theme-main hover:bg-theme-muted'
 }`}
 >
 Pasillo {aisle}
 </button>
 ))}
 </div>

 <div className="pt-2 space-y-1.5">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">
 Zonas operativas especiales adicionales:
 </span>
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
 {['Recepción', 'Retrabajo', 'Embarques', 'Showroom'].map((z) => (
 <label key={z} className="p-2.5 rounded-xl border border-theme-subtle bg-theme-surface flex items-center gap-2 cursor-pointer text-xs font-semibold">
 <input type="checkbox" defaultChecked className="rounded text-rose-600" />
 <span>{z}</span>
 </label>
 ))}
 </div>
 </div>
 </div>
 )}

 {countType === 'ARTICULO' && (
 <div className="space-y-2">
 <label className="text-[11px] font-bold text-theme-muted uppercase block">
 Seleccionar Artículo a Auditar:
 </label>
 <select
 value={selectedArticleSku}
 onChange={(e) => setSelectedArticleSku(e.target.value)}
 className="w-full bg-theme-surface border border-theme-subtle rounded-xl p-3 text-xs font-bold text-theme-main focus:outline-none focus:border-theme-primary cursor-pointer"
 >
 {MOCK_MASTER_ARTICLES.map((art) => (
 <option key={art.sku} value={art.sku}>
 {art.sku} - {art.name} ({art.brand})
 </option>
 ))}
 </select>
 </div>
 )}

 {countType === 'CICLICO_SUGERIDO' && (
 <div className="p-4 rounded-2xl bg-white border border-purple-500 shadow-2xs space-y-1 text-xs">
 <div className="flex items-center gap-2 font-bold text-zinc-900">
 <Sparkles className="w-4 h-4 text-purple-600" />
 <span>Alcance Inteligente Sugerido</span>
 </div>
 <p className="text-[11px] text-theme-main">
 Se generarán tareas automáticas para las 4 ubicaciones con mayor desviación histórica y tiempo sin conteo: <strong>A-C-04, RET-NORTE, EMB-02 y SHOW-02</strong>.
 </p>
 </div>
 )}

 {countType === 'COMPLETO' && (
 <div className="p-4 rounded-2xl bg-white border border-amber-500 shadow-2xs space-y-1 text-xs">
 <strong className="text-zinc-900 block font-bold">Barrido Completo</strong>
 <p className="text-[11px] text-theme-main">
 Se generarán tareas para las 70 posiciones de rack más zonas de recibo, retrabajo y despacho en {targetNode.name}.
 </p>
 </div>
 )}
 </div>
 )}

 {/* PASO 4: MÉTODO */}
 {step === 4 && (
 <div className="space-y-4">
 <div className="p-3.5 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Método de Captura</span>
 <p className="text-xs text-theme-main font-semibold">
 Define cómo el operador registrará las unidades físicas en piso.
 </p>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 <div
 onClick={() => setMethod('QR_UID')}
 className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
 method === 'QR_UID'
 ? 'bg-rose-500/10 border-rose-500 ring-2 ring-rose-300 shadow-sm'
 : 'bg-theme-surface border-theme-subtle hover:bg-theme-muted/40'
 }`}
 >
 <div className="flex items-center justify-between">
 <strong className="text-xs font-bold text-theme-main flex items-center gap-1.5">
 <QrCode className="w-4 h-4 text-rose-600" />
 <span>Escaneo por UID / QR</span>
 </strong>
 <span className="px-2 py-0.2 rounded text-[9px] font-bold bg-rose-600 text-white">
 Recomendado
 </span>
 </div>
 <p className="text-[11px] text-theme-muted leading-relaxed">
 Lectura óptica individual de cada código serializado cosido al colchón y validación del QR de ubicación.
 </p>
 </div>

 <div
 onClick={() => setMethod('MANUAL')}
 className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
 method === 'MANUAL'
 ? 'bg-rose-500/10 border-rose-500 ring-2 ring-rose-300 shadow-sm'
 : 'bg-theme-surface border-theme-subtle hover:bg-theme-muted/40'
 }`}
 >
 <strong className="text-xs font-bold text-theme-main block">
 Conteo Manual por Cantidad
 </strong>
 <p className="text-[11px] text-theme-muted leading-relaxed">
 Captura numérica de piezas sin verificación individual de números de serie.
 </p>
 </div>
 </div>
 </div>
 )}

 {/* PASO 5: CONTEO CIEGO */}
 {step === 5 && (
 <div className="space-y-4">
 <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle space-y-3">
 <div className="flex items-center justify-between">
 <div className="space-y-0.5">
 <strong className="text-sm font-extrabold text-theme-main flex items-center gap-2">
 <EyeOff className="w-4 h-4 text-rose-600" />
 <span>Conteo Ciego (Blind Count)</span>
 </strong>
 <p className="text-xs text-theme-muted">
 Oculta la cantidad esperada en sistema durante la captura operativa.
 </p>
 </div>

 <input
 type="checkbox"
 checked={isBlindCount}
 onChange={(e) => setIsBlindCount(e.target.checked)}
 className="w-5 h-5 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
 />
 </div>

 <div className="p-3.5 rounded-xl bg-theme-muted/40 border border-theme-subtle text-xs text-theme-muted leading-relaxed">
 <p>
 <strong>¿Por qué se recomienda conteo ciego?</strong><br />
 El operador realizará el conteo físico sin conocer la cantidad registrada en sistema. Esto evita confirmaciones automáticas o sesgos y garantiza una auditoría real y fidedigna del almacén.
 </p>
 </div>
 </div>
 </div>
 )}

 {/* PASO 6: RESUMEN */}
 {step === 6 && (
 <div className="space-y-4">
 <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle shadow-xs space-y-3">
 <div className="flex items-center justify-between pb-2 border-b border-theme-subtle">
 <span className="text-[10px] font-bold uppercase text-theme-muted tracking-wider">
 Resumen del Plan de Conteo
 </span>
 <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-700">
 {method === 'QR_UID' ? 'Escaneo UID' : 'Manual'}
 </span>
 </div>

 <div className="grid grid-cols-2 gap-3 text-xs">
 <div>
 <span className="text-[10px] text-theme-muted block">Instalación:</span>
 <strong className="text-theme-main">{targetNode.name}</strong>
 </div>
 <div>
 <span className="text-[10px] text-theme-muted block">Modalidad:</span>
 <strong className="text-theme-main">{countType}</strong>
 </div>
 <div>
 <span className="text-[10px] text-theme-muted block">Alcance:</span>
 <strong className="text-theme-primary">
 {countType === 'UBICACION' ? `Pasillo ${selectedAisle}` : countType}
 </strong>
 </div>
 <div>
 <span className="text-[10px] text-theme-muted block">Conteo Ciego:</span>
 <strong className={isBlindCount ? 'text-emerald-600' : 'text-amber-600'}>
 {isBlindCount ? 'ACTIVADO (Recomendado)' : 'Desactivado'}
 </strong>
 </div>
 </div>

 <div className="pt-2 border-t border-theme-subtle flex items-center justify-between text-xs font-mono">
 <span className="text-theme-muted">Ubicaciones estimadas: <strong>8 posiciones</strong></span>
 <span className="text-theme-muted">Unidades estimadas: <strong>~28 piezas</strong></span>
 </div>
 </div>
 </div>
 )}
 </div>

 {/* Footer Navigation */}
 <div className="px-6 py-4 border-t border-theme-subtle bg-theme-muted/40 flex items-center justify-between text-xs">
 {step > 1 ? (
 <button
 onClick={() => setStep((s) => (s - 1) as any)}
 className="px-4 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-semibold transition-colors cursor-pointer border border-theme-subtle flex items-center gap-1"
 >
 <ChevronLeft className="w-4 h-4" />
 <span>Anterior</span>
 </button>
 ) : (
 <button
 onClick={onClose}
 className="px-4 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-semibold transition-colors cursor-pointer border border-theme-subtle"
 >
 Cancelar
 </button>
 )}

 {step < 6 ? (
 <button
 onClick={() => setStep((s) => (s + 1) as any)}
 className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
 >
 <span>Siguiente</span>
 <ChevronRight className="w-4 h-4" />
 </button>
 ) : (
 <button
 onClick={handleGeneratePlan}
 className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black transition-all shadow-md flex items-center gap-2 cursor-pointer"
 >
 <ClipboardCheck className="w-4 h-4" />
 <span>Generar tareas de conteo</span>
 </button>
 )}
 </div>
 </div>
 </ModalPortal>
 );
};
