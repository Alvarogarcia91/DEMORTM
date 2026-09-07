import React, { useState } from 'react';
import {
  Scale,
  Search,
  Filter,
  Plus,
  Eye,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Building2,
  ArrowUpRight,
  Truck,
  FileText,
  Lock,
  Layers
} from 'lucide-react';
import {
  SupplierInvoice,
  SupplierPaymentRecord,
  INITIAL_CXP_RECORDS
} from '../../data/mockFinanzasData';
import { ThreeWayMatchModal } from './ThreeWayMatchModal';
import { RegistrarPagoProveedorModal } from './RegistrarPagoProveedorModal';
import { RegistrarFacturaProveedorModal } from './RegistrarFacturaProveedorModal';
import { CxpDetailModal } from './CxpDetailModal';

interface CxpPageProps {
  invoices?: SupplierInvoice[];
  onInvoicesChange?: (invoices: SupplierInvoice[]) => void;
  onNavigateToPurchases?: () => void;
}

export const CxpPage: React.FC<CxpPageProps> = ({
  invoices: propInvoices,
  onInvoicesChange,
  onNavigateToPurchases,
}) => {
  const [invoices, setInvoices] = useState<SupplierInvoice[]>(propInvoices || INITIAL_CXP_RECORDS);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [matchFilter, setMatchFilter] = useState<string>('todos');
  const [estadoPagoFilter, setEstadoPagoFilter] = useState<string>('todos');
  const [activeView, setActiveView] = useState<'todas' | '3way'>('todas');

  // Modals state
  const [selectedInvoice, setSelectedInvoice] = useState<SupplierInvoice | null>(null);
  const [isMatchOpen, setIsMatchOpen] = useState<boolean>(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState<boolean>(false);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState<boolean>(false);

  // Sync if prop changes
  React.useEffect(() => {
    if (propInvoices) {
      setInvoices(propInvoices);
    }
  }, [propInvoices]);

  const updateInvoices = (newInvoices: SupplierInvoice[]) => {
    setInvoices(newInvoices);
    if (onInvoicesChange) {
      onInvoicesChange(newInvoices);
    }
  };

  const handleRegisterInvoice = (newInvoice: SupplierInvoice) => {
    const updated = [newInvoice, ...invoices];
    updateInvoices(updated);
  };

  const handleRegisterPayment = (invoiceId: string, payment: SupplierPaymentRecord) => {
    const updated = invoices.map((inv) => {
      if (inv.id === invoiceId) {
        const newTotalPagado = inv.totalPagado + payment.monto;
        const newSaldoPendiente = Math.max(0, inv.total - newTotalPagado);
        const newEstadoPago: SupplierInvoice['estadoPago'] = newSaldoPendiente === 0 ? 'pagada' : 'parcial';

        return {
          ...inv,
          totalPagado: newTotalPagado,
          saldoPendiente: newSaldoPendiente,
          estadoPago: newEstadoPago,
          historialPagos: [payment, ...inv.historialPagos],
        };
      }
      return inv;
    });
    updateInvoices(updated);
  };

  const handleResolveDiscrepancy = (
    invoiceId: string,
    resolutionType: 'correccion' | 'excepcion',
    note: string
  ) => {
    const now = new Date().toISOString().split('T')[0];
    const updated = invoices.map((inv) => {
      if (inv.id === invoiceId) {
        if (resolutionType === 'excepcion') {
          return {
            ...inv,
            estadoPago: 'programada' as const,
            toleranciaExcedida: false,
            resolucionExcepcion: {
              autorizadoPor: 'Lic. Gerardo Morales (Dir. Finanzas)',
              fecha: now,
              motivo: note,
            },
          };
        } else {
          return {
            ...inv,
            motivoDiscrepancia: `${inv.motivoDiscrepancia || ''} [SOLICITUD DE CORRECCIÓN: ${note}]`,
          };
        }
      }
      return inv;
    });
    updateInvoices(updated);
  };

  // Metrics
  const totalPorPagar = invoices.reduce((acc, inv) => acc + inv.saldoPendiente, 0);
  const facturasBloqueadas = invoices.filter((i) => i.estadoPago === 'bloqueada');
  const totalBloqueado = facturasBloqueadas.reduce((acc, inv) => acc + inv.saldoPendiente, 0);
  const pagosProgramados = invoices
    .filter((i) => i.estadoPago === 'programada' || i.estadoPago === 'parcial')
    .reduce((acc, inv) => acc + inv.saldoPendiente, 0);
  const conciliadasCount = invoices.filter((i) => i.matchStatus === 'conciliada').length;

  // Filter logic
  const filteredInvoices = invoices.filter((inv) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      inv.folioProveedor.toLowerCase().includes(term) ||
      inv.proveedorNombre.toLowerCase().includes(term) ||
      inv.proveedorRfc.toLowerCase().includes(term) ||
      inv.ordenCompraFolio.toLowerCase().includes(term) ||
      inv.recepcionFolio.toLowerCase().includes(term);

    const matchesMatch =
      matchFilter === 'todos' ||
      (matchFilter === 'conciliada' && inv.matchStatus === 'conciliada') ||
      (matchFilter === 'discrepancia' && inv.matchStatus !== 'conciliada');

    const matchesEstadoPago =
      estadoPagoFilter === 'todos' || inv.estadoPago === estadoPagoFilter;

    const matchesView = activeView === 'todas' || inv.matchStatus !== 'conciliada';

    return matchesSearch && matchesMatch && matchesEstadoPago && matchesView;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black tracking-tight text-theme-main">
              Cuentas por Pagar (CxP) & 3-Way Match
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
              Control Fiscal & Almacén
            </span>
          </div>
          <p className="text-xs text-theme-muted mt-1">
            Validación estricta de facturas contra Orden de Compra y Recepción física en planta antes de liberar pagos
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateToPurchases && (
            <button
              onClick={onNavigateToPurchases}
              className="px-3.5 py-2 rounded-xl border border-theme-subtle hover:bg-theme-muted text-xs font-semibold text-theme-main flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Ver Órdenes de Compra</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-theme-muted" />
            </button>
          )}

          <button
            onClick={() => setIsRegisterOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-theme-primary hover:bg-theme-primary/90 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Factura Proveedor</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle shadow-xs">
          <div className="flex items-center justify-between text-theme-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total por Pagar</span>
            <DollarSign className="w-4 h-4 text-theme-primary" />
          </div>
          <div className="text-xl font-black text-theme-main font-mono">
            ${totalPorPagar.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-theme-muted mt-1">Saldo pendiente con proveedores</p>
        </div>

        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle shadow-xs">
          <div className="flex items-center justify-between text-theme-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Bloqueadas (3-Way Match)</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-xl font-black text-rose-700 font-mono">
            ${totalBloqueado.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-rose-600 font-semibold mt-1">
            {facturasBloqueadas.length} facturas con discrepancia física
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle shadow-xs">
          <div className="flex items-center justify-between text-theme-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Pagos Programados</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-black text-amber-700 font-mono">
            ${pagosProgramados.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-theme-muted mt-1">Autorizados próximos a dispersar</p>
        </div>

        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle shadow-xs">
          <div className="flex items-center justify-between text-theme-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Conciliadas 100%</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-black text-emerald-700 font-mono">
            {conciliadasCount} <span className="text-xs font-normal text-theme-muted">facturas</span>
          </div>
          <p className="text-[11px] text-theme-muted mt-1">Sin discrepancias de OC o recepción</p>
        </div>
      </div>

      {/* Tab Selector: Todas vs Tablero 3-Way Match */}
      <div className="flex items-center gap-2 border-b border-theme-subtle pb-2">
        <button
          onClick={() => setActiveView('todas')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeView === 'todas'
              ? 'bg-theme-primary text-white shadow-xs'
              : 'text-theme-muted hover:text-theme-main hover:bg-theme-muted'
          }`}
        >
          Todas las Facturas ({invoices.length})
        </button>

        <button
          onClick={() => setActiveView('3way')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeView === '3way'
              ? 'bg-theme-primary text-white shadow-xs'
              : 'text-theme-muted hover:text-theme-main hover:bg-theme-muted'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Tablero de Discrepancias 3-Way Match</span>
          {facturasBloqueadas.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-mono">
              {facturasBloqueadas.length}
            </span>
          )}
        </button>
      </div>

      {/* Filters & Search */}
      <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por proveedor, folio factura, OC o recepción de almacén..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-theme-subtle bg-theme-base text-theme-main text-xs focus:ring-2 focus:ring-theme-primary/20 outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-theme-muted">
            <Filter className="w-3.5 h-3.5" />
            <span>Filtro:</span>
          </div>

          <select
            value={matchFilter}
            onChange={(e) => setMatchFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-theme-subtle bg-theme-base text-theme-main text-xs font-medium focus:ring-2 focus:ring-theme-primary/20 outline-none"
          >
            <option value="todos">3-Way Match: Todos</option>
            <option value="conciliada">Conciliadas OK</option>
            <option value="discrepancia">Con Discrepancia</option>
          </select>

          <select
            value={estadoPagoFilter}
            onChange={(e) => setEstadoPagoFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-theme-subtle bg-theme-base text-theme-main text-xs font-medium focus:ring-2 focus:ring-theme-primary/20 outline-none"
          >
            <option value="todos">Estado de Pago: Todos</option>
            <option value="programada">Programada</option>
            <option value="bloqueada">Bloqueada</option>
            <option value="parcial">Parcial</option>
            <option value="pagada">Pagada</option>
          </select>
        </div>
      </div>

      {/* Supplier Invoices Table */}
      <div className="rounded-2xl border border-theme-subtle bg-theme-surface overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-theme-muted/40 border-b border-theme-subtle text-[11px] uppercase font-bold text-theme-muted tracking-wider">
              <tr>
                <th className="px-4 py-3">Factura Prov.</th>
                <th className="px-4 py-3">Proveedor / RFC</th>
                <th className="px-4 py-3">Trazabilidad (OC & Almacén)</th>
                <th className="px-4 py-3">Vencimiento</th>
                <th className="px-4 py-3 text-right">Total Factura</th>
                <th className="px-4 py-3 text-right">Saldo Pendiente</th>
                <th className="px-4 py-3 text-center">3-Way Match</th>
                <th className="px-4 py-3 text-center">Estado Pago</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-subtle">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-theme-muted text-xs">
                    No se encontraron facturas de proveedores con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => {
                  const isBlocked = inv.estadoPago === 'bloqueada';
                  const isMatched = inv.matchStatus === 'conciliada';
                  const isPaid = inv.estadoPago === 'pagada';

                  return (
                    <tr key={inv.id} className="hover:bg-theme-muted/20 transition-colors">
                      {/* Factura */}
                      <td className="px-4 py-3 font-mono">
                        <div className="font-bold text-theme-main text-xs">{inv.folioProveedor}</div>
                        <div className="text-[10px] text-theme-muted font-mono truncate max-w-[120px]" title={inv.uuidSat}>
                          {inv.uuidSat.substring(0, 14)}...
                        </div>
                      </td>

                      {/* Proveedor */}
                      <td className="px-4 py-3 max-w-xs">
                        <div className="font-semibold text-theme-main truncate" title={inv.proveedorNombre}>
                          {inv.proveedorNombre}
                        </div>
                        <div className="text-[10px] font-mono text-theme-muted">{inv.proveedorRfc}</div>
                      </td>

                      {/* Trazabilidad */}
                      <td className="px-4 py-3 text-[11px]">
                        <div className="flex items-center gap-1 text-theme-main">
                          <FileText className="w-3 h-3 text-theme-primary" />
                          <span className="font-mono">{inv.ordenCompraFolio}</span>
                        </div>
                        <div className="flex items-center gap-1 text-theme-muted mt-0.5">
                          <Truck className="w-3 h-3 text-blue-600" />
                          <span className="font-mono">{inv.recepcionFolio}</span>
                        </div>
                      </td>

                      {/* Vencimiento */}
                      <td className="px-4 py-3 text-[11px] whitespace-nowrap">
                        <div className="font-medium text-theme-main">{inv.fechaVencimiento}</div>
                        <div className="text-[10px] text-theme-muted">{inv.diasCredito} días crédito</div>
                      </td>

                      {/* Total */}
                      <td className="px-4 py-3 text-right font-mono font-medium text-theme-muted">
                        ${inv.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </td>

                      {/* Saldo Pendiente */}
                      <td className="px-4 py-3 text-right font-mono font-bold text-xs">
                        <span className={inv.saldoPendiente > 0 ? 'text-theme-main' : 'text-theme-muted'}>
                          ${inv.saldoPendiente.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </span>
                      </td>

                      {/* 3-Way Match Badge */}
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => {
                            setSelectedInvoice(inv);
                            setIsMatchOpen(true);
                          }}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all hover:scale-105 ${
                            isMatched
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                              : 'bg-rose-50 text-rose-700 border border-rose-300 animate-pulse'
                          }`}
                        >
                          <Scale className="w-3 h-3" />
                          <span>{isMatched ? 'Conciliado' : 'Discrepancia'}</span>
                        </button>
                      </td>

                      {/* Estado Pago */}
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isPaid
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                              : isBlocked
                              ? 'bg-rose-50 text-rose-700 border border-rose-300'
                              : 'bg-amber-50 text-amber-700 border border-amber-300'
                          }`}
                        >
                          {isPaid ? 'Pagada' : isBlocked ? 'Bloqueada' : inv.estadoPago}
                        </span>
                      </td>

                      {/* Acciones */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedInvoice(inv);
                              setIsDetailOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-theme-muted hover:text-theme-main hover:bg-theme-muted transition-colors cursor-pointer"
                            title="Ver Ficha Detalle"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              setSelectedInvoice(inv);
                              setIsMatchOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-theme-primary hover:bg-theme-muted transition-colors cursor-pointer"
                            title="Explorador 3-Way Match"
                          >
                            <Scale className="w-4 h-4" />
                          </button>

                          {!isPaid && !isBlocked && (
                            <button
                              onClick={() => {
                                setSelectedInvoice(inv);
                                setIsPaymentOpen(true);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-theme-primary hover:bg-theme-primary/90 text-white text-[11px] font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                              title="Pagar Proveedor"
                            >
                              <DollarSign className="w-3.5 h-3.5" />
                              <span>Pagar</span>
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
      <ThreeWayMatchModal
        invoice={selectedInvoice}
        isOpen={isMatchOpen}
        onClose={() => {
          setIsMatchOpen(false);
          setSelectedInvoice(null);
        }}
        onResolveDiscrepancy={handleResolveDiscrepancy}
      />

      <RegistrarPagoProveedorModal
        invoice={selectedInvoice}
        isOpen={isPaymentOpen}
        onClose={() => {
          setIsPaymentOpen(false);
          setSelectedInvoice(null);
        }}
        onRegisterPayment={handleRegisterPayment}
      />

      <RegistrarFacturaProveedorModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onRegisterInvoice={handleRegisterInvoice}
      />

      <CxpDetailModal
        invoice={selectedInvoice}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedInvoice(null);
        }}
        onOpenThreeWayMatch={(inv) => {
          setSelectedInvoice(inv);
          setIsMatchOpen(true);
        }}
        onOpenRegisterPayment={(inv) => {
          setSelectedInvoice(inv);
          setIsPaymentOpen(true);
        }}
      />
    </div>
  );
};
