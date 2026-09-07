import React, { useState, useEffect } from 'react';
import { X, Check, Package, QrCode, Layers } from 'lucide-react';
import { MasterArticle } from '../../data/mockArticlesData';
import { ModalPortal } from '../common/ModalPortal';

interface ArticuloFormModalProps {
 isOpen: boolean;
 onClose: () => void;
 onSave: (article: MasterArticle) => void;
 initialArticle?: MasterArticle | null;
}

export const ArticuloFormModal: React.FC<ArticuloFormModalProps> = ({
 isOpen,
 onClose,
 onSave,
 initialArticle,
}) => {
 const [sku, setSku] = useState('');
 const [name, setName] = useState('');
 const [brand, setBrand] = useState('Nayt');
 const [category, setCategory] = useState<'Colchones' | 'Bases' | 'Almohadas' | 'Protectores'>('Colchones');
 const [size, setSize] = useState<'Individual' | 'Matrimonial' | 'Queen Size' | 'King Size' | 'Estándar'>('Matrimonial');
 const [serialization, setSerialization] = useState<'Por unidad' | 'No serializado'>('Por unidad');
 const [classCode, setClassCode] = useState('COL');
 const [groupCode, setGroupCode] = useState('COL-ESP');
 const [storageType, setStorageType] = useState('Racks CEDIS - Posición Estándar');
 const [weightKg, setWeightKg] = useState('20.0');

 useEffect(() => {
 if (initialArticle) {
 setSku(initialArticle.sku);
 setName(initialArticle.name);
 setBrand(initialArticle.brand);
 setCategory(initialArticle.category);
 setSize(initialArticle.size);
 setSerialization(initialArticle.serialization);
 setClassCode(initialArticle.classCode);
 setGroupCode(initialArticle.groupCode);
 setStorageType(initialArticle.logisticControl.storageType);
 setWeightKg(initialArticle.logisticControl.weightKg.toString());
 } else {
 setSku(`SC-NAYT-${Math.floor(100 + Math.random() * 900)}-MAT`);
 setName('');
 setBrand('Nayt');
 setCategory('Colchones');
 setSize('Matrimonial');
 setSerialization('Por unidad');
 setClassCode('COL');
 setGroupCode('COL-ESP');
 setStorageType('Racks CEDIS - Posición Estándar');
 setWeightKg('22.0');
 }
 }, [initialArticle, isOpen]);

 if (!isOpen) return null;

 const handleSubmit = (e: React.FormEvent) => {
 e.preventDefault();
 if (!sku.trim() || !name.trim()) return;

 const savedArticle: MasterArticle = initialArticle
 ? {
 ...initialArticle,
 sku: sku.trim().toUpperCase(),
 name: name.trim(),
 brand,
 category,
 size,
 serialization,
 classCode,
 groupCode,
 logisticControl: {
 ...initialArticle.logisticControl,
 storageType,
 weightKg: parseFloat(weightKg) || 20,
 },
 }
 : {
 id: `art-${Date.now()}`,
 sku: sku.trim().toUpperCase(),
 name: name.trim(),
 brand,
 category,
 size,
 baseUnit: 'Pieza (PZA)',
 serialization,
 isActive: true,
 classCode,
 className: category,
 groupCode,
 groupName: groupCode === 'COL-ESP' ? 'Colchón en Caja / Espuma' : 'Colchón Tradicional de Resortes',
 satCode: category === 'Colchones' ? '56101508' : '56101515',
 barcode: `750${Math.floor(1000000000 + Math.random() * 9000000000)}`,
 descriptions: {
 internal: `Artículo ${name.trim()} dado de alta en catálogo maestro.`,
 commercial: `${name.trim()} garantizado por ${brand}.`,
 purchasing: `Unidad terminada ${name.trim()} empacada bajo estándar oficial.`,
 },
 characteristics: {
 line: `${brand} Línea Oficial`,
 mattressType: groupCode === 'COL-ESP' ? 'Colchón en Caja (Bed in a Box)' : 'Colchón Tradicional de Resortes',
 firmness: 'Media',
 heightCm: 24,
 supportTechnology: 'Estructura de Confort Ergonómico',
 packagingType: groupCode === 'COL-ESP' ? 'Roll-Pack al alto vacío' : 'Polietileno sellado calibre 400',
 isBoxed: groupCode === 'COL-ESP',
 isReversible: false,
 maxWeightPerPersonKg: 115,
 fabricComposition: 'Tejido Stretch Jacquard Antibacterial',
 warrantyYears: 5,
 },
 logisticControl: {
 requiresQr: serialization === 'Por unidad',
 requiresPhysicalLocation: true,
 individualHandling: serialization === 'Por unidad',
 rotationStrategy: 'FIFO',
 fefoEnabled: false,
 maxDaysInWarehouse: 365,
 storageType,
 inspectionLevel: serialization === 'Por unidad' ? 'Mesa de Verificación (100% Serializado)' : 'Muestreo por Lote',
 weightKg: parseFloat(weightKg) || 20,
 dimensionsCm: { width: size === 'King Size' ? 200 : size === 'Queen Size' ? 150 : size === 'Matrimonial' ? 135 : 100, length: 190, height: 24 },
 },
 inventory: {
 totalPhysical: 30,
 available: 30,
 inInspection: 0,
 committed: 0,
 byWarehouse: [
 { warehouseId: 'wh-mty-norte', warehouseName: 'CEDIS Monterrey Norte', location: 'A-01-04', stock: 20, available: 20, committed: 0, inTransit: 0 },
 { warehouseId: 'wh-mty-sur', warehouseName: 'CEDIS Monterrey Sur', location: 'A-02-01', stock: 10, available: 10, committed: 0, inTransit: 0 },
 ],
 recentSerializedUnits: serialization === 'Por unidad' ? [
 { uid: `SC-UID-2026-${Math.floor(100000 + Math.random() * 900000)}`, lotNumber: 'LOTE-2026-W34', warehouseName: 'CEDIS Monterrey Norte', location: 'A-01-04', entryDate: '27 Ago 2026', ageDays: 0, status: 'Disponible' },
 ] : [],
 },
 relatedVariants: [
 { sku: sku.trim().toUpperCase(), size, name: name.trim(), status: 'Activo' },
 ],
 traceabilityEvents: [
 { timestamp: '27 Ago 12:00', event: 'Serializado', warehouseName: 'CEDIS MTY Norte', location: 'Mesa de Verificación', user: 'admin', details: 'Alta y serialización inicial de catálogo' },
 ],
 purchasing: {
 primarySupplier: `${brand} México S.A. de C.V.`,
 supplierCode: `PROV-${brand.substring(0, 3).toUpperCase()}-01`,
 lastReceptionDate: '27 Ago 2026',
 estimatedLeadTimeDays: 7,
 internalReferenceCost: 1400.00,
 lastReceivedLot: 'LOTE-2026-W34',
 reorderPoint: 25,
 economicOrderQuantity: 80,
 },
 commercial: {
 salesDescription: `${name.trim()} comercializado en red Impresos RTM.`,
 salesChannel: 'Omnicanal',
 commercialStatus: 'Línea Activa',
 season: 'Línea Continua 2026',
 modelYear: '2026',
 introductionDate: '27 Ago 2026',
 referenceListPrice: 2899.00,
 },
 images: [
 { id: `img-${Date.now()}-01`, url: 'https://www.supercolchones.com.mx/media/catalog/product/cache/7ebeb6ef5d1f03c9ec7b9673c6f4cd5b/n/a/nayt-flow-white-ambiente-1.png', caption: `${name.trim()} - Vista Oficial`, isPrimary: true, resolution: '1200x1200 px' },
 ],
 documents: [
 { id: `doc-${Date.now()}-01`, title: `Ficha Técnica ${sku.trim().toUpperCase()}.pdf`, type: 'Ficha Técnica', format: 'PDF', date: '27 Ago 2026', version: 'v1.0', sizeKb: 450 },
 { id: `doc-${Date.now()}-02`, title: `Certificado de Garantía ${brand}.pdf`, type: 'Certificado de Garantía', format: 'PDF', date: '27 Ago 2026', version: 'v1.0', sizeKb: 280 },
 ],
 };

 onSave(savedArticle);
 onClose();
 };

 return (
 <ModalPortal isOpen={isOpen} onClose={onClose}>
 <div className="w-full max-w-xl bg-theme-surface rounded-2xl shadow-2xl overflow-hidden border border-theme-subtle flex flex-col max-h-[90vh]">
 
 {/* Header */}
 <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-surface">
 <div className="flex items-center gap-2.5">
 <div className="w-8 h-8 rounded-lg bg-theme-primary/10 text-theme-primary flex items-center justify-center">
 <Package className="w-4 h-4" />
 </div>
 <div>
 <h2 className="text-sm font-bold text-theme-main">
 {initialArticle ? 'Editar Artículo Maestro' : 'Alta de Artículo Maestro'}
 </h2>
 <p className="text-[11px] text-theme-muted">
 Define los parámetros de catálogo, clasificación y control logístico.
 </p>
 </div>
 </div>

 <button
 onClick={onClose}
 className="p-1 rounded-lg text-theme-muted hover:text-theme-main hover:bg-theme-muted transition-colors"
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 {/* Form Body */}
 <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
 
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 {/* SKU */}
 <div>
 <label className="block text-[11px] font-bold uppercase tracking-wider text-theme-main mb-1">
 SKU Artículo *
 </label>
 <input
 type="text"
 required
 value={sku}
 onChange={(e) => setSku(e.target.value)}
 placeholder="ej. SC-NAYT-FLOW-IND"
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl px-3 py-2 text-xs font-mono font-bold text-theme-main focus:bg-theme-surface focus:outline-none focus:border-theme-primary"
 />
 </div>

 {/* Marca */}
 <div>
 <label className="block text-[11px] font-bold uppercase tracking-wider text-theme-main mb-1">
 Marca
 </label>
 <select
 value={brand}
 onChange={(e) => setBrand(e.target.value)}
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl px-3 py-2 text-xs font-semibold text-theme-main focus:outline-none focus:border-theme-primary"
 >
 <option value="Nayt">Nayt</option>
 <option value="Spring Air">Spring Air</option>
 <option value="Restonic">Restonic</option>
 <option value="América">América</option>
 <option value="Sealy">Sealy</option>
 <option value="Therapedic">Therapedic</option>
 <option value="Sognare">Sognare</option>
 </select>
 </div>
 </div>

 {/* Nombre / Descripción Técnica */}
 <div>
 <label className="block text-[11px] font-bold uppercase tracking-wider text-theme-main mb-1">
 Nombre Oficial del Artículo *
 </label>
 <input
 type="text"
 required
 value={name}
 onChange={(e) => setName(e.target.value)}
 placeholder="ej. Nayt Colchón Flow Basic White"
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl px-3 py-2 text-xs font-semibold text-theme-main focus:bg-theme-surface focus:outline-none focus:border-theme-primary"
 />
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 {/* Categoría */}
 <div>
 <label className="block text-[11px] font-bold uppercase tracking-wider text-theme-main mb-1">
 Categoría / Clase
 </label>
 <select
 value={category}
 onChange={(e) => {
 const cat = e.target.value as any;
 setCategory(cat);
 setClassCode(cat === 'Colchones' ? 'COL' : cat === 'Bases' ? 'BAS' : cat === 'Almohadas' ? 'ALM' : 'PRO');
 }}
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl px-3 py-2 text-xs font-semibold text-theme-main focus:outline-none focus:border-theme-primary"
 >
 <option value="Colchones">Colchones (COL)</option>
 <option value="Bases">Bases y Somieres (BAS)</option>
 <option value="Almohadas">Almohadas y Confort (ALM)</option>
 <option value="Protectores">Protectores y Blancos (PRO)</option>
 </select>
 </div>

 {/* Medida */}
 <div>
 <label className="block text-[11px] font-bold uppercase tracking-wider text-theme-main mb-1">
 Medida / Presentación
 </label>
 <select
 value={size}
 onChange={(e) => setSize(e.target.value as any)}
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl px-3 py-2 text-xs font-semibold text-theme-main focus:outline-none focus:border-theme-primary"
 >
 <option value="Individual">Individual</option>
 <option value="Matrimonial">Matrimonial</option>
 <option value="Queen Size">Queen Size</option>
 <option value="King Size">King Size</option>
 <option value="Estándar">Estándar</option>
 </select>
 </div>
 </div>

 {/* Logística y Serialización */}
 <div className="p-4 rounded-xl bg-theme-muted/50 border border-theme-subtle space-y-3">
 <span className="text-[11px] font-bold uppercase tracking-wider text-theme-main flex items-center gap-1.5">
 <QrCode className="w-3.5 h-3.5 text-theme-primary" />
 Parámetros de Serialización y Control de Almacén
 </span>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 <div>
 <label className="block text-[10px] font-bold text-theme-muted uppercase mb-1">
 Tipo de Serialización
 </label>
 <select
 value={serialization}
 onChange={(e) => setSerialization(e.target.value as any)}
 className="w-full bg-theme-surface border border-theme-subtle rounded-lg px-2.5 py-1.5 text-xs font-semibold text-theme-main focus:outline-none focus:border-theme-primary"
 >
 <option value="Por unidad">Por unidad (QR/Serie Individual)</option>
 <option value="No serializado">No serializado (Control por Lote)</option>
 </select>
 </div>

 <div>
 <label className="block text-[10px] font-bold text-theme-muted uppercase mb-1">
 Peso Unitario (Kg)
 </label>
 <input
 type="number"
 step="0.5"
 value={weightKg}
 onChange={(e) => setWeightKg(e.target.value)}
 className="w-full bg-theme-surface border border-theme-subtle rounded-lg px-2.5 py-1.5 text-xs text-theme-main focus:outline-none focus:border-theme-primary"
 />
 </div>
 </div>
 </div>

 {/* Footer Actions */}
 <div className="pt-3 border-t border-theme-subtle flex items-center justify-end gap-2.5">
 <button
 type="button"
 onClick={onClose}
 className="px-4 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-xs font-semibold text-theme-main transition-colors cursor-pointer"
 >
 Cancelar
 </button>
 <button
 type="submit"
 className="px-5 py-2 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
 >
 <Check className="w-3.5 h-3.5 stroke-[3]" />
 <span>{initialArticle ? 'Guardar Cambios' : 'Crear Artículo'}</span>
 </button>
 </div>
 </form>
 </div>
 </ModalPortal>
 );
};
