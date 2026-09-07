// ============================================================================
// MANTENIMIENTO INDUSTRIAL RTM — MODELO DE DATOS Y MOCKS
// FASE 6 — Catálogo de Activos, Órdenes de Trabajo, Preventivos y Refacciones
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
// 1. CATÁLOGO MAESTRO DE MÁQUINAS Y EQUIPOS (12 ACTIVOS INDUSTRIALES RTM)
// ============================================================================
export const INITIAL_MACHINES: MachineEquipment[] = [
  {
    id: 'maq-01',
    code: 'PRE-FLX-01',
    name: 'Prensa Flexográfica 01 (Línea Etiquetas)',
    area: 'Flexografía',
    category: 'Impresión Rotativa Flexo',
    status: 'Operativo',
    criticality: 'Alta',
    brandModelDemo: 'Nilpeter FB-3300 8C (DEMO)',
    serialNumberDemo: 'NP-2019-9941',
    installationYear: 2019,
    totalOperatingHours: 14250,
    lastMaintenanceDate: '15 Ago 2026',
    nextPreventiveDate: '15 Sep 2026',
    activeWorkOrdersCount: 0,
    accumulatedDowntimeHours: 6.5,
    responsibleTechnician: 'Ing. Roberto Garza',
    specifications: 'Ancho de banda 330 mm, 8 estaciones UV, secado por aire caliente, troquel rotativo.',
    documents: [
      { title: 'Manual de Operación y Mantenimiento Mecánico', type: 'Manual de Operación', fileSize: '12.4 MB', version: 'Rev 3.2' },
      { title: 'Diagrama Eléctrico y Servomotores', type: 'Diagrama Eléctrico', fileSize: '8.1 MB', version: 'Rev 2.0' },
      { title: 'Checklist Lubricación Semanal', type: 'Checklist Preventivo', fileSize: '1.2 MB', version: '2026-A' },
    ],
  },
  {
    id: 'maq-02',
    code: 'PRE-FLX-02',
    name: 'Prensa Flexográfica 02 (Banda Ancha)',
    area: 'Flexografía',
    category: 'Impresión Rotativa Flexo',
    status: 'Fuera de servicio',
    criticality: 'Alta',
    brandModelDemo: 'Mark Andy Performance P5 (DEMO)',
    serialNumberDemo: 'MA-2021-8842',
    installationYear: 2021,
    totalOperatingHours: 9840,
    lastMaintenanceDate: '20 Jul 2026',
    nextPreventiveDate: '20 Ago 2026',
    activeWorkOrdersCount: 1,
    accumulatedDowntimeHours: 18.2,
    responsibleTechnician: 'Téc. Héctor Domínguez',
    specifications: 'Ancho de banda 430 mm, sistema servodirigido, cura LED UV, cilindros enfriadores.',
    documents: [
      { title: 'Manual de Servicio Técnico Mark Andy', type: 'Manual de Operación', fileSize: '15.6 MB', version: 'Rev 4.0' },
      { title: 'Ficha Técnica de Cabezales y Rodamientos', type: 'Ficha Técnica', fileSize: '3.4 MB', version: 'Rev 1.5' },
    ],
  },
  {
    id: 'maq-03',
    code: 'PRE-OFF-01',
    name: 'Prensa Offset Pliegos 01 (Folletería y Manuales)',
    area: 'Offset',
    category: 'Impresión Offset Pliego',
    status: 'Operativo',
    criticality: 'Alta',
    brandModelDemo: 'Heidelberg Speedmaster SM 74 4-Colores (DEMO)',
    serialNumberDemo: 'HD-2018-4412',
    installationYear: 2018,
    totalOperatingHours: 18900,
    lastMaintenanceDate: '01 Sep 2026',
    nextPreventiveDate: '01 Oct 2026',
    activeWorkOrdersCount: 0,
    accumulatedDowntimeHours: 4.0,
    responsibleTechnician: 'Ing. Roberto Garza',
    specifications: 'Formato máximo 530 x 740 mm, velocidad 15,000 pliegos/h, humectación Alcolor.',
    documents: [
      { title: 'Manual de Reparación y Calibración Heidelberg', type: 'Manual de Operación', fileSize: '22.1 MB', version: 'Rev 5.1' },
      { title: 'Plano Neumático y Bombas Becker', type: 'Diagrama Eléctrico', fileSize: '6.5 MB', version: 'Rev 1.0' },
    ],
  },
  {
    id: 'maq-04',
    code: 'PRE-OFF-02',
    name: 'Prensa Offset Pliegos 02 (Empaque)',
    area: 'Offset',
    category: 'Impresión Offset Pliego',
    status: 'Operativo',
    criticality: 'Media',
    brandModelDemo: 'Komori Lithrone G40 5-Colores (DEMO)',
    serialNumberDemo: 'KM-2020-1129',
    installationYear: 2020,
    totalOperatingHours: 11300,
    lastMaintenanceDate: '10 Ago 2026',
    nextPreventiveDate: '10 Sep 2026',
    activeWorkOrdersCount: 0,
    accumulatedDowntimeHours: 2.5,
    responsibleTechnician: 'Téc. Héctor Domínguez',
    specifications: 'Formato 720 x 1030 mm, torre de barniz acuoso, control espectral KHS-AI.',
    documents: [
      { title: 'Guía de Mantenimiento Komori Lithrone', type: 'Manual de Operación', fileSize: '18.9 MB', version: 'Rev 2.8' },
    ],
  },
  {
    id: 'maq-05',
    code: 'TRQ-BOB-01',
    name: 'Troqueladora Automática Plana 01',
    area: 'Acabado y Corte',
    category: 'Troquelado y Suajado',
    status: 'En inspección',
    criticality: 'Alta',
    brandModelDemo: 'Bobst Novacut 106 E (DEMO)',
    serialNumberDemo: 'BB-2019-3382',
    installationYear: 2019,
    totalOperatingHours: 13100,
    lastMaintenanceDate: '25 Ago 2026',
    nextPreventiveDate: '25 Sep 2026',
    activeWorkOrdersCount: 1,
    accumulatedDowntimeHours: 5.5,
    responsibleTechnician: 'Téc. Fernando Lozano',
    specifications: 'Fuerza de corte 260 T, velocidad 7,700 hojas/h, formato máximo 1060 x 760 mm.',
    documents: [
      { title: 'Manual de Calibración de Presión Bobst', type: 'Manual de Operación', fileSize: '9.8 MB', version: 'Rev 1.9' },
    ],
  },
  {
    id: 'maq-06',
    code: 'GUI-POL-01',
    name: 'Guillotina Industrial Programable 01',
    area: 'Acabado y Corte',
    category: 'Corte de Pliego y Refile',
    status: 'Mantenimiento programado',
    criticality: 'Alta',
    brandModelDemo: 'Polar 115 Plus (DEMO)',
    serialNumberDemo: 'PL-2017-5501',
    installationYear: 2017,
    totalOperatingHours: 21500,
    lastMaintenanceDate: '08 Jun 2026',
    nextPreventiveDate: '08 Sep 2026',
    activeWorkOrdersCount: 1,
    accumulatedDowntimeHours: 3.0,
    responsibleTechnician: 'Téc. Fernando Lozano',
    specifications: 'Ancho de corte 1150 mm, colchón de aire en mesa central, cambio hidráulico de cuchilla.',
    documents: [
      { title: 'Procedimiento de Cambio Seguro de Cuchilla', type: 'Checklist Preventivo', fileSize: '2.1 MB', version: 'Rev 3.0' },
    ],
  },
  {
    id: 'maq-07',
    code: 'GUI-POL-02',
    name: 'Guillotina Industrial Programable 02',
    area: 'Acabado y Corte',
    category: 'Corte de Pliego y Refile',
    status: 'Operativo',
    criticality: 'Media',
    brandModelDemo: 'Polar 92 EM-Monitor (DEMO)',
    serialNumberDemo: 'PL-2016-4190',
    installationYear: 2016,
    totalOperatingHours: 19800,
    lastMaintenanceDate: '12 Ago 2026',
    nextPreventiveDate: '12 Nov 2026',
    activeWorkOrdersCount: 0,
    accumulatedDowntimeHours: 1.5,
    responsibleTechnician: 'Téc. Fernando Lozano',
    specifications: 'Ancho de corte 920 mm, programación digital de cortes para etiquetas en rollo.',
    documents: [
      { title: 'Manual de Usuario Polar 92', type: 'Manual de Operación', fileSize: '8.4 MB', version: 'Rev 1.2' },
    ],
  },
  {
    id: 'maq-08',
    code: 'PEG-BOX-01',
    name: 'Pegadora y Doblabora de Cajas 01',
    area: 'Acabado y Corte',
    category: 'Pegado y Formado',
    status: 'Operativo',
    criticality: 'Media',
    brandModelDemo: 'Bobst Ambition 76 A2 (DEMO)',
    serialNumberDemo: 'BB-2022-7721',
    installationYear: 2022,
    totalOperatingHours: 6400,
    lastMaintenanceDate: '05 Ago 2026',
    nextPreventiveDate: '05 Nov 2026',
    activeWorkOrdersCount: 0,
    accumulatedDowntimeHours: 0.0,
    responsibleTechnician: 'Ing. Roberto Garza',
    specifications: 'Pegado lineal y fondo automático, inyectores Nordson de adhesivo caliente.',
    documents: [
      { title: 'Manual de Módulos de Adhesivo Nordson', type: 'Ficha Técnica', fileSize: '5.1 MB', version: 'Rev 2.0' },
    ],
  },
  {
    id: 'maq-09',
    code: 'CTP-AGF-01',
    name: 'Sistema de Filmación CTP Térmico 01',
    area: 'Preprensa y CTP',
    category: 'Grabado de Placas Offset',
    status: 'Operativo',
    criticality: 'Alta',
    brandModelDemo: 'Agfa Avalon N8-24 (DEMO)',
    serialNumberDemo: 'AG-2020-0081',
    installationYear: 2020,
    totalOperatingHours: 8900,
    lastMaintenanceDate: '22 Ago 2026',
    nextPreventiveDate: '22 Sep 2026',
    activeWorkOrdersCount: 0,
    accumulatedDowntimeHours: 1.0,
    responsibleTechnician: 'Ing. Roberto Garza',
    specifications: 'Láser térmico GLV 830 nm, procesadora en línea Azura, resolución 2400 dpi.',
    documents: [
      { title: 'Manual de Óptica y Limpieza de Láser', type: 'Manual de Operación', fileSize: '11.0 MB', version: 'Rev 1.8' },
    ],
  },
  {
    id: 'maq-10',
    code: 'CMP-ATL-01',
    name: 'Compresor de Tornillo Principal de Planta',
    area: 'Servicios de Planta',
    category: 'Aire Comprimido Industrial',
    status: 'Operativo',
    criticality: 'Alta',
    brandModelDemo: 'Atlas Copco GA 37 VSD+ (DEMO)',
    serialNumberDemo: 'AC-2019-1402',
    installationYear: 2019,
    totalOperatingHours: 28400,
    lastMaintenanceDate: '28 Jul 2026',
    nextPreventiveDate: '28 Oct 2026',
    activeWorkOrdersCount: 1,
    accumulatedDowntimeHours: 8.0,
    responsibleTechnician: 'Téc. Héctor Domínguez',
    specifications: 'Capacidad 37 kW, variador de velocidad, secador desecante integrado y filtros coalescentes.',
    documents: [
      { title: 'Manual de Servicio Compresor GA37', type: 'Manual de Operación', fileSize: '14.2 MB', version: 'Rev 6.0' },
      { title: 'Checklist de Presión y Drenado de Condensados', type: 'Checklist Preventivo', fileSize: '1.0 MB', version: 'Rev 1.0' },
    ],
  },
  {
    id: 'maq-11',
    code: 'MNT-TOY-01',
    name: 'Montacargas Eléctrico Hombre Sentado 01',
    area: 'Almacén y Logística',
    category: 'Manejo de Materiales',
    status: 'Operativo',
    criticality: 'Media',
    brandModelDemo: 'Toyota 8FBE20T Eléctrico (DEMO)',
    serialNumberDemo: 'TY-2021-6602',
    installationYear: 2021,
    totalOperatingHours: 7200,
    lastMaintenanceDate: '18 Ago 2026',
    nextPreventiveDate: '18 Sep 2026',
    activeWorkOrdersCount: 0,
    accumulatedDowntimeHours: 0.5,
    responsibleTechnician: 'Téc. Fernando Lozano',
    specifications: 'Capacidad 2,000 kg, mástil triplex 4.8 m, batería de tracción 48V, ruedas cushion.',
    documents: [
      { title: 'Inspección Diaria de Seguridad Montacargas', type: 'Checklist Preventivo', fileSize: '1.5 MB', version: 'Rev 2.1' },
    ],
  },
  {
    id: 'maq-12',
    code: 'EQP-SRG-01',
    name: 'Equipo de Serigrafía Semiautomático 01',
    area: 'Flexografía',
    category: 'Barnizado UV Serigráfico',
    status: 'Inactivo',
    criticality: 'Baja',
    brandModelDemo: 'Sakurai Maestro MS-80A (DEMO)',
    serialNumberDemo: 'SK-2015-0914',
    installationYear: 2015,
    totalOperatingHours: 15400,
    lastMaintenanceDate: '10 May 2026',
    nextPreventiveDate: '10 Nov 2026',
    activeWorkOrdersCount: 0,
    accumulatedDowntimeHours: 0.0,
    responsibleTechnician: 'Téc. Héctor Domínguez',
    specifications: 'Formato cilindro 550 x 750 mm, secado UV ultrarrápido, registro mecánico micrométrico.',
    documents: [
      { title: 'Manual Operativo Sakurai', type: 'Manual de Operación', fileSize: '7.8 MB', version: 'Rev 1.0' },
    ],
  },
];

// ============================================================================
// 2. CATÁLOGO DE REFACCIONES INDUSTRIALES RTM (DEMO REUTILIZABLE)
// ============================================================================
export const INITIAL_SPARE_PARTS: MaintenanceSparePart[] = [
  {
    id: 'ref-01',
    sku: 'REF-ROD-6205',
    name: 'Rodamiento Rígido de Bolas SKF 6205-2RSH (Flecha)',
    category: 'Rodamientos & Chumaceras',
    stockQuantity: 0, // Faltante intencional para Caso Demo Principal
    minStock: 4,
    uom: 'Pieza',
    unitCostMxn: 480,
    warehouseLocation: 'EST-REF-01',
    suggestedSupplier: 'Rodamientos y Retenes Industriales del Norte',
    isCritical: true,
  },
  {
    id: 'ref-02',
    sku: 'REF-LUB-OMALA',
    name: 'Aceite para Engranajes Shell Omala S2 G 220 (Cubeta 19L)',
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
    sku: 'REF-CUCH-POL',
    name: 'Cuchilla de Corte Acero Rápido HSS Polar 115',
    category: 'Herramentales de Corte',
    stockQuantity: 2,
    minStock: 1,
    uom: 'Pieza',
    unitCostMxn: 14500,
    warehouseLocation: 'EST-REF-03',
    suggestedSupplier: 'Afilados y Cuchillas Industriales de Monterrey',
    isCritical: true,
  },
  {
    id: 'ref-04',
    sku: 'REF-BND-DENT',
    name: 'Banda Dentada Sincrónica Optibelt HTD 8M-1200',
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
    sku: 'REF-FLT-COMP',
    name: 'Elemento Separador de Aceite y Aire Atlas Copco',
    category: 'Filtros & Neumática',
    stockQuantity: 0, // Faltante intencional para OT Compresor
    minStock: 2,
    uom: 'Pieza',
    unitCostMxn: 5800,
    warehouseLocation: 'EST-REF-04',
    suggestedSupplier: 'Compresores y Neumática de Reynosa',
    isCritical: true,
  },
  {
    id: 'ref-06',
    sku: 'REF-FUS-50A',
    name: 'Fusible Cerámico Ultrarrápido Bussmann 50A 690V',
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
    name: 'Lámpara de Curado UV 300 W/inch para Prensa Flexo',
    category: 'Curado UV & Iluminación',
    stockQuantity: 2,
    minStock: 2,
    uom: 'Pieza',
    unitCostMxn: 8900,
    warehouseLocation: 'EST-REF-06',
    suggestedSupplier: 'UV Systems de México',
    isCritical: true,
  },
];

// ============================================================================
// 3. ÓRDENES DE TRABAJO (OT) (CASO PRINCIPAL + ACTIVAS + HISTÓRICAS)
// ============================================================================
export const INITIAL_WORK_ORDERS: MaintenanceWorkOrder[] = [
  // CASO DEMO PRINCIPAL (Sección 14): Prensa Flexo 02 detenida por vibración
  {
    id: 'ot-01',
    folio: 'OT-MTTO-2026-0042',
    machineId: 'maq-02',
    machineCode: 'PRE-FLX-02',
    machineName: 'Prensa Flexográfica 02 (Banda Ancha)',
    area: 'Flexografía',
    type: 'Correctivo',
    priority: 'Alta',
    status: 'En espera de refacción',
    isMachineDown: true,
    downtimeHours: 14.5,
    requestedBy: 'Operador Flexo 2 (Turno Matutino)',
    assignedTechnician: 'Téc. Héctor Domínguez',
    openedAt: '06 Sep 2026 08:30',
    scheduledDate: '06 Sep 2026 09:00',
    issueDescription: 'El operador reporta vibración anormal severa en la estación de impresión 3 al alcanzar velocidad de 120 m/min. Se detuvo la línea para evitar daño en engranajes.',
    diagnosis: 'Inspección técnica confirma rodamiento con juego radial excesivo y pista picada en flecha portaclisé. Requiere reemplazo inmediato de 2 rodamientos SKF 6205-2RSH.',
    workPerformed: 'Se desmontó la carcasa protectora y se extrajo el conjunto de tracción de la estación 3. Flecha libre de fisuras pero rodamientos inutilizables.',
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
      { id: 't-01', timestamp: '06 Sep 08:30', actor: 'Supervisor de Producción', role: 'Operaciones', message: 'Falla reportada: vibración severa en estación 3. Prensa fuera de servicio.', type: 'created' },
      { id: 't-02', timestamp: '06 Sep 08:45', actor: 'Ing. Roberto Garza', role: 'Jefe de Mtto', message: 'OT generada y asignada al Téc. Héctor Domínguez con prioridad Alta.', type: 'assigned' },
      { id: 't-03', timestamp: '06 Sep 09:10', actor: 'Téc. Héctor Domínguez', role: 'Técnico Mtto', message: 'Desarme y diagnóstico concluido: rodamiento con holgura crítica.', type: 'in_progress' },
      { id: 't-04', timestamp: '06 Sep 10:15', actor: 'Téc. Héctor Domínguez', role: 'Técnico Mtto', message: 'Sin existencia en almacén de refacciones (stock 0). Se requiere Requisición urgente.', type: 'waiting_parts' },
    ],
  },
  // OT 2: Preventivo Programado Guillotina Polar (Caso Preventivo Demo)
  {
    id: 'ot-02',
    folio: 'OT-MTTO-2026-0041',
    machineId: 'maq-06',
    machineCode: 'GUI-POL-01',
    machineName: 'Guillotina Industrial Programable 01',
    area: 'Acabado y Corte',
    type: 'Preventivo',
    priority: 'Normal',
    status: 'Programada',
    isMachineDown: false,
    downtimeHours: 0.0,
    requestedBy: 'Plan Preventivo Trimestral (GUI-POL-01)',
    assignedTechnician: 'Téc. Fernando Lozano',
    openedAt: '05 Sep 2026 14:00',
    scheduledDate: '08 Sep 2026 08:00',
    issueDescription: 'Mantenimiento preventivo trimestral: lubricación de guías lineales, verificación de embrague hidráulico y sustitución de cuchilla de corte.',
    diagnosis: 'Inspección de 20,000 ciclos alcanzados. Operación normal con filo de cuchilla al 40%.',
    workPerformed: '',
    spareParts: [
      {
        id: 'sp-02',
        partId: 'ref-03',
        sku: 'REF-CUCH-POL',
        name: 'Cuchilla de Corte Acero Rápido HSS Polar 115',
        quantityUsed: 1,
        unitCostMxn: 14500,
        isSufficientStock: true,
        status: 'Surtido',
      },
      {
        id: 'sp-03',
        partId: 'ref-02',
        sku: 'REF-LUB-OMALA',
        name: 'Aceite para Engranajes Shell Omala S2 G 220 (Cubeta 19L)',
        quantityUsed: 0.25,
        unitCostMxn: 3250,
        isSufficientStock: true,
        status: 'Surtido',
      }
    ],
    timeline: [
      { id: 't-11', timestamp: '05 Sep 14:00', actor: 'Sistema de Mantenimiento', role: 'Automático', message: 'OT preventiva programada por vencimiento próximo de calendario.', type: 'created' },
      { id: 't-12', timestamp: '05 Sep 15:30', actor: 'Ing. Roberto Garza', role: 'Jefe de Mtto', message: 'Asignada a Téc. Fernando Lozano para turno matutino.', type: 'assigned' },
    ],
  },
  // OT 3: Troqueladora Bobst en Inspección
  {
    id: 'ot-03',
    folio: 'OT-MTTO-2026-0040',
    machineId: 'maq-05',
    machineCode: 'TRQ-BOB-01',
    machineName: 'Troqueladora Automática Plana 01',
    area: 'Acabado y Corte',
    type: 'Inspección',
    priority: 'Normal',
    status: 'En proceso',
    isMachineDown: false,
    downtimeHours: 1.5,
    requestedBy: 'Calidad / Acabado',
    assignedTechnician: 'Téc. Fernando Lozano',
    openedAt: '06 Sep 2026 11:20',
    scheduledDate: '06 Sep 2026 11:30',
    issueDescription: 'Revisión preventiva de sensores ópticos de despalillado y tensión de cadenas de pinzas.',
    diagnosis: 'Cadena con ligera descalibración de 1.5 mm. Sensores con acumulación de polvo de cartoncillo.',
    workPerformed: 'Limpieza de fotocélulas con alcohol isopropílico. Ajuste micrométrico de tensión de cadena en proceso.',
    spareParts: [],
    timeline: [
      { id: 't-21', timestamp: '06 Sep 11:20', actor: 'Téc. Fernando Lozano', role: 'Técnico Mtto', message: 'Inspección iniciada en paro planeado entre órdenes de empaque.', type: 'created' },
      { id: 't-22', timestamp: '06 Sep 11:35', actor: 'Téc. Fernando Lozano', role: 'Técnico Mtto', message: 'Limpieza concluida. Procediendo con verificación de paso.', type: 'in_progress' },
    ],
  },
  // OT 4: Compresor Atlas Copco esperando elemento filtrante
  {
    id: 'ot-04',
    folio: 'OT-MTTO-2026-0039',
    machineId: 'maq-10',
    machineCode: 'CMP-ATL-01',
    machineName: 'Compresor de Tornillo Principal de Planta',
    area: 'Servicios de Planta',
    type: 'Preventivo',
    priority: 'Alta',
    status: 'En espera de refacción',
    isMachineDown: false,
    downtimeHours: 0.0,
    requestedBy: 'Téc. Héctor Domínguez',
    assignedTechnician: 'Téc. Héctor Domínguez',
    openedAt: '04 Sep 2026 16:00',
    scheduledDate: '05 Sep 2026 09:00',
    issueDescription: 'Servicio de 3,000 horas: cambio de aceite sintético y reemplazo de filtro separador aire-aceite.',
    diagnosis: 'Filtro saturado al 85% de presión diferencial. Operando con compresor auxiliar en standby.',
    workPerformed: 'Aceite drenado y tanque limpiado.',
    spareParts: [
      {
        id: 'sp-04',
        partId: 'ref-05',
        sku: 'REF-FLT-COMP',
        name: 'Elemento Separador de Aceite y Aire Atlas Copco',
        quantityUsed: 1,
        unitCostMxn: 5800,
        isSufficientStock: false,
        status: 'Pendiente de compra',
      }
    ],
    timeline: [
      { id: 't-31', timestamp: '04 Sep 16:00', actor: 'Téc. Héctor Domínguez', role: 'Técnico Mtto', message: 'OT abierta por horómetro de servicio.', type: 'created' },
      { id: 't-32', timestamp: '05 Sep 09:30', actor: 'Téc. Héctor Domínguez', role: 'Técnico Mtto', message: 'Elemento separador sin stock. Esperando entrega de proveedor.', type: 'waiting_parts' },
    ],
  },
  // 10 ÓRDENES HISTÓRICAS TERMINADAS
  {
    id: 'ot-05',
    folio: 'OT-MTTO-2026-0038',
    machineId: 'maq-01',
    machineCode: 'PRE-FLX-01',
    machineName: 'Prensa Flexográfica 01 (Línea Etiquetas)',
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
    issueDescription: 'Fuga de tinta por retén desgastado en cámara cerrada de racletas estación 1.',
    diagnosis: 'Retén de teflón cuarteado por fricción.',
    workPerformed: 'Reemplazo de retenes y racleta doctor blade. Prueba hidrostática de hermeticidad satisfactoria.',
    releaseObservations: 'Equipo liberado a producción a las 12:30 sin fugas a 140 m/min.',
    spareParts: [],
    timeline: [
      { id: 't-41', timestamp: '01 Sep 10:00', actor: 'Operador Flexo 1', role: 'Operaciones', message: 'Reporte de fuga de tinta.', type: 'created' },
      { id: 't-42', timestamp: '01 Sep 12:30', actor: 'Ing. Roberto Garza', role: 'Jefe de Mtto', message: 'Retén cambiado y equipo liberado.', type: 'completed' },
    ],
  },
  {
    id: 'ot-06',
    folio: 'OT-MTTO-2026-0037',
    machineId: 'maq-03',
    machineCode: 'PRE-OFF-01',
    machineName: 'Prensa Offset Pliegos 01 (Folletería y Manuales)',
    area: 'Offset',
    type: 'Preventivo',
    priority: 'Normal',
    status: 'Terminada',
    isMachineDown: true,
    downtimeHours: 4.0,
    requestedBy: 'Plan Mensual Offset',
    assignedTechnician: 'Téc. Héctor Domínguez',
    openedAt: '28 Ago 2026 07:00',
    scheduledDate: '28 Ago 2026 07:00',
    completedAt: '28 Ago 2026 11:00',
    issueDescription: 'Limpieza profunda de tinteros, ajuste de rodillos dadores de agua y lubricación centralizada.',
    diagnosis: 'Mantenimiento mensual preventivo ordinario.',
    workPerformed: 'Calibración de dureza Shore en rodillos dadores, purga de líneas de lubricación y cambio de filtros de aire de bombas.',
    releaseObservations: 'Tiraje de prueba de escala de grises con 100% de coincidencia.',
    spareParts: [],
    timeline: [
      { id: 't-51', timestamp: '28 Ago 07:00', actor: 'Téc. Héctor Domínguez', role: 'Técnico Mtto', message: 'Inicio de preventivo programado.', type: 'in_progress' },
      { id: 't-52', timestamp: '28 Ago 11:00', actor: 'Ing. Roberto Garza', role: 'Jefe de Mtto', message: 'Calibración verificada y orden cerrada.', type: 'completed' },
    ],
  },
  {
    id: 'ot-07',
    folio: 'OT-MTTO-2026-0036',
    machineId: 'maq-09',
    machineCode: 'CTP-AGF-01',
    machineName: 'Sistema de Filmación CTP Térmico 01',
    area: 'Preprensa y CTP',
    type: 'Inspección',
    priority: 'Baja',
    status: 'Terminada',
    isMachineDown: false,
    downtimeHours: 0.5,
    requestedBy: 'Preprensa',
    assignedTechnician: 'Ing. Roberto Garza',
    openedAt: '22 Ago 2026 15:30',
    scheduledDate: '22 Ago 2026 15:30',
    completedAt: '22 Ago 2026 16:00',
    issueDescription: 'Calibración de intensidad de diodos láser y temperatura de sección de lavado de placas.',
    diagnosis: 'Desviación térmica de 1.2°C dentro de tolerancia pero recomendada calibración.',
    workPerformed: 'Ajuste de termostato y limpieza de prismas ópticos con aire seco filtrado.',
    releaseObservations: 'Placa de control procesada con microlineatura perfecta.',
    spareParts: [],
    timeline: [
      { id: 't-61', timestamp: '22 Ago 15:30', actor: 'Ing. Roberto Garza', role: 'Jefe de Mtto', message: 'Inspección de rutina completada.', type: 'completed' },
    ],
  },
  {
    id: 'ot-08',
    folio: 'OT-MTTO-2026-0035',
    machineId: 'maq-11',
    machineCode: 'MNT-TOY-01',
    machineName: 'Montacargas Eléctrico Hombre Sentado 01',
    area: 'Almacén y Logística',
    type: 'Preventivo',
    priority: 'Normal',
    status: 'Terminada',
    isMachineDown: false,
    downtimeHours: 1.0,
    requestedBy: 'Almacén PT',
    assignedTechnician: 'Téc. Fernando Lozano',
    openedAt: '18 Ago 2026 09:00',
    scheduledDate: '18 Ago 2026 09:00',
    completedAt: '18 Ago 2026 10:00',
    issueDescription: 'Inspección mensual de cadenas de elevación, nivel de electrolito de batería y zapatas de freno.',
    diagnosis: 'Cadenas sin elongación anormal. Densidad de electrolito adecuada.',
    workPerformed: 'Relleno de agua desmineralizada en 4 celdas y lubricación de mástil.',
    releaseObservations: 'Liberado para maniobras de andén.',
    spareParts: [],
    timeline: [
      { id: 't-71', timestamp: '18 Ago 09:00', actor: 'Téc. Fernando Lozano', role: 'Técnico Mtto', message: 'Servicio de montacargas completado.', type: 'completed' },
    ],
  },
  {
    id: 'ot-09',
    folio: 'OT-MTTO-2026-0034',
    machineId: 'maq-04',
    machineCode: 'PRE-OFF-02',
    machineName: 'Prensa Offset Pliegos 02 (Empaque)',
    area: 'Offset',
    type: 'Correctivo',
    priority: 'Alta',
    status: 'Terminada',
    isMachineDown: true,
    downtimeHours: 1.8,
    requestedBy: 'Operador Komori',
    assignedTechnician: 'Téc. Héctor Domínguez',
    openedAt: '14 Ago 2026 13:40',
    scheduledDate: '14 Ago 2026 13:45',
    completedAt: '14 Ago 2026 15:30',
    issueDescription: 'Disparo de alarma por sensor de atasco en salida de pliegos.',
    diagnosis: 'Fotocélula de salida desalineada por acumulación de estática y polvo.',
    workPerformed: 'Realineación de sensor, puesta a tierra de la barra antiestática y prueba con pliego SBS 14 pts.',
    releaseObservations: 'Operación continua restablecida a 11,000 pliegos/h.',
    spareParts: [],
    timeline: [
      { id: 't-81', timestamp: '14 Ago 13:40', actor: 'Téc. Héctor Domínguez', role: 'Técnico Mtto', message: 'Sensor restablecido.', type: 'completed' },
    ],
  },
  {
    id: 'ot-10',
    folio: 'OT-MTTO-2026-0033',
    machineId: 'maq-02',
    machineCode: 'PRE-FLX-02',
    machineName: 'Prensa Flexográfica 02 (Banda Ancha)',
    area: 'Flexografía',
    type: 'Correctivo',
    priority: 'Normal',
    status: 'Terminada',
    isMachineDown: true,
    downtimeHours: 3.2,
    requestedBy: 'Operador Flexo 2',
    assignedTechnician: 'Téc. Héctor Domínguez',
    openedAt: '08 Ago 2026 11:00',
    scheduledDate: '08 Ago 2026 11:15',
    completedAt: '08 Ago 2026 14:15',
    issueDescription: 'Fluctuación de tensión en desbobinador de película BOPP.',
    diagnosis: 'Freno neumático con zapatas gastadas generando variación de torque.',
    workPerformed: 'Sustitución de zapatas de freno neumático y reajuste de celda de carga de tensión.',
    releaseObservations: 'Tensión estabilizada a 2.4 bar con bobina madre.',
    spareParts: [],
    timeline: [
      { id: 't-91', timestamp: '08 Ago 11:00', actor: 'Téc. Héctor Domínguez', role: 'Técnico Mtto', message: 'Zapatas reemplazadas y calibradas.', type: 'completed' },
    ],
  },
  {
    id: 'ot-11',
    folio: 'OT-MTTO-2026-0032',
    machineId: 'maq-07',
    machineCode: 'GUI-POL-02',
    machineName: 'Guillotina Industrial Programable 02',
    area: 'Acabado y Corte',
    type: 'Preventivo',
    priority: 'Normal',
    status: 'Terminada',
    isMachineDown: false,
    downtimeHours: 1.5,
    requestedBy: 'Plan Trimestral Guillotinas',
    assignedTechnician: 'Téc. Fernando Lozano',
    openedAt: '04 Ago 2026 08:00',
    scheduledDate: '04 Ago 2026 08:00',
    completedAt: '04 Ago 2026 09:30',
    issueDescription: 'Mantenimiento trimestral general y engrase de husillo de escuadra.',
    diagnosis: 'Equipo en excelentes condiciones.',
    workPerformed: 'Limpieza de husillo con desengrasante dieléctrico y aplicación de grasa sintética.',
    releaseObservations: 'Precisión de corte verificada con micrómetro a +/- 0.1 mm.',
    spareParts: [],
    timeline: [
      { id: 't-101', timestamp: '04 Ago 08:00', actor: 'Téc. Fernando Lozano', role: 'Técnico Mtto', message: 'Preventivo concluido satisfactoriamente.', type: 'completed' },
    ],
  },
  {
    id: 'ot-12',
    folio: 'OT-MTTO-2026-0031',
    machineId: 'maq-01',
    machineCode: 'PRE-FLX-01',
    machineName: 'Prensa Flexográfica 01 (Línea Etiquetas)',
    area: 'Flexografía',
    type: 'Preventivo',
    priority: 'Normal',
    status: 'Terminada',
    isMachineDown: true,
    downtimeHours: 4.0,
    requestedBy: 'Plan Mensual Flexo',
    assignedTechnician: 'Ing. Roberto Garza',
    openedAt: '25 Jul 2026 07:00',
    scheduledDate: '25 Jul 2026 07:00',
    completedAt: '25 Jul 2026 11:00',
    issueDescription: 'Revisión mensual de lámparas UV, filtros de ventilación y rodillos anilox.',
    diagnosis: '1 lámpara UV con 1,800 horas próxima a reemplazo; anilox con buena capacidad volumétrica BCM.',
    workPerformed: 'Limpieza ultrasónica de 2 anilox y sustitución de filtros de refrigeración.',
    releaseObservations: 'Curado UV óptimo con prueba de solvente MEK.',
    spareParts: [],
    timeline: [
      { id: 't-111', timestamp: '25 Jul 07:00', actor: 'Ing. Roberto Garza', role: 'Jefe de Mtto', message: 'Servicio mensual ejecutado.', type: 'completed' },
    ],
  },
  {
    id: 'ot-13',
    folio: 'OT-MTTO-2026-0030',
    machineId: 'maq-08',
    machineCode: 'PEG-BOX-01',
    machineName: 'Pegadora y Doblabora de Cajas 01',
    area: 'Acabado y Corte',
    type: 'Inspección',
    priority: 'Baja',
    status: 'Terminada',
    isMachineDown: false,
    downtimeHours: 0.8,
    requestedBy: 'Control de Calidad Empaque',
    assignedTechnician: 'Téc. Fernando Lozano',
    openedAt: '18 Jul 2026 14:00',
    scheduledDate: '18 Jul 2026 14:00',
    completedAt: '18 Jul 2026 14:50',
    issueDescription: 'Inspección de temperatura de boquillas hot-melt y presión de correas transportadoras.',
    diagnosis: 'Boquillas limpias sin carbonización.',
    workPerformed: 'Purgado preventivo de sistema adhesivo.',
    releaseObservations: 'Línea lista para tiraje de 50,000 cajas.',
    spareParts: [],
    timeline: [
      { id: 't-121', timestamp: '18 Jul 14:00', actor: 'Téc. Fernando Lozano', role: 'Técnico Mtto', message: 'Inspección finalizada.', type: 'completed' },
    ],
  },
  {
    id: 'ot-14',
    folio: 'OT-MTTO-2026-0029',
    machineId: 'maq-10',
    machineCode: 'CMP-ATL-01',
    machineName: 'Compresor de Tornillo Principal de Planta',
    area: 'Servicios de Planta',
    type: 'Correctivo',
    priority: 'Alta',
    status: 'Terminada',
    isMachineDown: true,
    downtimeHours: 1.5,
    requestedBy: 'Seguridad de Planta',
    assignedTechnician: 'Téc. Héctor Domínguez',
    openedAt: '10 Jul 2026 16:15',
    scheduledDate: '10 Jul 2026 16:20',
    completedAt: '10 Jul 2026 17:45',
    issueDescription: 'Alarma de alta temperatura de descarga en cabezal compresor.',
    diagnosis: 'Ventilador de enfriamiento obstruido por pelusa de papel y polvo ambiental.',
    workPerformed: 'Sopleteado de radiador de aceite y verificación de termostato de bypass.',
    releaseObservations: 'Temperatura estabilizada en 82°C bajo carga continua de 7.5 bar.',
    spareParts: [],
    timeline: [
      { id: 't-131', timestamp: '10 Jul 16:15', actor: 'Téc. Héctor Domínguez', role: 'Técnico Mtto', message: 'Compresor restablecido.', type: 'completed' },
    ],
  },
];

// ============================================================================
// 4. PLANES PREVENTIVOS PROGRAMADOS (8 PLANES RTM)
// ============================================================================
export const INITIAL_PREVENTIVE_PLANS: PreventivePlan[] = [
  {
    id: 'plan-01',
    machineId: 'maq-06',
    machineCode: 'GUI-POL-01',
    machineName: 'Guillotina Industrial Programable 01',
    planName: 'Mantenimiento Trimestral de Lubricación y Cambio de Cuchilla',
    frequencyType: 'calendario',
    frequencyLabel: 'Trimestral (90 días)',
    frequencyIntervalDays: 90,
    lastExecutedDate: '08 Jun 2026',
    nextDueDate: '08 Sep 2026', // Próximo a vencer (Caso Demo B)
    status: 'Próximo',
    estimatedDurationHours: 3.5,
    checklist: [
      'Bloqueo LOTO y aislamiento de energía hidráulica',
      'Desmonte seguro y afilado de cuchilla de acero rápido',
      'Engrase de husillo de avance y guías prismáticas',
      'Verificación de barreras fotoeléctricas de seguridad',
      'Comprobación de nivel y presión de aceite hidráulico',
    ],
  },
  {
    id: 'plan-02',
    machineId: 'maq-01',
    machineCode: 'PRE-FLX-01',
    planName: 'Servicio Mensual de Lámparas UV y Rodillos Anilox',
    machineName: 'Prensa Flexográfica 01 (Línea Etiquetas)',
    frequencyType: 'calendario',
    frequencyLabel: 'Mensual (30 días)',
    frequencyIntervalDays: 30,
    lastExecutedDate: '15 Ago 2026',
    nextDueDate: '15 Sep 2026',
    status: 'Vigente',
    estimatedDurationHours: 4.0,
    checklist: [
      'Inspección de horas de vida de lámparas UV',
      'Limpieza química profunda de cilindros anilox',
      'Alineación micrométrica de rasquetas dosificadoras',
      'Comprobación de tensión en servomotores de registro',
    ],
  },
  {
    id: 'plan-03',
    machineId: 'maq-03',
    machineCode: 'PRE-OFF-01',
    planName: 'Calibración Mensual de Humectación y Tinteros Offset',
    machineName: 'Prensa Offset Pliegos 01 (Folletería y Manuales)',
    frequencyType: 'calendario',
    frequencyLabel: 'Mensual (30 días)',
    frequencyIntervalDays: 30,
    lastExecutedDate: '01 Sep 2026',
    nextDueDate: '01 Oct 2026',
    status: 'Vigente',
    estimatedDurationHours: 4.0,
    checklist: [
      'Calibración de conductividad y pH de solución de fuente',
      'Revisión de franjas de contacto en rodillos de caucho',
      'Inspección de mordazas del cilindro impresor',
      'Drenado de condensados en sistema de aire Becker',
    ],
  },
  {
    id: 'plan-04',
    machineId: 'maq-05',
    machineCode: 'TRQ-BOB-01',
    planName: 'Alineación de Cadenas de Pinzas y Lubricación de Rodillos',
    machineName: 'Troqueladora Automática Plana 01',
    frequencyType: 'calendario',
    frequencyLabel: 'Bimestral (60 días)',
    frequencyIntervalDays: 60,
    lastExecutedDate: '25 Jul 2026',
    nextDueDate: '25 Sep 2026',
    status: 'Vigente',
    estimatedDurationHours: 5.0,
    checklist: [
      'Medición de elongación de cadena de transporte de hojas',
      'Verificación de embrague neumático y freno de emergencia',
      'Limpieza y calibración de detector óptico de dobles hojas',
    ],
  },
  {
    id: 'plan-05',
    machineId: 'maq-10',
    machineCode: 'CMP-ATL-01',
    planName: 'Servicio de 3,000 Horas: Aceite y Separador de Aire',
    machineName: 'Compresor de Tornillo Principal de Planta',
    frequencyType: 'contador',
    frequencyLabel: 'Cada 3,000 Horas',
    frequencyHours: 3000,
    lastExecutedDate: '28 Jul 2026',
    nextDueDate: 'Vencido por horas (3,050 h)',
    status: 'Vencido',
    estimatedDurationHours: 3.0,
    checklist: [
      'Drenado total de lubricante Roto-Inject Fluid',
      'Sustitución de cartucho separador de aire/aceite',
      'Reemplazo de filtro de aspiración de aire',
      'Comprobación de válvula de presión mínima',
    ],
  },
  {
    id: 'plan-06',
    machineId: 'maq-11',
    machineCode: 'MNT-TOY-01',
    planName: 'Inspección Mensual de Batería, Frenos y Mástil',
    machineName: 'Montacargas Eléctrico Hombre Sentado 01',
    frequencyType: 'calendario',
    frequencyLabel: 'Mensual (30 días)',
    frequencyIntervalDays: 30,
    lastExecutedDate: '18 Ago 2026',
    nextDueDate: '18 Sep 2026',
    status: 'Vigente',
    estimatedDurationHours: 1.5,
    checklist: [
      'Comprobación de densidad de electrolito en 24 celdas',
      'Inspección de desgaste en zapatas y mangueras hidráulicas',
      'Prueba de claxon, alarma de reversa y torreta',
    ],
  },
  {
    id: 'plan-07',
    machineId: 'maq-09',
    machineCode: 'CTP-AGF-01',
    planName: 'Limpieza Óptica de Láser y Mantenimiento de Procesadora',
    machineName: 'Sistema de Filmación CTP Térmico 01',
    frequencyType: 'calendario',
    frequencyLabel: 'Mensual (30 días)',
    frequencyIntervalDays: 30,
    lastExecutedDate: '22 Ago 2026',
    nextDueDate: '22 Sep 2026',
    status: 'Vigente',
    estimatedDurationHours: 2.0,
    checklist: [
      'Limpieza con aire filtrado del cabezal térmico GLV',
      'Drenado y lavado de cubas de goma y secado',
      'Calibración de rodillos escurridores de placa',
    ],
  },
  {
    id: 'plan-08',
    machineId: 'maq-08',
    machineCode: 'PEG-BOX-01',
    planName: 'Purga y Calibración de Inyectores Hot-Melt',
    machineName: 'Pegadora y Doblabora de Cajas 01',
    frequencyType: 'calendario',
    frequencyLabel: 'Trimestral (90 días)',
    frequencyIntervalDays: 90,
    lastExecutedDate: '05 Ago 2026',
    nextDueDate: '05 Nov 2026',
    status: 'Vigente',
    estimatedDurationHours: 2.5,
    checklist: [
      'Purga de tanque y líneas calefactadas Nordson',
      'Inspección de temperatura de boquillas y sensores RTD',
      'Tensión y alineación de bandas transportadoras',
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

