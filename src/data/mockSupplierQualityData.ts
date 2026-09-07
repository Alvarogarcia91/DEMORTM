import { SupplierMaster } from './mockSuppliersData';
import { IncomingInspection } from './mockCalidadData';

export type SupplierQualityPeriod = '30d' | '60d' | '90d' | '6m' | '12m';

export type SupplierEvaluationStatus = 'Aprobado' | 'Monitoreo' | 'Condicionado' | 'Bloqueado';

export interface SupplierScorecardItem {
  supplierId: string;
  supplierCode: string;
  supplierName: string;
  category: string;
  qualityScore: number;     // 0-100 (40% weight)
  deliveryScore: number;    // 0-100 (25% weight)
  docsScore: number;        // 0-100 (15% weight)
  responseScore: number;    // 0-100 (20% weight)
  totalScore: number;       // 0-100 calculated
  status: SupplierEvaluationStatus;
  trend: 'up' | 'stable' | 'down';
  trendDiff: number;        // e.g. +2.4 or -1.5 vs previous period
  inspectedLots: number;
  conformingLots: number;
  rejectedLots: number;
  holdLots: number;
  onTimeDeliveriesPct: number;
  openCorrectiveActions: number;
  resolvedCorrectiveActions: number;
  lastAuditDate: string;
  notes?: string;
}

export interface SupplierCorrectiveAction {
  id: string; // ACP-2026-0001
  supplierId: string;
  supplierName: string;
  sourceType: 'Incoming' | 'Auditoría' | 'Producción' | 'Reclamación';
  sourceFolio: string; // e.g. INC-2026-038, MNC-000351
  poFolio?: string;
  material: string;
  lotNumber: string;
  defect: string;
  severity: 'Crítica' | 'Mayor' | 'Menor';
  affectedQty: string;
  evidence: string;
  containment: 'Material en HOLD' | 'Devolución a proveedor' | 'Reposición urgente' | 'Inspección reforzada 100%';
  containmentNotes?: string;
  rootCause?: string;
  proposedAction?: string;
  commitmentDate: string;
  rtmResponsible: string;
  supplierContact: string;
  status: 'Detectada' | 'Enviada al proveedor' | 'Respuesta recibida' | 'En verificación' | 'Cerrada';
  createdAt: string;
  closedAt?: string;
}

export interface SupplierQualitySuggestion {
  id: string;
  type: 'reincidencia' | 'documento' | 'entrega' | 'sobresaliente';
  title: string;
  supplierId: string;
  supplierName: string;
  description: string;
  recommendation: string;
  badgeText: string;
  primaryActionLabel: string;
  primaryActionType: 'open_acp' | 'view_docs' | 'view_pos' | 'view_performance';
  secondaryActionLabel?: string;
  secondaryActionType?: 'view_lots' | 'review_supplier' | 'dismiss';
}

export interface SupplierExecutiveKpis {
  evaluatedSuppliersCount: number;
  evaluatedSuppliersDiff: string;
  inspectedLotsCount: number;
  inspectedLotsDiff: string;
  acceptanceRatePct: number;
  acceptanceRateDiff: string;
  rejectedLotsCount: number;
  rejectedLotsDiff: string;
  onTimeDeliveryPct: number;
  onTimeDeliveryDiff: string;
  openActionsCount: number;
  criticalActionsCount: number;
}

// ---------------------------------------------------------------------------
// DATASET INICIAL DE INSPECCIÓN INCOMING (Calidad & Abastecimiento Compartido)
// ---------------------------------------------------------------------------
export const INITIAL_INCOMING_INSPECTIONS: IncomingInspection[] = [
  // 1. Proveedor Demo BOPP (Caso 4: Condicionado con 2 rechazos por espesor y HOLD)
  {
    id: 'INC-2026-048',
    poFolio: 'OC-2026-1415',
    supplier: 'Proveedor Demo BOPP',
    material: 'Película BOPP Transparente 30 micras (12” x 3,000 m)',
    supplierLot: 'BOPP-260819-01',
    rtmLot: 'MP-260905-019',
    orderedQty: '10 bobinas (30,000 m)',
    receivedQty: '10 bobinas',
    coaAttached: true,
    appearanceConforming: false,
    specConforming: false,
    thicknessMeasured: '34.8 micras (Máx permitida 31.5 micras)',
    status: 'HOLD / Rechazado',
    date: '05 Sep · 14:30',
    auditor: 'Alicia Ramírez',
    notes: 'Espesor fuera de tolerancia (+16% sobre nominal). Desviación crítica que provocaría descalce en prensa Mark Andy. Lote retenido en Cuarentena.',
  },
  {
    id: 'INC-2026-038',
    poFolio: 'OC-2026-1380',
    supplier: 'Proveedor Demo BOPP',
    material: 'Película BOPP Blanco Cavitado 38 micras (10” x 2,500 m)',
    supplierLot: 'BOPP-260714-X3',
    rtmLot: 'MP-260822-004',
    orderedQty: '8 bobinas (20,000 m)',
    receivedQty: '8 bobinas',
    coaAttached: false,
    appearanceConforming: true,
    specConforming: false,
    thicknessMeasured: '43.2 micras (Fuera de rango)',
    status: 'HOLD / Rechazado',
    date: '22 Ago · 09:15',
    auditor: 'Alicia Ramírez',
    notes: 'Falta certificado CoA original de fabricante. Medición micrométrica reporta variación transversal superior a 5 micras.',
  },
  {
    id: 'INC-2026-029',
    poFolio: 'OC-2026-1350',
    supplier: 'Proveedor Demo BOPP',
    material: 'Película BOPP Metalizado Brillante 25 micras',
    supplierLot: 'BOPP-260630-M2',
    rtmLot: 'MP-260710-011',
    orderedQty: '6 bobinas (18,000 m)',
    receivedQty: '6 bobinas',
    coaAttached: true,
    appearanceConforming: true,
    specConforming: true,
    thicknessMeasured: '25.2 micras',
    status: 'Liberado',
    date: '10 Jul · 11:00',
    auditor: 'Alicia Ramírez',
    notes: 'Tensión superficial corona > 40 dinas/cm conforme. Liberado a rack flexo.',
  },

  // 2. Sun Chemical México (Caso 2: Buen proveedor con alerta documental)
  {
    id: 'INC-2026-047',
    poFolio: 'OC-2026-1412',
    supplier: 'Sun Chemical México',
    material: 'Tinta UV Flexo Solarflex Negro Intenso',
    supplierLot: 'SC-2026-99301',
    rtmLot: 'MP-260904-002',
    orderedQty: '10 cubetas (50 kg)',
    receivedQty: '10 cubetas',
    coaAttached: true,
    appearanceConforming: true,
    specConforming: true,
    thicknessMeasured: 'Viscosidad 22s copa Zahn #2 (Conforme)',
    status: 'Liberado',
    date: '04 Sep · 16:10',
    auditor: 'Alicia Ramírez',
    notes: 'Pigmentación homogénea, lote validado vs espectrofotómetro. Liberado para OP-95250.',
  },
  {
    id: 'INC-2026-041',
    poFolio: 'OC-2026-1398',
    supplier: 'Sun Chemical México',
    material: 'Tinta UV Flexo Solarflex Cyan Primario',
    supplierLot: 'SC-2026-99124',
    rtmLot: 'MP-260906-008',
    orderedQty: '8 cubetas (40 kg)',
    receivedQty: '8 cubetas',
    coaAttached: true,
    appearanceConforming: true,
    specConforming: true,
    thicknessMeasured: 'Viscosidad 21s Zahn #2',
    status: 'Liberado',
    date: '06 Sep · 15:20',
    auditor: 'Alicia Ramírez',
    notes: 'Certificado coincide con lote de fabricante. Liberado para cuarto de tintas.',
  },
  {
    id: 'INC-2026-035',
    poFolio: 'OC-2026-1372',
    supplier: 'Sun Chemical México',
    material: 'Barniz UV Ultra Brillo Curado Rápido',
    supplierLot: 'SC-2026-88410',
    rtmLot: 'MP-260814-015',
    orderedQty: '12 cubetas (240 kg)',
    receivedQty: '12 cubetas',
    coaAttached: true,
    appearanceConforming: true,
    specConforming: true,
    thicknessMeasured: 'Densidad 1.08 g/cm³',
    status: 'Liberado',
    date: '14 Ago · 10:45',
    auditor: 'Jorge Márquez',
    notes: 'Excelente reactividad UV y transparencia. Liberado.',
  },
  {
    id: 'INC-2026-049',
    poFolio: 'OC-2026-1420',
    supplier: 'Sun Chemical México',
    material: 'Tinta Process Magenta Offset Súper',
    supplierLot: 'SC-2026-99450',
    rtmLot: 'MP-260907-003',
    orderedQty: '6 latas (30 kg)',
    receivedQty: '6 latas',
    coaAttached: true,
    appearanceConforming: true,
    specConforming: true,
    thicknessMeasured: 'Tack 12.5 @ 1200 RPM',
    status: 'Pendiente',
    date: '07 Sep · 08:30',
    auditor: 'Alicia Ramírez',
    notes: 'Recibido en andén 2. En espera de prueba rápida de tiro en laboratorio de tintas.',
  },

  // 3. Bio-Pappel (Caso 1: Proveedor Sobresaliente, 12 lotes conformes)
  {
    id: 'INC-2026-046',
    poFolio: 'OC-2026-1408',
    supplier: 'Bio-Pappel',
    material: 'Papel Couché 90 g (Pliegos 70x100 cm)',
    supplierLot: 'BPA-2026-PL772',
    rtmLot: 'MP-260902-001',
    orderedQty: '4 tarimas (72,000 pliegos)',
    receivedQty: '4 tarimas',
    coaAttached: true,
    appearanceConforming: true,
    specConforming: true,
    thicknessMeasured: 'Calibre 88.5 µm (Tolerancia ± 2.0 µm)',
    status: 'Liberado',
    date: '02 Sep · 09:30',
    auditor: 'Jorge Márquez',
    notes: 'Humedad 5.2% HR conforme a estándar TAPPI. Tarimas flejadas con plástico impermeable.',
  },
  {
    id: 'INC-2026-040',
    poFolio: 'OC-2026-1392',
    supplier: 'Bio-Pappel',
    material: 'Papel Couché 150 g (Pliegos 70x100 cm)',
    supplierLot: 'BPA-2026-PL640',
    rtmLot: 'MP-260828-009',
    orderedQty: '3 tarimas (36,000 pliegos)',
    receivedQty: '3 tarimas',
    coaAttached: true,
    appearanceConforming: true,
    specConforming: true,
    thicknessMeasured: 'Calibre 146.0 µm',
    status: 'Liberado',
    date: '28 Ago · 11:20',
    auditor: 'Alicia Ramírez',
    notes: 'Blancura 94% ISO y brillo 72%. Calidad premium para folletería de alta gama.',
  },
  {
    id: 'INC-2026-033',
    poFolio: 'OC-2026-1365',
    supplier: 'Bio-Pappel',
    material: 'Cartoncillo Caple Reverso Gris 12 pts',
    supplierLot: 'BPA-2026-CP512',
    rtmLot: 'MP-260806-003',
    orderedQty: '2 tarimas (16,000 pliegos)',
    receivedQty: '2 tarimas',
    coaAttached: true,
    appearanceConforming: true,
    specConforming: true,
    thicknessMeasured: '12.1 pts exactos',
    status: 'Liberado',
    date: '06 Ago · 14:00',
    auditor: 'Jorge Márquez',
    notes: 'Corte a escuadra impecable. Sin esquinas machucadas.',
  },
  {
    id: 'INC-2026-025',
    poFolio: 'OC-2026-1335',
    supplier: 'Bio-Pappel',
    material: 'Papel Couché 90 g (Pliegos 70x100 cm)',
    supplierLot: 'BPA-2026-PL410',
    rtmLot: 'MP-260718-007',
    orderedQty: '5 tarimas (90,000 pliegos)',
    receivedQty: '5 tarimas',
    coaAttached: true,
    appearanceConforming: true,
    specConforming: true,
    thicknessMeasured: 'Calibre 89.2 µm',
    status: 'Liberado',
    date: '18 Jul · 10:15',
    auditor: 'Alicia Ramírez',
    notes: 'Certificado FSC Cadena de Custodia validado.',
  },

  // 4. Copamex (Caso 3: En observación por entregas tardías pero calidad aceptable)
  {
    id: 'INC-2026-044',
    poFolio: 'OC-2026-1405',
    supplier: 'Copamex',
    material: 'Papel Bond 75 g (Pliegos 61x90 cm)',
    supplierLot: 'COP-2026-BND091',
    rtmLot: 'MP-260830-014',
    orderedQty: '4 tarimas (80,000 pliegos)',
    receivedQty: '4 tarimas',
    coaAttached: true,
    appearanceConforming: true,
    specConforming: true,
    thicknessMeasured: 'Calibre 74.8 g/m² (Conforme)',
    status: 'Liberado',
    date: '30 Ago · 17:40',
    auditor: 'Alicia Ramírez',
    notes: 'Calidad de pliego conforme. Nota de recibo: entrega recibida con 3 días de demora vs fecha comprometida.',
  },
  {
    id: 'INC-2026-037',
    poFolio: 'OC-2026-1378',
    supplier: 'Copamex',
    material: 'Papel Bond 75 g (Pliegos 61x90 cm)',
    supplierLot: 'COP-2026-BND044',
    rtmLot: 'MP-260819-006',
    orderedQty: '3 tarimas (60,000 pliegos)',
    receivedQty: '3 tarimas',
    coaAttached: true,
    appearanceConforming: true,
    specConforming: true,
    thicknessMeasured: 'Calibre 75.1 g/m²',
    status: 'Liberado',
    date: '19 Ago · 16:20',
    auditor: 'Jorge Márquez',
    notes: 'Lote aceptado. Embarque reportó retraso en flete carretero (2 días tarde).',
  },
  {
    id: 'INC-2026-030',
    poFolio: 'OC-2026-1355',
    supplier: 'Copamex',
    material: 'Papel Bond 90 g Offset Alto Volumen',
    supplierLot: 'COP-2026-BND012',
    rtmLot: 'MP-260725-008',
    orderedQty: '2 tarimas (32,000 pliegos)',
    receivedQty: '2 tarimas',
    coaAttached: true,
    appearanceConforming: true,
    specConforming: true,
    thicknessMeasured: 'Calibre 89.8 g/m²',
    status: 'Liberado',
    date: '25 Jul · 12:00',
    auditor: 'Alicia Ramírez',
    notes: 'Entrega a tiempo. Sin observaciones técnicas.',
  },

  // 5. Fasson Avery Dennison
  {
    id: 'INC-2026-042',
    poFolio: 'OC-2026-1402',
    supplier: 'Fasson Avery Dennison',
    material: 'BOPP Blanco Brillante Fasson 2.8 mil (10” x 2,500 m)',
    supplierLot: 'AD-78219',
    rtmLot: 'MP-260907-012',
    orderedQty: '12 bobinas (30,000 m)',
    receivedQty: '12 bobinas',
    coaAttached: true,
    appearanceConforming: true,
    specConforming: true,
    thicknessMeasured: '2.82 mil (Tolerancia ± 0.15 mil)',
    status: 'Liberado',
    date: '07 Sep · 11:00',
    auditor: 'Alicia Ramírez',
    notes: 'Adhesivo acrílico permanente S246 conforme a norma FINAT FTM-1. Aprobado para tiraje automotriz Panasonic.',
  },
  {
    id: 'INC-2026-036',
    poFolio: 'OC-2026-1375',
    supplier: 'Fasson Avery Dennison',
    material: 'BOPP Transparente Ultra-Clear 2.0 mil',
    supplierLot: 'AD-77914',
    rtmLot: 'MP-260816-003',
    orderedQty: '8 bobinas (16,000 m)',
    receivedQty: '8 bobinas',
    coaAttached: true,
    appearanceConforming: true,
    specConforming: true,
    thicknessMeasured: '2.01 mil',
    status: 'Liberado',
    date: '16 Ago · 14:15',
    auditor: 'Alicia Ramírez',
    notes: 'Liner de glassine siliconado con desprendimiento parejo. Aprobado.',
  },

  // 6. WestRock México
  {
    id: 'INC-2026-043',
    poFolio: 'OC-2026-1404',
    supplier: 'WestRock México',
    material: 'Cartulina Sulfatada SBS 240 g / 14 pts (Pliegos 70x95 cm)',
    supplierLot: 'WR-2026-SBS980',
    rtmLot: 'MP-260829-001',
    orderedQty: '3 tarimas (24,000 pliegos)',
    receivedQty: '3 tarimas',
    coaAttached: true,
    appearanceConforming: true,
    specConforming: true,
    thicknessMeasured: '14.05 pts',
    status: 'Liberado',
    date: '29 Ago · 09:40',
    auditor: 'Jorge Márquez',
    notes: 'Capa estucada óptima para barniz UV en prensa Ryobi. Aprobado.',
  },

  // 7. Siegwerk
  {
    id: 'INC-2026-045',
    poFolio: 'OC-2026-1406',
    supplier: 'Siegwerk',
    material: 'Tinta Especial Pantone PMS 186 C Roja Flexo',
    supplierLot: 'SW-2026-PMS186-04',
    rtmLot: 'MP-260901-005',
    orderedQty: '4 cubetas (40 kg)',
    receivedQty: '4 cubetas',
    coaAttached: true,
    appearanceConforming: true,
    specConforming: true,
    thicknessMeasured: 'Viscosidad 24s copa Zahn #2',
    status: 'Liberado',
    date: '01 Sep · 15:00',
    auditor: 'Alicia Ramírez',
    notes: 'Tono Delta E = 0.6 vs Master Físico Pantone. Certificado de lote conforme.',
  },

  // 8. Smurfit Kappa
  {
    id: 'INC-2026-039',
    poFolio: 'OC-2026-1385',
    supplier: 'Smurfit Kappa',
    material: 'Cajas Corrugadas 30x20x25 cm Flauta C (Reforzadas)',
    supplierLot: 'SK-2026-BX104',
    rtmLot: 'MP-260825-010',
    orderedQty: '20 paquetes (1,000 pzas)',
    receivedQty: '20 paquetes',
    coaAttached: true,
    appearanceConforming: true,
    specConforming: true,
    thicknessMeasured: 'Resistencia Mullen 32 ECT',
    status: 'Liberado',
    date: '25 Ago · 13:10',
    auditor: 'Jorge Márquez',
    notes: 'Dimensiones y ranurado conforme a plano técnico de empaque.',
  },
];

// ---------------------------------------------------------------------------
// DATASET INICIAL DE ACCIONES CORRECTIVAS DE PROVEEDOR (ACP / SCAR)
// ---------------------------------------------------------------------------
export const INITIAL_SUPPLIER_CORRECTIVE_ACTIONS: SupplierCorrectiveAction[] = [
  {
    id: 'ACP-2026-0008',
    supplierId: 'sup-demo-bopp',
    supplierName: 'Proveedor Demo BOPP',
    sourceType: 'Incoming',
    sourceFolio: 'INC-2026-048',
    poFolio: 'OC-2026-1415',
    material: 'Película BOPP Transparente 30 micras (12” x 3,000 m)',
    lotNumber: 'BOPP-260819-01 (RTM MP-260905-019)',
    defect: 'Espesor fuera de tolerancia (+16% sobre nominal: 34.8 µm vs 30.0 µm ± 1.5 µm)',
    severity: 'Crítica',
    affectedQty: '10 bobinas (30,000 m lineales)',
    evidence: 'Reporte micrométrico en 5 puntos de bobina y fotografía de calibre digital con testigo de calibración.',
    containment: 'Material en HOLD',
    containmentNotes: 'Lote 100% segregado con etiquetas rojas de Cuarentena en andén de recibo.',
    rootCause: 'Descalibración en labio de extrusión de cabezal plano en línea 2 de la planta del proveedor durante cambio de resina.',
    proposedAction: 'Ajuste de matriz térmica en dado de extrusión e implementación de sensor de perfil de espesor beta-ray automático.',
    commitmentDate: '18 Sep 2026',
    rtmResponsible: 'Alicia Ramírez (Aseguramiento de Calidad)',
    supplierContact: 'Ing. Carlos Mendoza (Jefe de Calidad Proveedor)',
    status: 'Respuesta recibida',
    createdAt: '05 Sep 2026 · 16:00',
  },
  {
    id: 'ACP-2026-0005',
    supplierId: 'sup-copamex',
    supplierName: 'Copamex',
    sourceType: 'Producción',
    sourceFolio: 'MNC-000320',
    poFolio: 'OC-2026-1355',
    material: 'Papel Bond 75 g (Pliegos 61x90 cm)',
    lotNumber: 'COP-2026-BND012',
    defect: 'Humedad relativa variable en paquete interior provocando ondulación en cabezal de entrada Offset',
    severity: 'Mayor',
    affectedQty: '2 tarimas (32,000 pliegos)',
    evidence: 'Lectura higrométrica de espada en paquete: 68% HR vs estándar 45-52% HR.',
    containment: 'Inspección reforzada 100%',
    containmentNotes: 'Aclimatación de 48 horas en cuarto de prensas antes de alimentación a máquina.',
    rootCause: 'Empaque de polietileno con sello térmico insuficiente en una de las esquinas del pallet.',
    proposedAction: 'Refuerzo de sellado doble de película termoencogible y control de humedad en bodega de producto terminado.',
    commitmentDate: '15 Ago 2026',
    rtmResponsible: 'Jorge Márquez (Calidad Offset)',
    supplierContact: 'Ing. Rodrigo Salinas (Gerente de Planta)',
    status: 'Cerrada',
    createdAt: '28 Jul 2026 · 11:30',
    closedAt: '16 Ago 2026 · 10:00',
  },
  {
    id: 'ACP-2026-0003',
    supplierId: 'sup-demo-bopp',
    supplierName: 'Proveedor Demo BOPP',
    sourceType: 'Incoming',
    sourceFolio: 'INC-2026-038',
    poFolio: 'OC-2026-1380',
    material: 'Película BOPP Blanco Cavitado 38 micras',
    lotNumber: 'BOPP-260714-X3 (RTM MP-260822-004)',
    defect: 'Falta de certificado CoA y variación transversal de calibre en rollo matriz',
    severity: 'Mayor',
    affectedQty: '8 bobinas (20,000 m lineales)',
    evidence: 'Acta de recibo sin CoA firmado y lecturas mecánicas dispersas.',
    containment: 'Devolución a proveedor',
    containmentNotes: 'Lote devuelto físicamente con guía de transporte TMM-94821.',
    rootCause: 'Omisión en despacho de laboratorio de calidad y desajuste de bobinadora central.',
    proposedAction: 'Procedimiento de bloqueo de factura previa a validación de CoA firmado por responsable de calidad.',
    commitmentDate: '30 Ago 2026',
    rtmResponsible: 'Alicia Ramírez (Calidad)',
    supplierContact: 'Lic. Miriam Soto (Servicio al Cliente)',
    status: 'En verificación',
    createdAt: '22 Ago 2026 · 14:00',
  },
];

// ---------------------------------------------------------------------------
// SUGERENCIAS DEL SISTEMA (Morado Nexora · Inteligencia de Reglas de Negocio)
// ---------------------------------------------------------------------------
export const INITIAL_SUPPLIER_SUGGESTIONS: SupplierQualitySuggestion[] = [
  {
    id: 'sug-prov-01',
    type: 'reincidencia',
    title: 'Reincidencia de calidad crítica en sustrato',
    supplierId: 'sup-demo-bopp',
    supplierName: 'Proveedor Demo BOPP',
    description: '2 lotes rechazados en los últimos 60 días (INC-048 e INC-038) por espesor fuera de tolerancia.',
    recommendation: 'Recomendación del sistema: emitir Acción Correctiva de Proveedor (ACP) obligatoria y aumentar frecuencia de inspección Incoming a 100% de bobinas.',
    badgeText: 'Alerta de Calidad',
    primaryActionLabel: 'Abrir Acción Correctiva',
    primaryActionType: 'open_acp',
    secondaryActionLabel: 'Ver Lotes Afectados',
    secondaryActionType: 'view_lots',
  },
  {
    id: 'sug-prov-02',
    type: 'documento',
    title: 'Certificado de Calidad ISO / CoA por vencer',
    supplierId: 'sup-sunchem',
    supplierName: 'Sun Chemical México',
    description: 'La certificación de calidad y constancia técnica anual expira en menos de 20 días.',
    recommendation: 'Recomendación: solicitar renovación de documentación para mantener estatus de Proveedor Aprobado sin interrupción en órdenes de compra.',
    badgeText: 'Trámite Documental',
    primaryActionLabel: 'Ver Documento',
    primaryActionType: 'view_docs',
    secondaryActionLabel: 'Revisar Proveedor',
    secondaryActionType: 'review_supplier',
  },
  {
    id: 'sug-prov-03',
    type: 'entrega',
    title: 'Riesgo de entrega para producción prioritaria',
    supplierId: 'sup-copamex',
    supplierName: 'Copamex',
    description: '2 entregas tardías en los últimos 45 días (+2.5 días promedio de desviación). La próxima OC abastece una OP crítica.',
    recommendation: 'Recomendación: confirmar ventana de despacho con ejecutivo de cuenta o activar stock de contingencia en almacén.',
    badgeText: 'Riesgo de Cadena',
    primaryActionLabel: 'Ver Órdenes de Compra',
    primaryActionType: 'view_pos',
    secondaryActionLabel: 'Ver Historial',
    secondaryActionType: 'review_supplier',
  },
  {
    id: 'sug-prov-04',
    type: 'sobresaliente',
    title: 'Proveedor de Desempeño Sobresaliente',
    supplierId: 'sup-biopappel',
    supplierName: 'Bio-Pappel',
    description: '12 lotes consecutivos 100% conformes y 96.5% de entregas a tiempo en el trimestre evaluado.',
    recommendation: 'Sugerencia: considerar reducción en intensidad de inspección de recibo (Skip-Lot) para sustratos estándar de bajo riesgo.',
    badgeText: 'Desempeño Alto',
    primaryActionLabel: 'Ver Desempeño',
    primaryActionType: 'view_performance',
  },
];

// ---------------------------------------------------------------------------
// CÁLCULO DINÁMICO DE SCORECARD Y KPIS EJECUTIVOS
// ---------------------------------------------------------------------------
export function calculateSupplierScorecard(
  suppliers: SupplierMaster[],
  incomings: IncomingInspection[],
  correctiveActions: SupplierCorrectiveAction[],
  period: SupplierQualityPeriod = '90d'
): {
  scorecards: SupplierScorecardItem[];
  kpis: SupplierExecutiveKpis;
  paretoRejections: { name: string; rejectedQty: number; count: number }[];
  rejectionCauses: { cause: string; count: number; percentage: number }[];
} {
  // Factores demo por periodo
  const periodMultiplier = period === '30d' ? 0.35 : period === '60d' ? 0.7 : period === '90d' ? 1.0 : period === '6m' ? 1.8 : 3.0;

  const scorecards: SupplierScorecardItem[] = suppliers.map((sup) => {
    const supIncomings = incomings.filter(
      (inc) => inc.supplier.toLowerCase().includes(sup.tradeName.toLowerCase()) ||
               sup.tradeName.toLowerCase().includes(inc.supplier.toLowerCase()) ||
               (sup.id === 'sup-demo-bopp' && inc.supplier.includes('Demo BOPP'))
    );

    const inspectedLots = Math.max(1, Math.round((supIncomings.length || 2) * periodMultiplier));
    const rejectedIncomings = supIncomings.filter((i) => i.status === 'HOLD / Rechazado');
    const rejectedLots = Math.round(rejectedIncomings.length * (period === '30d' ? 0.5 : 1.0));
    const conformingLots = Math.max(0, inspectedLots - rejectedLots);

    // Dimensiones según especificación:
    // 1. Calidad: 40%
    let qualityScore = 95;
    if (sup.id === 'sup-demo-bopp') {
      qualityScore = 72;
    } else if (sup.id === 'sup-copamex') {
      qualityScore = 90;
    } else if (sup.id === 'sup-biopappel') {
      qualityScore = 98;
    } else if (sup.id === 'sup-sunchem') {
      qualityScore = 94;
    } else if (inspectedLots > 0) {
      qualityScore = Math.round((conformingLots / inspectedLots) * 100);
    }

    // 2. Entrega: 25%
    let deliveryScore = 92;
    if (sup.id === 'sup-copamex') {
      deliveryScore = 86; // 2 retrasos
    } else if (sup.id === 'sup-demo-bopp') {
      deliveryScore = 84;
    } else if (sup.id === 'sup-biopappel') {
      deliveryScore = 97;
    } else if (sup.id === 'sup-sunchem') {
      deliveryScore = 95;
    }

    // 3. Documentación: 15%
    let docsScore = 95;
    if (sup.id === 'sup-demo-bopp') {
      docsScore = 78; // Lote sin CoA
    } else if (sup.id === 'sup-sunchem') {
      docsScore = 92; // Alerta documental
    } else if (sup.id === 'sup-biopappel') {
      docsScore = 100;
    }

    // 4. Respuesta / ACP: 20%
    const openAcps = correctiveActions.filter((a) => a.supplierId === sup.id && a.status !== 'Cerrada').length;
    const resolvedAcps = correctiveActions.filter((a) => a.supplierId === sup.id && a.status === 'Cerrada').length;
    let responseScore = 92;
    if (openAcps > 1) {
      responseScore = 70;
    } else if (openAcps === 1) {
      responseScore = 80;
    } else if (resolvedAcps > 0) {
      responseScore = 96;
    } else if (sup.id === 'sup-biopappel') {
      responseScore = 98;
    }

    // Score total ponderado
    const totalScore = Math.round(
      qualityScore * 0.40 +
      deliveryScore * 0.25 +
      docsScore * 0.15 +
      responseScore * 0.20
    );

    // Estado según regla doc
    let status: SupplierEvaluationStatus = 'Aprobado';
    if (totalScore < 70) status = 'Bloqueado';
    else if (totalScore < 80) status = 'Condicionado';
    else if (totalScore < 90) status = 'Monitoreo';

    // Tendencia
    let trend: 'up' | 'stable' | 'down' = 'stable';
    let trendDiff = 0.5;
    if (sup.id === 'sup-biopappel' || sup.id === 'sup-sunchem') {
      trend = 'up';
      trendDiff = sup.id === 'sup-biopappel' ? 2.4 : 1.2;
    } else if (sup.id === 'sup-demo-bopp' || sup.id === 'sup-copamex') {
      trend = 'down';
      trendDiff = sup.id === 'sup-demo-bopp' ? -4.5 : -1.8;
    }

    let category = 'Materia Prima';
    if (sup.tradeName.includes('Sun') || sup.tradeName.includes('Siegwerk')) category = 'Tintas & Barnices';
    else if (sup.tradeName.includes('Bio') || sup.tradeName.includes('Copamex')) category = 'Papel & Cartón';
    else if (sup.tradeName.includes('BOPP') || sup.tradeName.includes('Fasson') || sup.tradeName.includes('Avery')) category = 'Películas & Autoadheribles';
    else if (sup.tradeName.includes('Smurfit') || sup.tradeName.includes('WestRock')) category = 'Empaque & Cartulinas';

    return {
      supplierId: sup.id,
      supplierCode: sup.code || 'PROV-RTM',
      supplierName: sup.tradeName,
      category,
      qualityScore,
      deliveryScore,
      docsScore,
      responseScore,
      totalScore,
      status,
      trend,
      trendDiff,
      inspectedLots,
      conformingLots,
      rejectedLots,
      holdLots: rejectedLots > 0 ? 1 : 0,
      onTimeDeliveriesPct: deliveryScore,
      openCorrectiveActions: openAcps,
      resolvedCorrectiveActions: resolvedAcps,
      lastAuditDate: '07 Sep 2026',
    };
  });

  // Ordenar por score descendente
  scorecards.sort((a, b) => b.totalScore - a.totalScore);

  // Calcular KPIs Ejecutivos
  const totalInspected = scorecards.reduce((acc, s) => acc + s.inspectedLots, 0);
  const totalRejected = scorecards.reduce((acc, s) => acc + s.rejectedLots, 0);
  const avgAcceptance = totalInspected > 0 ? +(((totalInspected - totalRejected) / totalInspected) * 100).toFixed(1) : 95.0;
  const avgOtd = +(scorecards.reduce((acc, s) => acc + s.onTimeDeliveriesPct, 0) / (scorecards.length || 1)).toFixed(1);
  const totalOpenActions = scorecards.reduce((acc, s) => acc + s.openCorrectiveActions, 0);

  const kpis: SupplierExecutiveKpis = {
    evaluatedSuppliersCount: scorecards.length,
    evaluatedSuppliersDiff: '↑ +1 vs periodo ant.',
    inspectedLotsCount: totalInspected,
    inspectedLotsDiff: '↑ +8 vs periodo ant.',
    acceptanceRatePct: avgAcceptance,
    acceptanceRateDiff: '↑ +1.8 pts vs periodo ant.',
    rejectedLotsCount: totalRejected,
    rejectedLotsDiff: '↓ -1 vs periodo ant.',
    onTimeDeliveryPct: avgOtd,
    onTimeDeliveryDiff: '↑ +1.2 pts vs periodo ant.',
    openActionsCount: totalOpenActions,
    criticalActionsCount: correctiveActions.filter((a) => a.severity === 'Crítica' && a.status !== 'Cerrada').length,
  };

  // Pareto de rechazo
  const paretoRejections = [
    { name: 'Proveedor Demo BOPP', rejectedQty: 50000, count: 2 },
    { name: 'Copamex', rejectedQty: 8000, count: 1 },
    { name: 'Otros proveedores', rejectedQty: 2500, count: 1 },
  ];

  // Motivos de rechazo
  const rejectionCauses = [
    { cause: 'Espesor fuera de tolerancia', count: 2, percentage: 50 },
    { cause: 'Certificado CoA faltante', count: 1, percentage: 25 },
    { cause: 'Variación de calibre en pliego', count: 1, percentage: 25 },
  ];

  return {
    scorecards,
    kpis,
    paretoRejections,
    rejectionCauses,
  };
}
