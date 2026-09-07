export type ReturnSourceType = 
  | 'Línea de Producción' 
  | 'Planta de Impresión' 
  | 'Cliente' 
  | 'Sucursal' 
  | 'Entrega rechazada' 
  | 'Interna';

export type ReturnReason = 
  | 'Remanente de Bobina'
  | 'Sobrante de Producción'
  | 'Requiere inspección'
  | 'Empaque dañado'
  | 'Producto no conforme'
  | 'Error operativo'
  | 'Producto incorrecto'
  | 'Daño visible'
  | 'Entrega rechazada'
  | 'Cambio solicitado'
  | 'Otro';

export type ReturnUnitCondition = 
  | 'En buen estado' 
  | 'Empaque dañado' 
  | 'Producto dañado' 
  | 'Requiere inspección';

export type ReturnOrderStatus = 
  | 'Pendiente' 
  | 'En recepción' 
  | 'Parcial' 
  | 'Completa' 
  | 'Cancelada' 
  | 'Con incidencia';

export interface ReturnItemRecord {
  id: string;
  uid: string; // Se conserva exactamente igual (ej. BOB-RTM-2026-00041)
  sku: string;
  productName: string;
  brand: string;
  size: string;
  lotNumber: string;
  originalEntryDate: string; // ej. '01 Sep 2026' - nunca se reinicia
  returnDate?: string;
  condition?: ReturnUnitCondition;
  suggestedDestination: string;
  confirmedDestination?: string;
  status: 'Pendiente' | 'Recibida' | 'Cancelada' | 'En retrabajo' | 'Pendiente de acomodo' | 'Con incidencia';
  notes?: string;
}

export interface ReturnTimelineEntry {
  id: string;
  occurredAt: string;
  actor: string;
  message: string;
  type: 'created' | 'scan_unit' | 'condition' | 'destination' | 'completed' | 'canceled' | 'incident';
}

export interface ReturnOrder {
  id: string;
  folio: string; // ej. 'REM-2026-0041' o 'DEV-2026-0021'
  sourceType: ReturnSourceType;
  reference: string; // ej. 'OP-2026-0882', 'OP-2026-0891', 'PED-2026-0410'
  originClientOrBranch: string;
  warehouseId: string;
  warehouseName: string;
  reason: ReturnReason;
  customReason?: string;
  notes?: string;
  createdAt: string;
  receivedAt?: string;
  status: ReturnOrderStatus;
  items: ReturnItemRecord[];
  timeline: ReturnTimelineEntry[];
}

export const INITIAL_RETURN_ORDERS: ReturnOrder[] = [
  // ==========================================
  // ALM-MP (Materia Prima - Nave 1 Reynosa)
  // ==========================================
  // 1. Pendiente · Línea de Producción · Remanente de Bobina BOPP
  {
    id: 'ret-1',
    folio: 'REM-2026-0041',
    sourceType: 'Línea de Producción',
    reference: 'OP-2026-0882',
    originClientOrBranch: 'Línea Flexo 1 (Prensa Nilpeter FB-3300)',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'ALM-MP (Materia Prima - Nave 1 Reynosa)',
    reason: 'Remanente de Bobina',
    notes: 'Bobina flexo surtida con 2,500 m. Consumo real en orden: 1,820 m. Regresa remanente de 680 m conservando lote de origen y calibre.',
    createdAt: '06 Sep 2026, 14:20',
    status: 'Pendiente',
    items: [
      {
        id: 'ri-1',
        uid: 'BOB-RTM-2026-00041',
        sku: 'PEL-BOPP-BLA',
        productName: 'Película BOPP Blanco Brillante 60 mic',
        brand: 'Fasson Avery',
        size: 'Bobina 330mm x 680m (Remanente)',
        lotNumber: 'RTM-MP-260902-011',
        originalEntryDate: '02 Sep 2026',
        suggestedDestination: 'A-A-02',
        status: 'Pendiente',
        notes: 'Requiere actualización de metraje en etiqueta y re-emplayado con plástico protector.',
      },
    ],
    timeline: [
      { id: 't-1-1', occurredAt: '06 Sep 14:20', actor: 'Carlos Medina', message: 'Orden de remanente generada al cierre de tiraje de OP-2026-0882.', type: 'created' },
    ],
  },
  // 2. En recepción · Línea de Impresión Offset · Sobrante de Papel Couché
  {
    id: 'ret-2',
    folio: 'DEV-2026-0032',
    sourceType: 'Línea de Producción',
    reference: 'OP-2026-0891',
    originClientOrBranch: 'Línea Offset (Heidelberg CX 102)',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'ALM-MP (Materia Prima - Nave 1 Reynosa)',
    reason: 'Sobrante de Producción',
    notes: 'Tarima parcial con 1,200 pliegos no impresos que excedieron el tiraje programado. Pliegos en excelente estado listos para reincorporar a rack.',
    createdAt: '06 Sep 2026, 11:30',
    status: 'En recepción',
    items: [
      {
        id: 'ri-2',
        uid: 'TAR-RTM-2026-00102',
        sku: 'PAP-COU-090',
        productName: 'Papel Couché Brillante 90g - 70x100 cm',
        brand: 'Bio-Pappel',
        size: 'Tarima parcial (1,200 pliegos)',
        lotNumber: 'RTM-MP-260901-004',
        originalEntryDate: '01 Sep 2026',
        suggestedDestination: 'A-B-03',
        status: 'Recibida',
        condition: 'En buen estado',
        notes: 'Pliegos alineados y entarimados con fleje.',
      },
    ],
    timeline: [
      { id: 't-2-1', occurredAt: '06 Sep 11:30', actor: 'Carlos Medina', message: 'Recepción iniciada en rampa de comunicación Planta-Almacén.', type: 'created' },
      { id: 't-2-2', occurredAt: '06 Sep 11:45', actor: 'Carlos Medina', message: 'Escaneo validado de UID TAR-RTM-2026-00102.', type: 'scan_unit' },
    ],
  },
  // 3. Con incidencia · Tintas & Químicos · Requiere inspección de viscosidad
  {
    id: 'ret-3',
    folio: 'REM-2026-0045',
    sourceType: 'Planta de Impresión',
    reference: 'OP-2026-0882',
    originClientOrBranch: 'Área de Mezclas y Dosificación de Tintas',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'ALM-MP (Materia Prima - Nave 1 Reynosa)',
    reason: 'Requiere inspección',
    notes: 'Cubeta de tinta recuperada del tintero de la Nilpeter FB-3300. Requiere prueba de viscosidad y filtrado antes de ingresar a rack B-A-02.',
    createdAt: '06 Sep 2026, 12:15',
    status: 'Con incidencia',
    items: [
      {
        id: 'ri-3',
        uid: 'CUB-RTM-2026-00018',
        sku: 'TIN-PAN-186C',
        productName: 'Tinta Gráfica Pantone Red 186 C',
        brand: 'Sun Chemical',
        size: 'Cubeta 3.8 kg (Recuperada)',
        lotNumber: 'RTM-MP-260903-008',
        originalEntryDate: '03 Sep 2026',
        suggestedDestination: 'B-A-02',
        status: 'Con incidencia',
        condition: 'Requiere inspección',
        notes: 'Incidencia QA: Viscosidad fuera de rango normal (+4s Copa Zahn #2). Enviar a ajuste con solvente.',
      },
    ],
    timeline: [
      { id: 't-3-1', occurredAt: '06 Sep 12:15', actor: 'Carlos Medina', message: 'Ingreso registrado en mesa de control.', type: 'created' },
      { id: 't-3-2', occurredAt: '06 Sep 12:30', actor: 'Laboratorio QA', message: 'Reportada desviación de viscosidad en laboratorio.', type: 'incident' },
    ],
  },
  // 4. Completa · Reingreso de Cartulina SBS de Troquelado
  {
    id: 'ret-4',
    folio: 'REM-2026-0038',
    sourceType: 'Línea de Producción',
    reference: 'OP-2026-0904',
    originClientOrBranch: 'Línea Troquel & Barniz (Bobst Novacut)',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'ALM-MP (Materia Prima - Nave 1 Reynosa)',
    reason: 'Sobrante de Producción',
    notes: 'Devolución de 400 hojas de cartulina SBS 14pts sobrantes del proceso de suajado.',
    createdAt: '05 Sep 2026, 16:00',
    receivedAt: '05 Sep 2026, 17:15',
    status: 'Completa',
    items: [
      {
        id: 'ri-4',
        uid: 'TAR-RTM-2026-00151',
        sku: 'CAR-SBS-14P',
        productName: 'Cartulina SBS Calibre 14 pts - 70x95 cm',
        brand: 'Bio-Pappel',
        size: 'Paquete 400 hojas',
        lotNumber: 'RTM-MP-260904-002',
        originalEntryDate: '04 Sep 2026',
        returnDate: '05 Sep 2026',
        condition: 'En buen estado',
        suggestedDestination: 'C-A-01',
        confirmedDestination: 'C-A-01',
        status: 'Pendiente de acomodo',
      },
    ],
    timeline: [
      { id: 't-4-1', occurredAt: '05 Sep 16:00', actor: 'Carlos Medina', message: 'Orden generada.', type: 'created' },
      { id: 't-4-2', occurredAt: '05 Sep 17:15', actor: 'Carlos Medina', message: 'Reingreso verificado y acomodo confirmado en C-A-01.', type: 'completed' },
    ],
  },

  // ==========================================
  // ALM-PT (Producto Terminado - Nave 2 Reynosa)
  // ==========================================
  // 5. Completa · Cliente B2B · Reempaque Farmacéutico
  {
    id: 'ret-5',
    folio: 'DEV-2026-0019',
    sourceType: 'Cliente',
    reference: 'PED-2026-0410',
    originClientOrBranch: 'Laboratorios Medifarma S.A. de C.V.',
    warehouseId: 'wh-mty-sur',
    warehouseName: 'ALM-PT (Producto Terminado - Nave 2 Reynosa)',
    reason: 'Empaque dañado',
    notes: 'Caja exterior aplastada durante maniobra de descarga en planta del cliente. Rollos interiores intactos pero requieren cambio de empaque corrugado secundario.',
    createdAt: '05 Sep 2026, 10:00',
    receivedAt: '05 Sep 2026, 11:30',
    status: 'Completa',
    items: [
      {
        id: 'ri-5',
        uid: 'CJ-RTM-2026-00211',
        sku: 'ETQ-FAR-VIL',
        productName: 'Etiqueta Farmacéutica Vial 10ml - PT',
        brand: 'RTM Packaging',
        size: 'Rollo 5,000 pzas',
        lotNumber: 'RTM-PT-260905-001',
        originalEntryDate: '05 Sep 2026',
        returnDate: '05 Sep 2026',
        condition: 'Empaque dañado',
        suggestedDestination: 'RET-PT-QA',
        confirmedDestination: 'RET-PT-QA',
        status: 'En retrabajo',
        notes: 'Retrabajo de reempaque secundario con nuevo código QR de caja.',
      },
    ],
    timeline: [
      { id: 't-5-1', occurredAt: '05 Sep 10:00', actor: 'Valeria Torres', message: 'Devolución recibida con folio de no conformidad NC-2026-012.', type: 'created' },
      { id: 't-5-2', occurredAt: '05 Sep 11:30', actor: 'Valeria Torres', message: 'Ingresada a mesa de retrabajo y reempaque.', type: 'completed' },
    ],
  },
];

export const ELIGIBLE_RETURN_UNITS_DATABASE = [
  { uid: 'BOB-RTM-2026-00041', sku: 'PEL-BOPP-BLA', productName: 'Película BOPP Blanco Brillante 60 mic', brand: 'Fasson Avery', size: 'Bobina 330mm x 2500m', lotNumber: 'RTM-MP-260902-011', originalEntryDate: '02 Sep 2026', lastKnownDestination: 'Línea Flexo 1 / OP-2026-0882' },
  { uid: 'TAR-RTM-2026-00101', sku: 'PAP-COU-090', productName: 'Papel Couché Brillante 90g - 70x100 cm', brand: 'Bio-Pappel', size: 'Tarima 10,000 pliegos', lotNumber: 'RTM-MP-260901-004', originalEntryDate: '01 Sep 2026', lastKnownDestination: 'Línea Offset / OP-2026-0891' },
  { uid: 'TAR-RTM-2026-00102', sku: 'PAP-COU-090', productName: 'Papel Couché Brillante 90g - 70x100 cm', brand: 'Bio-Pappel', size: 'Tarima 10,000 pliegos', lotNumber: 'RTM-MP-260901-004', originalEntryDate: '01 Sep 2026', lastKnownDestination: 'Línea Offset / OP-2026-0891' },
  { uid: 'CUB-RTM-2026-00018', sku: 'TIN-PAN-186C', productName: 'Tinta Gráfica Pantone Red 186 C', brand: 'Sun Chemical', size: 'Cubeta 5 kg', lotNumber: 'RTM-MP-260903-008', originalEntryDate: '03 Sep 2026', lastKnownDestination: 'Línea Flexo 1' },
  { uid: 'CJ-RTM-2026-00211', sku: 'ETQ-FAR-VIL', productName: 'Etiqueta Farmacéutica Vial 10ml - PT', brand: 'RTM Packaging', size: 'Rollo 5,000 pzas', lotNumber: 'RTM-PT-260905-001', originalEntryDate: '05 Sep 2026', lastKnownDestination: 'Cliente Laboratorios Medifarma' },
  { uid: 'TAR-RTM-2026-00151', sku: 'CAR-SBS-14P', productName: 'Cartulina SBS Calibre 14 pts - 70x95 cm', brand: 'Bio-Pappel', size: 'Tarima 5,000 hojas', lotNumber: 'RTM-MP-260904-002', originalEntryDate: '04 Sep 2026', lastKnownDestination: 'Línea Troquel Bobst' },
];
