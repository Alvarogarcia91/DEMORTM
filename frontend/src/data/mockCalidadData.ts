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
    | 'Cambio de turno'
    | 'Auditoría por operación'
    | 'Corte eléctrico';
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
  'Serigrafía': [
    ['Tensión de malla', '24 N/cm ± 2 N/cm verificada con tensiómetro', '23.5 N/cm Conforme'],
    ['Emulsión y definición de esténcil', '100% nítida sin poros, velo ni bordes aserrados', 'Conforme'],
    ['Presión y ángulo de rasqueta', '75° Shore A con presión uniforme de arrastre', 'Conforme'],
    ['Espesor de capa de tinta / barniz', 'Depósito uniforme sin burbujas ni marcas de malla', 'Conforme'],
    ['Curado UV serigráfico', 'Polimerización 100% verificada con prueba de frote MEK', 'Conforme'],
    ['Registro serigrafía vs impresión base', '± 0.2 mm centrado respecto a gráfico base', '0.1 mm Conforme'],
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
  {
    id: 'aud-09',
    folio: 'AUD-2026-109',
    type: 'Primera pieza',
    origin: 'OP-2026-95254',
    client: 'Schneider Electric',
    part: 'SCH-77102',
    revision: 'Rev D',
    area: 'Offset',
    line: 'Ryobi 524HX',
    operator: 'G. Morales',
    auditor: 'Alicia Ramírez',
    scheduledAt: '10:05',
    status: 'Pendiente',
    waitingMinutes: 22,
    operationType: 'Impresión',
    defectCount: 0,
    notes: 'Prensa Ryobi en espera de liberación de primera pieza para catálogo corporativo de 12 páginas. Bloquea arranque de tiro.',
  },
  {
    id: 'aud-10',
    folio: 'AUD-2026-110',
    type: 'Auditoría final',
    origin: 'OP-2026-95252',
    client: 'TYCO Electronics',
    part: 'IS-2420',
    revision: 'Rev I-01',
    area: 'Flexografía',
    line: 'Mesa de Inspección Final',
    operator: 'C. Medina',
    auditor: 'Alicia Ramírez',
    scheduledAt: '10:55',
    status: 'Pendiente',
    waitingMinutes: 14,
    operationType: 'Auditoría Final',
    defectCount: 0,
    batches: [
      { id: 'b-tyco-1', batchNumber: 'BCH-44948', producedQty: 250, sampleSize: 8, defectsFound: 0, status: 'Pendiente', packageCount: 10, unitPerPackage: 25 },
    ],
    notes: 'Muestra de bache BCH-44948 lista en mesa para auditoría final AQL 0.65 y traspaso a almacén de PT.',
  },
  {
    id: 'aud-11',
    folio: 'AUD-2026-111',
    type: 'Auditoría por operación',
    origin: 'OP-2026-95251',
    client: 'Laboratorios Alpharma',
    part: 'AL-BOX-402',
    revision: 'Rev B',
    area: 'Acabados',
    line: 'Guillotina 2',
    operator: 'E. Vargas',
    auditor: 'Alicia Ramírez',
    scheduledAt: '10:45',
    status: 'Pendiente',
    waitingMinutes: 16,
    operationType: 'Corte',
    defectCount: 0,
    notes: 'Medición dimensional pendiente en escuadra y corte de folletos con tolerancia crítica ± 0.5 mm.',
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

// ====================================================
// P1: DESVIACIONES AUTOMÁTICAS DETECTADAS EN PLANTA
// ====================================================
export interface QualityDeviation {
  id: string;
  opFolio: string;
  client: string;
  partNumber: string;
  machine: string;
  type:
    | 'Ruta fuera de secuencia'
    | 'Orden detenida excesiva'
    | 'Sin movimiento en estación'
    | 'Operación omitida'
    | 'Retraso vs tiempo estándar'
    | 'Parámetro ambiental fuera de rango';
  expected: string;
  actual: string;
  stoppedMinutes: number;
  severity: 'Crítica' | 'Alta' | 'Media';
  category4M: 'Máquina' | 'Material' | 'Mano de obra' | 'Método';
  operatorComment: string;
  suggestedResponsible: string;
  containmentAction: string;
  status: 'Activa' | 'En análisis 4M' | 'ICAR Abierto' | 'Resuelta';
  icarId?: string;
  detectedAt: string;
}

export const QUALITY_DEVIATIONS: QualityDeviation[] = [
  {
    id: 'DEV-2026-081',
    opFolio: 'OP-2026-95254',
    client: 'BLACK & DECKER',
    partNumber: 'NA472050',
    machine: 'Plegadora Stahl TH-82',
    type: 'Ruta fuera de secuencia',
    expected: 'Impresión Offset → Guillotina Corte → Plegadora Doblado',
    actual: 'Impresión Offset → Plegadora Doblado (Pliego completo sin refilar)',
    stoppedMinutes: 37,
    severity: 'Alta',
    category4M: 'Método',
    operatorComment: 'El operador de doblado recibió la tarima directamente sin ticket de paso por guillotina.',
    suggestedResponsible: 'Supervisor de Acabados / Logística Interna',
    containmentAction: 'Detener alimentación de dobladora. Retornar 4 tarimas a estación de corte para refilado de cabeza.',
    status: 'Activa',
    detectedAt: '07 Sep · 11:45',
  },
  {
    id: 'DEV-2026-082',
    opFolio: 'OP-2026-95248',
    client: 'TYCO Electronics',
    partNumber: 'IS-2420',
    machine: 'Mark Andy 830 10”',
    type: 'Orden detenida excesiva',
    expected: 'Tiraje continuo a 85 m/min con paros de ajuste < 15 min',
    actual: 'Prensa detenida por 47 min sin registro de producción',
    stoppedMinutes: 47,
    severity: 'Alta',
    category4M: 'Máquina',
    operatorComment: 'Vibración y fuga de tinta en rasqueta de estación 3. Mantenimiento convocado.',
    suggestedResponsible: 'Mantenimiento Mecánico (Carlos Ruiz)',
    containmentAction: 'Ajuste de portarrasqueta y cambio de cuchilla dosificadora. Reevaluar 1ra pieza antes de reiniciar.',
    status: 'En análisis 4M',
    icarId: 'ICAR-2026-019',
    detectedAt: '07 Sep · 09:30',
  },
  {
    id: 'DEV-2026-083',
    opFolio: 'OP-2026-95243',
    client: 'Panasonic Industrial',
    partNumber: '526412 | G |',
    machine: 'Mark Andy 2200 7”',
    type: 'Retraso vs tiempo estándar',
    expected: 'Tiempo estándar: 180 min para 25,000 etiquetas',
    actual: 'Tiempo transcurrido: 235 min (Avance 68%)',
    stoppedMinutes: 55,
    severity: 'Media',
    category4M: 'Material',
    operatorComment: 'Variación de tensión en bobina BoPP requiere reducir velocidad a 45 m/min.',
    suggestedResponsible: 'Compras / Proveedor Avery Dennison',
    containmentAction: 'Calibración de freno magnético de desbobinador y ajuste de tacómetro.',
    status: 'Resuelta',
    detectedAt: '06 Sep · 15:20',
  },
];

// ====================================================
// P1: ACCIONES CORRECTIVAS (ICAR - 4M / 5 PORQUÉS)
// ====================================================
export interface IcarAction {
  id: string;
  title: string;
  source: string;
  area: string;
  category4M: 'Máquina' | 'Material' | 'Mano de obra' | 'Método';
  responsible: string;
  rootCause: string;
  correctiveAction: string;
  openedDate: string;
  verificationDue: string;
  status: 'Abierta' | 'En contención' | 'Eficacia Verificada' | 'Cerrada';
  evidence: string;
}

export const ICAR_ACTIONS: IcarAction[] = [
  {
    id: 'ICAR-2026-018',
    title: 'Discrepancia de revisión de arte en texto de advertencia frontal',
    source: 'OP-2026-95249 / MNC-000348 (Black & Decker)',
    area: 'Offset / Preprensa',
    category4M: 'Método',
    responsible: 'Jorge Márquez / Alicia Ramírez',
    rootCause: 'El operador de CTP utilizó el archivo de preimpresión de la carpeta de trabajo anterior en lugar de jalar la versión autorizada en el ERP.',
    correctiveAction: 'Bloqueo digital en el RIP Agfa Avalon para impedir ripeado de placas sin folio de aprobación de arte emitido por Calidad.',
    openedDate: '07 Sep · 09:45',
    verificationDue: '21 Sep 2026',
    status: 'En contención',
    evidence: 'Procedimiento WI-PR-004 actualizado con checklist digital mandatorio.',
  },
  {
    id: 'ICAR-2026-019',
    title: 'Fuga de tinta y desajuste repetitivo de portarrasqueta en Mark Andy 830',
    source: 'DEV-2026-082 / OP-2026-95248',
    area: 'Flexografía',
    category4M: 'Máquina',
    responsible: 'Carlos Ruiz (Mantenimiento)',
    rootCause: 'Desgaste mecánico en la rosca del tornillo micrométrico de ajuste de presión.',
    correctiveAction: 'Reemplazo de barra de sujeción y tornillos micrométricos en estación 3. Inclusión en preventivo quincenal.',
    openedDate: '07 Sep · 10:15',
    verificationDue: '18 Sep 2026',
    status: 'Abierta',
    evidence: 'Orden de Mantenimiento OT-MNT-2026-442 generada y refacción solicitada a almacén.',
  },
  {
    id: 'ICAR-2026-016',
    title: 'Pérdida de temperatura en cuarto de adhesivos por falla de termostato',
    source: 'CTL-01 (Control Periódico Ambiental)',
    area: 'Almacén MP Climatizado',
    category4M: 'Máquina',
    responsible: 'Mantenimiento General / Alicia Ramírez',
    rootCause: 'Falla del sensor electrónico de la unidad evaporadora mini-split #2.',
    correctiveAction: 'Sustitución de termostato digital e instalación de sistema de alarma sonora por desviación > 24.5 °C.',
    openedDate: '05 Sep · 14:00',
    verificationDue: '15 Sep 2026',
    status: 'Eficacia Verificada',
    evidence: 'Bitácora de lecturas térmicas continuas por 48 horas en rango 21.5–22.8 °C.',
  },
  {
    id: 'ICAR-2026-014',
    title: 'Contaminación de polvo en orillas de remanente de bobina sin fleje',
    source: 'REM-VAL-02 (Bobina rechazada BOB-REM-019)',
    area: 'Almacén MP',
    category4M: 'Mano de obra',
    responsible: 'Supervisor de Almacén MP',
    rootCause: 'Operador no colocó la bolsa de polietileno ni el fleje de retorno tras desmontar sobrante en piso.',
    correctiveAction: 'Capacitación al 100% de operadores en estándar de reempaque de bobinas y auditoría semanal de anaquel de remanentes.',
    openedDate: '28 Ago · 11:30',
    verificationDue: '10 Sep 2026',
    status: 'Cerrada',
    evidence: 'Lista de asistencia y evaluación de operadores con calificación 100%.',
  },
];

// ====================================================
// P1: PLAN DE CONTROL POR ARTÍCULO / REVISIÓN
// ====================================================
export interface ControlPlanItem {
  id: string;
  partNumber: string;
  revision: string;
  client: string;
  process: string;
  characteristic: string;
  specTolerance: string;
  inspectionMethod: string;
  frequency: string;
  instrument: string;
  reactionPlan: string;
  customerReqCode: string;
}

export const CONTROL_PLANS: ControlPlanItem[] = [
  {
    id: 'CP-526412-01',
    partNumber: '526412 | G |',
    revision: 'Rev G',
    client: 'Panasonic Industrial',
    process: 'Impresión Flexográfica',
    characteristic: 'Densidad y Registro de Color (CMYK)',
    specTolerance: 'ΔE < 2.0 vs Pantone aprobado por cliente',
    inspectionMethod: 'Espectrofotometría X-Rite e500',
    frequency: '1ra pieza + Cada cambio de bobina + Cada 2 horas',
    instrument: 'Espectrofotómetro QA-SP-002',
    reactionPlan: 'HOLD inmediato, reajuste de tintero, nueva aprobación de 1ra pieza.',
    customerReqCode: 'CSR-PAN-01',
  },
  {
    id: 'CP-526412-02',
    partNumber: '526412 | G |',
    revision: 'Rev G',
    client: 'Panasonic Industrial',
    process: 'Troquelado Rotativo',
    characteristic: 'Profundidad de corte (Kiss-cut)',
    specTolerance: 'Frontal cortado 100%, liner sin marcas > 5% penetración',
    inspectionMethod: 'Microscopio de inspección óptica 40X',
    frequency: '1ra pieza + Cada turno + Fin de lote',
    instrument: 'Microscopio Digital QA-MIC-001',
    reactionPlan: 'Ajuste de cilindro de contra o cambio de fleje flexible magnético.',
    customerReqCode: 'CSR-PAN-04',
  },
  {
    id: 'CP-NA472050-01',
    partNumber: 'NA472050',
    revision: 'Rev 08/23',
    client: 'BLACK & DECKER',
    process: 'Impresión Offset',
    characteristic: 'Revisión y Consecutivo de Textos Legales',
    specTolerance: 'Texto idéntico al PDF máster firmado Rev 08/23',
    inspectionMethod: 'Cotejo con plantilla de acetato y lectura de código',
    frequency: '1ra pieza pliego + Cada cambio de plancha',
    instrument: 'Lector 2D y Mesa de Luz D65',
    reactionPlan: 'Detención de máquina, cuarentena de pliegos impresos, revisión con Calidad.',
    customerReqCode: 'CSR-BD-02',
  },
  {
    id: 'CP-NA472050-02',
    partNumber: 'NA472050',
    revision: 'Rev 08/23',
    client: 'BLACK & DECKER',
    process: 'Doblado y Grapado',
    characteristic: 'Secuencia de Paginado y Firmeza de Grapa',
    specTolerance: '64 páginas en orden 1..64, 2 grapas cerradas a 50 mm',
    inspectionMethod: 'Deshoje y verificación física por muestreo AQL 0.65',
    frequency: '1 bache por cada 500 ejemplares producidos',
    instrument: 'Calibrador vernier digital QA-VR-005',
    reactionPlan: 'Bloqueo del bache en HOLD, reinspección al 100% de la tarima.',
    customerReqCode: 'CSR-BD-03',
  },
  {
    id: 'CP-A163833-01',
    partNumber: 'A163833BHA',
    revision: 'Rev I-01',
    client: 'Pentair',
    process: 'Corte y Refilado',
    characteristic: 'Escuadra y Dimensiones de Pliego',
    specTolerance: '570 x 870 mm ± 0.5 mm, escuadra 90° ± 0.1°',
    inspectionMethod: 'Medición con flexómetro de precisión y escuadra de precisión',
    frequency: 'Inicio de tiro + Cada cambio de cuchilla',
    instrument: 'Escuadra de verificación QA-ESC-001',
    reactionPlan: 'Ajuste de topes de guillotina Polar y refilado correctivo.',
    customerReqCode: 'CSR-PEN-01',
  },
];

// ====================================================
// P1: REQUISITOS ESPECÍFICOS DEL CLIENTE (CSR)
// ====================================================
export interface CustomerQualityRequirement {
  id: string;
  client: string;
  code: string;
  requirement: string;
  standard: string;
  owner: string;
  status: 'Cumple' | 'En revisión' | 'Pendiente';
  applicableOps: string[];
  auditEvidence: string;
}

export const CUSTOMER_REQUIREMENTS: CustomerQualityRequirement[] = [
  {
    id: 'CSR-01',
    client: 'Panasonic Industrial',
    code: 'CSR-PAN-01',
    requirement: 'Trazabilidad estricta de lote de materia prima y certificado CoA por cada lote de bopp',
    standard: 'IATF 16949 §8.5.2',
    owner: 'Calidad & Almacén MP',
    status: 'Cumple',
    applicableOps: ['OP-2026-95250', 'OP-2026-95243'],
    auditEvidence: 'Certificado CoA Avery AD-78219 verificado y digitalizado en Incoming.',
  },
  {
    id: 'CSR-02',
    client: 'Panasonic Industrial',
    code: 'CSR-PAN-02',
    requirement: 'Liberación de Primera Pieza obligatoria antes de arrancar corrida continua',
    standard: 'QMS Panasonic Manual Rev 4',
    owner: 'Calidad (Alicia Ramírez)',
    status: 'Cumple',
    applicableOps: ['OP-2026-95250'],
    auditEvidence: 'FM-QA-172 firmado digitalmente por inspector de Calidad.',
  },
  {
    id: 'CSR-03',
    client: 'Panasonic Industrial',
    code: 'CSR-PAN-03',
    requirement: 'Retención de muestra testigo por 24 meses en archivo controlado',
    standard: 'VDA 6.3 / Panasonic SQA',
    owner: 'Calidad',
    status: 'Cumple',
    applicableOps: ['OP-2026-95250'],
    auditEvidence: 'Sobres de retención en gaveta QA-RET-2026 con sello de custodia.',
  },
  {
    id: 'CSR-04',
    client: 'BLACK & DECKER',
    code: 'CSR-BD-01',
    requirement: 'Inspección de revisión de arte y advertencias de seguridad al 100% en CTP y 1ra pieza',
    standard: 'B&D Corporate Safety Standard',
    owner: 'Preprensa & Calidad',
    status: 'En revisión',
    applicableOps: ['OP-2026-95249', 'OP-2026-95254'],
    auditEvidence: 'Cotejo digital con PDF aprobado y registro en hoja de viajero.',
  },
  {
    id: 'CSR-05',
    client: 'Pentair',
    code: 'CSR-PEN-01',
    requirement: 'Embalaje con bolsa sellada y etiqueta con código QR grado A de legibilidad',
    standard: 'ISO 15415 / Pentair Spec 2025',
    owner: 'Acabados & Calidad',
    status: 'Cumple',
    applicableOps: ['OP-2026-95256'],
    auditEvidence: 'Verificación con lector Honeywell con reporte de reflectancia.',
  },
  {
    id: 'CSR-06',
    client: 'TYCO Electronics',
    code: 'CSR-TYC-01',
    requirement: 'Control de proceso cada 2 horas con registro de viscosidad y registro de suaje',
    standard: 'TE Connectivity Quality Spec',
    owner: 'Calidad (Alicia Ramírez)',
    status: 'Cumple',
    applicableOps: ['OP-2026-95252', 'OP-2026-95248'],
    auditEvidence: 'Auditoría periódica AUD-2026-102 registrada en ERP.',
  },
];

// ====================================================
// P2: AUDIT TRAIL MAESTRO / CONTROL DE CAMBIOS
// ====================================================
export interface MasterAuditTrailEntry {
  id: string;
  module: string;
  record: string;
  field: string;
  previousValue: string;
  newValue: string;
  user: string;
  role: 'Operador' | 'Planeador' | 'Supervisor' | 'Calidad' | 'Administrador';
  timestamp: string;
  motive: string;
  approver: string;
  version: string;
}

export const MASTER_AUDIT_TRAIL: MasterAuditTrailEntry[] = [
  {
    id: 'AT-001',
    module: 'Calidad',
    record: 'Plan de Control PN-526412 Rev G',
    field: 'Frecuencia de inspección de color',
    previousValue: 'Cada turno',
    newValue: '1ra pieza + Cada cambio de bobina + Cada 2 horas',
    user: 'Alicia Ramírez',
    role: 'Calidad',
    timestamp: '07 Sep 2026 · 11:20',
    motive: 'Actualización por requerimiento específico CSR-PAN-01 de Panasonic',
    approver: 'Jorge Márquez (Gerente SGC)',
    version: 'Rev G.2',
  },
  {
    id: 'AT-002',
    module: 'Producción',
    record: 'OP-2026-95250 (Panasonic)',
    field: 'Estatus de Primera Pieza',
    previousValue: 'Pendiente de Calidad',
    newValue: 'Liberada por Calidad',
    user: 'Alicia Ramírez',
    role: 'Calidad',
    timestamp: '07 Sep 2026 · 10:35',
    motive: 'Aprobación de primera pieza con remanente BOB-REM-042',
    approver: 'Alicia Ramírez (Jefa QA)',
    version: 'v1.0',
  },
  {
    id: 'AT-003',
    module: 'Calidad / No Conformes',
    record: 'OP-2026-95249 (Black & Decker)',
    field: 'Disposición de material',
    previousValue: 'En revisión de piso',
    newValue: 'Bloqueado en HOLD (MNC-000348)',
    user: 'Jorge Márquez',
    role: 'Calidad',
    timestamp: '07 Sep 2026 · 09:30',
    motive: 'Texto de advertencia con versión de arte no autorizada',
    approver: 'Alicia Ramírez',
    version: 'v1.1',
  },
  {
    id: 'AT-004',
    module: 'Configuración / Recetas',
    record: 'Receta Maestra Flexo R-FLX-01',
    field: 'Lineatura Anilox estación blanco opaco',
    previousValue: '360 lpi / 4.2 BCM',
    newValue: '400 lpi / 3.8 BCM',
    user: 'Admin Nexora',
    role: 'Administrador',
    timestamp: '06 Sep 2026 · 17:00',
    motive: 'Optimización de consumo de tinta UV y uniformidad de fondo',
    approver: 'Dirección Técnica RTM',
    version: 'Rev 2.4',
  },
  {
    id: 'AT-005',
    module: 'Almacén MP',
    record: 'Remanente BOB-REM-042',
    field: 'Dictamen de Calidad',
    previousValue: 'En cuarentena',
    newValue: 'Apto para reutilizar',
    user: 'Alicia Ramírez',
    role: 'Calidad',
    timestamp: '07 Sep 2026 · 08:50',
    motive: 'Prueba de adherencia ASTM D3359 conforme en 850 ft restantes',
    approver: 'Alicia Ramírez',
    version: 'v1.0',
  },
];

// ====================================================
// P2: INTEGRIDAD, RESPALDOS & CONTROL DOCUMENTAL
// ====================================================
export interface BackupLogEntry {
  id: string;
  timestamp: string;
  type: 'Respaldo automático' | 'Verificación de integridad' | 'Simulación de recuperación';
  scope: string;
  size: string;
  result: 'Correcto' | 'Advertencia' | 'Fallo';
  hash: string;
  auditor: string;
}

export const BACKUP_LOGS: BackupLogEntry[] = [
  {
    id: 'BKP-2026-0907',
    timestamp: 'Hoy · 02:00',
    type: 'Respaldo automático',
    scope: 'Base de datos ERP + Trazabilidad SGC + Registros QA',
    size: '1.42 GB',
    result: 'Correcto',
    hash: 'SHA256: 9e8a71b...4c2d',
    auditor: 'Admin Nexora (Automático)',
  },
  {
    id: 'VRF-2026-0907',
    timestamp: 'Hoy · 06:00',
    type: 'Verificación de integridad',
    scope: 'Integridad referencial OP ↔ Trazabilidad ↔ Dictámenes QA',
    size: '0 errores encontrados',
    result: 'Correcto',
    hash: 'Check: 100% íntegro',
    auditor: 'Servicio de Integridad RTM',
  },
  {
    id: 'SIM-2026-0901',
    timestamp: '01 Sep · 23:00',
    type: 'Simulación de recuperación',
    scope: 'Restauración en ambiente sandbox de auditoría externa',
    size: '1.39 GB restaurados en 4.2 min',
    result: 'Correcto',
    hash: 'RPO: 0 min · RTO: 4.2 min',
    auditor: 'Auditor Externo ISO 9001',
  },
];

export interface ControlledDocument {
  code: string;
  title: string;
  type: 'WI' | 'Formato' | 'Plano' | 'Plan de Control' | 'PFMEA' | 'Certificado';
  revision: string;
  effectiveDate: string;
  owner: string;
  applicableArea: string;
  status: 'Vigente' | 'En revisión';
}

export const CONTROLLED_DOCUMENTS: ControlledDocument[] = [
  { code: 'FM-PR-024', title: 'Hoja de Viajero y Control de OP', type: 'Formato', revision: 'Rev 5', effectiveDate: '01 Ago 2026', owner: 'Producción / Planeación', applicableArea: 'Toda la planta', status: 'Vigente' },
  { code: 'FM-QA-153', title: 'Etiqueta Térmica de Identificación de Caja PT', type: 'Formato', revision: 'Rev 4', effectiveDate: '15 Jul 2026', owner: 'Calidad', applicableArea: 'Acabados / PT', status: 'Vigente' },
  { code: 'FM-QA-172', title: 'Registro y Liberación de Primera Pieza', type: 'Formato', revision: 'Rev 3', effectiveDate: '10 Jun 2026', owner: 'Calidad', applicableArea: 'Piso de Prensa', status: 'Vigente' },
  { code: 'FM-QA-180', title: 'Boleta de Identificación de Material en HOLD / Cuarentena', type: 'Formato', revision: 'Rev 2', effectiveDate: '20 May 2026', owner: 'Calidad', applicableArea: 'Cuarentena', status: 'Vigente' },
  { code: 'WI-PR-012', title: 'Instructivo de Trabajo: Montaje y Ajuste de Tintas Flexo', type: 'WI', revision: 'Rev 6', effectiveDate: '01 Jun 2026', owner: 'Producción Flexo', applicableArea: 'Prensa Mark Andy', status: 'Vigente' },
  { code: 'WI-QA-004', title: 'Instructivo: Medición de Temperatura y Humedad en Almacén', type: 'WI', revision: 'Rev 2', effectiveDate: '12 Ene 2026', owner: 'Calidad', applicableArea: 'Almacén MP', status: 'Vigente' },
  { code: 'PCP-526412', title: 'Plan de Control: Etiqueta Panasonic 526412', type: 'Plan de Control', revision: 'Rev G', effectiveDate: '05 Sep 2026', owner: 'Calidad (Alicia Ramírez)', applicableArea: 'Flexografía', status: 'Vigente' },
  { code: 'PFMEA-FLX-01', title: 'Análisis de Modo y Efecto de Falla: Flexografía UV', type: 'PFMEA', revision: 'Rev 3', effectiveDate: '15 Mar 2026', owner: 'Ingeniería & Calidad', applicableArea: 'Flexografía', status: 'Vigente' },
];

// ====================================================
// P2: CONSULTAS TRANSVERSALES (RH, PROVEEDORES, MANTENIMIENTO)
// ====================================================
export const CROSS_CONSULTATIONS = {
  rh: [
    { employee: 'María Ríos', role: 'Operador Prensa Flexo', certifiedIn: ['Montaje Flexo 10”', 'Muestreo AQL', 'Control de Tintas UV'], certificationDue: '15 Dic 2026', status: 'Vigente' },
    { employee: 'J. Salinas', role: 'Operador Prensa Offset', certifiedIn: ['Heidelberg XL 106', 'Densitometría ISO 12647', 'Corte Polar'], certificationDue: '20 Nov 2026', status: 'Vigente' },
    { employee: 'C. Medina', role: 'Operador Flexo Junior', certifiedIn: ['Mark Andy 830', 'Seguridad en Prensa'], certificationDue: '05 Oct 2026', status: 'Próxima recertificación' },
  ],
  suppliers: [
    { supplier: 'Avery Dennison', category: 'Sustratos BoPP / Papel', qualityScore: 98.4, onTimeDelivery: 96.8, openComplaints: 0, status: 'Aprobado Grado A' },
    { supplier: 'Sun Chemical México', category: 'Tintas UV y Offset', qualityScore: 99.1, onTimeDelivery: 98.5, openComplaints: 0, status: 'Aprobado Grado A' },
    { supplier: 'Flint Group', category: 'Placas térmicas CTP', qualityScore: 94.2, onTimeDelivery: 91.0, openComplaints: 1, status: 'Bajo monitoreo' },
  ],
  maintenance: [
    { machine: 'Mark Andy Scout 10”', type: 'Flexografía', lastPreventive: '01 Sep 2026', nextDue: '15 Sep 2026', oee: '87.2%', status: 'Operando Conforme' },
    { machine: 'Mark Andy 830 10”', type: 'Flexografía', lastPreventive: '25 Ago 2026', nextDue: '08 Sep 2026', oee: '71.5%', status: 'Atención requerida (Rasqueta)' },
    { machine: 'Heidelberg Speedmaster XL 106', type: 'Offset', lastPreventive: '28 Ago 2026', nextDue: '18 Sep 2026', oee: '89.4%', status: 'Operando Conforme' },
  ],
};

