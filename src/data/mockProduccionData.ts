export type ProductionStatus =
  | 'Planeada'
  | 'Lista para producir'
  | 'En preparación'
  | 'En proceso'
  | 'Detenida'
  | 'Pendiente de calidad'
  | 'Liberada'
  | 'Terminada';

export type ProductionArea = 'Offset' | 'Flexografía' | 'Acabados';

export interface RoutingStep {
  stepNumber: number;
  process: string;
  machine: string;
  alternativeMachine?: string;
  setupMinutes: number;
  runMinutes: number;
  status: 'Pendiente' | 'En preparación' | 'En proceso' | 'Completada' | 'Detenida';
  requiresFirstPieceQuality: boolean;
  firstPieceApproved?: boolean;
  firstPieceApprover?: string;
  firstPieceTime?: string;
  inQuantity?: number;
  goodQuantity?: number;
  scrapQuantity?: number;
  operator?: string;
  startTime?: string;
  endTime?: string;
  notes?: string;
  subOperations?: string[]; // for Flexo inside press: Impresión, Troquelado, Barniz, Laminado, etc.
}

export interface ProductionMaterialItem {
  id: string;
  item: string;
  type: 'Papel/Bobina' | 'Tinta' | 'Placa/Cliché' | 'Suaje' | 'Barniz' | 'Laminado' | 'Empaque';
  required: string;
  reserved: string;
  delivered: string;
  available: string;
  lot?: string;
  status: 'Disponible' | 'Parcial' | 'Insuficiente';
  substituteAuthorized?: string;
}

export interface ToolingRequirement {
  id: string;
  name: string;
  type: 'Placas Offset' | 'Grabado/Cliché' | 'Suaje Rotativo' | 'Suaje Plano' | 'Doblador' | 'Grapador';
  status: 'Disponible' | 'Liberado' | 'Pendiente' | 'En mantenimiento';
  details: string;
  teethOrRepeat?: string;
}

export interface OffsetSpecs {
  productFamily: string;
  finalWidthMm: number;
  finalHeightMm: number;
  pages: number;
  paperWeightGsm: number;
  paperType: string;
  inksFront: number;
  inksBack: number;
  folded: boolean;
  stapled: boolean;
  stapleType: 'Sin grapa' | 'Grapado al lomo / tipo libro' | 'Grapado en esquina' | 'Grapado frontal';
  packQuantity: number;
  customerDrawingRef?: string;
  // Master Pagination
  formCount?: number;
  formsDetail?: string[];
  sheetSize?: string;
  printPercent?: string;
  estimatedSheets?: number;
}

export interface FlexoSpecs {
  productFamily: string;
  widthMm: number;
  lengthMm: number;
  substrate: string;
  quantityPerRoll: number;
  inksCount: number;
  cmykOrPantone: string;
  requiresPrint: boolean;
  requiresDieCut: boolean;
  requiresVarnish: boolean;
  requiresLaminate: boolean;
  requiresCorona: boolean;
  requiresPrecut: boolean;
  requiresRewind: boolean;
  engravingRef: string;
  engravingStatus: 'Liberado' | 'Pendiente';
  dieType: 'Sólido' | 'Flexible' | 'Magnético';
  dieTeeth: number;
  dieRepeat: string;
  dieLanes: number;
  dieStatus: 'Disponible' | 'Pendiente';
  technicalNotes?: string;
}

export interface TraceabilityEvent {
  id: string;
  timestamp: string;
  user: string;
  station: string;
  event: string;
  notes?: string;
  badgeTone?: 'primary' | 'success' | 'warning' | 'danger';
}

export interface OperatorDailyReportEntry {
  id: string;
  date: string;
  shift: 'Turno A (Matutino)' | 'Turno B (Vespertino)' | 'Turno C (Nocturno)';
  operator: string;
  areaMachine: string;
  startTime: string;
  endTime: string;
  code: string; // 100, 200, 300, 400
  codeDescription: string;
  opFolio: string;
  client: string;
  partNumber: string;
  finishType: string;
  producedQuantity: number;
  comments: string;
}

export interface ProductionOrder {
  id: string;
  folio: string;
  pedido: string;
  cliente: string;
  partNumber: string;
  revision: string;
  area: ProductionArea;
  machine: string;
  due: string;
  status: ProductionStatus;
  progress: number;
  quantity: number;
  good: number;
  scrap: number;
  priority: 'Alta' | 'Media' | 'Normal';
  materialAlert?: boolean;
  toolingAlert?: boolean;
  stopMinutes?: number;
  operator: string;
  stockCommitted: number;
  setupMinutes: number;
  standardMinutes: number;
  elapsedMinutes: number;
  tooling: string;
  nextJob: string;
  // V3 enriched fields
  offsetSpecs?: OffsetSpecs;
  flexoSpecs?: FlexoSpecs;
  routing?: RoutingStep[];
  materials?: ProductionMaterialItem[];
  toolingItems?: ToolingRequirement[];
  traceability?: TraceabilityEvent[];
  internalTargetDate?: string;
  deliveryRisk?: 'Bajo' | 'Medio' | 'Alto';
  qualityGates?: {
    prepressReleased: boolean;
    firstPieceReleased: boolean;
    firstPieceApprover?: string;
    finalAuditApproved: boolean;
  };
}

export interface ProductionMachine {
  id: string;
  name: string;
  area: ProductionArea;
  load: number;
  status: 'Atención' | 'Operativa';
  next: string;
  maxColors?: number;
  supportedWidthInches?: number;
  features?: {
    dieCut: boolean;
    varnish: boolean;
    laminate: boolean;
    corona: boolean;
    precut: boolean;
    rewind: boolean;
  };
}

const machineRows: [string, ProductionArea, number, number?, number?, any?][] = [
  ['Heidelberg Speedmaster XL 75', 'Offset', 82, 6, undefined, { dieCut: false, varnish: true, laminate: false, corona: false, precut: false, rewind: false }],
  ['Conserver 1–2', 'Offset', 64, 2, undefined, { dieCut: false, varnish: false, laminate: false, corona: false, precut: false, rewind: false }],
  ['Conserver 3–4', 'Offset', 71, 4, undefined, { dieCut: false, varnish: false, laminate: false, corona: false, precut: false, rewind: false }],
  ['DiDDE 860', 'Offset', 58, 4, undefined, { dieCut: false, varnish: false, laminate: false, corona: false, precut: false, rewind: false }],
  ['Conserver 8 colores', 'Offset', 76, 8, undefined, { dieCut: false, varnish: true, laminate: false, corona: false, precut: false, rewind: false }],
  ['Ryobi 1–2', 'Offset', 61, 2, undefined, { dieCut: false, varnish: false, laminate: false, corona: false, precut: false, rewind: false }],
  ['Guillotina 2', 'Acabados', 88, 0, undefined, undefined],
  ['Stahl 2', 'Acabados', 73, 0, undefined, undefined],
  ['Muller Martini', 'Acabados', 69, 0, undefined, undefined],
  ['Mark Andy 830 7”', 'Flexografía', 67, 3, 7, { dieCut: true, varnish: false, laminate: false, corona: false, precut: false, rewind: false }],
  ['Mark Andy 830 10”', 'Flexografía', 96, 4, 10, { dieCut: true, varnish: true, laminate: false, corona: false, precut: false, rewind: false }],
  ['Mark Andy Scout 10”', 'Flexografía', 84, 6, 10, { dieCut: true, varnish: true, laminate: true, corona: true, precut: true, rewind: false }],
  ['Mark Andy 4120 17”', 'Flexografía', 62, 8, 17, { dieCut: true, varnish: true, laminate: true, corona: true, precut: true, rewind: false }],
  ['Allied Gear', 'Flexografía', 55, 4, 10, { dieCut: true, varnish: true, laminate: false, corona: false, precut: false, rewind: false }],
  ['Rotoflex I', 'Flexografía', 78, 0, 10, { dieCut: false, varnish: false, laminate: false, corona: false, precut: true, rewind: true }],
  ['BGM 2', 'Flexografía', 74, 0, 10, { dieCut: false, varnish: false, laminate: false, corona: false, precut: true, rewind: true }],
];

export const PRODUCTION_MACHINES: ProductionMachine[] = machineRows.map(([name, area, load, maxColors, supportedWidthInches, features], i) => ({
  id: `maq-${i + 1}`,
  name,
  area,
  load,
  status: load > 92 ? 'Atención' : 'Operativa',
  next: `OP-2026-${95240 + i}`,
  maxColors,
  supportedWidthInches,
  features,
}));

const customers = ['BLACK & DECKER', 'TYCO', 'PANASONIC', 'ILSCO', 'FRESENIUS', 'PENTAIR', 'ENTAIL ENGINE', 'TRW'];
const statuses: ProductionStatus[] = [
  'En proceso',
  'Detenida',
  'Pendiente de calidad',
  'Planeada',
  'Lista para producir',
  'En preparación',
  'Liberada',
  'Terminada',
  'En proceso',
  'Detenida',
  'Detenida',
  'Pendiente de calidad',
  'En proceso',
  'Lista para producir',
  'Terminada',
  'Liberada',
  'En preparación',
  'Detenida',
  'Terminada',
  'Pendiente de calidad',
];

export const PRODUCTION_ORDERS: ProductionOrder[] = Array.from({ length: 20 }, (_, i) => {
  const area: ProductionArea = i % 3 === 0 ? 'Offset' : i % 3 === 1 ? 'Flexografía' : 'Acabados';
  const status = statuses[i];
  const quantity = 12000 + i * 2250;
  const progress =
    status === 'Terminada' || status === 'Liberada'
      ? 100
      : status === 'Pendiente de calidad'
      ? 96
      : status === 'Detenida'
      ? 42 + (i % 3) * 8
      : status === 'En proceso'
      ? 35 + (i % 4) * 12
      : status === 'En preparación'
      ? 12
      : status === 'Lista para producir'
      ? 4
      : 0;

  const defaultRouting: RoutingStep[] =
    area === 'Flexografía'
      ? [
          {
            stepNumber: 1,
            process: 'Prensa Flexo',
            machine: 'Mark Andy Scout 10”',
            alternativeMachine: 'Mark Andy 4120 17”',
            setupMinutes: 35,
            runMinutes: 180,
            status: progress > 50 ? 'Completada' : progress > 0 ? 'En proceso' : 'Pendiente',
            requiresFirstPieceQuality: true,
            firstPieceApproved: progress > 20,
            firstPieceApprover: progress > 20 ? 'Alicia Ramírez (Calidad)' : undefined,
            firstPieceTime: progress > 20 ? '09:27' : undefined,
            inQuantity: quantity + 500,
            goodQuantity: Math.round(quantity * (progress / 100)),
            scrapQuantity: status === 'Detenida' ? 150 : 35,
            operator: 'M. Ríos',
            startTime: '08:30',
            subOperations: ['Impresión (4 tintas UV)', 'Barniz sobreimpresión', 'Troquelado rotativo', 'Laminado BOPP'],
          },
          {
            stepNumber: 2,
            process: 'Rebobinado e Inspección',
            machine: 'Rotoflex I',
            alternativeMachine: 'BGM 2',
            setupMinutes: 15,
            runMinutes: 60,
            status: progress >= 100 ? 'Completada' : 'Pendiente',
            requiresFirstPieceQuality: false,
            subOperations: ['Corte longitudinal', 'Conteo estroboscópico', 'Inspección de etiquetas'],
          },
          {
            stepNumber: 3,
            process: 'Calidad Final',
            machine: 'Mesa de Calidad',
            setupMinutes: 10,
            runMinutes: 20,
            status: progress === 100 ? 'Completada' : 'Pendiente',
            requiresFirstPieceQuality: true,
          },
          {
            stepNumber: 4,
            process: 'Empaque y Embalaje',
            machine: 'Estación Empaque',
            setupMinutes: 10,
            runMinutes: 30,
            status: progress === 100 ? 'Completada' : 'Pendiente',
            requiresFirstPieceQuality: false,
          },
        ]
      : [
          {
            stepNumber: 1,
            process: 'Preimpresión CTP',
            machine: 'CTP Agfa',
            setupMinutes: 20,
            runMinutes: 30,
            status: 'Completada',
            requiresFirstPieceQuality: true,
            firstPieceApproved: true,
            firstPieceApprover: 'J. Méndez (Preprensa)',
            firstPieceTime: '08:10',
          },
          {
            stepNumber: 2,
            process: 'Impresión Offset',
            machine: 'Heidelberg Speedmaster XL 75',
            alternativeMachine: 'Conserver 8 colores',
            setupMinutes: 40,
            runMinutes: 160,
            status: progress > 50 ? 'Completada' : progress > 0 ? 'En proceso' : 'Pendiente',
            requiresFirstPieceQuality: true,
            firstPieceApproved: progress > 20,
            firstPieceApprover: 'Alicia Ramírez (Calidad)',
            firstPieceTime: progress > 20 ? '09:40' : undefined,
            inQuantity: quantity + 800,
            goodQuantity: Math.round(quantity * (progress / 100)),
            scrapQuantity: status === 'Detenida' ? 220 : 60,
            operator: 'J. Salinas',
            startTime: '09:00',
          },
          {
            stepNumber: 3,
            process: 'Guillotina',
            machine: 'Guillotina 2',
            setupMinutes: 15,
            runMinutes: 45,
            status: progress > 70 ? 'Completada' : 'Pendiente',
            requiresFirstPieceQuality: false,
          },
          {
            stepNumber: 4,
            process: 'Doblado',
            machine: 'Stahl 2',
            setupMinutes: 25,
            runMinutes: 60,
            status: progress > 85 ? 'Completada' : 'Pendiente',
            requiresFirstPieceQuality: false,
          },
          {
            stepNumber: 5,
            process: 'Grapado y Alzado',
            machine: 'Muller Martini',
            setupMinutes: 30,
            runMinutes: 70,
            status: progress >= 100 ? 'Completada' : 'Pendiente',
            requiresFirstPieceQuality: true,
          },
          {
            stepNumber: 6,
            process: 'Calidad Final',
            machine: 'Mesa de Calidad',
            setupMinutes: 10,
            runMinutes: 20,
            status: progress === 100 ? 'Completada' : 'Pendiente',
            requiresFirstPieceQuality: true,
          },
          {
            stepNumber: 7,
            process: 'Empaque',
            machine: 'Mesa Empaque',
            setupMinutes: 10,
            runMinutes: 30,
            status: progress === 100 ? 'Completada' : 'Pendiente',
            requiresFirstPieceQuality: false,
          },
        ];

  const defaultMaterials: ProductionMaterialItem[] =
    area === 'Flexografía'
      ? [
          {
            id: `mat-${i}-1`,
            item: 'Bobina Bopp Blanco Brillante 7”',
            type: 'Papel/Bobina',
            required: '2,450 m',
            reserved: '2,450 m',
            delivered: '2,450 m',
            available: '18,500 m',
            lot: 'LOT-BOPP-892',
            status: 'Disponible',
          },
          {
            id: `mat-${i}-2`,
            item: 'Tinta UV Cian Flexo',
            type: 'Tinta',
            required: '4.5 kg',
            reserved: '4.5 kg',
            delivered: '4.5 kg',
            available: '42 kg',
            lot: 'LOT-INK-C-201',
            status: 'Disponible',
          },
          {
            id: `mat-${i}-3`,
            item: 'Barniz UV Sobreimpresión Brillante',
            type: 'Barniz',
            required: '3.2 kg',
            reserved: i === 1 || i === 9 || i === 17 ? '0 kg' : '3.2 kg',
            delivered: i === 1 || i === 9 || i === 17 ? '0 kg' : '3.2 kg',
            available: i === 1 || i === 9 || i === 17 ? '0.8 kg' : '15 kg',
            lot: 'LOT-BAR-UV3',
            status: i === 1 || i === 9 || i === 17 ? 'Insuficiente' : 'Disponible',
            substituteAuthorized: 'Barniz UV 804-AX (Requiere confirmar)',
          },
          {
            id: `mat-${i}-4`,
            item: 'Cliché Fotopolímero 1.14mm (4 juegos)',
            type: 'Placa/Cliché',
            required: '4 juegos',
            reserved: '4 juegos',
            delivered: '4 juegos',
            available: 'En Casetera',
            lot: 'GRA-2026-F98',
            status: 'Disponible',
          },
          {
            id: `mat-${i}-5`,
            item: 'Suaje Rotativo Flexible 84 Dientes 4 Salidas',
            type: 'Suaje',
            required: '1 cilindro',
            reserved: '1 cilindro',
            delivered: '1 cilindro',
            available: 'Rack Suajes B-3',
            lot: 'SUA-ROT-84D',
            status: 'Disponible',
          },
        ]
      : [
          {
            id: `mat-${i}-1`,
            item: 'Papel Bond 60g 57x87 cm',
            type: 'Papel/Bobina',
            required: '14,200 pliegos',
            reserved: '14,200 pliegos',
            delivered: '14,200 pliegos',
            available: '85,000 pliegos',
            lot: 'LOT-P-BOND60-44',
            status: 'Disponible',
          },
          {
            id: `mat-${i}-2`,
            item: 'Tinta Offset Negra Rápido Secado',
            type: 'Tinta',
            required: '8.5 kg',
            reserved: '8.5 kg',
            delivered: '8.5 kg',
            available: '65 kg',
            lot: 'LOT-INK-BK-110',
            status: 'Disponible',
          },
          {
            id: `mat-${i}-3`,
            item: 'Placas CTP Térmicas Agfa',
            type: 'Placa/Cliché',
            required: '8 placas',
            reserved: '8 placas',
            delivered: '8 placas',
            available: '45 placas',
            lot: 'LOT-PL-AGFA',
            status: 'Disponible',
          },
          {
            id: `mat-${i}-4`,
            item: 'Alambre para grapado 25 gauge',
            type: 'Empaque',
            required: '1 bobina',
            reserved: '1 bobina',
            delivered: '1 bobina',
            available: '8 bobinas',
            lot: 'LOT-ALAM-25',
            status: 'Disponible',
          },
        ];

  const defaultTooling: ToolingRequirement[] =
    area === 'Flexografía'
      ? [
          {
            id: 't-1',
            name: 'Grabado / Clichés Digitales Flexo',
            type: 'Grabado/Cliché',
            status: 'Liberado',
            details: '4 tintas (CMYK) · ángulo 30°/45°/75°/15° · Fotopolímero 1.14 mm',
            teethOrRepeat: 'Repeat 10.5”',
          },
          {
            id: 't-2',
            name: 'Suaje Rotativo Flexible RTM',
            type: 'Suaje Rotativo',
            status: 'Disponible',
            details: 'Corte al liner · 4 cavidades / salidas · Ancho útil 9.75”',
            teethOrRepeat: '84 dientes · 10.5” repeat',
          },
        ]
      : [
          {
            id: 't-1',
            name: 'Juego de Placas Offset CTP',
            type: 'Placas Offset',
            status: 'Liberado',
            details: 'Forma 1 y Forma 2 (Frente y Vuelta) · Calibración lineal aprobada',
          },
          {
            id: 't-2',
            name: 'Cabezal Grapador Muller Martini',
            type: 'Grapador',
            status: 'Disponible',
            details: 'Doble cabezal calibrado a lomo manual 64 páginas',
          },
        ];

  const defaultTraceability: TraceabilityEvent[] = [
    {
      id: 'tr-1',
      timestamp: '07 Sep · 07:15',
      user: 'Ventas Básico',
      station: 'Sistema Ventas',
      event: 'Pedido recibido y validado',
      notes: `Pedido PED-RTM-2026-${142 - i} generado con especificaciones técnicas`,
      badgeTone: 'primary',
    },
    {
      id: 'tr-2',
      timestamp: '07 Sep · 07:45',
      user: 'Planner Producción',
      station: 'Planeación',
      event: 'OP creada y proceso configurado',
      notes: area === 'Offset' ? 'Paginación Offset optimizada: 64 págs (32+32)' : 'Flexo: 4 tintas UV + barniz + troquel en Scout 10”',
      badgeTone: 'primary',
    },
    {
      id: 'tr-3',
      timestamp: '07 Sep · 08:00',
      user: 'Almacén MP',
      station: 'Inventario',
      event: 'Material reservado en inventario',
      notes: i === 1 || i === 9 || i === 17 ? 'Alerta: Barniz UV insuficiente; sustituto propuesto' : '100% de insumos y bobinas reservados',
      badgeTone: i === 1 || i === 9 || i === 17 ? 'warning' : 'success',
    },
    {
      id: 'tr-4',
      timestamp: '07 Sep · 08:30',
      user: 'Ingeniería Herramental',
      station: 'Taller Suajes / CTP',
      event: 'Herramental liberado',
      notes: 'Placas / grabado y suaje inspeccionados y montados',
      badgeTone: 'success',
    },
  ];

  return {
    id: `op-${i + 1}`,
    folio: `OP-2026-${95240 + i}`,
    pedido: `PED-RTM-2026-${142 - i}`,
    cliente: customers[i % customers.length],
    partNumber: ['NA472050', 'IS-2420', '02-814-556', 'A163833BHA'][i % 4],
    revision: i % 2 ? 'Rev I-01' : 'Rev 08/23',
    area,
    machine: PRODUCTION_MACHINES[(i * 3) % PRODUCTION_MACHINES.length].name,
    due: `${8 + i} Sep`,
    status,
    progress,
    quantity,
    good: Math.round((quantity * progress) / 100),
    scrap: status === 'Detenida' ? 42 : 12 + i * 3,
    priority: i % 5 === 0 ? 'Alta' : i % 3 === 0 ? 'Media' : 'Normal',
    materialAlert: i === 1 || i === 9 || i === 17,
    toolingAlert: i === 10,
    stopMinutes: status === 'Detenida' ? 47 + i * 9 : 0,
    operator: ['J. Salinas', 'M. Ríos', 'A. Torres', 'C. Medina'][i % 4],
    stockCommitted: Math.round(quantity * (i % 4 === 0 ? 0.26 : 0.12)),
    setupMinutes: 25 + (i % 4) * 10,
    standardMinutes: 90 + (i % 5) * 18,
    elapsedMinutes: 28 + (i % 5) * 14,
    tooling:
      area === 'Flexografía'
        ? 'Cliché y anilox verificados'
        : area === 'Offset'
        ? 'Placas y mantillas verificadas'
        : 'Herramental de acabado verificado',
    nextJob: `OP-2026-${95260 + ((i + 3) % 20)}`,
    // Rich V3
    offsetSpecs:
      area === 'Offset'
        ? {
            productFamily: 'Manuales e Instructivos',
            finalWidthMm: 140,
            finalHeightMm: 215,
            pages: 64,
            paperWeightGsm: 60,
            paperType: 'Bond Blanco',
            inksFront: 1,
            inksBack: 1,
            folded: true,
            stapled: true,
            stapleType: 'Grapado al lomo / tipo libro',
            packQuantity: 50,
            formCount: 2,
            formsDetail: ['Forma 1 (32 págs)', 'Forma 2 (32 págs)'],
            sheetSize: '57 x 87 cm',
            printPercent: '98%',
            estimatedSheets: Math.round(quantity / 2),
          }
        : undefined,
    flexoSpecs:
      area === 'Flexografía'
        ? {
            productFamily: 'Etiquetas Autoadheribles',
            widthMm: 101.6,
            lengthMm: 152.4,
            substrate: 'BOPP Blanco Brillante',
            quantityPerRoll: 1000,
            inksCount: 4,
            cmykOrPantone: 'CMYK UV + Barniz Gloss',
            requiresPrint: true,
            requiresDieCut: true,
            requiresVarnish: true,
            requiresLaminate: true,
            requiresCorona: true,
            requiresPrecut: true,
            requiresRewind: true,
            engravingRef: 'GRA-2026-F98',
            engravingStatus: 'Liberado',
            dieType: 'Flexible',
            dieTeeth: 84,
            dieRepeat: '10.5”',
            dieLanes: 4,
            dieStatus: 'Disponible',
            technicalNotes: 'Corte al liner, sin marcas en respaldo. Bobinado exterior.',
          }
        : undefined,
    routing: defaultRouting,
    materials: defaultMaterials,
    toolingItems: defaultTooling,
    traceability: defaultTraceability,
    internalTargetDate: `${7 + i} Sep`,
    deliveryRisk: i === 1 || i === 9 ? 'Alto' : i % 4 === 0 ? 'Medio' : 'Bajo',
    qualityGates: {
      prepressReleased: true,
      firstPieceReleased: progress > 20,
      firstPieceApprover: progress > 20 ? 'Alicia Ramírez (Calidad)' : undefined,
      finalAuditApproved: progress === 100,
    },
  };
});

export interface ProductionIncident {
  id: string;
  op: string;
  category: string;
  text: string;
  minutes: number;
}

const incidentRows: [string, string, string, string, number][] = [
  ['INC-2601', 'OP-2026-95241', 'Material', 'Barniz UV insuficiente', 47],
  ['INC-2602', 'OP-2026-95249', 'Máquina', 'Ajuste de registro Mark Andy', 32],
  ['INC-2603', 'OP-2026-95257', 'Método', 'Cambio de especificación cliente', 25],
  ['INC-2604', 'OP-2026-95244', 'Mano de obra', 'Relevo de operador', 18],
  ['INC-2605', 'OP-2026-95258', 'Material', 'Sustrato pendiente de liberar', 38],
];

export const PRODUCTION_INCIDENTS: ProductionIncident[] = incidentRows.map(([id, op, category, text, minutes]) => ({
  id,
  op,
  category,
  text,
  minutes,
}));

export const OPERATOR_DAILY_REPORTS: OperatorDailyReportEntry[] = [
  {
    id: 'REP-01',
    date: '07/09/2026',
    shift: 'Turno A (Matutino)',
    operator: 'J. Salinas',
    areaMachine: 'Heidelberg Speedmaster XL 75',
    startTime: '07:00',
    endTime: '15:00',
    code: '100',
    codeDescription: '100 Inicio de turno y preparación',
    opFolio: 'OP-2026-95240',
    client: 'BLACK & DECKER',
    partNumber: 'NA472050',
    finishType: 'Manual 64 págs',
    producedQuantity: 5200,
    comments: 'Primera pieza liberada por Alicia Ramírez a las 09:27. Corrida continua sin descalce.',
  },
  {
    id: 'REP-02',
    date: '07/09/2026',
    shift: 'Turno A (Matutino)',
    operator: 'M. Ríos',
    areaMachine: 'Mark Andy Scout 10”',
    startTime: '07:30',
    endTime: '15:30',
    code: '200',
    codeDescription: '200 Problemas mecánicos / ajuste',
    opFolio: 'OP-2026-95241',
    client: 'TYCO',
    partNumber: 'IS-2420',
    finishType: 'Etiqueta Bopp UV',
    producedQuantity: 4100,
    comments: 'Ajuste de presión en troquel rotativo y registro de tinta 3.',
  },
];
