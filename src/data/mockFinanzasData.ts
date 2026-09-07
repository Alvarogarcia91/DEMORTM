export type InvoiceStatus = 'borrador' | 'lista_timbrar' | 'timbrada' | 'cancelada';

export type PaymentMethodSat = 'PUE' | 'PPD';
export type PaymentFormSat = '01' | '02' | '03' | '04' | '28' | '99'; // 01 Efectivo, 03 Transferencia, 04 Tarjeta, 99 Por definir
export type CfdiUsageSat = 'G01' | 'G03' | 'I08' | 'CP01' | 'S01';

export interface InvoiceItem {
  id: string;
  sku: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  subtotal: number;
  taxRate: number; // 0.16
  taxAmount: number;
  total: number;
  satKey: string;
  satUnit: string;
}

export interface SalesInvoice {
  id: string;
  folio: string; // FAC-RTM-2026-0048
  uuidSat?: string;
  fechaEmision: string;
  fechaTimbrado?: string;
  clienteId: string;
  clienteNombre: string;
  clienteRfc: string;
  clienteRegimen: string;
  clienteCp: string;
  remisionId?: string;
  remisionFolio?: string;
  pedidoFolio?: string;
  status: InvoiceStatus;
  metodoPago: PaymentMethodSat;
  formaPago: PaymentFormSat;
  usoCfdi: CfdiUsageSat;
  moneda: 'MXN' | 'USD';
  subtotal: number;
  iva: number;
  total: number;
  cxcId?: string;
  saldoPendiente: number;
  estadoPago: 'pendiente' | 'parcial' | 'pagada';
  items: InvoiceItem[];
  notas?: string;
}

export interface PaymentRecord {
  id: string;
  fecha: string;
  monto: number;
  formaPago: string;
  referencia: string;
  bancoDestino: string;
  comprobanteFolio?: string;
  registradoPor: string;
  notas?: string;
}

export interface AccountReceivable {
  id: string;
  facturaId: string;
  facturaFolio: string;
  uuidSat?: string;
  clienteId: string;
  clienteNombre: string;
  clienteRfc: string;
  fechaEmision: string;
  fechaVencimiento: string;
  diasCredito: number;
  diasMora: number; // >0 si ya venció
  diasParaVencer: number; // >0 si está por vencer
  montoOriginal: number;
  saldoPendiente: number;
  totalPagado: number;
  status: 'al_corriente' | 'por_vencer' | 'vencida' | 'pagada';
  bucket: 'vigente' | '1_30' | '31_60' | '61_90' | 'mas_90';
  metodoPago: PaymentMethodSat;
  historialPagos: PaymentRecord[];
  contactoCobranza: {
    nombre: string;
    email: string;
    telefono: string;
  };
}

export type ThreeWayMatchStatus = 'conciliada' | 'discrepancia_precio' | 'discrepancia_cantidad' | 'pendiente_recepcion';

export interface ThreeWayMatchItem {
  id: string;
  sku: string;
  descripcion: string;
  // Purchase Order
  cantOrdenada: number;
  precioOrdenado: number;
  // Warehouse Reception
  cantRecibida: number;
  recepcionFolio: string;
  // Supplier Invoice
  cantFacturada: number;
  precioFacturado: number;
  unidad: string;
  // Discrepancy details
  variacionCantidad: number; // cantFacturada - cantRecibida
  variacionPrecio: number; // precioFacturado - precioOrdenado
  estado: 'ok' | 'diferencia_cant' | 'diferencia_precio';
}

export interface SupplierPaymentRecord {
  id: string;
  fecha: string;
  monto: number;
  cuentaOrigen: string;
  metodoPago: string;
  referenciaBancaria: string;
  autorizadoPor: string;
  notas?: string;
}

export interface SupplierInvoice {
  id: string;
  folioProveedor: string; // FP-883724
  uuidSat: string;
  proveedorId: string;
  proveedorNombre: string;
  proveedorRfc: string;
  ordenCompraFolio: string;
  recepcionFolio: string;
  fechaEmision: string;
  fechaRecepcion: string;
  fechaVencimiento: string;
  diasCredito: number;
  moneda: 'MXN' | 'USD';
  subtotal: number;
  iva: number;
  total: number;
  saldoPendiente: number;
  totalPagado: number;
  matchStatus: ThreeWayMatchStatus;
  matchItems: ThreeWayMatchItem[];
  toleranciaExcedida: boolean;
  motivoDiscrepancia?: string;
  resolucionExcepcion?: {
    autorizadoPor: string;
    fecha: string;
    motivo: string;
  };
  estadoPago: 'pendiente' | 'programada' | 'parcial' | 'pagada' | 'bloqueada';
  fechaProgramadaPago?: string;
  historialPagos: SupplierPaymentRecord[];
}

export interface EligibleRemision {
  id: string;
  folio: string;
  pedidoFolio: string;
  clienteId: string;
  clienteNombre: string;
  clienteRfc: string;
  fechaEntrega: string;
  entregadoPor: string;
  recibidoPor: string;
  items: InvoiceItem[];
  subtotal: number;
  iva: number;
  total: number;
  diasCredito: number;
  formaPagoDefecto: PaymentFormSat;
  metodoPagoDefecto: PaymentMethodSat;
  usoCfdiDefecto: CfdiUsageSat;
}

// ----------------------------------------------------------------------
// MOCK DATA
// ----------------------------------------------------------------------

export const INITIAL_SALES_INVOICES: SalesInvoice[] = [
  {
    id: 'fac-0048',
    folio: 'FAC-RTM-2026-0048',
    uuidSat: '4A9F21E3-88B2-4C10-90D1-6F7D2B91A401',
    fechaEmision: '2026-08-20T10:30:00',
    fechaTimbrado: '2026-08-20T10:32:15',
    clienteId: 'cli-002',
    clienteNombre: 'TRICO TECHNOLOGIES CORPORATION',
    clienteRfc: 'TTC880315PL1',
    clienteRegimen: '601 - General de Ley Personas Morales',
    clienteCp: '88780',
    remisionId: 'REM-2026-0061',
    remisionFolio: 'REM-2026-0061',
    pedidoFolio: 'PED-RTM-2026-0141',
    status: 'timbrada',
    metodoPago: 'PPD',
    formaPago: '99',
    usoCfdi: 'G01',
    moneda: 'MXN',
    subtotal: 148500.00,
    iva: 23760.00,
    total: 172260.00,
    cxcId: 'cxc-0048',
    saldoPendiente: 72260.00,
    estadoPago: 'parcial',
    items: [
      {
        id: 'item-0048-1',
        sku: 'IS-2420',
        description: 'Slide-In Label Wiper Blade (Rev I-01) Flexo UV en Rollo',
        quantity: 150000,
        unit: 'PZA',
        unitPrice: 0.92,
        subtotal: 138000.00,
        taxRate: 0.16,
        taxAmount: 22080.00,
        total: 160080.00,
        satKey: '55121600',
        satUnit: 'H87'
      },
      {
        id: 'item-0048-2',
        sku: 'A163833BHA',
        description: 'Etiqueta Poliéster Grado Industrial 3M 7850 HL (Rev A)',
        quantity: 10000,
        unit: 'PZA',
        unitPrice: 1.05,
        subtotal: 10500.00,
        taxRate: 0.16,
        taxAmount: 1680.00,
        total: 12180.00,
        satKey: '55121600',
        satUnit: 'H87'
      }
    ],
    notas: 'Entrega en Parque Industrial Reynosa según orden de compra cliente PO-TRC-2026-991'
  },
  {
    id: 'fac-0049',
    folio: 'FAC-RTM-2026-0049',
    uuidSat: '8C7B9011-3E55-40F1-AA32-901844BCC023',
    fechaEmision: '2026-08-10T14:15:00',
    fechaTimbrado: '2026-08-10T14:17:02',
    clienteId: 'cli-001',
    clienteNombre: 'BLACK & DECKER (Stanley Black & Decker)',
    clienteRfc: 'SBD920412R34',
    clienteRegimen: '601 - General de Ley Personas Morales',
    clienteCp: '66637',
    remisionId: 'REM-2026-0059',
    remisionFolio: 'REM-2026-0059',
    pedidoFolio: 'PED-RTM-2026-0139',
    status: 'timbrada',
    metodoPago: 'PUE',
    formaPago: '03',
    usoCfdi: 'G03',
    moneda: 'MXN',
    subtotal: 82000.00,
    iva: 13120.00,
    total: 95120.00,
    cxcId: 'cxc-0049',
    saldoPendiente: 0.00,
    estadoPago: 'pagada',
    items: [
      {
        id: 'item-0049-1',
        sku: 'NA472050',
        description: 'Manual Cordless Recip Saw DCS382 NA (Rev 08/23) 24 págs Offset',
        quantity: 28771,
        unit: 'PZA',
        unitPrice: 2.85,
        subtotal: 82000.00,
        taxRate: 0.16,
        taxAmount: 13120.00,
        total: 95120.00,
        satKey: '55101500',
        satUnit: 'H87'
      }
    ],
    notas: 'Pago recibido el 11/08/2026 vía SPEI BBVA contra PO-SBD-87902.'
  },
  {
    id: 'fac-0050',
    folio: 'FAC-RTM-2026-0050',
    fechaEmision: '2026-09-02T11:00:00',
    clienteId: 'cli-004',
    clienteNombre: 'TYCO (Johnson Controls)',
    clienteRfc: 'TYC990708M12',
    clienteRegimen: '601 - General de Ley Personas Morales',
    clienteCp: '67132',
    remisionId: 'REM-2026-0062',
    remisionFolio: 'REM-2026-0062',
    pedidoFolio: 'PED-RTM-2026-0140',
    status: 'lista_timbrar',
    metodoPago: 'PPD',
    formaPago: '99',
    usoCfdi: 'G01',
    moneda: 'MXN',
    subtotal: 116000.00,
    iva: 18560.00,
    total: 134560.00,
    saldoPendiente: 134560.00,
    estadoPago: 'pendiente',
    items: [
      {
        id: 'item-0050-1',
        sku: '02-814-556',
        description: 'Instructivo e-Force Seguridad Contra Incendios (Rev B) Couché 100g',
        quantity: 85925,
        unit: 'PZA',
        unitPrice: 1.35,
        subtotal: 116000.00,
        taxRate: 0.16,
        taxAmount: 18560.00,
        total: 134560.00,
        satKey: '55101500',
        satUnit: 'H87'
      }
    ],
    notas: 'Validado con remisión REM-2026-0062 sellada por almacén de recibo.'
  },
  {
    id: 'fac-0051',
    folio: 'FAC-RTM-2026-0051',
    fechaEmision: '2026-09-05T09:20:00',
    clienteId: 'cli-003',
    clienteNombre: 'BISSELL INTERNATIONAL TRADING COMPANY B.V.',
    clienteRfc: 'BIT041120TK8',
    clienteRegimen: '601 - General de Ley Personas Morales',
    clienteCp: '66050',
    status: 'borrador',
    metodoPago: 'PUE',
    formaPago: '03',
    usoCfdi: 'G03',
    moneda: 'MXN',
    subtotal: 39000.00,
    iva: 6240.00,
    total: 45240.00,
    saldoPendiente: 45240.00,
    estadoPago: 'pendiente',
    items: [
      {
        id: 'item-0051-1',
        sku: '1641301',
        description: 'User Guide POWERFORCE HELIX (Rev .02/24) 16 páginas Papel Bond',
        quantity: 20000,
        unit: 'PZA',
        unitPrice: 1.95,
        subtotal: 39000.00,
        taxRate: 0.16,
        taxAmount: 6240.00,
        total: 45240.00,
        satKey: '55101500',
        satUnit: 'H87'
      }
    ],
    notas: 'Borrador en captura manual para revisión de precios especiales.'
  }
];

export const INITIAL_CXC_RECORDS: AccountReceivable[] = [
  {
    id: 'cxc-0048',
    facturaId: 'fac-0048',
    facturaFolio: 'FAC-RTM-2026-0048',
    uuidSat: '4A9F21E3-88B2-4C10-90D1-6F7D2B91A401',
    clienteId: 'cli-002',
    clienteNombre: 'TRICO TECHNOLOGIES CORPORATION',
    clienteRfc: 'TTC880315PL1',
    fechaEmision: '2026-08-20',
    fechaVencimiento: '2026-09-19', // 30 días crédito
    diasCredito: 30,
    diasMora: 0,
    diasParaVencer: 12,
    montoOriginal: 172260.00,
    saldoPendiente: 72260.00,
    totalPagado: 100000.00,
    status: 'por_vencer',
    bucket: 'vigente',
    metodoPago: 'PPD',
    historialPagos: [
      {
        id: 'pago-cxc-01',
        fecha: '2026-08-28',
        monto: 100000.00,
        formaPago: 'Transferencia SPEI (03)',
        referencia: 'SPEI-TRC-99381',
        bancoDestino: 'Banamex Cta 4819',
        comprobanteFolio: 'REP-RTM-2026-0012',
        registradoPor: 'L. Mendoza (Crédito y Cobranza)',
        notas: 'Abono acordado para liberación de entrega parcial'
      }
    ],
    contactoCobranza: {
      nombre: 'Lic. Gabriela Lozano (Demo)',
      email: 'glozano@trico-demo.com',
      telefono: '(899) 921-4422'
    }
  },
  {
    id: 'cxc-0045',
    facturaId: 'fac-0045',
    facturaFolio: 'FAC-RTM-2026-0045',
    uuidSat: '1E33A899-77D0-4211-BF90-C109419DF011',
    clienteId: 'cli-004',
    clienteNombre: 'TYCO (Johnson Controls)',
    clienteRfc: 'TYC990708M12',
    fechaEmision: '2026-07-15',
    fechaVencimiento: '2026-08-14', // 30 días crédito
    diasCredito: 30,
    diasMora: 24, // Vencida 24 días
    diasParaVencer: 0,
    montoOriginal: 89400.00,
    saldoPendiente: 89400.00,
    totalPagado: 0.00,
    status: 'vencida',
    bucket: '1_30',
    metodoPago: 'PPD',
    historialPagos: [],
    contactoCobranza: {
      nombre: 'Ing. Ricardo Villalobos (Demo)',
      email: 'rvillalobos@tyco-demo.com',
      telefono: '(81) 8221-5510'
    }
  },
  {
    id: 'cxc-0041',
    facturaId: 'fac-0041',
    facturaFolio: 'FAC-RTM-2026-0041',
    uuidSat: 'D2A10091-FF34-46E1-B001-A488091E47C2',
    clienteId: 'cli-003',
    clienteNombre: 'BISSELL INTERNATIONAL TRADING COMPANY B.V.',
    clienteRfc: 'BIT041120TK8',
    fechaEmision: '2026-06-25',
    fechaVencimiento: '2026-07-25',
    diasCredito: 30,
    diasMora: 44, // Vencida 44 días
    diasParaVencer: 0,
    montoOriginal: 54600.00,
    saldoPendiente: 24600.00,
    totalPagado: 30000.00,
    status: 'vencida',
    bucket: '31_60',
    metodoPago: 'PPD',
    historialPagos: [
      {
        id: 'pago-cxc-02',
        fecha: '2026-07-20',
        monto: 30000.00,
        formaPago: 'Transferencia SPEI (03)',
        referencia: 'TR-772109',
        bancoDestino: 'BBVA Cta 8821',
        comprobanteFolio: 'REP-RTM-2026-0009',
        registradoPor: 'L. Mendoza (Crédito y Cobranza)',
        notas: 'Abono parcial. Saldo remanente prometido para 30/08 pendiente.'
      }
    ],
    contactoCobranza: {
      nombre: 'Lic. Fernando Arteaga (Demo)',
      email: 'farteaga@bissell-demo.com',
      telefono: '(81) 8865-1215'
    }
  },
  {
    id: 'cxc-0049',
    facturaId: 'fac-0049',
    facturaFolio: 'FAC-RTM-2026-0049',
    uuidSat: '8C7B9011-3E55-40F1-AA32-901844BCC023',
    clienteId: 'cli-001',
    clienteNombre: 'BLACK & DECKER (Stanley Black & Decker)',
    clienteRfc: 'SBD920412R34',
    fechaEmision: '2026-08-10',
    fechaVencimiento: '2026-08-25',
    diasCredito: 15,
    diasMora: 0,
    diasParaVencer: 0,
    montoOriginal: 95120.00,
    saldoPendiente: 0.00,
    totalPagado: 95120.00,
    status: 'pagada',
    bucket: 'vigente',
    metodoPago: 'PUE',
    historialPagos: [
      {
        id: 'pago-cxc-03',
        fecha: '2026-08-11',
        monto: 95120.00,
        formaPago: 'Transferencia SPEI (03)',
        referencia: 'SPEI-SBD-00918',
        bancoDestino: 'BBVA Cta 8821',
        registradoPor: 'L. Mendoza (Crédito y Cobranza)',
        notas: 'Liquidación total PUE al día siguiente de entrega'
      }
    ],
    contactoCobranza: {
      nombre: 'Ing. Carlos Mendoza (Demo)',
      email: 'carlos.mendoza@sbdinc-demo.com',
      telefono: '(81) 8329-7010'
    }
  }
];

export const INITIAL_CXP_RECORDS: SupplierInvoice[] = [
  {
    id: 'cxp-001',
    folioProveedor: 'FP-883724',
    uuidSat: '3B009188-A45F-4E90-9901-C720011883F1',
    proveedorId: 'prov-01',
    proveedorNombre: 'Bio-Pappel S.A.B. de C.V.',
    proveedorRfc: 'BPA820101XYZ',
    ordenCompraFolio: 'OC-RTM-2026-0084',
    recepcionFolio: 'REC-RTM-2026-0057',
    fechaEmision: '2026-08-22',
    fechaRecepcion: '2026-08-23',
    fechaVencimiento: '2026-09-22',
    diasCredito: 30,
    moneda: 'MXN',
    subtotal: 185000.00,
    iva: 29600.00,
    total: 214600.00,
    saldoPendiente: 214600.00,
    totalPagado: 0.00,
    matchStatus: 'conciliada',
    toleranciaExcedida: false,
    estadoPago: 'programada',
    fechaProgramadaPago: '2026-09-21',
    matchItems: [
      {
        id: 'match-01-1',
        sku: 'BOB-KRAFT-200',
        descripcion: 'Bobina Kraft Liner 200g Ancho 1.60m Virgen',
        cantOrdenada: 15.0,
        precioOrdenado: 8500.00,
        cantRecibida: 15.0,
        recepcionFolio: 'REC-RTM-2026-0057',
        cantFacturada: 15.0,
        precioFacturado: 8500.00,
        unidad: 'TON',
        variacionCantidad: 0,
        variacionPrecio: 0,
        estado: 'ok'
      },
      {
        id: 'match-01-2',
        sku: 'BOB-MEDIUM-130',
        descripcion: 'Bobina Papel Semi-Kraft Medium 130g Corrugado',
        cantOrdenada: 10.0,
        precioOrdenado: 5750.00,
        cantRecibida: 10.0,
        recepcionFolio: 'REC-RTM-2026-0057',
        cantFacturada: 10.0,
        precioFacturado: 5750.00,
        unidad: 'TON',
        variacionCantidad: 0,
        variacionPrecio: 0,
        estado: 'ok'
      }
    ],
    historialPagos: []
  },
  {
    id: 'cxp-002',
    folioProveedor: 'FP-774910',
    uuidSat: 'F819A200-5511-48C2-BD09-009941AE4481',
    proveedorId: 'prov-02',
    proveedorNombre: 'Sun Chemical México S.A. de C.V.',
    proveedorRfc: 'SCM700815AA2',
    ordenCompraFolio: 'OC-RTM-2026-0088',
    recepcionFolio: 'REC-RTM-2026-0060',
    fechaEmision: '2026-08-25',
    fechaRecepcion: '2026-08-26',
    fechaVencimiento: '2026-09-25',
    diasCredito: 30,
    moneda: 'MXN',
    subtotal: 94400.00,
    iva: 15104.00,
    total: 109504.00,
    saldoPendiente: 109504.00,
    totalPagado: 0.00,
    matchStatus: 'discrepancia_cantidad',
    toleranciaExcedida: true,
    motivoDiscrepancia: 'Facturaron 16 cubetas de tinta Pantone 485 C pero almacén solo recibió 12 cubetas en REC-RTM-2026-0060 por daño en transporte.',
    estadoPago: 'bloqueada',
    matchItems: [
      {
        id: 'match-02-1',
        sku: 'TINTA-FLX-CYAN',
        descripcion: 'Tinta Flexográfica Base Agua Cyan RTM-Pro',
        cantOrdenada: 8.0,
        precioOrdenado: 4200.00,
        cantRecibida: 8.0,
        recepcionFolio: 'REC-RTM-2026-0060',
        cantFacturada: 8.0,
        precioFacturado: 4200.00,
        unidad: 'CUBETA',
        variacionCantidad: 0,
        variacionPrecio: 0,
        estado: 'ok'
      },
      {
        id: 'match-02-2',
        sku: 'TINTA-FLX-PANTONE-485C',
        descripcion: 'Tinta Flexo Base Agua Pantone 485 C (Rojo Médico)',
        cantOrdenada: 16.0,
        precioOrdenado: 3800.00,
        cantRecibida: 12.0, // Almacén solo recibió 12!
        recepcionFolio: 'REC-RTM-2026-0060',
        cantFacturada: 16.0, // Proveedor cobró las 16
        precioFacturado: 3800.00,
        unidad: 'CUBETA',
        variacionCantidad: 4.0,
        variacionPrecio: 0,
        estado: 'diferencia_cant'
      }
    ],
    historialPagos: []
  },
  {
    id: 'cxp-003',
    folioProveedor: 'FP-662190',
    uuidSat: '9912E410-0988-4BB2-9F01-7890AA43109E',
    proveedorId: 'prov-03',
    proveedorNombre: 'Avery Dennison Materials México S. de R.L. de C.V.',
    proveedorRfc: 'ADM981010TX1',
    ordenCompraFolio: 'OC-RTM-2026-0081',
    recepcionFolio: 'REC-RTM-2026-0052',
    fechaEmision: '2026-08-05',
    fechaRecepcion: '2026-08-06',
    fechaVencimiento: '2026-09-05',
    diasCredito: 30,
    moneda: 'MXN',
    subtotal: 130000.00,
    iva: 20800.00,
    total: 150800.00,
    saldoPendiente: 50800.00,
    totalPagado: 100000.00,
    matchStatus: 'conciliada',
    toleranciaExcedida: false,
    estadoPago: 'parcial',
    fechaProgramadaPago: '2026-09-08',
    matchItems: [
      {
        id: 'match-03-1',
        sku: 'SUSTR-FASSON-TT',
        descripcion: 'Rollo Fasson Thermal Transfer 1P S2045N 1000m x 250mm',
        cantOrdenada: 20.0,
        precioOrdenado: 6500.00,
        cantRecibida: 20.0,
        recepcionFolio: 'REC-RTM-2026-0052',
        cantFacturada: 20.0,
        precioFacturado: 6500.00,
        unidad: 'ROLLO',
        variacionCantidad: 0,
        variacionPrecio: 0,
        estado: 'ok'
      }
    ],
    historialPagos: [
      {
        id: 'pago-cxp-01',
        fecha: '2026-08-25',
        monto: 100000.00,
        cuentaOrigen: 'BBVA MXN Cta Cheques 8821',
        metodoPago: 'SPEI',
        referenciaBancaria: 'SPEI-AVERY-88301',
        autorizadoPor: 'Lic. Gerardo Morales (Dir. Finanzas)',
        notas: 'Primer pago parcial programado acordado con el proveedor.'
      }
    ]
  }
];

// Cartera y obligaciones adicionales: suficientes para que los tableros, aging y
// estados de cuenta cuenten una historia operativa, no sólo tres documentos aislados.
const cxcSeed = [
  ['0052', 'cli-005', 'ILSCO DE MÉXICO, S.A. DE C.V.', 'IME880730KE4', '2026-09-01', '2026-10-01', 118900, 0, 'al_corriente', 'vigente', 0, 24],
  ['0053', 'cli-006', 'ENTAIL INDUSTRIAL, S. DE R.L.', 'EIN1103248S7', '2026-08-29', '2026-09-08', 76480, 0, 'por_vencer', 'vigente', 0, 1],
  ['0054', 'cli-001', 'BLACK & DECKER (Stanley Black & Decker)', 'SBD920412R34', '2026-08-18', '2026-09-02', 138620, 58620, 'vencida', '1_30', 5, 0],
  ['0055', 'cli-007', 'PANASONIC MÉXICO, S.A. DE C.V.', 'PME7402218F8', '2026-08-12', '2026-09-11', 96800, 0, 'por_vencer', 'vigente', 0, 4],
  ['0056', 'cli-008', 'CARRIER MÉXICO, S.A. DE C.V.', 'CME890512CW0', '2026-07-02', '2026-08-01', 73200, 0, 'vencida', '31_60', 37, 0],
  ['0057', 'cli-002', 'TRICO TECHNOLOGIES CORPORATION', 'TTC880315PL1', '2026-08-26', '2026-09-25', 146740, 46740, 'por_vencer', 'vigente', 0, 18],
  ['0058', 'cli-009', 'INVACARE MÉXICO, S.A. DE C.V.', 'IME940508SK4', '2026-05-14', '2026-06-13', 48950, 0, 'vencida', '61_90', 86, 0],
  ['0059', 'cli-010', 'SPECTRUM BRANDS MÉXICO', 'SBM0702157V6', '2026-04-01', '2026-05-01', 33720, 0, 'vencida', 'mas_90', 129, 0],
  ['0060', 'cli-003', 'BISSELL INTERNATIONAL TRADING COMPANY B.V.', 'BIT041120TK8', '2026-08-31', '2026-09-15', 62400, 62400, 'pagada', 'vigente', 0, 0],
  ['0061', 'cli-011', 'WHIRLPOOL MÉXICO, S. DE R.L.', 'WME940527H22', '2026-09-03', '2026-10-03', 184300, 0, 'al_corriente', 'vigente', 0, 26],
  ['0062', 'cli-004', 'TYCO (Johnson Controls)', 'TYC990708M12', '2026-08-05', '2026-09-04', 101500, 21500, 'vencida', '1_30', 3, 0],
  ['0063', 'cli-012', 'MABE MÉXICO, S. DE R.L. DE C.V.', 'MME8204174H3', '2026-07-25', '2026-08-24', 87560, 0, 'vencida', '1_30', 14, 0],
] as const;

INITIAL_CXC_RECORDS.push(...cxcSeed.map(([folio, clientId, client, rfc, issued, due, total, paid, status, bucket, late, toDue], index): AccountReceivable => ({
  id: `cxc-${folio}`,
  facturaId: `fac-${folio}`,
  facturaFolio: `FAC-RTM-2026-${folio}`,
  uuidSat: `DEMO-${folio}-CXC-4F18-8A${index}2`,
  clienteId: clientId,
  clienteNombre: client,
  clienteRfc: rfc,
  fechaEmision: issued,
  fechaVencimiento: due,
  diasCredito: 30,
  diasMora: late,
  diasParaVencer: toDue,
  montoOriginal: total,
  saldoPendiente: total - paid,
  totalPagado: paid,
  status,
  bucket,
  metodoPago: status === 'pagada' ? 'PUE' : 'PPD',
  historialPagos: paid ? [{
    id: `pago-cxc-${folio}`,
    fecha: status === 'pagada' ? '2026-09-04' : '2026-09-02',
    monto: paid,
    formaPago: 'Transferencia SPEI (03)',
    referencia: `SPEI-RTM-${folio}`,
    bancoDestino: 'BBVA Cta 8821',
    comprobanteFolio: `REP-RTM-2026-${folio}`,
    registradoPor: 'L. Mendoza (Crédito y Cobranza)',
    notas: status === 'pagada' ? 'Liquidación aplicada y conciliada.' : 'Abono parcial aplicado contra factura.'
  }] : [],
  contactoCobranza: { nombre: `Contacto de crédito ${client.split(' ')[0]} (Demo)`, email: `credito.${index + 1}@cliente-demo.com`, telefono: `(81) 5555-${String(1100 + index)}` }
})));

const cxpSeed = [
  ['004', 'PAPELERA DEL NORTE, S.A. DE C.V.', 'PNO850917DX8', '2026-08-28', '2026-09-12', 86500, 0, 'programada', 'conciliada'],
  ['005', 'SIEGWERK MÉXICO, S.A. DE C.V.', 'SME900212M72', '2026-08-18', '2026-09-02', 43200, 0, 'pendiente', 'conciliada'],
  ['006', 'GRAINGER MÉXICO, S.A. DE C.V.', 'GME890104LQ3', '2026-07-10', '2026-08-09', 27840, 0, 'pendiente', 'conciliada'],
  ['007', 'HEIDELBERG MÉXICO, S.A. DE C.V.', 'HME821206RU9', '2026-08-30', '2026-09-14', 116000, 36000, 'parcial', 'conciliada'],
  ['008', 'QUÍMICOS Y ADHESIVOS DEL GOLFO', 'QAG950811DY1', '2026-08-21', '2026-09-05', 68120, 0, 'bloqueada', 'discrepancia_precio'],
  ['009', 'CEMEX ENERGÍA, S.A. DE C.V.', 'CEN010418PH3', '2026-08-26', '2026-09-10', 39400, 0, 'programada', 'conciliada'],
  ['010', 'MONTACARGAS DEL NORTE, S.A.', 'MNO9602235M5', '2026-07-19', '2026-08-18', 22400, 22400, 'pagada', 'conciliada'],
  ['011', 'FEDEX EXPRESS MÉXICO', 'FEM020926SS7', '2026-09-01', '2026-09-16', 18750, 0, 'pendiente', 'pendiente_recepcion'],
  ['012', 'SERVICIOS TÉCNICOS DE PLANTA', 'STP100414LW8', '2026-08-15', '2026-09-09', 52200, 0, 'pendiente', 'conciliada'],
  ['013', 'MERCERÍA Y EMPAQUES INDUSTRIALES', 'MEI080507NF4', '2026-08-08', '2026-09-07', 74500, 24500, 'parcial', 'conciliada'],
] as const;

INITIAL_CXP_RECORDS.push(...cxpSeed.map(([id, supplier, rfc, issued, due, total, paid, paymentStatus, matchStatus], index): SupplierInvoice => {
  const unmatched = matchStatus !== 'conciliada';
  const itemPrice = Math.round((total / 1.16) / 10);
  return {
    id: `cxp-${id}`,
    folioProveedor: `FP-${772400 + index * 317}`,
    uuidSat: `DEMO-CXP-${id}-0A17-4E${index}9`,
    proveedorId: `prov-${String(index + 4).padStart(2, '0')}`,
    proveedorNombre: supplier,
    proveedorRfc: rfc,
    ordenCompraFolio: `OC-RTM-2026-00${94 + index}`,
    recepcionFolio: `REC-RTM-2026-00${67 + index}`,
    fechaEmision: issued,
    fechaRecepcion: matchStatus === 'pendiente_recepcion' ? 'Pendiente' : issued,
    fechaVencimiento: due,
    diasCredito: 30,
    moneda: 'MXN',
    subtotal: Math.round(total / 1.16),
    iva: total - Math.round(total / 1.16),
    total,
    saldoPendiente: total - paid,
    totalPagado: paid,
    matchStatus,
    toleranciaExcedida: unmatched,
    motivoDiscrepancia: matchStatus === 'discrepancia_precio' ? 'Precio facturado excede el precio autorizado en la orden de compra.' : matchStatus === 'pendiente_recepcion' ? 'La recepción física del material está pendiente en almacén.' : undefined,
    estadoPago: paymentStatus,
    fechaProgramadaPago: paymentStatus === 'programada' ? due : undefined,
    matchItems: [{ id: `match-${id}-1`, sku: `MAT-${id}`, descripcion: `Material o servicio operativo ${supplier}`, cantOrdenada: 10, precioOrdenado: itemPrice, cantRecibida: matchStatus === 'pendiente_recepcion' ? 0 : 10, recepcionFolio: `REC-RTM-2026-00${67 + index}`, cantFacturada: 10, precioFacturado: unmatched && matchStatus === 'discrepancia_precio' ? itemPrice + 250 : itemPrice, unidad: 'SERV', variacionCantidad: 0, variacionPrecio: unmatched && matchStatus === 'discrepancia_precio' ? 250 : 0, estado: unmatched ? 'diferencia_precio' : 'ok' }],
    historialPagos: paid ? [{ id: `pago-cxp-${id}`, fecha: paymentStatus === 'pagada' ? '2026-08-18' : '2026-09-03', monto: paid, cuentaOrigen: 'BBVA MXN Cta Cheques 8821', metodoPago: 'SPEI', referenciaBancaria: `SPEI-PROV-${id}`, autorizadoPor: 'Lic. Gerardo Morales (Dir. Finanzas)', notas: paymentStatus === 'pagada' ? 'Liquidación conciliada.' : 'Anticipo aplicado contra factura.' }] : []
  };
}));

// Historial adicional para estados de cuenta por proveedor: cada cuenta principal
// muestra varios cargos, pagos parciales y documentos del periodo.
const cxpStatementSeed = [
  ['014', 'prov-01', 'Bio-Pappel S.A.B. de C.V.', 'BPA820101XYZ', '2026-07-28', '2026-08-27', 168200, 168200, 'pagada', 'conciliada'],
  ['015', 'prov-01', 'Bio-Pappel S.A.B. de C.V.', 'BPA820101XYZ', '2026-08-31', '2026-09-30', 142600, 0, 'pendiente', 'conciliada'],
  ['016', 'prov-02', 'Sun Chemical México S.A. de C.V.', 'SCM700815AA2', '2026-07-21', '2026-08-20', 78400, 38400, 'parcial', 'conciliada'],
  ['017', 'prov-02', 'Sun Chemical México S.A. de C.V.', 'SCM700815AA2', '2026-09-02', '2026-10-02', 66400, 0, 'programada', 'conciliada'],
  ['018', 'prov-03', 'Avery Dennison Materials México S. de R.L. de C.V.', 'ADM981010TX1', '2026-07-30', '2026-08-29', 92500, 0, 'pendiente', 'conciliada'],
  ['019', 'prov-03', 'Avery Dennison Materials México S. de R.L. de C.V.', 'ADM981010TX1', '2026-08-27', '2026-09-26', 118900, 68900, 'parcial', 'conciliada'],
  ['020', 'prov-07', 'HEIDELBERG MÉXICO, S.A. DE C.V.', 'HME821206RU9', '2026-08-06', '2026-09-05', 45900, 0, 'bloqueada', 'discrepancia_precio'],
  ['021', 'prov-04', 'PAPELERA DEL NORTE, S.A. DE C.V.', 'PNO850917DX8', '2026-08-10', '2026-09-09', 97300, 0, 'programada', 'conciliada'],
] as const;

INITIAL_CXP_RECORDS.push(...cxpStatementSeed.map(([id, supplierId, supplier, rfc, issued, due, total, paid, paymentStatus, matchStatus], index): SupplierInvoice => {
  const subtotal = Math.round(total / 1.16);
  const hasDifference = matchStatus === 'discrepancia_precio';
  return {
    id: `cxp-${id}`,
    folioProveedor: `FP-${778120 + index * 193}`,
    uuidSat: `DEMO-EDOCTA-${id}-4B81-90F${index}`,
    proveedorId: supplierId,
    proveedorNombre: supplier,
    proveedorRfc: rfc,
    ordenCompraFolio: `OC-RTM-2026-1${14 + index}`,
    recepcionFolio: `REC-RTM-2026-1${14 + index}`,
    fechaEmision: issued,
    fechaRecepcion: issued,
    fechaVencimiento: due,
    diasCredito: 30,
    moneda: 'MXN',
    subtotal,
    iva: total - subtotal,
    total,
    saldoPendiente: total - paid,
    totalPagado: paid,
    matchStatus,
    toleranciaExcedida: hasDifference,
    motivoDiscrepancia: hasDifference ? 'Servicio técnico facturado por encima del precio autorizado en la orden de compra.' : undefined,
    estadoPago: paymentStatus,
    fechaProgramadaPago: paymentStatus === 'programada' ? due : undefined,
    matchItems: [{ id: `match-${id}`, sku: `MAT-EDO-${id}`, descripcion: `Suministro industrial ${supplier}`, cantOrdenada: 10, precioOrdenado: Math.round(subtotal / 10), cantRecibida: 10, recepcionFolio: `REC-RTM-2026-1${14 + index}`, cantFacturada: 10, precioFacturado: Math.round(subtotal / 10) + (hasDifference ? 180 : 0), unidad: 'SERV', variacionCantidad: 0, variacionPrecio: hasDifference ? 180 : 0, estado: hasDifference ? 'diferencia_precio' : 'ok' }],
    historialPagos: paid ? [{ id: `pago-cxp-edo-${id}`, fecha: '2026-09-04', monto: paid, cuentaOrigen: 'BBVA MXN Cta Cheques 8821', metodoPago: 'SPEI', referenciaBancaria: `SPEI-EDOCTA-${id}`, autorizadoPor: 'Lic. Gerardo Morales (Dir. Finanzas)', notas: paymentStatus === 'pagada' ? 'Liquidación total conciliada.' : 'Pago parcial aplicado; saldo vigente en estado de cuenta.' }] : [],
  };
}));

export const INITIAL_ELIGIBLE_REMISIONES: EligibleRemision[] = [
  {
    id: 'rem-elig-01',
    folio: 'REM-2026-0063',
    pedidoFolio: 'PED-RTM-2026-0142',
    clienteId: 'cli-001',
    clienteNombre: 'BLACK & DECKER (Stanley Black & Decker)',
    clienteRfc: 'SBD920412R34',
    fechaEntrega: '2026-09-04',
    entregadoPor: 'Rogelio Castillo (Chofer Unidad RTM-03)',
    recibidoPor: 'Andén 3 Recibo Milimex - Sello de recibido #0441',
    diasCredito: 45,
    formaPagoDefecto: '99',
    metodoPagoDefecto: 'PPD',
    usoCfdiDefecto: 'G01',
    items: [
      {
        id: 'item-rem-63-1',
        sku: 'NA472050',
        description: 'Manual Cordless Recip Saw DCS382 NA (Rev 08/23) 24 págs',
        quantity: 30000,
        unit: 'PZA',
        unitPrice: 2.85,
        subtotal: 85500.00,
        taxRate: 0.16,
        taxAmount: 13680.00,
        total: 99180.00,
        satKey: '55101500',
        satUnit: 'H87'
      }
    ],
    subtotal: 85500.00,
    iva: 13680.00,
    total: 99180.00
  },
  {
    id: 'rem-elig-02',
    folio: 'REM-2026-0064',
    pedidoFolio: 'PED-RTM-2026-0138',
    clienteId: 'cli-003',
    clienteNombre: 'BISSELL INTERNATIONAL TRADING COMPANY B.V.',
    clienteRfc: 'BIT041120TK8',
    fechaEntrega: '2026-09-06',
    entregadoPor: 'Transportes Logísticos del Centro',
    recibidoPor: 'Almacén Central Nexxus - Andén 4',
    diasCredito: 30,
    formaPagoDefecto: '03',
    metodoPagoDefecto: 'PUE',
    usoCfdiDefecto: 'G03',
    items: [
      {
        id: 'item-rem-64-1',
        sku: '1641301',
        description: 'User Guide POWERFORCE HELIX (Rev .02/24) 16 págs',
        quantity: 20000,
        unit: 'PZA',
        unitPrice: 1.95,
        subtotal: 39000.00,
        taxRate: 0.16,
        taxAmount: 6240.00,
        total: 45240.00,
        satKey: '55101500',
        satUnit: 'H87'
      }
    ],
    subtotal: 39000.00,
    iva: 6240.00,
    total: 45240.00
  }
];
