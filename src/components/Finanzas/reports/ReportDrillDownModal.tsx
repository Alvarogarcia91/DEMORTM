import React, { useState } from 'react';
import {
  X,
  Layers,
  FileSpreadsheet,
  FileText,
  Building2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Calendar,
  DollarSign,
  Wrench,
  Printer
} from 'lucide-react';
import { ModalPortal } from '../../common/ModalPortal';
import { FinancialLine, INITIAL_FIXED_ASSETS, FixedAssetItem } from '../../../data/mockAccountingReportsData';

interface ReportDrillDownModalProps {
  line: FinancialLine;
  onClose: () => void;
  onNavigateToAsset?: (assetId: string) => void;
  onNavigateToMaintenance?: (machineCode: string) => void;
  onNavigateToInvoice?: (folio: string) => void;
}

const mx = (n: number) =>
  n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });

export const ReportDrillDownModal: React.FC<ReportDrillDownModalProps> = ({
  line,
  onClose,
  onNavigateToAsset,
  onNavigateToMaintenance,
  onNavigateToInvoice
}) => {
  const [selectedSubAccount, setSelectedSubAccount] = useState<string>('all');

  // Determinar activos vinculados si la línea es de maquinaria o depreciación
  const isAssetRelated = line.drillDownType === 'activos' || line.accountRef === '1201' || line.accountRef === '1202' || line.accountRef === '5103' || line.accountRef === '6103';

  const relevantAssets = isAssetRelated
    ? INITIAL_FIXED_ASSETS.filter((a) => {
        if (selectedSubAccount === 'offset') return a.area.includes('Offset');
        if (selectedSubAccount === 'flexo') return a.area.includes('Flexografía');
        if (selectedSubAccount === 'acabados') return a.area.includes('Acabados');
        if (selectedSubAccount === 'servicios') return a.area.includes('Servicios') || a.area.includes('TI') || a.area.includes('Logística');
        return true;
      })
    : [];

  return (
    <ModalPortal onClose={onClose}>
      <div className="w-full max-w-4xl rounded-3xl bg-theme-surface shadow-2xl border border-theme-subtle overflow-hidden max-h-[92vh] flex flex-col animate-scaleUp">
        {/* Header con Trazabilidad */}
        <div className="p-6 border-b border-theme-subtle bg-theme-surface flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-theme-primary/10 text-theme-primary">
                Trazabilidad Contable · Nivel 1 a 5
              </span>
              <span className="text-xs text-theme-muted">RTM Demo Financiero</span>
            </div>
            <h2 className="text-xl font-black text-theme-main flex items-center gap-2">
              {line.code && <span className="font-mono text-theme-primary">{line.code} ·</span>}
              {line.label}
            </h2>
            <p className="text-xs text-theme-muted mt-1">
              Desglose analítico desde el estado financiero hasta cuentas auxiliares, pólizas y documentos origen.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-theme-muted hover:text-theme-main hover:bg-theme-muted/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Resumen del Rubro */}
        <div className="px-6 py-4 bg-theme-muted/10 border-b border-theme-subtle grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase text-theme-muted block">Saldo Reportado</span>
            <b className="font-mono text-lg text-theme-main">{mx(line.currentAmount)}</b>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-theme-muted block">Periodo Anterior</span>
            <span className="font-mono text-sm text-theme-muted">{mx(line.previousAmount)}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-theme-muted block">Variación Neta</span>
            <span
              className={`font-mono text-sm font-bold ${
                line.varianceAmount >= 0 ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {line.varianceAmount >= 0 ? '+' : ''}
              {mx(line.varianceAmount)} ({line.variancePercent > 0 ? '+' : ''}
              {line.variancePercent}%)
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-theme-muted block">Cuentas Vinculadas</span>
            <span className="text-xs font-bold text-theme-primary">
              {line.accountRef || '1201 / 1202 / 5103'}
            </span>
          </div>
        </div>

        {/* Contenido con Scroll */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Nivel 2: Cuentas de Mayor y Subcuentas */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-theme-main flex items-center gap-2">
                <Layers className="w-4 h-4 text-theme-primary" />
                Nivel 2: Cuentas Contables y Subcuentas
              </h3>
              {isAssetRelated && (
                <div className="flex gap-1 bg-theme-muted/30 p-1 rounded-xl">
                  {[
                    { key: 'all', label: 'Todas' },
                    { key: 'offset', label: 'Offset' },
                    { key: 'flexo', label: 'Flexo' },
                    { key: 'acabados', label: 'Acabados' },
                    { key: 'servicios', label: 'Planta & TI' }
                  ].map((filter) => (
                    <button
                      key={filter.key}
                      onClick={() => setSelectedSubAccount(filter.key)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                        selectedSubAccount === filter.key
                          ? 'bg-theme-surface text-theme-main shadow-xs'
                          : 'text-theme-muted hover:text-theme-main'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {isAssetRelated ? (
                <>
                  <div className="p-3.5 rounded-2xl border border-theme-subtle bg-theme-surface">
                    <span className="text-[10px] font-mono text-theme-primary block">1201-01 · Offset</span>
                    <b className="text-xs text-theme-main block mt-1">Prensas Heidelberg, Harris & DiDDE</b>
                    <p className="font-mono text-sm font-bold mt-2">$9,600,000</p>
                    <small className="text-theme-muted">5 activos fabriles</small>
                  </div>
                  <div className="p-3.5 rounded-2xl border border-theme-subtle bg-theme-surface">
                    <span className="text-[10px] font-mono text-theme-primary block">1201-02 · Flexografía</span>
                    <b className="text-xs text-theme-main block mt-1">Línea Mark Andy, Scout & Rotoflex</b>
                    <p className="font-mono text-sm font-bold mt-2">$8,120,000</p>
                    <small className="text-theme-muted">7 activos en línea</small>
                  </div>
                  <div className="p-3.5 rounded-2xl border border-theme-subtle bg-theme-surface">
                    <span className="text-[10px] font-mono text-theme-primary block">1201-03 · Acabados</span>
                    <b className="text-xs text-theme-main block mt-1">Guillotina Polar & Stahlfolder</b>
                    <p className="font-mono text-sm font-bold mt-2">$3,110,000</p>
                    <small className="text-theme-muted">3 activos de corte</small>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-3.5 rounded-2xl border border-theme-subtle bg-theme-surface">
                    <span className="text-[10px] font-mono text-theme-primary block">Subcuenta Primaria</span>
                    <b className="text-xs text-theme-main block mt-1">Operaciones Principales</b>
                    <p className="font-mono text-sm font-bold mt-2">{mx(line.currentAmount * 0.72)}</p>
                    <small className="text-theme-muted">Movimientos ordinarios</small>
                  </div>
                  <div className="p-3.5 rounded-2xl border border-theme-subtle bg-theme-surface">
                    <span className="text-[10px] font-mono text-theme-primary block">Subcuenta Secundaria</span>
                    <b className="text-xs text-theme-main block mt-1">Operaciones Complementarias</b>
                    <p className="font-mono text-sm font-bold mt-2">{mx(line.currentAmount * 0.28)}</p>
                    <small className="text-theme-muted">Ajustes y conciliaciones</small>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Nivel 3: Detalle de Auxiliares o Activos */}
          {isAssetRelated && (
            <div>
              <h3 className="font-bold text-sm text-theme-main flex items-center gap-2 mb-3">
                <Building2 className="w-4 h-4 text-theme-primary" />
                Nivel 3: Auxiliares de Activos Fijos Individuales ({relevantAssets.length})
              </h3>

              <div className="border border-theme-subtle rounded-2xl overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-theme-muted/30 text-[10px] uppercase text-theme-muted">
                    <tr>
                      <th className="p-3 text-left">Clave</th>
                      <th className="p-3 text-left">Activo / Máquina</th>
                      <th className="p-3 text-left">Área</th>
                      <th className="p-3 text-right">Costo Histórico</th>
                      <th className="p-3 text-right">Deprec. Acum.</th>
                      <th className="p-3 text-right">Valor Neto</th>
                      <th className="p-3 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-theme-subtle">
                    {relevantAssets.slice(0, 7).map((asset) => (
                      <tr key={asset.id} className="hover:bg-theme-muted/20 transition-colors">
                        <td className="p-3 font-mono font-bold text-theme-primary">{asset.id}</td>
                        <td className="p-3">
                          <b className="block text-theme-main">{asset.name}</b>
                          <small className="text-theme-muted">{asset.brand} · {asset.model}</small>
                        </td>
                        <td className="p-3 text-theme-muted">{asset.area}</td>
                        <td className="p-3 text-right font-mono">{mx(asset.historicalCost)}</td>
                        <td className="p-3 text-right font-mono text-theme-muted">{mx(asset.accumulatedDepreciation)}</td>
                        <td className="p-3 text-right font-mono font-bold text-emerald-600">{mx(asset.netBookValue)}</td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {onNavigateToAsset && (
                              <button
                                onClick={() => {
                                  onClose();
                                  onNavigateToAsset(asset.id);
                                }}
                                title="Ver ficha en Activos Fijos"
                                className="p-1.5 rounded-lg border border-theme-subtle hover:bg-theme-primary hover:text-white transition-colors"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {asset.code && onNavigateToMaintenance && (
                              <button
                                onClick={() => {
                                  onClose();
                                  onNavigateToMaintenance(asset.code);
                                }}
                                title="Ver equipo en Mantenimiento"
                                className="p-1.5 rounded-lg border border-theme-subtle hover:bg-amber-500 hover:text-white transition-colors text-amber-600"
                              >
                                <Wrench className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Nivel 4: Pólizas Contables con Asientos Cuadrados */}
          <div>
            <h3 className="font-bold text-sm text-theme-main flex items-center gap-2 mb-3">
              <FileSpreadsheet className="w-4 h-4 text-theme-primary" />
              Nivel 4: Pólizas Contables del Periodo
            </h3>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl border border-theme-subtle bg-theme-surface">
                <div className="flex items-center justify-between pb-3 border-b border-theme-subtle text-xs">
                  <div>
                    <span className="font-mono font-bold text-theme-primary">
                      {isAssetRelated ? 'PDF-2026-009' : 'PV-2026-048'}
                    </span>
                    <span className="ml-2 font-medium text-theme-main">
                      {isAssetRelated
                        ? 'Depreciación ordinaria mensual de maquinaria industrial'
                        : 'Póliza concentradora de movimientos operativos'}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400">
                    Cuadrada & Contabilizada
                  </span>
                </div>

                <div className="mt-3 overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="text-[10px] text-theme-muted">
                      <tr>
                        <th className="text-left pb-2">Cuenta</th>
                        <th className="text-left pb-2">Concepto</th>
                        <th className="text-left pb-2">Centro de Costo</th>
                        <th className="text-right pb-2">Debe</th>
                        <th className="text-right pb-2">Haber</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-theme-subtle/50">
                      {isAssetRelated ? (
                        <>
                          <tr>
                            <td className="py-2 font-mono font-bold">5103-01</td>
                            <td className="py-2">Gasto Depreciación Fabril Offset</td>
                            <td className="py-2 text-theme-muted">CC-OFF-01</td>
                            <td className="py-2 text-right font-mono">{mx(71475)}</td>
                            <td className="py-2 text-right font-mono">$0</td>
                          </tr>
                          <tr>
                            <td className="py-2 font-mono font-bold">5103-02</td>
                            <td className="py-2">Gasto Depreciación Fabril Flexografía</td>
                            <td className="py-2 text-theme-muted">CC-FLX-01</td>
                            <td className="py-2 text-right font-mono">{mx(35025)}</td>
                            <td className="py-2 text-right font-mono">$0</td>
                          </tr>
                          <tr>
                            <td className="py-2 font-mono font-bold">1202-01</td>
                            <td className="py-2">Depreciación Acumulada Maquinaria</td>
                            <td className="py-2 text-theme-muted">Planta General</td>
                            <td className="py-2 text-right font-mono">$0</td>
                            <td className="py-2 text-right font-mono">{mx(106500)}</td>
                          </tr>
                        </>
                      ) : (
                        <>
                          <tr>
                            <td className="py-2 font-mono font-bold">1101-01</td>
                            <td className="py-2">Bancos Operativos MXN</td>
                            <td className="py-2 text-theme-muted">Tesorería</td>
                            <td className="py-2 text-right font-mono">{mx(line.currentAmount)}</td>
                            <td className="py-2 text-right font-mono">$0</td>
                          </tr>
                          <tr>
                            <td className="py-2 font-mono font-bold">1102-01</td>
                            <td className="py-2">Aplicación de Cartera</td>
                            <td className="py-2 text-theme-muted">Crédito y Cobranza</td>
                            <td className="py-2 text-right font-mono">$0</td>
                            <td className="py-2 text-right font-mono">{mx(line.currentAmount)}</td>
                          </tr>
                        </>
                      )}
                    </tbody>
                    <tfoot className="border-t border-theme-subtle font-bold text-xs">
                      <tr>
                        <td colSpan={3} className="pt-2 text-right">Sumas Iguales:</td>
                        <td className="pt-2 text-right font-mono text-emerald-600">
                          {isAssetRelated ? mx(106500) : mx(line.currentAmount)}
                        </td>
                        <td className="pt-2 text-right font-mono text-emerald-600">
                          {isAssetRelated ? mx(106500) : mx(line.currentAmount)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Nivel 5: Documentos Origen y Soporte */}
          <div>
            <h3 className="font-bold text-sm text-theme-main flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-theme-primary" />
              Nivel 5: Documentos Origen y Soporte Fiscal
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl border border-theme-subtle bg-theme-surface flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-theme-primary/10 text-theme-primary flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <b className="text-xs text-theme-main block">
                      {isAssetRelated ? 'OC-2018-0412 · Orden de Compra' : 'FAC-RTM-2026-0048'}
                    </b>
                    <small className="text-theme-muted">
                      {isAssetRelated ? 'Proveedor: Heidelberg México' : 'Cliente: TRICO TECHNOLOGIES'}
                    </small>
                  </div>
                </div>
                <span className="text-xs font-bold text-theme-primary font-mono">
                  {isAssetRelated ? '$3,200,000' : '$172,260'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl border border-theme-subtle bg-theme-surface flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <b className="text-xs text-theme-main block">
                      {isAssetRelated ? 'FP-882194 · Factura Proveedor' : 'Complemento SAT SPEI'}
                    </b>
                    <small className="text-theme-muted">CFDI 4.0 Validado ante SAT</small>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700">
                  Vigente
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-theme-subtle bg-theme-surface flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-theme-muted">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Auditoría digital enlazada al catálogo de cuentas y módulo de activos.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-theme-primary text-white hover:bg-theme-primary/90 transition-colors"
          >
            Cerrar Trazabilidad
          </button>
        </div>
      </div>
    </ModalPortal>
  );
};
