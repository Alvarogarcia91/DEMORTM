// ============================================================================
// MODELO DE DATOS Y MOCKS V9 — PISO DE PRODUCCIÓN, OPERADOR Y SCRAP
// ============================================================================

export type ScrapUom = 'piezas' | 'pliegos' | 'kg' | 'm' | 'ft' | 'etiquetas' | 'rollos' | 'hojas';

export type ScrapEventType =
  | 'Arranque / setup'
  | 'Proceso'
  | 'Cambio de ajuste'
  | 'Cambio de material'
  | 'Rechazo QA'
  | 'Merma de arranque'
  | 'Merma de proceso'
  | 'Falla mecánica'
  | 'Materia prima defectuosa'
  | 'Ajuste de registro'
  | 'Variación de tono'
  | 'Otro';

export interface ProductionScrapEvent {
  id: string;
  opId: string;
  opFolio: string;
  client: string;
  partNumber: string;
  routingStep: string;
  routingStepNumber?: number;
  machine: string;
  operator: string;
  timestamp: string;
  recordedAt?: string;
  quantity: number;
  unit: ScrapUom | string;
  type: ScrapEventType | string;
  category4M: 'Máquina' | 'Material' | 'Mano de obra' | 'Método';
  reason: string;
  comment: string;
  scrapPercentBefore: number;
  scrapPercentAfter: number;
  scrapPercentContribution?: number; // % aporte al margen de la OP
  materialLot?: string;
  substrate?: string;
}

export interface ProductionDowntimeEvent {
  id: string;
  opId: string;
  opFolio: string;
  machine: string;
  operator: string;
  timestamp: string;
  durationMinutes: number;
  code: '100' | '200' | '300' | '400';
  codeDescription: string;
  category4M: 'Máquina' | 'Material' | 'Mano de obra' | 'Método';
  reason: string;
  comment: string;
}

export interface OperatorTerminal {
  id: string;
  machineName: string;
  machineCode: string;
  area: 'Flexografía' | 'Offset' | 'Acabados';
  status: 'Operativa' | 'Mantenimiento' | 'Detenida';
  assignedOperator: {
    employeeNumber: string;
    name: string;
    shift: 'Turno A (Matutino)' | 'Turno B (Vespertino)' | 'Turno C (Nocturno)';
  };
  todayMetrics: {
    productiveTime: string; // e.g. "03:42"
    lostTime: string; // e.g. "00:28"
    goodUnits: number;
    scrapPercent: number;
  };
}

export interface ProductionSuggestion {
  id: string;
  context: 'piso' | 'scrap' | 'planeacion' | 'analitica';
  title: string;
  message: string;
  actionLabel: string;
  actionTarget?: string;
  estimatedSavingMinutes?: number;
  priority: 'alta' | 'media' | 'informativa';
}

// ----------------------------------------------------------------------------
// 1. TERMINALES DE MÁQUINA CONFIGURADAS
// ----------------------------------------------------------------------------
export const INITIAL_TERMINALS: OperatorTerminal[] = [
  {
    id: 'term-flx-03',
    machineName: 'MARK ANDY SCOUT 10"',
    machineCode: 'FLX-03',
    area: 'Flexografía',
    status: 'Operativa',
    assignedOperator: {
      employeeNumber: '0174',
      name: 'Herón Villarreal',
      shift: 'Turno A (Matutino)'
    },
    todayMetrics: {
      productiveTime: '03:42',
      lostTime: '00:28',
      goodUnits: 31420,
      scrapPercent: 2.7
    }
  },
  {
    id: 'term-off-01',
    machineName: 'HEIDELBERG SPEEDMASTER SM 74',
    machineCode: 'OFF-01',
    area: 'Offset',
    status: 'Operativa',
    assignedOperator: {
      employeeNumber: '0089',
      name: 'Martín Escobedo',
      shift: 'Turno A (Matutino)'
    },
    todayMetrics: {
      productiveTime: '04:15',
      lostTime: '00:15',
      goodUnits: 22800,
      scrapPercent: 2.1
    }
  },
  {
    id: 'term-aca-02',
    machineName: 'STAHLFOLDER TI-52',
    machineCode: 'ACA-02',
    area: 'Acabados',
    status: 'Operativa',
    assignedOperator: {
      employeeNumber: '0211',
      name: 'Gonzalo Treviño',
      shift: 'Turno A (Matutino)'
    },
    todayMetrics: {
      productiveTime: '02:50',
      lostTime: '00:45',
      goodUnits: 14200,
      scrapPercent: 1.8
    }
  },
  {
    id: 'term-flx-06',
    machineName: 'ROTOFLEX I · REBOBINADO',
    machineCode: 'FLX-06',
    area: 'Flexografía',
    status: 'Operativa',
    assignedOperator: {
      employeeNumber: '0142',
      name: 'Carlos Ramos',
      shift: 'Turno A (Matutino)'
    },
    todayMetrics: {
      productiveTime: '03:10',
      lostTime: '00:12',
      goodUnits: 48900,
      scrapPercent: 1.2
    }
  }
];

// ----------------------------------------------------------------------------
// 2. HISTORIAL INICIAL DE SCRAP (EVENTOS EN PISO CON UOM REAL V12)
// ----------------------------------------------------------------------------
export const INITIAL_SCRAP_EVENTS: ProductionScrapEvent[] = [
  {
    id: 'SCR-2026-081',
    opId: 'op-01',
    opFolio: 'OP-95321',
    client: 'FRESENIUS MEDICAL CARE',
    partNumber: 'ET-FMC-001-REV-C',
    routingStep: 'Impresión Flexo 4 Tintas + UV',
    routingStepNumber: 1,
    machine: 'MARK ANDY SCOUT 10"',
    operator: 'Herón Villarreal',
    timestamp: '07 Sep · 09:24',
    quantity: 120,
    unit: 'm',
    type: 'Cambio de ajuste',
    category4M: 'Máquina',
    reason: 'Descalce de registro en cilindro 3 (Cyan) al subir velocidad',
    comment: 'Desplazamiento micrométrico al acelerar de 150 a 220 ft/min. Calibrado con lupa.',
    scrapPercentBefore: 2.72,
    scrapPercentAfter: 3.74,
    scrapPercentContribution: 1.02,
    materialLot: 'PPBC-260721',
    substrate: 'BOPP Blanco Brillante',
  },
  {
    id: 'SCR-2026-082',
    opId: 'op-01',
    opFolio: 'OP-95321',
    client: 'FRESENIUS MEDICAL CARE',
    partNumber: 'ET-FMC-001-REV-C',
    routingStep: 'Prensa Flexográfica Scout 10"',
    routingStepNumber: 1,
    machine: 'MARK ANDY SCOUT 10"',
    operator: 'Herón Villarreal',
    timestamp: '07 Sep · 08:30',
    quantity: 85,
    unit: 'm',
    type: 'Arranque / setup',
    category4M: 'Método',
    reason: 'Pruebas de arranque y calibración de suaje rotativo',
    comment: 'Alineación de casetera de corte al liner en bobina inicial.',
    scrapPercentBefore: 0.0,
    scrapPercentAfter: 0.72,
    scrapPercentContribution: 0.72,
    materialLot: 'PPBC-260721',
    substrate: 'BOPP Blanco Brillante',
  },
  {
    id: 'SCR-2026-083',
    opId: 'op-02',
    opFolio: 'OP-95344',
    client: 'BLACK & DECKER',
    partNumber: 'MN-BD-4402',
    routingStep: 'Impresión Offset Pliegos',
    routingStepNumber: 2,
    machine: 'HEIDELBERG SPEEDMASTER SM 74',
    operator: 'Martín Escobedo',
    timestamp: '07 Sep · 08:45',
    quantity: 240,
    unit: 'pliegos',
    type: 'Arranque / setup',
    category4M: 'Método',
    reason: 'Entonación y balance agua-tinta inicial en pliegos de 32 páginas',
    comment: 'Arranque de pliegos 32 páginas. Densidad estabilizada en pliego 241.',
    scrapPercentBefore: 0.0,
    scrapPercentAfter: 1.80,
    scrapPercentContribution: 1.80,
    materialLot: 'LOT-BOND60-2026',
    substrate: 'Papel Bond 60g',
  },
  {
    id: 'SCR-2026-084',
    opId: 'op-02',
    opFolio: 'OP-95344',
    client: 'BLACK & DECKER',
    partNumber: 'MN-BD-4402',
    routingStep: 'Guillotina',
    routingStepNumber: 3,
    machine: 'POLAR 115 EMC-MON',
    operator: 'Roberto Dávila',
    timestamp: '07 Sep · 10:15',
    quantity: 42,
    unit: 'pliegos',
    type: 'Proceso',
    category4M: 'Máquina',
    reason: 'Refile de escuadra y desbarbado de lomo manual',
    comment: 'Corte trilateral para preparar alzado.',
    scrapPercentBefore: 1.80,
    scrapPercentAfter: 2.11,
    scrapPercentContribution: 0.31,
    materialLot: 'LOT-BOND60-2026',
    substrate: 'Papel Bond 60g',
  },
  {
    id: 'SCR-2026-085',
    opId: 'op-02',
    opFolio: 'OP-95344',
    client: 'BLACK & DECKER',
    partNumber: 'MN-BD-4402',
    routingStep: 'Doblado',
    routingStepNumber: 4,
    machine: 'STAHLFOLDER TI-52',
    operator: 'Gonzalo Treviño',
    timestamp: '07 Sep · 11:30',
    quantity: 95,
    unit: 'piezas',
    type: 'Proceso',
    category4M: 'Método',
    reason: 'Atasco en parrilla 3 por variación de estática',
    comment: 'Calibración de rodillos de doblez en cruz.',
    scrapPercentBefore: 2.11,
    scrapPercentAfter: 2.82,
    scrapPercentContribution: 0.71,
  },
  {
    id: 'SCR-2026-086',
    opId: 'op-03',
    opFolio: 'OP-95333',
    client: 'PANASONIC AUTOMOTIVE',
    partNumber: 'ET-PAN-7721',
    routingStep: 'Impresión Flexo + Barniz',
    routingStepNumber: 1,
    machine: 'MARK ANDY 2200-10',
    operator: 'Julio Morales',
    timestamp: '07 Sep · 11:30',
    quantity: 190,
    unit: 'm',
    type: 'Variación de tono',
    category4M: 'Material',
    reason: 'Delta E > 1.2 en tono negro Pantone Black C',
    comment: 'Viscosidad de tinta se elevó en charola. Dilución con solvente y ajuste.',
    scrapPercentBefore: 3.8,
    scrapPercentAfter: 5.2,
    scrapPercentContribution: 1.40,
    materialLot: 'LOT-INK-BK-09',
    substrate: 'Polipropileno Térmico',
  },
  {
    id: 'SCR-2026-087',
    opId: 'op-05',
    opFolio: 'OP-95326',
    client: 'TYCO ELECTRONICS',
    partNumber: 'IS-2420',
    routingStep: 'Troquelado Rotativo',
    routingStepNumber: 1,
    machine: 'MARK ANDY 4120 17"',
    operator: 'Carlos Lozano',
    timestamp: '07 Sep · 12:45',
    quantity: 14.2,
    unit: 'kg',
    type: 'Proceso',
    category4M: 'Máquina',
    reason: 'Matriz de desorillado rota al enhebrar extractor de malla',
    comment: 'Pesaje directo en báscula de piso: 14.2 kg de malla acordonada.',
    scrapPercentBefore: 2.4,
    scrapPercentAfter: 3.55,
    scrapPercentContribution: 1.15,
  },
  {
    id: 'SCR-2026-088',
    opId: 'op-06',
    opFolio: 'OP-95340',
    client: 'LABORATORIOS MEDIFARMA',
    partNumber: 'LBL-MED-500',
    routingStep: 'Rebobinado e Inspección',
    routingStepNumber: 2,
    machine: 'ROTOFLEX I',
    operator: 'Alfonso Soto',
    timestamp: '07 Sep · 13:20',
    quantity: 46,
    unit: 'm',
    type: 'Rechazo QA',
    category4M: 'Mano de obra',
    reason: 'Empalme mal alineado detectado en estroboscopio',
    comment: 'Se cortó sección defectuosa y se rehizo el empalme a 90 grados.',
    scrapPercentBefore: 1.9,
    scrapPercentAfter: 2.29,
    scrapPercentContribution: 0.39,
  }
];

// ----------------------------------------------------------------------------
// 3. HISTORIAL DE PAROS E INCIDENCIAS (CÓDIGOS RTM 100, 200, 300, 400)
// ----------------------------------------------------------------------------
export const INITIAL_DOWNTIME_EVENTS: ProductionDowntimeEvent[] = [
  {
    id: 'DWN-2026-001',
    opId: 'op-01',
    opFolio: 'OP-95321',
    machine: 'MARK ANDY SCOUT 10"',
    operator: 'Herón Villarreal',
    timestamp: '07 Sep · 07:46',
    durationMinutes: 17,
    code: '200',
    codeDescription: 'Problemas mecánicos',
    category4M: 'Máquina',
    reason: 'Atasco en sensor de tensión de desbobinador',
    comment: 'Sensor óptico con polvo de papel. Se limpió y se reanudó sin refacción.'
  },
  {
    id: 'DWN-2026-002',
    opId: 'op-04',
    opFolio: 'OP-95345',
    machine: 'STAHLFOLDER TI-52',
    operator: 'Gonzalo Treviño',
    timestamp: '07 Sep · 09:10',
    durationMinutes: 45,
    code: '200',
    codeDescription: 'Problemas mecánicos',
    category4M: 'Máquina',
    reason: 'Atasco en doblez cruzado y rodamiento trabado',
    comment: 'Se solicitó OT-MANT-2026-092. Técnico Roberto Garza en sitio.'
  }
];

// ----------------------------------------------------------------------------
// 4. SUGERENCIAS DEL SISTEMA (PATRÓN MORADO DEL ERP)
// ----------------------------------------------------------------------------
export const INITIAL_PRODUCTION_SUGGESTIONS: ProductionSuggestion[] = [
  {
    id: 'sug-piso-01',
    context: 'piso',
    title: 'Optimización de Secuencia de Setup',
    message: 'La siguiente OP en cola (OP-95326 TYCO) utiliza el mismo sustrato BoPP blanco y tintas base Cyan/Black. Mantenerla consecutiva evitará ~25 min de lavado y montaje.',
    actionLabel: 'Ver cola priorizada',
    actionTarget: 'cola',
    estimatedSavingMinutes: 25,
    priority: 'alta'
  },
  {
    id: 'sug-scrap-01',
    context: 'scrap',
    title: 'Alerta Preventiva de Merma',
    message: 'OP-95321 acumuló 4.3% de scrap (+1.5 pts tras cambio de bobina). Causa principal: desprendimiento de liner. Se sugiere verificar presión de troquel antes de exceder el límite del 5.0%.',
    actionLabel: 'Solicitar revisión QA',
    actionTarget: 'qa',
    priority: 'alta'
  },
  {
    id: 'sug-planeacion-01',
    context: 'planeacion',
    title: 'Balanceo de Carga de Prensa',
    message: 'Mark Andy 2200-10 se proyecta al 96% de capacidad esta semana. Mark Andy Scout 10" cuenta con herramental compatible y 24% de holgura disponible.',
    actionLabel: 'Reasignar orden',
    actionTarget: 'planeacion',
    estimatedSavingMinutes: 40,
    priority: 'media'
  },
  {
    id: 'sug-qa-01',
    context: 'piso',
    title: 'Control Periódico QA Próximo (>2h)',
    message: 'La Mark Andy Scout lleva 1h 52m desde el último control QA. Programa la revisión antes de llegar a las 2h para evitar paro.',
    actionLabel: 'Solicitar ahora',
    actionTarget: 'qa',
    priority: 'alta'
  },
  {
    id: 'sug-qa-02',
    context: 'piso',
    title: 'Validación de Cambio de Bobina Requerida',
    message: 'La OP-95321 cambió de bobina y aún no registra validación de arranque en estación de Calidad.',
    actionLabel: 'Ver pendiente QA',
    actionTarget: 'qa',
    priority: 'alta'
  },
  {
    id: 'sug-qa-03',
    context: 'piso',
    title: 'Auditoría Final Obligatoria Pendiente',
    message: 'La auditoría final de OP-95344 está pendiente y bloquea la liberación del lote hacia Producto Terminado.',
    actionLabel: 'Ir a Calidad',
    actionTarget: 'qa',
    priority: 'alta'
  }
];
