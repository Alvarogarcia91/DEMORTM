export type ReprintItemType = 'Unidad' | 'Ubicación';

export type ReprintReason = 
  | 'Etiqueta dañada'
  | 'Etiqueta ilegible'
  | 'Etiqueta desprendida'
  | 'Etiqueta extraviada'
  | 'Error de impresión'
  | 'Sustitución preventiva'
  | 'Otro';

export interface ReprintAuditRecord {
  id: string;
  reprintedAt: string;
  type: ReprintItemType;
  code: string; // UID o Código de Ubicación
  title: string; // Nombre del artículo o descripción de la ubicación
  details: string; // SKU / Lote o Pasillo / Nivel
  reason: ReprintReason;
  customReason?: string;
  requestedBy: string;
  sourceReference?: string; // ej. 'INC-2026-0034' o 'INC-2026-0030'
  warehouseName: string;
  status: 'Impresión completada';
}

export interface UnitReprintCandidate {
  uid: string;
  sku: string;
  productName: string;
  brand: string;
  size: string;
  lotNumber: string;
  warehouseId: string;
  warehouseName: string;
  locationCode: string;
  status: string;
  lastPrintedAt?: string;
}

export interface LocationReprintCandidate {
  code: string;
  name: string;
  type: 'Rack de Almacenamiento' | 'Área de Recepción' | 'Carril de Embarque' | 'Showroom / Exhibición' | 'Área de Retrabajo';
  warehouseId: string;
  warehouseName: string;
  aisle?: string;
  rackPosition?: string;
  level?: string;
  status: 'Activa' | 'Bloqueada' | 'En mantenimiento';
}

export const REPRINT_REASONS_LIST: ReprintReason[] = [
  'Etiqueta dañada',
  'Etiqueta ilegible',
  'Etiqueta desprendida',
  'Etiqueta extraviada',
  'Error de impresión',
  'Sustitución preventiva',
  'Otro',
];

export const INITIAL_UNIT_REPRINT_CANDIDATES: UnitReprintCandidate[] = [
  // CEDIS Norte
  {
    uid: 'SC-UID-2026-000184',
    sku: 'SC-NAYT-FLOW-MAT',
    productName: 'Nayt Colchón Flow Basic White Matrimonial',
    brand: 'Nayt',
    size: 'Matrimonial',
    lotNumber: 'LOTE-2026-W34',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'CEDIS Monterrey Norte',
    locationCode: 'A-B-03',
    status: 'Disponible',
    lastPrintedAt: '27 Ago 2026 10:00',
  },
  {
    uid: 'SC-UID-2026-000185',
    sku: 'SC-NAYT-FLOW-MAT',
    productName: 'Nayt Colchón Flow Basic White Matrimonial',
    brand: 'Nayt',
    size: 'Matrimonial',
    lotNumber: 'LOTE-2026-W34',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'CEDIS Monterrey Norte',
    locationCode: 'A-B-04',
    status: 'Disponible',
    lastPrintedAt: '27 Ago 2026 10:00',
  },
  {
    uid: 'SC-UID-2026-000101',
    sku: 'SC-NAYT-FLOW-IND',
    productName: 'Nayt Colchón Flow Basic White Individual',
    brand: 'Nayt',
    size: 'Individual',
    lotNumber: 'LOTE-2026-W31',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'CEDIS Monterrey Norte',
    locationCode: 'A-A-01',
    status: 'Disponible',
    lastPrintedAt: '26 Ago 2026 14:30',
  },
  {
    uid: 'SC-UID-2026-000102',
    sku: 'SC-NAYT-FLOW-IND',
    productName: 'Nayt Colchón Flow Basic White Individual',
    brand: 'Nayt',
    size: 'Individual',
    lotNumber: 'LOTE-2026-W31',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'CEDIS Monterrey Norte',
    locationCode: 'A-A-02',
    status: 'Disponible',
    lastPrintedAt: '26 Ago 2026 14:30',
  },
  {
    uid: 'SC-UID-2026-000121',
    sku: 'SC-SPA-REC-IND',
    productName: 'Spring Air Colchón Record Individual',
    brand: 'Spring Air',
    size: 'Individual',
    lotNumber: 'LOTE-2026-W32',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'CEDIS Monterrey Norte',
    locationCode: 'B-A-01',
    status: 'Disponible',
    lastPrintedAt: '26 Ago 2026 11:00',
  },
  {
    uid: 'SC-UID-2026-000211',
    sku: 'SC-REST-ORTO-MAT',
    productName: 'Restonic Colchón Ortopedic Matrimonial',
    brand: 'Restonic',
    size: 'Matrimonial',
    lotNumber: 'LOTE-2026-W33',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'CEDIS Monterrey Norte',
    locationCode: 'EMB-03',
    status: 'Lista para carga',
    lastPrintedAt: '27 Ago 2026 13:40',
  },
  {
    uid: 'SC-UID-2026-000201',
    sku: 'SC-SPA-REC-IND',
    productName: 'Spring Air Colchón Record Individual',
    brand: 'Spring Air',
    size: 'Individual',
    lotNumber: 'LOTE-2026-W32',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'CEDIS Monterrey Norte',
    locationCode: 'REC-01',
    status: 'Pendiente de acomodo',
    lastPrintedAt: '27 Ago 2026 10:40',
  },

  // CEDIS Sur
  {
    uid: 'SC-UID-2026-000301',
    sku: 'SC-SEA-CLB-KS',
    productName: 'Sealy Colchón Celebration Plus King Size',
    brand: 'Sealy',
    size: 'King Size',
    lotNumber: 'LOTE-2026-W35',
    warehouseId: 'wh-mty-sur',
    warehouseName: 'CEDIS Monterrey Sur',
    locationCode: 'B-B-01',
    status: 'Disponible',
    lastPrintedAt: '27 Ago 2026 11:20',
  },
  {
    uid: 'SC-UID-2026-000131',
    sku: 'SC-REST-ORTO-MAT',
    productName: 'Restonic Colchón Ortopedic Matrimonial',
    brand: 'Restonic',
    size: 'Matrimonial',
    lotNumber: 'LOTE-2026-W33',
    warehouseId: 'wh-mty-sur',
    warehouseName: 'CEDIS Monterrey Sur',
    locationCode: 'B-A-01',
    status: 'Disponible',
    lastPrintedAt: '26 Ago 2026 15:30',
  },

  // Sucursales
  {
    uid: 'SC-UID-2026-000181',
    sku: 'SC-NAYT-FLOW-IND',
    productName: 'Nayt Colchón Flow Basic White Individual',
    brand: 'Nayt',
    size: 'Individual',
    lotNumber: 'LOTE-2026-W34',
    warehouseId: 'wh-suc-valle-oriente',
    warehouseName: 'Sucursal Valle Oriente',
    locationCode: 'SHOW-02',
    status: 'Exhibición',
    lastPrintedAt: '27 Ago 2026 11:55',
  },
  {
    uid: 'SC-UID-2026-000191',
    sku: 'SC-SPA-REC-IND',
    productName: 'Spring Air Colchón Record Individual',
    brand: 'Spring Air',
    size: 'Individual',
    lotNumber: 'LOTE-2026-W34',
    warehouseId: 'wh-suc-cumbres',
    warehouseName: 'Sucursal Cumbres',
    locationCode: 'SHOW-03',
    status: 'Exhibición',
    lastPrintedAt: '27 Ago 2026 13:20',
  },
];

export const INITIAL_LOCATION_REPRINT_CANDIDATES: LocationReprintCandidate[] = [
  // CEDIS Norte locations
  { code: 'A-A-01', name: 'Pasillo A · Posición 01 · Nivel A (Piso)', type: 'Rack de Almacenamiento', warehouseId: 'wh-mty-norte', warehouseName: 'CEDIS Monterrey Norte', aisle: 'Pasillo A', rackPosition: '01', level: 'Nivel A', status: 'Activa' },
  { code: 'A-A-02', name: 'Pasillo A · Posición 02 · Nivel A (Piso)', type: 'Rack de Almacenamiento', warehouseId: 'wh-mty-norte', warehouseName: 'CEDIS Monterrey Norte', aisle: 'Pasillo A', rackPosition: '02', level: 'Nivel A', status: 'Activa' },
  { code: 'A-B-03', name: 'Pasillo A · Posición 03 · Nivel B (Medio)', type: 'Rack de Almacenamiento', warehouseId: 'wh-mty-norte', warehouseName: 'CEDIS Monterrey Norte', aisle: 'Pasillo A', rackPosition: '03', level: 'Nivel B', status: 'Activa' },
  { code: 'A-B-04', name: 'Pasillo A · Posición 04 · Nivel B (Medio)', type: 'Rack de Almacenamiento', warehouseId: 'wh-mty-norte', warehouseName: 'CEDIS Monterrey Norte', aisle: 'Pasillo A', rackPosition: '04', level: 'Nivel B', status: 'Activa' },
  { code: 'B-A-01', name: 'Pasillo B · Posición 01 · Nivel A (Piso)', type: 'Rack de Almacenamiento', warehouseId: 'wh-mty-norte', warehouseName: 'CEDIS Monterrey Norte', aisle: 'Pasillo B', rackPosition: '01', level: 'Nivel A', status: 'Activa' },
  { code: 'B-A-02', name: 'Pasillo B · Posición 02 · Nivel A (Piso)', type: 'Rack de Almacenamiento', warehouseId: 'wh-mty-norte', warehouseName: 'CEDIS Monterrey Norte', aisle: 'Pasillo B', rackPosition: '02', level: 'Nivel A', status: 'Activa' },
  { code: 'REC-01', name: 'Andén de Recepción Principal 01', type: 'Área de Recepción', warehouseId: 'wh-mty-norte', warehouseName: 'CEDIS Monterrey Norte', status: 'Activa' },
  { code: 'EMB-01', name: 'Carril de Embarque 01', type: 'Carril de Embarque', warehouseId: 'wh-mty-norte', warehouseName: 'CEDIS Monterrey Norte', status: 'Activa' },
  { code: 'EMB-03', name: 'Carril de Embarque 03 (Sugerido)', type: 'Carril de Embarque', warehouseId: 'wh-mty-norte', warehouseName: 'CEDIS Monterrey Norte', status: 'Activa' },
  { code: 'SHOW-01', name: 'Bahía de Exhibición Showroom 01', type: 'Showroom / Exhibición', warehouseId: 'wh-mty-norte', warehouseName: 'CEDIS Monterrey Norte', status: 'Activa' },
  { code: 'SHOW-02', name: 'Bahía de Exhibición Showroom 02', type: 'Showroom / Exhibición', warehouseId: 'wh-mty-norte', warehouseName: 'CEDIS Monterrey Norte', status: 'Activa' },
  { code: 'RET-NORTE', name: 'Área de Retrabajo y Garantías Norte', type: 'Área de Retrabajo', warehouseId: 'wh-mty-norte', warehouseName: 'CEDIS Monterrey Norte', status: 'Activa' },
  
  // CEDIS Sur locations
  { code: 'B-A-01', name: 'Pasillo B · Posición 01 · Nivel A (Piso)', type: 'Rack de Almacenamiento', warehouseId: 'wh-mty-sur', warehouseName: 'CEDIS Monterrey Sur', aisle: 'Pasillo B', rackPosition: '01', level: 'Nivel A', status: 'Activa' },
  { code: 'B-A-02', name: 'Pasillo B · Posición 02 · Nivel A (Piso)', type: 'Rack de Almacenamiento', warehouseId: 'wh-mty-sur', warehouseName: 'CEDIS Monterrey Sur', aisle: 'Pasillo B', rackPosition: '02', level: 'Nivel A', status: 'Activa' },
  { code: 'REC-02', name: 'Andén de Recepción Principal 02', type: 'Área de Recepción', warehouseId: 'wh-mty-sur', warehouseName: 'CEDIS Monterrey Sur', status: 'Activa' },
  { code: 'EMB-01', name: 'Carril de Embarque 01', type: 'Carril de Embarque', warehouseId: 'wh-mty-sur', warehouseName: 'CEDIS Monterrey Sur', status: 'Activa' },
  { code: 'RET-SUR', name: 'Área de Retrabajo Sur', type: 'Área de Retrabajo', warehouseId: 'wh-mty-sur', warehouseName: 'CEDIS Monterrey Sur', status: 'Activa' },

  // Sucursal Valle Oriente locations
  { code: 'REC-SUC-VO', name: 'Andén Recepción Traspasos VO', type: 'Área de Recepción', warehouseId: 'wh-suc-valle-oriente', warehouseName: 'Sucursal Valle Oriente', status: 'Activa' },
  { code: 'SHOW-01', name: 'Bahía Principal Showroom VO', type: 'Showroom / Exhibición', warehouseId: 'wh-suc-valle-oriente', warehouseName: 'Sucursal Valle Oriente', status: 'Activa' },
  { code: 'SHOW-02', name: 'Bahía Secundaria Showroom VO', type: 'Showroom / Exhibición', warehouseId: 'wh-suc-valle-oriente', warehouseName: 'Sucursal Valle Oriente', status: 'Activa' },
  { code: 'BOD-VO-01', name: 'Bodega Local Posición 01 VO', type: 'Rack de Almacenamiento', warehouseId: 'wh-suc-valle-oriente', warehouseName: 'Sucursal Valle Oriente', status: 'Activa' },

  // Sucursal Cumbres locations
  { code: 'REC-SUC-CUM', name: 'Andén Recepción Traspasos Cumbres', type: 'Área de Recepción', warehouseId: 'wh-suc-cumbres', warehouseName: 'Sucursal Cumbres', status: 'Activa' },
  { code: 'SHOW-03', name: 'Bahía Showroom Cumbres 03', type: 'Showroom / Exhibición', warehouseId: 'wh-suc-cumbres', warehouseName: 'Sucursal Cumbres', status: 'Activa' },
  { code: 'BOD-CUM-01', name: 'Bodega Local Cumbres 01', type: 'Rack de Almacenamiento', warehouseId: 'wh-suc-cumbres', warehouseName: 'Sucursal Cumbres', status: 'Activa' },
];

export const INITIAL_REPRINT_AUDIT_LOGS: ReprintAuditRecord[] = [
  // 1. Etiqueta dañada
  {
    id: 'rep-1',
    reprintedAt: '27 Ago 2026, 18:12',
    type: 'Ubicación',
    code: 'A-B-03',
    title: 'Pasillo A · Posición 03 · Nivel B',
    details: 'Rack Nivel B (Medio)',
    reason: 'Etiqueta dañada',
    requestedBy: 'Carlos Medina (Operador Mesa 01)',
    warehouseName: 'CEDIS Monterrey Norte',
    status: 'Impresión completada',
  },
  // 2. Etiqueta dañada
  {
    id: 'rep-2',
    reprintedAt: '27 Ago 2026, 15:40',
    type: 'Unidad',
    code: 'SC-UID-2026-000185',
    title: 'Nayt Colchón Flow Basic White Matrimonial',
    details: 'SKU: SC-NAYT-FLOW-MAT · Lote: LOTE-2026-W34',
    reason: 'Etiqueta dañada',
    requestedBy: 'Roberto Garza (Operador Acomodo)',
    warehouseName: 'CEDIS Monterrey Norte',
    status: 'Impresión completada',
  },
  // 3. Etiqueta ilegible (Desde Incidencia)
  {
    id: 'rep-3',
    reprintedAt: '27 Ago 2026, 22:34',
    type: 'Unidad',
    code: 'SC-UID-2026-000184',
    title: 'Nayt Colchón Flow Basic White Matrimonial',
    details: 'SKU: SC-NAYT-FLOW-MAT · Lote: LOTE-2026-W34',
    reason: 'Etiqueta ilegible',
    requestedBy: 'Laura Gómez (Supervisora Calidad)',
    sourceReference: 'INC-2026-0034',
    warehouseName: 'CEDIS Monterrey Norte',
    status: 'Impresión completada',
  },
  // 4. Etiqueta ilegible (Desde Incidencia)
  {
    id: 'rep-4',
    reprintedAt: '26 Ago 2026, 17:15',
    type: 'Unidad',
    code: 'SC-UID-2026-000121',
    title: 'Spring Air Colchón Record Individual',
    details: 'SKU: SC-SPA-REC-IND · Lote: LOTE-2026-W32',
    reason: 'Etiqueta ilegible',
    requestedBy: 'Carlos Medina (Operador Mesa 01)',
    sourceReference: 'INC-2026-0030',
    warehouseName: 'CEDIS Monterrey Norte',
    status: 'Impresión completada',
  },
  // 5. Etiqueta desprendida
  {
    id: 'rep-5',
    reprintedAt: '27 Ago 2026, 11:45',
    type: 'Unidad',
    code: 'SC-UID-2026-000301',
    title: 'Sealy Colchón Celebration Plus King Size',
    details: 'SKU: SC-SEA-CLB-KS · Lote: LOTE-2026-W35',
    reason: 'Etiqueta desprendida',
    requestedBy: 'Valeria Torres (Operador Mesa 02)',
    warehouseName: 'CEDIS Monterrey Sur',
    status: 'Impresión completada',
  },
  // 6. Etiqueta desprendida
  {
    id: 'rep-6',
    reprintedAt: '27 Ago 2026, 10:20',
    type: 'Unidad',
    code: 'SC-UID-2026-000171',
    title: 'Nayt Colchón Flow Basic White Individual',
    details: 'SKU: SC-NAYT-FLOW-IND · Lote: LOTE-2026-W34',
    reason: 'Etiqueta desprendida',
    requestedBy: 'Carlos Medina (Operador Mesa 01)',
    warehouseName: 'CEDIS Monterrey Norte',
    status: 'Impresión completada',
  },
  // 7. Error de impresión
  {
    id: 'rep-7',
    reprintedAt: '27 Ago 2026, 09:10',
    type: 'Unidad',
    code: 'SC-UID-2026-000172',
    title: 'Nayt Colchón Flow Basic White Individual',
    details: 'SKU: SC-NAYT-FLOW-IND · Lote: LOTE-2026-W34',
    reason: 'Error de impresión',
    requestedBy: 'Admin Demo (Supervisor General)',
    warehouseName: 'CEDIS Monterrey Norte',
    status: 'Impresión completada',
  },
  // 8. Error de impresión
  {
    id: 'rep-8',
    reprintedAt: '26 Ago 2026, 14:00',
    type: 'Unidad',
    code: 'SC-UID-2026-000131',
    title: 'Restonic Colchón Ortopedic Matrimonial',
    details: 'SKU: SC-REST-ORTO-MAT · Lote: LOTE-2026-W33',
    reason: 'Error de impresión',
    requestedBy: 'Valeria Torres (Operador Mesa 02)',
    warehouseName: 'CEDIS Monterrey Sur',
    status: 'Impresión completada',
  },
  // 9. Reimpresión de ubicación (Showroom)
  {
    id: 'rep-9',
    reprintedAt: '27 Ago 2026, 12:00',
    type: 'Ubicación',
    code: 'SHOW-02',
    title: 'Bahía de Exhibición Showroom 02',
    details: 'Showroom Piso de Venta',
    reason: 'Etiqueta dañada',
    requestedBy: 'Brenda Cavazos (Encargada Sucursal)',
    warehouseName: 'Sucursal Valle Oriente',
    status: 'Impresión completada',
  },
  // 10. Reimpresión de ubicación (Retrabajo)
  {
    id: 'rep-10',
    reprintedAt: '27 Ago 2026, 14:30',
    type: 'Ubicación',
    code: 'RET-NORTE',
    title: 'Área de Retrabajo y Garantías Norte',
    details: 'Zona de Cuarentena y Reetiquetado',
    reason: 'Etiqueta desprendida',
    requestedBy: 'Laura Gómez (Supervisora Calidad)',
    warehouseName: 'CEDIS Monterrey Norte',
    status: 'Impresión completada',
  },
  // 11. Reimpresión originada desde Incidencia (Sur)
  {
    id: 'rep-11',
    reprintedAt: '27 Ago 2026, 10:30',
    type: 'Unidad',
    code: 'SC-UID-2026-000302',
    title: 'Sealy Colchón Celebration Plus King Size',
    details: 'SKU: SC-SEA-CLB-KS · Lote: LOTE-2026-W35',
    reason: 'Etiqueta ilegible',
    requestedBy: 'Valeria Torres (Operador Mesa 02)',
    sourceReference: 'INC-2026-0043',
    warehouseName: 'CEDIS Monterrey Sur',
    status: 'Impresión completada',
  },
  // 12. Sustitución preventiva (Cumbres)
  {
    id: 'rep-12',
    reprintedAt: '27 Ago 2026, 13:45',
    type: 'Ubicación',
    code: 'SHOW-03',
    title: 'Bahía Showroom Cumbres 03',
    details: 'Exhibición Tienda Cumbres',
    reason: 'Sustitución preventiva',
    requestedBy: 'Jorge Villarreal (Encargado Cumbres)',
    warehouseName: 'Sucursal Cumbres',
    status: 'Impresión completada',
  },
];
