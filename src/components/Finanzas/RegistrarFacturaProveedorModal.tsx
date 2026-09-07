import React, { useState } from 'react';
import { X, FileText, Building2, CheckCircle2, AlertCircle, Scale } from 'lucide-react';
import { SupplierInvoice, ThreeWayMatchItem } from '../../data/mockFinanzasData';

interface RegistrarFacturaProveedorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterInvoice: (invoice: SupplierInvoice) => void;
}

export const RegistrarFacturaProveedorModal: React.FC<RegistrarFacturaProveedorModalProps> = ({
  isOpen,
  onClose,
  onRegisterInvoice,
}) => {
  const [proveedor, setProveedor] = useState<string>('Bio-Pappel S.A.B. de C.V.');
  const [proveedorRfc, setProveedorRfc] = useState<string>('BPA820101XYZ');
  const [folioProveedor, setFolioProveedor] = useState<string>('FP-990142');
  const [ordenCompra, setOrdenCompra] = useState<string>('OC-RTM-2026-0084');
  const [recepcionFolio, setRecepcionFolio] = useState<string>('REC-RTM-2026-0057');
  const [subtotal, setSubtotal] = useState<string>('125000');
  const [diasCredito, setDiasCredito] = useState<number>(30);
  const [sku, setSku] = useState<string>('BOB-KRAFT-200');
  const [descripcion, setDescripcion] = useState<string>('Bobina Kraft Liner 200g Ancho 1.60m Virgen');
  const [cantidadFacturada, setCantidadFacturada] = useState<number>(10);
  const [precioFacturado, setPrecioFacturado] = useState<number>(8500);

  if (!isOpen) return null;

  const numSubtotal = parseFloat(subtotal) || (cantidadFacturada * precioFacturado);
  const iva = numSubtotal * 0.16;
  const total = numSubtotal + iva;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const now = new Date();
    const vencimiento = new Date();
    vencimiento.setDate(vencimiento.getDate() + diasCredito);

    const matchItem: ThreeWayMatchItem = {
      id: `match-item-${Date.now()}`,
      sku: sku,
      descripcion: descripcion,
      cantOrdenada: cantidadFacturada,
      precioOrdenado: precioFacturado,
      cantRecibida: cantidadFacturada,
      recepcionFolio: recepcionFolio,
      cantFacturada: cantidadFacturada,
      precioFacturado: precioFacturado,
      unidad: 'TON',
      variacionCantidad: 0,
      variacionPrecio: 0,
      estado: 'ok',
    };

    const newSupplierInvoice: SupplierInvoice = {
      id: `cxp-${Date.now()}`,
      folioProveedor: folioProveedor.trim(),
      uuidSat: `${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-4C10-90D1-${Math.random().toString(36).substring(2, 14).toUpperCase()}`,
      proveedorId: 'prov-auto',
      proveedorNombre: proveedor,
      proveedorRfc: proveedorRfc,
      ordenCompraFolio: ordenCompra,
      recepcionFolio: recepcionFolio,
      fechaEmision: now.toISOString().split('T')[0],
      fechaRecepcion: now.toISOString().split('T')[0],
      fechaVencimiento: vencimiento.toISOString().split('T')[0],
      diasCredito: diasCredito,
      moneda: 'MXN',
      subtotal: numSubtotal,
      iva: iva,
      total: total,
      saldoPendiente: total,
      totalPagado: 0,
      matchStatus: 'conciliada',
      toleranciaExcedida: false,
      estadoPago: 'programada',
      fechaProgramadaPago: vencimiento.toISOString().split('T')[0],
      matchItems: [matchItem],
      historialPagos: [],
    };

    onRegisterInvoice(newSupplierInvoice);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-theme-surface border border-theme-subtle rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-theme-main">
        <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-muted/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-theme-primary/10 border border-theme-primary/20 flex items-center justify-center text-theme-primary">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-theme-main">
                Registrar Factura de Proveedor (Recepción CFDI)
              </h3>
              <p className="text-xs text-theme-muted">
                Captura de comprobante fiscal para validación contra Orden de Compra y Almacén
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-theme-muted hover:text-theme-main hover:bg-theme-muted transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-theme-muted font-bold text-[11px] mb-1 uppercase tracking-wider">
                Proveedor *
              </label>
              <select
                value={proveedor}
                onChange={(e) => {
                  setProveedor(e.target.value);
                  if (e.target.value.includes('Bio-Pappel')) {
                    setProveedorRfc('BPA820101XYZ');
                    setSku('BOB-KRAFT-200');
                    setDescripcion('Bobina Kraft Liner 200g Ancho 1.60m');
                  } else if (e.target.value.includes('Sun Chemical')) {
                    setProveedorRfc('SCM700815AA2');
                    setSku('TINTA-FLX-CYAN');
                    setDescripcion('Tinta Flexográfica Base Agua Cyan RTM-Pro');
                  } else {
                    setProveedorRfc('ADM981010TX1');
                    setSku('SUSTR-FASSON-TT');
                    setDescripcion('Rollo Fasson Thermal Transfer 1P S2045N');
                  }
                }}
                className="w-full px-3 py-2 rounded-xl border border-theme-subtle bg-theme-surface text-theme-main text-xs focus:ring-2 focus:ring-theme-primary/20 outline-none"
              >
                <option value="Bio-Pappel S.A.B. de C.V.">Bio-Pappel S.A.B. de C.V. (Bobinas Kraft)</option>
                <option value="Sun Chemical México S.A. de C.V.">Sun Chemical México S.A. de C.V. (Tintas Flexo)</option>
                <option value="Avery Dennison Materials México">Avery Dennison Materials México (Sustratos Etiqueta)</option>
              </select>
            </div>

            <div>
              <label className="block text-theme-muted font-bold text-[11px] mb-1 uppercase tracking-wider">
                Folio Factura Proveedor *
              </label>
              <input
                type="text"
                value={folioProveedor}
                onChange={(e) => setFolioProveedor(e.target.value)}
                placeholder="Ej: FP-990142"
                className="w-full px-3 py-2 rounded-xl border border-theme-subtle bg-theme-surface text-theme-main text-xs focus:ring-2 focus:ring-theme-primary/20 outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-theme-muted font-bold text-[11px] mb-1 uppercase tracking-wider">
                Orden de Compra Relacionada *
              </label>
              <input
                type="text"
                value={ordenCompra}
                onChange={(e) => setOrdenCompra(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-theme-subtle bg-theme-surface text-theme-main text-xs focus:ring-2 focus:ring-theme-primary/20 outline-none font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-theme-muted font-bold text-[11px] mb-1 uppercase tracking-wider">
                Folio Recepción de Almacén *
              </label>
              <input
                type="text"
                value={recepcionFolio}
                onChange={(e) => setRecepcionFolio(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-theme-subtle bg-theme-surface text-theme-main text-xs focus:ring-2 focus:ring-theme-primary/20 outline-none font-mono"
                required
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-theme-subtle bg-theme-muted/20 space-y-2">
            <span className="font-bold text-[11px] uppercase tracking-wider text-theme-main block">
              Validación contra Orden de Compra y Recepción
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <span className="text-theme-muted text-[10px] block">SKU / Descripción</span>
                <strong className="text-theme-main block text-xs">{sku}</strong>
                <span className="text-[10px] text-theme-muted">{descripcion}</span>
              </div>
              <div>
                <span className="text-theme-muted text-[10px] block">Cantidad Facturada</span>
                <input
                  type="number"
                  value={cantidadFacturada}
                  onChange={(e) => setCantidadFacturada(Number(e.target.value))}
                  className="w-full px-2 py-1 rounded-lg border border-theme-subtle bg-theme-surface text-xs font-mono font-bold"
                />
              </div>
              <div>
                <span className="text-theme-muted text-[10px] block">Precio Unitario ($)</span>
                <input
                  type="number"
                  value={precioFacturado}
                  onChange={(e) => setPrecioFacturado(Number(e.target.value))}
                  className="w-full px-2 py-1 rounded-lg border border-theme-subtle bg-theme-surface text-xs font-mono font-bold"
                />
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-theme-muted/30 border border-theme-subtle flex justify-between items-center text-xs">
            <div>
              <span className="text-theme-muted">Subtotal: ${numSubtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
              <span className="text-theme-muted ml-3">IVA 16%: ${iva.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
            </div>
            <div>
              <span className="text-theme-muted mr-1">Total Factura:</span>
              <strong className="font-mono text-sm text-theme-main">${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN</strong>
            </div>
          </div>

          <div className="pt-3 border-t border-theme-subtle flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-theme-subtle hover:bg-theme-muted text-xs font-semibold text-theme-muted hover:text-theme-main transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-theme-primary hover:bg-theme-primary/90 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Registrar y Validar Factura</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
