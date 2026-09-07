export type OutboundVerificationStatus = 
  | 'Pendiente' 
  | 'En validación' 
  | 'Lista para carga' 
  | 'Con diferencia' 
  | 'Cancelada';

export interface StagingLane {
  code: string; // ej. 'EMB-01'
  name: string;
  warehouseId: string;
  status: 'Disponible' | 'Ocupado' | 'Reservado';
  isSuggested?: boolean;
  suggestionReason?: string;
  currentAssignedOrderFolio?: string;
}

export interface PendingOutboundPickOrder {
  id: string;
  folio: string; // ej. 'OR-2026-0118'
  referenceFolio: string; // ej. 'OTP-2026-0044'
  type: 'Orden de Traspaso' | 'Pedido de Cliente' | 'Surtido Interno';
  warehouseId: string;
  warehouseName: string;
  destinationName: string;
  articlesCount: number;
  totalUnits: number;
  assignedLane?: string;
  priority: 'Alta' | 'Urgente' | 'Normal';
  completedPickingAt: string;
  stagingLocation: string; // ej. 'STG-OUT-01'
  status: 'Pendiente de validación' | 'En validación';
  itemsSummary: {
    sku: string;
    productName: string;
    brand: string;
    size: string;
    quantity: number;
  }[];
  expectedUids: {
    uid: string;
    sku: string;
    productName: string;
    brand: string;
    size: string;
    lotNumber: string;
  }[];
}

export interface OutboundVerificationItem {
  id: string;
  uid: string;
  sku: string;
  productName: string;
  brand: string;
  size: string;
  lotNumber: string;
  isValidated: boolean;
  validatedAt?: string;
  substitutedFromUid?: string;
  notes?: string;
}

export interface OutboundArticleSummary {
  sku: string;
  productName: string;
  brand: string;
  size: string;
  expectedUnits: number;
  validatedUnits: number;
}

export interface OutboundVerificationOrder {
  id: string;
  folio: string; // ej. 'VS-2026-0041'
  pickOrderFolio: string; // ej. 'OR-2026-0118'
  referenceFolio: string; // ej. 'OTP-2026-0044'
  type: 'Orden de Traspaso' | 'Pedido de Cliente' | 'Surtido Interno';
  warehouseId: string;
  warehouseName: string;
  destinationName: string;
  assignedLane: string; // ej. 'EMB-03'
  priority: 'Alta' | 'Urgente' | 'Normal';
  status: OutboundVerificationStatus;
  createdAt: string;
  completedAt?: string;
  operatorAssigned: string;
  totalUnits: number;
  validatedUnits: number;
  stagingLocation: string; // ej. 'STG-OUT-01'
  articleSummaries: OutboundArticleSummary[];
  items: OutboundVerificationItem[];
  differenceLog?: {
    type: 'Faltante' | 'UID incorrecta' | 'Unidad adicional' | 'Etiqueta ilegible' | 'Daño físico' | 'Diferencia serial con cantidad correcta';
    notes: string;
    registeredAt: string;
    registeredBy: string;
  };
  cancellationLog?: {
    reason: string;
    cancelledAt: string;
    cancelledBy: string;
  };
}

export const CEDIS_STAGING_LANES: Record<string, StagingLane[]> = {
  'wh-mty-norte': [
    { code: 'EMB-01', name: 'Carril de Embarque 01', warehouseId: 'wh-mty-norte', status: 'Ocupado', currentAssignedOrderFolio: 'VS-2026-0040' },
    { code: 'EMB-02', name: 'Carril de Embarque 02', warehouseId: 'wh-mty-norte', status: 'Disponible' },
    { code: 'EMB-03', name: 'Carril de Embarque 03', warehouseId: 'wh-mty-norte', status: 'Ocupado', currentAssignedOrderFolio: 'VS-2026-0041', isSuggested: true, suggestionReason: 'Disponible y próximo a la ventana de salida planeada.' },
    { code: 'EMB-04', name: 'Carril de Embarque 04', warehouseId: 'wh-mty-norte', status: 'Reservado' },
    { code: 'EMB-05', name: 'Carril de Embarque 05', warehouseId: 'wh-mty-norte', status: 'Disponible' },
  ],
  'wh-mty-sur': [
    { code: 'EMB-01', name: 'Carril de Embarque 01', warehouseId: 'wh-mty-sur', status: 'Ocupado', currentAssignedOrderFolio: 'VS-2026-0043', isSuggested: true, suggestionReason: 'Carril principal habilitado.' },
    { code: 'EMB-02', name: 'Carril de Embarque 02', warehouseId: 'wh-mty-sur', status: 'Disponible' },
    { code: 'EMB-03', name: 'Carril de Embarque 03', warehouseId: 'wh-mty-sur', status: 'Ocupado', currentAssignedOrderFolio: 'VS-2026-0045' },
  ],
};

export const INITIAL_PENDING_OUTBOUND_ORDERS: PendingOutboundPickOrder[] = [
  // 1. CEDIS Norte - Traspaso Valle Oriente
  {
    id: 'pend-out-1',
    folio: 'OR-2026-0118',
    referenceFolio: 'OTP-2026-0044',
    type: 'Orden de Traspaso',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'CEDIS Monterrey Norte',
    destinationName: 'Sucursal Valle Oriente',
    articlesCount: 3,
    totalUnits: 6,
    assignedLane: 'EMB-03',
    priority: 'Alta',
    completedPickingAt: '27 Ago 2026 12:15',
    stagingLocation: 'STG-OUT-01',
    status: 'Pendiente de validación',
    itemsSummary: [
      { sku: 'SC-NAYT-FLOW-IND', productName: 'Nayt Colchón Flow Basic White Individual', brand: 'Nayt', size: 'Individual', quantity: 2 },
      { sku: 'SC-NAYT-FLOW-MAT', productName: 'Nayt Colchón Flow Basic White Matrimonial', brand: 'Nayt', size: 'Matrimonial', quantity: 2 },
      { sku: 'SC-SPA-REC-IND', productName: 'Spring Air Colchón Record Individual', brand: 'Spring Air', size: 'Individual', quantity: 2 },
    ],
    expectedUids: [
      { uid: 'SC-UID-2026-000101', sku: 'SC-NAYT-FLOW-IND', productName: 'Nayt Colchón Flow Basic White Individual', brand: 'Nayt', size: 'Individual', lotNumber: 'LOTE-2026-W31' },
      { uid: 'SC-UID-2026-000102', sku: 'SC-NAYT-FLOW-IND', productName: 'Nayt Colchón Flow Basic White Individual', brand: 'Nayt', size: 'Individual', lotNumber: 'LOTE-2026-W31' },
      { uid: 'SC-UID-2026-000184', sku: 'SC-NAYT-FLOW-MAT', productName: 'Nayt Colchón Flow Basic White Matrimonial', brand: 'Nayt', size: 'Matrimonial', lotNumber: 'LOTE-2026-W34' },
      { uid: 'SC-UID-2026-000185', sku: 'SC-NAYT-FLOW-MAT', productName: 'Nayt Colchón Flow Basic White Matrimonial', brand: 'Nayt', size: 'Matrimonial', lotNumber: 'LOTE-2026-W34' },
      { uid: 'SC-UID-2026-000121', sku: 'SC-SPA-REC-IND', productName: 'Spring Air Colchón Record Individual', brand: 'Spring Air', size: 'Individual', lotNumber: 'LOTE-2026-W32' },
      { uid: 'SC-UID-2026-000122', sku: 'SC-SPA-REC-IND', productName: 'Spring Air Colchón Record Individual', brand: 'Spring Air', size: 'Individual', lotNumber: 'LOTE-2026-W32' },
    ],
  },
  // 2. CEDIS Norte - Pedido Hotel Boutique Las Lomas
  {
    id: 'pend-out-2',
    folio: 'OR-2026-0121',
    referenceFolio: 'PED-2026-0184',
    type: 'Pedido de Cliente',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'CEDIS Monterrey Norte',
    destinationName: 'Hotel Boutique Las Lomas S.A. de C.V.',
    articlesCount: 2,
    totalUnits: 4,
    assignedLane: 'EMB-02',
    priority: 'Urgente',
    completedPickingAt: '27 Ago 2026 13:40',
    stagingLocation: 'STG-OUT-01',
    status: 'Pendiente de validación',
    itemsSummary: [
      { sku: 'SC-REST-ORTO-MAT', productName: 'Restonic Colchón Ortopedic Matrimonial', brand: 'Restonic', size: 'Matrimonial', quantity: 2 },
      { sku: 'SC-REST-ORTO-KS', productName: 'Restonic Colchón Ortopedic King Size', brand: 'Restonic', size: 'King Size', quantity: 2 },
    ],
    expectedUids: [
      { uid: 'SC-UID-2026-000211', sku: 'SC-REST-ORTO-MAT', productName: 'Restonic Colchón Ortopedic Matrimonial', brand: 'Restonic', size: 'Matrimonial', lotNumber: 'LOTE-2026-W33' },
      { uid: 'SC-UID-2026-000212', sku: 'SC-REST-ORTO-MAT', productName: 'Restonic Colchón Ortopedic Matrimonial', brand: 'Restonic', size: 'Matrimonial', lotNumber: 'LOTE-2026-W33' },
      { uid: 'SC-UID-2026-000244', sku: 'SC-REST-ORTO-KS', productName: 'Restonic Colchón Ortopedic King Size', brand: 'Restonic', size: 'King Size', lotNumber: 'LOTE-2026-W34' },
      { uid: 'SC-UID-2026-000245', sku: 'SC-REST-ORTO-KS', productName: 'Restonic Colchón Ortopedic King Size', brand: 'Restonic', size: 'King Size', lotNumber: 'LOTE-2026-W34' },
    ],
  },
  // 3. CEDIS Sur - Traspaso Cumbres
  {
    id: 'pend-out-3',
    folio: 'OR-2026-0125',
    referenceFolio: 'OTP-2026-0048',
    type: 'Orden de Traspaso',
    warehouseId: 'wh-mty-sur',
    warehouseName: 'CEDIS Monterrey Sur',
    destinationName: 'Sucursal Cumbres',
    articlesCount: 2,
    totalUnits: 4,
    assignedLane: 'EMB-01',
    priority: 'Alta',
    completedPickingAt: '27 Ago 2026 12:45',
    stagingLocation: 'STG-OUT-02',
    status: 'Pendiente de validación',
    itemsSummary: [
      { sku: 'SC-REST-ORTO-MAT', productName: 'Restonic Colchón Ortopedic Matrimonial', brand: 'Restonic', size: 'Matrimonial', quantity: 2 },
      { sku: 'SC-SEA-CLB-KS', productName: 'Sealy Colchón Celebration Plus King Size', brand: 'Sealy', size: 'King Size', quantity: 2 },
    ],
    expectedUids: [
      { uid: 'SC-UID-2026-000135', sku: 'SC-REST-ORTO-MAT', productName: 'Restonic Colchón Ortopedic Matrimonial', brand: 'Restonic', size: 'Matrimonial', lotNumber: 'LOTE-2026-W33' },
      { uid: 'SC-UID-2026-000136', sku: 'SC-REST-ORTO-MAT', productName: 'Restonic Colchón Ortopedic Matrimonial', brand: 'Restonic', size: 'Matrimonial', lotNumber: 'LOTE-2026-W33' },
      { uid: 'SC-UID-2026-000301', sku: 'SC-SEA-CLB-KS', productName: 'Sealy Colchón Celebration Plus King Size', brand: 'Sealy', size: 'King Size', lotNumber: 'LOTE-2026-W35' },
      { uid: 'SC-UID-2026-000302', sku: 'SC-SEA-CLB-KS', productName: 'Sealy Colchón Celebration Plus King Size', brand: 'Sealy', size: 'King Size', lotNumber: 'LOTE-2026-W35' },
    ],
  },
  // 4. CEDIS Sur - Pedido Particular Santiago
  {
    id: 'pend-out-4',
    folio: 'OR-2026-0128',
    referenceFolio: 'PED-2026-0186',
    type: 'Pedido de Cliente',
    warehouseId: 'wh-mty-sur',
    warehouseName: 'CEDIS Monterrey Sur',
    destinationName: 'Roberto Cantú Garza (Ruta Santiago)',
    articlesCount: 2,
    totalUnits: 3,
    assignedLane: 'EMB-02',
    priority: 'Normal',
    completedPickingAt: '27 Ago 2026 14:10',
    stagingLocation: 'STG-OUT-02',
    status: 'Pendiente de validación',
    itemsSummary: [
      { sku: 'SC-SPA-REC-KS', productName: 'Spring Air Colchón Record King Size', brand: 'Spring Air', size: 'King Size', quantity: 1 },
      { sku: 'SC-REST-ORTO-MAT', productName: 'Restonic Colchón Ortopedic Matrimonial', brand: 'Restonic', size: 'Matrimonial', quantity: 2 },
    ],
    expectedUids: [
      { uid: 'SC-UID-2026-000137', sku: 'SC-SPA-REC-KS', productName: 'Spring Air Colchón Record King Size', brand: 'Spring Air', size: 'King Size', lotNumber: 'LOTE-2026-W34' },
      { uid: 'SC-UID-2026-000138', sku: 'SC-REST-ORTO-MAT', productName: 'Restonic Colchón Ortopedic Matrimonial', brand: 'Restonic', size: 'Matrimonial', lotNumber: 'LOTE-2026-W33' },
      { uid: 'SC-UID-2026-000139', sku: 'SC-REST-ORTO-MAT', productName: 'Restonic Colchón Ortopedic Matrimonial', brand: 'Restonic', size: 'Matrimonial', lotNumber: 'LOTE-2026-W33' },
    ],
  },
];

export const INITIAL_OUTBOUND_VERIFICATION_ORDERS: OutboundVerificationOrder[] = [
  // ==========================================
  // CEDIS MONTERREY NORTE
  // ==========================================
  // 1. En validación (Carril EMB-03, 4 de 6 validadas)
  {
    id: 'vs-1',
    folio: 'VS-2026-0041',
    pickOrderFolio: 'OR-2026-0118',
    referenceFolio: 'OTP-2026-0044',
    type: 'Orden de Traspaso',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'CEDIS Monterrey Norte',
    destinationName: 'Sucursal Valle Oriente',
    assignedLane: 'EMB-03',
    priority: 'Alta',
    status: 'En validación',
    createdAt: '27 Ago 2026 12:30',
    operatorAssigned: 'Carlos Medina (Operador Mesa 01)',
    totalUnits: 6,
    validatedUnits: 4,
    stagingLocation: 'STG-OUT-01',
    articleSummaries: [
      { sku: 'SC-NAYT-FLOW-IND', productName: 'Nayt Colchón Flow Basic White Individual', brand: 'Nayt', size: 'Individual', expectedUnits: 2, validatedUnits: 2 },
      { sku: 'SC-NAYT-FLOW-MAT', productName: 'Nayt Colchón Flow Basic White Matrimonial', brand: 'Nayt', size: 'Matrimonial', expectedUnits: 2, validatedUnits: 2 },
      { sku: 'SC-SPA-REC-IND', productName: 'Spring Air Colchón Record Individual', brand: 'Spring Air', size: 'Individual', expectedUnits: 2, validatedUnits: 0 },
    ],
    items: [
      { id: 'v-it-1', uid: 'SC-UID-2026-000101', sku: 'SC-NAYT-FLOW-IND', productName: 'Nayt Colchón Flow Basic White Individual', brand: 'Nayt', size: 'Individual', lotNumber: 'LOTE-2026-W31', isValidated: true, validatedAt: '27 Ago 12:35' },
      { id: 'v-it-2', uid: 'SC-UID-2026-000102', sku: 'SC-NAYT-FLOW-IND', productName: 'Nayt Colchón Flow Basic White Individual', brand: 'Nayt', size: 'Individual', lotNumber: 'LOTE-2026-W31', isValidated: true, validatedAt: '27 Ago 12:38' },
      { id: 'v-it-3', uid: 'SC-UID-2026-000184', sku: 'SC-NAYT-FLOW-MAT', productName: 'Nayt Colchón Flow Basic White Matrimonial', brand: 'Nayt', size: 'Matrimonial', lotNumber: 'LOTE-2026-W34', isValidated: true, validatedAt: '27 Ago 12:42' },
      { id: 'v-it-4', uid: 'SC-UID-2026-000185', sku: 'SC-NAYT-FLOW-MAT', productName: 'Nayt Colchón Flow Basic White Matrimonial', brand: 'Nayt', size: 'Matrimonial', lotNumber: 'LOTE-2026-W34', isValidated: true, validatedAt: '27 Ago 12:45' },
      { id: 'v-it-5', uid: 'SC-UID-2026-000121', sku: 'SC-SPA-REC-IND', productName: 'Spring Air Colchón Record Individual', brand: 'Spring Air', size: 'Individual', lotNumber: 'LOTE-2026-W32', isValidated: false },
      { id: 'v-it-6', uid: 'SC-UID-2026-000122', sku: 'SC-SPA-REC-IND', productName: 'Spring Air Colchón Record Individual', brand: 'Spring Air', size: 'Individual', lotNumber: 'LOTE-2026-W32', isValidated: false },
    ],
  },
  // 2. Lista para carga (100% validada)
  {
    id: 'vs-3',
    folio: 'VS-2026-0039',
    pickOrderFolio: 'OR-2026-0115',
    referenceFolio: 'OTP-2026-0044',
    type: 'Orden de Traspaso',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'CEDIS Monterrey Norte',
    destinationName: 'Sucursal Valle Oriente',
    assignedLane: 'EMB-01',
    priority: 'Normal',
    status: 'Lista para carga',
    createdAt: '26 Ago 2026 16:00',
    completedAt: '26 Ago 2026 16:25',
    operatorAssigned: 'Carlos Medina (Operador Mesa 01)',
    totalUnits: 4,
    validatedUnits: 4,
    stagingLocation: 'STG-OUT-01',
    articleSummaries: [
      { sku: 'SC-SPA-REC-IND', productName: 'Spring Air Colchón Record Individual', brand: 'Spring Air', size: 'Individual', expectedUnits: 4, validatedUnits: 4 },
    ],
    items: [
      { id: 'v-it-3-1', uid: 'SC-UID-2026-000151', sku: 'SC-SPA-REC-IND', productName: 'Spring Air Colchón Record Individual', brand: 'Spring Air', size: 'Individual', lotNumber: 'LOTE-2026-W33', isValidated: true, validatedAt: '26 Ago 16:05' },
      { id: 'v-it-3-2', uid: 'SC-UID-2026-000152', sku: 'SC-SPA-REC-IND', productName: 'Spring Air Colchón Record Individual', brand: 'Spring Air', size: 'Individual', lotNumber: 'LOTE-2026-W33', isValidated: true, validatedAt: '26 Ago 16:10' },
      { id: 'v-it-3-3', uid: 'SC-UID-2026-000153', sku: 'SC-SPA-REC-IND', productName: 'Spring Air Colchón Record Individual', brand: 'Spring Air', size: 'Individual', lotNumber: 'LOTE-2026-W33', isValidated: true, validatedAt: '26 Ago 16:15' },
      { id: 'v-it-3-4', uid: 'SC-UID-2026-000154', sku: 'SC-SPA-REC-IND', productName: 'Spring Air Colchón Record Individual', brand: 'Spring Air', size: 'Individual', lotNumber: 'LOTE-2026-W33', isValidated: true, validatedAt: '26 Ago 16:20' },
    ],
  },
  // 3. Con diferencia (Diferencia serial con cantidad correcta)
  {
    id: 'vs-4',
    folio: 'VS-2026-0042',
    pickOrderFolio: 'OR-2026-0119',
    referenceFolio: 'PED-2026-0180',
    type: 'Pedido de Cliente',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'CEDIS Monterrey Norte',
    destinationName: 'Grupo Hotelero Sierra Madre S.A.',
    assignedLane: 'EMB-02',
    priority: 'Alta',
    status: 'Con diferencia',
    createdAt: '27 Ago 2026 10:00',
    operatorAssigned: 'Carlos Medina (Operador Mesa 01)',
    totalUnits: 3,
    validatedUnits: 2,
    stagingLocation: 'STG-OUT-01',
    articleSummaries: [
      { sku: 'SC-NAYT-FLOW-IND', productName: 'Nayt Colchón Flow Basic White Individual', brand: 'Nayt', size: 'Individual', expectedUnits: 3, validatedUnits: 2 },
    ],
    items: [
      { id: 'v-it-4-1', uid: 'SC-UID-2026-000103', sku: 'SC-NAYT-FLOW-IND', productName: 'Nayt Colchón Flow Basic White Individual', brand: 'Nayt', size: 'Individual', lotNumber: 'LOTE-2026-W31', isValidated: true, validatedAt: '27 Ago 10:10' },
      { id: 'v-it-4-2', uid: 'SC-UID-2026-000104', sku: 'SC-NAYT-FLOW-IND', productName: 'Nayt Colchón Flow Basic White Individual', brand: 'Nayt', size: 'Individual', lotNumber: 'LOTE-2026-W31', isValidated: true, validatedAt: '27 Ago 10:15' },
      { id: 'v-it-4-3', uid: 'SC-UID-2026-000105', sku: 'SC-NAYT-FLOW-IND', productName: 'Nayt Colchón Flow Basic White Individual', brand: 'Nayt', size: 'Individual', lotNumber: 'LOTE-2026-W31', isValidated: false, notes: 'Se presentó UID SC-UID-2026-000109 en lugar de SC-UID-2026-000105.' },
    ],
    differenceLog: {
      type: 'Diferencia serial con cantidad correcta',
      notes: 'Misma SKU pero UID distinta a la planeada en picking. Requiere validación de supervisor.',
      registeredAt: '27 Ago 10:20',
      registeredBy: 'Carlos Medina',
    },
  },
  // 4. Cancelada
  {
    id: 'vs-5',
    folio: 'VS-2026-0037',
    pickOrderFolio: 'OR-2026-0112',
    referenceFolio: 'PED-2026-0175',
    type: 'Pedido de Cliente',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'CEDIS Monterrey Norte',
    destinationName: 'Cliente Particular Zona Norte',
    assignedLane: 'EMB-04',
    priority: 'Normal',
    status: 'Cancelada',
    createdAt: '25 Ago 2026 14:00',
    completedAt: '25 Ago 2026 14:30',
    operatorAssigned: 'Carlos Medina (Operador Mesa 01)',
    totalUnits: 2,
    validatedUnits: 0,
    stagingLocation: 'STG-OUT-01',
    articleSummaries: [
      { sku: 'SC-NAYT-FLOW-MAT', productName: 'Nayt Colchón Flow Basic White Matrimonial', brand: 'Nayt', size: 'Matrimonial', expectedUnits: 2, validatedUnits: 0 },
    ],
    items: [
      { id: 'v-it-5-1', uid: 'SC-UID-2026-000141', sku: 'SC-NAYT-FLOW-MAT', productName: 'Nayt Colchón Flow Basic White Matrimonial', brand: 'Nayt', size: 'Matrimonial', lotNumber: 'LOTE-2026-W33', isValidated: false },
      { id: 'v-it-5-2', uid: 'SC-UID-2026-000142', sku: 'SC-NAYT-FLOW-MAT', productName: 'Nayt Colchón Flow Basic White Matrimonial', brand: 'Nayt', size: 'Matrimonial', lotNumber: 'LOTE-2026-W33', isValidated: false },
    ],
    cancellationLog: {
      reason: 'El cliente solicitó cambio de domicilio fiscal y reprogramación de entrega.',
      cancelledAt: '25 Ago 2026 14:30',
      cancelledBy: 'Admin Demo (Ventas Corporativas)',
    },
  },
  // 5. Pendiente
  {
    id: 'vs-6',
    folio: 'VS-2026-0044',
    pickOrderFolio: 'OR-2026-0121',
    referenceFolio: 'PED-2026-0107',
    type: 'Pedido de Cliente',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'CEDIS Monterrey Norte',
    destinationName: 'Hotel Boutique Las Lomas S.A. de C.V.',
    assignedLane: 'EMB-05',
    priority: 'Urgente',
    status: 'Pendiente',
    createdAt: '27 Ago 2026 13:50',
    operatorAssigned: 'Roberto Garza (Operador Salidas)',
    totalUnits: 4,
    validatedUnits: 0,
    stagingLocation: 'STG-OUT-01',
    articleSummaries: [
      { sku: 'SC-REST-ORTO-MAT', productName: 'Restonic Colchón Ortopedic Matrimonial', brand: 'Restonic', size: 'Matrimonial', expectedUnits: 2, validatedUnits: 0 },
      { sku: 'SC-REST-ORTO-KS', productName: 'Restonic Colchón Ortopedic King Size', brand: 'Restonic', size: 'King Size', expectedUnits: 2, validatedUnits: 0 },
    ],
    items: [
      { id: 'v-it-6-1', uid: 'SC-UID-2026-000211', sku: 'SC-REST-ORTO-MAT', productName: 'Restonic Colchón Ortopedic Matrimonial', brand: 'Restonic', size: 'Matrimonial', lotNumber: 'LOTE-2026-W33', isValidated: false },
      { id: 'v-it-6-2', uid: 'SC-UID-2026-000212', sku: 'SC-REST-ORTO-MAT', productName: 'Restonic Colchón Ortopedic Matrimonial', brand: 'Restonic', size: 'Matrimonial', lotNumber: 'LOTE-2026-W33', isValidated: false },
      { id: 'v-it-6-3', uid: 'SC-UID-2026-000244', sku: 'SC-REST-ORTO-KS', productName: 'Restonic Colchón Ortopedic King Size', brand: 'Restonic', size: 'King Size', lotNumber: 'LOTE-2026-W34', isValidated: false },
      { id: 'v-it-6-4', uid: 'SC-UID-2026-000245', sku: 'SC-REST-ORTO-KS', productName: 'Restonic Colchón Ortopedic King Size', brand: 'Restonic', size: 'King Size', lotNumber: 'LOTE-2026-W34', isValidated: false },
    ],
  },

  // ==========================================
  // CEDIS MONTERREY SUR
  // ==========================================
  // 6. Lista para carga (100% validada en Carril EMB-01)
  {
    id: 'vs-2',
    folio: 'VS-2026-0040',
    pickOrderFolio: 'OR-2026-0117',
    referenceFolio: 'PED-2026-0103',
    type: 'Pedido de Cliente',
    warehouseId: 'wh-mty-sur',
    warehouseName: 'CEDIS Monterrey Sur',
    destinationName: 'Roberto Cantú Garza (Ruta Guadalupe #04)',
    assignedLane: 'EMB-01',
    priority: 'Normal',
    status: 'Lista para carga',
    createdAt: '26 Ago 2026 15:20',
    completedAt: '26 Ago 2026 15:45',
    operatorAssigned: 'Valeria Torres (Operador Mesa 02)',
    totalUnits: 3,
    validatedUnits: 3,
    stagingLocation: 'STG-OUT-02',
    articleSummaries: [
      { sku: 'SC-REST-ORTO-MAT', productName: 'Restonic Colchón Ortopedic Matrimonial', brand: 'Restonic', size: 'Matrimonial', expectedUnits: 3, validatedUnits: 3 },
    ],
    items: [
      { id: 'v-it-2-1', uid: 'SC-UID-2026-000131', sku: 'SC-REST-ORTO-MAT', productName: 'Restonic Colchón Ortopedic Matrimonial', brand: 'Restonic', size: 'Matrimonial', lotNumber: 'LOTE-2026-W33', isValidated: true, validatedAt: '26 Ago 15:30' },
      { id: 'v-it-2-2', uid: 'SC-UID-2026-000132', sku: 'SC-REST-ORTO-MAT', productName: 'Restonic Colchón Ortopedic Matrimonial', brand: 'Restonic', size: 'Matrimonial', lotNumber: 'LOTE-2026-W33', isValidated: true, validatedAt: '26 Ago 15:34' },
      { id: 'v-it-2-3', uid: 'SC-UID-2026-000133', sku: 'SC-REST-ORTO-MAT', productName: 'Restonic Colchón Ortopedic Matrimonial', brand: 'Restonic', size: 'Matrimonial', lotNumber: 'LOTE-2026-W33', isValidated: true, validatedAt: '26 Ago 15:40' },
    ],
  },
  // 7. En validación (Carril EMB-01)
  {
    id: 'vs-7',
    folio: 'VS-2026-0043',
    pickOrderFolio: 'OR-2026-0125',
    referenceFolio: 'OTP-2026-0047',
    type: 'Orden de Traspaso',
    warehouseId: 'wh-mty-sur',
    warehouseName: 'CEDIS Monterrey Sur',
    destinationName: 'Sucursal Cumbres',
    assignedLane: 'EMB-01',
    priority: 'Alta',
    status: 'En validación',
    createdAt: '27 Ago 2026 12:55',
    operatorAssigned: 'Valeria Torres (Operador Mesa 02)',
    totalUnits: 4,
    validatedUnits: 2,
    stagingLocation: 'STG-OUT-02',
    articleSummaries: [
      { sku: 'SC-REST-ORTO-MAT', productName: 'Restonic Colchón Ortopedic Matrimonial', brand: 'Restonic', size: 'Matrimonial', expectedUnits: 2, validatedUnits: 2 },
      { sku: 'SC-SEA-CLB-KS', productName: 'Sealy Colchón Celebration Plus King Size', brand: 'Sealy', size: 'King Size', expectedUnits: 2, validatedUnits: 0 },
    ],
    items: [
      { id: 'v-it-7-1', uid: 'SC-UID-2026-000135', sku: 'SC-REST-ORTO-MAT', productName: 'Restonic Colchón Ortopedic Matrimonial', brand: 'Restonic', size: 'Matrimonial', lotNumber: 'LOTE-2026-W33', isValidated: true, validatedAt: '27 Ago 13:02' },
      { id: 'v-it-7-2', uid: 'SC-UID-2026-000136', sku: 'SC-REST-ORTO-MAT', productName: 'Restonic Colchón Ortopedic Matrimonial', brand: 'Restonic', size: 'Matrimonial', lotNumber: 'LOTE-2026-W33', isValidated: true, validatedAt: '27 Ago 13:06' },
      { id: 'v-it-7-3', uid: 'SC-UID-2026-000301', sku: 'SC-SEA-CLB-KS', productName: 'Sealy Colchón Celebration Plus King Size', brand: 'Sealy', size: 'King Size', lotNumber: 'LOTE-2026-W35', isValidated: false },
      { id: 'v-it-7-4', uid: 'SC-UID-2026-000302', sku: 'SC-SEA-CLB-KS', productName: 'Sealy Colchón Celebration Plus King Size', brand: 'Sealy', size: 'King Size', lotNumber: 'LOTE-2026-W35', isValidated: false },
    ],
  },
  // 8. Con diferencia (Faltante físico en rampa)
  {
    id: 'vs-8',
    folio: 'VS-2026-0045',
    pickOrderFolio: 'OR-2026-0124',
    referenceFolio: 'PED-2026-0183',
    type: 'Pedido de Cliente',
    warehouseId: 'wh-mty-sur',
    warehouseName: 'CEDIS Monterrey Sur',
    destinationName: 'Ruta Carretera Nacional #02',
    assignedLane: 'EMB-03',
    priority: 'Normal',
    status: 'Con diferencia',
    createdAt: '27 Ago 2026 11:30',
    operatorAssigned: 'Miguel Ángel Soto (Operador Sur)',
    totalUnits: 3,
    validatedUnits: 2,
    stagingLocation: 'STG-OUT-02',
    articleSummaries: [
      { sku: 'SC-SPA-REC-IND', productName: 'Spring Air Colchón Record Individual', brand: 'Spring Air', size: 'Individual', expectedUnits: 3, validatedUnits: 2 },
    ],
    items: [
      { id: 'v-it-8-1', uid: 'SC-UID-2026-000191', sku: 'SC-SPA-REC-IND', productName: 'Spring Air Colchón Record Individual', brand: 'Spring Air', size: 'Individual', lotNumber: 'LOTE-2026-W32', isValidated: true, validatedAt: '27 Ago 11:35' },
      { id: 'v-it-8-2', uid: 'SC-UID-2026-000192', sku: 'SC-SPA-REC-IND', productName: 'Spring Air Colchón Record Individual', brand: 'Spring Air', size: 'Individual', lotNumber: 'LOTE-2026-W32', isValidated: true, validatedAt: '27 Ago 11:40' },
      { id: 'v-it-8-3', uid: 'SC-UID-2026-000193', sku: 'SC-SPA-REC-IND', productName: 'Spring Air Colchón Record Individual', brand: 'Spring Air', size: 'Individual', lotNumber: 'LOTE-2026-W32', isValidated: false, notes: 'Faltante físico en carril de embarque.' },
    ],
    differenceLog: {
      type: 'Faltante',
      notes: 'Falta 1 unidad de 3 en staging de salida. Se reportó a recolección para búsqueda en pasillo A.',
      registeredAt: '27 Ago 11:45',
      registeredBy: 'Miguel Ángel Soto',
    },
  },
  // 9. Cancelada (Sur)
  {
    id: 'vs-9',
    folio: 'VS-2026-0038',
    pickOrderFolio: 'OR-2026-0111',
    referenceFolio: 'PED-2026-0174',
    type: 'Pedido de Cliente',
    warehouseId: 'wh-mty-sur',
    warehouseName: 'CEDIS Monterrey Sur',
    destinationName: 'Cliente Local Sur',
    assignedLane: 'EMB-02',
    priority: 'Normal',
    status: 'Cancelada',
    createdAt: '25 Ago 2026 15:00',
    completedAt: '25 Ago 2026 15:30',
    operatorAssigned: 'Valeria Torres (Operador Mesa 02)',
    totalUnits: 2,
    validatedUnits: 0,
    stagingLocation: 'STG-OUT-02',
    articleSummaries: [
      { sku: 'SC-REST-ORTO-MAT', productName: 'Restonic Colchón Ortopedic Matrimonial', brand: 'Restonic', size: 'Matrimonial', expectedUnits: 2, validatedUnits: 0 },
    ],
    items: [
      { id: 'v-it-9-1', uid: 'SC-UID-2026-000137', sku: 'SC-REST-ORTO-MAT', productName: 'Restonic Colchón Ortopedic Matrimonial', brand: 'Restonic', size: 'Matrimonial', lotNumber: 'LOTE-2026-W33', isValidated: false },
      { id: 'v-it-9-2', uid: 'SC-UID-2026-000138', sku: 'SC-REST-ORTO-MAT', productName: 'Restonic Colchón Ortopedic Matrimonial', brand: 'Restonic', size: 'Matrimonial', lotNumber: 'LOTE-2026-W33', isValidated: false },
    ],
    cancellationLog: {
      reason: 'Cancelación solicitada por cliente antes de carga a unidad de flete.',
      cancelledAt: '25 Ago 2026 15:30',
      cancelledBy: 'Valeria Torres',
    },
  },
  // 10. Pendiente (Sur)
  {
    id: 'vs-10',
    folio: 'VS-2026-0046',
    pickOrderFolio: 'OR-2026-0128',
    referenceFolio: 'PED-2026-0186',
    type: 'Pedido de Cliente',
    warehouseId: 'wh-mty-sur',
    warehouseName: 'CEDIS Monterrey Sur',
    destinationName: 'Roberto Cantú Garza (Ruta Santiago)',
    assignedLane: 'EMB-02',
    priority: 'Normal',
    status: 'Pendiente',
    createdAt: '27 Ago 2026 14:15',
    operatorAssigned: 'Valeria Torres (Operador Mesa 02)',
    totalUnits: 3,
    validatedUnits: 0,
    stagingLocation: 'STG-OUT-02',
    articleSummaries: [
      { sku: 'SC-SPA-REC-KS', productName: 'Spring Air Colchón Record King Size', brand: 'Spring Air', size: 'King Size', expectedUnits: 1, validatedUnits: 0 },
      { sku: 'SC-REST-ORTO-MAT', productName: 'Restonic Colchón Ortopedic Matrimonial', brand: 'Restonic', size: 'Matrimonial', expectedUnits: 2, validatedUnits: 0 },
    ],
    items: [
      { id: 'v-it-10-1', uid: 'SC-UID-2026-000137', sku: 'SC-SPA-REC-KS', productName: 'Spring Air Colchón Record King Size', brand: 'Spring Air', size: 'King Size', lotNumber: 'LOTE-2026-W34', isValidated: false },
      { id: 'v-it-10-2', uid: 'SC-UID-2026-000138', sku: 'SC-REST-ORTO-MAT', productName: 'Restonic Colchón Ortopedic Matrimonial', brand: 'Restonic', size: 'Matrimonial', lotNumber: 'LOTE-2026-W33', isValidated: false },
      { id: 'v-it-10-3', uid: 'SC-UID-2026-000139', sku: 'SC-REST-ORTO-MAT', productName: 'Restonic Colchón Ortopedic Matrimonial', brand: 'Restonic', size: 'Matrimonial', lotNumber: 'LOTE-2026-W33', isValidated: false },
    ],
  },
];
