export interface RearrangementSuggestion {
  id: string;
  uid: string;
  unitsLabel?: string;
  sku: string;
  productName: string;
  brand: string;
  size: string;
  warehouseId: string;
  warehouseName: string;
  currentLocation: string;
  suggestedLocation: string;
  rotation: 'Alta' | 'Media' | 'Baja';
  pickings30d: number;
  currentDistanceMeters: number;
  suggestedDistanceMeters: number;
  benefit: string;
  primaryReason: string;
  reasonType: 'ALTA ROTACIÓN' | 'CONSOLIDACIÓN' | 'ANTIGÜEDAD / FIFO' | 'BAJA ROTACIÓN' | 'LIBERACIÓN DE ESPACIO';
  isHeatmapBased: boolean;
  isHotZone: boolean;
  isSuboptimal: boolean;
  analysis: {
    rotation30Days: 'Alta' | 'Media' | 'Baja';
    pickingsLast30Days: number;
    pickingsPerWeek: number;
    currentDistanceMeters: number;
    suggestedDistanceMeters: number;
    distanceSavedMeters: number;
    distanceReductionPercent: number;
    destinationZoneActivity: 'Alta' | 'Media' | 'Baja';
    currentZoneActivity: 'Baja' | 'Media' | 'Alta';
    skuConcentration: string;
    explanation: string;
  };
}

export function getRearrangementSuggestions(warehouseId: string): {
  suggestions: RearrangementSuggestion[];
  suggestedMovesCount: number;
  estimatedMetersSavedPerDay: number;
  highRotationMisplacedCount: number;
  possibleConsolidationZonesCount: number;
} {
  const isSur = warehouseId === 'wh-mty-sur';
  const isVO = warehouseId === 'suc-valle-oriente';
  const isCUM = warehouseId === 'suc-cumbres';

  const warehouseName = isSur 
    ? 'CEDIS Monterrey Sur' 
    : isVO 
    ? 'Sucursal Valle Oriente' 
    : isCUM 
    ? 'Sucursal Cumbres' 
    : 'CEDIS Monterrey Norte';

  const defaultSuggestions: RearrangementSuggestion[] = [
    {
      id: 'sug-01',
      uid: 'SC-UID-2026-000184',
      sku: 'SC-NAYT-FLOW-IND',
      productName: 'Nayt Colchón Flow Basic White Individual',
      brand: 'Nayt',
      size: 'Individual',
      warehouseId,
      warehouseName,
      currentLocation: 'E-C-10',
      suggestedLocation: 'A-B-03',
      rotation: 'Alta',
      pickings30d: 21,
      currentDistanceMeters: 84,
      suggestedDistanceMeters: 33,
      benefit: '-61% recorrido (-51 m/pick)',
      primaryReason: 'Alta rotación y ubicación actual alejada de embarques.',
      reasonType: 'ALTA ROTACIÓN',
      isHeatmapBased: true,
      isHotZone: true,
      isSuboptimal: true,
      analysis: {
        rotation30Days: 'Alta',
        pickingsLast30Days: 21,
        pickingsPerWeek: 7,
        currentDistanceMeters: 84,
        suggestedDistanceMeters: 33,
        distanceSavedMeters: 51,
        distanceReductionPercent: 61,
        destinationZoneActivity: 'Alta',
        currentZoneActivity: 'Baja',
        skuConcentration: 'Pasillo A (Frente)',
        explanation: 'Durante los últimos 30 días este SKU registró 21 movimientos de picking. La posición sugerida A-B-03 reduce el recorrido hacia los carriles de embarque de 84m a 33m (61% de ahorro), agilizando el surtido en horas pico.',
      },
    },
    {
      id: 'sug-02',
      uid: 'SC-UID-2026-000122',
      unitsLabel: '3 unidades dispersas',
      sku: 'SC-RES-ORT-MAT',
      productName: 'Restonic Colchón Ortopedic Matrimonial',
      brand: 'Restonic',
      size: 'Matrimonial',
      warehouseId,
      warehouseName,
      currentLocation: 'B-A-04 / D-C-08 / E-A-02',
      suggestedLocation: 'B-A-04 / B-B-04',
      rotation: 'Alta',
      pickings30d: 18,
      currentDistanceMeters: 76,
      suggestedDistanceMeters: 42,
      benefit: 'Consolidación de 3 a 2 ubicaciones (-45% recorrido)',
      primaryReason: 'Unidades del mismo SKU dispersas en tres zonas. Se recomienda consolidar para reducir recorridos y facilitar conteo.',
      reasonType: 'CONSOLIDACIÓN',
      isHeatmapBased: true,
      isHotZone: true,
      isSuboptimal: true,
      analysis: {
        rotation30Days: 'Alta',
        pickingsLast30Days: 18,
        pickingsPerWeek: 5,
        currentDistanceMeters: 76,
        suggestedDistanceMeters: 42,
        distanceSavedMeters: 34,
        distanceReductionPercent: 45,
        destinationZoneActivity: 'Alta',
        currentZoneActivity: 'Media',
        skuConcentration: 'Concentración total en Pasillo B',
        explanation: 'El SKU presenta 3 unidades fragmentadas entre los Pasillos B, D y E. Consolidar el stock en las bahías B-A-04 y B-B-04 elimina desplazamientos dobles del montacargas y agiliza las auditorías cíclicas.',
      },
    },
    {
      id: 'sug-03',
      uid: 'SC-UID-2026-000149',
      sku: 'SC-SPA-REC-IND',
      productName: 'Spring Air Colchón Record Individual',
      brand: 'Spring Air',
      size: 'Individual',
      warehouseId,
      warehouseName,
      currentLocation: 'D-C-07',
      suggestedLocation: 'A-A-06',
      rotation: 'Media',
      pickings30d: 14,
      currentDistanceMeters: 68,
      suggestedDistanceMeters: 29,
      benefit: '-57% recorrido & Salida FIFO rápida',
      primaryReason: 'Unidad con mayor antigüedad del SKU (19 días). Se recomienda acercarla a zona de picking para favorecer salida FIFO.',
      reasonType: 'ANTIGÜEDAD / FIFO',
      isHeatmapBased: true,
      isHotZone: true,
      isSuboptimal: true,
      analysis: {
        rotation30Days: 'Media',
        pickingsLast30Days: 14,
        pickingsPerWeek: 4,
        currentDistanceMeters: 68,
        suggestedDistanceMeters: 29,
        distanceSavedMeters: 39,
        distanceReductionPercent: 57,
        destinationZoneActivity: 'Alta',
        currentZoneActivity: 'Baja',
        skuConcentration: 'Cabecera Pasillo A',
        explanation: 'Esta unidad serializada cuenta con 19 días en almacén en nivel superior C. Reubicarla al nivel A de piso en Pasillo A garantiza su salida inmediata en el próximo despacho, cumpliendo con la política FIFO.',
      },
    },
    {
      id: 'sug-04',
      uid: 'SC-UID-2026-000075',
      sku: 'SC-AME-HAL-QS',
      productName: 'América Colchón Halston Queen Size',
      brand: 'América',
      size: 'Queen Size',
      warehouseId,
      warehouseName,
      currentLocation: 'A-A-02',
      suggestedLocation: 'E-C-09',
      rotation: 'Baja',
      pickings30d: 3,
      currentDistanceMeters: 24,
      suggestedDistanceMeters: 88,
      benefit: 'Liberar posición premium para SKU Top',
      primaryReason: 'Ubicación premium ocupada por artículo de baja rotación. Se sugiere reubicar al fondo para liberar frente a artículos de alta demanda.',
      reasonType: 'BAJA ROTACIÓN',
      isHeatmapBased: false,
      isHotZone: false,
      isSuboptimal: true,
      analysis: {
        rotation30Days: 'Baja',
        pickingsLast30Days: 3,
        pickingsPerWeek: 1,
        currentDistanceMeters: 24,
        suggestedDistanceMeters: 88,
        distanceSavedMeters: -64,
        distanceReductionPercent: -266,
        destinationZoneActivity: 'Baja',
        currentZoneActivity: 'Alta',
        skuConcentration: 'Pasillo E Perimetral',
        explanation: 'La bahía frontal A-A-02 es un espacio premium junto a embarques. Actualmente está bloqueada por un modelo de baja salida mensual (3 pickings). Trasladarlo a E-C-09 libera la posición para líneas de alta velocidad.',
      },
    },
    {
      id: 'sug-05',
      uid: 'SC-UID-2026-000178',
      sku: 'SC-NAYT-FLOW-MAT',
      productName: 'Nayt Colchón Flow Basic White Matrimonial',
      brand: 'Nayt',
      size: 'Matrimonial',
      warehouseId,
      warehouseName,
      currentLocation: 'D-A-08',
      suggestedLocation: 'A-A-02',
      rotation: 'Alta',
      pickings30d: 16,
      currentDistanceMeters: 72,
      suggestedDistanceMeters: 28,
      benefit: '-61% recorrido & Consolidación en Pasillo A',
      primaryReason: 'Agrupación con 5 unidades del mismo SKU en Pasillo A para surtido continuo y rápido despacho.',
      reasonType: 'CONSOLIDACIÓN',
      isHeatmapBased: true,
      isHotZone: true,
      isSuboptimal: true,
      analysis: {
        rotation30Days: 'Alta',
        pickingsLast30Days: 16,
        pickingsPerWeek: 5,
        currentDistanceMeters: 72,
        suggestedDistanceMeters: 28,
        distanceSavedMeters: 44,
        distanceReductionPercent: 61,
        destinationZoneActivity: 'Alta',
        currentZoneActivity: 'Media',
        skuConcentration: '85% del SKU en Pasillo A',
        explanation: 'Mover esta unidad de Pasillo D a la bahía A-A-02 permite concentrar todo el lote de Nayt Matrimonial en un solo punto caliente, facilitando el armado de pedidos en combo.',
      },
    },
    {
      id: 'sug-06',
      uid: 'SC-UID-2026-000060',
      sku: 'SC-SEA-CLB-KS',
      productName: 'Sealy Colchón Celebration Plus King Size',
      brand: 'Sealy',
      size: 'King Size',
      warehouseId,
      warehouseName,
      currentLocation: 'C-C-05',
      suggestedLocation: 'B-A-02',
      rotation: 'Media',
      pickings30d: 11,
      currentDistanceMeters: 58,
      suggestedDistanceMeters: 36,
      benefit: '-38% recorrido & Nivel de Piso',
      primaryReason: 'Colchón King Size de alto peso en nivel C (superior). Bajar a nivel A (piso) mejora ergonomía y seguridad de maniobra.',
      reasonType: 'ALTA ROTACIÓN',
      isHeatmapBased: true,
      isHotZone: false,
      isSuboptimal: true,
      analysis: {
        rotation30Days: 'Media',
        pickingsLast30Days: 11,
        pickingsPerWeek: 3,
        currentDistanceMeters: 58,
        suggestedDistanceMeters: 36,
        distanceSavedMeters: 22,
        distanceReductionPercent: 38,
        destinationZoneActivity: 'Media',
        currentZoneActivity: 'Baja',
        skuConcentration: 'Pasillo B Central',
        explanation: 'Las unidades King Size de alto tonelaje en nivel superior C generan riesgo operativo en el descenso. Reubicar a B-A-02 en nivel de piso disminuye los tiempos de maniobra un 40% y protege la integridad del personal.',
      },
    },
    {
      id: 'sug-07',
      uid: 'SC-UID-2026-000104',
      sku: 'SC-THE-MEM-QS',
      productName: 'Therapedic Colchón Memory Dream Queen Size',
      brand: 'Therapedic',
      size: 'Queen Size',
      warehouseId,
      warehouseName,
      currentLocation: 'E-B-04',
      suggestedLocation: 'B-B-05',
      rotation: 'Media',
      pickings30d: 12,
      currentDistanceMeters: 82,
      suggestedDistanceMeters: 44,
      benefit: '-46% recorrido (-38 m/pick)',
      primaryReason: 'Trasladar de pasillo perimetral E hacia pasillo central B por incremento en demanda de fin de mes.',
      reasonType: 'ALTA ROTACIÓN',
      isHeatmapBased: true,
      isHotZone: false,
      isSuboptimal: true,
      analysis: {
        rotation30Days: 'Media',
        pickingsLast30Days: 12,
        pickingsPerWeek: 3,
        currentDistanceMeters: 82,
        suggestedDistanceMeters: 44,
        distanceSavedMeters: 38,
        distanceReductionPercent: 46,
        destinationZoneActivity: 'Media',
        currentZoneActivity: 'Baja',
        skuConcentration: 'Pasillo B Central',
        explanation: 'Se detecta un incremento constante en pedidos de la línea Memory Dream. Acercarlo al pasillo B acorta significativamente el ciclo de preparación de ruta.',
      },
    },
    {
      id: 'sug-08',
      uid: 'SC-UID-2026-000088',
      sku: 'SC-RES-MNC-QS',
      productName: 'Restonic Colchón Moon Cool Queen Size',
      brand: 'Restonic',
      size: 'Queen Size',
      warehouseId,
      warehouseName,
      currentLocation: 'A-A-04',
      suggestedLocation: 'D-C-07',
      rotation: 'Baja',
      pickings30d: 4,
      currentDistanceMeters: 28,
      suggestedDistanceMeters: 76,
      benefit: 'Liberar bahía frontal para lote entrante Nayt',
      primaryReason: 'Reubicar producto de baja salida hacia zona perimetral D para optimizar pasillo rápido.',
      reasonType: 'LIBERACIÓN DE ESPACIO',
      isHeatmapBased: false,
      isHotZone: false,
      isSuboptimal: true,
      analysis: {
        rotation30Days: 'Baja',
        pickingsLast30Days: 4,
        pickingsPerWeek: 1,
        currentDistanceMeters: 28,
        suggestedDistanceMeters: 76,
        distanceSavedMeters: -48,
        distanceReductionPercent: -171,
        destinationZoneActivity: 'Baja',
        currentZoneActivity: 'Alta',
        skuConcentration: 'Pasillo D Perimetral',
        explanation: 'La posición A-A-04 presenta alto tránsito peatonal y de montacargas. Reubicar este modelo hacia Pasillo D descongestiona la arteria principal del almacén.',
      },
    },
  ];

  return {
    suggestions: defaultSuggestions,
    suggestedMovesCount: 8,
    estimatedMetersSavedPerDay: 312,
    highRotationMisplacedCount: 3,
    possibleConsolidationZonesCount: 4,
  };
}
