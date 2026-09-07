import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FilePlus2,
  FileText,
  Layers,
  ShieldAlert,
  Tag,
  Truck,
  Users,
  X,
} from 'lucide-react';
import {
  CustomerComplaint,
  ComplaintSeverity,
  ComplaintTraceability,
} from '../../data/mockCustomerQualityData';

interface Props {
  onClose: () => void;
  onSave: (newComplaint: CustomerComplaint) => void;
  onToast: (msg: string) => void;
}

export const NuevaQuejaModal: React.FC<Props> = ({
  onClose,
  onSave,
  onToast,
}) => {
  // Form states
  const [client, setClient] = useState('Panasonic Industrial');
  const [clientContact, setClientContact] = useState('Ing. Roberto Cantú (Calidad)');
  const [partNumber, setPartNumber] = useState('526412 | G |');
  const [partDescription, setPartDescription] = useState('Etiqueta Identificación Automotriz 4x2');
  const [defectType, setDefectType] = useState('Código DataMatrix con baja reflectancia en escáner');
  const [severity, setSeverity] = useState<ComplaintSeverity>('Mayor');
  const [claimedQuantity, setClaimedQuantity] = useState(10000);
  const [claimedValue, setClaimedValue] = useState(12500);

  // Traceability
  const [opFolio, setOpFolio] = useState('OP-2026-95250');
  const [lotNumber, setLotNumber] = useState('PT-260907-00345');
  const [shipmentFolio, setShipmentFolio] = useState('EMB-2026-0410');
  const [invoiceNumber, setInvoiceNumber] = useState('FAC-2026-7891');
  const [productionLine, setProductionLine] = useState('Prensa Mark Andy Scout');
  const [operator, setOperator] = useState('María Ríos');

  // RMA immediate request
  const [requiresRma, setRequiresRma] = useState(true);

  // Pre-configured clients & products
  const CLIENT_PRESETS: Record<
    string,
    { part: string; desc: string; op: string; line: string; opContact: string }
  > = {
    'Panasonic Industrial': {
      part: '526412 | G |',
      desc: 'Etiqueta Identificación Automotriz 4x2',
      op: 'OP-2026-95250',
      line: 'Prensa Mark Andy Scout',
      opContact: 'Ing. Roberto Cantú (Calidad)',
    },
    'TYCO Electronics': {
      part: 'NA472050',
      desc: 'Etiqueta Poliéster Térmico con Adhesivo Permanente',
      op: 'OP-2026-95252',
      line: 'Prensa Mark Andy 4120',
      opContact: 'Ing. Carlos Zepeda',
    },
    'BLACK & DECKER': {
      part: 'IS-2420',
      desc: 'Folleto Instructivo Plegado para Taladro',
      op: 'OP-2026-95249',
      line: 'Offset Heidelberg CD 102',
      opContact: 'Lic. Mónica Fuentes',
    },
    'Laboratorios Medifarma': {
      part: 'ETIQ-FARMA-10',
      desc: 'Etiqueta Farmacéutica para Frasco Jarabe 120ml',
      op: 'OP-2026-95240',
      line: 'Prensa Mark Andy Scout',
      opContact: 'Q.F.B. Laura Treviño',
    },
    'Truper Herramientas': {
      part: 'ET-TRU-550',
      desc: 'Etiqueta Amarilla para Rotomartillo 1/2"',
      op: 'OP-2026-95254',
      line: 'Prensa Mark Andy Scout',
      opContact: 'Ing. Fernando Morales',
    },
  };

  const handleClientChange = (selected: string) => {
    setClient(selected);
    const preset = CLIENT_PRESETS[selected];
    if (preset) {
      setPartNumber(preset.part);
      setPartDescription(preset.desc);
      setOpFolio(preset.op);
      setProductionLine(preset.line);
      setClientContact(preset.opContact);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!defectType.trim()) {
      onToast('⚠️ Error: Debes especificar el defecto reportado por el cliente.');
      return;
    }

    const complaintNum = Math.floor(21 + Math.random() * 70);
    const newId = `QJ-2026-0${complaintNum}`;
    const newRmaId = requiresRma ? `RMA-2026-0${complaintNum}` : undefined;

    const traceability: ComplaintTraceability = {
      opFolio,
      lotNumber,
      shipmentFolio,
      invoiceNumber,
      productionLine,
      operator,
      deliveryDate: '07 Sep 2026',
    };

    const newComplaint: CustomerComplaint = {
      id: newId,
      rmaNumber: newRmaId,
      date: '07 Sep 2026',
      client,
      clientContact,
      partNumber,
      partDescription,
      defectType,
      severity,
      claimedQuantity: Number(claimedQuantity),
      claimedValue: Number(claimedValue),
      status: requiresRma ? 'En evaluación QA' : 'Abierta',
      traceability,
      evidences: [],
      auditTrail: [
        {
          id: `aud-reg-${Date.now()}`,
          timestamp: '07 Sep 2026 · ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          user: 'Aseguramiento de Calidad',
          role: 'Recepción SGC',
          action: 'Apertura de Reclamo',
          notes: `Reclamo formal registrado por ${clientContact}. ${requiresRma ? 'Solicitud de autorización RMA generada.' : ''}`,
        },
      ],
    };

    if (requiresRma) {
      newComplaint.rmaDetails = {
        rmaNumber: newRmaId!,
        rmaType: 'Retorno y Reemplazo',
        approvalDate: '07 Sep 2026',
        approvedBy: 'Pendiente Dictamen QA',
        receivedAtWarehouse: false,
        resolutionStatus: 'Pendiente Retorno',
      };
    }

    onSave(newComplaint);
    onToast(`✓ Queja ${newId} ${requiresRma ? `y solicitud de ${newRmaId}` : ''} registrada con éxito.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col rounded-3xl border border-theme-subtle bg-theme-surface shadow-2xl text-xs overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-theme-subtle p-4 bg-theme-muted/10">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              <FilePlus2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-xs text-rose-600 dark:text-rose-400">
                  Customer Quality SGC
                </span>
                <span className="rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 px-2 py-0.2 text-[9px] font-bold">
                  Registro de No Conformidad Externa
                </span>
              </div>
              <h3 className="font-black text-sm text-theme-main">
                Registrar Nueva Queja de Cliente / Solicitud de RMA
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-1.5 text-theme-muted hover:bg-theme-muted/20 hover:text-theme-main transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="overflow-y-auto p-5 space-y-4 flex-1">
            {/* 1. Cliente y Contacto */}
            <div className="rounded-2xl border border-theme-subtle bg-theme-muted/10 p-4 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block">
                1. Datos del Cliente y Producto Reclamado
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-theme-muted block mb-1">
                    Cliente Afectado:
                  </label>
                  <select
                    value={client}
                    onChange={(e) => handleClientChange(e.target.value)}
                    className="w-full rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 text-xs font-bold text-theme-main focus:outline-none focus:border-theme-primary cursor-pointer"
                  >
                    {Object.keys(CLIENT_PRESETS).map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-theme-muted block mb-1">
                    Contacto / Emisor en Cliente:
                  </label>
                  <input
                    type="text"
                    required
                    value={clientContact}
                    onChange={(e) => setClientContact(e.target.value)}
                    className="w-full rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 text-xs text-theme-main focus:outline-none focus:border-theme-primary"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-theme-muted block mb-1">
                    Número de Parte:
                  </label>
                  <input
                    type="text"
                    required
                    value={partNumber}
                    onChange={(e) => setPartNumber(e.target.value)}
                    className="w-full rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 text-xs font-mono font-bold text-theme-main focus:outline-none focus:border-theme-primary"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-theme-muted block mb-1">
                    Descripción del Producto:
                  </label>
                  <input
                    type="text"
                    value={partDescription}
                    onChange={(e) => setPartDescription(e.target.value)}
                    className="w-full rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 text-xs text-theme-main focus:outline-none focus:border-theme-primary"
                  />
                </div>
              </div>
            </div>

            {/* 2. Defecto y Severidad */}
            <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block">
                2. Detalle del Defecto Reportado
              </span>
              <div>
                <label className="text-[10px] font-bold uppercase text-theme-muted block mb-1">
                  Descripción Detallada de la No Conformidad:
                </label>
                <textarea
                  rows={2}
                  required
                  value={defectType}
                  onChange={(e) => setDefectType(e.target.value)}
                  placeholder="Ej. Código DataMatrix con baja reflectancia en escáner Cognex..."
                  className="w-full rounded-xl border border-theme-subtle bg-theme-surface p-3 text-xs text-theme-main focus:outline-none focus:border-theme-primary"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-theme-muted block mb-1">
                    Severidad:
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as ComplaintSeverity)}
                    className="w-full rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 text-xs font-bold text-theme-main focus:outline-none focus:border-theme-primary cursor-pointer"
                  >
                    <option value="Crítica">Crítica (Paro de línea cliente)</option>
                    <option value="Mayor">Mayor (Retrabajo en ensamble)</option>
                    <option value="Menor">Menor (Desviación estética)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-theme-muted block mb-1">
                    Cantidad Reclamada (Pzas):
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={claimedQuantity}
                    onChange={(e) => setClaimedQuantity(Number(e.target.value))}
                    className="w-full rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 text-xs font-mono font-bold text-theme-main focus:outline-none focus:border-theme-primary"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-theme-muted block mb-1">
                    Impacto Estimado ($ MXN):
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={claimedValue}
                    onChange={(e) => setClaimedValue(Number(e.target.value))}
                    className="w-full rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 text-xs font-mono font-bold text-rose-600 focus:outline-none focus:border-theme-primary"
                  />
                </div>
              </div>
            </div>

            {/* 3. Trazabilidad de Origen Obligatoria */}
            <div className="rounded-2xl border border-theme-subtle bg-theme-muted/10 p-4 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block">
                3. Trazabilidad de Producción y Salida (No Duplicar)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div>
                  <label className="text-[9px] font-bold uppercase text-theme-muted block mb-0.5">
                    Orden de Producción:
                  </label>
                  <input
                    type="text"
                    required
                    value={opFolio}
                    onChange={(e) => setOpFolio(e.target.value)}
                    className="w-full rounded-xl border border-theme-subtle bg-theme-surface px-2.5 py-1.5 text-xs font-mono font-bold text-theme-main focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-bold uppercase text-theme-muted block mb-0.5">
                    Lote de PT:
                  </label>
                  <input
                    type="text"
                    value={lotNumber}
                    onChange={(e) => setLotNumber(e.target.value)}
                    className="w-full rounded-xl border border-theme-subtle bg-theme-surface px-2.5 py-1.5 text-xs font-mono text-theme-main focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-bold uppercase text-theme-muted block mb-0.5">
                    Folio Embarque:
                  </label>
                  <input
                    type="text"
                    value={shipmentFolio}
                    onChange={(e) => setShipmentFolio(e.target.value)}
                    className="w-full rounded-xl border border-theme-subtle bg-theme-surface px-2.5 py-1.5 text-xs font-mono text-theme-main focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-bold uppercase text-theme-muted block mb-0.5">
                    Factura Comercial:
                  </label>
                  <input
                    type="text"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="w-full rounded-xl border border-theme-subtle bg-theme-surface px-2.5 py-1.5 text-xs font-mono text-theme-main focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 4. Solicitud de RMA */}
            <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requiresRma}
                  onChange={(e) => setRequiresRma(e.target.checked)}
                  className="rounded border-theme-subtle text-theme-primary focus:ring-theme-primary h-4 w-4"
                />
                <div>
                  <b className="text-xs font-bold text-theme-main block">
                    Generar solicitud inmediata de autorización de RMA (Retorno de Mercancía)
                  </b>
                  <p className="text-[11px] text-theme-muted mt-0.5">
                    Asigna un folio oficial `RMA-2026-XXX` y habilita la recepción en cuarentena de producto devuelto.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between border-t border-theme-subtle p-4 bg-theme-muted/10">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-theme-subtle bg-theme-surface px-4 py-2 text-xs font-bold text-theme-muted hover:text-theme-main cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl bg-theme-primary px-4 py-2 text-xs font-bold text-white hover:bg-theme-primary/90 shadow-md cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Registrar Caso en SGC</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
