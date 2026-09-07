import React, { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  Plus,
  Eye,
  ShieldCheck,
  AlertCircle,
  Clock,
  CheckCircle2,
  DollarSign,
  ArrowUpRight,
  Printer,
  Sparkles,
  ExternalLink,
  Layers
} from 'lucide-react';
import { SalesInvoice, EligibleRemision, INITIAL_SALES_INVOICES, INITIAL_ELIGIBLE_REMISIONES } from '../../data/mockFinanzasData';
import { FacturaDetailModal } from './FacturaDetailModal';
import { GenerarFacturaModal } from './GenerarFacturaModal';
import { FacturaPrintPreviewModal } from './FacturaPrintPreviewModal';

interface FacturacionPageProps {
  invoices?: SalesInvoice[];
  onInvoicesChange?: (invoices: SalesInvoice[]) => void;
  onNavigateToCxc?: (cxcId?: string) => void;
  onInvoiceStamped?: (invoice: SalesInvoice) => void;
}

export const FacturacionPage: React.FC<FacturacionPageProps> = ({
  invoices: propInvoices,
  onInvoicesChange,
  onNavigateToCxc,
  onInvoiceStamped,
}) => {
  const [invoices, setInvoices] = useState<SalesInvoice[]>(propInvoices || INITIAL_SALES_INVOICES);
  const [eligibleRemisiones, setEligibleRemisiones] = useState<EligibleRemision[]>(INITIAL_ELIGIBLE_REMISIONES);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [metodoFilter, setMetodoFilter] = useState<string>('todos');

  // Modals state
  const [selectedInvoice, setSelectedInvoice] = useState<SalesInvoice | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [isGenerateOpen, setIsGenerateOpen] = useState<boolean>(false);
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState<boolean>(false);

  // Sync if prop changes
  React.useEffect(() => {
    if (propInvoices) {
      setInvoices(propInvoices);
    }
  }, [propInvoices]);

  const updateInvoices = (newInvoices: SalesInvoice[]) => {
    setInvoices(newInvoices);
    if (onInvoicesChange) {
      onInvoicesChange(newInvoices);
    }
  };

  const handleGenerateInvoice = (newInvoice: SalesInvoice, autoStamp: boolean) => {
    const updated = [newInvoice, ...invoices];
    updateInvoices(updated);

    // Remove the remision from eligible list
    if (newInvoice.remisionId) {
      setEligibleRemisiones((prev) => prev.filter((r) => r.id !== newInvoice.remisionId));
    }

    if (autoStamp && onInvoiceStamped) {
      onInvoiceStamped(newInvoice);
    }
  };

  const handleStampInvoice = (invoiceId: string) => {
    const now = new Date().toISOString();
    const updated = invoices.map((inv) => {
      if (inv.id === invoiceId) {
        const stampedInv: SalesInvoice = {
          ...inv,
          status: 'timbrada',
          fechaTimbrado: now,
          uuidSat: `${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-4C10-90D1-${Math.random().toString(36).substring(2, 14).toUpperCase()}`,
        };
        if (onInvoiceStamped) {
          onInvoiceStamped(stampedInv);
        }
        return stampedInv;
      }
      return inv;
    });
    updateInvoices(updated);
  };

  // Metrics
  const totalFacturado = invoices.reduce((acc, inv) => acc + inv.total, 0);
  const timbradasCount = invoices.filter((i) => i.status === 'timbrada').length;
  const pendientesTimbrarCount = invoices.filter((i) => i.status !== 'timbrada').length;
  const saldoPendienteTotal = invoices.reduce((acc, inv) => acc + inv.saldoPendiente, 0);

  // Filtering
  const filteredInvoices = invoices.filter((inv) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      inv.folio.toLowerCase().includes(term) ||
      inv.clienteNombre.toLowerCase().includes(term) ||
      inv.clienteRfc.toLowerCase().includes(term) ||
      (inv.remisionFolio && inv.remisionFolio.toLowerCase().includes(term)) ||
      (inv.uuidSat && inv.uuidSat.toLowerCase().includes(term));

    const matchesStatus =
      statusFilter === 'todos' || inv.status === statusFilter;

    const matchesMetodo =
      metodoFilter === 'todos' || inv.metodoPago === metodoFilter;

    return matchesSearch && matchesStatus && matchesMetodo;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner: SAT Demo Disclaimer */}
      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-900">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-700 shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold">
              Entorno de Demostración ERP RTM · Simulación de Facturación CFDI 4.0
            </p>
            <p className="text-[11px] text-amber-800/80">
              Generación de facturas electrónicas a partir de remisiones entregadas de cajas, etiquetas y empaque. El timbrado simula el proceso fiscal SAT y alimenta automáticamente el módulo de Cuentas por Cobrar (CxC).
            </p>
          </div>
        </div>
        {onNavigateToCxc && (
          <button
            onClick={() => onNavigateToCxc()}
            className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>Ir a CxC</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black tracking-tight text-theme-main">
              Facturación de Clientes
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-theme-primary/10 text-theme-primary border border-theme-primary/20">
              CFDI 4.0
            </span>
          </div>
          <p className="text-xs text-theme-muted mt-1">
            Gestión de comprobantes fiscales de venta, enlace con remisiones de entrega y cuentas por cobrar
          </p>
        </div>

        <button
          onClick={() => setIsGenerateOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-theme-primary hover:bg-theme-primary/90 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Factura desde Remisión</span>
          {eligibleRemisiones.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-mono">
              {eligibleRemisiones.length}
            </span>
          )}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle shadow-xs">
          <div className="flex items-center justify-between text-theme-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Facturado Total</span>
            <DollarSign className="w-4 h-4 text-theme-primary" />
          </div>
          <div className="text-xl font-black text-theme-main font-mono">
            ${totalFacturado.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-theme-muted mt-1">Suma total de comprobantes en sistema</p>
        </div>

        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle shadow-xs">
          <div className="flex items-center justify-between text-theme-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Timbradas con UUID</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-black text-emerald-700 font-mono">
            {timbradasCount} <span className="text-xs font-normal text-theme-muted">facturas</span>
          </div>
          <p className="text-[11px] text-theme-muted mt-1">Validadas fiscalmente (activas en CxC)</p>
        </div>

        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle shadow-xs">
          <div className="flex items-center justify-between text-theme-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Por Timbrar / Borrador</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-black text-amber-700 font-mono">
            {pendientesTimbrarCount} <span className="text-xs font-normal text-theme-muted">en espera</span>
          </div>
          <p className="text-[11px] text-theme-muted mt-1">Preparadas para certificación fiscal</p>
        </div>

        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle shadow-xs">
          <div className="flex items-center justify-between text-theme-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Saldo Pendiente CxC</span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-black text-blue-700 font-mono">
            ${saldoPendienteTotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-theme-muted mt-1">Cartera por cobrar vinculada</p>
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
            placeholder="Buscar por folio, cliente, RFC, remisión de origen o UUID..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-theme-subtle bg-theme-base text-theme-main text-xs focus:ring-2 focus:ring-theme-primary/20 outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-theme-muted">
            <Filter className="w-3.5 h-3.5" />
            <span>Estado:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-theme-subtle bg-theme-base text-theme-main text-xs font-medium focus:ring-2 focus:ring-theme-primary/20 outline-none"
          >
            <option value="todos">Todos los estados</option>
            <option value="timbrada">Timbradas</option>
            <option value="lista_timbrar">Listas para timbrar</option>
            <option value="borrador">Borradores</option>
          </select>

          <select
            value={metodoFilter}
            onChange={(e) => setMetodoFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-theme-subtle bg-theme-base text-theme-main text-xs font-medium focus:ring-2 focus:ring-theme-primary/20 outline-none"
          >
            <option value="todos">Método: Todos</option>
            <option value="PPD">PPD - En parcialidades</option>
            <option value="PUE">PUE - Una sola exhibición</option>
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-2xl border border-theme-subtle bg-theme-surface overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-theme-muted/40 border-b border-theme-subtle text-[11px] uppercase font-bold text-theme-muted tracking-wider">
              <tr>
                <th className="px-4 py-3">Folio & UUID</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Cliente / RFC</th>
                <th className="px-4 py-3">Origen</th>
                <th className="px-4 py-3">Pago</th>
                <th className="px-4 py-3 text-right">Total MXN</th>
                <th className="px-4 py-3 text-center">Estado Fiscal</th>
                <th className="px-4 py-3 text-center">Cobranza</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-subtle">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-theme-muted text-xs">
                    No se encontraron facturas con los criterios de búsqueda seleccionados.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => {
                  const isTimbrada = inv.status === 'timbrada';
                  return (
                    <tr key={inv.id} className="hover:bg-theme-muted/20 transition-colors">
                      {/* Folio & UUID */}
                      <td className="px-4 py-3 font-mono">
                        <div className="font-bold text-theme-main text-xs">{inv.folio}</div>
                        {inv.uuidSat ? (
                          <div className="text-[10px] text-blue-700 font-medium truncate max-w-[140px]" title={inv.uuidSat}>
                            {inv.uuidSat.substring(0, 18)}...
                          </div>
                        ) : (
                          <div className="text-[10px] text-amber-600 italic">Sin timbrar</div>
                        )}
                      </td>

                      {/* Fecha */}
                      <td className="px-4 py-3 text-theme-muted text-[11px] whitespace-nowrap">
                        {new Date(inv.fechaEmision).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>

                      {/* Cliente / RFC */}
                      <td className="px-4 py-3 max-w-xs">
                        <div className="font-semibold text-theme-main truncate" title={inv.clienteNombre}>
                          {inv.clienteNombre}
                        </div>
                        <div className="text-[10px] font-mono text-theme-muted">{inv.clienteRfc}</div>
                      </td>

                      {/* Origen */}
                      <td className="px-4 py-3">
                        {inv.remisionFolio ? (
                          <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-800 text-[10px] font-mono border border-zinc-200">
                            {inv.remisionFolio}
                          </span>
                        ) : (
                          <span className="text-theme-muted text-[10px] italic">Directa</span>
                        )}
                      </td>

                      {/* Pago */}
                      <td className="px-4 py-3">
                        <div className="font-bold text-[11px] text-theme-main">{inv.metodoPago}</div>
                        <div className="text-[10px] text-theme-muted">Forma {inv.formaPago}</div>
                      </td>

                      {/* Total */}
                      <td className="px-4 py-3 text-right font-mono">
                        <div className="font-bold text-theme-main text-xs">
                          ${inv.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-[10px] text-theme-muted">
                          IVA: ${inv.iva.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </div>
                      </td>

                      {/* Estado Fiscal */}
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isTimbrada
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                              : inv.status === 'lista_timbrar'
                              ? 'bg-blue-50 text-blue-700 border border-blue-300'
                              : 'bg-amber-50 text-amber-700 border border-amber-300'
                          }`}
                        >
                          {isTimbrada ? 'Timbrada' : inv.status === 'lista_timbrar' ? 'Lista p/ Timbre' : 'Borrador'}
                        </span>
                      </td>

                      {/* Cobranza */}
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            inv.estadoPago === 'pagada'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                              : inv.estadoPago === 'parcial'
                              ? 'bg-amber-50 text-amber-700 border border-amber-300'
                              : 'bg-rose-50 text-rose-700 border border-rose-300'
                          }`}
                        >
                          {inv.estadoPago === 'pagada' ? 'Pagada' : inv.estadoPago === 'parcial' ? 'Parcial' : 'Pendiente'}
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
                            title="Ver Detalle Fiscal"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              setSelectedInvoice(inv);
                              setIsPrintPreviewOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-theme-muted hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                            title="Vista previa / Imprimir"
                          >
                            <Printer className="w-4 h-4" />
                          </button>

                          {!isTimbrada && (
                            <button
                              onClick={() => handleStampInvoice(inv.id)}
                              className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
                              title="Timbrar con PAC"
                            >
                              <Sparkles className="w-3 h-3 text-emerald-600" />
                              <span>Timbrar</span>
                            </button>
                          )}

                          {isTimbrada && onNavigateToCxc && inv.cxcId && (
                            <button
                              onClick={() => onNavigateToCxc(inv.cxcId)}
                              className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                              title="Ver en CxC"
                            >
                              <ExternalLink className="w-4 h-4" />
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
      <FacturaDetailModal
        invoice={selectedInvoice}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedInvoice(null);
        }}
        onNavigateToCxc={onNavigateToCxc}
      />

      <FacturaPrintPreviewModal
        invoice={selectedInvoice}
        isOpen={isPrintPreviewOpen}
        onClose={() => {
          setIsPrintPreviewOpen(false);
          setSelectedInvoice(null);
        }}
      />

      <GenerarFacturaModal
        isOpen={isGenerateOpen}
        onClose={() => setIsGenerateOpen(false)}
        eligibleRemisiones={eligibleRemisiones}
        onGenerateInvoice={handleGenerateInvoice}
      />
    </div>
  );
};
