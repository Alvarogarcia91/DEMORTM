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
  reasonType: 'ALTA ROTACIÓN' | 'CONSOLIDACIÓN' | 'ANTIGÜEDAD / FIFO' | 'BAJA ROTACIÓN' | 'LIBERACIÓN DE ESPACIO' | 'REMANENTES';
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
  const warehouseName = 'Almacén Principal RTM';

  const defaultSuggestions: RearrangementSuggestion[] = [
    {
      id: 'sug-01',
      uid: 'TAR-RTM-260906-182',
      sku: 'MP-COU-090',
      productName: 'Papel Couché 90 g (Pliegos 70x100 cm)',
      brand: 'Bio-Pappel',
      size: 'Tarima 18,000 pliegos',
      warehouseId: 'wh-alm-rtm',
      warehouseName,
      currentLocation: 'A-C-10',
      suggestedLocation: 'A-A-03',
      rotation: 'Alta',
      pickings30d: 34,
      currentDistanceMeters: 75,
      suggestedDistanceMeters: 22,
      benefit: '-70% recorrido (-53 m/pick)',
      primaryReason: 'Alta rotación editorial y ubicación alejada de Staging Producción.',
      reasonType: 'ALTA ROTACIÓN',
      isHeatmapBased: true,
      isHotZone: true,
      isSuboptimal: true,
      analysis: {
        rotation30Days: 'Alta',
        pickingsLast30Days: 34,
        pickingsPerWeek: 8,
        currentDistanceMeters: 75,
        suggestedDistanceMeters: 22,
        distanceSavedMeters: 53,
        distanceReductionPercent: 70,
        destinationZoneActivity: 'Alta',
        currentZoneActivity: 'Baja',
        skuConcentration: 'Pasillo A (Frente)',
        explanation: 'Durante los últimos 30 días este sustrato registró 34 movimientos de surtido para prensas Heidelberg. La posición sugerida A-A-03 reduce el recorrido hacia Staging Producción de 75m a 22m (70% de ahorro en tiempo de montacargas).',
      },
    },
    {
      id: 'sug-02',
      uid: 'BOB-RTM-260906-014',
      unitsLabel: '2 bobinas del mismo lote',
      sku: 'MP-BOP-WHT',
      productName: 'Sustrato BOPP Blanco Brillante 60 mic',
      brand: 'Fasson Avery',
      size: 'Bobina 2,500 m',
      warehouseId: 'wh-alm-rtm',
      warehouseName,
      currentLocation: 'B-C-08',
      suggestedLocation: 'B-A-04',
      rotation: 'Alta',
      pickings30d: 22,
      currentDistanceMeters: 48,
      suggestedDistanceMeters: 18,
      benefit: 'Consolidación de lote RTM-MP-260902-011',
      primaryReason: 'Consolidar bobinas dispersas en el mismo pasillo para agilizar montaje en flexo.',
      reasonType: 'CONSOLIDACIÓN',
      isHeatmapBased: true,
      isHotZone: false,
      isSuboptimal: true,
      analysis: {
        rotation30Days: 'Alta',
        pickingsLast30Days: 22,
        pickingsPerWeek: 5,
        currentDistanceMeters: 48,
        suggestedDistanceMeters: 18,
        distanceSavedMeters: 30,
        distanceReductionPercent: 62,
        destinationZoneActivity: 'Media',
        currentZoneActivity: 'Baja',
        skuConcentration: 'Pasillo B (Flexo)',
        explanation: 'Existen bobinas del mismo lote en posiciones dispersas. Consolidar en B-A-04 libera una posición completa de nivel superior y previene mezclas accidentales de lotes durante el surtido.',
      },
    },
    {
      id: 'sug-03',
      uid: 'REM-RTM-260906-041',
      unitsLabel: 'Remanente 680 m',
      sku: 'MP-BOP-WHT',
      productName: 'Remanente BOPP Blanco 60 mic (680 m)',
      brand: 'Fasson Avery',
      size: 'Remanente bobina',
      warehouseId: 'wh-alm-rtm',
      warehouseName,
      currentLocation: 'B-A-01',
      suggestedLocation: 'B-C-12',
      rotation: 'Baja',
      pickings30d: 2,
      currentDistanceMeters: 15,
      suggestedDistanceMeters: 55,
      benefit: 'Libera posición dorada para bobinas enteras',
      primaryReason: 'Agrupar remanentes en zona posterior de almacenamiento controlado.',
      reasonType: 'REMANENTES',
      isHeatmapBased: true,
      isHotZone: true,
      isSuboptimal: true,
      analysis: {
        rotation30Days: 'Baja',
        pickingsLast30Days: 2,
        pickingsPerWeek: 0.5,
        currentDistanceMeters: 15,
        suggestedDistanceMeters: 55,
        distanceSavedMeters: -40,
        distanceReductionPercent: 0,
        destinationZoneActivity: 'Baja',
        currentZoneActivity: 'Alta',
        skuConcentration: 'Zona Remanentes',
        explanation: 'Un remanente de 680 m está ocupando una posición de nivel piso frente al pasillo de alta rotación. Trasladarlo a la zona de remanentes B-C-12 libera espacio de fácil acceso para tarimas y bobinas completas de alto flujo.',
      },
    },
  ];

  return {
    suggestions: defaultSuggestions,
    suggestedMovesCount: defaultSuggestions.length,
    estimatedMetersSavedPerDay: 480,
    highRotationMisplacedCount: 1,
    possibleConsolidationZonesCount: 2,
  };
}
