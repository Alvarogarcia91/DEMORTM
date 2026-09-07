import React, { useState, useEffect } from 'react';
import { X, Check, Package, QrCode } from 'lucide-react';
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
  const [brand, setBrand] = useState('Stanley Black & Decker');
  const [category, setCategory] = useState<string>('Producto Terminado');
  const [size, setSize] = useState<string>('Millar (1,000 pzas)');
  const [serialization, setSerialization] = useState<'Por unidad' | 'No serializado'>('No serializado');
  const [classCode, setClassCode] = useState('PT');
  const [groupCode, setGroupCode] = useState('PT-MAN');
  const [technology, setTechnology] = useState<'Offset' | 'Flexografía' | 'Serigrafía' | 'N/A'>('Offset');
  const [storageType, setStorageType] = useState('Racks Almacén Principal RTM');
  const [weightKg, setWeightKg] = useState('15.0');

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
      setTechnology((initialArticle.technology as any) || 'Offset');
      setStorageType(initialArticle.logisticControl?.storageType || 'Racks Almacén Principal RTM');
      setWeightKg((initialArticle.logisticControl?.weightKg || 15).toString());
    } else {
      setSku(`PT-RTM-${Math.floor(100 + Math.random() * 900)}`);
      setName('');
      setBrand('Stanley Black & Decker');
      setCategory('Producto Terminado');
      setSize('Millar (1,000 pzas)');
      setSerialization('No serializado');
      setClassCode('PT');
      setGroupCode('PT-MAN');
      setTechnology('Offset');
      setStorageType('Racks Almacén Principal RTM');
      setWeightKg('15.0');
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
          customer: category === 'Producto Terminado' ? brand : undefined,
          category,
          size,
          technology,
          serialization,
          classCode,
          groupCode,
          logisticControl: {
            ...initialArticle.logisticControl,
            storageType,
            weightKg: parseFloat(weightKg) || 15,
          },
        }
      : {
          id: `art-${Date.now()}`,
          sku: sku.trim().toUpperCase(),
          name: name.trim(),
          brand,
          customer: category === 'Producto Terminado' ? brand : undefined,
          category,
          size,
          technology,
          baseUnit: size.includes('Bobina') ? 'bobina' : size.includes('Rollo') ? 'rollo' : size.includes('Cubeta') ? 'cubeta' : 'pza',
          serialization,
          isActive: true,
          classCode,
          className: category,
          groupCode,
          groupName: groupCode === 'PT-MAN' ? 'Manuales e Instructivos' : 'Etiquetas y Empaque',
          satCode: category === 'Producto Terminado' ? '55101500' : '14111500',
          barcode: `750${Math.floor(1000000000 + Math.random() * 9000000000)}`,
          descriptions: {
            internal: `${name.trim()} — ${technology}. Control de balance y especificación en Almacén Principal RTM.`,
            commercial: `${name.trim()} garantizado bajo estándares de calidad Impresos RTM.`,
            purchasing: `Insumos requeridos para fabricación de ${name.trim()}.`,
          },
          characteristics: {
            line: technology === 'Offset' ? 'Línea Offset Comercial' : 'Línea Flexografía Bobina',
            technology,
            substrate: technology === 'Offset' ? 'Papel Couché / Caple SBS' : 'Película BOPP Autoadherible',
            caliperGsm: 'Estándar Gráfico RTM',
            colors: 'CMYK / Tintas UV',
            finishes: 'Barniz Sobreimpresión + Troquel',
            formatDimensions: size,
            unitPresentation: 'Por Lote / Millar',
            qaApproved: true,
            mattressType: technology,
            firmness: 'Media',
            heightCm: 1,
            supportTechnology: technology,
            packagingType: 'Tarima protegida flejada',
            isBoxed: false,
            isReversible: false,
            maxWeightPerPersonKg: 0,
            fabricComposition: 'Sustrato celulósico / polipropileno',
            warrantyYears: 1,
          },
          logisticControl: {
            requiresQr: serialization === 'Por unidad',
            requiresPhysicalLocation: true,
            individualHandling: false,
            rotationStrategy: 'FIFO',
            fefoEnabled: false,
            maxDaysInWarehouse: 180,
            storageType,
            inspectionLevel: 'Muestreo AQL por Lote de Producción',
            weightKg: parseFloat(weightKg) || 15,
            dimensionsCm: { width: 40, length: 60, height: 30 },
          },
          inventory: {
            totalPhysical: 1000,
            available: 1000,
            inInspection: 0,
            committed: 0,
            byWarehouse: [
              { warehouseId: 'wh-alm-rtm', warehouseName: 'Almacén Principal RTM', location: 'PT-01', stock: 1000, available: 1000, committed: 0, inTransit: 0 },
            ],
            recentSerializedUnits: [],
          },
          relatedVariants: [
            { sku: sku.trim().toUpperCase(), size, name: name.trim(), status: 'Activo' },
          ],
          traceabilityEvents: [
            { timestamp: '01 Sep 08:30', event: 'Acomodado', warehouseName: 'Almacén Principal RTM', location: 'PT-01', user: 'admin', details: 'Alta inicial en catálogo maestro RTM' },
          ],
          purchasing: {
            primarySupplier: category === 'Producto Terminado' ? 'Impresos RTM (Manufactura Interna)' : `${brand} México`,
            supplierCode: `PROV-${brand.substring(0, 3).toUpperCase()}-01`,
            lastReceptionDate: '01 Sep 2026',
            estimatedLeadTimeDays: 5,
            internalReferenceCost: 1.50,
            lastReceivedLot: 'RTM-LOTE-2026-09',
            reorderPoint: 200,
            economicOrderQuantity: 1000,
          },
          commercial: {
            salesDescription: `${name.trim()} para cuenta corporativa ${brand}.`,
            salesChannel: 'B2B Industrial',
            commercialStatus: 'Línea Activa',
            season: '2026',
            modelYear: '2026',
            introductionDate: '01 Ene 2026',
            referenceListPrice: 2.50,
          },
          images: [
            { id: `img-${Date.now()}-01`, url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800', caption: `${name.trim()} - Vista Oficial`, isPrimary: true, resolution: '1200x800 px' },
          ],
          documents: [
            { id: `doc-${Date.now()}-01`, title: `Ficha Técnica ${sku.trim().toUpperCase()}.pdf`, type: 'Ficha Técnica', format: 'PDF', date: '01 Sep 2026', version: 'v1.0', sizeKb: 310 },
          ],
        };

    onSave(savedArticle);
    onClose();
  };

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-150">
        <div className="bg-theme-surface border border-theme-subtle rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          
          {/* Header */}
          <div className="p-5 border-b border-theme-subtle flex items-center justify-between bg-theme-muted/30">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-theme-primary/10 text-theme-primary">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-theme-main">
                  {initialArticle ? 'Editar Especificación de Artículo' : 'Nuevo Artículo — Catálogo RTM'}
                </h3>
                <p className="text-[11px] text-theme-muted">
                  Gestión de especificación técnica, tecnología y control de almacén.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-theme-muted hover:text-theme-main hover:bg-theme-muted transition-colors cursor-pointer"
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
                  SKU / N° Parte *
                </label>
                <input
                  type="text"
                  required
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="ej. PT-MAN-024"
                  className="w-full bg-theme-muted border border-theme-subtle rounded-xl px-3 py-2 text-xs font-mono font-bold text-theme-main focus:bg-theme-surface focus:outline-none focus:border-theme-primary"
                />
              </div>

              {/* Cliente / Marca */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-theme-main mb-1">
                  Cliente / Fabricante
                </label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full bg-theme-muted border border-theme-subtle rounded-xl px-3 py-2 text-xs font-semibold text-theme-main focus:outline-none focus:border-theme-primary"
                >
                  <option value="Stanley Black & Decker">Stanley Black & Decker</option>
                  <option value="Laboratorios Medifarma">Laboratorios Medifarma</option>
                  <option value="Schneider Electric">Schneider Electric</option>
                  <option value="Empaques Modernos del Norte">Empaques Modernos del Norte</option>
                  <option value="BioPapel / Fedrigoni">BioPapel / Fedrigoni</option>
                  <option value="Avery Dennison">Avery Dennison</option>
                  <option value="Sun Chemical">Sun Chemical</option>
                  <option value="Flint Group">Flint Group</option>
                  <option value="Smurfit Kappa">Smurfit Kappa</option>
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
                placeholder="ej. Manual instructivo 24 páginas Black & Decker"
                className="w-full bg-theme-muted border border-theme-subtle rounded-xl px-3 py-2 text-xs font-semibold text-theme-main focus:bg-theme-surface focus:outline-none focus:border-theme-primary"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Categoría */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-theme-main mb-1">
                  Categoría
                </label>
                <select
                  value={category}
                  onChange={(e) => {
                    const cat = e.target.value;
                    setCategory(cat);
                    setClassCode(cat === 'Producto Terminado' ? 'PT' : cat === 'Sustratos / Papel' ? 'SUS' : cat === 'Películas / Flexo' ? 'FLX' : cat === 'Tintas & Barnices' ? 'TNT' : 'EMP');
                    setGroupCode(cat === 'Producto Terminado' ? 'PT-MAN' : 'GEN');
                  }}
                  className="w-full bg-theme-muted border border-theme-subtle rounded-xl px-3 py-2 text-xs font-semibold text-theme-main focus:outline-none focus:border-theme-primary"
                >
                  <option value="Producto Terminado">Producto Terminado (PT)</option>
                  <option value="Sustratos / Papel">Sustratos / Papel (SUS)</option>
                  <option value="Películas / Flexo">Películas / Flexo (FLX)</option>
                  <option value="Tintas & Barnices">Tintas & Barnices (TNT)</option>
                  <option value="Empaque">Empaque (EMP)</option>
                </select>
              </div>

              {/* Tecnología */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-theme-main mb-1">
                  Tecnología
                </label>
                <select
                  value={technology}
                  onChange={(e) => setTechnology(e.target.value as any)}
                  className="w-full bg-theme-muted border border-theme-subtle rounded-xl px-3 py-2 text-xs font-semibold text-theme-main focus:outline-none focus:border-theme-primary"
                >
                  <option value="Offset">Offset</option>
                  <option value="Flexografía">Flexografía</option>
                  <option value="Serigrafía">Serigrafía</option>
                  <option value="N/A">N/A</option>
                </select>
              </div>

              {/* Medida / Presentación */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-theme-main mb-1">
                  Presentación / Medida
                </label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full bg-theme-muted border border-theme-subtle rounded-xl px-3 py-2 text-xs font-semibold text-theme-main focus:outline-none focus:border-theme-primary"
                >
                  <option value="Millar (1,000 pzas)">Millar (1,000 pzas)</option>
                  <option value="Pieza / Paquete">Pieza / Paquete</option>
                  <option value="Bobina Industrial">Bobina Industrial</option>
                  <option value="Rollo 4x6 pulgadas">Rollo 4x6 pulgadas</option>
                  <option value="Cubeta 20 Kg">Cubeta 20 Kg</option>
                  <option value="Tambor 200 Litros">Tambor 200 Litros</option>
                </select>
              </div>
            </div>

            {/* Logística y Almacén */}
            <div className="p-4 rounded-xl bg-theme-muted/50 border border-theme-subtle space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-theme-main flex items-center gap-1.5">
                <QrCode className="w-3.5 h-3.5 text-theme-primary" />
                Control de Almacén e Inventario
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-theme-muted uppercase mb-1">
                    Control de Trazabilidad
                  </label>
                  <select
                    value={serialization}
                    onChange={(e) => setSerialization(e.target.value as any)}
                    className="w-full bg-theme-surface border border-theme-subtle rounded-lg px-2.5 py-1.5 text-xs font-semibold text-theme-main focus:outline-none focus:border-theme-primary"
                  >
                    <option value="No serializado">Control por Lote & Ubicación (Estándar)</option>
                    <option value="Por unidad">Serialización Individual (Bobina / Tarima)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-theme-muted uppercase mb-1">
                    Peso Unitario / Empaque (Kg)
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
      </div>
    </ModalPortal>
  );
};
