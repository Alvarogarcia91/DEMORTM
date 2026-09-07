import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Building2,
  FileText,
  DollarSign,
  Calendar,
  Layers,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { ModalPortal } from '../../common/ModalPortal';
import { FixedAssetItem } from '../../../data/mockAccountingReportsData';

interface NewAssetWizardModalProps {
  onClose: () => void;
  onSave: (asset: FixedAssetItem) => void;
  toast: (msg: string) => void;
  existingCount: number;
}

const mx = (n: number) =>
  n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });

export const NewAssetWizardModal: React.FC<NewAssetWizardModalProps> = ({
  onClose,
  onSave,
  toast,
  existingCount
}) => {
  const [step, setStep] = useState<number>(1);

  // Suggested ID
  const nextId = `AF-${String(existingCount + 1).padStart(4, '0')}`;

  // Form State
  const [formData, setFormData] = useState({
    name: 'Troqueladora Rotativa Automática TR-02',
    category: 'Acabado y Corte' as FixedAssetItem['category'],
    area: 'Acabados · Producción' as FixedAssetItem['area'],
    brand: 'Heidelberg Stahl',
    model: 'Rotary Die-Cutter TR-02 Plus',
    serialNumber: 'TR-02P-2026-0914',
    acquisitionDate: '2026-09-07',
    supplierName: 'Heidelberg México S.A. de C.V.',
    supplierRfc: 'HME920412KL9',
    purchaseOrderFolio: 'OC-2026-0412',
    supplierInvoiceFolio: 'FP-982194',
    historicalCost: 680000,
    residualValue: 68000,
    usefulLifeYears: 10,
    depreciationMethod: 'Línea recta (10% anual)' as FixedAssetItem['depreciationMethod'],
    accountingAccountAsset: '1201-03 Maquinaria Acabado y Corte',
    accountingAccountDep: '1202-03 Deprec. Acum. Acabados',
    accountingAccountExpense: '5103-03 Depreciación Fabril Acabados',
    location: 'Nave 1 · Bahía de Acabados y Troquel',
    costCenter: 'CC-ACA-01 Acabados' as FixedAssetItem['costCenter'],
    responsibleEmployee: 'Gonzalo Treviño',
    capexOrigin: 'CAPEX Acabados y Troquelado 2026'
  });

  // Calculated values
  const monthlyDep = Math.round((formData.historicalCost - formData.residualValue) / (formData.usefulLifeYears * 12));

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFinish = () => {
    const newAsset: FixedAssetItem = {
      id: nextId,
      code: `ACA-0${existingCount + 1}`,
      name: formData.name,
      category: formData.category,
      area: formData.area,
      brand: formData.brand,
      model: formData.model,
      serialNumber: formData.serialNumber,
      acquisitionDate: formData.acquisitionDate,
      supplierName: formData.supplierName,
      supplierRfc: formData.supplierRfc,
      purchaseOrderFolio: formData.purchaseOrderFolio,
      supplierInvoiceFolio: formData.supplierInvoiceFolio,
      historicalCost: Number(formData.historicalCost),
      residualValue: Number(formData.residualValue),
      usefulLifeYears: Number(formData.usefulLifeYears),
      depreciationMethod: formData.depreciationMethod,
      monthlyDepreciation: monthlyDep,
      accumulatedDepreciation: 0,
      netBookValue: Number(formData.historicalCost),
      remainingMonths: formData.usefulLifeYears * 12,
      accountingAccountAsset: formData.accountingAccountAsset,
      accountingAccountDep: formData.accountingAccountDep,
      accountingAccountExpense: formData.accountingAccountExpense,
      acquisitionPolicyFolio: `PAF-2026-${String(existingCount + 1).padStart(3, '0')}`,
      lastDepreciationPolicyFolio: 'PDF-2026-009',
      accountingStatus: 'Activo',
      operatingStatus: 'Operativo',
      location: formData.location,
      costCenter: formData.costCenter,
      responsibleEmployee: formData.responsibleEmployee,
      capexOrigin: formData.capexOrigin,
      documents: [
        {
          title: `Factura ${formData.supplierName}`,
          type: 'Factura Proveedor',
          folio: formData.supplierInvoiceFolio,
          fileSize: '1.4 MB'
        },
        {
          title: 'Orden de Compra Aprobada',
          type: 'Orden de Compra',
          folio: formData.purchaseOrderFolio,
          fileSize: '620 KB'
        }
      ],
      maintenanceSummary: {
        lastPreventiveDate: '07 Sep 2026',
        nextPreventiveDate: '07 Oct 2026',
        operatingHoursYtd: 0,
        activeWorkOrdersCount: 0,
        maintenanceCostYtd: 0,
        workOrderFolios: []
      }
    };

    onSave(newAsset);
    toast(`Activo ${nextId} (${formData.name}) dado de alta exitosamente en inventario contable`);
    onClose();
  };

  return (
    <ModalPortal onClose={onClose}>
      <div className="w-full max-w-2xl rounded-3xl bg-theme-surface shadow-2xl border border-theme-subtle overflow-hidden max-h-[92vh] flex flex-col animate-scaleUp text-xs">
        {/* Header con Progreso */}
        <div className="p-6 border-b border-theme-subtle bg-theme-surface flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-theme-primary px-2 py-0.5 rounded-md bg-theme-primary/10">
                Paso {step} de 5
              </span>
              <span className="text-xs text-theme-muted">· Alta Capitalizable RTM</span>
            </div>
            <h2 className="text-xl font-black text-theme-main">
              {step === 1 && '1. Identificación del Activo Fijo'}
              {step === 2 && '2. Compra y Documento Origen'}
              {step === 3 && '3. Ubicación y Centro de Costos'}
              {step === 4 && '4. Clasificación Contable & Depreciación'}
              {step === 5 && '5. Confirmación y Póliza de Activación'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-theme-muted hover:text-theme-main hover:bg-theme-muted/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de Pasos */}
        <div className="px-6 py-3 bg-theme-muted/10 border-b border-theme-subtle flex items-center justify-between">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className="flex items-center gap-1.5">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                  step === s
                    ? 'bg-theme-primary text-white'
                    : step > s
                    ? 'bg-emerald-500 text-white'
                    : 'bg-theme-muted/20 text-theme-muted'
                }`}
              >
                {step > s ? '✓' : s}
              </div>
              <span className={`text-[10px] hidden sm:inline ${step === s ? 'font-bold text-theme-main' : 'text-theme-muted'}`}>
                {s === 1 && 'Identificación'}
                {s === 2 && 'Compra'}
                {s === 3 && 'Ubicación'}
                {s === 4 && 'Contable'}
                {s === 5 && 'Confirmar'}
              </span>
            </div>
          ))}
        </div>

        {/* Contenido del Paso */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* PASO 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="p-3 bg-theme-primary/5 rounded-2xl border border-theme-primary/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-theme-muted block">Clave asignada:</span>
                  <b className="font-mono text-base text-theme-primary">{nextId}</b>
                </div>
                <span className="text-[11px] text-theme-muted">Generada automáticamente</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-theme-main mb-1">Nombre o Descripción del Activo</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-theme-subtle bg-theme-surface text-xs focus:ring-2 focus:ring-theme-primary/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-theme-main mb-1">Categoría</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-theme-subtle bg-theme-surface text-xs cursor-pointer"
                  >
                    <option>Maquinaria Offset</option>
                    <option>Maquinaria Flexografía</option>
                    <option>Acabado y Corte</option>
                    <option>Servicios de Planta</option>
                    <option>Equipo de Cómputo & TI</option>
                    <option>Mobiliario & Transporte</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-theme-main mb-1">Área Fabril</label>
                  <select
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-theme-subtle bg-theme-surface text-xs cursor-pointer"
                  >
                    <option>Offset · Producción</option>
                    <option>Flexografía · Producción</option>
                    <option>Acabados · Producción</option>
                    <option>Servicios · Planta</option>
                    <option>Administración · TI</option>
                    <option>Almacén · Logística</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-theme-main mb-1">Marca</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-theme-subtle bg-theme-surface text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-theme-main mb-1">Modelo</label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-theme-subtle bg-theme-surface text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-theme-main mb-1">Número de Serie</label>
                  <input
                    type="text"
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-theme-subtle bg-theme-surface text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PASO 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-theme-main mb-1">Proveedor</label>
                  <input
                    type="text"
                    value={formData.supplierName}
                    onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-theme-subtle bg-theme-surface text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-theme-main mb-1">RFC Proveedor</label>
                  <input
                    type="text"
                    value={formData.supplierRfc}
                    onChange={(e) => setFormData({ ...formData, supplierRfc: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-theme-subtle bg-theme-surface text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-theme-main mb-1">Orden de Compra Origen</label>
                  <input
                    type="text"
                    value={formData.purchaseOrderFolio}
                    onChange={(e) => setFormData({ ...formData, purchaseOrderFolio: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-theme-subtle bg-theme-surface text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-theme-main mb-1">Factura Fiscal Proveedor</label>
                  <input
                    type="text"
                    value={formData.supplierInvoiceFolio}
                    onChange={(e) => setFormData({ ...formData, supplierInvoiceFolio: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-theme-subtle bg-theme-surface text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-theme-main mb-1">Costo Histórico de Adquisición (MXN)</label>
                  <input
                    type="number"
                    value={formData.historicalCost}
                    onChange={(e) => setFormData({ ...formData, historicalCost: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-theme-subtle bg-theme-surface text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-theme-main mb-1">Fecha de Adquisición</label>
                  <input
                    type="date"
                    value={formData.acquisitionDate}
                    onChange={(e) => setFormData({ ...formData, acquisitionDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-theme-subtle bg-theme-surface text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PASO 3 */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-theme-main mb-1">Ubicación Física en Planta</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-theme-subtle bg-theme-surface text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-theme-main mb-1">Centro de Costos</label>
                  <select
                    value={formData.costCenter}
                    onChange={(e) => setFormData({ ...formData, costCenter: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-theme-subtle bg-theme-surface text-xs cursor-pointer"
                  >
                    <option>CC-OFF-01 Offset</option>
                    <option>CC-FLX-01 Flexo</option>
                    <option>CC-ACA-01 Acabados</option>
                    <option>CC-PLT-01 Servicios</option>
                    <option>CC-ADM-01 Administración</option>
                    <option>CC-ALM-01 Logística</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-theme-main mb-1">Responsable del Equipo</label>
                  <input
                    type="text"
                    value={formData.responsibleEmployee}
                    onChange={(e) => setFormData({ ...formData, responsibleEmployee: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-theme-subtle bg-theme-surface text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-theme-main mb-1">Origen de Presupuesto / CAPEX</label>
                <input
                  type="text"
                  value={formData.capexOrigin}
                  onChange={(e) => setFormData({ ...formData, capexOrigin: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-theme-subtle bg-theme-surface text-xs"
                />
              </div>
            </div>
          )}

          {/* PASO 4 */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-theme-main mb-1">Vida Útil (Años)</label>
                  <input
                    type="number"
                    value={formData.usefulLifeYears}
                    onChange={(e) => setFormData({ ...formData, usefulLifeYears: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-theme-subtle bg-theme-surface text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-theme-main mb-1">Valor Residual / Desecho (MXN)</label>
                  <input
                    type="number"
                    value={formData.residualValue}
                    onChange={(e) => setFormData({ ...formData, residualValue: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-theme-subtle bg-theme-surface text-xs font-mono"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-theme-muted/10 border border-theme-subtle space-y-2">
                <span className="text-[10px] font-bold uppercase text-theme-muted block">Cálculo de Depreciación Mensual Estimada:</span>
                <b className="font-mono text-xl text-theme-primary block">{mx(monthlyDep)} / mes</b>
                <small className="text-theme-muted">
                  Base depreciable: {mx(formData.historicalCost - formData.residualValue)} en {formData.usefulLifeYears * 12} meses
                </small>
              </div>

              <div>
                <label className="block text-xs font-bold text-theme-main mb-1">Cuenta Contable de Activo</label>
                <input
                  type="text"
                  value={formData.accountingAccountAsset}
                  onChange={(e) => setFormData({ ...formData, accountingAccountAsset: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-theme-subtle bg-theme-surface text-xs font-mono"
                />
              </div>
            </div>
          )}

          {/* PASO 5 */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl border border-theme-primary/30 bg-theme-primary/5 space-y-3">
                <div className="flex items-center gap-2 text-theme-primary font-bold text-sm">
                  <ShieldCheck className="w-5 h-5" />
                  Resumen de Póliza de Activación Contable
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-theme-muted">Activo:</span>
                    <b className="block text-theme-main">{nextId} · {formData.name}</b>
                  </div>
                  <div>
                    <span className="text-theme-muted">Costo Activado:</span>
                    <b className="block font-mono text-theme-main">{mx(formData.historicalCost)}</b>
                  </div>
                  <div>
                    <span className="text-theme-muted">Depreciación Mensual:</span>
                    <b className="block font-mono text-theme-primary">{mx(monthlyDep)} / mes</b>
                  </div>
                  <div>
                    <span className="text-theme-muted">Centro de Costo:</span>
                    <b className="block font-mono text-theme-main">{formData.costCenter}</b>
                  </div>
                </div>
              </div>

              <p className="text-xs text-theme-muted">
                Al confirmar, el activo se registrará en el catálogo contable, actualizará el valor neto en libros,
                generará la póliza de alta y se reflejará en el Estado de Situación Financiera.
              </p>
            </div>
          )}
        </div>

        {/* Footer con Navegación */}
        <div className="p-4 border-t border-theme-subtle bg-theme-surface flex items-center justify-between">
          <button
            onClick={step === 1 ? onClose : handlePrev}
            className="px-4 py-2 rounded-xl border border-theme-subtle text-xs font-bold text-theme-main hover:bg-theme-muted/20 transition-colors flex items-center gap-1"
          >
            {step === 1 ? 'Cancelar' : <><ChevronLeft className="w-3.5 h-3.5" /> Anterior</>}
          </button>

          {step < 5 ? (
            <button
              onClick={handleNext}
              className="px-5 py-2 rounded-xl bg-theme-primary text-white text-xs font-bold hover:bg-theme-primary/90 transition-colors flex items-center gap-1"
            >
              Siguiente
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-md"
            >
              <CheckCircle2 className="w-4 h-4" />
              Confirmar Alta de Activo
            </button>
          )}
        </div>
      </div>
    </ModalPortal>
  );
};
