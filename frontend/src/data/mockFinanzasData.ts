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
    clienteId: 'cli-001',
    clienteNombre: 'Laboratorios Medifarma S.A. de C.V.',
    clienteRfc: 'LME820415HQ1',
    clienteRegimen: '601 - General de Ley Personas Morales',
    clienteCp: '03100',
    remisionId: 'REM-2026-0062',
    remisionFolio: 'REM-2026-0062',
    pedidoFolio: 'PED-RTM-2026-0032',
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
        sku: 'CAJA-MED-01',
        description: 'Caja Plegadiza Sulfatada 14 pts Farmacéutica 12x8x4 cm con barniz UV',
        quantity: 50000,
        unit: 'PZA',
        unitPrice: 2.10,
        subtotal: 105000.00,
        taxRate: 0.16,
        taxAmount: 16800.00,
        total: 121800.00,
        satKey: '14111500',
        satUnit: 'H87'
      },
      {
        id: 'item-0048-2',
        sku: 'ETIQ-ROL-03',
        description: 'Etiqueta en Rollo Transferencia Térmica Grado Pharma 4x6" Core 3"',
        quantity: 100,
        unit: 'MILLAR',
        unitPrice: 435.00,
        subtotal: 43500.00,
        taxRate: 0.16,
        taxAmount: 6960.00,
        total: 50460.00,
        satKey: '55121600',
        satUnit: 'MIL'
      }
    ],
    notas: 'Entrega en planta Tlalnepantla según orden de compra cliente MP-2026-904'
  },
  {
    id: 'fac-0049',
    folio: 'FAC-RTM-2026-0049',
    uuidSat: '8C7B9011-3E55-40F1-AA32-901844BCC023',
    fechaEmision: '2026-08-10T14:15:00',
    fechaTimbrado: '2026-08-10T14:17:02',
    clienteId: 'cli-002',
    clienteNombre: 'Stanley Black & Decker México S.A.',
    clienteRfc: 'SBD940912TC4',
    clienteRegimen: '601 - General de Ley Personas Morales',
    clienteCp: '54030',
    remisionId: 'REM-2026-0059',
    remisionFolio: 'REM-2026-0059',
    pedidoFolio: 'PED-RTM-2026-0028',
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
        sku: 'CAJA-IND-02',
        description: 'Caja Regular Ranurada Flauta C Kraft 40x30x30 cm ECT 32',
        quantity: 10000,
        unit: 'PZA',
        unitPrice: 8.20,
        subtotal: 82000.00,
        taxRate: 0.16,
        taxAmount: 13120.00,
        total: 95120.00,
        satKey: '14111500',
        satUnit: 'H87'
      }
    ],
    notas: 'Pago recibido el 11/08/2026 vía SPEI BBVA.'
  },
  {
    id: 'fac-0050',
    folio: 'FAC-RTM-2026-0050',
    fechaEmision: '2026-09-02T11:00:00',
    clienteId: 'cli-003',
    clienteNombre: 'Alimentos del Norte Industrial S.A. de C.V.',
    clienteRfc: 'ANI050622LK8',
    clienteRegimen: '601 - General de Ley Personas Morales',
    clienteCp: '64000',
    remisionId: 'REM-2026-0061',
    remisionFolio: 'REM-2026-0061',
    pedidoFolio: 'PED-RTM-2026-0035',
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
        sku: 'LINER-ALIM-01',
        description: 'Lámina Corrugada Grado Alimenticio Kraft Liner 200/Flauta B 120x80 cm',
        quantity: 8000,
        unit: 'PZA',
        unitPrice: 14.50,
        subtotal: 116000.00,
        taxRate: 0.16,
        taxAmount: 18560.00,
        total: 134560.00,
        satKey: '14111500',
        satUnit: 'H87'
      }
    ],
    notas: 'Validado con remisión REM-2026-0061 sellada por almacén de recibo.'
  },
  {
    id: 'fac-0051',
    folio: 'FAC-RTM-2026-0051',
    fechaEmision: '2026-09-05T09:20:00',
    clienteId: 'cli-004',
    clienteNombre: 'Distribuidora Gráfica de Occidente S.A.',
    clienteRfc: 'DGO110303TR9',
    clienteRegimen: '601 - General de Ley Personas Morales',
    clienteCp: '44100',
    status: 'borrador',
    metodoPago: 'PUE',
    formaPago: '03',
    usoCfdi: 'G03',
    moneda: 'MXN',
    subtotal: 45000.00,
    iva: 7200.00,
    total: 52200.00,
    saldoPendiente: 52200.00,
    estadoPago: 'pendiente',
    items: [
      {
        id: 'item-0051-1',
        sku: 'SUSTR-COUCH-150',
        description: 'Papel Couché Brillante 150g Pliego 70x100 cm para Offset',
        quantity: 15000,
        unit: 'PLIEGO',
        unitPrice: 3.00,
        subtotal: 45000.00,
        taxRate: 0.16,
        taxAmount: 7200.00,
        total: 52200.00,
        satKey: '14111507',
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
    clienteId: 'cli-001',
    clienteNombre: 'Laboratorios Medifarma S.A. de C.V.',
    clienteRfc: 'LME820415HQ1',
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
        referencia: 'SPEI-MED-99381',
        bancoDestino: 'Banamex Cta 4819',
        comprobanteFolio: 'REP-RTM-2026-0012',
        registradoPor: 'L. Mendoza (Crédito y Cobranza)',
        notas: 'Anticipo del 58% acordado para liberación de embarque 2'
      }
    ],
    contactoCobranza: {
      nombre: 'Lic. Claudia Morales',
      email: 'cmorales@medifarma.com.mx',
      telefono: '55-5390-1122 ext 402'
    }
  },
  {
    id: 'cxc-0045',
    facturaId: 'fac-0045',
    facturaFolio: 'FAC-RTM-2026-0045',
    uuidSat: '1E33A899-77D0-4211-BF90-C109419DF011',
    clienteId: 'cli-003',
    clienteNombre: 'Alimentos del Norte Industrial S.A. de C.V.',
    clienteRfc: 'ANI050622LK8',
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
      nombre: 'Ing. Roberto Garza',
      email: 'rgarza@alimentosdelnorte.mx',
      telefono: '81-8311-9000 ext 155'
    }
  },
  {
    id: 'cxc-0041',
    facturaId: 'fac-0041',
    facturaFolio: 'FAC-RTM-2026-0041',
    uuidSat: 'D2A10091-FF34-46E1-B001-A488091E47C2',
    clienteId: 'cli-004',
    clienteNombre: 'Distribuidora Gráfica de Occidente S.A.',
    clienteRfc: 'DGO110303TR9',
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
      nombre: 'C.P. Mario Sandoval',
      email: 'msandoval@dgoccidente.com',
      telefono: '33-3615-8800'
    }
  },
  {
    id: 'cxc-0049',
    facturaId: 'fac-0049',
    facturaFolio: 'FAC-RTM-2026-0049',
    uuidSat: '8C7B9011-3E55-40F1-AA32-901844BCC023',
    clienteId: 'cli-002',
    clienteNombre: 'Stanley Black & Decker México S.A.',
    clienteRfc: 'SBD940912TC4',
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
      nombre: 'C.P. Fernando Valdés',
      email: 'fvaldes@sbdinc.com',
      telefono: '55-5804-5000'
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

export const INITIAL_ELIGIBLE_REMISIONES: EligibleRemision[] = [
  {
    id: 'rem-elig-01',
    folio: 'REM-2026-0063',
    pedidoFolio: 'PED-RTM-2026-0038',
    clienteId: 'cli-001',
    clienteNombre: 'Laboratorios Medifarma S.A. de C.V.',
    clienteRfc: 'LME820415HQ1',
    fechaEntrega: '2026-09-04',
    entregadoPor: 'Rogelio Castillo (Chofer Unidad RTM-03)',
    recibidoPor: 'Almacén MP Medifarma - Sello de recibido #0441',
    diasCredito: 30,
    formaPagoDefecto: '99',
    metodoPagoDefecto: 'PPD',
    usoCfdiDefecto: 'G01',
    items: [
      {
        id: 'item-rem-63-1',
        sku: 'CAJA-MED-02',
        description: 'Caja Plegadiza Jarabe Pediátrico 60ml Sulfatada 16 pts con estampado foil dorado',
        quantity: 30000,
        unit: 'PZA',
        unitPrice: 2.85,
        subtotal: 85500.00,
        taxRate: 0.16,
        taxAmount: 13680.00,
        total: 99180.00,
        satKey: '14111500',
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
    pedidoFolio: 'PED-RTM-2026-0040',
    clienteId: 'cli-002',
    clienteNombre: 'Stanley Black & Decker México S.A.',
    clienteRfc: 'SBD940912TC4',
    fechaEntrega: '2026-09-06',
    entregadoPor: 'Transportes Logísticos del Centro',
    recibidoPor: 'Patio de Maniobras SBD - Andén 4',
    diasCredito: 15,
    formaPagoDefecto: '03',
    metodoPagoDefecto: 'PUE',
    usoCfdiDefecto: 'G03',
    items: [
      {
        id: 'item-rem-64-1',
        sku: 'TARIMA-CORR-01',
        description: 'Separador de Tarima Doble Corrugado Flauta BC Heavy Duty 120x100 cm',
        quantity: 2500,
        unit: 'PZA',
        unitPrice: 24.00,
        subtotal: 60000.00,
        taxRate: 0.16,
        taxAmount: 9600.00,
        total: 69600.00,
        satKey: '14111500',
        satUnit: 'H87'
      }
    ],
    subtotal: 60000.00,
    iva: 9600.00,
    total: 69600.00
  }
];
