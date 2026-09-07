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
  folio: string; // ej. REQ-2026-0041
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
  
  // Correction / Rejection notes
  correctionReason?: string;
  rejectionReason?: string;
  
  // Flags
  hasPendingProductReview?: boolean;
  
  // Purchase Order Link
  generatedPurchaseOrderFolio?: string;
  purchaseOrderCoverage?: {
    coveredItems: number;
    totalItems: number;
  };
  
  // Timeline audit
  timeline: RequisitionTimelineEntry[];
}

export type ReorderSuggestionStatus =
  | 'Reorden urgente'
  | 'Cobertura insuficiente'
  | 'Próximo a mínimo'
  | 'Normal'
  | 'Sobreinventario';

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
  { id: 'wh-mty-norte', name: 'CEDIS Monterrey Norte', type: 'CEDIS' },
  { id: 'wh-mty-sur', name: 'CEDIS Monterrey Sur', type: 'CEDIS' },
  { id: 'wh-suc-valle-oriente', name: 'Sucursal Valle Oriente', type: 'Sucursal' },
  { id: 'wh-suc-cumbres', name: 'Sucursal Cumbres', type: 'Sucursal' },
];

export const SUPPLIERS_LIST = [
  'Nayt México S.A. de C.V.',
  'Spring Air de México S.A. de C.V.',
  'Restonic Fábricas de Colchones S.A.',
  'Colchones América S.A. de C.V.',
  'Sealy Corporation México',
  'Therapedic International México',
  'Industrias Magnus S.A. de C.V.',
  'Empaques y Polímeros Industriales del Norte',
  'Etiquetas y Suministros Gráficos Monterrey',
];

// Helper to get assisted capture metrics for an SKU and warehouse
export function getAssistedCaptureMetrics(sku: string, warehouseId: string): {
  currentStock: number;
  availableStock: number;
  inTransitStock: number;
  monthlyConsumption: number;
  coverageMonths: number;
} {
  // Deterministic mock calculations based on SKU length and warehouseId
  const hash = sku.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const isCedis = warehouseId.includes('mty');
  
  const currentStock = isCedis ? 15 + (hash % 35) : 2 + (hash % 10);
  const inTransitStock = (hash % 5) === 0 ? 4 : (hash % 3 === 0 ? 2 : 0);
  const committedStock = Math.min(currentStock, hash % 4);
  const availableStock = Math.max(0, currentStock - committedStock);
  const monthlyConsumption = isCedis ? 10 + (hash % 20) : 3 + (hash % 6);
  const coverageMonths = monthlyConsumption > 0 ? +(availableStock / monthlyConsumption).toFixed(1) : 1;

  return {
    currentStock,
    availableStock,
    inTransitStock,
    monthlyConsumption,
    coverageMonths,
  };
}

// Initial Mock Requisitions
export const INITIAL_MOCK_REQUISITIONS: Requisition[] = [
  {
    id: 'req-0041',
    folio: 'REQ-2026-0041',
    createdAt: '27 Ago 2026',
    requester: 'Admin Demo',
    targetWarehouseId: 'wh-suc-valle-oriente',
    targetWarehouseName: 'Sucursal Valle Oriente',
    requiredDate: '30 Ago 2026',
    priority: 'Alta',
    suggestedSupplier: 'Nayt México S.A. de C.V.',
    notes: 'Reabasto urgente para piso de venta fin de semana. Alta demanda proyectada de línea Flow.',
    status: 'Pendiente de autorización',
    hasPendingProductReview: false,
    items: [
      {
        id: 'item-41-1',
        sku: 'SC-NAYT-FLOW-IND',
        name: 'Nayt Colchón Flow Basic White Individual',
        brand: 'Nayt',
        size: 'Individual',
        category: 'Colchones',
        quantity: 6,
        unit: 'Colchón',
        comments: 'Para exhibición y entrega inmediata en sucursal',
        currentStock: 2,
        availableStock: 2,
        inTransitStock: 0,
        monthlyConsumption: 8,
        coverageMonths: 0.25,
      },
      {
        id: 'item-41-2',
        sku: 'SC-NAYT-FLOW-MAT',
        name: 'Nayt Colchón Flow Basic White Matrimonial',
        brand: 'Nayt',
        size: 'Matrimonial',
        category: 'Colchones',
        quantity: 4,
        unit: 'Colchón',
        comments: 'Resurtido de stock mínimo',
        currentStock: 3,
        availableStock: 2,
        inTransitStock: 0,
        monthlyConsumption: 9,
        coverageMonths: 0.3,
      },
      {
        id: 'item-41-3',
        sku: 'SC-NAYT-FLOW-QS',
        name: 'Nayt Colchón Flow Basic White Queen Size',
        brand: 'Nayt',
        size: 'Queen Size',
        category: 'Colchones',
        quantity: 2,
        unit: 'Colchón',
        comments: 'Pedido especial cliente reservado',
        currentStock: 1,
        availableStock: 1,
        inTransitStock: 0,
        monthlyConsumption: 5,
        coverageMonths: 0.2,
      },
    ],
    timeline: [
      {
        id: 't-41-1',
        occurredAt: '27 Ago 09:15',
        actor: 'Admin Demo',
        role: 'Encargado Sucursal',
        action: 'Creó y envió la requisición a autorización',
        type: 'submitted',
      },
    ],
  },
  {
    id: 'req-0043',
    folio: 'REQ-2026-0043',
    createdAt: '26 Ago 2026',
    requester: 'Carlos Medina',
    targetWarehouseId: 'wh-mty-norte',
    targetWarehouseName: 'CEDIS Monterrey Norte',
    requiredDate: '01 Sep 2026',
    priority: 'Normal',
    suggestedSupplier: 'Spring Air de México S.A. de C.V.',
    notes: 'Revisar partidas solicitadas para la campaña institucional de hoteles.',
    status: 'Requiere corrección',
    correctionReason: 'Validar cantidad solicitada del modelo Record Individual vs espacio disponible en Rack Pasillo B.',
    hasPendingProductReview: false,
    items: [
      {
        id: 'item-43-1',
        sku: 'SC-SPA-REC-IND',
        name: 'Spring Air Colchón Record Individual',
        brand: 'Spring Air',
        size: 'Individual',
        category: 'Colchones',
        quantity: 30,
        unit: 'Colchón',
        comments: 'Cantidad observada por gerencia de compras',
        currentStock: 14,
        availableStock: 10,
        inTransitStock: 4,
        monthlyConsumption: 22,
        coverageMonths: 0.6,
      },
      {
        id: 'item-43-2',
        sku: 'SC-SPA-REC-MAT',
        name: 'Spring Air Colchón Record Matrimonial',
        brand: 'Spring Air',
        size: 'Matrimonial',
        category: 'Colchones',
        quantity: 20,
        unit: 'Colchón',
        comments: 'Lote regular',
        currentStock: 18,
        availableStock: 15,
        inTransitStock: 0,
        monthlyConsumption: 25,
        coverageMonths: 0.7,
      },
    ],
    timeline: [
      {
        id: 't-43-1',
        occurredAt: '26 Ago 11:30',
        actor: 'Carlos Medina',
        role: 'Supervisor de Operaciones',
        action: 'Creó y envió la requisición a autorización',
        type: 'submitted',
      },
      {
        id: 't-43-2',
        occurredAt: '26 Ago 15:40',
        actor: 'Gerencia de Compras (Laura Gómez)',
        role: 'Compras Corporativas',
        action: 'Solicitó corrección de cantidades',
        comment: 'Validar cantidad solicitada del modelo Record Individual vs espacio disponible en Rack Pasillo B.',
        type: 'correction_requested',
      },
    ],
  },
  {
    id: 'req-0044',
    folio: 'REQ-2026-0044',
    createdAt: '27 Ago 2026',
    requester: 'Admin Demo',
    targetWarehouseId: 'wh-mty-sur',
    targetWarehouseName: 'CEDIS Monterrey Sur',
    requiredDate: '02 Sep 2026',
    priority: 'Normal',
    suggestedSupplier: 'Spring Air de México S.A. de C.V.',
    notes: 'Solicitud que contiene modelo especial solicitado para convenio corporativo.',
    status: 'Pendiente de autorización',
    hasPendingProductReview: true,
    items: [
      {
        id: 'item-44-1',
        sku: 'SC-SPA-POST-KS',
        name: 'Spring Air Colchón Posture Comfort King Size',
        brand: 'Spring Air',
        size: 'King Size',
        category: 'Colchones',
        quantity: 10,
        unit: 'Colchón',
        comments: 'Lote estándar',
        currentStock: 4,
        availableStock: 4,
        inTransitStock: 0,
        monthlyConsumption: 8,
        coverageMonths: 0.5,
      },
      {
        id: 'item-44-2',
        sku: 'PROD-NO-REG-001',
        name: 'Colchón Spring Air Especial Hotelero Queen',
        brand: 'Spring Air',
        size: 'Queen Size',
        category: 'Colchones',
        quantity: 8,
        unit: 'Colchón',
        comments: 'Modelo no dado de alta en catálogo maestro; solicitado por cliente corporativo para entrega en Monterrey Sur.',
        isUnregisteredProduct: true,
        unregisteredDetails: {
          description: 'Colchón Spring Air Especial Hotelero Queen con colchoneta doble eurotop y refuerzo perimetral ignífugo.',
          suggestedBrand: 'Spring Air',
          sizeOrPresentation: 'Queen Size',
          specifications: 'Resorte continuo offset, tela retardante de flama, 5 años garantía hotelera.',
        },
        reviewStatus: 'PENDING',
        currentStock: 0,
        availableStock: 0,
        inTransitStock: 0,
        monthlyConsumption: 0,
        coverageMonths: 0,
      },
    ],
    timeline: [
      {
        id: 't-44-1',
        occurredAt: '27 Ago 14:00',
        actor: 'Admin Demo',
        role: 'Coordinador Comercial',
        action: 'Creó requisición con producto no registrado',
        type: 'submitted',
      },
    ],
  },
  {
    id: 'req-0047',
    folio: 'REQ-2026-0047',
    createdAt: '25 Ago 2026',
    requester: 'Admin Demo',
    targetWarehouseId: 'wh-mty-norte',
    targetWarehouseName: 'CEDIS Monterrey Norte',
    requiredDate: '29 Ago 2026',
    priority: 'Urgente',
    suggestedSupplier: 'Nayt México S.A. de C.V.',
    notes: 'Reabasto general de línea Nayt para resurtir sucursales Cumbres y Valle Oriente.',
    status: 'Lista para compra',
    hasPendingProductReview: false,
    items: [
      {
        id: 'item-47-1',
        sku: 'SC-NAYT-FLOW-IND',
        name: 'Nayt Colchón Flow Basic White Individual',
        brand: 'Nayt',
        size: 'Individual',
        category: 'Colchones',
        quantity: 24,
        unit: 'Colchón',
        comments: 'Lote consolidado',
        currentStock: 8,
        availableStock: 5,
        inTransitStock: 0,
        monthlyConsumption: 30,
        coverageMonths: 0.2,
      },
      {
        id: 'item-47-2',
        sku: 'SC-NAYT-FLOW-MAT',
        name: 'Nayt Colchón Flow Basic White Matrimonial',
        brand: 'Nayt',
        size: 'Matrimonial',
        category: 'Colchones',
        quantity: 20,
        unit: 'Colchón',
        comments: 'Lote consolidado',
        currentStock: 12,
        availableStock: 9,
        inTransitStock: 0,
        monthlyConsumption: 28,
        coverageMonths: 0.3,
      },
    ],
    timeline: [
      {
        id: 't-47-1',
        occurredAt: '25 Ago 08:20',
        actor: 'Admin Demo',
        role: 'Encargado de Abastecimiento',
        action: 'Creó y envió la requisición a autorización',
        type: 'submitted',
      },
      {
        id: 't-47-2',
        occurredAt: '25 Ago 11:00',
        actor: 'Dirección Operativa',
        role: 'Dirección de Cadena de Suministro',
        action: 'Autorizó la requisición. Lista para emisión de Orden de Compra.',
        type: 'authorized',
      },
    ],
  },
  {
    id: 'req-0048',
    folio: 'REQ-2026-0048',
    createdAt: '24 Ago 2026',
    requester: 'Laura Gómez',
    targetWarehouseId: 'wh-suc-cumbres',
    targetWarehouseName: 'Sucursal Cumbres',
    requiredDate: '28 Ago 2026',
    priority: 'Normal',
    suggestedSupplier: 'Restonic Fábricas de Colchones S.A.',
    notes: 'Reposición de colchón Ortopedic para exhibición y entrega rápida.',
    status: 'Lista para compra',
    hasPendingProductReview: false,
    items: [
      {
        id: 'item-48-1',
        sku: 'SC-RES-ORT-MAT',
        name: 'Restonic Colchón Ortopedic Matrimonial',
        brand: 'Restonic',
        size: 'Matrimonial',
        category: 'Colchones',
        quantity: 5,
        unit: 'Colchón',
        comments: 'Exhibición Retail',
        currentStock: 1,
        availableStock: 1,
        inTransitStock: 0,
        monthlyConsumption: 6,
        coverageMonths: 0.15,
      },
    ],
    timeline: [
      {
        id: 't-48-1',
        occurredAt: '24 Ago 10:00',
        actor: 'Laura Gómez',
        role: 'Jefa de Sucursal',
        action: 'Creó y envió requisición',
        type: 'submitted',
      },
      {
        id: 't-48-2',
        occurredAt: '24 Ago 14:15',
        actor: 'Gerencia de Compras',
        role: 'Compras',
        action: 'Autorizó la requisición',
        type: 'authorized',
      },
    ],
  },
  {
    id: 'req-0049',
    folio: 'REQ-2026-0049',
    createdAt: '23 Ago 2026',
    requester: 'Admin Demo',
    targetWarehouseId: 'wh-mty-norte',
    targetWarehouseName: 'CEDIS Monterrey Norte',
    requiredDate: '26 Ago 2026',
    priority: 'Normal',
    suggestedSupplier: 'Colchones América S.A. de C.V.',
    notes: 'Requisición de prueba descartada por consolidación en orden semanal.',
    status: 'Rechazada',
    rejectionReason: 'Se unificaron las partidas con el pedido global de fin de mes.',
    hasPendingProductReview: false,
    items: [
      {
        id: 'item-49-1',
        sku: 'SC-AME-MON-IND',
        name: 'América Colchón Monaco Individual',
        brand: 'América',
        size: 'Individual',
        category: 'Colchones',
        quantity: 10,
        unit: 'Colchón',
        comments: 'Partida rechazada por duplicidad',
        currentStock: 8,
        availableStock: 8,
        inTransitStock: 0,
        monthlyConsumption: 12,
        coverageMonths: 0.7,
      },
    ],
    timeline: [
      {
        id: 't-49-1',
        occurredAt: '23 Ago 09:30',
        actor: 'Admin Demo',
        role: 'Operador',
        action: 'Creó requisición',
        type: 'submitted',
      },
      {
        id: 't-49-2',
        occurredAt: '23 Ago 16:00',
        actor: 'Gerencia de Compras',
        role: 'Compras',
        action: 'Rechazó requisición',
        comment: 'Se unificaron las partidas con el pedido global de fin de mes.',
        type: 'rejected',
      },
    ],
  },
  {
    id: 'req-0050',
    folio: 'REQ-2026-0050',
    createdAt: '27 Ago 2026',
    requester: 'Admin Demo',
    targetWarehouseId: 'wh-mty-norte',
    targetWarehouseName: 'CEDIS Monterrey Norte',
    requiredDate: '05 Sep 2026',
    priority: 'Normal',
    suggestedSupplier: 'Etiquetas y Suministros Gráficos Monterrey',
    notes: 'Insumos operativos de almacén: rollos de etiquetas térmicas Zebra y cinta de embalaje.',
    status: 'Borrador',
    hasPendingProductReview: false,
    items: [
      {
        id: 'item-50-1',
        sku: 'INS-ETIQ-ZEBRA-100X75',
        name: 'Rollo de Etiquetas Térmicas Zebra 100mm x 75mm (1000 stickers)',
        brand: 'Zebra Supplies',
        category: 'Insumo Interno',
        quantity: 20,
        unit: 'Rollo',
        comments: 'Para etiquetado de recepción física y Mesa de Verificación',
        isUnregisteredProduct: false,
        currentStock: 5,
        availableStock: 5,
        inTransitStock: 0,
        monthlyConsumption: 12,
        coverageMonths: 0.4,
      },
      {
        id: 'item-50-2',
        sku: 'INS-CINTA-EMPAQUE-48MM',
        name: 'Cinta Canela de Empaque Industrial 48mm x 150m',
        brand: 'Janel',
        category: 'Insumo Interno',
        quantity: 50,
        unit: 'Pieza',
        comments: 'Empaque y flejado de colchones',
        isUnregisteredProduct: false,
        currentStock: 10,
        availableStock: 10,
        inTransitStock: 0,
        monthlyConsumption: 30,
        coverageMonths: 0.3,
      },
    ],
    timeline: [
      {
        id: 't-50-1',
        occurredAt: '27 Ago 16:20',
        actor: 'Admin Demo',
        role: 'Encargado de Almacén',
        action: 'Creó borrador de requisición de insumos',
        type: 'created',
      },
    ],
  },
];

// Initial Mock Reorder Suggestions (Calculated replenishment needs for CEDIS and Stores)
export const INITIAL_MOCK_REORDER_SUGGESTIONS: ReorderSuggestion[] = [
  {
    id: 'sug-reord-01',
    sku: 'SC-NAYT-FLOW-IND',
    productName: 'Nayt Colchón Flow Basic White Individual',
    brand: 'Nayt',
    size: 'Individual',
    category: 'Colchones',
    targetWarehouseId: 'wh-suc-valle-oriente',
    targetWarehouseName: 'Sucursal Valle Oriente',
    availableStock: 2,
    committedStock: 0,
    inTransitStock: 0,
    monthlyConsumption: 8,
    coverageMonths: 0.25,
    minStock: 5,
    suggestedQuantity: 6,
    suggestedSupplier: 'Nayt México S.A. de C.V.',
    supplierLeadDays: 4,
    status: 'Reorden urgente',
    reason: 'Stock disponible en sucursal (2 pzas) está muy por debajo del mínimo de seguridad (5 pzas) con cobertura menor a 8 días.',
  },
  {
    id: 'sug-reord-02',
    sku: 'SC-NAYT-FLOW-MAT',
    productName: 'Nayt Colchón Flow Basic White Matrimonial',
    brand: 'Nayt',
    size: 'Matrimonial',
    category: 'Colchones',
    targetWarehouseId: 'wh-suc-cumbres',
    targetWarehouseName: 'Sucursal Cumbres',
    availableStock: 1,
    committedStock: 1,
    inTransitStock: 0,
    monthlyConsumption: 10,
    coverageMonths: 0.1,
    minStock: 6,
    suggestedQuantity: 8,
    suggestedSupplier: 'Nayt México S.A. de C.V.',
    supplierLeadDays: 4,
    status: 'Reorden urgente',
    reason: 'Solo 1 colchón disponible con 1 comprometido en venta; cobertura crítica de 3 días de consumo.',
  },
  {
    id: 'sug-reord-03',
    sku: 'SC-SPA-REC-IND',
    productName: 'Spring Air Colchón Record Individual',
    brand: 'Spring Air',
    size: 'Individual',
    category: 'Colchones',
    targetWarehouseId: 'wh-mty-norte',
    targetWarehouseName: 'CEDIS Monterrey Norte',
    availableStock: 10,
    committedStock: 4,
    inTransitStock: 4,
    monthlyConsumption: 26,
    coverageMonths: 0.4,
    minStock: 20,
    suggestedQuantity: 24,
    suggestedSupplier: 'Spring Air de México S.A. de C.V.',
    supplierLeadDays: 6,
    status: 'Cobertura insuficiente',
    reason: 'Demanda proyectada supera el ritmo de entrega del proveedor; requiere lote de reabasto para CEDIS.',
  },
  {
    id: 'sug-reord-04',
    sku: 'SC-RES-ORT-MAT',
    productName: 'Restonic Colchón Ortopedic Matrimonial',
    brand: 'Restonic',
    size: 'Matrimonial',
    category: 'Colchones',
    targetWarehouseId: 'wh-mty-sur',
    targetWarehouseName: 'CEDIS Monterrey Sur',
    availableStock: 6,
    committedStock: 2,
    inTransitStock: 0,
    monthlyConsumption: 14,
    coverageMonths: 0.45,
    minStock: 12,
    suggestedQuantity: 12,
    suggestedSupplier: 'Restonic Fábricas de Colchones S.A.',
    supplierLeadDays: 5,
    status: 'Próximo a mínimo',
    reason: 'Inventario disponible alcanzará el umbral mínimo en menos de 10 días.',
  },
  {
    id: 'sug-reord-05',
    sku: 'SC-SEA-HYB-KS',
    productName: 'Sealy Colchón Hybrid Premier King Size',
    brand: 'Sealy',
    size: 'King Size',
    category: 'Colchones',
    targetWarehouseId: 'wh-suc-valle-oriente',
    targetWarehouseName: 'Sucursal Valle Oriente',
    availableStock: 1,
    committedStock: 0,
    inTransitStock: 0,
    monthlyConsumption: 3,
    coverageMonths: 0.33,
    minStock: 3,
    suggestedQuantity: 2,
    suggestedSupplier: 'Sealy Corporation México',
    supplierLeadDays: 7,
    status: 'Próximo a mínimo',
    reason: 'Solo 1 unidad de gama alta en exhibición/piso de venta.',
  },
  {
    id: 'sug-reord-06',
    sku: 'SC-AME-MON-MAT',
    productName: 'América Colchón Monaco Matrimonial',
    brand: 'América',
    size: 'Matrimonial',
    category: 'Colchones',
    targetWarehouseId: 'wh-mty-norte',
    targetWarehouseName: 'CEDIS Monterrey Norte',
    availableStock: 18,
    committedStock: 3,
    inTransitStock: 0,
    monthlyConsumption: 20,
    coverageMonths: 0.9,
    minStock: 15,
    suggestedQuantity: 10,
    suggestedSupplier: 'Colchones América S.A. de C.V.',
    supplierLeadDays: 5,
    status: 'Normal',
    reason: 'Niveles de inventario estables; programar pedido rutinario la próxima semana.',
  },
  {
    id: 'sug-reord-07',
    sku: 'SC-THE-COM-IND',
    productName: 'Therapedic Colchón Comfort Deluxe Individual',
    brand: 'Therapedic',
    size: 'Individual',
    category: 'Colchones',
    targetWarehouseId: 'wh-suc-cumbres',
    targetWarehouseName: 'Sucursal Cumbres',
    availableStock: 2,
    committedStock: 0,
    inTransitStock: 0,
    monthlyConsumption: 4,
    coverageMonths: 0.5,
    minStock: 4,
    suggestedQuantity: 3,
    suggestedSupplier: 'Therapedic International México',
    supplierLeadDays: 5,
    status: 'Próximo a mínimo',
    reason: 'Reposición recomendada para mantener stock de seguridad.',
  },
  {
    id: 'sug-reord-08',
    sku: 'SC-MAG-SUP-QS',
    productName: 'Magnus Colchón Supreme Plus Queen Size',
    brand: 'Magnus',
    size: 'Queen Size',
    category: 'Colchones',
    targetWarehouseId: 'wh-mty-sur',
    targetWarehouseName: 'CEDIS Monterrey Sur',
    availableStock: 5,
    committedStock: 1,
    inTransitStock: 0,
    monthlyConsumption: 9,
    coverageMonths: 0.55,
    minStock: 8,
    suggestedQuantity: 6,
    suggestedSupplier: 'Industrias Magnus S.A. de C.V.',
    supplierLeadDays: 4,
    status: 'Próximo a mínimo',
    reason: 'Inventario disponible bajo respecto a rotación habitual.',
  },
];
