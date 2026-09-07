// ====================================================
// MODELOS Y DATOS MOCK: TRAZABILIDAD 360 ENTERPRISE
// Reconstrucción completa de la genealogía de producto:
// Cliente → Pedido → OP → Materiales → Procesos → QA → Bache PT → Embarque → Factura → Queja/RMA
// ====================================================

export type TraceabilityHealthStatus = 'Conforme' | 'Atención' | 'Crítico';

export interface TraceabilityChainNode {
  id: string;
  label: string;
  folio: string;
  status: 'ok' | 'warning' | 'danger' | 'info' | 'neutral';
  statusLabel: string;
  timestamp: string;
  detail: string;
  subdetail?: string;
  targetTab:
    | 'Resumen'
    | 'Materiales'
    | 'Proceso'
    | 'Calidad'
    | 'Embarque'
    | 'Documentos'
    | 'Incidencias'
    | 'Historial';
}

export interface TraceabilityMaterialItem {
  id: string;
  sku: string;
  name: string;
  type: string;
  lotNumber: string;
  supplier: string;
  supplierId?: string;
  poFolio?: string;
  required: string;
  consumed: string;
  remnant?: string;
  incomingQaStatus: 'Conforme ✓' | 'Conforme c/desviación' | 'Rechazado';
  incomingDate: string;
  coaFolio?: string;
  notes?: string;
}

export interface TraceabilityRoutingStep {
  stepNumber: number;
  process: string;
  machine: string;
  operator: string;
  setupMinutesStandard: number;
  setupMinutesReal: number;
  runMinutesStandard: number;
  runMinutesReal: number;
  inputQty: number;
  goodQty: number;
  scrapQty: number;
  scrapUom: string;
  scrapCause?: string;
  firstPieceStatus?: 'Aprobada ✓' | 'Pendiente' | 'No aplica';
  startTime: string;
  endTime: string;
  status: 'Completada' | 'En proceso' | 'Detenida';
  deviationNote?: string;
  subOperations?: string[];
}

export interface TraceabilityQualityGate {
  id: string;
  gate: string;
  dictamen: 'Aprobado' | 'Rechazado' | 'En HOLD' | 'Conforme';
  auditor: string;
  timestamp: string;
  measurements: Array<{
    parameter: string;
    standard: string;
    actual: string;
    status: 'ok' | 'alert';
  }>;
  notes: string;
  labelZebraFolio?: string;
  mncFolio?: string;
  icarFolio?: string;
}

export interface TraceabilityShippingInfo {
  orderFolio: string;
  remisionFolio: string;
  carrierVehicle: string;
  driver: string;
  stagingLane: string;
  departureTime: string;
  deliveryTime: string;
  deliveryStatus: 'Entregado de conformidad' | 'En ruta' | 'En andén / Preparando';
  recipientName: string;
  packagingSummary: string;
  deliveryAddress: string;
}

export interface TraceabilityDocument {
  id: string;
  title: string;
  type:
    | 'Dibujo / Especificación'
    | 'Plan de Control'
    | 'Hoja de OP'
    | 'Checklist QA'
    | 'Certificado COA'
    | 'Liberación PT'
    | 'Etiqueta Zebra'
    | 'Remisión'
    | 'Factura SAT'
    | 'Expediente RMA';
  code: string;
  revision: string;
  status: 'Vigente' | 'Aprobado' | 'Emitido' | 'Obsoleto';
  fileFormat: 'PDF' | 'XML' | 'ZPL' | 'IMG';
  date: string;
  author: string;
}

export interface TraceabilityIncident {
  id: string;
  type: 'Paro técnico' | 'Scrap' | 'MNC / HOLD' | 'Desviación 4M' | 'Queja cliente';
  severity: 'Baja' | 'Media' | 'Crítica';
  title: string;
  impact: string;
  timestamp: string;
  resolution: string;
  responsible: string;
}

export interface TraceabilityTimelineEntry {
  id: string;
  time: string;
  category: 'Comercial' | 'Planeación' | 'Almacén MP' | 'Piso' | 'Calidad' | 'Almacén PT' | 'Embarques';
  title: string;
  description: string;
  user: string;
  badgeTone: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
}

export interface TraceabilitySystemSuggestion {
  id: string;
  type: 'warning' | 'info' | 'success';
  title: string;
  explanation: string;
  actionLabel: string;
  targetTab?: TraceabilityChainNode['targetTab'];
  actionTarget?: string;
}

export interface TraceabilityDossier {
  id: string;
  opFolio: string;
  opId: string;
  cliente: string;
  pedido: string;
  salesOrderDate: string;
  partNumber: string;
  partDescription: string;
  revision: string;
  area: 'Flexografía' | 'Offset' | 'Acabados';
  status: 'Liberada' | 'En proceso' | 'Detenida (HOLD)';
  quantity: number;
  good: number;
  scrap: number;
  scrapPercent: number;
  finishedBatch: string;
  ptWarehouse: string;
  ptLocation: string;
  shippingFolio: string;
  remisionFolio: string;
  invoiceFolio: string;
  invoiceDate: string;
  invoiceTotal: number;
  complaintId?: string;
  complaintSeverity?: 'Crítica' | 'Mayor' | 'Menor';
  complaintSummary?: string;
  machine: string;
  operator: string;
  due: string;
  health: {
    documentationValid: boolean;
    lotsIdentified: boolean;
    routeComplete: boolean;
    qaGatesComplete: boolean;
    shippingIdentified: boolean;
    notes?: string;
  };
  chainNodes: TraceabilityChainNode[];
  materials: TraceabilityMaterialItem[];
  routing: TraceabilityRoutingStep[];
  qualityGates: TraceabilityQualityGate[];
  shipping: TraceabilityShippingInfo;
  documents: TraceabilityDocument[];
  incidents: TraceabilityIncident[];
  timeline: TraceabilityTimelineEntry[];
  systemSuggestions: TraceabilitySystemSuggestion[];
}

// ----------------------------------------------------------------------
// 3 EXPEDIENTES DEMO COMPLETOS (SECCIÓN 11)
// ----------------------------------------------------------------------

export const INITIAL_TRACEABILITY_DOSSIERS: TraceabilityDossier[] = [
  // ====================================================================
  // 1. PANASONIC · 526412 | G | (Flexografía, bache BCH-44951, RMA-2026-014)
  // ====================================================================
  {
    id: 'dos-panasonic-95250',
    opFolio: 'OP-2026-95250',
    opId: 'op-11',
    cliente: 'Panasonic Industrial',
    pedido: 'PED-RTM-2026-86153',
    salesOrderDate: '26 Ago 2026',
    partNumber: '526412 | G |',
    partDescription: 'Etiqueta Identificación Automotriz 4x2 DataMatrix',
    revision: 'Rev G',
    area: 'Flexografía',
    status: 'Liberada',
    quantity: 15000,
    good: 14780,
    scrap: 220,
    scrapPercent: 1.46,
    finishedBatch: 'BCH-44951',
    ptWarehouse: 'Almacén Producto Terminado (Nave 1)',
    ptLocation: 'PT-A-03',
    shippingFolio: 'OS-260907-0042',
    remisionFolio: 'REM-260907-0042',
    invoiceFolio: 'FAC-2026-7891',
    invoiceDate: '28 Ago 2026',
    invoiceTotal: 18500,
    complaintId: 'RMA-2026-014',
    complaintSeverity: 'Crítica',
    complaintSummary:
      'Código de barras DataMatrix con baja reflectancia y lectura intermitente en escáner Cognex de línea de ensamble Panasonic.',
    machine: 'Prensa Mark Andy Scout',
    operator: 'María Ríos',
    due: '28 Ago 2026',
    health: {
      documentationValid: true,
      lotsIdentified: true,
      routeComplete: true,
      qaGatesComplete: true,
      shippingIdentified: true,
      notes: 'Cadena de custodia 100% auditable. Investigación activa ligada a RMA-2026-014.',
    },
    chainNodes: [
      {
        id: 'node-client',
        label: 'Cliente',
        folio: 'PANASONIC',
        status: 'ok',
        statusLabel: 'Cuenta Activa B2B',
        timestamp: '26 Ago',
        detail: 'Panasonic Industrial México · Planta Reynosa',
        subdetail: 'Contacto: Ing. Roberto Cantú',
        targetTab: 'Resumen',
      },
      {
        id: 'node-order',
        label: 'Pedido',
        folio: 'PED-RTM-2026-86153',
        status: 'ok',
        statusLabel: 'Autorizado',
        timestamp: '26 Ago · 10:15',
        detail: '15,000 pzas · $18,500 MXN',
        subdetail: 'Entrega comprometida: 28 Ago',
        targetTab: 'Resumen',
      },
      {
        id: 'node-op',
        label: 'Orden Producción',
        folio: 'OP-2026-95250',
        status: 'ok',
        statusLabel: 'Terminada 100%',
        timestamp: '27 Ago · 08:30',
        detail: 'Prensa Mark Andy Scout · Flexo',
        subdetail: '14,780 buenas · 220 scrap',
        targetTab: 'Proceso',
      },
      {
        id: 'node-materials',
        label: 'Materiales',
        folio: '3 Lotes Identificados',
        status: 'warning',
        statusLabel: 'Alerta en Tinta UV',
        timestamp: '27 Ago · 07:45',
        detail: 'BOPP LOT-PPBC-260721 · Tinta LOT-INK-260904',
        subdetail: 'Viscosidad límite detectada',
        targetTab: 'Materiales',
      },
      {
        id: 'node-process',
        label: 'Procesos',
        folio: '2 Etapas Concluidas',
        status: 'ok',
        statusLabel: 'Ruta Conforme',
        timestamp: '27 Ago · 12:40',
        detail: 'Flexo 4 Tintas + Rotoflex Rebobinado',
        subdetail: 'Operador: María Ríos (Turno A)',
        targetTab: 'Proceso',
      },
      {
        id: 'node-qa',
        label: 'Calidad',
        folio: 'QA-260907-084',
        status: 'ok',
        statusLabel: 'Liberación AQL 0.65',
        timestamp: '27 Ago · 14:15',
        detail: 'Inspección final conforme en planta',
        subdetail: 'Auditor: Alicia Ramírez',
        targetTab: 'Calidad',
      },
      {
        id: 'node-pt',
        label: 'Bache PT',
        folio: 'BCH-44951',
        status: 'ok',
        statusLabel: 'PT-A-03 Rack 1',
        timestamp: '27 Ago · 15:30',
        detail: '15 rollos de 1,000 pzas tarimados',
        subdetail: 'Etiqueta Zebra FM-QA-153 emitida',
        targetTab: 'Embarque',
      },
      {
        id: 'node-shipping',
        label: 'Embarque',
        folio: 'OS-260907-0042',
        status: 'ok',
        statusLabel: 'Entregado',
        timestamp: '28 Ago · 09:40',
        detail: 'Remisión REM-260907-0042 · Camión #08',
        subdetail: 'Chofer: Roberto Garza',
        targetTab: 'Embarque',
      },
      {
        id: 'node-invoice',
        label: 'Factura SAT',
        folio: 'FAC-2026-7891',
        status: 'ok',
        statusLabel: 'Timbrada CFDI 4.0',
        timestamp: '28 Ago · 11:20',
        detail: 'Total $21,460 MXN (c/IVA)',
        subdetail: 'Método PPD · 30 días crédito',
        targetTab: 'Documentos',
      },
      {
        id: 'node-rma',
        label: 'Queja / RMA',
        folio: 'RMA-2026-014',
        status: 'danger',
        statusLabel: 'Investigación Activa',
        timestamp: '03 Sep · 16:30',
        detail: 'Baja lectura DataMatrix en línea cliente',
        subdetail: 'MNC-000349 / ICAR-2026-020',
        targetTab: 'Incidencias',
      },
    ],
    materials: [
      {
        id: 'mat-p-1',
        sku: 'SUST-BOPP-WHT-4',
        name: 'Sustrato BOPP Blanco Brillante 4”',
        type: 'Sustrato / Bobina',
        lotNumber: 'LOT-PPBC-260721',
        supplier: 'Avery Dennison México',
        supplierId: 'prov-01',
        poFolio: 'OC-2026-0089',
        required: '1,240 m',
        consumed: '1,198 m',
        remnant: '42 m (devuelto a rack de remanentes REM-075-014)',
        incomingQaStatus: 'Conforme ✓',
        incomingDate: '15 Ago 2026',
        coaFolio: 'COA-AVD-8842',
        notes: 'Espesor 2.4 mil conforme, corona 42 dinas/cm verificado.',
      },
      {
        id: 'mat-p-2',
        sku: 'INK-UV-BLK-FLX',
        name: 'Tinta UV Negra Alta Densidad Flexo',
        type: 'Tinta UV',
        lotNumber: 'LOT-INK-260904',
        supplier: 'Flint Group México',
        supplierId: 'prov-03',
        poFolio: 'OC-2026-0094',
        required: '3.5 kg',
        consumed: '3.2 kg',
        incomingQaStatus: 'Conforme c/desviación',
        incomingDate: '20 Ago 2026',
        coaFolio: 'COA-FLINT-9912',
        notes:
          'Viscosidad reportada 26s Copa Zahn #3 (límite superior 25s). Se autorizó uso con solvente reactivo.',
      },
      {
        id: 'mat-p-3',
        sku: 'VAR-UV-GLOSS',
        name: 'Barniz Sobreimpresión UV Alto Brillo',
        type: 'Barniz',
        lotNumber: 'LOT-VAR-260902',
        supplier: 'Siegwerk México',
        supplierId: 'prov-04',
        poFolio: 'OC-2026-0098',
        required: '2.4 kg',
        consumed: '2.1 kg',
        incomingQaStatus: 'Conforme ✓',
        incomingDate: '22 Ago 2026',
        coaFolio: 'COA-SIEG-4401',
        notes: 'Curado UV verificado con lámpara LED 395nm.',
      },
    ],
    routing: [
      {
        stepNumber: 1,
        process: 'Prensa Flexo (Impresión + Barniz + Troquel)',
        machine: 'Mark Andy Scout 10”',
        operator: 'María Ríos',
        setupMinutesStandard: 35,
        setupMinutesReal: 42,
        runMinutesStandard: 180,
        runMinutesReal: 195,
        inputQty: 15500,
        goodQty: 14850,
        scrapQty: 180,
        scrapUom: 'm',
        scrapCause: 'Ajuste de registro fino al arranque y calibración de rasqueta',
        firstPieceStatus: 'Aprobada ✓',
        startTime: '27 Ago · 08:30',
        endTime: '27 Ago · 12:27',
        status: 'Completada',
        subOperations: [
          'Montaje clichés flexo polímero 1.14mm',
          'Tiraje 1 tinta UV negra con anilox 600 lpi',
          'Barnizado sobreimpresión UV',
          'Troquelado rotativo con suaje magnético 64D',
        ],
      },
      {
        stepNumber: 2,
        process: 'Rebobinado e Inspección Rotoflex',
        machine: 'Rotoflex I',
        operator: 'Carlos Vega',
        setupMinutesStandard: 15,
        setupMinutesReal: 14,
        runMinutesStandard: 50,
        runMinutesReal: 48,
        inputQty: 14850,
        goodQty: 14780,
        scrapQty: 40,
        scrapUom: 'piezas',
        scrapCause: 'Empalme de bobina y recorte de colas de inicio',
        firstPieceStatus: 'No aplica',
        startTime: '27 Ago · 12:45',
        endTime: '27 Ago · 13:47',
        status: 'Completada',
        subOperations: [
          'Inspección estroboscópica 100%',
          'Conteo digital automático a 1,000 pzas por rollo',
          'Colocación de marbete de fin de rollo',
        ],
      },
      {
        stepNumber: 3,
        process: 'Empaque y Tarimado Final',
        machine: 'Estación Empaque PT',
        operator: 'Sergio Ramos',
        setupMinutesStandard: 10,
        setupMinutesReal: 8,
        runMinutesStandard: 30,
        runMinutesReal: 25,
        inputQty: 14780,
        goodQty: 14780,
        scrapQty: 0,
        scrapUom: 'piezas',
        startTime: '27 Ago · 14:30',
        endTime: '27 Ago · 15:03',
        status: 'Completada',
        subOperations: [
          'Acondicionamiento en 15 cajas corrugadas',
          'Estibado sobre tarima plástica industrial',
          'Etiquetado con código de barras Zebra FM-QA-153',
        ],
      },
    ],
    qualityGates: [
      {
        id: 'gate-pan-1',
        gate: 'Preimpresión y Montaje',
        dictamen: 'Aprobado',
        auditor: 'J. Méndez (Preprensa)',
        timestamp: '27 Ago · 08:15',
        measurements: [
          { parameter: 'Resolución de Cliché CTP', standard: '4000 DPI / 175 LPI', actual: '4000 DPI', status: 'ok' },
          { parameter: 'Ángulo de trama Negro', standard: '45.0°', actual: '45.0°', status: 'ok' },
        ],
        notes: 'Cliché nuevo verificado bajo microscopio. Sin celdas dañadas.',
      },
      {
        id: 'gate-pan-2',
        gate: 'Primera Pieza en Prensa',
        dictamen: 'Aprobado',
        auditor: 'Alicia Ramírez (Calidad)',
        timestamp: '27 Ago · 09:12',
        measurements: [
          { parameter: 'Ancho de etiqueta', standard: '101.6 ± 0.5 mm', actual: '101.5 mm', status: 'ok' },
          { parameter: 'Largo de etiqueta', standard: '50.8 ± 0.5 mm', actual: '50.7 mm', status: 'ok' },
          { parameter: 'Calificación DataMatrix ISO 15415', standard: 'Grado A (≥ 3.5)', actual: 'Grado A (3.8)', status: 'ok' },
          { parameter: 'Densidad óptica Negro D-Max', standard: '≥ 1.80 D', actual: '1.92 D', status: 'ok' },
        ],
        notes: 'Contraste excelente al arranque de turno. Autorizado arranque de corrida.',
        labelZebraFolio: 'LBL-1ST-95250',
      },
      {
        id: 'gate-pan-3',
        gate: 'Control en Proceso >2h',
        dictamen: 'Conforme',
        auditor: 'Alicia Ramírez (Calidad)',
        timestamp: '27 Ago · 11:15',
        measurements: [
          { parameter: 'Calificación DataMatrix en tiro', standard: 'Grado A o B', actual: 'Grado B (2.9)', status: 'alert' },
          { parameter: 'Temperatura estación UV', standard: '≤ 35°C', actual: '33.2°C', status: 'ok' },
          { parameter: 'Adherencia de tinta (Tape test)', standard: '100% retención', actual: '100%', status: 'ok' },
        ],
        notes:
          'Se observó ligero engrosamiento de celda DataMatrix (ganancia de punto por viscosidad). Se recomendó ajuste de rasqueta al operador.',
      },
      {
        id: 'gate-pan-4',
        gate: 'Auditoría Final PT AQL 0.65',
        dictamen: 'Aprobado',
        auditor: 'Alicia Ramírez (Calidad)',
        timestamp: '27 Ago · 14:15',
        measurements: [
          { parameter: 'Muestra auditada', standard: '125 etiquetas (Nivel II)', actual: '125 etiquetas', status: 'ok' },
          { parameter: 'Defectos Críticos permitidos', standard: '0', actual: '0', status: 'ok' },
          { parameter: 'Defectos Menores encontrados', standard: '≤ 2', actual: '1 (ligero brillo)', status: 'ok' },
        ],
        notes: 'Lote liberado formalmente para empaque y embarques.',
        labelZebraFolio: 'FM-QA-153-BCH44951',
      },
    ],
    shipping: {
      orderFolio: 'OS-260907-0042',
      remisionFolio: 'REM-260907-0042',
      carrierVehicle: 'Camión #08 · Isuzu NPR (TM-8492-B)',
      driver: 'Roberto Garza',
      stagingLane: 'Andén EMB-02 (Rampa PT)',
      departureTime: '28 Ago · 08:30',
      deliveryTime: '28 Ago · 09:40',
      deliveryStatus: 'Entregado de conformidad',
      recipientName: 'Mesa de Recibo Panasonic (Ing. Roberto Cantú)',
      packagingSummary: '15 cajas corrugadas tarimadas · 14,780 pzas netas',
      deliveryAddress: 'Av. Industrial del Norte #420, Parque Industrial Reynosa',
    },
    documents: [
      {
        id: 'doc-pan-1',
        title: 'Dibujo Técnico Aprobado Automotriz',
        type: 'Dibujo / Especificación',
        code: 'DWG-PAN-526412-G',
        revision: 'Rev G',
        status: 'Vigente',
        fileFormat: 'PDF',
        date: '10 Ene 2026',
        author: 'Ingeniería Panasonic',
      },
      {
        id: 'doc-pan-2',
        title: 'Plan de Control de Fabricación Flexo',
        type: 'Plan de Control',
        code: 'CP-FLX-PAN-01',
        revision: 'Rev 04',
        status: 'Aprobado',
        fileFormat: 'PDF',
        date: '15 Feb 2026',
        author: 'Alicia Ramírez (SGC RTM)',
      },
      {
        id: 'doc-pan-3',
        title: 'Hoja de Viajera de Producción (OP Física)',
        type: 'Hoja de OP',
        code: 'HOP-2026-95250',
        revision: 'Rev 0',
        status: 'Emitido',
        fileFormat: 'PDF',
        date: '27 Ago 2026',
        author: 'Planner RTM',
      },
      {
        id: 'doc-pan-4',
        title: 'Certificado de Análisis de Calidad (COA)',
        type: 'Certificado COA',
        code: 'COA-2026-0842',
        revision: 'Rev 0',
        status: 'Emitido',
        fileFormat: 'PDF',
        date: '27 Ago 2026',
        author: 'Alicia Ramírez',
      },
      {
        id: 'doc-pan-5',
        title: 'Factura SAT CFDI 4.0 Timbrada',
        type: 'Factura SAT',
        code: 'FAC-2026-7891',
        revision: 'UUID: 4B8F-912A',
        status: 'Emitido',
        fileFormat: 'XML',
        date: '28 Ago 2026',
        author: 'Finanzas RTM',
      },
      {
        id: 'doc-pan-6',
        title: 'Expediente de Queja de Cliente y RMA',
        type: 'Expediente RMA',
        code: 'RMA-2026-014',
        revision: 'Activo',
        status: 'Aprobado',
        fileFormat: 'PDF',
        date: '03 Sep 2026',
        author: 'Alicia Ramírez & Iván Estrada',
      },
    ],
    incidents: [
      {
        id: 'inc-pan-1',
        type: 'Desviación 4M',
        severity: 'Media',
        title: 'Viscosidad límite superior en Tinta UV Negra',
        impact: 'Generó ganancia de punto de 18% hacia la segunda hora de tiraje continuo.',
        timestamp: '27 Ago · 10:45',
        resolution: 'Adición de 150ml de solvente reactivo autorizada en hoja viajera.',
        responsible: 'María Ríos (Operador) / Alicia Ramírez (Calidad)',
      },
      {
        id: 'inc-pan-2',
        type: 'Queja cliente',
        severity: 'Crítica',
        title: 'Reclamo de Cliente por Lectura Intermitente Cognex',
        impact: 'Cliente reporta 8 paros en celda robótica de ensamble automotriz.',
        timestamp: '03 Sep · 16:30',
        resolution:
          'Se admitió RMA-2026-014 por 15,000 etiquetas, se emitió OP de reposición prioritaria OP-2026-95260 y se abrió ICAR-2026-020.',
        responsible: 'Alicia Ramírez (Aseguramiento de Calidad)',
      },
    ],
    timeline: [
      {
        id: 'tl-1',
        time: '26 Ago · 10:15',
        category: 'Comercial',
        title: 'Pedido de Venta Generado',
        description: 'Pedido PED-RTM-2026-86153 recibido con OC cliente PO-PAN-44912.',
        user: 'Ventas B2B',
        badgeTone: 'primary',
      },
      {
        id: 'tl-2',
        time: '26 Ago · 14:00',
        category: 'Planeación',
        title: 'OP Liberada a Programación',
        description: 'OP-2026-95250 programada en Mark Andy Scout turno matutino.',
        user: 'Planner Producción',
        badgeTone: 'primary',
      },
      {
        id: 'tl-3',
        time: '27 Ago · 07:45',
        category: 'Almacén MP',
        title: 'Material Surtido a Pie de Máquina',
        description: 'BOPP Blanco (LOT-PPBC-260721) y tinta UV entregados.',
        user: 'Almacén MP',
        badgeTone: 'success',
      },
      {
        id: 'tl-4',
        time: '27 Ago · 09:12',
        category: 'Calidad',
        title: 'Primera Pieza Liberada',
        description: 'Código de barras DataMatrix Grado A verificado. Autorizado arranque.',
        user: 'Alicia Ramírez',
        badgeTone: 'success',
      },
      {
        id: 'tl-5',
        time: '27 Ago · 11:15',
        category: 'Piso',
        title: 'Control en Proceso >2h Realizado',
        description: 'Ganancia de punto detectada. Rasqueta ajustada.',
        user: 'María Ríos',
        badgeTone: 'warning',
      },
      {
        id: 'tl-6',
        time: '27 Ago · 14:15',
        category: 'Calidad',
        title: 'Auditoría Final Concluida',
        description: '14,780 etiquetas conformes aprobadas con dictamen AQL 0.65.',
        user: 'Alicia Ramírez',
        badgeTone: 'success',
      },
      {
        id: 'tl-7',
        time: '27 Ago · 15:30',
        category: 'Almacén PT',
        title: 'Ingreso a Staging de PT',
        description: 'Lote BCH-44951 ubicado en rack PT-A-03.',
        user: 'Mesa de PT',
        badgeTone: 'success',
      },
      {
        id: 'tl-8',
        time: '28 Ago · 09:40',
        category: 'Embarques',
        title: 'Entrega en Planta de Cliente',
        description: 'Remisión REM-260907-0042 firmada por Ing. Roberto Cantú.',
        user: 'Roberto Garza (Chofer)',
        badgeTone: 'success',
      },
      {
        id: 'tl-9',
        time: '03 Sep · 16:30',
        category: 'Calidad',
        title: 'Apertura de Queja y RMA',
        description: 'Se recibe queja QJ-2026-014. Apertura formal de expediente.',
        user: 'Customer Quality',
        badgeTone: 'danger',
      },
    ],
    systemSuggestions: [
      {
        id: 'sug-pan-1',
        type: 'warning',
        title: 'Correlación 4M detectada con RMA-2026-014',
        explanation:
          'Se detectó viscosidad límite superior (26s) en lote de tinta LOT-INK-260904 durante el control >2h y ganancia de punto en el tiro. Esto coincide con el reporte de escáner Cognex del cliente.',
        actionLabel: 'Ver auditorías de color y 4M',
        targetTab: 'Calidad',
        actionTarget: 'gate-pan-3',
      },
      {
        id: 'sug-pan-2',
        type: 'info',
        title: 'Reposición programada en curso',
        explanation:
          'La OP de reemplazo OP-2026-95260 ya fue liberada con lote de tinta fresco y plan de control reforzado.',
        actionLabel: 'Ver expediente RMA',
        targetTab: 'Incidencias',
        actionTarget: 'inc-pan-2',
      },
    ],
  },

  // ====================================================================
  // 2. BLACK & DECKER · NA472050 (Offset, bache BCH-44948, HOLD MNC-000348)
  // ====================================================================
  {
    id: 'dos-bd-95249',
    opFolio: 'OP-2026-95249',
    opId: 'op-1',
    cliente: 'Black & Decker',
    pedido: 'PED-RTM-2026-0142',
    salesOrderDate: '24 Ago 2026',
    partNumber: 'NA472050',
    partDescription: 'Manual de Usuario Taladro Percutor Matrix 64 Páginas',
    revision: 'Rev 08/23',
    area: 'Offset',
    status: 'Liberada',
    quantity: 10000,
    good: 9855,
    scrap: 145,
    scrapPercent: 1.45,
    finishedBatch: 'BCH-44948',
    ptWarehouse: 'Almacén Producto Terminado (Nave 1)',
    ptLocation: 'PT-B-02',
    shippingFolio: 'OS-260907-0038',
    remisionFolio: 'REM-260907-0038',
    invoiceFolio: 'FAC-2026-7889',
    invoiceDate: '01 Sep 2026',
    invoiceTotal: 42300,
    machine: 'Heidelberg Speedmaster XL 75',
    operator: 'J. Salinas',
    due: '01 Sep 2026',
    health: {
      documentationValid: true,
      lotsIdentified: true,
      routeComplete: true,
      qaGatesComplete: true,
      shippingIdentified: true,
      notes: 'Lote retenido preventivamente en planta por MNC-000348. Clasificado y liberado al 100%.',
    },
    chainNodes: [
      {
        id: 'node-bd-client',
        label: 'Cliente',
        folio: 'BLACK & DECKER',
        status: 'ok',
        statusLabel: 'Tier 1 Corporativo',
        timestamp: '24 Ago',
        detail: 'Stanley Black & Decker Planta Reynosa',
        subdetail: 'Planner: Lic. Mónica Villarreal',
        targetTab: 'Resumen',
      },
      {
        id: 'node-bd-order',
        label: 'Pedido',
        folio: 'PED-RTM-2026-0142',
        status: 'ok',
        statusLabel: 'Autorizado',
        timestamp: '24 Ago · 11:00',
        detail: '10,000 manuales · $42,300 MXN',
        subdetail: 'Paginación Offset 64 páginas',
        targetTab: 'Resumen',
      },
      {
        id: 'node-bd-op',
        label: 'Orden Producción',
        folio: 'OP-2026-95249',
        status: 'ok',
        statusLabel: 'Terminada 100%',
        timestamp: '28 Ago · 07:00',
        detail: 'Heidelberg Speedmaster XL 75 · Offset',
        subdetail: 'Forma 1 (32 págs) + Forma 2 (32 págs)',
        targetTab: 'Proceso',
      },
      {
        id: 'node-bd-materials',
        label: 'Materiales',
        folio: '4 Insumos Trazados',
        status: 'ok',
        statusLabel: 'Conforme',
        timestamp: '28 Ago · 06:30',
        detail: 'Papel Bond 60g LOT-BOND60-2026 · Tinta LOT-INK-BK-09',
        subdetail: 'Alambre grapado LOT-ALAM-02',
        targetTab: 'Materiales',
      },
      {
        id: 'node-bd-process',
        label: 'Procesos',
        folio: '5 Etapas Offset',
        status: 'ok',
        statusLabel: 'Ruta Completa',
        timestamp: '29 Ago · 18:00',
        detail: 'CTP → Heidelberg → Guillotina → Stahl → Muller Martini',
        subdetail: 'Operadores: J. Salinas, S. Treviño, D. Garza',
        targetTab: 'Proceso',
      },
      {
        id: 'node-bd-qa',
        label: 'Calidad',
        folio: 'MNC-000348',
        status: 'warning',
        statusLabel: 'HOLD Parcial Resuelto',
        timestamp: '30 Ago · 10:20',
        detail: '145 folletos en HOLD por texto legal de garantía',
        subdetail: 'Liberación de 9,855 piezas tras clasificación',
        targetTab: 'Calidad',
      },
      {
        id: 'node-bd-pt',
        label: 'Bache PT',
        folio: 'BCH-44948',
        status: 'ok',
        statusLabel: 'PT-B-02 Rack 2',
        timestamp: '31 Ago · 14:00',
        detail: '197 paquetes de 50 folletos fajillados',
        subdetail: 'Lote PT-260907-038 emitido',
        targetTab: 'Embarque',
      },
      {
        id: 'node-bd-shipping',
        label: 'Embarque',
        folio: 'OS-260907-0038',
        status: 'ok',
        statusLabel: 'Entregado',
        timestamp: '01 Sep · 10:30',
        detail: 'Remisión REM-260907-0038 · Camión #12 Hino',
        subdetail: 'Chofer: Luis Herrera',
        targetTab: 'Embarque',
      },
      {
        id: 'node-bd-invoice',
        label: 'Factura SAT',
        folio: 'FAC-2026-7889',
        status: 'ok',
        statusLabel: 'Timbrada CFDI 4.0',
        timestamp: '01 Sep · 12:00',
        detail: 'Monto neto $42,300 MXN',
        subdetail: 'Pago PUE Transferencia',
        targetTab: 'Documentos',
      },
      {
        id: 'node-bd-rma',
        label: 'Queja / RMA',
        folio: 'Sin Queja (0)',
        status: 'neutral',
        statusLabel: 'Sin Reclamo',
        timestamp: 'N/A',
        detail: 'Contención 100% interna en planta RTM',
        subdetail: 'Cero escapes a cliente',
        targetTab: 'Incidencias',
      },
    ],
    materials: [
      {
        id: 'mat-bd-1',
        sku: 'PAP-BOND-60-5787',
        name: 'Papel Bond Blanco 60g (Pliego 57x87 cm)',
        type: 'Papel Pliego',
        lotNumber: 'LOT-BOND60-2026',
        supplier: 'Papelera Maldonado S.A.',
        supplierId: 'prov-02',
        poFolio: 'OC-2026-0078',
        required: '12,500 pliegos',
        consumed: '12,380 pliegos',
        remnant: '120 pliegos reutilizables en setup',
        incomingQaStatus: 'Conforme ✓',
        incomingDate: '18 Ago 2026',
        coaFolio: 'COA-PM-1120',
        notes: 'Humedad relativa 50%, calibre 3.1 mil conforme.',
      },
      {
        id: 'mat-bd-2',
        sku: 'INK-OFF-BK-QUICK',
        name: 'Tinta Offset Negra Rápido Secado',
        type: 'Tinta Offset',
        lotNumber: 'LOT-INK-BK-09',
        supplier: 'Sun Chemical México',
        supplierId: 'prov-05',
        poFolio: 'OC-2026-0082',
        required: '6.8 kg',
        consumed: '6.4 kg',
        incomingQaStatus: 'Conforme ✓',
        incomingDate: '19 Ago 2026',
        coaFolio: 'COA-SUN-7704',
        notes: 'Tack 12.5 conforme para máquina pliego.',
      },
      {
        id: 'mat-bd-3',
        sku: 'PL-CTP-THERMAL-AGFA',
        name: 'Placas Offset CTP Térmicas Agfa',
        type: 'Placa/Cliché',
        lotNumber: 'LOT-PL-CTP-08',
        supplier: 'Agfa Graphics México',
        poFolio: 'OC-2026-0065',
        required: '8 placas',
        consumed: '8 placas',
        incomingQaStatus: 'Conforme ✓',
        incomingDate: '10 Ago 2026',
        coaFolio: 'COA-AGFA-3301',
        notes: 'Formas 1 y 2 (Frente y Vuelta) grabadas en CTP.',
      },
      {
        id: 'mat-bd-4',
        sku: 'WR-STAPLE-25G',
        name: 'Alambre para Grapado al Lomo Calibre 25',
        type: 'Consumible Acabados',
        lotNumber: 'LOT-ALAM-02',
        supplier: 'Grapas y Alambres del Norte',
        poFolio: 'OC-2026-0070',
        required: '1 rollo',
        consumed: '0.85 rollo',
        incomingQaStatus: 'Conforme ✓',
        incomingDate: '12 Ago 2026',
        coaFolio: 'COA-GAN-8812',
      },
    ],
    routing: [
      {
        stepNumber: 1,
        process: 'Preimpresión CTP',
        machine: 'CTP Agfa Avalon',
        operator: 'J. Méndez',
        setupMinutesStandard: 20,
        setupMinutesReal: 18,
        runMinutesStandard: 30,
        runMinutesReal: 28,
        inputQty: 8,
        goodQty: 8,
        scrapQty: 0,
        scrapUom: 'placas',
        firstPieceStatus: 'Aprobada ✓',
        startTime: '28 Ago · 07:00',
        endTime: '28 Ago · 07:46',
        status: 'Completada',
        subOperations: ['Rip de archivos PDF 64 páginas', 'Linealización CTP', 'Quemado de 8 placas'],
      },
      {
        stepNumber: 2,
        process: 'Impresión Offset Comercial',
        machine: 'Heidelberg Speedmaster XL 75',
        operator: 'J. Salinas',
        setupMinutesStandard: 40,
        setupMinutesReal: 45,
        runMinutesStandard: 160,
        runMinutesReal: 155,
        inputQty: 12500,
        goodQty: 12380,
        scrapQty: 120,
        scrapUom: 'pliegos',
        scrapCause: 'Entonación de pliego y ajuste de pinzas',
        firstPieceStatus: 'Aprobada ✓',
        startTime: '28 Ago · 08:00',
        endTime: '28 Ago · 11:20',
        status: 'Completada',
        subOperations: ['Tiraje Forma 1 (32 págs)', 'Tiraje Forma 2 (32 págs)'],
      },
      {
        stepNumber: 3,
        process: 'Guillotina y Desbarbado',
        machine: 'Guillotina Polar 115',
        operator: 'Jorge Morales',
        setupMinutesStandard: 15,
        setupMinutesReal: 12,
        runMinutesStandard: 45,
        runMinutesReal: 40,
        inputQty: 12380,
        goodQty: 12380,
        scrapQty: 0,
        scrapUom: 'pliegos',
        startTime: '28 Ago · 13:00',
        endTime: '28 Ago · 13:52',
        status: 'Completada',
      },
      {
        stepNumber: 4,
        process: 'Doblado de Cuadernillos',
        machine: 'Dobladora Stahl Ti 52',
        operator: 'Sergio Treviño',
        setupMinutesStandard: 25,
        setupMinutesReal: 28,
        runMinutesStandard: 60,
        runMinutesReal: 65,
        inputQty: 24760,
        goodQty: 24710,
        scrapQty: 50,
        scrapUom: 'cuadernillos',
        scrapCause: 'Ajuste de rodillos de doblez cruzado',
        startTime: '29 Ago · 08:30',
        endTime: '29 Ago · 10:03',
        status: 'Completada',
      },
      {
        stepNumber: 5,
        process: 'Alzado, Grapado y Refile Trilateral',
        machine: 'Línea Muller Martini Presto',
        operator: 'David Garza',
        setupMinutesStandard: 30,
        setupMinutesReal: 35,
        runMinutesStandard: 70,
        runMinutesReal: 85,
        inputQty: 10000,
        goodQty: 9855,
        scrapQty: 145,
        scrapUom: 'folletos',
        scrapCause: 'Bloqueo por MNC-000348 (texto de garantía desactualizado en contraportada)',
        firstPieceStatus: 'Aprobada ✓',
        startTime: '29 Ago · 14:00',
        endTime: '29 Ago · 16:00',
        status: 'Completada',
      },
    ],
    qualityGates: [
      {
        id: 'gate-bd-1',
        gate: 'Auditoría Primera Pieza Offset',
        dictamen: 'Aprobado',
        auditor: 'Marcelo Flores (Calidad)',
        timestamp: '28 Ago · 08:45',
        measurements: [
          { parameter: 'Registro de corte y doblez', standard: '± 0.5 mm', actual: '+0.2 mm', status: 'ok' },
          { parameter: 'Densidad óptica de texto', standard: '1.40 ± 0.10', actual: '1.42', status: 'ok' },
          { parameter: 'Secuencia de páginas 1 a 64', standard: 'Completa sin saltos', actual: 'Conforme', status: 'ok' },
        ],
        notes: 'Secuencia folleto verificada con maqueta aprobada.',
      },
      {
        id: 'gate-bd-2',
        gate: 'Auditoría Final Muller Martini',
        dictamen: 'En HOLD',
        auditor: 'Alicia Ramírez (Calidad)',
        timestamp: '30 Ago · 10:20',
        measurements: [
          { parameter: 'Revisión de texto contraportada', standard: 'Garantía 2 Años (Rev 08/23)', actual: 'Garantía 1 Año (Rev 04/21)', status: 'alert' },
        ],
        notes:
          'Se detectó que 145 pliegos mezclados del arranque contenían contraportada obsoleta. Se generó MNC-000348 y orden en HOLD.',
        mncFolio: 'MNC-000348',
      },
      {
        id: 'gate-bd-3',
        gate: 'Reinspección y Liberación 100%',
        dictamen: 'Aprobado',
        auditor: 'Alicia Ramírez (Calidad)',
        timestamp: '30 Ago · 16:45',
        measurements: [
          { parameter: 'Inspección 100% de contraportadas', standard: '9,855 correctas / 145 descartadas', actual: 'Conforme', status: 'ok' },
        ],
        notes: '145 piezas enviadas a scrap. 9,855 manuales conformes liberados.',
        labelZebraFolio: 'QA-REL-95249-REV08',
      },
    ],
    shipping: {
      orderFolio: 'OS-260907-0038',
      remisionFolio: 'REM-260907-0038',
      carrierVehicle: 'Camión #12 · Hino 300 (TM-9102-C)',
      driver: 'Luis Herrera',
      stagingLane: 'Andén EMB-01',
      departureTime: '01 Sep · 09:15',
      deliveryTime: '01 Sep · 10:30',
      deliveryStatus: 'Entregado de conformidad',
      recipientName: 'Recibo Black & Decker (Lic. Mónica Villarreal)',
      packagingSummary: '197 paquetes de 50 manuales (9,855 netos)',
      deliveryAddress: 'Blvd. Industrial Black & Decker #100, Reynosa',
    },
    documents: [
      {
        id: 'doc-bd-1',
        title: 'Especificación de Impresión de Manual Matrix',
        type: 'Dibujo / Especificación',
        code: 'SPEC-BD-NA472050',
        revision: 'Rev 08/23',
        status: 'Vigente',
        fileFormat: 'PDF',
        date: '12 Ago 2023',
        author: 'Black & Decker USA',
      },
      {
        id: 'doc-bd-2',
        title: 'Reporte de No Conformidad en Proceso',
        type: 'Checklist QA',
        code: 'MNC-000348',
        revision: 'Cerrado',
        status: 'Aprobado',
        fileFormat: 'PDF',
        date: '30 Ago 2026',
        author: 'Alicia Ramírez',
      },
      {
        id: 'doc-bd-3',
        title: 'Certificado de Conformidad Final COA',
        type: 'Certificado COA',
        code: 'COA-BD-95249',
        revision: 'Rev 0',
        status: 'Emitido',
        fileFormat: 'PDF',
        date: '31 Ago 2026',
        author: 'Alicia Ramírez',
      },
      {
        id: 'doc-bd-4',
        title: 'Remisión de Salida de Almacén',
        type: 'Remisión',
        code: 'REM-260907-0038',
        revision: 'Original',
        status: 'Emitido',
        fileFormat: 'PDF',
        date: '01 Sep 2026',
        author: 'Logística RTM',
      },
    ],
    incidents: [
      {
        id: 'inc-bd-1',
        type: 'MNC / HOLD',
        severity: 'Media',
        title: 'Mezcla de pliegos de contraportada obsoleta en arranque',
        impact: '145 piezas producidas con cláusula de garantía de 1 año en vez de 2 años.',
        timestamp: '30 Ago · 10:20',
        resolution:
          'Contención inmediata en mesa Muller Martini. Clasificación manual al 100% de la tarima. Scrap de 145 unidades y liberación de 9,855 manuales.',
        responsible: 'Alicia Ramírez (Calidad) / J. Salinas (Prensa)',
      },
    ],
    timeline: [
      {
        id: 'tl-bd-1',
        time: '24 Ago · 11:00',
        category: 'Comercial',
        title: 'Pedido B2B Confirmado',
        description: 'Pedido PED-RTM-2026-0142 ingresado al ERP.',
        user: 'Ventas Corporativas',
        badgeTone: 'primary',
      },
      {
        id: 'tl-bd-2',
        time: '28 Ago · 08:00',
        category: 'Piso',
        title: 'Arranque de Impresión Offset',
        description: 'Heidelberg XL 75 arranca tiraje de formas 1 y 2.',
        user: 'J. Salinas',
        badgeTone: 'primary',
      },
      {
        id: 'tl-bd-3',
        time: '30 Ago · 10:20',
        category: 'Calidad',
        title: 'Alerta QA: Retención en HOLD',
        description: 'MNC-000348 emitida por texto legal de garantía. Paro de alzado.',
        user: 'Alicia Ramírez',
        badgeTone: 'danger',
      },
      {
        id: 'tl-bd-4',
        time: '30 Ago · 16:45',
        category: 'Calidad',
        title: 'Disposición y Liberación Conforme',
        description: '9,855 manuales conformes liberados tras clasificación 100%.',
        user: 'Alicia Ramírez',
        badgeTone: 'success',
      },
      {
        id: 'tl-bd-5',
        time: '01 Sep · 10:30',
        category: 'Embarques',
        title: 'Entrega en Almacén Black & Decker',
        description: 'Recepción conforme sin rechazo del cliente.',
        user: 'Luis Herrera',
        badgeTone: 'success',
      },
    ],
    systemSuggestions: [
      {
        id: 'sug-bd-1',
        type: 'success',
        title: 'Cero escapes a cliente (Contención exitosa)',
        explanation:
          'La no conformidad MNC-000348 fue detectada y contenida en planta RTM antes de empaque. El cliente recibió 9,855 piezas 100% conformes.',
        actionLabel: 'Ver auditoría y MNC',
        targetTab: 'Calidad',
        actionTarget: 'gate-bd-2',
      },
    ],
  },

  // ====================================================================
  // 3. TYCO ELECTRONICS · IS-2420 (Flexo poliéster, bache BCH-44935, DEV-ENV-0421)
  // ====================================================================
  {
    id: 'dos-tyco-95256',
    opFolio: 'OP-2026-95256',
    opId: 'op-3',
    cliente: 'Tyco Electronics',
    pedido: 'PED-RTM-2026-0138',
    salesOrderDate: '21 Ago 2026',
    partNumber: 'IS-2420',
    partDescription: 'Etiqueta Poliéster Térmico Alta Resistencia Automotriz',
    revision: 'Rev B',
    area: 'Flexografía',
    status: 'Liberada',
    quantity: 25000,
    good: 24890,
    scrap: 110,
    scrapPercent: 0.44,
    finishedBatch: 'BCH-44935',
    ptWarehouse: 'Almacén Producto Terminado (Nave 1)',
    ptLocation: 'PT-C-01',
    shippingFolio: 'OS-260906-0031',
    remisionFolio: 'REM-260906-0031',
    invoiceFolio: 'FAC-2026-7880',
    invoiceDate: '06 Sep 2026',
    invoiceTotal: 34500,
    machine: 'Comexi F2 MB',
    operator: 'Antonio Torres',
    due: '06 Sep 2026',
    health: {
      documentationValid: true,
      lotsIdentified: true,
      routeComplete: true,
      qaGatesComplete: true,
      shippingIdentified: true,
      notes: 'Desviación ambiental 4M contenida preventivamente por sensor termohigrómetro.',
    },
    chainNodes: [
      {
        id: 'node-ty-client',
        label: 'Cliente',
        folio: 'TYCO',
        status: 'ok',
        statusLabel: 'Tier 1 Automotriz',
        timestamp: '21 Ago',
        detail: 'TE Connectivity / Tyco México',
        subdetail: 'Comprador: Ing. Laura Saldaña',
        targetTab: 'Resumen',
      },
      {
        id: 'node-ty-order',
        label: 'Pedido',
        folio: 'PED-RTM-2026-0138',
        status: 'ok',
        statusLabel: 'Autorizado',
        timestamp: '21 Ago · 15:30',
        detail: '25,000 etiquetas · $34,500 MXN',
        subdetail: 'Poliéster blanco transferencia térmica',
        targetTab: 'Resumen',
      },
      {
        id: 'node-ty-op',
        label: 'Orden Producción',
        folio: 'OP-2026-95256',
        status: 'ok',
        statusLabel: 'Terminada 100%',
        timestamp: '05 Sep · 08:00',
        detail: 'Prensa Comexi F2 MB · Flexografía',
        subdetail: '24,890 buenas · 110 scrap',
        targetTab: 'Proceso',
      },
      {
        id: 'node-ty-materials',
        label: 'Materiales',
        folio: '2 Insumos Grado Automotriz',
        status: 'ok',
        statusLabel: 'Conforme',
        timestamp: '05 Sep · 07:30',
        detail: 'Poliéster 2 mil LOT-PET-260729 · Ribbon LOT-RIB-260810',
        subdetail: 'Adhesivo 3M 350 alta adherencia',
        targetTab: 'Materiales',
      },
      {
        id: 'node-ty-process',
        label: 'Procesos',
        folio: 'Paro Preventivo 4M',
        status: 'warning',
        statusLabel: 'Desviación Ambiental 4M',
        timestamp: '05 Sep · 11:05',
        detail: 'Temperatura 27.8°C detectada · Paro 25 min',
        subdetail: 'Climatización estabilizada y reactivada',
        targetTab: 'Proceso',
      },
      {
        id: 'node-ty-qa',
        label: 'Calidad',
        folio: 'DEV-ENV-0421',
        status: 'ok',
        statusLabel: 'Liberado c/Acción 4M',
        timestamp: '05 Sep · 14:00',
        detail: 'Auditoría final conforme AQL 0.65',
        subdetail: 'Auditor: Alicia Ramírez',
        targetTab: 'Calidad',
      },
      {
        id: 'node-ty-pt',
        label: 'Bache PT',
        folio: 'BCH-44935',
        status: 'ok',
        statusLabel: 'PT-C-01 Rack 3',
        timestamp: '05 Sep · 17:15',
        detail: '25 rollos de 1,000 etiquetas',
        subdetail: 'Lote PT-260906-031',
        targetTab: 'Embarque',
      },
      {
        id: 'node-ty-shipping',
        label: 'Embarque',
        folio: 'OS-260906-0031',
        status: 'ok',
        statusLabel: 'Entregado',
        timestamp: '06 Sep · 18:30',
        detail: 'Remisión REM-260906-0031 · Camión #08',
        subdetail: 'Chofer: Roberto Garza',
        targetTab: 'Embarque',
      },
      {
        id: 'node-ty-invoice',
        label: 'Factura SAT',
        folio: 'FAC-2026-7880',
        status: 'ok',
        statusLabel: 'Timbrada CFDI 4.0',
        timestamp: '06 Sep · 19:00',
        detail: 'Monto neto $34,500 MXN',
        subdetail: 'SAT UUID: 9A1C-44F2',
        targetTab: 'Documentos',
      },
      {
        id: 'node-ty-rma',
        label: 'Queja / RMA',
        folio: 'Sin Queja (0)',
        status: 'neutral',
        statusLabel: 'Sin Reclamo',
        timestamp: 'N/A',
        detail: 'Calificación de proveedor TE: 100 Pts',
        subdetail: 'Cero defectos',
        targetTab: 'Incidencias',
      },
    ],
    materials: [
      {
        id: 'mat-ty-1',
        sku: 'PET-WHT-2MIL-3M',
        name: 'Poliéster Blanco Térmico 2 mil con Adhesivo 350',
        type: 'Sustrato Técnico',
        lotNumber: 'LOT-PET-260729',
        supplier: '3M México S.A. de C.V.',
        supplierId: 'prov-06',
        poFolio: 'OC-2026-0061',
        required: '2,600 m',
        consumed: '2,540 m',
        remnant: '60 m',
        incomingQaStatus: 'Conforme ✓',
        incomingDate: '29 Jul 2026',
        coaFolio: 'COA-3M-8890',
        notes: 'Resistencia química y térmica (-40°C a +150°C) certificada.',
      },
      {
        id: 'mat-ty-2',
        sku: 'RIB-RESIN-ARMOR',
        name: 'Ribbon Resina Premium AXR 7+',
        type: 'Consumible Térmico',
        lotNumber: 'LOT-RIB-260810',
        supplier: 'Armor México',
        poFolio: 'OC-2026-0074',
        required: '3 rollos',
        consumed: '2.5 rollos',
        incomingQaStatus: 'Conforme ✓',
        incomingDate: '10 Ago 2026',
        coaFolio: 'COA-ARM-1140',
      },
    ],
    routing: [
      {
        stepNumber: 1,
        process: 'Troquelado Rotativo y Precorte',
        machine: 'Comexi F2 MB',
        operator: 'Antonio Torres',
        setupMinutesStandard: 25,
        setupMinutesReal: 50,
        runMinutesStandard: 120,
        runMinutesReal: 125,
        inputQty: 25500,
        goodQty: 24920,
        scrapQty: 80,
        scrapUom: 'piezas',
        scrapCause: 'Ajuste de temperatura en cámara climatizada',
        firstPieceStatus: 'Aprobada ✓',
        startTime: '05 Sep · 08:30',
        endTime: '05 Sep · 12:25',
        status: 'Completada',
        deviationNote: 'Paro técnico preventivo de 25 min registrado por DEV-ENV-0421.',
      },
      {
        stepNumber: 2,
        process: 'Rebobinado e Inspección Óptica',
        machine: 'Rotoflex II',
        operator: 'Carlos Vega',
        setupMinutesStandard: 10,
        setupMinutesReal: 10,
        runMinutesStandard: 45,
        runMinutesReal: 42,
        inputQty: 24920,
        goodQty: 24890,
        scrapQty: 30,
        scrapUom: 'piezas',
        firstPieceStatus: 'No aplica',
        startTime: '05 Sep · 13:00',
        endTime: '05 Sep · 13:52',
        status: 'Completada',
      },
    ],
    qualityGates: [
      {
        id: 'gate-ty-1',
        gate: 'Primera Pieza y Dimensional',
        dictamen: 'Aprobado',
        auditor: 'Alicia Ramírez (Calidad)',
        timestamp: '05 Sep · 09:10',
        measurements: [
          { parameter: 'Espesor total de etiqueta', standard: '75 ± 5 µm', actual: '74 µm', status: 'ok' },
          { parameter: 'Fuerza de desprendimiento liner', standard: '15 - 35 cN/cm', actual: '22 cN/cm', status: 'ok' },
        ],
        notes: 'Dimensional y liner conformes a norma Tyco 108-18042.',
      },
      {
        id: 'gate-ty-2',
        gate: 'Monitoreo Ambiental Periódico',
        dictamen: 'Rechazado',
        auditor: 'Alicia Ramírez (Calidad)',
        timestamp: '05 Sep · 11:05',
        measurements: [
          { parameter: 'Temperatura ambiente sala Comexi', standard: '20.0 – 24.0 °C', actual: '27.8 °C', status: 'alert' },
          { parameter: 'Humedad relativa', standard: '45 – 60 %', actual: '68 %', status: 'alert' },
        ],
        notes:
          'Termohigrómetro disparó alarma. Se ordenó paro preventivo para evitar sangrado de adhesivo acrílico.',
      },
      {
        id: 'gate-ty-3',
        gate: 'Reanudación tras Climatización',
        dictamen: 'Aprobado',
        auditor: 'Alicia Ramírez (Calidad)',
        timestamp: '05 Sep · 11:35',
        measurements: [
          { parameter: 'Temperatura ambiente restablecida', standard: '20.0 – 24.0 °C', actual: '22.4 °C', status: 'ok' },
          { parameter: 'Humedad relativa', standard: '45 – 60 %', actual: '52 %', status: 'ok' },
        ],
        notes: 'Aire acondicionado calibrado. Corrida reanudada sin daño a sustrato.',
      },
      {
        id: 'gate-ty-4',
        gate: 'Auditoría Final Lote PT',
        dictamen: 'Aprobado',
        auditor: 'Alicia Ramírez (Calidad)',
        timestamp: '05 Sep · 16:00',
        measurements: [
          { parameter: 'Muestreo AQL 0.65 Nivel II', standard: '315 piezas', actual: '315 piezas', status: 'ok' },
          { parameter: 'Defectos encontrados', standard: '0', actual: '0', status: 'ok' },
        ],
        notes: 'Lote 100% conforme. Se emiten certificados COA.',
      },
    ],
    shipping: {
      orderFolio: 'OS-260906-0031',
      remisionFolio: 'REM-260906-0031',
      carrierVehicle: 'Camión #08 · Isuzu NPR (TM-8492-B)',
      driver: 'Roberto Garza',
      stagingLane: 'Andén EMB-02',
      departureTime: '06 Sep · 17:00',
      deliveryTime: '06 Sep · 18:30',
      deliveryStatus: 'Entregado de conformidad',
      recipientName: 'Recibo Tyco Electronics (Ing. Laura Saldaña)',
      packagingSummary: '25 cajas termoencogidas · 24,890 etiquetas netas',
      deliveryAddress: 'Parque Industrial Reynosa Sección Poniente #30',
    },
    documents: [
      {
        id: 'doc-ty-1',
        title: 'Especificación Automotriz Tyco IS-2420',
        type: 'Dibujo / Especificación',
        code: 'ENG-TY-IS2420-B',
        revision: 'Rev B',
        status: 'Vigente',
        fileFormat: 'PDF',
        date: '14 Abr 2025',
        author: 'Tyco Electronics Global',
      },
      {
        id: 'doc-ty-2',
        title: 'Reporte de Desviación Ambiental 4M',
        type: 'Checklist QA',
        code: 'DEV-ENV-0421',
        revision: 'Cerrado',
        status: 'Aprobado',
        fileFormat: 'PDF',
        date: '05 Sep 2026',
        author: 'Alicia Ramírez',
      },
      {
        id: 'doc-ty-3',
        title: 'Certificado de Conformidad Automotriz COA',
        type: 'Certificado COA',
        code: 'COA-TYCO-260906',
        revision: 'Rev 0',
        status: 'Emitido',
        fileFormat: 'PDF',
        date: '05 Sep 2026',
        author: 'Alicia Ramírez',
      },
    ],
    incidents: [
      {
        id: 'inc-ty-1',
        type: 'Desviación 4M',
        severity: 'Media',
        title: 'Paro técnico preventivo por temperatura en sala Comexi',
        impact: 'Demora de 25 minutos en corrida. Cero afectación al producto final.',
        timestamp: '05 Sep · 11:05',
        resolution: 'Revisión técnica de climatización. Reanudación conforme.',
        responsible: 'Mantenimiento & Calidad',
      },
    ],
    timeline: [
      {
        id: 'tl-ty-1',
        time: '21 Ago · 15:30',
        category: 'Comercial',
        title: 'Recepción de Pedido Automotriz',
        description: 'Pedido PED-RTM-2026-0138 cargado en sistema.',
        user: 'Ventas B2B',
        badgeTone: 'primary',
      },
      {
        id: 'tl-ty-2',
        time: '05 Sep · 08:30',
        category: 'Piso',
        title: 'Arranque de Prensa Comexi',
        description: 'Montaje de suaje y preparación de poliéster 3M.',
        user: 'Antonio Torres',
        badgeTone: 'primary',
      },
      {
        id: 'tl-ty-3',
        time: '05 Sep · 11:05',
        category: 'Calidad',
        title: 'Alerta Ambiental 4M',
        description: 'Paro preventivo por temperatura 27.8°C (DEV-ENV-0421).',
        user: 'Alicia Ramírez',
        badgeTone: 'warning',
      },
      {
        id: 'tl-ty-4',
        time: '05 Sep · 16:00',
        category: 'Calidad',
        title: 'Lote 100% Liberado AQL 0.65',
        description: 'Certificado COA emitido y producto transferido a PT-C-01.',
        user: 'Alicia Ramírez',
        badgeTone: 'success',
      },
      {
        id: 'tl-ty-5',
        time: '06 Sep · 18:30',
        category: 'Embarques',
        title: 'Entrega Exitosa en Tyco',
        description: 'Remisión firmada por Ing. Laura Saldaña.',
        user: 'Roberto Garza (Chofer)',
        badgeTone: 'success',
      },
    ],
    systemSuggestions: [
      {
        id: 'sug-ty-1',
        type: 'info',
        title: 'Alerta preventiva 4M cerrada con éxito',
        explanation:
          'El control ambiental termohigrométrico previno escurrimiento de adhesivo acrílico 3M durante el troquelado rotativo. Cero scrap asociado al adhesivo.',
        actionLabel: 'Ver análisis 4M y auditorías',
        targetTab: 'Calidad',
        actionTarget: 'gate-ty-2',
      },
    ],
  },
];

/**
 * Búsqueda universal inteligente para Trazabilidad 360
 */
export function findTraceabilityDossiers(query: string): TraceabilityDossier[] {
  const q = query.toLowerCase().trim();
  if (!q) return INITIAL_TRACEABILITY_DOSSIERS;

  return INITIAL_TRACEABILITY_DOSSIERS.filter((dos) => {
    return (
      dos.opFolio.toLowerCase().includes(q) ||
      dos.cliente.toLowerCase().includes(q) ||
      dos.pedido.toLowerCase().includes(q) ||
      dos.partNumber.toLowerCase().includes(q) ||
      dos.partDescription.toLowerCase().includes(q) ||
      dos.finishedBatch.toLowerCase().includes(q) ||
      dos.shippingFolio.toLowerCase().includes(q) ||
      dos.remisionFolio.toLowerCase().includes(q) ||
      dos.invoiceFolio.toLowerCase().includes(q) ||
      (dos.complaintId && dos.complaintId.toLowerCase().includes(q)) ||
      dos.materials.some(
        (m) =>
          m.lotNumber.toLowerCase().includes(q) ||
          m.name.toLowerCase().includes(q) ||
          m.supplier.toLowerCase().includes(q)
      ) ||
      dos.qualityGates.some(
        (g) =>
          (g.mncFolio && g.mncFolio.toLowerCase().includes(q)) ||
          (g.labelZebraFolio && g.labelZebraFolio.toLowerCase().includes(q))
      )
    );
  });
}
