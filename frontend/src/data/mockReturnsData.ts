export type ReturnSourceType = 
  | 'Cliente' 
  | 'Sucursal' 
  | 'Entrega rechazada' 
  | 'Interna';

export type ReturnReason = 
  | 'Producto incorrecto'
  | 'Daño visible'
  | 'Empaque dañado'
  | 'Entrega rechazada'
  | 'Cambio solicitado'
  | 'Error operativo'
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
  uid: string; // Se conserva exactamente igual
  sku: string;
  productName: string;
  brand: string;
  size: string;
  lotNumber: string;
  originalEntryDate: string; // ej. '10 Ago 2026' - nunca se reinicia
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
  folio: string; // ej. 'DEV-2026-0021'
  sourceType: ReturnSourceType;
  reference: string; // ej. 'PED-2026-0184', 'OTP-2026-0041'
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
  // CEDIS MONTERREY NORTE
  // ==========================================
  // 1. Pendiente · Cliente · Empaque dañado
  {
    id: 'ret-1',
    folio: 'DEV-2026-0021',
    sourceType: 'Cliente',
    reference: 'PED-2026-0184',
    originClientOrBranch: 'Cliente Final (Monterrey Zona Valle)',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'CEDIS Monterrey Norte',
    reason: 'Empaque dañado',
    notes: 'El cliente rechazó el bulto al momento de entrega a domicilio por rasgadura en la bolsa térmica.',
    createdAt: '27 Ago 2026, 14:20',
    status: 'Pendiente',
    items: [
      {
        id: 'ri-1',
        uid: 'SC-UID-2026-000184',
        sku: 'SC-NAYT-FLOW-MAT',
        productName: 'Nayt Colchón Flow Basic White Matrimonial',
        brand: 'Nayt',
        size: 'Matrimonial',
        lotNumber: 'LOTE-2026-W34',
        originalEntryDate: '10 Ago 2026',
        suggestedDestination: 'RET-NORTE',
        status: 'Pendiente',
      },
    ],
    timeline: [
      { id: 't-1', occurredAt: '27 Ago 14:20', actor: 'Mesa de Tráfico', message: 'Solicitud de devolución registrada por rechazo en ruta domiciliaria.', type: 'created' },
    ],
  },
  // 2. Pendiente · Sucursal · Cambio solicitado
  {
    id: 'ret-2',
    folio: 'DEV-2026-0022',
    sourceType: 'Sucursal',
    reference: 'OTP-2026-0041',
    originClientOrBranch: 'Sucursal Valle Oriente',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'CEDIS Monterrey Norte',
    reason: 'Cambio solicitado',
    notes: 'Retorno de 2 unidades desde exhibición de sucursal para rebalanceo a CEDIS.',
    createdAt: '27 Ago 2026, 11:30',
    status: 'Pendiente',
    items: [
      {
        id: 'ri-2',
        uid: 'SC-UID-2026-000101',
        sku: 'SC-NAYT-FLOW-IND',
        productName: 'Nayt Colchón Flow Basic White Individual',
        brand: 'Nayt',
        size: 'Individual',
        lotNumber: 'LOTE-2026-W31',
        originalEntryDate: '05 Ago 2026',
        suggestedDestination: 'REC-DEV-01',
        status: 'Pendiente',
      },
      {
        id: 'ri-3',
        uid: 'SC-UID-2026-000102',
        sku: 'SC-NAYT-FLOW-IND',
        productName: 'Nayt Colchón Flow Basic White Individual',
        brand: 'Nayt',
        size: 'Individual',
        lotNumber: 'LOTE-2026-W31',
        originalEntryDate: '05 Ago 2026',
        suggestedDestination: 'REC-DEV-01',
        status: 'Pendiente',
      },
    ],
    timeline: [
      { id: 't-2', occurredAt: '27 Ago 11:30', actor: 'Brenda Cavazos (Sucursal VO)', message: 'Traspaso de retorno generado hacia CEDIS Monterrey Norte.', type: 'created' },
    ],
  },
  // 3. En recepción · Entrega rechazada
  {
    id: 'ret-5',
    folio: 'DEV-2026-0023',
    sourceType: 'Entrega rechazada',
    reference: 'PED-2026-0176',
    originClientOrBranch: 'Ruta San Nicolás 01',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'CEDIS Monterrey Norte',
    reason: 'Producto incorrecto',
    notes: 'Chofer arribando a rampa REC-DEV-01 para descarga de unidad con tamaño incorrecto.',
    createdAt: '27 Ago 2026, 12:15',
    status: 'En recepción',
    items: [
      {
        id: 'ri-5',
        uid: 'SC-UID-2026-000141',
        sku: 'SC-NAYT-FLOW-MAT',
        productName: 'Nayt Colchón Flow Basic White Matrimonial',
        brand: 'Nayt',
        size: 'Matrimonial',
        lotNumber: 'LOTE-2026-W33',
        originalEntryDate: '16 Ago 2026',
        suggestedDestination: 'REC-DEV-01',
        status: 'Pendiente',
      },
    ],
    timeline: [
      { id: 't-5-1', occurredAt: '27 Ago 12:15', actor: 'Chofer Ruta 01', message: 'Reportó unidad rechazada por medidas.', type: 'created' },
      { id: 't-5-2', occurredAt: '27 Ago 12:45', actor: 'Carlos Medina', message: 'Iniciando inspección en rampa de devoluciones.', type: 'scan_unit' },
    ],
  },
  // 4. Parcial · Multiunidad
  {
    id: 'ret-6',
    folio: 'DEV-2026-0024',
    sourceType: 'Cliente',
    reference: 'PED-2026-0173',
    originClientOrBranch: 'Hotel Boutique Las Lomas S.A.',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'CEDIS Monterrey Norte',
    reason: 'Cambio solicitado',
    notes: 'Devolución parcial de 2 unidades de 3 para ajuste de confort de huéspedes.',
    createdAt: '27 Ago 2026, 09:30',
    status: 'Parcial',
    items: [
      {
        id: 'ri-6-1',
        uid: 'SC-UID-2026-000211',
        sku: 'SC-REST-ORTO-MAT',
        productName: 'Restonic Colchón Ortopedic Matrimonial',
        brand: 'Restonic',
        size: 'Matrimonial',
        lotNumber: 'LOTE-2026-W33',
        originalEntryDate: '14 Ago 2026',
        returnDate: '27 Ago 2026',
        condition: 'En buen estado',
        suggestedDestination: 'REC-DEV-01',
        confirmedDestination: 'REC-DEV-01',
        status: 'Pendiente de acomodo',
      },
      {
        id: 'ri-6-2',
        uid: 'SC-UID-2026-000212',
        sku: 'SC-REST-ORTO-MAT',
        productName: 'Restonic Colchón Ortopedic Matrimonial',
        brand: 'Restonic',
        size: 'Matrimonial',
        lotNumber: 'LOTE-2026-W33',
        originalEntryDate: '14 Ago 2026',
        suggestedDestination: 'REC-DEV-01',
        status: 'Pendiente',
      },
    ],
    timeline: [
      { id: 't-6-1', occurredAt: '27 Ago 09:30', actor: 'Atención a Clientes', message: 'Devolución parcial autorizada.', type: 'created' },
      { id: 't-6-2', occurredAt: '27 Ago 10:15', actor: 'Carlos Medina', message: 'Unidad SC-UID-2026-000211 recibida e inspeccionada en buen estado.', type: 'completed' },
    ],
  },
  // 5. Completa · Entrega rechazada · Producto en buen estado
  {
    id: 'ret-3',
    folio: 'DEV-2026-0020',
    sourceType: 'Entrega rechazada',
    reference: 'PED-2026-0155',
    originClientOrBranch: 'Ruta Cumbres 02',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'CEDIS Monterrey Norte',
    reason: 'Producto incorrecto',
    notes: 'El cliente solicitó King Size y por error de picking se intentó entregar Matrimonial.',
    createdAt: '26 Ago 2026, 16:45',
    receivedAt: '26 Ago 2026, 18:10',
    status: 'Completa',
    items: [
      {
        id: 'ri-4',
        uid: 'SC-UID-2026-000121',
        sku: 'SC-SPA-REC-IND',
        productName: 'Spring Air Colchón Record Individual',
        brand: 'Spring Air',
        size: 'Individual',
        lotNumber: 'LOTE-2026-W32',
        originalEntryDate: '12 Ago 2026',
        returnDate: '26 Ago 2026',
        condition: 'En buen estado',
        suggestedDestination: 'REC-DEV-01',
        confirmedDestination: 'REC-DEV-01',
        status: 'Pendiente de acomodo',
      },
    ],
    timeline: [
      { id: 't-3-1', occurredAt: '26 Ago 16:45', actor: 'Operador Chofer 02', message: 'Rechazo reportado por medida no coincidente.', type: 'created' },
      { id: 't-3-2', occurredAt: '26 Ago 18:10', actor: 'Carlos Medina', message: 'Devolución recibida en buen estado. Trasladada a REC-DEV-01 para nuevo acomodo.', type: 'completed' },
    ],
  },
  // 6. Con incidencia · Daño visible en producto
  {
    id: 'ret-7',
    folio: 'DEV-2026-0025',
    sourceType: 'Cliente',
    reference: 'PED-2026-0170',
    originClientOrBranch: 'Cliente San Pedro Residencial',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'CEDIS Monterrey Norte',
    reason: 'Daño visible',
    notes: 'Colchón arribó con mancha de aceite hidráulico en esquina superior.',
    createdAt: '27 Ago 2026, 13:40',
    status: 'Con incidencia',
    items: [
      {
        id: 'ri-7',
        uid: 'SC-UID-2026-000199',
        sku: 'SC-SEAL-POST-QS',
        productName: 'Sealy Posturepedic Crown Jewel Queen Size',
        brand: 'Sealy',
        size: 'Queen Size',
        lotNumber: 'LOTE-2026-W35',
        originalEntryDate: '20 Ago 2026',
        condition: 'Producto dañado',
        suggestedDestination: 'RET-NORTE',
        confirmedDestination: 'RET-NORTE',
        status: 'En retrabajo',
        notes: 'Incidencia INC-2026-0045 generada. Requiere cambio de funda o reclamo a transportista.',
      },
    ],
    timeline: [
      { id: 't-7-1', occurredAt: '27 Ago 13:40', actor: 'Carlos Medina', message: 'Inspección física reprobada por mancha. Enviado a Retrabajo.', type: 'incident' },
    ],
  },
  // 7. Cancelada (Norte)
  {
    id: 'ret-8',
    folio: 'DEV-2026-0018',
    sourceType: 'Cliente',
    reference: 'PED-2026-0162',
    originClientOrBranch: 'Cliente Zona Tec',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'CEDIS Monterrey Norte',
    reason: 'Error operativo',
    notes: 'Solicitud de devolución duplicada por error de call center. Se canceló folio.',
    createdAt: '25 Ago 2026, 10:00',
    status: 'Cancelada',
    items: [
      {
        id: 'ri-8',
        uid: 'SC-UID-2026-000142',
        sku: 'SC-NAYT-FLOW-MAT',
        productName: 'Nayt Colchón Flow Basic White Matrimonial',
        brand: 'Nayt',
        size: 'Matrimonial',
        lotNumber: 'LOTE-2026-W33',
        originalEntryDate: '16 Ago 2026',
        suggestedDestination: 'REC-DEV-01',
        status: 'Cancelada',
      },
    ],
    timeline: [
      { id: 't-8-1', occurredAt: '25 Ago 10:00', actor: 'Mesa de Tráfico', message: 'Folio cancelado por duplicidad.', type: 'canceled' },
    ],
  },

  // ==========================================
  // CEDIS MONTERREY SUR
  // ==========================================
  // 8. Pendiente · Cliente Guadalupe
  {
    id: 'ret-4',
    folio: 'DEV-2026-0019',
    sourceType: 'Cliente',
    reference: 'PED-2026-0172',
    originClientOrBranch: 'Cliente Guadalupe (Ruta Sur 01)',
    warehouseId: 'wh-mty-sur',
    warehouseName: 'CEDIS Monterrey Sur',
    reason: 'Empaque dañado',
    notes: 'Plástico roto durante descarga en domicilio.',
    createdAt: '27 Ago 2026, 13:00',
    status: 'Pendiente',
    items: [
      {
        id: 'ri-9',
        uid: 'SC-UID-2026-000201',
        sku: 'SC-SPA-REC-IND',
        productName: 'Spring Air Colchón Record Individual',
        brand: 'Spring Air',
        size: 'Individual',
        lotNumber: 'LOTE-2026-W32',
        originalEntryDate: '08 Ago 2026',
        suggestedDestination: 'RET-SUR',
        status: 'Pendiente',
      },
    ],
    timeline: [
      { id: 't-4-1', occurredAt: '27 Ago 13:00', actor: 'Valeria Torres', message: 'Devolución registrada por chofer de Ruta Sur 01.', type: 'created' },
    ],
  },
  // 9. En recepción · Sucursal Cumbres
  {
    id: 'ret-9',
    folio: 'DEV-2026-0026',
    sourceType: 'Sucursal',
    reference: 'OTP-2026-0046',
    originClientOrBranch: 'Sucursal Cumbres',
    warehouseId: 'wh-mty-sur',
    warehouseName: 'CEDIS Monterrey Sur',
    reason: 'Cambio solicitado',
    notes: 'Retorno de unidad de showroom para recambio de exhibición.',
    createdAt: '27 Ago 2026, 12:30',
    status: 'En recepción',
    items: [
      {
        id: 'ri-10',
        uid: 'SC-UID-2026-000191',
        sku: 'SC-SPA-REC-IND',
        productName: 'Spring Air Colchón Record Individual',
        brand: 'Spring Air',
        size: 'Individual',
        lotNumber: 'LOTE-2026-W34',
        originalEntryDate: '12 Ago 2026',
        suggestedDestination: 'REC-DEV-02',
        status: 'Pendiente',
      },
    ],
    timeline: [
      { id: 't-9-1', occurredAt: '27 Ago 12:30', actor: 'Jorge Villarreal (Cumbres)', message: 'Traspaso de retorno recibido en rampa Sur.', type: 'created' },
    ],
  },
  // 10. Completa (Sur)
  {
    id: 'ret-10',
    folio: 'DEV-2026-0017',
    sourceType: 'Entrega rechazada',
    reference: 'PED-2026-0150',
    originClientOrBranch: 'Ruta Santiago 01',
    warehouseId: 'wh-mty-sur',
    warehouseName: 'CEDIS Monterrey Sur',
    reason: 'Entrega rechazada',
    notes: 'Cliente ausente en domicilio tras 3 intentos. Reingreso de unidad a almacén.',
    createdAt: '25 Ago 2026, 17:00',
    receivedAt: '25 Ago 2026, 18:30',
    status: 'Completa',
    items: [
      {
        id: 'ri-11',
        uid: 'SC-UID-2026-000135',
        sku: 'SC-REST-ORTO-MAT',
        productName: 'Restonic Colchón Ortopedic Matrimonial',
        brand: 'Restonic',
        size: 'Matrimonial',
        lotNumber: 'LOTE-2026-W33',
        originalEntryDate: '15 Ago 2026',
        returnDate: '25 Ago 2026',
        condition: 'En buen estado',
        suggestedDestination: 'REC-DEV-02',
        confirmedDestination: 'REC-DEV-02',
        status: 'Pendiente de acomodo',
      },
    ],
    timeline: [
      { id: 't-10-1', occurredAt: '25 Ago 17:00', actor: 'Valeria Torres', message: 'Reingreso de mercancía por cliente ausente.', type: 'completed' },
    ],
  },
  // 11. Con incidencia (Sur)
  {
    id: 'ret-11',
    folio: 'DEV-2026-0027',
    sourceType: 'Cliente',
    reference: 'PED-2026-0168',
    originClientOrBranch: 'Cliente Carretera Nacional',
    warehouseId: 'wh-mty-sur',
    warehouseName: 'CEDIS Monterrey Sur',
    reason: 'Empaque dañado',
    notes: 'Empaque desgarrado y etiqueta extraviada.',
    createdAt: '27 Ago 2026, 10:45',
    status: 'Con incidencia',
    items: [
      {
        id: 'ri-12',
        uid: 'SC-UID-2026-000301',
        sku: 'SC-SEA-CLB-KS',
        productName: 'Sealy Colchón Celebration Plus King Size',
        brand: 'Sealy',
        size: 'King Size',
        lotNumber: 'LOTE-2026-W35',
        originalEntryDate: '22 Ago 2026',
        condition: 'Requiere inspección',
        suggestedDestination: 'RET-SUR',
        confirmedDestination: 'RET-SUR',
        status: 'Con incidencia',
        notes: 'Incidencia INC-2026-0046 generada. Requiere reempaque y reimpresión de QR.',
      },
    ],
    timeline: [
      { id: 't-11-1', occurredAt: '27 Ago 10:45', actor: 'Valeria Torres', message: 'Reportó etiqueta extraviada y empaque dañado.', type: 'incident' },
    ],
  },
  // 12. Cancelada (Sur)
  {
    id: 'ret-12',
    folio: 'DEV-2026-0016',
    sourceType: 'Interna',
    reference: 'OTP-2026-0036',
    originClientOrBranch: 'Mesa de Calidad Sur',
    warehouseId: 'wh-mty-sur',
    warehouseName: 'CEDIS Monterrey Sur',
    reason: 'Error operativo',
    notes: 'Cancelada por reubicación interna en almacén sin necesidad de devolución.',
    createdAt: '24 Ago 2026, 11:00',
    status: 'Cancelada',
    items: [
      {
        id: 'ri-13',
        uid: 'SC-UID-2026-000136',
        sku: 'SC-REST-ORTO-MAT',
        productName: 'Restonic Colchón Ortopedic Matrimonial',
        brand: 'Restonic',
        size: 'Matrimonial',
        lotNumber: 'LOTE-2026-W33',
        originalEntryDate: '15 Ago 2026',
        suggestedDestination: 'REC-DEV-02',
        status: 'Cancelada',
      },
    ],
    timeline: [
      { id: 't-12-1', occurredAt: '24 Ago 11:00', actor: 'Valeria Torres', message: 'Cancelada.', type: 'canceled' },
    ],
  },
];

export const ELIGIBLE_RETURN_UNITS_DATABASE = [
  { uid: 'SC-UID-2026-000184', sku: 'SC-NAYT-FLOW-MAT', productName: 'Nayt Colchón Flow Basic White Matrimonial', brand: 'Nayt', size: 'Matrimonial', lotNumber: 'LOTE-2026-W34', originalEntryDate: '10 Ago 2026', lastKnownDestination: 'Cliente / Sucursal Valle Oriente' },
  { uid: 'SC-UID-2026-000101', sku: 'SC-NAYT-FLOW-IND', productName: 'Nayt Colchón Flow Basic White Individual', brand: 'Nayt', size: 'Individual', lotNumber: 'LOTE-2026-W31', originalEntryDate: '05 Ago 2026', lastKnownDestination: 'Sucursal Valle Oriente' },
  { uid: 'SC-UID-2026-000102', sku: 'SC-NAYT-FLOW-IND', productName: 'Nayt Colchón Flow Basic White Individual', brand: 'Nayt', size: 'Individual', lotNumber: 'LOTE-2026-W31', originalEntryDate: '05 Ago 2026', lastKnownDestination: 'Sucursal Valle Oriente' },
  { uid: 'SC-UID-2026-000211', sku: 'SC-REST-ORTO-MAT', productName: 'Restonic Colchón Ortopedic Matrimonial', brand: 'Restonic', size: 'Matrimonial', lotNumber: 'LOTE-2026-W33', originalEntryDate: '14 Ago 2026', lastKnownDestination: 'Cliente Pedido PED-2026-0189' },
  { uid: 'SC-UID-2026-000201', sku: 'SC-SPA-REC-IND', productName: 'Spring Air Colchón Record Individual', brand: 'Spring Air', size: 'Individual', lotNumber: 'LOTE-2026-W32', originalEntryDate: '08 Ago 2026', lastKnownDestination: 'Cliente Ruta Sur 01' },
];
