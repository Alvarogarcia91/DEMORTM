import React, { useState, useMemo } from 'react';
import {
  Download,
  Plus,
  Wrench,
  Search,
  Filter,
  Building2,
  TrendingUp,
  Clock,
  Layers,
  ShieldCheck,
  Coins,
  CheckCircle2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import {
  FixedAssetItem,
  INITIAL_FIXED_ASSETS,
  INITIAL_ASSET_MOVEMENTS,
  AssetMovement
} from '../../data/mockAccountingReportsData';
import { AssetDetailModal } from './assets/AssetDetailModal';
import { NewAssetWizardModal } from './assets/NewAssetWizardModal';

interface AssetsWorkspaceProps {
  toast: (msg: string) => void;
  onNavigateToMaintenance?: (machineCode: string) => void;
}

const mx = (n: number) =>
  n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });

export const AssetsWorkspace: React.FC<AssetsWorkspaceProps> = ({
  toast,
  onNavigateToMaintenance
}) => {
  const [tab, setTab] = useState<'Resumen' | 'Inventario' | 'Depreciación' | 'Movimientos' | 'CAPEX'>('Inventario');
  const [assets, setAssets] = useState<FixedAssetItem[]>(INITIAL_FIXED_ASSETS);
  const [movements, setMovements] = useState<AssetMovement[]>(INITIAL_ASSET_MOVEMENTS);

  // Filter and search
  const [searchQuery, setSearchQuery] = useState('');
  const [areaFilter, setAreaFilter] = useState('Todas');
  const [statusFilter, setStatusFilter] = useState('Todos');

  // Modals
  const [selectedAsset, setSelectedAsset] = useState<FixedAssetItem | null>(null);
  const [isNewAssetModalOpen, setIsNewAssetModalOpen] = useState(false);

  // Financial totals derived from live assets state
  const metrics = useMemo(() => {
    const totalCost = assets.reduce((sum, a) => sum + a.historicalCost, 0);
    const totalDep = assets.reduce((sum, a) => sum + a.accumulatedDepreciation, 0);
    const netValue = totalCost - totalDep;
    const monthlyDep = assets.reduce((sum, a) => sum + a.monthlyDepreciation, 0);
    const inMaintenance = assets.filter((a) => a.operatingStatus === 'Mantenimiento').length;
    return { totalCost, totalDep, netValue, monthlyDep, inMaintenance };
  }, [assets]);

  // Filtered assets
  const filteredAssets = useMemo(() => {
    return assets.filter((a) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (a.code && a.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
        a.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.serialNumber.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesArea =
        areaFilter === 'Todas' ||
        (areaFilter === 'Offset' && a.area.includes('Offset')) ||
        (areaFilter === 'Flexografía' && a.area.includes('Flexografía')) ||
        (areaFilter === 'Acabados' && a.area.includes('Acabados')) ||
        (areaFilter === 'Planta' && (a.area.includes('Servicios') || a.area.includes('Logística'))) ||
        (areaFilter === 'TI' && a.area.includes('TI'));

      const matchesStatus =
        statusFilter === 'Todos' ||
        a.operatingStatus === statusFilter ||
        a.accountingStatus === statusFilter;

      return matchesSearch && matchesArea && matchesStatus;
    });
  }, [assets, searchQuery, areaFilter, statusFilter]);

  // Handle new asset created from wizard
  const handleAddNewAsset = (newAsset: FixedAssetItem) => {
    setAssets((prev) => [newAsset, ...prev]);

    // Create corresponding movement
    const newMovement: AssetMovement = {
      id: `MOV-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }),
      assetId: newAsset.id,
      assetName: newAsset.name,
      type: 'Alta',
      folio: newAsset.acquisitionPolicyFolio,
      amount: newAsset.historicalCost,
      responsible: 'C.P. Mónica Villarreal',
      notes: `Alta capitalizable según orden de compra ${newAsset.purchaseOrderFolio} y factura ${newAsset.supplierInvoiceFolio}.`
    };

    setMovements((prev) => [newMovement, ...prev]);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Barra Superior con Pestañas y Botones de Acción */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex gap-1 p-1 rounded-2xl bg-theme-muted/40 w-fit">
          {(['Resumen', 'Inventario', 'Depreciación', 'Movimientos', 'CAPEX'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all ${
                tab === t
                  ? 'bg-theme-surface text-theme-main shadow-xs'
                  : 'text-theme-muted hover:text-theme-main'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsNewAssetModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-theme-primary text-white text-xs font-bold hover:bg-theme-primary/90 flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Nuevo Activo
          </button>
          <button
            onClick={() => toast('Exportando padrón de activos fijos a formato Excel XLSX · Demo')}
            className="px-3 py-2 rounded-xl border border-theme-subtle bg-theme-surface text-xs font-bold text-theme-main hover:border-theme-primary/40 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Exportar
          </button>
        </div>
      </div>

      {/* Tarjetas de Métricas Globales Coherentes con el Balance */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-2xl border border-theme-subtle bg-theme-surface shadow-2xs">
          <span className="text-[10px] font-black uppercase text-theme-muted block">Costo Histórico</span>
          <b className="font-mono text-xl text-theme-main block mt-1.5">{mx(metrics.totalCost)}</b>
          <span className="text-[11px] text-theme-muted">{assets.length} activos registrados</span>
        </div>

        <div className="p-4 rounded-2xl border border-theme-subtle bg-theme-surface shadow-2xs">
          <span className="text-[10px] font-black uppercase text-theme-muted block">Deprec. Acumulada</span>
          <b className="font-mono text-xl text-theme-muted block mt-1.5">{mx(metrics.totalDep)}</b>
          <span className="text-[11px] text-theme-muted">Amortización en línea recta</span>
        </div>

        <div className="p-4 rounded-2xl border border-theme-subtle bg-theme-surface shadow-2xs">
          <span className="text-[10px] font-black uppercase text-theme-muted block">Valor Neto en Libros</span>
          <b className="font-mono text-xl text-emerald-600 block mt-1.5">{mx(metrics.netValue)}</b>
          <span className="text-[11px] text-emerald-600 font-bold">Cuadrado con Balance General</span>
        </div>

        <div className="p-4 rounded-2xl border border-theme-subtle bg-theme-surface shadow-2xs">
          <span className="text-[10px] font-black uppercase text-theme-muted block">Depreciación Mensual</span>
          <b className="font-mono text-xl text-theme-primary block mt-1.5">{mx(metrics.monthlyDep)}</b>
          <span className="text-[11px] text-theme-muted">Póliza PDF-2026-009</span>
        </div>

        <div className="p-4 rounded-2xl border border-theme-subtle bg-theme-surface shadow-2xs col-span-2 lg:col-span-1">
          <span className="text-[10px] font-black uppercase text-theme-muted block">En Mantenimiento</span>
          <div className="flex items-center gap-2 mt-1.5">
            <b className="font-mono text-xl text-amber-600">{metrics.inMaintenance}</b>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400">
              Stahlfolder Ti-52
            </span>
          </div>
          <span className="text-[11px] text-theme-muted">OT-MANT-2026-092 abierta</span>
        </div>
      </div>

      {/* TAB: INVENTARIO */}
      {tab === 'Inventario' && (
        <div className="space-y-4">
          {/* Barra de Filtros y Búsqueda */}
          <div className="p-4 rounded-2xl border border-theme-subtle bg-theme-surface flex flex-wrap items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
              <input
                type="text"
                placeholder="Buscar por nombre, clave, serie, código..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-theme-subtle bg-theme-surface focus:outline-none focus:ring-2 focus:ring-theme-primary/30"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 bg-theme-muted/20 rounded-xl px-3 py-1 text-xs">
                <span className="text-theme-muted">Área:</span>
                <select
                  value={areaFilter}
                  onChange={(e) => setAreaFilter(e.target.value)}
                  className="bg-transparent border-none text-xs font-bold text-theme-main focus:outline-none cursor-pointer"
                >
                  <option>Todas</option>
                  <option>Offset</option>
                  <option>Flexografía</option>
                  <option>Acabados</option>
                  <option>Planta</option>
                  <option>TI</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-theme-muted/20 rounded-xl px-3 py-1 text-xs">
                <span className="text-theme-muted">Estado:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent border-none text-xs font-bold text-theme-main focus:outline-none cursor-pointer"
                >
                  <option>Todos</option>
                  <option>Operativo</option>
                  <option>Mantenimiento</option>
                  <option>Activo</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tabla de Activos */}
          <div className="rounded-3xl border border-theme-subtle bg-theme-surface overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-theme-muted/30 text-[10px] uppercase text-theme-muted">
                  <tr>
                    <th className="p-3.5 text-left">Clave</th>
                    <th className="p-3.5 text-left">Activo / Máquina</th>
                    <th className="p-3.5 text-left">Área Fabril</th>
                    <th className="p-3.5 text-right font-mono">Costo Histórico</th>
                    <th className="p-3.5 text-right font-mono">Deprec. Acum.</th>
                    <th className="p-3.5 text-right font-mono">Valor Neto</th>
                    <th className="p-3.5 text-center">Vida Útil</th>
                    <th className="p-3.5 text-center">Estado Operativo</th>
                    <th className="p-3.5 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-theme-subtle">
                  {filteredAssets.map((asset) => (
                    <tr
                      key={asset.id}
                      onClick={() => setSelectedAsset(asset)}
                      className="hover:bg-theme-muted/20 transition-colors cursor-pointer"
                    >
                      <td className="p-3.5 font-mono font-bold text-theme-primary">
                        {asset.id}
                        {asset.code && (
                          <span className="block text-[10px] text-theme-muted font-normal">
                            {asset.code}
                          </span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <b className="text-theme-main block">{asset.name}</b>
                        <small className="text-theme-muted">
                          {asset.brand} · {asset.model} (S/N: {asset.serialNumber})
                        </small>
                      </td>
                      <td className="p-3.5 text-theme-muted">{asset.area}</td>
                      <td className="p-3.5 text-right font-mono">{mx(asset.historicalCost)}</td>
                      <td className="p-3.5 text-right font-mono text-theme-muted">
                        {mx(asset.accumulatedDepreciation)}
                      </td>
                      <td className="p-3.5 text-right font-mono font-bold text-emerald-600">
                        {mx(asset.netBookValue)}
                      </td>
                      <td className="p-3.5 text-center font-medium">
                        {asset.usefulLifeYears} años
                      </td>
                      <td className="p-3.5 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            asset.operatingStatus === 'Operativo'
                              ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                              : 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400'
                          }`}
                        >
                          {asset.operatingStatus}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAsset(asset);
                          }}
                          className="px-2.5 py-1 rounded-lg text-theme-primary font-bold hover:bg-theme-primary/10 transition-colors"
                        >
                          Ficha completa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: DEPRECIACIÓN */}
      {tab === 'Depreciación' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 p-6 rounded-3xl border border-theme-subtle bg-theme-surface space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-theme-subtle">
              <div>
                <h3 className="font-bold text-sm text-theme-main">Curva de Depreciación Mensual Acumulada</h3>
                <p className="text-xs text-theme-muted">
                  Enero a Diciembre 2026 · Método de línea recta ($115,400/mes)
                </p>
              </div>
              <span className="font-mono text-sm font-bold text-theme-primary">
                $115,400 / mes
              </span>
            </div>

            <div className="h-56 flex items-end gap-3 pt-6 px-2 border-b border-theme-subtle">
              {['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'].map(
                (m, i) => {
                  const isPast = i <= 8;
                  const height = 45 + i * 4.5;
                  return (
                    <div key={m} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <div
                        className={`w-full rounded-t-lg transition-all duration-300 ${
                          isPast ? 'bg-theme-primary' : 'bg-theme-primary/30 border-t-2 border-dashed border-theme-primary'
                        }`}
                        style={{ height: `${height}%` }}
                        title={`${m}: $${115.4 * (i + 1)}k`}
                      />
                      <span className="text-[10px] font-bold text-theme-muted">{m}</span>
                    </div>
                  );
                }
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-theme-muted pt-2">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-theme-primary" />
                Contabilizado YTD (Ene-Sep): $1,038,600
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-theme-primary/30" />
                Proyección Q4: $346,200
              </span>
            </div>
          </div>

          <div className="p-6 rounded-3xl border border-theme-subtle bg-theme-surface space-y-4">
            <h3 className="font-bold text-sm text-theme-main">Activos Próximos a Depreciación Total</h3>
            <p className="text-xs text-theme-muted">
              Equipos que concluyen su vida útil fiscal en los próximos 12 meses.
            </p>

            <div className="space-y-3">
              {assets
                .filter((a) => a.remainingMonths <= 18)
                .slice(0, 4)
                .map((a) => (
                  <div
                    key={a.id}
                    onClick={() => setSelectedAsset(a)}
                    className="p-3 rounded-xl border border-theme-subtle bg-theme-muted/10 hover:border-theme-primary/40 cursor-pointer transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <b className="text-xs text-theme-main block">{a.name}</b>
                        <small className="text-theme-muted">{a.id} · {a.area}</small>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">
                        {a.remainingMonths} meses
                      </span>
                    </div>
                    <div className="mt-2 flex justify-between text-[11px] font-mono">
                      <span className="text-theme-muted">Valor residual:</span>
                      <b className="text-emerald-600">{mx(a.residualValue)}</b>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: MOVIMIENTOS */}
      {tab === 'Movimientos' && (
        <div className="rounded-3xl border border-theme-subtle bg-theme-surface overflow-hidden shadow-xs">
          <div className="p-5 border-b border-theme-subtle">
            <h3 className="font-bold text-sm text-theme-main">Bitácora Oficial de Movimientos de Activos</h3>
            <p className="text-xs text-theme-muted">
              Altas capitalizables, depreciaciones mensuales ordinarias y mantenimientos mayores.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-theme-muted/30 text-[10px] uppercase text-theme-muted">
                <tr>
                  <th className="p-3.5 text-left">Fecha</th>
                  <th className="p-3.5 text-left">Tipo</th>
                  <th className="p-3.5 text-left">Activo / Clave</th>
                  <th className="p-3.5 text-left">Folio Contable</th>
                  <th className="p-3.5 text-right font-mono">Importe</th>
                  <th className="p-3.5 text-left">Responsable</th>
                  <th className="p-3.5 text-left">Detalle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-subtle">
                {movements.map((mov) => (
                  <tr key={mov.id} className="hover:bg-theme-muted/20">
                    <td className="p-3.5 text-theme-muted">{mov.date}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-theme-primary/10 text-theme-primary">
                        {mov.type}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <b className="text-theme-main block">{mov.assetName}</b>
                      <small className="font-mono text-theme-muted">{mov.assetId}</small>
                    </td>
                    <td className="p-3.5 font-mono text-theme-primary font-bold">{mov.folio}</td>
                    <td className="p-3.5 text-right font-mono font-bold">
                      {mov.amount ? mx(mov.amount) : '—'}
                    </td>
                    <td className="p-3.5 text-theme-muted">{mov.responsible}</td>
                    <td className="p-3.5 text-theme-muted max-w-xs truncate">{mov.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: CAPEX */}
      {tab === 'CAPEX' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl border border-theme-subtle bg-theme-surface">
              <span className="text-[10px] uppercase font-bold text-theme-muted block">Presupuesto CAPEX 2026</span>
              <b className="font-mono text-2xl text-theme-main block mt-1">$2,800,000</b>
              <small className="text-theme-muted">Autorizado por Consejo</small>
            </div>
            <div className="p-5 rounded-3xl border border-theme-subtle bg-theme-surface">
              <span className="text-[10px] uppercase font-bold text-theme-muted block">CAPEX Ejercido YTD</span>
              <b className="font-mono text-2xl text-emerald-600 block mt-1">$1,900,000</b>
              <small className="text-emerald-600 font-bold">67.8% ejecutado</small>
            </div>
            <div className="p-5 rounded-3xl border border-theme-subtle bg-theme-surface">
              <span className="text-[10px] uppercase font-bold text-theme-muted block">Saldo Disponible</span>
              <b className="font-mono text-2xl text-theme-primary block mt-1">$900,000</b>
              <small className="text-theme-muted">Para mejoras Q4</small>
            </div>
          </div>

          <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-6 space-y-4">
            <h3 className="font-bold text-sm text-theme-main">Proyectos de Inversión Fabril Vinculados</h3>
            <div className="space-y-3">
              {[
                {
                  project: 'Modernización Flexografía Banda Ancha',
                  allocated: 1450000,
                  spent: 1350000,
                  assets: ['AF-0008 Mark Andy Scout', 'AF-0012 BGM 2'],
                  status: 'En Operación'
                },
                {
                  project: 'Corte y Doblado de Alta Precisión',
                  allocated: 750000,
                  spent: 550000,
                  assets: ['AF-0014 Stahlfolder Ti-52'],
                  status: 'Finalizado'
                },
                {
                  project: 'Infraestructura de Aire y Energía Planta',
                  allocated: 600000,
                  spent: 0,
                  assets: ['En proceso de licitación'],
                  status: 'Programado Q4'
                }
              ].map((proj) => (
                <div key={proj.project} className="p-4 rounded-2xl border border-theme-subtle bg-theme-muted/10 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <b className="text-sm text-theme-main block">{proj.project}</b>
                    <div className="flex gap-2 mt-1">
                      {proj.assets.map((a) => (
                        <span key={a} className="text-[10px] font-mono px-2 py-0.5 rounded bg-theme-surface border border-theme-subtle text-theme-muted">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-[10px] text-theme-muted block">Presupuesto / Ejercido</span>
                      <span className="font-mono font-bold text-xs">
                        {mx(proj.spent)} / {mx(proj.allocated)}
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                      {proj.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: RESUMEN */}
      {tab === 'Resumen' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-6 rounded-3xl border border-theme-subtle bg-theme-surface space-y-3">
              <h3 className="font-bold text-sm text-theme-main">Distribución de Activos por Área Fabril</h3>
              <div className="space-y-3 pt-2">
                {[
                  { area: 'Offset · Producción', count: 5, value: 3636375, pct: 40.7 },
                  { area: 'Flexografía · Producción', count: 7, value: 4664750, pct: 52.2 },
                  { area: 'Acabados · Producción', count: 3, value: 1127675, pct: 12.6 },
                  { area: 'Servicios de Planta & TI', count: 5, value: 614075, pct: 6.9 }
                ].map((d) => (
                  <div key={d.area} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-theme-main">{d.area} ({d.count} equipos)</span>
                      <b className="font-mono">{mx(d.value)}</b>
                    </div>
                    <div className="h-2 rounded-full bg-theme-muted/20 overflow-hidden">
                      <div className="h-full bg-theme-primary rounded-full" style={{ width: `${Math.min(100, d.pct)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-3xl border border-theme-subtle bg-theme-surface space-y-4">
              <h3 className="font-bold text-sm text-theme-main">Salud y Cumplimiento Normativo de Activos</h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>100% de activos cuentan con póliza contable de activación y factura validada ante SAT.</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Depreciación mensual alineada a normas NIF C-6 y ley del ISR (Art. 34).</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300">
                  <Wrench className="w-4 h-4 shrink-0" />
                  <span>1 equipo en mantenimiento preventivo / correctivo (Stahlfolder Ti-52).</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ficha de Activo */}
      {selectedAsset && (
        <AssetDetailModal
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
          onNavigateToMaintenance={onNavigateToMaintenance}
          toast={toast}
        />
      )}

      {/* Wizard Nuevo Activo */}
      {isNewAssetModalOpen && (
        <NewAssetWizardModal
          onClose={() => setIsNewAssetModalOpen(false)}
          onSave={handleAddNewAsset}
          toast={toast}
          existingCount={assets.length}
        />
      )}
    </div>
  );
};
