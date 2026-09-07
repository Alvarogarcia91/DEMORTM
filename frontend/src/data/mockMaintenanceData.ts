// ============================================================================
// MANTENIMIENTO INDUSTRIAL RTM — MODELO DE DATOS Y MOCKS
// Catálogo de Activos basado estrictamente en Documentación Oficial de RTM
// ============================================================================

export type MachineStatus = 
  | 'Operativo'
  | 'Mantenimiento programado'
  | 'Fuera de servicio'
  | 'En inspección'
  | 'Inactivo';

export type MachineCriticality = 'Alta' | 'Media' | 'Baja';

export type MachineArea = 
  | 'Flexografía'
  | 'Offset'
  | 'Serigrafía'
  | 'Acabado y Corte'
  | 'Preprensa y CTP'
  | 'Servicios de Planta'
  | 'Almacén y Logística';

export interface MachineEquipment {
  id: string;
  code: string;
  name: string;
  area: MachineArea;
  category: string;
  status: MachineStatus;
  criticality: MachineCriticality;
  brandModelDemo: string;
  serialNumberDemo: string;
  installationYear: number;
  totalOperatingHours: number;
  lastMaintenanceDate: string;
  nextPreventiveDate: string;
  activeWorkOrdersCount: number;
  accumulatedDowntimeHours: number;
  responsibleTechnician: string;
  specifications: string;
  documents: {
    title: string;
    type: 'Manual de Operación' | 'Diagrama Eléctrico' | 'Checklist Preventivo' | 'Ficha Técnica';
    fileSize: string;
    version: string;
  }[];
}

export type WorkOrderType = 'Correctivo' | 'Preventivo' | 'Inspección';
export type WorkOrderPriority = 'Urgente' | 'Alta' | 'Normal' | 'Baja';
export type WorkOrderStatus = 
  | 'Solicitada'
  | 'Programada'
  | 'En proceso'
  | 'En espera de refacción'
  | 'Terminada'
  | 'Cancelada';

export interface WorkOrderSparePart {
  id: string;
  partId: string;
  sku: string;
  name: string;
  quantityUsed: number;
  unitCostMxn: number;
  isSufficientStock: boolean;
  status: 'Surtido' | 'Pendiente de compra' | 'No disponible';
}

export interface WorkOrderTimelineEvent {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  message: string;
  type: 'created' | 'assigned' | 'in_progress' | 'waiting_parts' | 'completed' | 'note';
}

export interface MaintenanceWorkOrder {
  id: string;
  folio: string;
  machineId: string;
  machineCode: string;
  machineName: string;
  area: MachineArea;
  type: WorkOrderType;
  priority: WorkOrderPriority;
  status: WorkOrderStatus;
  isMachineDown: boolean;
  downtimeHours: number;
  requestedBy: string;
  assignedTechnician?: string;
  openedAt: string;
  scheduledDate?: string;
  completedAt?: string;
  issueDescription: string;
  diagnosis?: string;
  workPerformed?: string;
  releaseObservations?: string;
  preventivePlanId?: string;
  spareParts: WorkOrderSparePart[];
  timeline: WorkOrderTimelineEvent[];
}

export interface PreventivePlan {
  id: string;
  machineId: string;
  machineCode: string;
  machineName: string;
  planName: string;
  frequencyType: 'calendario' | 'contador';
  frequencyLabel: string;
  frequencyIntervalDays?: number;
  frequencyHours?: number;
  lastExecutedDate: string;
  nextDueDate: string;
  status: 'Vigente' | 'Próximo' | 'Vencido' | 'Pausado';
  estimatedDurationHours: number;
  checklist: string[];
}

export interface MaintenanceSparePart {
  id: string;
  sku: string;
  name: string;
  category: string;
  stockQuantity: number;
  minStock: number;
  uom: string;
  unitCostMxn: number;
  warehouseLocation: string;
  suggestedSupplier: string;
  isCritical: boolean;
}

// ============================================================================
// 1. CATÁLOGO MAESTRO DE MÁQUINAS RTM (15 ACTIVOS DOCUMENTADOS POR RTM)
// Fuentes: CAPACIDAD DE MAQUINAS.pptx, Programacion Master OFFSET.FLEXO,
// Hoja_Especificacion_rotativo.pdf, Repaso- Impresion y Acabado RTM.pptx
// ============================================================================
export const INITIAL_MACHINES: MachineEquipment[] = [
  // --- OFFSET ---
  {
    id: 'maq-01',
    code: 'OFF-01',
    name: 'Heidelberg Speedmaster',
    area: 'Offset',
    category: 'Prensa Offset',
    status: 'Operativo',
    criticality: 'Alta',
    brandModelDemo: 'Heidelberg Speedmaster',
    serialNumberDemo: 'Dato demo (Pendiente de catálogo técnico)',
    installationYear: 2018,
    totalOperatingHours: 18900,
    lastMaintenanceDate: '01 Sep 2026',
    nextPreventiveDate: '01 Oct 2026',
    activeWorkOrdersCount: 0,
    accumulatedDowntimeHours: 4.0,
    responsibleTechnician: 'Ing. Roberto Garza (Demo)',
    specifications: 'Impresión offset pliegos. Capacidad operativa documentada RTM: ~3,500 pliegos/hora. Humectación continua, registro micrométrico y batería de rodillos dadores.',
    documents: [
      { title: 'Manual de Operación y Servicio de Prensa Offset', type: 'Manual de Operación', fileSize: '14.2 MB', version: 'Rev 1.0' },
      { title: 'Checklist Preventivo Mensual Offset', type: 'Checklist Preventivo', fileSize: '1.1 MB', version: '2026-A' },
    ],
  },
  {
    id: 'maq-02',
    code: 'OFF-02',
    name: 'Prensa Harris',
    area: 'Offset',
    category: 'Prensa Offset',
    status: 'Operativo',
    criticality: 'Alta',
    brandModelDemo: 'Prensa Harris',
    serialNumberDemo: 'Dato demo (Pendiente de catálogo técnico)',
    installationYear: 2016,
    totalOperatingHours: 21400,
    lastMaintenanceDate: '10 Ago 2026',
    nextPreventiveDate: '10 Sep 2026',
    activeWorkOrdersCount: 0,
    accumulatedDowntimeHours: 2.5,
    responsibleTechnician: 'Téc. Héctor Domínguez (Demo)',
    specifications: 'Prensa offset de pliegos y formas continuas de planta Reynosa. Capacidad estándar ~4,000 pliegos/hora.',
    documents: [
      { title: 'Guía de Mantenimiento Mecánico Prensa Harris', type: 'Manual de Operación', fileSize: '8.9 MB', version: 'Rev 2.1' },
    ],
  },
  {
    id: 'maq-03',
    code: 'OFF-03',
    name: 'Conserver DiDDE 860',
    area: 'Offset',
    category: 'Prensa Rotativa Offset',
    status: 'Operativo',
    criticality: 'Media',
    brandModelDemo: 'Conserver DiDDE 860',
    serialNumberDemo: 'Dato demo (Pendiente de catálogo técnico)',
    installationYear: 2017,
    totalOperatingHours: 19800,
    lastMaintenanceDate: '20 Ago 2026',
    nextPreventiveDate: '20 Sep 2026',
    activeWorkOrdersCount: 0,
    accumulatedDowntimeHours: 3.0,
    responsibleTechnician: 'Téc. Héctor Domínguez (Demo)',
    specifications: 'Prensa rotativa offset para formas y papelería comercial continua. Capacidad documentada RTM: ~8,500 pliegos/hora.',
    documents: [
      { title: 'Ficha Técnica DiDDE 860', type: 'Ficha Técnica', fileSize: '4.5 MB', version: 'Rev 1.0' },
    ],
  },
  {
    id: 'maq-04',
    code: 'OFF-04',
    name: 'Conserver 8 Colores',
    area: 'Offset',
    category: 'Prensa Rotativa Offset',
    status: 'Operativo',
    criticality: 'Alta',
    brandModelDemo: 'Conserver 8 Colores',
    serialNumberDemo: 'Dato demo (Pendiente de catálogo técnico)',
    installationYear: 2019,
    totalOperatingHours: 16500,
    lastMaintenanceDate: '28 Jul 2026',
    nextPreventiveDate: '28 Oct 2026',
    activeWorkOrdersCount: 0,
    accumulatedDowntimeHours: 1.5,
    responsibleTechnician: 'Ing. Roberto Garza (Demo)',
    specifications: 'Torre rotativa de 8 colores para tirajes combinados y formas especializadas. Capacidad documentada RTM: ~10,000 - 12,000 pliegos/hora.',
    documents: [
      { title: 'Diagrama de Lubricación Conserver', type: 'Diagrama Eléctrico', fileSize: '6.0 MB', version: 'Rev 1.2' },
    ],
  },

  // --- FLEXOGRAFÍA ---
  {
    id: 'maq-05',
    code: 'FLX-01',
    name: 'Mark Andy 830 7"',
    area: 'Flexografía',
    category: 'Prensa Flexográfica Rotativa',
    status: 'Operativo',
    criticality: 'Alta',
    brandModelDemo: 'Mark Andy 830 7"',
    serialNumberDemo: 'Dato demo (Pendiente de catálogo técnico)',
    installationYear: 2018,
    totalOperatingHours: 15800,
    lastMaintenanceDate: '15 Ago 2026',
    nextPreventiveDate: '15 Sep 2026',
    activeWorkOrdersCount: 0,
    accumulatedDowntimeHours: 4.5,
    responsibleTechnician: 'Ing. Roberto Garza (Demo)',
    specifications: 'Prensa flexográfica rotativa de 7 pulgadas de ancho de banda. Capacidad operativa documentada RTM: ~9,000 m/hora. Estaciones de tinta y troquelado.',
    documents: [
      { title: 'Manual Operativo Mark Andy 830', type: 'Manual de Operación', fileSize: '11.8 MB', version: 'Rev 3.0' },
      { title: 'Checklist Limpieza de Anilox y Rasquetas', type: 'Checklist Preventivo', fileSize: '1.0 MB', version: '2026-A' },
    ],
  },
  {
    id: 'maq-06',
    code: 'FLX-02',
    name: 'Mark Andy 830 10"',
    area: 'Flexografía',
    category: 'Prensa Flexográfica Rotativa',
    status: 'Fuera de servicio',
    criticality: 'Alta',
    brandModelDemo: 'Mark Andy 830 10"',
    serialNumberDemo: 'Dato demo (Pendiente de catálogo técnico)',
    installationYear: 2019,
    totalOperatingHours: 14200,
    lastMaintenanceDate: '06 Sep 2026',
    nextPreventiveDate: '20 Sep 2026',
    activeWorkOrdersCount: 1,
    accumulatedDowntimeHours: 14.5,
    responsibleTechnician: 'Téc. Héctor Domínguez (Demo)',
    specifications: 'Prensa flexográfica de 10 pulgadas de ancho de banda. Capacidad operativa documentada RTM: ~9,000 m/hora. Estaciones de impresión y suajado rotativo.',
    documents: [
      { title: 'Ficha de Mantenimiento Mark Andy 830-10', type: 'Ficha Técnica', fileSize: '5.2 MB', version: 'Rev 2.0' },
      { title: 'Diagrama de Transmisión y Rodamientos', type: 'Diagrama Eléctrico', fileSize: '4.8 MB', version: 'Rev 1.5' },
    ],
  },
  {
    id: 'maq-07',
    code: 'FLX-03',
    name: 'Mark Andy Scout 7C 10"',
    area: 'Flexografía',
    category: 'Prensa Flexográfica Rotativa',
    status: 'Operativo',
    criticality: 'Alta',
    brandModelDemo: 'Mark Andy Scout 7C 10"',
    serialNumberDemo: 'Dato demo (Pendiente de catálogo técnico)',
    installationYear: 2020,
    totalOperatingHours: 12100,
    lastMaintenanceDate: '12 Ago 2026',
    nextPreventiveDate: '12 Sep 2026',
    activeWorkOrdersCount: 0,
    accumulatedDowntimeHours: 2.0,
    responsibleTechnician: 'Ing. Roberto Garza (Demo)',
    specifications: 'Prensa flexográfica de 7 colores y 10 pulgadas para etiquetas autoadheribles de alta resolución. Capacidad: ~9,000 m/hora.',
    documents: [
      { title: 'Manual Técnico Mark Andy Scout', type: 'Manual de Operación', fileSize: '13.5 MB', version: 'Rev 4.0' },
    ],
  },
  {
    id: 'maq-08',
    code: 'FLX-04',
    name: 'Mark Andy 4120',
    area: 'Flexografía',
    category: 'Prensa Flexográfica Rotativa',
    status: 'En inspección',
    criticality: 'Alta',
    brandModelDemo: 'Mark Andy 4120',
    serialNumberDemo: 'Dato demo (Pendiente de catálogo técnico)',
    installationYear: 2017,
    totalOperatingHours: 17400,
    lastMaintenanceDate: '04 Sep 2026',
    nextPreventiveDate: '25 Sep 2026',
    activeWorkOrdersCount: 1,
    accumulatedDowntimeHours: 6.0,
    responsibleTechnician: 'Téc. Héctor Domínguez (Demo)',
    specifications: 'Línea de flexografía para tirajes de etiquetas industriales y conversión continua. Velocidad de línea hasta 150 m/min.',
    documents: [
      { title: 'Manual de Mantenimiento Mark Andy 4120', type: 'Manual de Operación', fileSize: '10.2 MB', version: 'Rev 2.4' },
    ],
  },
  {
    id: 'maq-09',
    code: 'FLX-05',
    name: 'Aquaflex',
    area: 'Flexografía',
    category: 'Prensa Flexográfica Rotativa',
    status: 'Operativo',
    criticality: 'Media',
    brandModelDemo: 'Aquaflex',
    serialNumberDemo: 'Dato demo (Pendiente de catálogo técnico)',
    installationYear: 2016,
    totalOperatingHours: 20300,
    lastMaintenanceDate: '25 Jul 2026',
    nextPreventiveDate: '25 Sep 2026',
    activeWorkOrdersCount: 0,
    accumulatedDowntimeHours: 3.5,
    responsibleTechnician: 'Ing. Roberto Garza (Demo)',
    specifications: 'Prensa flexo base agua y barniz para producción de empaques y etiquetas.',
    documents: [
      { title: 'Guía de Mantenimiento Preventivo Aquaflex', type: 'Manual de Operación', fileSize: '9.0 MB', version: 'Rev 1.8' },
    ],
  },
  {
    id: 'maq-10',
    code: 'FLX-06',
    name: 'Allied Gear',
    area: 'Flexografía',
    category: 'Prensa Flexográfica Rotativa',
    status: 'Operativo',
    criticality: 'Media',
    brandModelDemo: 'Allied Gear',
    serialNumberDemo: 'Dato demo (Pendiente de catálogo técnico)',
    installationYear: 2015,
    totalOperatingHours: 22800,
    lastMaintenanceDate: '02 Ago 2026',
    nextPreventiveDate: '02 Nov 2026',
    activeWorkOrdersCount: 0,
    accumulatedDowntimeHours: 1.0,
    responsibleTechnician: 'Téc. Héctor Domínguez (Demo)',
    specifications: 'Prensa flexográfica modular de engranes para producción industrial.',
    documents: [
      { title: 'Manual de Engranajes y Sincronía Allied Gear', type: 'Ficha Técnica', fileSize: '7.1 MB', version: 'Rev 1.1' },
    ],
  },
  {
    id: 'maq-11',
    code: 'FLX-07',
    name: 'Rotoflex I',
    area: 'Flexografía',
    category: 'Inspeccionadora y Rebobinadora',
    status: 'Operativo',
    criticality: 'Media',
    brandModelDemo: 'Rotoflex I',
    serialNumberDemo: 'Dato demo (Pendiente de catálogo técnico)',
    installationYear: 2019,
    totalOperatingHours: 11900,
    lastMaintenanceDate: '18 Ago 2026',
    nextPreventiveDate: '18 Nov 2026',
    activeWorkOrdersCount: 0,
    accumulatedDowntimeHours: 0.5,
    responsibleTechnician: 'Téc. Fernando Lozano (Demo)',
    specifications: 'Rebobinado, corte e inspección óptica de rollos de etiquetas terminados. Velocidad hasta 200 m/min.',
    documents: [
      { title: 'Procedimiento de Calibración de Sensores Rotoflex', type: 'Checklist Preventivo', fileSize: '2.5 MB', version: 'Rev 1.0' },
    ],
  },

  // --- ACABADO Y CORTE ---
  {
    id: 'maq-12',
    code: 'ACB-01',
    name: 'Guillotina Recta',
    area: 'Acabado y Corte',
    category: 'Corte de Pliego y Refile',
    status: 'Mantenimiento programado',
    criticality: 'Alta',
    brandModelDemo: 'Guillotina Recta',
    serialNumberDemo: 'Dato demo (Pendiente de catálogo técnico)',
    installationYear: 2017,
    totalOperatingHours: 21500,
    lastMaintenanceDate: '08 Jun 2026',
    nextPreventiveDate: '08 Sep 2026',
    activeWorkOrdersCount: 1,
    accumulatedDowntimeHours: 3.0,
    responsibleTechnician: 'Téc. Fernando Lozano (Demo)',
    specifications: 'Guillotina industrial recta de corte de pliegos, etiquetas y refile de hojas.',
    documents: [
      { title: 'Procedimiento de Cambio Seguro de Cuchilla', type: 'Checklist Preventivo', fileSize: '2.1 MB', version: 'Rev 3.0' },
    ],
  },
  {
    id: 'maq-13',
    code: 'ACB-02',
    name: 'Dobladora Stahl',
    area: 'Acabado y Corte',
    category: 'Doblado de Pliego',
    status: 'Operativo',
    criticality: 'Media',
    brandModelDemo: 'Dobladora Stahl',
    serialNumberDemo: 'Dato demo (Pendiente de catálogo técnico)',
    installationYear: 2018,
    totalOperatingHours: 13800,
    lastMaintenanceDate: '14 Ago 2026',
    nextPreventiveDate: '14 Nov 2026',
    activeWorkOrdersCount: 0,
    accumulatedDowntimeHours: 1.2,
    responsibleTechnician: 'Téc. Fernando Lozano (Demo)',
    specifications: 'Dobladora de bolsas y cuchillas para folletería, instructivos y encartes. Velocidad operativa ~35,000 dobleces/hora.',
    documents: [
      { title: 'Manual de Rodillos Plegadores Stahl', type: 'Manual de Operación', fileSize: '8.4 MB', version: 'Rev 2.0' },
    ],
  },
  {
    id: 'maq-14',
    code: 'ACB-03',
    name: 'Grapadora Muller Martini',
    area: 'Acabado y Corte',
    category: 'Encuadernación y Grapado',
    status: 'Operativo',
    criticality: 'Media',
    brandModelDemo: 'Grapadora Muller Martini',
    serialNumberDemo: 'Dato demo (Pendiente de catálogo técnico)',
    installationYear: 2019,
    totalOperatingHours: 10400,
    lastMaintenanceDate: '05 Ago 2026',
    nextPreventiveDate: '05 Nov 2026',
    activeWorkOrdersCount: 0,
    accumulatedDowntimeHours: 0.0,
    responsibleTechnician: 'Téc. Fernando Lozano (Demo)',
    specifications: 'Línea de grapado y acabado a caballo para revistas, manuales, catálogos e instructivos.',
    documents: [
      { title: 'Guía de Ajuste de Cabezales de Alambre', type: 'Ficha Técnica', fileSize: '4.2 MB', version: 'Rev 1.3' },
    ],
  },

  // --- SERIGRAFÍA ---
  {
    id: 'maq-15',
    code: 'SER-01',
    name: 'Pulpo 4 tintas',
    area: 'Serigrafía',
    category: 'Serigrafía Textil y Plana',
    status: 'Operativo',
    criticality: 'Baja',
    brandModelDemo: 'Pulpo 4 tintas',
    serialNumberDemo: 'Dato demo (Pendiente de catálogo técnico)',
    installationYear: 2018,
    totalOperatingHours: 8500,
    lastMaintenanceDate: '10 May 2026',
    nextPreventiveDate: '10 Nov 2026',
    activeWorkOrdersCount: 0,
    accumulatedDowntimeHours: 0.0,
    responsibleTechnician: 'Téc. Héctor Domínguez (Demo)',
    specifications: 'Equipo serigráfico de 4 estaciones giratorias para registro y curado textil o sustratos rígidos.',
    documents: [
      { title: 'Manual de Calibración de Registro Serigráfico', type: 'Manual de Operación', fileSize: '5.6 MB', version: 'Rev 1.0' },
    ],
  },
];

// ============================================================================
// 2. CATÁLOGO DE REFACCIONES INDUSTRIALES GENÉRICAS RTM
// ============================================================================
export const INITIAL_SPARE_PARTS: MaintenanceSparePart[] = [
  {
    id: 'ref-01',
    sku: 'REF-ROD-6205',
    name: 'Rodamiento Rígido de Bolas SKF 6205-2RSH (Flecha)',
    category: 'Rodamientos & Chumaceras',
    stockQuantity: 0, // Faltante intencional para Caso Demo Principal de Requisición
    minStock: 4,
    uom: 'Pieza',
    unitCostMxn: 480,
    warehouseLocation: 'EST-REF-01',
    suggestedSupplier: 'Rodamientos y Retenes Industriales del Norte',
    isCritical: true,
  },
  {
    id: 'ref-02',
    sku: 'REF-LUB-IND220',
    name: 'Aceite Industrial para Engranajes ISO VG 220 (Cubeta 19L)',
    category: 'Lubricantes & Químicos',
    stockQuantity: 3,
    minStock: 2,
    uom: 'Cubeta',
    unitCostMxn: 3250,
    warehouseLocation: 'EST-REF-02',
    suggestedSupplier: 'Distribuidora Industrial de Lubricantes S.A.',
    isCritical: true,
  },
  {
    id: 'ref-03',
    sku: 'REF-CUCH-RECTA',
    name: 'Cuchilla de Acero Rápido HSS para Guillotina Recta',
    category: 'Herramentales de Corte',
    stockQuantity: 2,
    minStock: 1,
    uom: 'Pieza',
    unitCostMxn: 12500,
    warehouseLocation: 'EST-REF-03',
    suggestedSupplier: 'Afilados y Cuchillas Industriales de Monterrey',
    isCritical: true,
  },
  {
    id: 'ref-04',
    sku: 'REF-BND-SINC',
    name: 'Banda Dentada Sincrónica Industrial 8M',
    category: 'Transmisión & Bandas',
    stockQuantity: 1,
    minStock: 2,
    uom: 'Pieza',
    unitCostMxn: 1150,
    warehouseLocation: 'EST-REF-01',
    suggestedSupplier: 'Transmisiones Mecánicas del Bravo',
    isCritical: false,
  },
  {
    id: 'ref-05',
    sku: 'REF-RETEN-TEF',
    name: 'Retén de Teflón para Cámara Cerrada de Tinta',
    category: 'Sellos & Retenes',
    stockQuantity: 6,
    minStock: 4,
    uom: 'Pieza',
    unitCostMxn: 280,
    warehouseLocation: 'EST-REF-04',
    suggestedSupplier: 'Empaques y Sellos Industriales de Reynosa',
    isCritical: false,
  },
  {
    id: 'ref-06',
    sku: 'REF-FUS-50A',
    name: 'Fusible Cerámico Industrial 50A 600V',
    category: 'Eléctrico & Control',
    stockQuantity: 12,
    minStock: 6,
    uom: 'Pieza',
    unitCostMxn: 320,
    warehouseLocation: 'EST-REF-05',
    suggestedSupplier: 'Automatización y Eléctrica del Norte',
    isCritical: false,
  },
  {
    id: 'ref-07',
    sku: 'REF-LAMP-UV',
    name: 'Lámpara de Curado UV para Prensa Flexo',
    category: 'Curado UV & Iluminación',
    stockQuantity: 0, // Faltante intencional para OT Flexo
    minStock: 2,
    uom: 'Pieza',
    unitCostMxn: 8900,
    warehouseLocation: 'EST-REF-06',
    suggestedSupplier: 'Sistemas UV de México S.A.',
    isCritical: true,
  },
];

// ============================================================================
// 3. ÓRDENES DE TRABAJO (OT) — ASIGNADAS A MÁQUINAS RTM
// ============================================================================
export const INITIAL_WORK_ORDERS: MaintenanceWorkOrder[] = [
  // CASO DEMO 1 (Correctivo): Mark Andy 830 10" detenida por falla mecánica (vibración)
  {
    id: 'ot-01',
    folio: 'OT-MTTO-2026-0042',
    machineId: 'maq-06',
    machineCode: 'FLX-02',
    machineName: 'Mark Andy 830 10"',
    area: 'Flexografía',
    type: 'Correctivo',
    priority: 'Alta',
    status: 'En espera de refacción',
    isMachineDown: true,
    downtimeHours: 14.5,
    requestedBy: 'Operador Flexo (Turno Matutino)',
    assignedTechnician: 'Téc. Héctor Domínguez',
    openedAt: '06 Sep 2026 08:30',
    scheduledDate: '06 Sep 2026 09:00',
    issueDescription: 'El operador reporta vibración mecánica anormal en estación de impresión al alcanzar velocidad de producción. Se detuvo la prensa para evitar daño en flecha y engranes.',
    diagnosis: 'Inspección técnica confirma rodamiento con juego radial excesivo y desgaste en flecha portaclisé. Requiere reemplazo de 2 rodamientos SKF 6205-2RSH.',
    workPerformed: 'Se desmontó la carcasa y se extrajo el conjunto de rodamiento. Flecha sin daño pero rodamientos requieren cambio.',
    spareParts: [
      {
        id: 'sp-01',
        partId: 'ref-01',
        sku: 'REF-ROD-6205',
        name: 'Rodamiento Rígido de Bolas SKF 6205-2RSH (Flecha)',
        quantityUsed: 2,
        unitCostMxn: 480,
        isSufficientStock: false,
        status: 'Pendiente de compra',
      }
    ],
    timeline: [
      { id: 't-01', timestamp: '06 Sep 08:30', actor: 'Supervisor de Turno', role: 'Operaciones', message: 'Falla reportada: vibración mecánica. Máquina en paro.', type: 'created' },
      { id: 't-02', timestamp: '06 Sep 08:45', actor: 'Ing. Roberto Garza', role: 'Jefe de Mtto', message: 'OT generada y asignada al Téc. Héctor Domínguez con prioridad Alta.', type: 'assigned' },
      { id: 't-03', timestamp: '06 Sep 09:10', actor: 'Téc. Héctor Domínguez', role: 'Técnico Mtto', message: 'Desarme y diagnóstico: rodamiento con holgura crítica.', type: 'in_progress' },
      { id: 't-04', timestamp: '06 Sep 10:15', actor: 'Téc. Héctor Domínguez', role: 'Técnico Mtto', message: 'Sin existencia en almacén de refacciones (stock 0). Se requiere Requisición urgente.', type: 'waiting_parts' },
    ],
  },

  // CASO DEMO 2 (Preventivo): Guillotina Recta
  {
    id: 'ot-02',
    folio: 'OT-MTTO-2026-0041',
    machineId: 'maq-12',
    machineCode: 'ACB-01',
    machineName: 'Guillotina Recta',
    area: 'Acabado y Corte',
    type: 'Preventivo',
    priority: 'Normal',
    status: 'Programada',
    isMachineDown: false,
    downtimeHours: 0.0,
    requestedBy: 'Plan Preventivo Trimestral (ACB-01)',
    assignedTechnician: 'Téc. Fernando Lozano',
    openedAt: '05 Sep 2026 14:00',
    scheduledDate: '08 Sep 2026 08:00',
    issueDescription: 'Mantenimiento preventivo programado: lubricación de guías de corte, revisión de embrague y sustitución de cuchilla de acero rápido.',
    diagnosis: 'Inspección de ciclo alcanzado. Operación normal con filo de cuchilla desgastado.',
    workPerformed: '',
    spareParts: [
      {
        id: 'sp-02',
        partId: 'ref-03',
        sku: 'REF-CUCH-RECTA',
        name: 'Cuchilla de Acero Rápido HSS para Guillotina Recta',
        quantityUsed: 1,
        unitCostMxn: 12500,
        isSufficientStock: true,
        status: 'Surtido',
      },
      {
        id: 'sp-03',
        partId: 'ref-02',
        sku: 'REF-LUB-IND220',
        name: 'Aceite Industrial para Engranajes ISO VG 220 (Cubeta 19L)',
        quantityUsed: 0.25,
        unitCostMxn: 3250,
        isSufficientStock: true,
        status: 'Surtido',
      }
    ],
    timeline: [
      { id: 't-11', timestamp: '05 Sep 14:00', actor: 'Sistema de Mantenimiento', role: 'Automático', message: 'OT preventiva programada por calendario.', type: 'created' },
      { id: 't-12', timestamp: '05 Sep 15:30', actor: 'Ing. Roberto Garza', role: 'Jefe de Mtto', message: 'Asignada a Téc. Fernando Lozano.', type: 'assigned' },
    ],
  },

  // CASO DEMO 3 (Inspección): Dobladora Stahl
  {
    id: 'ot-03',
    folio: 'OT-MTTO-2026-0040',
    machineId: 'maq-13',
    machineCode: 'ACB-02',
    machineName: 'Dobladora Stahl',
    area: 'Acabado y Corte',
    type: 'Inspección',
    priority: 'Normal',
    status: 'En proceso',
    isMachineDown: false,
    downtimeHours: 1.2,
    requestedBy: 'Supervisor de Acabado',
    assignedTechnician: 'Téc. Fernando Lozano',
    openedAt: '06 Sep 2026 11:20',
    scheduledDate: '06 Sep 2026 11:30',
    issueDescription: 'Revisión programada de rodillos de doblez, verificación de holgura entre cilindros y limpieza de sensores ópticos.',
    diagnosis: 'Rodillos plegadores con acumulación de polvo de papel. Sensores de paso operativos.',
    workPerformed: 'Limpieza de rodillos con solvente no residual y ajuste de presión de bolsa de doblez en proceso.',
    spareParts: [],
    timeline: [
      { id: 't-21', timestamp: '06 Sep 11:20', actor: 'Téc. Fernando Lozano', role: 'Técnico Mtto', message: 'Inspección iniciada entre cambios de orden.', type: 'created' },
      { id: 't-22', timestamp: '06 Sep 11:35', actor: 'Téc. Fernando Lozano', role: 'Técnico Mtto', message: 'Limpieza concluida, verificando doblez tríptico.', type: 'in_progress' },
    ],
  },

  // CASO DEMO 4 (En espera de refacción): Mark Andy 4120
  {
    id: 'ot-04',
    folio: 'OT-MTTO-2026-0039',
    machineId: 'maq-08',
    machineCode: 'FLX-04',
    machineName: 'Mark Andy 4120',
    area: 'Flexografía',
    type: 'Preventivo',
    priority: 'Alta',
    status: 'En espera de refacción',
    isMachineDown: false,
    downtimeHours: 0.0,
    requestedBy: 'Téc. Héctor Domínguez',
    assignedTechnician: 'Téc. Héctor Domínguez',
    openedAt: '04 Sep 2026 16:00',
    scheduledDate: '05 Sep 2026 09:00',
    issueDescription: 'Reemplazo programado de lámpara de curado UV por cumplimiento de horómetro de vida útil.',
    diagnosis: 'Lámpara UV con intensidad reducida por debajo del umbral de curado rápido de tinta.',
    workPerformed: 'Carcasa desmontada lista para montaje de lámpara nueva.',
    spareParts: [
      {
        id: 'sp-04',
        partId: 'ref-07',
        sku: 'REF-LAMP-UV',
        name: 'Lámpara de Curado UV para Prensa Flexo',
        quantityUsed: 1,
        unitCostMxn: 8900,
        isSufficientStock: false,
        status: 'Pendiente de compra',
      }
    ],
    timeline: [
      { id: 't-31', timestamp: '04 Sep 16:00', actor: 'Téc. Héctor Domínguez', role: 'Técnico Mtto', message: 'OT abierta por fin de vida útil de lámpara.', type: 'created' },
      { id: 't-32', timestamp: '05 Sep 09:30', actor: 'Téc. Héctor Domínguez', role: 'Técnico Mtto', message: 'Sin existencia en almacén. Requisición vinculada a Compras.', type: 'waiting_parts' },
    ],
  },

  // ÓRDENES HISTÓRICAS TERMINADAS (MÁQUINAS REALES RTM)
  {
    id: 'ot-05',
    folio: 'OT-MTTO-2026-0038',
    machineId: 'maq-05',
    machineCode: 'FLX-01',
    machineName: 'Mark Andy 830 7"',
    area: 'Flexografía',
    type: 'Correctivo',
    priority: 'Normal',
    status: 'Terminada',
    isMachineDown: true,
    downtimeHours: 2.5,
    requestedBy: 'Operador Flexo 1',
    assignedTechnician: 'Ing. Roberto Garza',
    openedAt: '01 Sep 2026 10:00',
    scheduledDate: '01 Sep 2026 10:15',
    completedAt: '01 Sep 2026 12:30',
    issueDescription: 'Fuga de tinta en cámara cerrada por desgaste de retén de teflón en estación 1.',
    diagnosis: 'Retén cuarteado por fricción continua.',
    workPerformed: 'Sustitución de retenes de teflón y racleta dosificadora. Prueba de hermeticidad exitosa.',
    releaseObservations: 'Máquina liberada a producción sin fugas a velocidad nominal.',
    spareParts: [],
    timeline: [
      { id: 't-41', timestamp: '01 Sep 10:00', actor: 'Operador Flexo 1', role: 'Operaciones', message: 'Reporte de fuga de tinta.', type: 'created' },
      { id: 't-42', timestamp: '01 Sep 12:30', actor: 'Ing. Roberto Garza', role: 'Jefe de Mtto', message: 'Retén cambiado y equipo liberado.', type: 'completed' },
    ],
  },
  {
    id: 'ot-06',
    folio: 'OT-MTTO-2026-0037',
    machineId: 'maq-01',
    machineCode: 'OFF-01',
    machineName: 'Heidelberg Speedmaster',
    area: 'Offset',
    type: 'Preventivo',
    priority: 'Normal',
    status: 'Terminada',
    isMachineDown: true,
    downtimeHours: 4.0,
    requestedBy: 'Plan Preventivo Offset',
    assignedTechnician: 'Téc. Héctor Domínguez',
    openedAt: '28 Ago 2026 07:00',
    scheduledDate: '28 Ago 2026 07:00',
    completedAt: '28 Ago 2026 11:00',
    issueDescription: 'Inspección, limpieza de tinteros, lubricación preventiva y ajuste de rodillos dadores.',
    diagnosis: 'Mantenimiento preventivo regular cumplido.',
    workPerformed: 'Calibración de franjas de contacto en rodillos de caucho y purga de líneas de lubricación.',
    releaseObservations: 'Tiraje de prueba de registro conforme.',
    spareParts: [],
    timeline: [
      { id: 't-51', timestamp: '28 Ago 07:00', actor: 'Téc. Héctor Domínguez', role: 'Técnico Mtto', message: 'Inicio de preventivo programado.', type: 'in_progress' },
      { id: 't-52', timestamp: '28 Ago 11:00', actor: 'Ing. Roberto Garza', role: 'Jefe de Mtto', message: 'Calibración verificada y orden cerrada.', type: 'completed' },
    ],
  },
  {
    id: 'ot-07',
    folio: 'OT-MTTO-2026-0036',
    machineId: 'maq-02',
    machineCode: 'OFF-02',
    machineName: 'Prensa Harris',
    area: 'Offset',
    type: 'Inspección',
    priority: 'Baja',
    status: 'Terminada',
    isMachineDown: false,
    downtimeHours: 0.8,
    requestedBy: 'Operador Offset',
    assignedTechnician: 'Ing. Roberto Garza',
    openedAt: '22 Ago 2026 15:30',
    scheduledDate: '22 Ago 2026 15:30',
    completedAt: '22 Ago 2026 16:15',
    issueDescription: 'Inspección de alineación de mordazas del cilindro impresor y presión de mantilla.',
    diagnosis: 'Alineación dentro de parámetros operativos.',
    workPerformed: 'Limpieza de mordazas y lubricación de levas.',
    releaseObservations: 'Equipo verificado y conforme.',
    spareParts: [],
    timeline: [
      { id: 't-61', timestamp: '22 Ago 15:30', actor: 'Ing. Roberto Garza', role: 'Jefe de Mtto', message: 'Inspección de rutina completada.', type: 'completed' },
    ],
  },
  {
    id: 'ot-08',
    folio: 'OT-MTTO-2026-0035',
    machineId: 'maq-14',
    machineCode: 'ACB-03',
    machineName: 'Grapadora Muller Martini',
    area: 'Acabado y Corte',
    type: 'Preventivo',
    priority: 'Normal',
    status: 'Terminada',
    isMachineDown: false,
    downtimeHours: 1.0,
    requestedBy: 'Plan Preventivo Acabado',
    assignedTechnician: 'Téc. Fernando Lozano',
    openedAt: '18 Ago 2026 09:00',
    scheduledDate: '18 Ago 2026 09:00',
    completedAt: '18 Ago 2026 10:00',
    issueDescription: 'Lubricación de cabezales de engrapado con alambre y comprobación de cuchillas de corte frontal.',
    diagnosis: 'Cabezales con lubricación adecuada y cuchillas con filo operativo.',
    workPerformed: 'Aplicación de grasa industrial en engranes y limpieza de residuo de alambre.',
    releaseObservations: 'Liberada para corrida de folletos.',
    spareParts: [],
    timeline: [
      { id: 't-71', timestamp: '18 Ago 09:00', actor: 'Téc. Fernando Lozano', role: 'Técnico Mtto', message: 'Servicio de grapadora completado.', type: 'completed' },
    ],
  },
  {
    id: 'ot-09',
    folio: 'OT-MTTO-2026-0034',
    machineId: 'maq-03',
    machineCode: 'OFF-03',
    machineName: 'Conserver DiDDE 860',
    area: 'Offset',
    type: 'Correctivo',
    priority: 'Normal',
    status: 'Terminada',
    isMachineDown: true,
    downtimeHours: 1.5,
    requestedBy: 'Operador DiDDE',
    assignedTechnician: 'Téc. Héctor Domínguez',
    openedAt: '14 Ago 2026 13:40',
    scheduledDate: '14 Ago 2026 13:45',
    completedAt: '14 Ago 2026 15:10',
    issueDescription: 'Atasco en salida por descalibración de rodillo expulsor.',
    diagnosis: 'Rodillo expulsor con suciedad de polvo de papel acumulado.',
    workPerformed: 'Limpieza de rodillo y calibración de presión con resorte tensor.',
    releaseObservations: 'Salida fluida restablecida a velocidad de trabajo.',
    spareParts: [],
    timeline: [
      { id: 't-81', timestamp: '14 Ago 13:40', actor: 'Téc. Héctor Domínguez', role: 'Técnico Mtto', message: 'Rodillo ajustado y liberado.', type: 'completed' },
    ],
  },
  {
    id: 'ot-10',
    folio: 'OT-MTTO-2026-0033',
    machineId: 'maq-07',
    machineCode: 'FLX-03',
    machineName: 'Mark Andy Scout 7C 10"',
    area: 'Flexografía',
    type: 'Correctivo',
    priority: 'Normal',
    status: 'Terminada',
    isMachineDown: true,
    downtimeHours: 2.0,
    requestedBy: 'Operador Flexo Scout',
    assignedTechnician: 'Téc. Héctor Domínguez',
    openedAt: '08 Ago 2026 11:00',
    scheduledDate: '08 Ago 2026 11:15',
    completedAt: '08 Ago 2026 13:00',
    issueDescription: 'Fluctuación de tensión en desbobinador de película autoadherible.',
    diagnosis: 'Freno neumático con zapatas desajustadas.',
    workPerformed: 'Calibración de presión en freno neumático y verificación de celda de carga.',
    releaseObservations: 'Tensión de bobina estable.',
    spareParts: [],
    timeline: [
      { id: 't-91', timestamp: '08 Ago 11:00', actor: 'Téc. Héctor Domínguez', role: 'Técnico Mtto', message: 'Tensión calibrada con éxito.', type: 'completed' },
    ],
  },
  {
    id: 'ot-11',
    folio: 'OT-MTTO-2026-0032',
    machineId: 'maq-11',
    machineCode: 'FLX-07',
    machineName: 'Rotoflex I',
    area: 'Flexografía',
    type: 'Preventivo',
    priority: 'Normal',
    status: 'Terminada',
    isMachineDown: false,
    downtimeHours: 1.0,
    requestedBy: 'Plan Preventivo Rebobinadoras',
    assignedTechnician: 'Téc. Fernando Lozano',
    openedAt: '04 Ago 2026 08:00',
    scheduledDate: '04 Ago 2026 08:00',
    completedAt: '04 Ago 2026 09:00',
    issueDescription: 'Limpieza de sensores de conteo de etiquetas y lubricación de flechas expansibles.',
    diagnosis: 'Equipo en óptimas condiciones.',
    workPerformed: 'Limpieza de fotocélulas con aire comprimido y aplicación de grasa sintética.',
    releaseObservations: 'Conteo exacto verificado.',
    spareParts: [],
    timeline: [
      { id: 't-101', timestamp: '04 Ago 08:00', actor: 'Téc. Fernando Lozano', role: 'Técnico Mtto', message: 'Preventivo concluido.', type: 'completed' },
    ],
  },
  {
    id: 'ot-12',
    folio: 'OT-MTTO-2026-0031',
    machineId: 'maq-09',
    machineCode: 'FLX-05',
    machineName: 'Aquaflex',
    area: 'Flexografía',
    type: 'Preventivo',
    priority: 'Normal',
    status: 'Terminada',
    isMachineDown: true,
    downtimeHours: 3.5,
    requestedBy: 'Plan Mensual Flexo',
    assignedTechnician: 'Ing. Roberto Garza',
    openedAt: '25 Jul 2026 07:00',
    scheduledDate: '25 Jul 2026 07:00',
    completedAt: '25 Jul 2026 10:30',
    issueDescription: 'Inspección de bombas de circulación de tinta y limpieza de rodillos anilox.',
    diagnosis: 'Bombas con flujo nominal y anilox limpios.',
    workPerformed: 'Lavado ultrasónico de anilox y sustitución de mangueras de retorno.',
    releaseObservations: 'Liberada a producción.',
    spareParts: [],
    timeline: [
      { id: 't-111', timestamp: '25 Jul 07:00', actor: 'Ing. Roberto Garza', role: 'Jefe de Mtto', message: 'Mantenimiento preventivo completado.', type: 'completed' },
    ],
  },
  {
    id: 'ot-13',
    folio: 'OT-MTTO-2026-0030',
    machineId: 'maq-15',
    machineCode: 'SER-01',
    machineName: 'Pulpo 4 tintas',
    area: 'Serigrafía',
    type: 'Inspección',
    priority: 'Baja',
    status: 'Terminada',
    isMachineDown: false,
    downtimeHours: 0.5,
    requestedBy: 'Supervisor de Serigrafía',
    assignedTechnician: 'Téc. Héctor Domínguez',
    openedAt: '18 Jul 2026 14:00',
    scheduledDate: '18 Jul 2026 14:00',
    completedAt: '18 Jul 2026 14:30',
    issueDescription: 'Inspección de microregistro en brazos giratorios y tensión de resortes.',
    diagnosis: 'Brazos alineados sin juego lateral.',
    workPerformed: 'Ajuste de tuercas micrométricas de tope y lubricación de baleros.',
    releaseObservations: 'Registro de 4 tintas verificado.',
    spareParts: [],
    timeline: [
      { id: 't-121', timestamp: '18 Jul 14:00', actor: 'Téc. Héctor Domínguez', role: 'Técnico Mtto', message: 'Inspección finalizada.', type: 'completed' },
    ],
  },
  {
    id: 'ot-14',
    folio: 'OT-MTTO-2026-0029',
    machineId: 'maq-10',
    machineCode: 'FLX-06',
    machineName: 'Allied Gear',
    area: 'Flexografía',
    type: 'Correctivo',
    priority: 'Normal',
    status: 'Terminada',
    isMachineDown: true,
    downtimeHours: 1.0,
    requestedBy: 'Operador Allied Gear',
    assignedTechnician: 'Téc. Héctor Domínguez',
    openedAt: '10 Jul 2026 16:15',
    scheduledDate: '10 Jul 2026 16:20',
    completedAt: '10 Jul 2026 17:15',
    issueDescription: 'Banda de transmisión desalineada con ruido leve en engranes.',
    diagnosis: 'Tensor de banda flojo.',
    workPerformed: 'Alineación de polea y reajuste de tensión.',
    releaseObservations: 'Operación suave sin ruido restablecida.',
    spareParts: [],
    timeline: [
      { id: 't-131', timestamp: '10 Jul 16:15', actor: 'Téc. Héctor Domínguez', role: 'Técnico Mtto', message: 'Transmisión restablecida.', type: 'completed' },
    ],
  },
];

// ============================================================================
// 4. PLANES PREVENTIVOS PROGRAMADOS (MÁQUINAS REALES RTM)
// ============================================================================
export const INITIAL_PREVENTIVE_PLANS: PreventivePlan[] = [
  {
    id: 'plan-01',
    machineId: 'maq-12',
    machineCode: 'ACB-01',
    machineName: 'Guillotina Recta',
    planName: 'Mantenimiento Trimestral de Lubricación y Cambio de Cuchilla',
    frequencyType: 'calendario',
    frequencyLabel: 'Frecuencia demo: trimestral (90 días)',
    frequencyIntervalDays: 90,
    lastExecutedDate: '08 Jun 2026',
    nextDueDate: '08 Sep 2026',
    status: 'Próximo',
    estimatedDurationHours: 3.0,
    checklist: [
      'Bloqueo LOTO y aislamiento de energía',
      'Desmonte seguro y colocación de cuchilla afilada de acero rápido',
      'Engrase de husillo de avance y guías prismáticas',
      'Verificación de barreras fotoeléctricas de seguridad',
      'Comprobación de nivel de aceite hidráulico',
    ],
  },
  {
    id: 'plan-02',
    machineId: 'maq-05',
    machineCode: 'FLX-01',
    machineName: 'Mark Andy 830 7"',
    planName: 'Servicio Mensual de Lámparas UV y Rodillos Anilox',
    frequencyType: 'calendario',
    frequencyLabel: 'Frecuencia demo: mensual (30 días)',
    frequencyIntervalDays: 30,
    lastExecutedDate: '15 Ago 2026',
    nextDueDate: '15 Sep 2026',
    status: 'Vigente',
    estimatedDurationHours: 4.0,
    checklist: [
      'Inspección de horas de vida de lámparas UV',
      'Limpieza química de cilindros anilox',
      'Alineación de rasquetas dosificadoras',
      'Comprobación de tensión en transmisión de engranes',
    ],
  },
  {
    id: 'plan-03',
    machineId: 'maq-01',
    machineCode: 'OFF-01',
    machineName: 'Heidelberg Speedmaster',
    planName: 'Inspección, Limpieza y Calibración Mensual Offset',
    frequencyType: 'calendario',
    frequencyLabel: 'Frecuencia demo: mensual (30 días)',
    frequencyIntervalDays: 30,
    lastExecutedDate: '01 Sep 2026',
    nextDueDate: '01 Oct 2026',
    status: 'Vigente',
    estimatedDurationHours: 4.0,
    checklist: [
      'Calibración de conductividad y pH de solución de fuente',
      'Revisión de franjas de contacto en rodillos de caucho',
      'Inspección de mordazas del cilindro impresor',
      'Purga y lubricación de puntos centrales',
    ],
  },
  {
    id: 'plan-04',
    machineId: 'maq-06',
    machineCode: 'FLX-02',
    machineName: 'Mark Andy 830 10"',
    planName: 'Inspección y Lubricación de Flechas Portaclisé y Suaje',
    frequencyType: 'calendario',
    frequencyLabel: 'Frecuencia demo: mensual (30 días)',
    frequencyIntervalDays: 30,
    lastExecutedDate: '20 Jul 2026',
    nextDueDate: '20 Sep 2026',
    status: 'Próximo',
    estimatedDurationHours: 3.5,
    checklist: [
      'Verificación de holgura radial en rodamientos de flechas',
      'Engrase de engranajes de tracción de cilindros magnéticos',
      'Inspección de frenos neumáticos de tensión de banda',
      'Limpieza de sensores de guía de orilla',
    ],
  },
  {
    id: 'plan-05',
    machineId: 'maq-08',
    machineCode: 'FLX-04',
    machineName: 'Mark Andy 4120',
    planName: 'Revisión Periódica de Módulos de Impresión y UV',
    frequencyType: 'calendario',
    frequencyLabel: 'Frecuencia demo: bimestral (60 días)',
    frequencyIntervalDays: 60,
    lastExecutedDate: '04 Jul 2026',
    nextDueDate: '04 Sep 2026',
    status: 'Vencido',
    estimatedDurationHours: 3.0,
    checklist: [
      'Medición de irradiancia de reflectores UV',
      'Inspección de bombas neumáticas de tinta',
      'Revisión de rodillos expulsores y troquel rotativo',
      'Limpieza de filtros de aire de enfriamiento',
    ],
  },
  {
    id: 'plan-06',
    machineId: 'maq-13',
    machineCode: 'ACB-02',
    machineName: 'Dobladora Stahl',
    planName: 'Calibración Trimestral de Rodillos Plegadores',
    frequencyType: 'calendario',
    frequencyLabel: 'Frecuencia demo: trimestral (90 días)',
    frequencyIntervalDays: 90,
    lastExecutedDate: '14 Ago 2026',
    nextDueDate: '14 Nov 2026',
    status: 'Vigente',
    estimatedDurationHours: 2.0,
    checklist: [
      'Ajuste de presión micrométrica entre rodillos',
      'Limpieza de fotocélulas de entrada y salida',
      'Verificación de cuchillas de doblez en cruz',
      'Engrase de cadenas y bujes de transmisión',
    ],
  },
  {
    id: 'plan-07',
    machineId: 'maq-03',
    machineCode: 'OFF-03',
    machineName: 'Conserver DiDDE 860',
    planName: 'Servicio Preventivo de Prensa Rotativa Continua',
    frequencyType: 'calendario',
    frequencyLabel: 'Frecuencia demo: mensual (30 días)',
    frequencyIntervalDays: 30,
    lastExecutedDate: '20 Ago 2026',
    nextDueDate: '20 Sep 2026',
    status: 'Vigente',
    estimatedDurationHours: 3.5,
    checklist: [
      'Inspección de tensión de desbobinador y perforadores',
      'Calibración de cilindros de mantilla',
      'Comprobación de cuchillas de corte transversal',
      'Lubricación de transmisiones mecánicas',
    ],
  },
  {
    id: 'plan-08',
    machineId: 'maq-14',
    machineCode: 'ACB-03',
    machineName: 'Grapadora Muller Martini',
    planName: 'Mantenimiento Preventivo de Cabezales y Cadena de Transporte',
    frequencyType: 'calendario',
    frequencyLabel: 'Frecuencia demo: trimestral (90 días)',
    frequencyIntervalDays: 90,
    lastExecutedDate: '05 Ago 2026',
    nextDueDate: '05 Nov 2026',
    status: 'Vigente',
    estimatedDurationHours: 2.5,
    checklist: [
      'Desmonte y lubricación de cabezales de alambre',
      'Alineación de cuchillas de guillotina trilateral',
      'Tensión y verificación de pasos de cadena alimentadora',
    ],
  },
];

// Helper export aliases
export const mockMachines = INITIAL_MACHINES;
export const mockWorkOrders = INITIAL_WORK_ORDERS;
export const mockPreventivePlans = INITIAL_PREVENTIVE_PLANS;
export const mockSparePartsCatalog = INITIAL_SPARE_PARTS;

export type MaintenanceOrderType = WorkOrderType;
export type MaintenancePriority = WorkOrderPriority;
export type MaintenanceOrderStatus = WorkOrderStatus;

export const MOCK_TECHNICIANS: string[] = [
  'Téc. Héctor Domínguez',
  'Ing. Roberto Garza',
  'Téc. Fernando Lozano',
  'Téc. Miguel Ángel Soto',
  'Téc. Carlos Morales',
];

export const PRIORITY_LABELS: Record<WorkOrderPriority, { label: string; color: string; bgColor: string; borderColor: string }> = {
  'Urgente': { label: 'Urgente', color: 'text-rose-700 dark:text-rose-400', bgColor: 'bg-rose-500/10', borderColor: 'border-rose-500/20' },
  'Alta': { label: 'Alta', color: 'text-orange-700 dark:text-orange-400', bgColor: 'bg-orange-500/10', borderColor: 'border-orange-500/20' },
  'Normal': { label: 'Normal', color: 'text-blue-700 dark:text-blue-400', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/20' },
  'Baja': { label: 'Baja', color: 'text-zinc-700 dark:text-zinc-400', bgColor: 'bg-zinc-500/10', borderColor: 'border-zinc-500/20' },
};

export const STATUS_LABELS: Record<MachineStatus, string> = {
  'Operativo': 'Operativo',
  'Mantenimiento programado': 'Mantenimiento Programado',
  'Fuera de servicio': 'Fuera de Servicio',
  'En inspección': 'En Inspección',
  'Inactivo': 'Inactivo',
};

export const CRITICALITY_LABELS: Record<MachineCriticality, { label: string; color: string; bgColor: string; borderColor: string }> = {
  'Alta': { label: 'Crítica / Alta', color: 'text-rose-700 dark:text-rose-400', bgColor: 'bg-rose-500/10', borderColor: 'border-rose-500/20' },
  'Media': { label: 'Media', color: 'text-amber-700 dark:text-amber-400', bgColor: 'bg-amber-500/10', borderColor: 'border-amber-500/20' },
  'Baja': { label: 'Baja', color: 'text-zinc-700 dark:text-zinc-400', bgColor: 'bg-zinc-500/10', borderColor: 'border-zinc-500/20' },
};
