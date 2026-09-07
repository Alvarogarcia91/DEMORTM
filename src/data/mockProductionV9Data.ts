// ============================================================================
// MODELO DE DATOS Y MOCKS V9 — PISO DE PRODUCCIÓN, OPERADOR Y SCRAP
// ============================================================================

export interface ProductionScrapEvent {
  id: string;
  opId: string;
  opFolio: string;
  client: string;
  partNumber: string;
  routingStep: string;
  machine: string;
  operator: string;
  timestamp: string;
  quantity: number;
  unit: 'Etiquetas' | 'Pliegos' | 'Piezas' | 'Metros' | 'Hojas';
  type: 'Merma de arranque' | 'Merma de proceso' | 'Falla mecánica' | 'Materia prima defectuosa' | 'Ajuste de registro' | 'Variación de tono';
  category4M: 'Máquina' | 'Material' | 'Mano de obra' | 'Método';
  reason: string;
  comment: string;
  scrapPercentBefore: number;
  scrapPercentAfter: number;
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
// 2. HISTORIAL INICIAL DE SCRAP (EVENTOS EN PISO)
// ----------------------------------------------------------------------------
export const INITIAL_SCRAP_EVENTS: ProductionScrapEvent[] = [
  {
    id: 'SCR-2026-081',
    opId: 'op-01',
    opFolio: 'OP-95321',
    client: 'FRESENIUS MEDICAL CARE',
    partNumber: 'ET-FMC-001-REV-C',
    routingStep: 'Impresión Flexo 4 Tintas + UV',
    machine: 'MARK ANDY SCOUT 10"',
    operator: 'Herón Villarreal',
    timestamp: '07 Sep · 09:24',
    quantity: 350,
    unit: 'Etiquetas',
    type: 'Ajuste de registro',
    category4M: 'Método',
    reason: 'Registro fuera de posición en cilindro 3 (Cyan)',
    comment: 'Desplazamiento micrométrico al acelerar de 150 a 220 ft/min. Calibrado con lupa.',
    scrapPercentBefore: 2.8,
    scrapPercentAfter: 3.5
  },
  {
    id: 'SCR-2026-082',
    opId: 'op-01',
    opFolio: 'OP-95321',
    client: 'FRESENIUS MEDICAL CARE',
    partNumber: 'ET-FMC-001-REV-C',
    routingStep: 'Troquelado Rotativo',
    machine: 'MARK ANDY SCOUT 10"',
    operator: 'Herón Villarreal',
    timestamp: '07 Sep · 10:15',
    quantity: 420,
    unit: 'Etiquetas',
    type: 'Merma de proceso',
    category4M: 'Material',
    reason: 'Desprendimiento de liner por falta de siliconado',
    comment: 'Lote de bobina BoPP PPBC-260721 presentó zona seca. Se descartaron 20 metros.',
    scrapPercentBefore: 3.5,
    scrapPercentAfter: 4.3
  },
  {
    id: 'SCR-2026-083',
    opId: 'op-02',
    opFolio: 'OP-95344',
    client: 'BLACK & DECKER',
    partNumber: 'MN-BD-4402',
    routingStep: 'Impresión Offset Pliegos',
    machine: 'HEIDELBERG SPEEDMASTER SM 74',
    operator: 'Martín Escobedo',
    timestamp: '07 Sep · 08:45',
    quantity: 180,
    unit: 'Pliegos',
    type: 'Merma de arranque',
    category4M: 'Método',
    reason: 'Entonación y balance agua-tinta inicial',
    comment: 'Arranque de pliegos 32 páginas. Densidad estabilizada en pliego 181.',
    scrapPercentBefore: 0.0,
    scrapPercentAfter: 1.8
  },
  {
    id: 'SCR-2026-084',
    opId: 'op-03',
    opFolio: 'OP-95333',
    client: 'PANASONIC AUTOMOTIVE',
    partNumber: 'ET-PAN-7721',
    routingStep: 'Impresión Flexo + Barniz',
    machine: 'MARK ANDY 2200-10',
    operator: 'Julio Morales',
    timestamp: '07 Sep · 11:30',
    quantity: 580,
    unit: 'Etiquetas',
    type: 'Variación de tono',
    category4M: 'Material',
    reason: 'Delta E > 1.2 en tono negro Pantone Black C',
    comment: 'Viscosidad de tinta se elevó en charola. Dilución con solvente y ajuste.',
    scrapPercentBefore: 3.8,
    scrapPercentAfter: 5.2
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
  }
];
