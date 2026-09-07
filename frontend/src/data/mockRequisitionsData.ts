import { MOCK_MASTER_ARTICLES, MasterArticle } from './mockArticlesData';

export type RequisitionStatus =
  | 'Borrador'
  | 'Pendiente de autorización'
  | 'Autorizada'
  | 'Lista para compra'
  | 'Requiere corrección'
  | 'Rechazada'
  | 'Cancelada'
  | 'Convertida en compra';

export type RequisitionPriority = 'Normal' | 'Alta' | 'Urgente';

export type ProductReviewStatus = 'PENDING' | 'LINKED' | 'PREPARED_AS_NEW';

export interface UnregisteredProductDetails {
  description: string;
  suggestedBrand?: string;
  sizeOrPresentation?: string;
  specifications?: string;
  isInternalConsumable?: boolean;
}

export interface RequisitionItem {
  id: string;
  sku: string;
  name: string;
  brand: string;
  size?: string;
  category?: string;
  quantity: number;
  unit: string;
  comments?: string;
  origin?: 'stock mínimo' | 'pedido cliente' | 'OP/planeación' | 'reposición manual';
  missingQuantity?: number;
  availableQuantity?: number;
  
  // Flag for unregistered product / pending review
  isUnregisteredProduct?: boolean;
  unregisteredDetails?: UnregisteredProductDetails;
  reviewStatus?: ProductReviewStatus;
  linkedArticleSku?: string;
  
  // Assisted capture metrics
  currentStock: number;
  availableStock: number;
  inTransitStock: number;
  monthlyConsumption: number;
  coverageMonths: number;

  // Partial purchase coverage tracking
  orderedInPurchaseOrder?: boolean;
  purchaseOrderFolio?: string;
}

export interface RequisitionTimelineEntry {
  id: string;
  occurredAt: string;
  actor: string;
  role: string;
  action: string;
  comment?: string;
  type: 'created' | 'submitted' | 'authorized' | 'correction_requested' | 'rejected' | 'product_reviewed' | 'cancelled' | 'purchased';
}

export interface Requisition {
  id: string;
  folio: string;
  createdAt: string;
  requester: string;
  targetWarehouseId: string;
  targetWarehouseName: string;
  requiredDate: string;
  priority: RequisitionPriority;
  suggestedSupplier?: string;
  notes?: string;
  items: RequisitionItem[];
  status: RequisitionStatus;
  
  hasPendingProductReview?: boolean;
  generatedPurchaseOrderFolio?: string;
  correctionReason?: string;
  rejectionReason?: string;
  authorizationInfo?: {
    authorizedBy: string;
    authorizedAt: string;
    notes?: string;
  };
  timeline: RequisitionTimelineEntry[];
  purchaseOrderCoverage?: {
    totalItems: number;
    coveredItems: number;
    purchaseOrderFolios: string[];
  };
}

export type ReorderSuggestionStatus =
  | 'Crítico'
  | 'Urgente'
  | 'Reorden normal'
  | 'Normal'
  | 'Sobreinventario'
  | 'Reorden urgente'
  | 'Cobertura insuficiente'
  | 'Próximo a mínimo';

export interface ReorderSuggestion {
  id: string;
  sku: string;
  productName: string;
  brand: string;
  size: string;
  category: string;
  targetWarehouseId: string;
  targetWarehouseName: string;
  availableStock: number;
  committedStock: number;
  inTransitStock: number;
  monthlyConsumption: number;
  coverageMonths: number;
  minStock: number;
  suggestedQuantity: number;
  suggestedSupplier: string;
  supplierLeadDays: number;
  status: ReorderSuggestionStatus;
  reason: string;
}

export interface DestinationWarehouseOption {
  id: string;
  name: string;
  type: 'CEDIS' | 'Sucursal';
}

export const DESTINATION_WAREHOUSES: DestinationWarehouseOption[] = [
  { id: 'wh-alm-rtm', name: 'Almacén Principal RTM', type: 'CEDIS' },
  { id: 'wh-alm-virtual', name: 'Almacén Virtual / Control', type: 'CEDIS' },
];

export const SUPPLIERS_LIST = [
  'Sun Chemical México S.A. de C.V.',
  'Bio-Pappel S.A.B. de C.V.',
  'Copamex Industrias S.A. de C.V.',
  'Avery Dennison México S. de R.L. de C.V.',
  'WestRock Empaques México S.A. de C.V.',
  'Siegwerk México S.A. de C.V.',
  'Smurfit Kappa México S.A. de C.V.',
];

export function getAssistedCaptureMetrics(sku: string, warehouseId: string): {
  currentStock: number;
  availableStock: number;
  inTransitStock: number;
  monthlyConsumption: number;
  coverageMonths: number;
} {
  return {
    currentStock: 5,
    availableStock: 3,
    inTransitStock: 2,
    monthlyConsumption: 10,
    coverageMonths: 0.3,
  };
}

const demoItem = (id: string, sku: string, name: string, brand: string, quantity: number, unit: string, category: string, origin: RequisitionItem['origin'], availableStock: number, monthlyConsumption: number): RequisitionItem => ({ id, sku, name, brand, quantity, unit, category, origin, availableQuantity: availableStock, missingQuantity: Math.max(0, quantity - availableStock), currentStock: availableStock, availableStock, inTransitStock: Math.max(0, Math.ceil(quantity / 2)), monthlyConsumption, coverageMonths: Number((availableStock / monthlyConsumption).toFixed(1)) });

const ADDITIONAL_RTM_REQUISITIONS: Requisition[] = [
 { id:'req-027',folio:'REQ-2026-027',createdAt:'02 Sep 2026',requester:'María Ríos (Flexografía)',targetWarehouseId:'wh-alm-rtm',targetWarehouseName:'Almacén Principal RTM',requiredDate:'08 Sep 2026',priority:'Urgente',suggestedSupplier:'Siegwerk México S.A. de C.V.',status:'Pendiente de autorización',notes:'Tinta para OP-2026-95250 Panasonic; primera pieza pendiente de liberación QA.',items:[demoItem('ri-027-01','TIN-BLK-FLX','Tinta flexográfica negra alta resistencia','Siegwerk',6,'kg','Tintas Flexo','OP/planeación',1,18),demoItem('ri-027-02','ADH-UV-804','Barniz UV 804-AX','Sun Chemical',4,'cubeta','Barnices','OP/planeación',0,10)],timeline:[{id:'tl-027-01',occurredAt:'02 Sep 08:35',actor:'María Ríos',role:'Operadora Flexo',action:'Requisición creada por OP crítica',comment:'Vinculada a pedido Panasonic 86,153.',type:'created'}] },
 { id:'req-028',folio:'REQ-2026-028',createdAt:'02 Sep 2026',requester:'Jorge Márquez (Calidad)',targetWarehouseId:'wh-alm-virtual',targetWarehouseName:'Almacén Virtual / Control',requiredDate:'09 Sep 2026',priority:'Alta',suggestedSupplier:'Avery Dennison México S. de R.L. de C.V.',status:'Autorizada',notes:'Etiquetas de identificación de lote, batch y primera pieza para producto liberado.',items:[demoItem('ri-028-01','ETQ-QA-153','Etiqueta identificación FM-QA-153','Avery Dennison',10,'rollo','Calidad / Etiquetas','reposición manual',3,12),demoItem('ri-028-02','ETQ-QA-155','Etiqueta batch FM-QA-155','Avery Dennison',8,'rollo','Calidad / Etiquetas','reposición manual',2,9)],timeline:[{id:'tl-028-01',occurredAt:'02 Sep 09:10',actor:'Jorge Márquez',role:'Calidad',action:'Autorizada',comment:'Cobertura para liberaciones de lote.',type:'authorized'}] },
 { id:'req-029',folio:'REQ-2026-029',createdAt:'03 Sep 2026',requester:'Luis González (Mantenimiento)',targetWarehouseId:'wh-alm-rtm',targetWarehouseName:'Almacén Principal RTM',requiredDate:'15 Sep 2026',priority:'Alta',suggestedSupplier:'Smurfit Kappa México S.A. de C.V.',status:'Lista para compra',notes:'Refacción preventiva para rodillos de Guillotina 2; evita paro de acabados.',items:[demoItem('ri-029-01','REF-GUI-002','Kit de rodillos Guillotina 2','Polar',1,'kit','Refacciones','reposición manual',0,2),demoItem('ri-029-02','LUB-IND-32','Lubricante industrial ISO 32','Mobil',12,'litro','Mantenimiento','stock mínimo',4,16)],timeline:[] },
 { id:'req-030',folio:'REQ-2026-030',createdAt:'03 Sep 2026',requester:'Andrea Peña (Planeación)',targetWarehouseId:'wh-alm-rtm',targetWarehouseName:'Almacén Principal RTM',requiredDate:'11 Sep 2026',priority:'Normal',suggestedSupplier:'Copamex Industrias S.A. de C.V.',status:'Requiere corrección',notes:'Cartulina SBS para empaque plegadizo de cuenta industrial.',correctionReason:'Confirmar gramaje final contra revisión de arte.',items:[demoItem('ri-030-01','MP-SBS-240','Cartulina sulfatada SBS 240 g','Copamex',6,'tarima','Papel Offset','pedido cliente',2,9)],timeline:[{id:'tl-030-01',occurredAt:'03 Sep 12:20',actor:'Dirección de Operaciones',role:'Autorizador',action:'Solicitó corrección',comment:'Revisión de arte pendiente.',type:'correction_requested'}] },
 { id:'req-031',folio:'REQ-2026-031',createdAt:'04 Sep 2026',requester:'Carlos Medina (Acabados)',targetWarehouseId:'wh-alm-rtm',targetWarehouseName:'Almacén Principal RTM',requiredDate:'06 Sep 2026',priority:'Urgente',suggestedSupplier:'Sun Chemical México S.A. de C.V.',status:'Pendiente de autorización',notes:'Adhesivo hot melt para intercalado y grapado de OP de Black & Decker.',items:[demoItem('ri-031-01','ADH-HOT-MLT','Adhesivo hot melt gráfico','Henkel',10,'saco','Acabados','OP/planeación',1,20)],timeline:[] },
 { id:'req-032',folio:'REQ-2026-032',createdAt:'04 Sep 2026',requester:'Alicia Ramírez (Preimpresión)',targetWarehouseId:'wh-alm-virtual',targetWarehouseName:'Almacén Virtual / Control',requiredDate:'14 Sep 2026',priority:'Normal',suggestedSupplier:'Avery Dennison México S. de R.L. de C.V.',status:'Convertida en compra',generatedPurchaseOrderFolio:'OC-RTM-2026-0096',notes:'Material de verificación dimensional y evidencia de herramentales.',items:[demoItem('ri-032-01','CAL-PAT-001','Patrón de color y densidad','X-Rite',2,'set','Calidad / Metrología','reposición manual',0,3)],timeline:[{id:'tl-032-01',occurredAt:'04 Sep 14:45',actor:'Compras RTM',role:'Comprador',action:'Convertida en compra',comment:'OC-RTM-2026-0096 emitida.',type:'purchased'}] },
];

export const INITIAL_MOCK_REQUISITIONS: Requisition[] = [
  // 1. REQ-2026-018: Insumo Crítico Couché 90g para PED-RTM-2026-0142
  {
    id: 'req-018',
    folio: 'REQ-2026-018',
    createdAt: '28 Ago 2026',
    requester: 'Ing. Fernando Soto (Planeación de Producción)',
    targetWarehouseId: 'wh-alm-rtm',
    targetWarehouseName: 'Almacén Principal RTM',
    requiredDate: '10 Sep 2026',
    priority: 'Urgente',
    suggestedSupplier: 'Bio-Pappel S.A.B. de C.V.',
    status: 'Lista para compra',
    notes: 'Requerimiento estimado para demo: 4 tarimas de Couché 90 g para completar el tiraje de 25,000 manuales faltantes del Pedido PED-RTM-2026-0142 (Stanley Black & Decker).',
    generatedPurchaseOrderFolio: 'OC-RTM-2026-0089',
    purchaseOrderCoverage: {
      totalItems: 1,
      coveredItems: 1,
      purchaseOrderFolios: ['OC-RTM-2026-0089'],
    },
    items: [
      {
        id: 'ri-018-01',
        sku: 'MP-COU-090',
        name: 'Papel Couché 90 g (Pliegos 70x100 cm)',
        brand: 'Bio-Pappel',
        size: 'Tarima 18,000 pliegos',
        category: 'Papel Offset',
        quantity: 4,
        unit: 'tarima',
        origin: 'pedido cliente',
        availableQuantity: 1,
        missingQuantity: 3,
        comments: 'Tiraje urgente de 25,000 pzas manuales Stanley Black & Decker.',
        currentStock: 1,
        availableStock: 1,
        inTransitStock: 4,
        monthlyConsumption: 12,
        coverageMonths: 0.1,
        orderedInPurchaseOrder: true,
        purchaseOrderFolio: 'OC-RTM-2026-0089',
      },
    ],
    timeline: [
      {
        id: 'tl-req-018-01',
        occurredAt: '28 Ago 11:30',
        actor: 'Ing. Fernando Soto',
        role: 'Planeación de Producción',
        action: 'Requisición Creada',
        comment: 'Generada por balance de Pedido PED-RTM-2026-0142.',
        type: 'created',
      },
      {
        id: 'tl-req-018-02',
        occurredAt: '28 Ago 13:00',
        actor: 'Dirección de Operaciones',
        role: 'Autorizador',
        action: 'Autorización Inmediata',
        comment: 'Aprobada por prioridad de cuenta clave Stanley Black & Decker.',
        type: 'authorized',
      },
    ],
  },

  // 2. REQ-2026-019: Bobinas BOPP para Flexo Farmacéutico
  {
    id: 'req-019',
    folio: 'REQ-2026-019',
    createdAt: '30 Ago 2026',
    requester: 'Téc. Juan Carlos Treviño (Prensa Flexo)',
    targetWarehouseId: 'wh-alm-rtm',
    targetWarehouseName: 'Almacén Principal RTM',
    requiredDate: '12 Sep 2026',
    priority: 'Alta',
    suggestedSupplier: 'Avery Dennison México S. de R.L. de C.V.',
    status: 'Lista para compra',
    notes: '8 bobinas de BOPP blanco brillante 60 mic para tirajes continuos de etiquetas autoadheribles.',
    items: [
      {
        id: 'ri-019-01',
        sku: 'MP-BOP-WHT',
        name: 'Sustrato BOPP Blanco Brillante 60 mic',
        brand: 'Fasson Avery',
        size: 'Bobina 2,500 m',
        category: 'Sustratos Flexo',
        quantity: 8,
        unit: 'bobina',
        origin: 'stock mínimo',
        availableQuantity: 2,
        missingQuantity: 6,
        comments: 'Consumo elevado en línea Mark Andy flexo.',
        currentStock: 2,
        availableStock: 2,
        inTransitStock: 10,
        monthlyConsumption: 16,
        coverageMonths: 0.2,
      },
    ],
    timeline: [],
  },

  // 3. REQ-2026-020: Barniz UV Ultra Brillo
  {
    id: 'req-020',
    folio: 'REQ-2026-020',
    createdAt: '31 Ago 2026',
    requester: 'Ing. Mario Lozano (Supervisión Acabados)',
    targetWarehouseId: 'wh-alm-rtm',
    targetWarehouseName: 'Almacén Principal RTM',
    requiredDate: '18 Sep 2026',
    priority: 'Normal',
    suggestedSupplier: 'Sun Chemical México S.A. de C.V.',
    status: 'Lista para compra',
    notes: 'Reposición de 10 cubetas de barniz UV para sección de acabados y barnizadora en línea.',
    items: [
      {
        id: 'ri-020-01',
        sku: 'MP-VAR-UV',
        name: 'Barniz UV Ultra Brillo Curado Rápido',
        brand: 'Sun Chemical',
        size: 'Cubeta 20 kg',
        category: 'Tintas & Consumibles',
        quantity: 10,
        unit: 'cubeta',
        origin: 'reposición manual',
        availableQuantity: 3,
        missingQuantity: 7,
        comments: 'Para tirajes de tags y blister cards.',
        currentStock: 3,
        availableStock: 3,
        inTransitStock: 4,
        monthlyConsumption: 14,
        coverageMonths: 0.3,
      },
    ],
    timeline: [],
  },

  // 4. REQ-2026-017: Cartulina SBS 240g
  {
    id: 'req-017',
    folio: 'REQ-2026-017',
    createdAt: '25 Ago 2026',
    requester: 'Ing. Fernando Soto (Planeación de Producción)',
    targetWarehouseId: 'wh-alm-rtm',
    targetWarehouseName: 'Almacén Principal RTM',
    requiredDate: '06 Sep 2026',
    priority: 'Normal',
    suggestedSupplier: 'WestRock Empaques México S.A. de C.V.',
    status: 'Convertida en compra',
    generatedPurchaseOrderFolio: 'OC-RTM-2026-0086',
    purchaseOrderCoverage: {
      totalItems: 1,
      coveredItems: 1,
      purchaseOrderFolios: ['OC-RTM-2026-0086'],
    },
    items: [
      {
        id: 'ri-017-01',
        sku: 'MP-SBS-240',
        name: 'Cartulina Sulfatada SBS 240 g / 14 pts',
        brand: 'WestRock',
        size: 'Tarima 8,000 pliegos',
        category: 'Papel Offset',
        quantity: 3,
        unit: 'tarima',
        origin: 'OP/planeación',
        availableQuantity: 1,
        missingQuantity: 2,
        currentStock: 1,
        availableStock: 1,
        inTransitStock: 3,
        monthlyConsumption: 8,
        coverageMonths: 0.2,
        orderedInPurchaseOrder: true,
        purchaseOrderFolio: 'OC-RTM-2026-0086',
      },
    ],
    timeline: [],
  },
  ...ADDITIONAL_RTM_REQUISITIONS,
];

export const INITIAL_MOCK_REORDER_SUGGESTIONS: ReorderSuggestion[] = [
  {
    id: 'reord-01',
    sku: 'MP-COU-090',
    productName: 'Papel Couché 90 g (Pliegos 70x100 cm)',
    brand: 'Bio-Pappel',
    size: 'Tarima 18,000 pliegos',
    category: 'Papel Offset',
    targetWarehouseId: 'wh-alm-rtm',
    targetWarehouseName: 'Almacén Principal RTM',
    availableStock: 1,
    committedStock: 4,
    inTransitStock: 4,
    monthlyConsumption: 12,
    coverageMonths: 0.1,
    minStock: 3,
    suggestedQuantity: 4,
    suggestedSupplier: 'Bio-Pappel S.A.B. de C.V.',
    supplierLeadDays: 7,
    status: 'Crítico',
    reason: 'Compromiso firme en pedido industrial PED-RTM-2026-0142. Stock disponible bajo.',
  },
  {
    id: 'reord-02',
    sku: 'MP-BOP-WHT',
    productName: 'Sustrato BOPP Blanco Brillante 60 mic',
    brand: 'Fasson Avery',
    size: 'Bobina 2,500 m',
    category: 'Sustratos Flexo',
    targetWarehouseId: 'wh-alm-rtm',
    targetWarehouseName: 'Almacén Principal RTM',
    availableStock: 2,
    committedStock: 6,
    inTransitStock: 10,
    monthlyConsumption: 16,
    coverageMonths: 0.2,
    minStock: 5,
    suggestedQuantity: 8,
    suggestedSupplier: 'Avery Dennison México S. de R.L. de C.V.',
    supplierLeadDays: 8,
    status: 'Urgente',
    reason: 'Cobertura menor a 7 días en planta de flexografía.',
  },
  {
    id: 'reord-03',
    sku: 'MP-VAR-UV',
    productName: 'Barniz UV Ultra Brillo Curado Rápido',
    brand: 'Sun Chemical',
    size: 'Cubeta 20 kg',
    category: 'Tintas & Consumibles',
    targetWarehouseId: 'wh-alm-rtm',
    targetWarehouseName: 'Almacén Principal RTM',
    availableStock: 3,
    committedStock: 5,
    inTransitStock: 4,
    monthlyConsumption: 14,
    coverageMonths: 0.3,
    minStock: 6,
    suggestedQuantity: 10,
    suggestedSupplier: 'Sun Chemical México S.A. de C.V.',
    supplierLeadDays: 5,
    status: 'Reorden normal',
    reason: 'Punto de reorden alcanzado según histórico de consumo mensual.',
  },
];
