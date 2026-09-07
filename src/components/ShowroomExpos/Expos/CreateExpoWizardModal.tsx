import React, { useState } from 'react';
import { 
  X, 
  Truck, 
  Calendar, 
  MapPin, 
  Boxes, 
  Tag, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  AlertTriangle,
  User,
  Phone
} from 'lucide-react';
import { ExpoRecord, ExpoUnitItem } from '../../../data/mockShowroomExposData';
import { ModalPortal } from '../../common/ModalPortal';
import { StatusBadge } from '../../common/StatusBadge';

interface CreateExpoWizardModalProps {
  onClose: () => void;
  onCreateExpo: (newExpo: ExpoRecord) => void;
  onShowToast?: (msg: string) => void;
}

export const CreateExpoWizardModal: React.FC<CreateExpoWizardModalProps> = ({
  onClose,
  onCreateExpo,
  onShowToast,
}) => {
  const [step, setStep] = useState<number>(1);

  // Form states
  const [expoFolio] = useState<string>(`EXPO-2026-00${Math.floor(10 + Math.random() * 40)}`);
  const [name, setName] = useState<string>('');
  const [venue, setVenue] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('01 Sep 2026');
  const [endDate, setEndDate] = useState<string>('04 Sep 2026');
  const [originFacilityId, setOriginFacilityId] = useState<string>('wh-reynosa');
  const [responsiblePerson, setResponsiblePerson] = useState<string>('Lic. Sofía Garza (Mkt & Eventos)');
  const [contactPhone, setContactPhone] = useState<string>('81 8399 2000');
  const [notes, setNotes] = useState<string>('');

  // Selected catalog items
  const [selectedArticles, setSelectedArticles] = useState<{ sku: string; qty: number }[]>([
    { sku: 'SC-RTM Impresos-FLOW-IND', qty: 2 },
    { sku: 'SC-RES-MNC-QS', qty: 1 },
  ]);

  const catalogOptions = [
    { sku: 'SC-RTM Impresos-FLOW-IND', name: 'RTM Impresos Muestrario Flow Basic Individual', brand: 'RTM Impresos', size: 'Individual', available: 18 },
    { sku: 'SC-RTM Impresos-FLOW-MAT', name: 'RTM Impresos Muestrario Flow Basic Matrimonial', brand: 'RTM Impresos', size: 'Matrimonial', available: 14 },
    { sku: 'SC-RTM Impresos-PRO-QS', name: 'RTM Impresos Muestrario Flow Pro Queen Size', brand: 'RTM Impresos', size: 'Queen Size', available: 12 },
    { sku: 'SC-RES-MNC-QS', name: 'RTM Offset Muestrario Moon Cool Queen Size', brand: 'RTM Offset', size: 'Queen Size', available: 14 },
    { sku: 'SC-SEA-CLB-KS', name: 'RTM Packaging Muestrario Crown Jewel King Size', brand: 'RTM Packaging', size: 'King Size', available: 8 },
  ];

  const totalUnitsCount = selectedArticles.reduce((acc, a) => acc + a.qty, 0);

  const handleToggleArticle = (sku: string) => {
    setSelectedArticles((prev) => {
      const exists = prev.find((a) => a.sku === sku);
      if (exists) {
        return prev.filter((a) => a.sku !== sku);
      } else {
        return [...prev, { sku, qty: 1 }];
      }
    });
  };

  const handleUpdateQty = (sku: string, qty: number) => {
    setSelectedArticles((prev) =>
      prev.map((a) => (a.sku === sku ? { ...a, qty: Math.max(1, qty) } : a))
    );
  };

  const handleFinalSubmit = () => {
    const uidsData: ExpoUnitItem[] = [];
    const items = selectedArticles.map((sa) => {
      const art = catalogOptions.find((c) => c.sku === sa.sku)!;
      const uids: string[] = [];
      for (let i = 0; i < sa.qty; i++) {
        const uidStr = `RTM-UID-2026-000${Math.floor(350 + Math.random() * 500)}`;
        uids.push(uidStr);
        uidsData.push({
          uid: uidStr,
          sku: art.sku,
          productName: art.name,
          brand: art.brand,
          size: art.size,
          originLocation: 'Almacén Sucursal',
          status: 'Apartada para exposición',
        });
      }
      return {
        sku: art.sku,
        productName: art.name,
        brand: art.brand,
        size: art.size,
        quantity: sa.qty,
        uids,
      };
    });

    const newExpo: ExpoRecord = {
      id: `expo-${Date.now()}`,
      folio: expoFolio,
      name: name || 'Exposición Comercial Monterrey',
      venue: venue || 'Cintermex - Sala C',
      address: address || 'Av. Fundidora #501, Monterrey, N.L.',
      startDate,
      endDate,
      originFacilityId,
      originFacilityName: originFacilityId === 'wh-reynosa' ? 'Planta Principal Reynosa' : originFacilityId === 'wh-matamoros' ? 'Almacén Satélite Matamoros' : 'Almacén Materia Prima',
      responsiblePerson,
      contactPhone,
      status: 'Planeada',
      totalUnits: totalUnitsCount,
      items,
      uidsData,
      operationalLinks: {
        pickOrderFolio: `OR-EXPO-2026-00${Math.floor(20 + Math.random() * 50)}`,
        outboundOrderFolio: `OS-2026-00${Math.floor(60 + Math.random() * 30)}`,
      },
      notes,
      createdAt: '28 Ago 2026',
    };

    onCreateExpo(newExpo);
    if (onShowToast) {
      onShowToast(`Exposición ${newExpo.folio} creada. Se apartaron ${totalUnitsCount} unidades físicas.`);
    }
    onClose();
  };

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-150">
        <div className="relative w-full max-w-2xl bg-theme-surface rounded-3xl border border-theme-subtle shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          
          <div className="flex items-center justify-between px-6 py-4 border-b border-theme-subtle bg-theme-muted/30">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center border border-blue-500/20">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-theme-main uppercase tracking-wider font-mono">
                  Nueva Exposición Externa &bull; Paso {step} de 5
                </h3>
                <p className="text-[11px] text-theme-muted">
                  Gestión y apartado de inventario para eventos fuera de instalaciones
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-theme-muted hover:text-theme-main hover:bg-theme-muted transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto space-y-4">
            
            {/* STEP 1: EVENT DETAILS */}
            {step === 1 && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-theme-main block">Nombre de la Exposición / Evento</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Expo Mueble & Hogar Cintermex 2026"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-theme-surface border border-theme-subtle text-xs text-theme-main font-semibold focus:outline-none focus:border-theme-primary"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-theme-main block">Sede / Recinto</label>
                    <input
                      type="text"
                      value={venue}
                      onChange={(e) => setVenue(e.target.value)}
                      placeholder="Ej. Cintermex - Sala C"
                      className="w-full px-3.5 py-2 rounded-xl bg-theme-surface border border-theme-subtle text-xs text-theme-main font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-theme-main block">Instalación Origen</label>
                    <select
                      value={originFacilityId}
                      onChange={(e) => setOriginFacilityId(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-theme-surface border border-theme-subtle text-xs text-theme-main font-semibold"
                    >
                      <option value="wh-reynosa">Planta Principal Reynosa</option>
                      <option value="wh-matamoros">Almacén Satélite Matamoros</option>
                      <option value="wh-mty-norte">Almacén Materia Prima</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-theme-main block">Fecha Inicio</label>
                    <input
                      type="text"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-theme-surface border border-theme-subtle text-xs text-theme-main font-semibold font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-theme-main block">Fecha Fin</label>
                    <input
                      type="text"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-theme-surface border border-theme-subtle text-xs text-theme-main font-semibold font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-theme-main block">Responsable del Evento</label>
                    <input
                      type="text"
                      value={responsiblePerson}
                      onChange={(e) => setResponsiblePerson(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-theme-surface border border-theme-subtle text-xs text-theme-main font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-theme-main block">Teléfono de Contacto</label>
                    <input
                      type="text"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-theme-surface border border-theme-subtle text-xs text-theme-main font-semibold"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: ARTICLES SELECTION */}
            {step === 2 && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <span className="text-xs font-bold text-theme-main block">
                  Selecciona los artículos que se exhibirán en la Expo:
                </span>

                <div className="space-y-2">
                  {catalogOptions.map((c) => {
                    const sel = selectedArticles.find((a) => a.sku === c.sku);
                    const isSelected = Boolean(sel);

                    return (
                      <div
                        key={c.sku}
                        className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-white border-zinc-900 shadow-sm'
                            : 'bg-theme-surface border-theme-subtle text-theme-muted'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <span className="font-mono text-[10px] font-bold text-theme-primary">{c.sku}</span>
                          <strong className="text-xs font-bold text-theme-main block">{c.name}</strong>
                          <span className="text-[10px] text-theme-muted">Disponibles en almacén: {c.available}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {isSelected && (
                            <div className="flex items-center gap-1 bg-theme-muted px-2 py-1 rounded-xl border border-theme-subtle">
                              <span className="text-[10px] font-bold text-theme-muted">Cant:</span>
                              <input
                                type="number"
                                min={1}
                                max={c.available}
                                value={sel?.qty || 1}
                                onChange={(e) => handleUpdateQty(c.sku, parseInt(e.target.value, 10))}
                                className="w-10 text-center font-mono font-bold text-xs bg-transparent focus:outline-none"
                              />
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => handleToggleArticle(c.sku)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-theme-primary text-white'
                                : 'bg-theme-muted text-theme-main hover:bg-theme-subtle'
                            }`}
                          >
                            {isSelected ? 'Incluido' : 'Agregar'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 3: UIDS APARTADO */}
            {step === 3 && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1 text-amber-900 text-xs">
                  <strong className="block font-bold">Apartado de inventario serializado ({totalUnitsCount} unidades)</strong>
                  <p className="text-[11px] leading-relaxed">
                    Al confirmar, las UIDs asignadas cambiarán automáticamente su estado a <strong>Apartada para exposición</strong> y no estarán disponibles para pedidos normales.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-2 text-xs">
                  {selectedArticles.map((sa) => {
                    const art = catalogOptions.find((c) => c.sku === sa.sku)!;
                    return (
                      <div key={sa.sku} className="flex items-center justify-between py-1 border-b border-zinc-100 last:border-0">
                        <div>
                          <strong className="text-zinc-900 font-bold block">{art.name}</strong>
                          <span className="font-mono text-[10px] text-zinc-500">{sa.sku}</span>
                        </div>
                        <span className="font-mono font-black text-theme-primary">{sa.qty} unidades apartadas</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 4: OUTBOUND LOGISTICS */}
            {step === 4 && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                    <span className="text-[10px] font-bold uppercase text-zinc-500">Tipo Operativo Logístico</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-500/15 text-blue-800 border border-blue-500/30">
                      EXPOSICIÓN EXTERNA
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-600 leading-relaxed">
                    A diferencia del Showroom interno, este evento genera automáticamente una <strong>Orden de Salida (OS)</strong> con remisión para transporte vehicular hacia la sede externa.
                  </p>
                </div>
              </div>
            )}

            {/* STEP 5: SUMMARY */}
            {step === 5 && (
              <div className="space-y-3 animate-in fade-in duration-150 text-xs">
                <div className="p-4 rounded-2xl bg-theme-muted/30 border border-theme-subtle space-y-2">
                  <div className="flex justify-between py-1 border-b border-theme-subtle">
                    <span className="text-theme-muted">Folio:</span>
                    <strong className="text-theme-main font-mono">{expoFolio}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-theme-subtle">
                    <span className="text-theme-muted">Nombre:</span>
                    <strong className="text-theme-main">{name || 'Exposición Comercial'}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-theme-subtle">
                    <span className="text-theme-muted">Sede:</span>
                    <strong className="text-theme-main">{venue || 'Cintermex'}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-theme-subtle">
                    <span className="text-theme-muted">Fechas:</span>
                    <strong className="text-theme-main font-mono">{startDate} &ndash; {endDate}</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-theme-muted">Unidades Apartadas:</span>
                    <strong className="text-theme-primary font-mono font-black">{totalUnitsCount} unidades</strong>
                  </div>
                </div>
              </div>
            )}

          </div>

          <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-theme-subtle bg-theme-muted/20">
            <button
              onClick={() => {
                if (step > 1) setStep(step - 1);
                else onClose();
              }}
              className="px-4 py-2 text-xs font-bold text-theme-muted hover:text-theme-main transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>{step === 1 ? 'Cancelar' : 'Anterior'}</span>
            </button>

            {step < 5 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-5 py-2.5 rounded-xl bg-theme-primary text-white text-xs font-bold hover:bg-theme-primary/90 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Continuar</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleFinalSubmit}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Confirmar y Crear Expo</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </ModalPortal>
  );
};
