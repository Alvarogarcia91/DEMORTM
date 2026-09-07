import React, { useState } from 'react';
import {
  X,
  Building2,
  Calendar,
  DollarSign,
  FileText,
  Wrench,
  Layers,
  History,
  ShieldCheck,
  Download,
  ExternalLink,
  Clock,
  User,
  MapPin
} from 'lucide-react';
import { ModalPortal } from '../../common/ModalPortal';
import { FixedAssetItem, INITIAL_ASSET_MOVEMENTS } from '../../../data/mockAccountingReportsData';

interface AssetDetailModalProps {
  asset: FixedAssetItem;
  onClose: () => void;
  onNavigateToMaintenance?: (machineCode: string) => void;
  toast: (msg: string) => void;
}

const mx = (n: number) =>
  n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({
  asset,
  onClose,
  onNavigateToMaintenance,
  toast
}) => {
  const [activeTab, setActiveTab] = useState<'General' | 'Depreciación' | 'Contabilidad' | 'Documentos' | 'Mantenimiento' | 'Movimientos'>('General');

  const assetMovements = INITIAL_ASSET_MOVEMENTS.filter((m) => m.assetId === asset.id);

  return (
    <ModalPortal onClose={onClose}>
      <div className="w-full max-w-4xl rounded-3xl bg-theme-surface shadow-2xl border border-theme-subtle overflow-hidden max-h-[92vh] flex flex-col animate-scaleUp text-xs">
        {/* Header de la Ficha */}
        <div className="p-6 border-b border-theme-subtle bg-theme-surface flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-theme-primary/10 text-theme-primary flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-theme-primary px-2 py-0.5 rounded-md bg-theme-primary/10">
                  {asset.id}
                </span>
                {asset.code && (
                  <span className="font-mono text-xs font-bold text-theme-muted px-2 py-0.5 rounded-md bg-theme-muted/20">
                    Cód: {asset.code}
                  </span>
                )}
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                  ● {asset.accountingStatus}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    asset.operatingStatus === 'Operativo'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {asset.operatingStatus}
                </span>
              </div>
              <h2 className="text-xl font-black text-theme-main">{asset.name}</h2>
              <p className="text-xs text-theme-muted mt-0.5">
                {asset.area} · {asset.brand} {asset.model} (Serie: {asset.serialNumber})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-theme-muted hover:text-theme-main hover:bg-theme-muted/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de Tabs Amplia */}
        <div className="px-6 border-b border-theme-subtle bg-theme-muted/10 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {(['General', 'Depreciación', 'Contabilidad', 'Documentos', 'Mantenimiento', 'Movimientos'] as const).map(
            (tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
                    isActive
                      ? 'border-theme-primary text-theme-primary'
                      : 'border-transparent text-theme-muted hover:text-theme-main'
                  }`}
                >
                  {tab}
                </button>
              );
            }
          )}
        </div>

        {/* Contenido con Scroll */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: GENERAL */}
          {activeTab === 'General' && (
            <div className="space-y-6">
              {/* KPIs Rápidos */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl border border-theme-subtle bg-theme-surface">
                  <span className="text-[10px] uppercase font-bold text-theme-muted block">Costo Histórico</span>
                  <b className="font-mono text-base text-theme-main block mt-1">{mx(asset.historicalCost)}</b>
                  <small className="text-theme-muted">Adquisición: {asset.acquisitionDate}</small>
                </div>
                <div className="p-3.5 rounded-2xl border border-theme-subtle bg-theme-surface">
                  <span className="text-[10px] uppercase font-bold text-theme-muted block">Deprec. Acumulada</span>
                  <b className="font-mono text-base text-theme-muted block mt-1">{mx(asset.accumulatedDepreciation)}</b>
                  <small className="text-theme-muted">{asset.depreciationMethod}</small>
                </div>
                <div className="p-3.5 rounded-2xl border border-theme-subtle bg-theme-surface">
                  <span className="text-[10px] uppercase font-bold text-theme-muted block">Valor Neto en Libros</span>
                  <b className="font-mono text-base text-emerald-600 block mt-1">{mx(asset.netBookValue)}</b>
                  <small className="text-emerald-600 font-bold">{asset.remainingMonths} meses restantes</small>
                </div>
                <div className="p-3.5 rounded-2xl border border-theme-subtle bg-theme-surface">
                  <span className="text-[10px] uppercase font-bold text-theme-muted block">Deprec. Mensual</span>
                  <b className="font-mono text-base text-theme-primary block mt-1">{mx(asset.monthlyDepreciation)}</b>
                  <small className="text-theme-muted">Póliza PDF-2026-009</small>
                </div>
              </div>

              {/* Ficha Técnica y Origen */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl border border-theme-subtle bg-theme-surface space-y-3">
                  <h4 className="font-bold text-xs uppercase text-theme-muted">Datos Técnicos y Ubicación</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between py-1 border-b border-theme-subtle/50">
                      <span className="text-theme-muted">Categoría:</span>
                      <b className="text-theme-main">{asset.category}</b>
                    </div>
                    <div className="flex justify-between py-1 border-b border-theme-subtle/50">
                      <span className="text-theme-muted">Marca y Modelo:</span>
                      <b className="text-theme-main">{asset.brand} · {asset.model}</b>
                    </div>
                    <div className="flex justify-between py-1 border-b border-theme-subtle/50">
                      <span className="text-theme-muted">Número de Serie:</span>
                      <b className="font-mono text-theme-main">{asset.serialNumber}</b>
                    </div>
                    <div className="flex justify-between py-1 border-b border-theme-subtle/50">
                      <span className="text-theme-muted">Ubicación en Planta:</span>
                      <b className="text-theme-main">{asset.location}</b>
                    </div>
                    <div className="flex justify-between py-1 border-b border-theme-subtle/50">
                      <span className="text-theme-muted">Centro de Costos:</span>
                      <b className="font-mono text-theme-primary">{asset.costCenter}</b>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-theme-muted">Responsable:</span>
                      <b className="text-theme-main">{asset.responsibleEmployee}</b>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-theme-subtle bg-theme-surface space-y-3">
                  <h4 className="font-bold text-xs uppercase text-theme-muted">Adquisición y Documentos Origen</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between py-1 border-b border-theme-subtle/50">
                      <span className="text-theme-muted">Proveedor:</span>
                      <b className="text-theme-main">{asset.supplierName}</b>
                    </div>
                    <div className="flex justify-between py-1 border-b border-theme-subtle/50">
                      <span className="text-theme-muted">RFC Proveedor:</span>
                      <b className="font-mono text-theme-main">{asset.supplierRfc}</b>
                    </div>
                    <div className="flex justify-between py-1 border-b border-theme-subtle/50">
                      <span className="text-theme-muted">Orden de Compra:</span>
                      <b className="font-mono text-theme-primary">{asset.purchaseOrderFolio}</b>
                    </div>
                    <div className="flex justify-between py-1 border-b border-theme-subtle/50">
                      <span className="text-theme-muted">Factura Proveedor:</span>
                      <b className="font-mono text-theme-primary">{asset.supplierInvoiceFolio}</b>
                    </div>
                    <div className="flex justify-between py-1 border-b border-theme-subtle/50">
                      <span className="text-theme-muted">Origen de Presupuesto:</span>
                      <b className="text-theme-main">{asset.capexOrigin || 'Gasto Corriente'}</b>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-theme-muted">Valor Residual:</span>
                      <b className="font-mono text-theme-muted">{mx(asset.residualValue)}</b>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DEPRECIACIÓN */}
          {activeTab === 'Depreciación' && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl border border-theme-subtle bg-theme-surface">
                <h4 className="font-bold text-sm text-theme-main mb-2">Plan y Método de Depreciación</h4>
                <p className="text-xs text-theme-muted mb-4">
                  Cálculo contable bajo método de línea recta a {asset.usefulLifeYears} años ({asset.depreciationMethod}).
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                  <div className="p-3 bg-theme-muted/10 rounded-xl">
                    <span className="text-[10px] text-theme-muted block">Vida Útil Total</span>
                    <b className="text-sm">{asset.usefulLifeYears * 12} meses ({asset.usefulLifeYears} años)</b>
                  </div>
                  <div className="p-3 bg-theme-muted/10 rounded-xl">
                    <span className="text-[10px] text-theme-muted block">Meses Depreciados</span>
                    <b className="text-sm font-mono text-theme-primary">
                      {asset.usefulLifeYears * 12 - asset.remainingMonths} meses
                    </b>
                  </div>
                  <div className="p-3 bg-theme-muted/10 rounded-xl">
                    <span className="text-[10px] text-theme-muted block">Meses Remanentes</span>
                    <b className="text-sm font-mono text-emerald-600">{asset.remainingMonths} meses</b>
                  </div>
                  <div className="p-3 bg-theme-muted/10 rounded-xl">
                    <span className="text-[10px] text-theme-muted block">Depreciación Mensual</span>
                    <b className="text-sm font-mono text-theme-main">{mx(asset.monthlyDepreciation)}</b>
                  </div>
                </div>

                {/* Barra de Progreso de Depreciación */}
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-theme-muted">Progreso de Amortización</span>
                    <b className="font-mono">
                      {Math.round((asset.accumulatedDepreciation / asset.historicalCost) * 100)}%
                    </b>
                  </div>
                  <div className="h-3 rounded-full bg-theme-muted/20 overflow-hidden">
                    <div
                      className="h-full bg-theme-primary rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, Math.round((asset.accumulatedDepreciation / asset.historicalCost) * 100))}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CONTABILIDAD */}
          {activeTab === 'Contabilidad' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl border border-theme-subtle bg-theme-surface">
                <h4 className="font-bold text-sm text-theme-main mb-3">Mapeo y Cuentas Contables</h4>
                <div className="space-y-2">
                  <div className="flex justify-between p-3 rounded-xl border border-theme-subtle bg-theme-muted/5">
                    <div>
                      <b className="block text-theme-main">Cuenta de Activo Fijo</b>
                      <small className="text-theme-muted">Registra el costo de adquisición original</small>
                    </div>
                    <span className="font-mono font-bold text-theme-primary text-sm">
                      {asset.accountingAccountAsset}
                    </span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl border border-theme-subtle bg-theme-muted/5">
                    <div>
                      <b className="block text-theme-main">Cuenta de Depreciación Acumulada</b>
                      <small className="text-theme-muted">Cuenta complementaria de activo de saldo acreedor</small>
                    </div>
                    <span className="font-mono font-bold text-theme-primary text-sm">
                      {asset.accountingAccountDep}
                    </span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl border border-theme-subtle bg-theme-muted/5">
                    <div>
                      <b className="block text-theme-main">Cuenta de Gasto / Costo</b>
                      <small className="text-theme-muted">Afecta el costo de ventas fabril o gasto operativo</small>
                    </div>
                    <span className="font-mono font-bold text-theme-primary text-sm">
                      {asset.accountingAccountExpense}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-theme-subtle bg-theme-surface flex items-center justify-between">
                <div>
                  <b className="text-theme-main block">Póliza de Alta Inicial</b>
                  <span className="font-mono text-theme-primary">{asset.acquisitionPolicyFolio}</span>
                  <small className="text-theme-muted ml-2">· Asiento inicial con proveedor</small>
                </div>
                <div>
                  <b className="text-theme-main block">Última Póliza Mensual</b>
                  <span className="font-mono text-emerald-600">{asset.lastDepreciationPolicyFolio}</span>
                  <small className="text-theme-muted ml-2">· Septiembre 2026</small>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DOCUMENTOS */}
          {activeTab === 'Documentos' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {asset.documents.map((doc, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl border border-theme-subtle bg-theme-surface flex items-center justify-between hover:border-theme-primary/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-theme-primary/10 text-theme-primary flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <b className="text-theme-main block">{doc.title}</b>
                        <span className="font-mono text-theme-muted text-[11px]">{doc.folio} · {doc.fileSize}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => toast(`Descargando ${doc.title} (${doc.folio}) · Demo`)}
                      className="p-2 rounded-lg border border-theme-subtle hover:bg-theme-primary hover:text-white transition-colors"
                      title="Descargar documento"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: MANTENIMIENTO */}
          {activeTab === 'Mantenimiento' && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl border border-theme-subtle bg-theme-surface space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-theme-main">Historial Operativo y Mantenimiento Industrial</h4>
                    <p className="text-xs text-theme-muted">
                      Información enlazada al módulo de Mantenimiento de Planta RTM.
                    </p>
                  </div>
                  {asset.code && onNavigateToMaintenance && (
                    <button
                      onClick={() => {
                        onClose();
                        onNavigateToMaintenance(asset.code);
                      }}
                      className="px-3 py-2 rounded-xl bg-amber-500 text-white font-bold flex items-center gap-1.5 hover:bg-amber-600 transition-colors"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      Ver equipo en Mantenimiento
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3.5 bg-theme-muted/10 rounded-xl">
                    <span className="text-[10px] text-theme-muted block">Horas Operadas YTD</span>
                    <b className="text-sm font-mono">{asset.maintenanceSummary.operatingHoursYtd} hrs</b>
                  </div>
                  <div className="p-3.5 bg-theme-muted/10 rounded-xl">
                    <span className="text-[10px] text-theme-muted block">Último Preventivo</span>
                    <b className="text-sm">{asset.maintenanceSummary.lastPreventiveDate}</b>
                  </div>
                  <div className="p-3.5 bg-theme-muted/10 rounded-xl">
                    <span className="text-[10px] text-theme-muted block">Próximo Preventivo</span>
                    <b className="text-sm text-theme-primary">{asset.maintenanceSummary.nextPreventiveDate}</b>
                  </div>
                  <div className="p-3.5 bg-theme-muted/10 rounded-xl">
                    <span className="text-[10px] text-theme-muted block">Costo Mantenimiento YTD</span>
                    <b className="text-sm font-mono text-theme-main">
                      {mx(asset.maintenanceSummary.maintenanceCostYtd)}
                    </b>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold text-theme-main block mb-2">Órdenes de Trabajo Recientes:</span>
                  <div className="flex gap-2">
                    {asset.maintenanceSummary.workOrderFolios.map((folio) => (
                      <span
                        key={folio}
                        className="px-2.5 py-1 rounded-lg border border-theme-subtle font-mono text-xs font-bold bg-theme-surface"
                      >
                        {folio}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: MOVIMIENTOS */}
          {activeTab === 'Movimientos' && (
            <div className="space-y-4">
              <div className="border border-theme-subtle rounded-2xl overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-theme-muted/30 text-[10px] uppercase text-theme-muted">
                    <tr>
                      <th className="p-3 text-left">Fecha</th>
                      <th className="p-3 text-left">Tipo de Movimiento</th>
                      <th className="p-3 text-left">Póliza / Folio</th>
                      <th className="p-3 text-right">Importe</th>
                      <th className="p-3 text-left">Responsable</th>
                      <th className="p-3 text-left">Observaciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-theme-subtle">
                    {assetMovements.map((mov) => (
                      <tr key={mov.id} className="hover:bg-theme-muted/20">
                        <td className="p-3 text-theme-muted">{mov.date}</td>
                        <td className="p-3 font-bold text-theme-main">{mov.type}</td>
                        <td className="p-3 font-mono text-theme-primary">{mov.folio}</td>
                        <td className="p-3 text-right font-mono font-bold">
                          {mov.amount ? mx(mov.amount) : '—'}
                        </td>
                        <td className="p-3 text-theme-muted">{mov.responsible}</td>
                        <td className="p-3 text-theme-muted">{mov.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-theme-subtle bg-theme-surface flex items-center justify-between">
          <div className="flex items-center gap-2 text-theme-muted">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Registro contable oficial validado con póliza de activación.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toast(`Generando ficha técnica descargable de ${asset.name} · Demo`)}
              className="px-3 py-1.5 rounded-xl border border-theme-subtle text-xs font-bold text-theme-main hover:bg-theme-muted/20 transition-colors"
            >
              Exportar Ficha
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-theme-primary text-white text-xs font-bold hover:bg-theme-primary/90 transition-colors"
            >
              Cerrar Ficha
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};
