export type QualityStatus =
  | 'Pendiente'
  | 'En inspección'
  | 'Conforme'
  | 'No conforme'
  | 'Liberado'
  | 'Hold';

export interface QualityRelease {
  id: string;
  event: string;
  op: string;
  pedido: string;
  cliente: string;
  part: string;
  revision: string;
  area: 'Offset' | 'Flexografía' | 'Acabados' | 'Almacén MP';
  line: string;
  operator: string;
  shift: string;
  status: QualityStatus;
  waiting: string;
  auditor: string;
  lot: string;
  priority: 'Alta' | 'Media' | 'Normal';
  scheduledAt?: string;
  operationType?: string;
  defectCount?: number;
  batches?: BatchSample[];
  mncId?: string;
}

export interface BatchSample {
  id: string;
  batchNumber: string;
  producedQty: number;
  sampleSize: number;
  defectsFound: number;
  status: 'Conforme' | 'Pendiente' | 'No conforme';
  packageCount?: number;
  unitPerPackage?: number;
}

export interface NonConformance {
  id: string;
  op: string;
  client: string;
  area: string;
  location: string;
  defect: string;
  quantity: number;
  status: 'Hold' | 'Retrabajo' | 'Scrap';
  severity?: 'Crítico' | 'Mayor' | 'Menor';
  disposition?: string;
  date?: string;
  auditor?: string;
}

export interface PeriodicControl {
  id: string;
  name: string;
  location: string;
  frequency: string; // Ej: "Cada 2 h (Demo configurable)"
  parameter: string;
  unit: string;
  minVal: number;
  maxVal: number;
  targetVal: number;
  lastValue: number;
  lastCapturedAt: string;
  nextDueAt: string;
  auditor: string;
  instrument: string;
  instrumentCalibrationDue: string;
  status: 'Al corriente' | 'Próxima' | 'Vencida' | 'Fuera de rango';
  history: {
    id: string;
    value: number;
    timestamp: string;
    auditor: string;
    status: 'Conforme' | 'Fuera de rango';
    observation?: string;
  }[];
}

export interface QualityAuditItem {
  id: string;
  folio: string;
  type:
    | 'Primera pieza'
    | 'Control > 2 horas'
    | 'Auditoría final'
    | 'Incoming'
    | 'Validación de remanente'
    | 'Preimpresión'
    | 'Cambio de bobina'
    | 'Ajuste de máquina'
    | 'Cambio de turno';
  origin: string; // OP-2026-95250, OC-2026-1402, BOB-REM-042, etc.
  client: string;
  part: string;
  revision: string;
  area: 'Flexografía' | 'Offset' | 'Acabados' | 'Almacén MP';
  line: string;
  operator: string;
  auditor: string;
  scheduledAt: string;
  status: QualityStatus;
  waitingMinutes: number;
  operationType:
    | 'Impresión'
    | 'Corte'
    | 'Doblado'
    | 'Intercalado / Grapado'
    | 'Impresión + Troquel'
    | 'Conteo / Rebobinado'
    | 'Incoming'
    | 'Remanente'
    | 'Auditoría Final';
  checklistResults?: {
    criterion: string;
    spec: string;
    measured?: string;
    result: 'Conforme' | 'No conforme' | 'N/A';
    note?: string;
  }[];
  defectCount?: number;
  batches?: BatchSample[];
  mncId?: string;
  labelsAvailable?: boolean;
  notes?: string;
}

export interface IncomingInspection {
  id: string;
  poFolio: string;
  supplier: string;
  material: string;
  supplierLot: string;
  rtmLot: string;
  orderedQty: string;
  receivedQty: string;
  coaAttached: boolean;
  appearanceConforming: boolean;
  specConforming: boolean;
  thicknessMeasured: string;
  status: 'Pendiente' | 'Liberado' | 'HOLD / Rechazado';
  date: string;
  auditor: string;
  notes?: string;
}

export interface RemnantValidation {
  id: string;
  remnantCode: string;
  substrate: string;
  remainingFt: number;
  widthMm: number;
  lot: string;
  originOp: string;
  visualCondition: 'Excelente' | 'Aceptable' | 'Dañado / Con polvo';
  adhesiveTested: boolean;
  clientRestriction: string;
  dictamen: 'Apto para reutilizar' | 'No apto / Scrap' | 'Mantener en cuarentena' | 'Pendiente';
  date: string;
  auditor: string;
  destination: string;
}

export interface ZebraLabelConfig {
  id: string;
  type:
    | 'Identificación de Caja'
    | 'Parcial de Producción'
    | 'Batch / Lote'
    | 'Primera Pieza Aprobada'
    | 'Material en HOLD';
  standardCode: string; // FM-QA-153, FM-QA-154, etc.
  opFolio: string;
  client: string;
  partNumber: string;
  revision: string;
  lotNumber: string;
  quantity: number;
  boxNumber?: string;
  totalBoxes?: string;
  auditor: string;
  date: string;
  status: 'Conforme' | 'Aprobado' | 'HOLD / Cuarentena';
}

// ----------------------------------------------------
// CHECKLISTS ESPECÍFICOS POR OPERACIÓN (Sección 8)
// ----------------------------------------------------
export const OPERATION_CHECKLISTS: Record<string, [string, string, string][]> = {
  'Impresión': [
    ['Número de parte y revisión', 'Arte vigente aprobado por cliente', 'Conforme'],
    ['Texto y legibilidad', '100% nítido sin empaste ni velo', 'Conforme'],
    ['Color y densidad espectral', 'Tolerancia ΔE < 2.0 vs Pantone aprobado', 'ΔE 0.8 Conforme'],
    ['Registro de colores', '± 0.005 in entre cilindros / formas', '0.003 in Conforme'],
    ['Ausencia de manchas / escurrimientos', 'Cero manchas en área de texto y gráficos', 'Conforme'],
    ['Lote de tinta utilizado', 'Lote vigente registrado en OP', 'Conforme'],
    ['Diseño vs muestra aprobada', 'Coincidencia 100% con máster firmado', 'Conforme'],
  ],
  'Corte': [
    ['Ancho de pliego / tira', '± 0.5 mm vs orden técnica', '570.2 mm Conforme'],
    ['Largo de pliego / tira', '± 0.5 mm vs orden técnica', '870.0 mm Conforme'],
    ['Escuadra y corte limpio', '90° exactos sin rebaba ni jalón de guillotina', 'Conforme'],
    ['Orientación de hilo / fibra', 'Hilo paralelo al lomo de doblado', 'Conforme'],
    ['Tolerancias dimensionales', 'Dentro de especificación ISO 216', 'Conforme'],
    ['Cantidad por paquete', 'Contaje exacto flejado con testigo', 'Conforme'],
  ],
  'Doblado': [
    ['Secuencia de paginado', 'Correlativo 1 a 64 sin saltos ni traslapes', 'Conforme'],
    ['Orientación de pliegos', 'Cabezas alineadas al corte', 'Conforme'],
    ['Medida final doblada', '± 1.0 mm tras paso por cuchillas Stahl', 'Conforme'],
    ['Calidad de doblez', 'Sin quiebre de fibra ni arrugas en lomo', 'Conforme'],
    ['Páginas completas', '16 páginas por forma doblada verificadas', 'Conforme'],
  ],
  'Intercalado / Grapado': [
    ['Orden correlativo de pliegos', 'Forma 1 + Forma 2 encajadas correctamente', 'Conforme'],
    ['Cantidad de grapas', '2 grapas de alambre al lomo estándar', '2 grapas Conforme'],
    ['Posición y centrado de grapas', 'A 50 mm de extremos superior/inferior', 'Conforme'],
    ['Firmeza y remachado', 'Grapa cerrada plana sin perforación excesiva', 'Conforme'],
    ['Presentación y refile trilateral', 'Corte limpio a 3 caras sin diente de sierra', 'Conforme'],
  ],
  'Impresión + Troquel': [
    ['Registro impresión vs troquel', '± 0.010 in centrado respecto a borde', '0.005 in Conforme'],
    ['Dimensiones de etiqueta', 'Largo y ancho exactos vs plano técnico', '4.00 x 2.00 in Conforme'],
    ['Profundidad de corte (Kiss-cut)', 'Corte perfecto de frontal sin marcar el liner de silicón', 'Conforme'],
    ['Integridad de liner y expulsión', 'Desmalle limpio sin desgarre de matriz', 'Conforme'],
    ['Paso / repetición de etiqueta', 'Distancia entre etiquetas constante', '0.125 in Conforme'],
    ['Defectos visibles / barniz UV', 'Barniz uniforme sin burbujas ni ojos de pescado', 'Conforme'],
  ],
  'Conteo / Rebobinado': [
    ['Cantidad de etiquetas por rollo', '1,000 etiquetas exactas por bobina terminada', '1,000 Conforme'],
    ['Sentido de embobinado', 'Posición #3 (cabeza afuera a la izquierda)', 'Posición #3 Conforme'],
    ['Tensión y alineación de rollo', 'Bobina firme sin telescopiado ni orillas onduladas', 'Conforme'],
    ['Identificación en centro de cartón', 'Mandril de 3" con sello de inspector y lote', 'Conforme'],
    ['Empaque y flejado de rollos', 'Bolsa de polietileno con etiqueta identificadora', 'Conforme'],
  ],
  'Incoming': [
    ['Certificado de Calidad (CoA)', 'Entregado por proveedor con lote coincidente', 'Conforme'],
    ['Apariencia y condición de empaque', 'Tarimas y rollos flejados sin golpes ni humedad', 'Conforme'],
    ['Calibre / espesor de sustrato', '± 5% vs especificación de compra', '2.8 mil Conforme'],
    ['Ancho de bobina / pliego', 'Medida exacta dentro de tolerancia', '10.0 in Conforme'],
    ['Identificación y etiquetado', 'Lote de proveedor cruzado con lote interno RTM', 'Conforme'],
  ],
  'Remanente': [
    ['Condición visual del sustrato', 'Libre de polvo, arrugas o zonas expuestas de adhesivo', 'Conforme'],
    ['Bobinado y tensión', 'Rollo firme sin deformación ni aplastamiento', 'Conforme'],
    ['Metraje remanente verificado', 'Metraje medido coincide con etiqueta de sobrante', '850 ft Conforme'],
    ['Prueba rápida de adhesión (Tack)', 'Adhesivo activo con anclaje firme en superficie de prueba', 'Conforme'],
    ['Historial de temperatura en almacén', 'Resguardado en cuarto controlado 20–24 °C', 'Conforme'],
  ],
  'Auditoría Final': [
    ['Número de parte y revisión en empaque', 'Coincide con orden de producción y máster', 'Conforme'],
    ['Inspección de atributos generales', 'Texto, color, registro, corte y acabados conformes', 'Conforme'],
    ['Muestreo AQL inspeccionado', 'Tamaño de muestra según lote (0 defectos críticos)', 'Conforme'],
    ['Etiquetado y códigos de barra', 'Lectura 100% verificada con lector 2D Honeywell', 'Grado A Conforme'],
    ['Empaque y paletizado', 'Cajas rotuladas con FM-QA-153 y estibado seguro', 'Conforme'],
    ['Cantidad neta para entrega', 'Conteo de piezas buenas coincide con remisión interna', 'Conforme'],
  ],
};

// ----------------------------------------------------
// CONTROLES PERIÓDICOS (AMBIENTALES Y PROCESO)
// ----------------------------------------------------
export const PERIODIC_CONTROLS: PeriodicControl[] = [
  {
    id: 'CTL-01',
    name: 'Temperatura cuarto de adhesivos y sustratos sensibles',
    location: 'Cuarto de Almacenamiento Climatizado',
    frequency: 'Cada 2 h (Demo configurable)',
    parameter: 'Temperatura ambiente',
    unit: '°C',
    minVal: 20.0,
    maxVal: 24.0,
    targetVal: 22.0,
    lastValue: 25.8, // Marcada como fuera de rango para demo
    lastCapturedAt: '07 Sep · 08:00',
    nextDueAt: '10:00 (Vencida)',
    auditor: 'Alicia Ramírez',
    instrument: 'Termohigrómetro Digital QA-HG-004',
    instrumentCalibrationDue: '18 Nov 2026',
    status: 'Fuera de rango',
    history: [
      { id: 'h-1', value: 22.1, timestamp: '07 Sep · 06:00', auditor: 'Alicia Ramírez', status: 'Conforme', observation: 'Dentro de rango matutino' },
      { id: 'h-2', value: 25.8, timestamp: '07 Sep · 08:00', auditor: 'Alicia Ramírez', status: 'Fuera de rango', observation: 'Aire acondicionado en ciclo de mantenimiento. Notificado a mantenimiento.' },
    ],
  },
  {
    id: 'CTL-02',
    name: 'Humedad relativa en almacén sensible',
    location: 'Almacén de Materia Prima Sensible',
    frequency: 'Cada 4 h (Demo configurable)',
    parameter: 'Humedad relativa',
    unit: '%RH',
    minVal: 40.0,
    maxVal: 60.0,
    targetVal: 50.0,
    lastValue: 48.5,
    lastCapturedAt: '07 Sep · 07:30',
    nextDueAt: '11:30',
    auditor: 'Jorge Márquez',
    instrument: 'Termohigrómetro Digital QA-HG-004',
    instrumentCalibrationDue: '18 Nov 2026',
    status: 'Al corriente',
    history: [
      { id: 'h-3', value: 49.0, timestamp: '07 Sep · 03:30', auditor: 'Jorge Márquez', status: 'Conforme' },
      { id: 'h-4', value: 48.5, timestamp: '07 Sep · 07:30', auditor: 'Jorge Márquez', status: 'Conforme' },
    ],
  },
  {
    id: 'CTL-03',
    name: 'Viscosidad de Tinta UV en Prensa Mark Andy',
    location: 'Piso Flexo · Mark Andy Scout 10”',
    frequency: 'Al inicio de tiro y cambio de lote',
    parameter: 'Viscosidad copa Zahn #2',
    unit: 'seg',
    minVal: 18.0,
    maxVal: 24.0,
    targetVal: 21.0,
    lastValue: 20.5,
    lastCapturedAt: '07 Sep · 09:15',
    nextDueAt: '13:15',
    auditor: 'Alicia Ramírez',
    instrument: 'Copa Zahn #2 QA-ZN-002',
    instrumentCalibrationDue: '12 Ene 2027',
    status: 'Al corriente',
    history: [
      { id: 'h-5', value: 20.5, timestamp: '07 Sep · 09:15', auditor: 'Alicia Ramírez', status: 'Conforme', observation: 'Lote L-606 negro UV verificado' },
    ],
  },
  {
    id: 'CTL-04',
    name: 'Verificación visual y adherencia de remanente con adhesivo',
    location: 'Mesa de Validación MP',
    frequency: 'Por evento de reutilización',
    parameter: 'Adhesión y limpieza',
    unit: 'Tack (Visual/Cinta)',
    minVal: 95.0,
    maxVal: 100.0,
    targetVal: 100.0,
    lastValue: 98.0,
    lastCapturedAt: '07 Sep · 08:45',
    nextDueAt: 'Al reutilizar remanente',
    auditor: 'Alicia Ramírez',
    instrument: 'Cinta de Anclaje ASTM D3359',
    instrumentCalibrationDue: 'Vigente',
    status: 'Al corriente',
    history: [
      { id: 'h-6', value: 98.0, timestamp: '07 Sep · 08:45', auditor: 'Alicia Ramírez', status: 'Conforme', observation: 'Remanente BOB-REM-042 apto para tiro inicial' },
    ],
  },
  {
    id: 'CTL-05',
    name: 'Conductividad y pH de solución de mojado Offset',
    location: 'Prensa Heidelberg Speedmaster XL 75',
    frequency: 'Cada turno (Demo configurable)',
    parameter: 'pH de solución',
    unit: 'pH',
    minVal: 4.8,
    maxVal: 5.5,
    targetVal: 5.2,
    lastValue: 5.1,
    lastCapturedAt: '07 Sep · 07:00',
    nextDueAt: '15:00',
    auditor: 'Jorge Márquez',
    instrument: 'Potenciómetro Digital QA-PH-001',
    instrumentCalibrationDue: '05 Oct 2026',
    status: 'Al corriente',
    history: [
      { id: 'h-7', value: 5.1, timestamp: '07 Sep · 07:00', auditor: 'Jorge Márquez', status: 'Conforme' },
    ],
  },
];

// ----------------------------------------------------
// AUDITORÍAS OPERATIVAS / WORKSPACE
// ----------------------------------------------------
export const QUALITY_AUDITS: QualityAuditItem[] = [
  {
    id: 'aud-01',
    folio: 'AUD-2026-101',
    type: 'Primera pieza',
    origin: 'OP-2026-95250',
    client: 'Panasonic Industrial',
    part: '526412 | G |',
    revision: 'Rev G',
    area: 'Flexografía',
    line: 'Mark Andy Scout 10”',
    operator: 'María Ríos',
    auditor: 'Alicia Ramírez',
    scheduledAt: '10:15',
    status: 'Pendiente',
    waitingMinutes: 18,
    operationType: 'Impresión + Troquel',
    defectCount: 0,
    notes: 'Operador preparó montaje con remanente BOB-REM-042. Esperando liberación de 1ra pieza para arrancar corrida de 25,000 etiquetas.',
  },
  {
    id: 'aud-02',
    folio: 'AUD-2026-102',
    type: 'Control > 2 horas',
    origin: 'OP-2026-95252',
    client: 'TYCO Electronics',
    part: 'IS-2420',
    revision: 'Rev I-01',
    area: 'Flexografía',
    line: 'Mark Andy 830 10”',
    operator: 'C. Medina',
    auditor: 'Alicia Ramírez',
    scheduledAt: '10:40',
    status: 'Pendiente',
    waitingMinutes: 12,
    operationType: 'Impresión + Troquel',
    defectCount: 0,
    notes: 'Corrida continua de flexo superó las 2 horas de producción continua. Regla mandatoria QA: verificación de registro, tono y desgaste de suaje.',
  },
  {
    id: 'aud-03',
    folio: 'AUD-2026-103',
    type: 'Incoming',
    origin: 'OC-2026-1402',
    client: 'Avery Dennison (Proveedor)',
    part: 'BOPP Blanco Brillante 10”',
    revision: 'Lote AD-78219',
    area: 'Almacén MP',
    line: 'Andén de Recibo',
    operator: 'Almacén MP',
    auditor: 'Alicia Ramírez',
    scheduledAt: '11:00',
    status: 'Pendiente',
    waitingMinutes: 25,
    operationType: 'Incoming',
    defectCount: 0,
    notes: 'Llegada de 12 bobinas vírgenes. Inspección de apariencia, certificado CoA y calibre antes de ingreso a inventario disponible.',
  },
  {
    id: 'aud-04',
    folio: 'AUD-2026-104',
    type: 'Validación de remanente',
    origin: 'BOB-REM-042',
    client: 'Panasonic (OP-95250)',
    part: 'BOPP Blanco 10” (850 ft)',
    revision: 'Lote RT031026',
    area: 'Flexografía',
    line: 'Mesa de Calidad',
    operator: 'María Ríos',
    auditor: 'Alicia Ramírez',
    scheduledAt: '11:45',
    status: 'Pendiente',
    waitingMinutes: 5,
    operationType: 'Remanente',
    defectCount: 0,
    notes: 'Alicia debe evaluar si los 850 ft restantes conservan adhesión y limpieza para tiro inicial sin comprometer troquel.',
  },
  {
    id: 'aud-05',
    folio: 'AUD-2026-105',
    type: 'Preimpresión',
    origin: 'HERR-PL-084',
    client: 'BLACK & DECKER',
    part: 'NA472050 (Manual 64p)',
    revision: 'Rev 08/23',
    area: 'Offset',
    line: 'CTP Agfa Avalon',
    operator: 'Preprensa RTM',
    auditor: 'Jorge Márquez',
    scheduledAt: '11:30',
    status: 'Pendiente',
    waitingMinutes: 8,
    operationType: 'Impresión',
    defectCount: 0,
    notes: 'Juego de 8 placas térmicas CTP para forma 16+8. Verificación de punto, lineatura 175 lpi y coincidencia de textos.',
  },
  {
    id: 'aud-06',
    folio: 'AUD-2026-106',
    type: 'Auditoría final',
    origin: 'OP-2026-95249',
    client: 'BLACK & DECKER',
    part: 'NA472050',
    revision: 'Rev 08/23',
    area: 'Offset',
    line: 'Mesa de Calidad Final',
    operator: 'J. Salinas',
    auditor: 'Jorge Márquez',
    scheduledAt: '09:20',
    status: 'No conforme',
    waitingMinutes: 42,
    operationType: 'Auditoría Final',
    defectCount: 145,
    mncId: 'MNC-000348',
    batches: [
      { id: 'b-1', batchNumber: 'BCH-44947', producedQty: 145, sampleSize: 3, defectsFound: 3, status: 'No conforme', packageCount: 5, unitPerPackage: 29 },
    ],
    notes: 'Texto de advertencia impreso con revisión anterior no vigente en 145 folletos. Lote bloqueado en HOLD.',
  },
  {
    id: 'aud-07',
    folio: 'AUD-2026-107',
    type: 'Auditoría final',
    origin: 'OP-2026-95256',
    client: 'Pentair',
    part: 'A163833BHA',
    revision: 'Rev I-01',
    area: 'Offset',
    line: 'Mesa Empaque Final',
    operator: 'J. Salinas',
    auditor: 'Alicia Ramírez',
    scheduledAt: '08:30',
    status: 'Liberado',
    waitingMinutes: 0,
    operationType: 'Auditoría Final',
    defectCount: 0,
    batches: [
      { id: 'b-2', batchNumber: 'BCH-44930', producedQty: 500, sampleSize: 13, defectsFound: 0, status: 'Conforme', packageCount: 20, unitPerPackage: 25 },
    ],
    labelsAvailable: true,
    notes: 'Lote 100% conforme. Etiquetas de identificación FM-QA-153 emitidas para traspaso a Almacén PT.',
  },
  {
    id: 'aud-08',
    folio: 'AUD-2026-108',
    type: 'Cambio de bobina',
    origin: 'OP-2026-95250',
    client: 'Panasonic',
    part: '526412 | G |',
    revision: 'Rev G',
    area: 'Flexografía',
    line: 'Mark Andy Scout 10”',
    operator: 'María Ríos',
    auditor: 'Alicia Ramírez',
    scheduledAt: '08:15',
    status: 'Conforme',
    waitingMinutes: 0,
    operationType: 'Impresión + Troquel',
    defectCount: 0,
    notes: 'Empalme de bobina nueva verificado sin salto de registro ni variación tonal.',
  },
];

// Reutilizamos QUALITY_RELEASES para compatibilidad pero enriquecido
export const QUALITY_RELEASES: QualityRelease[] = QUALITY_AUDITS.map((item) => ({
  id: item.id.replace('aud-', 'QA-260907-08'),
  event: item.type,
  op: item.origin,
  pedido: item.origin === 'OP-2026-95250' ? 'PED-RTM-2026-86153' : 'PED-RTM-2026-86142',
  cliente: item.client,
  part: item.part,
  revision: item.revision,
  area: item.area,
  line: item.line,
  operator: item.operator,
  shift: 'A',
  status: item.status,
  waiting: item.status === 'Conforme' || item.status === 'Liberado' ? 'Cerrado' : `${item.waitingMinutes} min`,
  auditor: item.auditor,
  lot: `PT-260907-003${item.waitingMinutes}`,
  priority: item.status === 'Pendiente' ? 'Alta' : 'Media',
  scheduledAt: item.scheduledAt,
  batches: item.batches,
  mncId: item.mncId,
}));

export const NON_CONFORMANCES: NonConformance[] = [
  {
    id: 'MNC-000348',
    op: 'OP-2026-95249',
    client: 'BLACK & DECKER',
    area: 'Offset',
    location: 'Cuarentena / Almacén No Conforme',
    defect: 'Revisión incorrecta de arte en advertencia frontal',
    quantity: 145,
    status: 'Hold',
    severity: 'Crítico',
    disposition: 'En evaluación de retrabajo vs scrap con Alicia Ramírez',
    date: '07 Sep · 09:30',
    auditor: 'Jorge Márquez',
  },
  {
    id: 'MNC-000349',
    op: 'OP-2026-95243',
    client: 'Panasonic',
    area: 'Flexografía',
    location: 'No Conforme / Flexografía',
    defect: 'Color fuera de referencia (ΔE > 3.2)',
    quantity: 62,
    status: 'Retrabajo',
    severity: 'Mayor',
    disposition: 'Reajuste de viscosidad y tiro de reemplazo',
    date: '06 Sep · 16:40',
    auditor: 'Alicia Ramírez',
  },
  {
    id: 'MNC-000350',
    op: 'OP-2026-95255',
    client: 'TYCO',
    area: 'Acabados',
    location: 'No Conforme / Acabados',
    defect: 'Troquel incompleto por rotura de filo',
    quantity: 28,
    status: 'Scrap',
    severity: 'Mayor',
    disposition: 'Scrap técnico registrado en OEE',
    date: '06 Sep · 14:10',
    auditor: 'Jorge Márquez',
  },
];

export const INCOMING_INSPECTIONS: IncomingInspection[] = [
  {
    id: 'INC-2026-042',
    poFolio: 'OC-2026-1402',
    supplier: 'Avery Dennison',
    material: 'BOPP Blanco Brillante Fasson 2.8 mil',
    supplierLot: 'AD-78219',
    rtmLot: 'MP-260907-012',
    orderedQty: '12 bobinas (36,000 ft)',
    receivedQty: '12 bobinas',
    coaAttached: true,
    appearanceConforming: true,
    specConforming: true,
    thicknessMeasured: '2.82 mil',
    status: 'Pendiente',
    date: '07 Sep · 11:00',
    auditor: 'Alicia Ramírez',
    notes: 'Bobinas en tarima plástica. Esperando inspección visual y liberación en andén.',
  },
  {
    id: 'INC-2026-041',
    poFolio: 'OC-2026-1398',
    supplier: 'Sun Chemical México',
    material: 'Tinta UV Flexo Solarflex Negro',
    supplierLot: 'SC-99124',
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
    notes: 'Certificado coincide con lote de fabricante. Liberado para cuarto de mezclas.',
  },
];

export const REMNANT_VALIDATIONS: RemnantValidation[] = [
  {
    id: 'REM-VAL-01',
    remnantCode: 'BOB-REM-042',
    substrate: 'BOPP Blanco Brillante 10”',
    remainingFt: 850,
    widthMm: 254,
    lot: 'RT031026-024',
    originOp: 'OP-2026-95240',
    visualCondition: 'Excelente',
    adhesiveTested: true,
    clientRestriction: 'Panasonic permite remanentes para tiro inicial si metraje supera 500 ft',
    dictamen: 'Pendiente',
    date: '07 Sep · 11:45',
    auditor: 'Alicia Ramírez',
    destination: 'Asignado a OP-2026-95250 (Panasonic)',
  },
  {
    id: 'REM-VAL-02',
    remnantCode: 'BOB-REM-019',
    substrate: 'Papel Semigloss 7”',
    remainingFt: 320,
    widthMm: 178,
    lot: 'SG-260814',
    originOp: 'OP-2026-95210',
    visualCondition: 'Dañado / Con polvo',
    adhesiveTested: false,
    clientRestriction: 'Excede 90 días en anaquel sin bolsa protectora',
    dictamen: 'No apto / Scrap',
    date: '05 Sep · 12:00',
    auditor: 'Jorge Márquez',
    destination: 'Baja a scrap por contaminación de orilla',
  },
];

export const PREPRESS_CHECKS = [
  'Variables de medición dentro de tolerancia',
  'Paginado correcto y secuencia correlativa',
  'Consecutivo e idiomas correctos',
  'Impresión legible y completa',
  'Diseño coincide con herramienta y plano',
  'Texto coincide con herramienta',
  'Colores conformes a la OP y muestra máster',
  'Revisión correcta de arte aprobada por cliente',
  'Negativo 100% negro cuando aplique',
  'Pantallas adecuadas para placa térmica CTP',
];
