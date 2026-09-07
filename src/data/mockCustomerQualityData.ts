// ====================================================
// MODELOS Y DATOS MOCK: QUEJAS & RMA (CUSTOMER QUALITY)
// Conexión directa con OP, Lote, Embarque, Factura, MNC, 4M e ICAR
// ====================================================

export type ComplaintSeverity = 'Crítica' | 'Mayor' | 'Menor';

export type ComplaintStatus =
  | 'Abierta'
  | 'En evaluación QA'
  | 'RMA Aprobado'
  | 'En Reinspección'
  | 'Reemplazo Emitido'
  | 'Rechazada'
  | 'Cerrada';

export type RmaType =
  | 'Retorno y Reemplazo'
  | 'Retorno y Retrabajo'
  | 'Disposición en Planta Cliente'
  | 'Nota de Crédito';

export type RmaResolutionStatus =
  | 'Pendiente Retorno'
  | 'En Reinspección Cuarentena'
  | 'En Reparación'
  | 'Reemplazo Liberado'
  | 'Cerrado';

export interface ComplaintTraceability {
  opFolio: string;
  lotNumber: string;
  shipmentFolio: string;
  invoiceNumber: string;
  productionLine: string;
  operator: string;
  deliveryDate: string;
}

export interface ComplaintQaEvaluation {
  evaluatedBy: string;
  evaluationDate: string;
  decision: 'Procedente' | 'No Procedente' | 'Pendiente';
  technicalDiagnosis: string;
  fourMCause: 'Mano de obra' | 'Maquinaria' | 'Material' | 'Método';
  rejectionReason?: string; // Obligatorio si decision === 'No Procedente'
}

export interface ComplaintRmaDetails {
  rmaNumber: string;
  rmaType: RmaType;
  approvalDate: string;
  approvedBy: string;
  carrierName?: string;
  trackingGuide?: string;
  receivedAtWarehouse: boolean;
  receivedDate?: string;
  physicalQuantityReceived?: number;
  quarantineLocation?: string;
  reinspectionResult?: 'Conforme - Reingreso a Inventario' | 'Defecto Confirmado - Scrap Técnico' | 'Reparable en Acabados';
  reinspectionNotes?: string;
  replacementOpFolio?: string;
  resolutionStatus: RmaResolutionStatus;
}

export interface ComplaintEvidence {
  id: string;
  title: string;
  fileType: string;
  uploadDate: string;
  uploader: string;
  notes: string;
}

export interface ComplaintAuditEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  notes: string;
}

export interface CustomerComplaint {
  id: string; // QJ-2026-014
  rmaNumber?: string; // RMA-2026-014
  date: string;
  client: string;
  clientContact: string;
  partNumber: string;
  partDescription: string;
  defectType: string;
  severity: ComplaintSeverity;
  claimedQuantity: number;
  claimedValue: number;
  status: ComplaintStatus;
  traceability: ComplaintTraceability;
  qaEvaluation?: ComplaintQaEvaluation;
  rmaDetails?: ComplaintRmaDetails;
  linkedMncId?: string;
  linkedIcarId?: string;
  evidences: ComplaintEvidence[];
  auditTrail: ComplaintAuditEntry[];
  resolutionNotes?: string;
  closedDate?: string;
  closedBy?: string;
}

// ----------------------------------------------------
// DATOS MOCK INICIALES DE QUEJAS Y RMAS
// ----------------------------------------------------
export const INITIAL_CUSTOMER_COMPLAINTS: CustomerComplaint[] = [
  {
    id: 'QJ-2026-014',
    rmaNumber: 'RMA-2026-014',
    date: '03 Sep 2026',
    client: 'Panasonic Industrial',
    clientContact: 'Ing. Roberto Cantú (Aseguramiento de Calidad)',
    partNumber: '526412 | G |',
    partDescription: 'Etiqueta Identificación Automotriz 4x2',
    defectType: 'Código de barras DataMatrix con baja lectura (Grado C en escáner Cognex de línea de ensamble)',
    severity: 'Crítica',
    claimedQuantity: 15000,
    claimedValue: 18500,
    status: 'RMA Aprobado',
    traceability: {
      opFolio: 'OP-2026-95250',
      lotNumber: 'PT-260907-00345',
      shipmentFolio: 'EMB-2026-0410',
      invoiceNumber: 'FAC-2026-7891',
      productionLine: 'Prensa Mark Andy Scout',
      operator: 'María Ríos',
      deliveryDate: '28 Ago 2026',
    },
    qaEvaluation: {
      evaluatedBy: 'Alicia Ramírez (Calidad)',
      evaluationDate: '04 Sep 2026',
      decision: 'Procedente',
      technicalDiagnosis: 'Se evaluaron muestras enviadas por el cliente. Se confirmó pérdida de ganancia de punto en celdas de DataMatrix por viscosidad de tinta UV fuera de especificación.',
      fourMCause: 'Material',
    },
    rmaDetails: {
      rmaNumber: 'RMA-2026-014',
      rmaType: 'Retorno y Reemplazo',
      approvalDate: '04 Sep 2026',
      approvedBy: 'Alicia Ramírez & Iván Estrada',
      carrierName: 'Transportes Castores',
      trackingGuide: 'CAS-789210-MEX',
      receivedAtWarehouse: true,
      receivedDate: '06 Sep 2026 · 11:30',
      physicalQuantityReceived: 15000,
      quarantineLocation: 'Almacén Cuarentena / Rampa QA-02',
      reinspectionResult: 'Defecto Confirmado - Scrap Técnico',
      reinspectionNotes: '15,000 etiquetas ingresadas a cuarentena. Se procedió a dar de baja y generar OP de reemplazo.',
      replacementOpFolio: 'OP-2026-95260',
      resolutionStatus: 'En Reinspección Cuarentena',
    },
    linkedMncId: 'MNC-000349',
    linkedIcarId: 'ICAR-2026-020',
    evidences: [
      {
        id: 'ev-01',
        title: 'Reporte de Falla Cognex de Panasonic',
        fileType: 'PDF',
        uploadDate: '03 Sep 2026',
        uploader: 'Roberto Cantú (Cliente)',
        notes: 'Gráfica de reflectancia y contraste de símbolo por debajo de estándar ISO/IEC 15415.',
      },
      {
        id: 'ev-02',
        title: 'Fotografía microscópica de celda DataMatrix en Laboratorio RTM',
        fileType: 'IMG',
        uploadDate: '04 Sep 2026',
        uploader: 'Alicia Ramírez (Calidad)',
        notes: 'Esparcimiento de tinta UV observado en contorno perimetral.',
      },
    ],
    auditTrail: [
      {
        id: 'aud-qj-01',
        timestamp: '03 Sep 2026 · 09:15',
        user: 'Atención a Clientes RTM',
        role: 'Ventas / Soporte',
        action: 'Apertura de Queja',
        notes: 'Queja recibida formalmente vía portal de proveedores Panasonic.',
      },
      {
        id: 'aud-qj-02',
        timestamp: '04 Sep 2026 · 14:00',
        user: 'Alicia Ramírez',
        role: 'Aseguramiento de Calidad',
        action: 'Dictamen de Evaluación',
        notes: 'Queja catalogada como Procedente. Causa raíz atribuida a viscosidad de tinta UV.',
      },
      {
        id: 'aud-qj-03',
        timestamp: '04 Sep 2026 · 16:30',
        user: 'Alicia Ramírez',
        role: 'Calidad',
        action: 'Autorización de RMA',
        notes: 'Emisión de RMA-2026-014 para retorno de 15,000 piezas con flete a cargo de RTM.',
      },
      {
        id: 'aud-qj-04',
        timestamp: '06 Sep 2026 · 12:10',
        user: 'Almacén de PT',
        role: 'Logística',
        action: 'Recepción Física de Retorno',
        notes: 'Arribo de 3 cajas con 15,000 etiquetas bajo guía CAS-789210-MEX. Ubicadas en Cuarentena.',
      },
    ],
  },
  {
    id: 'QJ-2026-018',
    date: '05 Sep 2026',
    client: 'BLACK & DECKER',
    clientContact: 'Lic. Mónica Fuentes (Calidad de Ensamble)',
    partNumber: 'IS-2420',
    partDescription: 'Folleto Instructivo Plegado para Taladro Industrial',
    defectType: 'Revisión incorrecta de arte en advertencia frontal de seguridad eléctrica (falta símbolo UL)',
    severity: 'Crítica',
    claimedQuantity: 8500,
    claimedValue: 12750,
    status: 'En evaluación QA',
    traceability: {
      opFolio: 'OP-2026-95249',
      lotNumber: 'PT-260906-00122',
      shipmentFolio: 'EMB-2026-0415',
      invoiceNumber: 'FAC-2026-7905',
      productionLine: 'Offset Heidelberg CD 102',
      operator: 'J. Salinas',
      deliveryDate: '02 Sep 2026',
    },
    qaEvaluation: {
      evaluatedBy: 'Alicia Ramírez',
      evaluationDate: '06 Sep 2026',
      decision: 'Procedente',
      technicalDiagnosis: 'Se cotejó contra plano y dibujo autorizado. En preprensa se procesó archivo obsoleto sin firma de cliente.',
      fourMCause: 'Método',
    },
    linkedMncId: 'MNC-000348',
    evidences: [
      {
        id: 'ev-03',
        title: 'Cotejo de plano de arte vs muestra impresa en planta',
        fileType: 'PDF',
        uploadDate: '05 Sep 2026',
        uploader: 'Alicia Ramírez',
        notes: 'Diferencia evidente en texto de norma UL 62841.',
      },
    ],
    auditTrail: [
      {
        id: 'aud-qj-05',
        timestamp: '05 Sep 2026 · 11:00',
        user: 'Mónica Fuentes',
        role: 'Cliente',
        action: 'Reporte de Falla',
        notes: 'Notificación de paro de línea en planta Reynosa por texto de advertencia incorrecto.',
      },
      {
        id: 'aud-qj-06',
        timestamp: '06 Sep 2026 · 09:30',
        user: 'Alicia Ramírez',
        role: 'Calidad',
        action: 'Evaluación Técnica',
        notes: 'Confirmación de no conformidad. Se requiere autorización de RMA y apertura de ICAR.',
      },
    ],
  },
  {
    id: 'QJ-2026-017',
    rmaNumber: 'RMA-2026-017',
    date: '02 Sep 2026',
    client: 'TYCO Electronics',
    clientContact: 'Ing. Carlos Zepeda',
    partNumber: 'NA472050',
    partDescription: 'Etiqueta Poliéster Térmico con Adhesivo Permanente',
    defectType: 'Desprendimiento prematuro de esquina en prueba de cámara de envejecimiento térmico (85 °C)',
    severity: 'Mayor',
    claimedQuantity: 20000,
    claimedValue: 26400,
    status: 'En Reinspección',
    traceability: {
      opFolio: 'OP-2026-95252',
      lotNumber: 'PT-260905-00891',
      shipmentFolio: 'EMB-2026-0398',
      invoiceNumber: 'FAC-2026-7850',
      productionLine: 'Prensa Mark Andy 4120',
      operator: 'Pedro Morales',
      deliveryDate: '25 Ago 2026',
    },
    qaEvaluation: {
      evaluatedBy: 'Alicia Ramírez',
      evaluationDate: '03 Sep 2026',
      decision: 'Procedente',
      technicalDiagnosis: 'Lote de sustrato de proveedor Fasson presentó tack inicial de 11 N/25mm (mínimo requerido 14 N/25mm). Se activará reclamo a proveedor.',
      fourMCause: 'Material',
    },
    rmaDetails: {
      rmaNumber: 'RMA-2026-017',
      rmaType: 'Retorno y Reemplazo',
      approvalDate: '03 Sep 2026',
      approvedBy: 'Alicia Ramírez',
      carrierName: 'DHL Express',
      trackingGuide: 'DHL-449102-TYC',
      receivedAtWarehouse: true,
      receivedDate: '05 Sep 2026 · 15:00',
      physicalQuantityReceived: 20000,
      quarantineLocation: 'Almacén Cuarentena / Zona B',
      reinspectionResult: 'Defecto Confirmado - Scrap Técnico',
      reinspectionNotes: 'Muestras analizadas en dinamómetro demuestran baja adhesión de sustrato.',
      resolutionStatus: 'En Reinspección Cuarentena',
    },
    linkedIcarId: 'ICAR-2026-021',
    evidences: [
      {
        id: 'ev-04',
        title: 'Certificado de prueba de cámara térmica TYCO',
        fileType: 'PDF',
        uploadDate: '02 Sep 2026',
        uploader: 'Carlos Zepeda (TYCO)',
        notes: 'Fotografías de etiquetas con pérdida de adhesión en sustrato plástico.',
      },
    ],
    auditTrail: [
      {
        id: 'aud-qj-07',
        timestamp: '02 Sep 2026 · 16:20',
        user: 'Carlos Zepeda',
        role: 'Cliente',
        action: 'Reclamo Formal',
        notes: 'Reporte ingresado por mesa de ayuda con lote PT-260905-00891.',
      },
    ],
  },
  {
    id: 'QJ-2026-012',
    date: '28 Ago 2026',
    client: 'Laboratorios Medifarma',
    clientContact: 'Q.F.B. Laura Treviño',
    partNumber: 'ETIQ-FARMA-10',
    partDescription: 'Etiqueta Farmacéutica para Frasco Jarabe 120ml',
    defectType: 'Presunta variación de tono en fondo azul Pantone 286C',
    severity: 'Menor',
    claimedQuantity: 30000,
    claimedValue: 9800,
    status: 'Rechazada',
    traceability: {
      opFolio: 'OP-2026-95240',
      lotNumber: 'PT-260826-00410',
      shipmentFolio: 'EMB-2026-0380',
      invoiceNumber: 'FAC-2026-7812',
      productionLine: 'Prensa Mark Andy Scout',
      operator: 'María Ríos',
      deliveryDate: '26 Ago 2026',
    },
    qaEvaluation: {
      evaluatedBy: 'Alicia Ramírez (Calidad)',
      evaluationDate: '29 Ago 2026',
      decision: 'No Procedente',
      technicalDiagnosis: 'Se midieron las muestras de retención contra el estándar físico firmado por Medifarma utilizando espectrofotómetro X-Rite eXact. El resultado arrojó ΔE = 1.08 (tolerancia acordada en contrato es ΔE ≤ 2.0). La variación percibida por el cliente se debe a condiciones de iluminación no estandarizadas en su andén.',
      fourMCause: 'Método',
      rejectionReason: 'Medición espectrofotométrica demuestra ΔE de 1.08 dentro de la tolerancia contractual de 2.00. Se compartió reporte metrológico formal con el cliente.',
    },
    resolutionNotes: 'Queja rechazada técnicamente con evidencia metrológica. La cliente Laura Treviño aceptó el reporte y liberó el lote para envasado.',
    closedDate: '30 Ago 2026',
    closedBy: 'Alicia Ramírez',
    evidences: [
      {
        id: 'ev-05',
        title: 'Reporte Espectrofotométrico X-Rite ΔE 1.08',
        fileType: 'PDF',
        uploadDate: '29 Ago 2026',
        uploader: 'Alicia Ramírez',
        notes: 'Curva espectral y reporte de delta E conforme a especificación ISO 12647.',
      },
    ],
    auditTrail: [
      {
        id: 'aud-qj-08',
        timestamp: '28 Ago 2026 · 14:30',
        user: 'Laura Treviño',
        role: 'Cliente',
        action: 'Apertura de Queja',
        notes: 'Cliente reporta color más claro que lote anterior.',
      },
      {
        id: 'aud-qj-09',
        timestamp: '29 Ago 2026 · 11:15',
        user: 'Alicia Ramírez',
        role: 'Calidad',
        action: 'Dictamen de Rechazo Justificado',
        notes: 'Prueba metrológica confirma cumplimiento. Rechazo formal fundamentado.',
      },
      {
        id: 'aud-qj-10',
        timestamp: '30 Ago 2026 · 10:00',
        user: 'Alicia Ramírez',
        role: 'Calidad',
        action: 'Cierre de Caso',
        notes: 'Cliente acepta dictamen técnico y da por cerrado el reclamo.',
      },
    ],
  },
  {
    id: 'QJ-2026-009',
    rmaNumber: 'RMA-2026-009',
    date: '20 Ago 2026',
    client: 'Siemens Healthcare',
    clientContact: 'Ing. Germán Soto',
    partNumber: 'LBL-MED-77',
    partDescription: 'Etiqueta Vinilo para Equipo de Ultrasonido',
    defectType: 'Rebaba de troquelado en esquina superior derecha que traba el alimentador automático',
    severity: 'Mayor',
    claimedQuantity: 5000,
    claimedValue: 8200,
    status: 'Cerrada',
    traceability: {
      opFolio: 'OP-2026-95232',
      lotNumber: 'PT-260818-00199',
      shipmentFolio: 'EMB-2026-0350',
      invoiceNumber: 'FAC-2026-7780',
      productionLine: 'Troqueladora Rotativa Rotoflex',
      operator: 'Raúl Mendoza',
      deliveryDate: '18 Ago 2026',
    },
    qaEvaluation: {
      evaluatedBy: 'Alicia Ramírez',
      evaluationDate: '21 Ago 2026',
      decision: 'Procedente',
      technicalDiagnosis: 'Desgaste en filo de cilindro magnético flexible. Se cambió herramental y se afiló suaje.',
      fourMCause: 'Maquinaria',
    },
    rmaDetails: {
      rmaNumber: 'RMA-2026-009',
      rmaType: 'Retorno y Reemplazo',
      approvalDate: '21 Ago 2026',
      approvedBy: 'Alicia Ramírez',
      carrierName: 'Estafeta',
      trackingGuide: 'EST-991201-SIE',
      receivedAtWarehouse: true,
      receivedDate: '23 Ago 2026',
      physicalQuantityReceived: 5000,
      quarantineLocation: 'Scrap Cuarentena',
      reinspectionResult: 'Defecto Confirmado - Scrap Técnico',
      replacementOpFolio: 'OP-2026-95240',
      resolutionStatus: 'Cerrado',
    },
    resolutionNotes: 'Reposición fabricada en OP-2026-95240 y entregada en tiempo. Lote defectuoso triturado con acta de scrap. Cliente satisfecho.',
    closedDate: '26 Ago 2026',
    closedBy: 'Alicia Ramírez',
    evidences: [
      {
        id: 'ev-06',
        title: 'Foto de rebaba en cilindro flexible',
        fileType: 'IMG',
        uploadDate: '21 Ago 2026',
        uploader: 'Alicia Ramírez',
        notes: 'Microfotografía de rotura de filo en cavidad 4.',
      },
    ],
    auditTrail: [
      {
        id: 'aud-qj-11',
        timestamp: '20 Ago 2026 · 10:00',
        user: 'Germán Soto',
        role: 'Cliente',
        action: 'Apertura de Queja',
        notes: 'Falla de troquel reportada en línea de ensamble.',
      },
      {
        id: 'aud-qj-12',
        timestamp: '26 Ago 2026 · 17:00',
        user: 'Alicia Ramírez',
        role: 'Calidad',
        action: 'Cierre Definitivo',
        notes: 'Cierre con reemplazo entregado y verificado.',
      },
    ],
  },
  {
    id: 'QJ-2026-020',
    date: '07 Sep 2026',
    client: 'Truper Herramientas',
    clientContact: 'Ing. Fernando Morales',
    partNumber: 'ET-TRU-550',
    partDescription: 'Etiqueta Amarilla para Rotomartillo 1/2"',
    defectType: 'Tensión excesiva en embobinado provoca enrollamiento y despegue de liner al desbobinar',
    severity: 'Menor',
    claimedQuantity: 12000,
    claimedValue: 6400,
    status: 'Abierta',
    traceability: {
      opFolio: 'OP-2026-95254',
      lotNumber: 'PT-260907-00360',
      shipmentFolio: 'EMB-2026-0422',
      invoiceNumber: 'FAC-2026-7918',
      productionLine: 'Prensa Mark Andy Scout',
      operator: 'María Ríos',
      deliveryDate: 'Hoy · 09:00',
    },
    evidences: [
      {
        id: 'ev-07',
        title: 'Video corto de desenrollado en máquina etiquetadora Truper',
        fileType: 'VID',
        uploadDate: '07 Sep 2026',
        uploader: 'Fernando Morales (Cliente)',
        notes: 'Se aprecia ondulación en bobina.',
      },
    ],
    auditTrail: [
      {
        id: 'aud-qj-13',
        timestamp: '07 Sep 2026 · 11:30',
        user: 'Atención a Clientes RTM',
        role: 'Ventas',
        action: 'Registro de Caso',
        notes: 'Recepción inicial del reclamo asignada a Calidad para inspección.',
      },
    ],
  },
];

// ----------------------------------------------------
// DATOS DE ANALÍTICA RMA & CUSTOMER QUALITY
// ----------------------------------------------------
export const CUSTOMER_QUALITY_ANALYTICS = {
  kpis: {
    totalComplaints: 6,
    activeComplaints: 3,
    approvedRmas: 3,
    claimAcceptanceRate: '83.3%',
    totalClaimedAmount: '$72,050 MXN',
    totalClaimedUnits: '90,500 pzas',
    averageResolutionDays: 3.8,
  },
  paretoDefects: [
    { defect: 'Código de barras / DataMatrix ilegible', count: 2, percentage: 33.3, cumulative: 33.3, tone: 'text-rose-600' },
    { defect: 'Desprendimiento de adhesivo / Falta de tack', count: 1, percentage: 25.0, cumulative: 58.3, tone: 'text-amber-600' },
    { defect: 'Arte / Texto de advertencia incorrecto', count: 1, percentage: 20.8, cumulative: 79.1, tone: 'text-rose-600' },
    { defect: 'Troquel / Rebaba de corte', count: 1, percentage: 12.5, cumulative: 91.6, tone: 'text-blue-600' },
    { defect: 'Variación de tono / Delta E (improcedente)', count: 1, percentage: 8.4, cumulative: 100.0, tone: 'text-emerald-600' },
  ],
  byClient: [
    { client: 'Panasonic Industrial', count: 1, units: 15000, value: 18500, rmaCount: 1, status: 'Crítico' },
    { client: 'TYCO Electronics', count: 1, units: 20000, value: 26400, rmaCount: 1, status: 'Atención' },
    { client: 'BLACK & DECKER', count: 1, units: 8500, value: 12750, rmaCount: 0, status: 'Crítico' },
    { client: 'Medifarma', count: 1, units: 30000, value: 9800, rmaCount: 0, status: 'Resuelta' },
    { client: 'Siemens Healthcare', count: 1, units: 5000, value: 8200, rmaCount: 1, status: 'Cerrada' },
    { client: 'Truper Herramientas', count: 1, units: 12000, value: 6400, rmaCount: 0, status: 'Abierta' },
  ],
  rmaDispositions: [
    { disposition: 'Retorno y Reemplazo de OP', percentage: 60, count: 2, note: 'Nueva orden urgente en producción' },
    { disposition: 'Retrabajo en Planta', percentage: 20, count: 0, note: 'Reacondicionamiento en acabados' },
    { disposition: 'Scrap Técnico Directo', percentage: 20, count: 1, note: 'Baja con acta de destrucción' },
  ],
};
