export type IncidentStatus = 
  | 'Abierta' 
  | 'En atención' 
  | 'Lista para cierre' 
  | 'Cerrada';

export type IncidentPriority = 
  | 'Baja' 
  | 'Media' 
  | 'Alta' 
  | 'Crítica';

export type IncidentType = 
  | 'Unidad no localizada'
  | 'Unidad incorrecta'
  | 'Diferencia de cantidad'
  | 'Artículo dañado'
  | 'Empaque dañado'
  | 'QR / etiqueta ilegible'
  | 'QR / etiqueta faltante'
  | 'Ubicación bloqueada'
  | 'Ubicación incorrecta'
  | 'Faltante físico'
  | 'Sobrante físico'
  | 'Unidad inesperada'
  | 'Daño operativo'
  | 'Otro';

export type IncidentSource = 
  | 'Reporte manual'
  | 'Entrada'
  | 'Acomodo'
  | 'Recolección'
  | 'Verificación de Salida'
  | 'Conteo'
  | 'Inventario'
  | 'Devolución';

export interface IncidentTimelineEntry {
  id: string;
  occurredAt: string;
  actor: string;
  role: string;
  message: string;
  type?: 'status_change' | 'note' | 'action' | 'resolution' | 'created';
}

export interface OperationalIncident {
  id: string;
  code: string; // ej. 'INC-2026-0034'
  title: string;
  description: string;
  incidentType: IncidentType;
  sourceModule: IncidentSource;
  priority: IncidentPriority;
  status: IncidentStatus;
  createdAt: string;
  lastActivityAt: string;
  reportedBy: string;
  warehouseId: string;
  warehouseName: string;
  locationCode?: string;
  uid?: string;
  sku?: string;
  productName?: string;
  brand?: string;
  size?: string;
  lotNumber?: string;
  sourceReference?: string; // ej. 'OR-2026-0118', 'REC-2026-0084', 'OTP-2026-0044', 'CC-2026-0044'
  quantityDifference?: {
    planned: number;
    counted: number;
    difference: number;
  };
  serialDifference?: {
    expectedUid: string;
    foundUid: string;
  };
  unitMovementsHistory?: {
    timestamp: string;
    type: string;
    from: string;
    to: string;
    user: string;
  }[];
  resolution?: string;
  closedAt?: string;
  closedBy?: string;
  timeline: IncidentTimelineEntry[];
}

export const INITIAL_OPERATIONAL_INCIDENTS: OperationalIncident[] = [
  // =========================================================================
  // 1. UNIDAD NO LOCALIZADA (2 ejemplos)
  // =========================================================================
  {
    id: 'inc-1',
    code: 'INC-2026-0034',
    title: 'Unidad no localizada durante recolección',
    description: 'El operador confirmó la ubicación A-B-03 según la orden de recolección OR-2026-0118, pero no encontró físicamente la unidad TAR-RTM-2026-000184 en la posición.',
    incidentType: 'Unidad no localizada',
    sourceModule: 'Recolección',
    priority: 'Alta',
    status: 'En atención',
    createdAt: '27 Ago 2026 21:48',
    lastActivityAt: '27 Ago 2026 22:31',
    reportedBy: 'Carlos Medina (Operador Mesa 01)',
    warehouseId: 'alm-rtm-mp',
    warehouseName: 'Almacén Materia Prima',
    locationCode: 'A-B-03',
    uid: 'TAR-RTM-2026-000184',
    sku: 'PT-MAN-002',
    productName: 'Manual Instructivo 48 Páginas Medifarma',
    brand: 'Black & Decker',
    size: 'Tarima 10,000 pzas',
    lotNumber: 'LOTE-2026-W34',
    sourceReference: 'OR-2026-0118',
    unitMovementsHistory: [
      { timestamp: '27 Ago 18:12', type: 'ACOMODO', from: 'REC-01', to: 'A-B-03', user: 'Operador Acomodo 01' },
      { timestamp: '27 Ago 21:48', type: 'RECOLECCIÓN INICIADA', from: 'A-B-03', to: 'A-B-03', user: 'Carlos Medina' },
    ],
    timeline: [
      { id: 't-1', occurredAt: '27 Ago 21:48', actor: 'Carlos Medina', role: 'Operador', message: 'Incidencia creada durante recolección en parada #3.', type: 'created' },
      { id: 't-2', occurredAt: '27 Ago 22:15', actor: 'Laura Gómez', role: 'Supervisor', message: 'Iniciando barrido visual en pasillo A.', type: 'note' },
    ],
  },
  {
    id: 'inc-2',
    code: 'INC-2026-0035',
    title: 'Unidad no encontrada en rack de CEDIS Sur',
    description: 'En orden OR-2026-0125, la unidad TAR-RTM-2026-000302 no se encontró en la posición B-B-02 indicada por el sistema.',
    incidentType: 'Unidad no localizada',
    sourceModule: 'Recolección',
    priority: 'Media',
    status: 'Abierta',
    createdAt: '27 Ago 2026 12:20',
    lastActivityAt: '27 Ago 2026 12:20',
    reportedBy: 'Valeria Torres (Operador Mesa 02)',
    warehouseId: 'alm-rtm-pt',
    warehouseName: 'Almacén Producto Terminado',
    locationCode: 'B-B-02',
    uid: 'TAR-RTM-2026-000302',
    sku: 'SUS-PAP-001',
    productName: 'Papel Couché 90 g Pliegos BioPapel',
    brand: 'Schneider Electric',
    size: 'Tarima 20,000 pzas',
    lotNumber: 'LOTE-2026-W35',
    sourceReference: 'OR-2026-0125',
    timeline: [
      { id: 't-35-1', occurredAt: '27 Ago 12:20', actor: 'Valeria Torres', role: 'Operador', message: 'Posición B-B-02 vacía al momento de picking.', type: 'created' },
    ],
  },

  // =========================================================================
  // 2. UNIDAD INCORRECTA (2 ejemplos)
  // =========================================================================
  {
    id: 'inc-3',
    code: 'INC-2026-0036',
    title: 'UID equivocada presentada en rampa de salida',
    description: 'En verificación VS-2026-0042 se escaneó la unidad TAR-RTM-2026-000109 en lugar de la asignada TAR-RTM-2026-000105.',
    incidentType: 'Unidad incorrecta',
    sourceModule: 'Verificación de Salida',
    priority: 'Alta',
    status: 'En atención',
    createdAt: '27 Ago 2026 10:20',
    lastActivityAt: '27 Ago 2026 10:45',
    reportedBy: 'Carlos Medina (Operador Mesa 01)',
    warehouseId: 'alm-rtm-mp',
    warehouseName: 'Almacén Materia Prima',
    locationCode: 'EMB-02',
    uid: 'TAR-RTM-2026-000109',
    sku: 'PT-MAN-001',
    productName: 'Manual Instructivo 24 Páginas Black & Decker',
    brand: 'Black & Decker',
    size: 'Individual',
    lotNumber: 'LOTE-2026-W31',
    sourceReference: 'VS-2026-0042',
    serialDifference: { expectedUid: 'TAR-RTM-2026-000105', foundUid: 'TAR-RTM-2026-000109' },
    timeline: [
      { id: 't-36-1', occurredAt: '27 Ago 10:20', actor: 'Carlos Medina', role: 'Verificador', message: 'Discrepancia serial detectada en carril EMB-02.', type: 'created' },
      { id: 't-36-2', occurredAt: '27 Ago 10:45', actor: 'Admin Demo', role: 'Supervisor', message: 'Se autorizó sustitución formal en sistema para liberar ruta.', type: 'action' },
    ],
  },
  {
    id: 'inc-4',
    code: 'INC-2026-0037',
    title: 'Artículo con medida incorrecta en recepción de proveedor',
    description: 'En OC-2026-0092 de Medifarma se recibió 1 bobina con especificación distinta a la tarima rotulada.',
    incidentType: 'Unidad incorrecta',
    sourceModule: 'Entrada',
    priority: 'Media',
    status: 'Lista para cierre',
    createdAt: '27 Ago 2026 12:40',
    lastActivityAt: '27 Ago 2026 14:00',
    reportedBy: 'Carlos Medina (Operador Mesa 01)',
    warehouseId: 'alm-rtm-mp',
    warehouseName: 'Almacén Materia Prima',
    locationCode: 'REC-01',
    sku: 'PT-ETQ-001',
    productName: 'Etiqueta Farmacéutica 4x6" Medifarma',
    brand: 'Medifarma',
    size: 'Individual',
    lotNumber: 'LOTE-2026-W34',
    sourceReference: 'OC-2026-0092',
    resolution: 'Proveedor aceptó nota de crédito por la pieza no solicitada y se envió a cuarentena.',
    timeline: [
      { id: 't-37-1', occurredAt: '27 Ago 12:40', actor: 'Carlos Medina', role: 'Recepción', message: 'Detectado artículo físico distinto al albarán.', type: 'created' },
      { id: 't-37-2', occurredAt: '27 Ago 14:00', actor: 'Laura Gómez', role: 'Supervisor', message: 'Acuerdo comercial con proveedor completado.', type: 'resolution' },
    ],
  },

  // =========================================================================
  // 3. DIFERENCIA DE CANTIDAD (2 ejemplos)
  // =========================================================================
  {
    id: 'inc-5',
    code: 'INC-2026-0038',
    title: 'Discrepancia en conteo cíclico de Pasillo A',
    description: 'El conteo físico arrojó 12 piezas de PT-MAN-001 en lugar de 14 registradas en sistema.',
    incidentType: 'Diferencia de cantidad',
    sourceModule: 'Conteo',
    priority: 'Alta',
    status: 'En atención',
    createdAt: '27 Ago 2026 08:30',
    lastActivityAt: '27 Ago 2026 09:15',
    reportedBy: 'Auditor de Inventarios',
    warehouseId: 'alm-rtm-mp',
    warehouseName: 'Almacén Materia Prima',
    locationCode: 'A-A-01',
    sku: 'PT-MAN-001',
    productName: 'Manual Instructivo 24 Páginas Black & Decker',
    brand: 'Black & Decker',
    size: 'Individual',
    lotNumber: 'LOTE-2026-W31',
    quantityDifference: { planned: 14, counted: 12, difference: -2 },
    timeline: [
      { id: 't-38-1', occurredAt: '27 Ago 08:30', actor: 'Auditor Conteo', role: 'Auditoría', message: 'Diferencia negativa de 2 unidades.', type: 'created' },
    ],
  },
  {
    id: 'inc-6',
    code: 'INC-2026-0039',
    title: 'Diferencia de unidades en traspaso a Matamoros',
    description: 'En recepción de traspaso OTP-2026-0045 llegaron 7 unidades de 8 amparadas en remisión.',
    incidentType: 'Diferencia de cantidad',
    sourceModule: 'Entrada',
    priority: 'Media',
    status: 'Abierta',
    createdAt: '27 Ago 2026 13:10',
    lastActivityAt: '27 Ago 2026 13:10',
    reportedBy: 'Jorge Villarreal (Almacén Matamoros)',
    warehouseId: 'wh-matamoros',
    warehouseName: 'Almacén Matamoros',
    locationCode: 'REC-MAT',
    sku: 'PT-ETQ-001',
    productName: 'Etiqueta Farmacéutica 4x6" Medifarma',
    brand: 'Medifarma',
    size: 'Individual',
    lotNumber: 'LOTE-2026-W34',
    sourceReference: 'OTP-2026-0045',
    quantityDifference: { planned: 8, counted: 7, difference: -1 },
    timeline: [
      { id: 't-39-1', occurredAt: '27 Ago 13:10', actor: 'Jorge Villarreal', role: 'Almacén', message: 'Faltante de 1 pieza al momento de corte de precinto.', type: 'created' },
    ],
  },

  // =========================================================================
  // 4. ARTÍCULO DAÑADO (2 ejemplos)
  // =========================================================================
  {
    id: 'inc-7',
    code: 'INC-2026-0040',
    title: 'Mancha en cubierta textil en descarga de devolución',
    description: 'Unidad TAR-RTM-2026-000199 recibida de cliente con mancha de aceite hidráulico en esquina.',
    incidentType: 'Artículo dañado',
    sourceModule: 'Devolución',
    priority: 'Alta',
    status: 'En atención',
    createdAt: '27 Ago 2026 13:40',
    lastActivityAt: '27 Ago 2026 14:15',
    reportedBy: 'Carlos Medina (Operador Mesa 01)',
    warehouseId: 'alm-rtm-mp',
    warehouseName: 'Almacén Materia Prima',
    locationCode: 'REC-DEV-01',
    uid: 'TAR-RTM-2026-000199',
    sku: 'FLX-BOP-001',
    productName: 'Película BOPP Transparente 35 micras Avery',
    brand: 'Schneider Electric',
    size: 'Bobina 1,500 m',
    lotNumber: 'LOTE-2026-W35',
    sourceReference: 'DEV-2026-0025',
    timeline: [
      { id: 't-40-1', occurredAt: '27 Ago 13:40', actor: 'Carlos Medina', role: 'Recepción', message: 'Unidad trasladada a área de Retrabajo RET-NORTE.', type: 'created' },
    ],
  },
  {
    id: 'inc-8',
    code: 'INC-2026-0041',
    title: 'Resorte deformado por golpe lateral en maniobra',
    description: 'En CEDIS Sur se detectó deformación estructural en el costado de la unidad TAR-RTM-2026-000306.',
    incidentType: 'Artículo dañado',
    sourceModule: 'Inventario',
    priority: 'Crítica',
    status: 'Abierta',
    createdAt: '27 Ago 2026 11:15',
    lastActivityAt: '27 Ago 2026 11:15',
    reportedBy: 'Valeria Torres (Operador Mesa 02)',
    warehouseId: 'alm-rtm-pt',
    warehouseName: 'Almacén Producto Terminado',
    locationCode: 'B-A-03',
    uid: 'TAR-RTM-2026-000306',
    sku: 'PT-BLI-001',
    productName: 'Blister Card Termosellable Stanley Tools',
    brand: 'Stanley Tools',
    size: 'Tarima 10,000 pzas',
    lotNumber: 'LOTE-2026-W34',
    timeline: [
      { id: 't-41-1', occurredAt: '27 Ago 11:15', actor: 'Valeria Torres', role: 'Supervisor', message: 'Bloqueo preventivo de la unidad en sistema.', type: 'created' },
    ],
  },

  // =========================================================================
  // 5. EMPAQUE DAÑADO (2 ejemplos)
  // =========================================================================
  {
    id: 'inc-9',
    code: 'INC-2026-0042',
    title: 'Plástico térmico rasgado en recepción OC-2026-0091',
    description: 'Tarima #8 de Avery Dennison arribó con flejado rasgado en descarga en REC-01.',
    incidentType: 'Empaque dañado',
    sourceModule: 'Entrada',
    priority: 'Media',
    status: 'Cerrada',
    createdAt: '27 Ago 2026 10:15',
    lastActivityAt: '27 Ago 2026 11:30',
    reportedBy: 'Carlos Medina (Operador Mesa 01)',
    warehouseId: 'alm-rtm-mp',
    warehouseName: 'Almacén Materia Prima',
    locationCode: 'REC-01',
    sku: 'PT-MAN-001',
    productName: 'Cartón Plegadizo Caple 24 pts Sultana',
    brand: 'Avery Dennison',
    size: 'Individual',
    lotNumber: 'LOTE-2026-W34',
    sourceReference: 'OC-2026-0091',
    resolution: 'Se colocó flejado y esquineros nuevos y se validó estado impecable del material.',
    closedAt: '27 Ago 2026 11:30',
    closedBy: 'Laura Gómez (Supervisora Calidad)',
    timeline: [
      { id: 't-42-1', occurredAt: '27 Ago 10:15', actor: 'Carlos Medina', role: 'Recepción', message: 'Rasgadura reportada.', type: 'created' },
      { id: 't-42-2', occurredAt: '27 Ago 11:30', actor: 'Laura Gómez', role: 'Calidad', message: 'Reempaque completado satisfactoriamente.', type: 'resolution' },
    ],
  },
  {
    id: 'inc-10',
    code: 'INC-2026-0043',
    title: 'Empaque roto en traslado a Almacén Auxiliar Reynosa',
    description: 'En traspaso OTP-2026-0044 se detectó funda rota al descargar en REC-SUC-VO.',
    incidentType: 'Empaque dañado',
    sourceModule: 'Entrada',
    priority: 'Baja',
    status: 'Cerrada',
    createdAt: '27 Ago 2026 11:40',
    lastActivityAt: '27 Ago 2026 12:20',
    reportedBy: 'Brenda Cavazos (Almacén Auxiliar Reynosa)',
    warehouseId: 'wh-suc-valle-oriente',
    warehouseName: 'Almacén Auxiliar Reynosa',
    locationCode: 'REC-SUC-VO',
    uid: 'TAR-RTM-2026-000181',
    sku: 'PT-MAN-001',
    productName: 'Manual Instructivo 24 Páginas Black & Decker',
    brand: 'Black & Decker',
    size: 'Individual',
    lotNumber: 'LOTE-2026-W34',
    sourceReference: 'OTP-2026-0044',
    resolution: 'Se colocó en bahía de inspección SHOW-02 donde se verificó la muestra técnica.',
    closedAt: '27 Ago 2026 12:20',
    closedBy: 'Brenda Cavazos',
    timeline: [
      { id: 't-43-1', occurredAt: '27 Ago 11:40', actor: 'Brenda Cavazos', role: 'Sucursal', message: 'Reportó empaque roto.', type: 'created' },
      { id: 't-43-2', occurredAt: '27 Ago 12:20', actor: 'Brenda Cavazos', role: 'Sucursal', message: 'Asignado a exhibición activa.', type: 'resolution' },
    ],
  },

  // =========================================================================
  // 6. QR / ETIQUETA ILEGIBLE (2 ejemplos)
  // =========================================================================
  {
    id: 'inc-11',
    code: 'INC-2026-0030',
    title: 'QR desgastado por fricción en tarima de madera',
    description: 'El escáner de mano no pudo decodificar el QR de la unidad TAR-RTM-2026-000121 en B-A-01.',
    incidentType: 'QR / etiqueta ilegible',
    sourceModule: 'Inventario',
    priority: 'Media',
    status: 'Cerrada',
    createdAt: '26 Ago 2026 16:50',
    lastActivityAt: '26 Ago 2026 17:15',
    reportedBy: 'Carlos Medina (Operador Mesa 01)',
    warehouseId: 'alm-rtm-mp',
    warehouseName: 'Almacén Materia Prima',
    locationCode: 'B-A-01',
    uid: 'TAR-RTM-2026-000121',
    sku: 'PT-ETQ-001',
    productName: 'Etiqueta Farmacéutica 4x6" Medifarma',
    brand: 'Medifarma',
    size: 'Individual',
    lotNumber: 'LOTE-2026-W32',
    resolution: 'Reimpresión completada exitosamente bajo folio REP-2026-0003.',
    closedAt: '26 Ago 2026 17:15',
    closedBy: 'Carlos Medina',
    timeline: [
      { id: 't-30-1', occurredAt: '26 Ago 16:50', actor: 'Carlos Medina', role: 'Operador', message: 'QR ilegible.', type: 'created' },
      { id: 't-30-2', occurredAt: '26 Ago 17:15', actor: 'Carlos Medina', role: 'Operador', message: 'Etiqueta reimpresa y adherida.', type: 'resolution' },
    ],
  },
  {
    id: 'inc-12',
    code: 'INC-2026-0044',
    title: 'QR borroso en recepción OC-2026-0096 en CEDIS Sur',
    description: 'Etiqueta térmica con mancha de tinta en código 2D en unidad TAR-RTM-2026-000302.',
    incidentType: 'QR / etiqueta ilegible',
    sourceModule: 'Entrada',
    priority: 'Baja',
    status: 'Cerrada',
    createdAt: '27 Ago 2026 10:00',
    lastActivityAt: '27 Ago 2026 10:30',
    reportedBy: 'Valeria Torres (Operador Mesa 02)',
    warehouseId: 'alm-rtm-pt',
    warehouseName: 'Almacén Producto Terminado',
    locationCode: 'REC-02',
    uid: 'TAR-RTM-2026-000302',
    sku: 'PT-BLI-002',
    productName: 'Blister Card Termosellable Stanley Tools',
    brand: 'Stanley Tools',
    size: 'Tarima 20,000 pzas',
    lotNumber: 'LOTE-2026-W35',
    sourceReference: 'OC-2026-0096',
    resolution: 'Reimpresa en Mesa de Reimpresión Sur bajo folio REP-2026-0011.',
    closedAt: '27 Ago 2026 10:30',
    closedBy: 'Valeria Torres',
    timeline: [
      { id: 't-44-1', occurredAt: '27 Ago 10:00', actor: 'Valeria Torres', role: 'Recepción', message: 'Código QR no escaneable.', type: 'created' },
      { id: 't-44-2', occurredAt: '27 Ago 10:30', actor: 'Valeria Torres', role: 'Recepción', message: 'Etiqueta reimpresa.', type: 'resolution' },
    ],
  },

  // =========================================================================
  // 7. QR / ETIQUETA FALTANTE (2 ejemplos)
  // =========================================================================
  {
    id: 'inc-13',
    code: 'INC-2026-0045',
    title: 'Tarima sin etiqueta de identificación en devolución',
    description: 'En DEV-2026-0027 el bulto arribó sin etiqueta térmica en el empaque.',
    incidentType: 'QR / etiqueta faltante',
    sourceModule: 'Devolución',
    priority: 'Alta',
    status: 'En atención',
    createdAt: '27 Ago 2026 10:45',
    lastActivityAt: '27 Ago 2026 11:20',
    reportedBy: 'Valeria Torres (Operador Mesa 02)',
    warehouseId: 'alm-rtm-pt',
    warehouseName: 'Almacén Producto Terminado',
    locationCode: 'RET-SUR',
    uid: 'TAR-RTM-2026-000301',
    sku: 'SUS-PAP-001',
    productName: 'Papel Couché 90 g Pliegos BioPapel',
    brand: 'Schneider Electric',
    size: 'Tarima 20,000 pzas',
    lotNumber: 'LOTE-2026-W35',
    sourceReference: 'DEV-2026-0027',
    timeline: [
      { id: 't-45-1', occurredAt: '27 Ago 10:45', actor: 'Valeria Torres', role: 'Devoluciones', message: 'Bulto sin etiqueta de origen.', type: 'created' },
    ],
  },
  {
    id: 'inc-14',
    code: 'INC-2026-0046',
    title: 'Etiqueta de ubicación desprendida en Pasillo B Nivel A',
    description: 'El código de barras de la posición B-A-04 se desprendió del parante metálico.',
    incidentType: 'QR / etiqueta faltante',
    sourceModule: 'Inventario',
    priority: 'Baja',
    status: 'Lista para cierre',
    createdAt: '27 Ago 2026 09:00',
    lastActivityAt: '27 Ago 2026 09:30',
    reportedBy: 'Roberto Garza (Operador Acomodo)',
    warehouseId: 'alm-rtm-mp',
    warehouseName: 'Almacén Materia Prima',
    locationCode: 'B-A-04',
    timeline: [
      { id: 't-46-1', occurredAt: '27 Ago 09:00', actor: 'Roberto Garza', role: 'Operador', message: 'Etiqueta de rack caída.', type: 'created' },
      { id: 't-46-2', occurredAt: '27 Ago 09:30', actor: 'Laura Gómez', role: 'Supervisor', message: 'Reimpresión generada y adherida.', type: 'resolution' },
    ],
  },

  // =========================================================================
  // 8. UBICACIÓN BLOQUEADA (2 ejemplos)
  // =========================================================================
  {
    id: 'inc-15',
    code: 'INC-2026-0047',
    title: 'Posición A-A-04 bloqueada por mantenimiento de rack',
    description: 'En orden OA-2026-0035 la posición sugerida A-A-04 estaba temporalmente inhabilitada por ajuste de travesaños.',
    incidentType: 'Ubicación bloqueada',
    sourceModule: 'Acomodo',
    priority: 'Media',
    status: 'Cerrada',
    createdAt: '27 Ago 2026 09:15',
    lastActivityAt: '27 Ago 2026 10:00',
    reportedBy: 'Carlos Medina (Operador Mesa 01)',
    warehouseId: 'alm-rtm-mp',
    warehouseName: 'Almacén Materia Prima',
    locationCode: 'A-A-04',
    sourceReference: 'OA-2026-0035',
    resolution: 'Operador reubicó la unidad en A-B-05 y mantenimiento liberó la posición a las 10:00.',
    closedAt: '27 Ago 2026 10:00',
    closedBy: 'Laura Gómez',
    timeline: [
      { id: 't-47-1', occurredAt: '27 Ago 09:15', actor: 'Carlos Medina', role: 'Acomodo', message: 'Posición bloqueada por mantenimiento.', type: 'created' },
    ],
  },
  {
    id: 'inc-16',
    code: 'INC-2026-0048',
    title: 'Carril de embarque EMB-04 bloqueado por montacargas en carga',
    description: 'Carril EMB-04 no disponible para posicionar orden VS-2026-0037.',
    incidentType: 'Ubicación bloqueada',
    sourceModule: 'Verificación de Salida',
    priority: 'Baja',
    status: 'Cerrada',
    createdAt: '25 Ago 2026 14:10',
    lastActivityAt: '25 Ago 2026 14:40',
    reportedBy: 'Carlos Medina (Operador Mesa 01)',
    warehouseId: 'alm-rtm-mp',
    warehouseName: 'Almacén Materia Prima',
    locationCode: 'EMB-04',
    sourceReference: 'VS-2026-0037',
    resolution: 'Se reasignó la maniobra al carril EMB-05 libre.',
    closedAt: '25 Ago 2026 14:40',
    closedBy: 'Carlos Medina',
    timeline: [
      { id: 't-48-1', occurredAt: '25 Ago 14:10', actor: 'Carlos Medina', role: 'Verificación', message: 'Carril ocupado.', type: 'created' },
    ],
  },

  // =========================================================================
  // 9. UBICACIÓN INCORRECTA (2 ejemplos)
  // =========================================================================
  {
    id: 'inc-17',
    code: 'INC-2026-0049',
    title: 'Tarima almacenada en posición no asignada en Pasillo B',
    description: 'Se encontró la unidad TAR-RTM-2026-000135 en B-B-01 cuando su registro figuraba en B-A-01.',
    incidentType: 'Ubicación incorrecta',
    sourceModule: 'Inventario',
    priority: 'Media',
    status: 'Cerrada',
    createdAt: '27 Ago 2026 08:45',
    lastActivityAt: '27 Ago 2026 09:15',
    reportedBy: 'Auditor de Calidad',
    warehouseId: 'alm-rtm-pt',
    warehouseName: 'Almacén Producto Terminado',
    locationCode: 'B-B-01',
    uid: 'TAR-RTM-2026-000135',
    sku: 'PT-BLI-001',
    productName: 'Blister Card Termosellable Stanley Tools',
    brand: 'Stanley Tools',
    size: 'Tarima 10,000 pzas',
    lotNumber: 'LOTE-2026-W33',
    resolution: 'Se actualizó la ubicación real en sistema mediante escaneo de reacomodo.',
    closedAt: '27 Ago 2026 09:15',
    closedBy: 'Valeria Torres',
    timeline: [
      { id: 't-49-1', occurredAt: '27 Ago 08:45', actor: 'Auditor', role: 'Inventario', message: 'Discrepancia de ubicación.', type: 'created' },
    ],
  },
  {
    id: 'inc-18',
    code: 'INC-2026-0050',
    title: 'Unidad de muestra colocada en bahía equivocada en Staging',
    description: 'En Almacén Auxiliar Reynosa el modelo PT-MAN-001 fue colocado en SHOW-01 en lugar de SHOW-02.',
    incidentType: 'Ubicación incorrecta',
    sourceModule: 'Acomodo',
    priority: 'Baja',
    status: 'Cerrada',
    createdAt: '27 Ago 2026 12:05',
    lastActivityAt: '27 Ago 2026 12:20',
    reportedBy: 'Brenda Cavazos (Almacén Auxiliar Reynosa)',
    warehouseId: 'wh-suc-valle-oriente',
    warehouseName: 'Almacén Auxiliar Reynosa',
    locationCode: 'SHOW-01',
    uid: 'TAR-RTM-2026-000181',
    sku: 'PT-MAN-001',
    productName: 'Manual Instructivo 24 Páginas Black & Decker',
    brand: 'Black & Decker',
    size: 'Individual',
    lotNumber: 'LOTE-2026-W34',
    resolution: 'Se reubicó en bahía SHOW-02 con su ficha técnica correspondiente.',
    closedAt: '27 Ago 2026 12:20',
    closedBy: 'Brenda Cavazos',
    timeline: [
      { id: 't-50-1', occurredAt: '27 Ago 12:05', actor: 'Brenda Cavazos', role: 'Sucursal', message: 'Bahía incorrecta.', type: 'created' },
    ],
  },

  // =========================================================================
  // 10. FALTANTE FÍSICO (2 ejemplos)
  // =========================================================================
  {
    id: 'inc-19',
    code: 'INC-2026-0051',
    title: 'Faltante físico en carril de embarque Sur',
    description: 'En VS-2026-0045 se presentaron 2 piezas en rampa pero la orden requería 3.',
    incidentType: 'Faltante físico',
    sourceModule: 'Verificación de Salida',
    priority: 'Alta',
    status: 'En atención',
    createdAt: '27 Ago 2026 11:45',
    lastActivityAt: '27 Ago 2026 12:10',
    reportedBy: 'Miguel Ángel Soto (Operador Sur)',
    warehouseId: 'alm-rtm-pt',
    warehouseName: 'Almacén Producto Terminado',
    locationCode: 'EMB-03',
    sku: 'PT-ETQ-001',
    productName: 'Etiqueta Farmacéutica 4x6" Medifarma',
    brand: 'Medifarma',
    size: 'Individual',
    lotNumber: 'LOTE-2026-W32',
    sourceReference: 'VS-2026-0045',
    quantityDifference: { planned: 3, counted: 2, difference: -1 },
    timeline: [
      { id: 't-51-1', occurredAt: '27 Ago 11:45', actor: 'Miguel Ángel Soto', role: 'Verificación', message: 'Falta 1 unidad.', type: 'created' },
    ],
  },
  {
    id: 'inc-20',
    code: 'INC-2026-0052',
    title: 'Faltante en recepción de tarima Bio-Pappel',
    description: 'En OC-2026-0081 se reportó faltante de 1 tarima de 12,000 folletos en albarán de entrega.',
    incidentType: 'Faltante físico',
    sourceModule: 'Entrada',
    priority: 'Media',
    status: 'Abierta',
    createdAt: '27 Ago 2026 10:15',
    lastActivityAt: '27 Ago 2026 10:15',
    reportedBy: 'Carlos Medina (Operador Mesa 01)',
    warehouseId: 'alm-rtm-mp',
    warehouseName: 'Almacén Materia Prima',
    locationCode: 'REC-01',
    sku: 'PT-MAN-002',
    productName: 'Manual Instructivo 24 Páginas Black & Decker',
    brand: 'Black & Decker',
    size: 'Bobina 1,500 m',
    lotNumber: 'LOTE-2026-W34',
    sourceReference: 'OC-2026-0081',
    quantityDifference: { planned: 1, counted: 0, difference: -1 },
    timeline: [
      { id: 't-52-1', occurredAt: '27 Ago 10:15', actor: 'Carlos Medina', role: 'Recepción', message: 'Pieza no entregada por transportista.', type: 'created' },
    ],
  },

  // =========================================================================
  // 11. SOBRANTE FÍSICO (2 ejemplos)
  // =========================================================================
  {
    id: 'inc-21',
    code: 'INC-2026-0053',
    title: 'Sobrante de 1 unidad en descarga de proveedor América',
    description: 'En OC-2026-0082 se descargaron 7 tarimas cuando la orden contemplaba 6.',
    incidentType: 'Sobrante físico',
    sourceModule: 'Entrada',
    priority: 'Baja',
    status: 'Lista para cierre',
    createdAt: '27 Ago 2026 11:00',
    lastActivityAt: '27 Ago 2026 11:45',
    reportedBy: 'Carlos Medina (Operador Mesa 01)',
    warehouseId: 'alm-rtm-mp',
    warehouseName: 'Almacén Materia Prima',
    locationCode: 'REC-01',
    sku: 'PT-MAN-001',
    productName: 'Cartón Plegadizo Caple 24 pts Sultana',
    brand: 'Avery Dennison',
    size: 'Individual',
    lotNumber: 'LOTE-2026-W34',
    sourceReference: 'OC-2026-0082',
    quantityDifference: { planned: 6, counted: 7, difference: 1 },
    resolution: 'Se notificó a compras para ampliación de orden de compra o devolución al chofer.',
    timeline: [
      { id: 't-53-1', occurredAt: '27 Ago 11:00', actor: 'Carlos Medina', role: 'Recepción', message: 'Sobrante físico.', type: 'created' },
    ],
  },
  {
    id: 'inc-22',
    code: 'INC-2026-0054',
    title: 'Unidad sobrante detectada en inventario de Almacén Matamoros',
    description: 'En conteo de bodega local se halló 1 tarima no reflejada en saldo.',
    incidentType: 'Sobrante físico',
    sourceModule: 'Conteo',
    priority: 'Baja',
    status: 'Cerrada',
    createdAt: '26 Ago 2026 18:00',
    lastActivityAt: '27 Ago 2026 09:00',
    reportedBy: 'Jorge Villarreal (Almacén Matamoros)',
    warehouseId: 'wh-matamoros',
    warehouseName: 'Almacén Matamoros',
    locationCode: 'BOD-MAT-01',
    sku: 'PT-ETQ-001',
    productName: 'Etiqueta Farmacéutica 4x6" Medifarma',
    brand: 'Medifarma',
    size: 'Individual',
    lotNumber: 'LOTE-2026-W34',
    resolution: 'Se dio de alta el UID correspondiente tras validar remisión de traspaso anterior.',
    closedAt: '27 Ago 2026 09:00',
    closedBy: 'Jorge Villarreal',
    timeline: [
      { id: 't-54-1', occurredAt: '26 Ago 18:00', actor: 'Jorge Villarreal', role: 'Almacén', message: 'Sobrante detectado.', type: 'created' },
    ],
  },

  // =========================================================================
  // 12. UNIDAD INESPERADA (2 ejemplos)
  // =========================================================================
  {
    id: 'inc-23',
    code: 'INC-2026-0055',
    title: 'UID no registrada en remisión escaneada en rampa',
    description: 'En recepción REC-01 se escaneó la unidad TAR-RTM-2026-000999 que no pertenecía al albarán del proveedor.',
    incidentType: 'Unidad inesperada',
    sourceModule: 'Entrada',
    priority: 'Media',
    status: 'En atención',
    createdAt: '27 Ago 2026 10:30',
    lastActivityAt: '27 Ago 2026 11:00',
    reportedBy: 'Carlos Medina (Operador Mesa 01)',
    warehouseId: 'alm-rtm-mp',
    warehouseName: 'Almacén Materia Prima',
    locationCode: 'REC-01',
    uid: 'TAR-RTM-2026-000999',
    sku: 'PT-MAN-001',
    productName: 'Manual Instructivo 24 Páginas Black & Decker',
    brand: 'Black & Decker',
    size: 'Individual',
    lotNumber: 'LOTE-2026-W34',
    timeline: [
      { id: 't-55-1', occurredAt: '27 Ago 10:30', actor: 'Carlos Medina', role: 'Recepción', message: 'UID no reconocida.', type: 'created' },
    ],
  },
  {
    id: 'inc-24',
    code: 'INC-2026-0056',
    title: 'Unidad de otro almacén arribó en traspaso inter-almacenes',
    description: 'En Almacén Matamoros se recibió 1 bulto rotulado para Almacén Auxiliar Reynosa.',
    incidentType: 'Unidad inesperada',
    sourceModule: 'Entrada',
    priority: 'Media',
    status: 'Abierta',
    createdAt: '27 Ago 2026 13:30',
    lastActivityAt: '27 Ago 2026 13:30',
    reportedBy: 'Jorge Villarreal (Almacén Matamoros)',
    warehouseId: 'wh-matamoros',
    warehouseName: 'Almacén Matamoros',
    locationCode: 'REC-MAT',
    uid: 'TAR-RTM-2026-000183',
    sku: 'PT-MAN-001',
    productName: 'Manual Instructivo 24 Páginas Black & Decker',
    brand: 'Black & Decker',
    size: 'Individual',
    lotNumber: 'LOTE-2026-W34',
    timeline: [
      { id: 't-56-1', occurredAt: '27 Ago 13:30', actor: 'Jorge Villarreal', role: 'Almacén', message: 'Bulto con destino Reynosa recibido en Matamoros.', type: 'created' },
    ],
  },

  // =========================================================================
  // 13. DAÑO OPERATIVO (2 ejemplos)
  // =========================================================================
  {
    id: 'inc-25',
    code: 'INC-2026-0057',
    title: 'Enganche con uña de montacargas en pasillo A',
    description: 'Durante maniobra de acomodo con montacargas se perforó la bolsa plástica y empaque protector exterior.',
    incidentType: 'Daño operativo',
    sourceModule: 'Acomodo',
    priority: 'Crítica',
    status: 'En atención',
    createdAt: '27 Ago 2026 09:45',
    lastActivityAt: '27 Ago 2026 10:15',
    reportedBy: 'Roberto Garza (Operador Acomodo)',
    warehouseId: 'alm-rtm-mp',
    warehouseName: 'Almacén Materia Prima',
    locationCode: 'A-B-02',
    uid: 'TAR-RTM-2026-000174',
    sku: 'PT-MAN-001',
    productName: 'Manual Instructivo 24 Páginas Black & Decker',
    brand: 'Black & Decker',
    size: 'Individual',
    lotNumber: 'LOTE-2026-W34',
    timeline: [
      { id: 't-57-1', occurredAt: '27 Ago 09:45', actor: 'Roberto Garza', role: 'Operador', message: 'Incidente con uña de montacargas.', type: 'created' },
    ],
  },
  {
    id: 'inc-26',
    code: 'INC-2026-0058',
    title: 'Caída de bulto en rampa de descarga CEDIS Sur',
    description: 'Deslizamiento accidental de 1 tarima de producto terminado al bajar de plataforma de tractocamión.',
    incidentType: 'Daño operativo',
    sourceModule: 'Entrada',
    priority: 'Alta',
    status: 'Abierta',
    createdAt: '27 Ago 2026 11:45',
    lastActivityAt: '27 Ago 2026 11:45',
    reportedBy: 'Valeria Torres (Operador Mesa 02)',
    warehouseId: 'alm-rtm-pt',
    warehouseName: 'Almacén Producto Terminado',
    locationCode: 'REC-02',
    uid: 'TAR-RTM-2026-000304',
    sku: 'PT-ETQ-001',
    productName: 'Etiqueta Farmacéutica 4x6" Medifarma',
    brand: 'Medifarma',
    size: 'Individual',
    lotNumber: 'LOTE-2026-W35',
    sourceReference: 'OC-2026-0097',
    timeline: [
      { id: 't-58-1', occurredAt: '27 Ago 11:45', actor: 'Valeria Torres', role: 'Recepción', message: 'Caída de bulto en rampa.', type: 'created' },
    ],
  },

  // =========================================================================
  // 14. OTRO (2 ejemplos)
  // =========================================================================
  {
    id: 'inc-27',
    code: 'INC-2026-0059',
    title: 'Humedad ambiental elevada en sector C de CEDIS Norte',
    description: 'Sensor de humedad en Pasillo C registró 78% HR. Se activaron deshumidificadores preventivos.',
    incidentType: 'Otro',
    sourceModule: 'Reporte manual',
    priority: 'Baja',
    status: 'Cerrada',
    createdAt: '26 Ago 2026 08:00',
    lastActivityAt: '26 Ago 2026 11:00',
    reportedBy: 'Laura Gómez (Supervisora Calidad)',
    warehouseId: 'alm-rtm-mp',
    warehouseName: 'Almacén Materia Prima',
    locationCode: 'C-A-01',
    resolution: 'Humedad normalizada a 45% HR sin afectación en productos almacenados.',
    closedAt: '26 Ago 2026 11:00',
    closedBy: 'Laura Gómez',
    timeline: [
      { id: 't-59-1', occurredAt: '26 Ago 08:00', actor: 'Laura Gómez', role: 'Calidad', message: 'Alerta ambiental preventiva.', type: 'created' },
      { id: 't-59-2', occurredAt: '26 Ago 11:00', actor: 'Laura Gómez', role: 'Calidad', message: 'Parámetros restablecidos.', type: 'resolution' },
    ],
  },
  {
    id: 'inc-28',
    code: 'INC-2026-0060',
    title: 'Falla temporal en terminal de radiofrecuencia en Matamoros',
    description: 'La terminal de mano #04 presentó desconexión intermitente de Wi-Fi durante el conteo.',
    incidentType: 'Otro',
    sourceModule: 'Reporte manual',
    priority: 'Baja',
    status: 'Cerrada',
    createdAt: '27 Ago 2026 12:00',
    lastActivityAt: '27 Ago 2026 12:30',
    reportedBy: 'Jorge Villarreal (Almacén Matamoros)',
    warehouseId: 'wh-matamoros',
    warehouseName: 'Almacén Matamoros',
    resolution: 'Reinicio de Access Point y terminal operativa al 100%.',
    closedAt: '27 Ago 2026 12:30',
    closedBy: 'Jorge Villarreal',
    timeline: [
      { id: 't-60-1', occurredAt: '27 Ago 12:00', actor: 'Jorge Villarreal', role: 'Almacén', message: 'Falla de conexión RF.', type: 'created' },
      { id: 't-60-2', occurredAt: '27 Ago 12:30', actor: 'Jorge Villarreal', role: 'Almacén', message: 'Terminal conectada.', type: 'resolution' },
    ],
  },
];
