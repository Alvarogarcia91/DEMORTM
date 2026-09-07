import React, { useState } from 'react';
import {
  DollarSign,
  Search,
  Filter,
  Eye,
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  User,
  Phone,
  Building2,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';
import { AccountReceivable, PaymentRecord, INITIAL_CXC_RECORDS } from '../../data/mockFinanzasData';
import { RegistrarPagoClienteModal } from './RegistrarPagoClienteModal';
import { CxcDetailModal } from './CxcDetailModal';

interface CxcPageProps {
  records?: AccountReceivable[];
  onRecordsChange?: (records: AccountReceivable[]) => void;
  onNavigateToInvoice?: (invoiceFolio: string) => void;
  targetCxcId?: string | null;
}

export const CxcPage: React.FC<CxcPageProps> = ({
  records: propRecords,
  onRecordsChange,
  onNavigateToInvoice,
  targetCxcId,
}) => {
  const [records, setRecords] = useState<AccountReceivable[]>(propRecords || INITIAL_CXC_RECORDS);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [bucketFilter, setBucketFilter] = useState<string>('todos');

  // Modals state
  const [selectedCxc, setSelectedCxc] = useState<AccountReceivable | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState<boolean>(false);

  // Sync if prop changes
  React.useEffect(() => {
    if (propRecords) {
      setRecords(propRecords);
    }
  }, [propRecords]);

  // Target selection if passed
  React.useEffect(() => {
    if (targetCxcId) {
      const found = records.find((r) => r.id === targetCxcId || r.facturaFolio === targetCxcId);
      if (found) {
        setSelectedCxc(found);
        setIsDetailOpen(true);
      }
    }
  }, [targetCxcId, records]);

  const updateRecords = (newRecords: AccountReceivable[]) => {
    setRecords(newRecords);
    if (onRecordsChange) {
      onRecordsChange(newRecords);
    }
  };

  const handleRegisterPayment = (cxcId: string, payment: PaymentRecord) => {
    const updated = records.map((item) => {
      if (item.id === cxcId) {
        const newTotalPagado = item.totalPagado + payment.monto;
        const newSaldoPendiente = Math.max(0, item.montoOriginal - newTotalPagado);
        const newStatus: AccountReceivable['status'] = newSaldoPendiente === 0 ? 'pagada' : item.status;

        return {
          ...item,
          totalPagado: newTotalPagado,
          saldoPendiente: newSaldoPendiente,
          status: newStatus,
          historialPagos: [payment, ...item.historialPagos],
        };
      }
      return item;
    });

    updateRecords(updated);
  };

  // Metrics
  const totalCartera = records.reduce((acc, r) => acc + r.saldoPendiente, 0);
  const totalCobrado = records.reduce((acc, r) => acc + r.totalPagado, 0);
  const carteraVencida = records
    .filter((r) => r.status === 'vencida')
    .reduce((acc, r) => acc + r.saldoPendiente, 0);
  const carteraVigente = records
    .filter((r) => r.status === 'al_corriente' || r.status === 'por_vencer')
    .reduce((acc, r) => acc + r.saldoPendiente, 0);

  // Aging Buckets Calculations
  const bucketVigente = records.filter((r) => r.bucket === 'vigente' && r.saldoPendiente > 0).reduce((a, b) => a + b.saldoPendiente, 0);
  const bucket1_30 = records.filter((r) => r.bucket === '1_30' && r.saldoPendiente > 0).reduce((a, b) => a + b.saldoPendiente, 0);
  const bucket31_60 = records.filter((r) => r.bucket === '31_60' && r.saldoPendiente > 0).reduce((a, b) => a + b.saldoPendiente, 0);
  const bucket61_90 = records.filter((r) => r.bucket === '61_90' && r.saldoPendiente > 0).reduce((a, b) => a + b.saldoPendiente, 0);
  const bucketMas90 = records.filter((r) => r.bucket === 'mas_90' && r.saldoPendiente > 0).reduce((a, b) => a + b.saldoPendiente, 0);

  // Filtering
  const filteredRecords = records.filter((item) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      item.facturaFolio.toLowerCase().includes(term) ||
      item.clienteNombre.toLowerCase().includes(term) ||
      item.clienteRfc.toLowerCase().includes(term);

    const matchesStatus =
      statusFilter === 'todos' || item.status === statusFilter;

    const matchesBucket =
      bucketFilter === 'todos' || item.bucket === bucketFilter;

    return matchesSearch && matchesStatus && matchesBucket;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black tracking-tight text-theme-main">
              Cuentas por Cobrar (CxC)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Cartera RTM
            </span>
          </div>
          <p className="text-xs text-theme-muted mt-1">
            Control de cobranza, crédito a clientes industriales, aplicación de abonos y antigüedad de saldos
          </p>
        </div>

        {onNavigateToInvoice && (
          <button
            onClick={() => onNavigateToInvoice('')}
            className="px-4 py-2 rounded-xl border border-theme-subtle hover:bg-theme-muted text-xs font-semibold text-theme-main flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Ver Facturación CFDI</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-theme-muted" />
          </button>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle shadow-xs">
          <div className="flex items-center justify-between text-theme-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Cartera Pendiente</span>
            <DollarSign className="w-4 h-4 text-theme-primary" />
          </div>
          <div className="text-xl font-black text-theme-main font-mono">
            ${totalCartera.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-theme-muted mt-1">Total por cobrar a clientes</p>
        </div>

        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle shadow-xs">
          <div className="flex items-center justify-between text-theme-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Cartera Vigente</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-black text-emerald-700 font-mono">
            ${carteraVigente.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-theme-muted mt-1">Dentro del plazo de crédito</p>
        </div>

        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle shadow-xs">
          <div className="flex items-center justify-between text-theme-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Cartera Vencida</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-xl font-black text-rose-700 font-mono">
            ${carteraVencida.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-theme-muted mt-1">Plazo de crédito expirado</p>
        </div>

        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle shadow-xs">
          <div className="flex items-center justify-between text-theme-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Cobranza Recuperada</span>
            <CreditCard className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-black text-blue-700 font-mono">
            ${totalCobrado.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-theme-muted mt-1">Abonos y pagos liquidados</p>
        </div>
      </div>

      {/* Aging of Accounts Receivable (Antigüedad de Saldos) */}
      <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-theme-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-theme-main">
              Antigüedad de Saldos (Aging de Cartera)
            </h3>
          </div>
          <span className="text-[11px] text-theme-muted font-medium">
            Distribución por días de vencimiento
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {/* Vigente */}
          <div
            onClick={() => setBucketFilter(bucketFilter === 'vigente' ? 'todos' : 'vigente')}
            className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
              bucketFilter === 'vigente'
                ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-200'
                : 'bg-theme-muted/20 border-theme-subtle hover:border-emerald-300'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">Vigente</span>
            <span className="font-mono font-bold text-xs text-theme-main block mt-1">
              ${bucketVigente.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* 1 - 30 días */}
          <div
            onClick={() => setBucketFilter(bucketFilter === '1_30' ? 'todos' : '1_30')}
            className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
              bucketFilter === '1_30'
                ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-200'
                : 'bg-theme-muted/20 border-theme-subtle hover:border-amber-300'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">1 - 30 Días</span>
            <span className="font-mono font-bold text-xs text-theme-main block mt-1">
              ${bucket1_30.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* 31 - 60 días */}
          <div
            onClick={() => setBucketFilter(bucketFilter === '31_60' ? 'todos' : '31_60')}
            className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
              bucketFilter === '31_60'
                ? 'bg-orange-50 border-orange-400 ring-2 ring-orange-200'
                : 'bg-theme-muted/20 border-theme-subtle hover:border-orange-300'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-800 block">31 - 60 Días</span>
            <span className="font-mono font-bold text-xs text-theme-main block mt-1">
              ${bucket31_60.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* 61 - 90 días */}
          <div
            onClick={() => setBucketFilter(bucketFilter === '61_90' ? 'todos' : '61_90')}
            className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
              bucketFilter === '61_90'
                ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-200'
                : 'bg-theme-muted/20 border-theme-subtle hover:border-rose-300'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 block">61 - 90 Días</span>
            <span className="font-mono font-bold text-xs text-theme-main block mt-1">
              ${bucket61_90.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* +90 días */}
          <div
            onClick={() => setBucketFilter(bucketFilter === 'mas_90' ? 'todos' : 'mas_90')}
            className={`p-3 rounded-xl border text-center transition-all cursor-pointer col-span-2 sm:col-span-1 ${
              bucketFilter === 'mas_90'
                ? 'bg-red-100 border-red-500 ring-2 ring-red-300'
                : 'bg-theme-muted/20 border-theme-subtle hover:border-red-300'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-900 block">+90 Días</span>
            <span className="font-mono font-bold text-xs text-theme-main block mt-1">
              ${bucketMas90.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por cliente, RFC, o folio de factura..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-theme-subtle bg-theme-base text-theme-main text-xs focus:ring-2 focus:ring-theme-primary/20 outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-theme-muted">
            <Filter className="w-3.5 h-3.5" />
            <span>Filtro:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-theme-subtle bg-theme-base text-theme-main text-xs font-medium focus:ring-2 focus:ring-theme-primary/20 outline-none"
          >
            <option value="todos">Todos los estados</option>
            <option value="por_vencer">Por vencer / Vigente</option>
            <option value="vencida">Vencidas</option>
            <option value="pagada">Pagadas</option>
          </select>

          <select
            value={bucketFilter}
            onChange={(e) => setBucketFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-theme-subtle bg-theme-base text-theme-main text-xs font-medium focus:ring-2 focus:ring-theme-primary/20 outline-none"
          >
            <option value="todos">Antigüedad: Todas</option>
            <option value="vigente">Vigente</option>
            <option value="1_30">1 a 30 días</option>
            <option value="31_60">31 a 60 días</option>
            <option value="61_90">61 a 90 días</option>
            <option value="mas_90">+90 días</option>
          </select>
        </div>
      </div>

      {/* CxC Table */}
      <div className="rounded-2xl border border-theme-subtle bg-theme-surface overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-theme-muted/40 border-b border-theme-subtle text-[11px] uppercase font-bold text-theme-muted tracking-wider">
              <tr>
                <th className="px-4 py-3">Factura</th>
                <th className="px-4 py-3">Cliente / RFC</th>
                <th className="px-4 py-3">Emisión & Vence</th>
                <th className="px-4 py-3">Plazo / Mora</th>
                <th className="px-4 py-3 text-right">Monto Original</th>
                <th className="px-4 py-3 text-right">Cobrado</th>
                <th className="px-4 py-3 text-right">Saldo Pendiente</th>
                <th className="px-4 py-3 text-center">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-subtle">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-theme-muted text-xs">
                    No hay registros de cuentas por cobrar para los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((item) => {
                  const isPagada = item.status === 'pagada';
                  const isVencida = item.status === 'vencida';
                  return (
                    <tr key={item.id} className="hover:bg-theme-muted/20 transition-colors">
                      {/* Factura */}
                      <td className="px-4 py-3 font-mono font-bold text-theme-main text-xs">
                        {item.facturaFolio}
                      </td>

                      {/* Cliente */}
                      <td className="px-4 py-3 max-w-xs">
                        <div className="font-semibold text-theme-main truncate" title={item.clienteNombre}>
                          {item.clienteNombre}
                        </div>
                        <div className="text-[10px] font-mono text-theme-muted">{item.clienteRfc}</div>
                      </td>

                      {/* Fechas */}
                      <td className="px-4 py-3 text-[11px]">
                        <div className="text-theme-muted">Emisión: {item.fechaEmision}</div>
                        <div className={`font-semibold ${isVencida ? 'text-rose-600' : 'text-theme-main'}`}>
                          Vence: {item.fechaVencimiento}
                        </div>
                      </td>

                      {/* Plazo / Mora */}
                      <td className="px-4 py-3">
                        <div className="text-[11px] text-theme-main font-medium">{item.diasCredito} días crédito</div>
                        {isVencida ? (
                          <div className="text-[10px] font-bold text-rose-600">
                            {item.diasMora} días vencida
                          </div>
                        ) : isPagada ? (
                          <div className="text-[10px] text-emerald-600 font-semibold">Liquidada</div>
                        ) : (
                          <div className="text-[10px] text-amber-700">
                            {item.diasParaVencer} días restantes
                          </div>
                        )}
                      </td>

                      {/* Monto Original */}
                      <td className="px-4 py-3 text-right font-mono font-semibold text-theme-muted">
                        ${item.montoOriginal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </td>

                      {/* Total Cobrado */}
                      <td className="px-4 py-3 text-right font-mono font-medium text-emerald-700">
                        ${item.totalPagado.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </td>

                      {/* Saldo Pendiente */}
                      <td className="px-4 py-3 text-right font-mono font-bold text-xs">
                        <span className={item.saldoPendiente > 0 ? 'text-rose-700' : 'text-theme-muted'}>
                          ${item.saldoPendiente.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </span>
                      </td>

                      {/* Estado */}
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isPagada
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                              : isVencida
                              ? 'bg-rose-50 text-rose-700 border border-rose-300'
                              : 'bg-amber-50 text-amber-700 border border-amber-300'
                          }`}
                        >
                          {isPagada ? 'Pagada' : isVencida ? 'Vencida' : 'Por Vencer'}
                        </span>
                      </td>

                      {/* Acciones */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedCxc(item);
                              setIsDetailOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-theme-muted hover:text-theme-main hover:bg-theme-muted transition-colors cursor-pointer"
                            title="Ver Detalle / Historial"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {item.saldoPendiente > 0 && (
                            <button
                              onClick={() => {
                                setSelectedCxc(item);
                                setIsPaymentOpen(true);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                              title="Registrar Cobro"
                            >
                              <DollarSign className="w-3.5 h-3.5" />
                              <span>Abonar</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <CxcDetailModal
        cxc={selectedCxc}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedCxc(null);
        }}
        onOpenRegisterPayment={(cxcToPay) => {
          setSelectedCxc(cxcToPay);
          setIsPaymentOpen(true);
        }}
        onNavigateToInvoice={onNavigateToInvoice}
      />

      <RegistrarPagoClienteModal
        cxc={selectedCxc}
        isOpen={isPaymentOpen}
        onClose={() => {
          setIsPaymentOpen(false);
          setSelectedCxc(null);
        }}
        onRegisterPayment={handleRegisterPayment}
      />
    </div>
  );
};
