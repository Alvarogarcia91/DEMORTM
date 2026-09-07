// =====================================================================
// Impresos RTM - Mock Data Maestro de Bitácora Global & Trazabilidad de Cambios
// =====================================================================
// Centraliza y normaliza la trazabilidad transversal de Producción, Calidad,
// Nómina, Compras, Proveedores, CRM, Finanzas y Mantenimiento con wording 100% humano.
// =====================================================================

export type AuditModuleKey =
  | 'Producción'
  | 'Calidad'
  | 'Inventario'
  | 'Compras'
  | 'Comercial'
  | 'Finanzas'
  | 'Nómina'
  | 'Mantenimiento'
  | 'Sistema';

export type AuditSeverity = 'info' | 'success' | 'warning' | 'danger';

export interface AuditChangeComparison {
  label: string;
  before: string;
  after: string;
}

export interface AuditRelatedItem {
  type: string; // 'OP', 'OC', 'Factura', 'Empleado', 'RMA', etc.
  id: string;
  label: string;
  targetModule?: string;
}

export interface GlobalAuditEvent {
  id: string;
  occurredAt: string; // Formato humano: 'Hoy · 09:36', 'Hoy · 09:18', 'Ayer · 16:40', '04 Sep 2026 · 11:20'
  timestamp: number;
  user: string;
  userRole: string;
  module: AuditModuleKey;
  action: string; // 'Liberó primera pieza', 'Reprogramó orden', 'Reabrió periodo de nómina'
  reference: string; // 'OP-2026-95250', 'SEM-2026-36', 'OC-2026-0089'
  referenceType: string; // 'Orden de Producción', 'Periodo Nómina', 'Orden de Compra', 'Expediente PPAP'
  description: string;
  reason?: string; // Motivo humano registrado
  severity: AuditSeverity;
  changes?: AuditChangeComparison[];
  related?: AuditRelatedItem[];
  originLink?: {
    module: string;
    actionLabel: string;
    query?: string;
  };
}

export interface AuditSystemSuggestion {
  id: string;
  title: string;
  badge: string;
  description: string;
  actionLabel: string;
  targetModuleFilter?: AuditModuleKey;
  searchQuery?: string;
}

// =====================================================================
// COLECCIÓN DE EVENTOS CANÓNICOS DEL AUDIT TRAIL GLOBAL
// =====================================================================
export const INITIAL_GLOBAL_AUDIT_EVENTS: GlobalAuditEvent[] = [
  // 1. Calidad - Liberación de Primera Pieza
  {
    id: 'EVT-2026-0907-01',
    occurredAt: 'Hoy · 09:36',
    timestamp: 1788773760000,
    user: 'Alicia Ramírez',
    userRole: 'Aseguramiento de Calidad',
    module: 'Calidad',
    action: 'Liberó primera pieza de impresión',
    reference: 'OP-2026-95250',
    referenceType: 'Orden de Producción',
    description: 'Aprobación del tiro inicial en prensa Mark Andy Scout para Panasonic Industrial (Etiqueta 526412 Rev G).',
    severity: 'success',
    changes: [
      { label: 'Estado de Quality Gate', before: 'Pendiente de liberación en piso', after: 'Liberada formalmente' },
      { label: 'Delta E de Tinta', before: 'En calibración (0.85)', after: 'Aprobado (< 1.00 CMC)' },
      { label: 'Autorización a Operador', before: 'En espera de visto bueno', after: 'Tiraje autorizado a velocidad nominal' },
    ],
    related: [
      { type: 'OP', id: 'OP-2026-95250', label: 'OP-2026-95250 · Panasonic Industrial' },
      { type: 'Cliente', id: 'CLI-PANASONIC', label: 'Panasonic Industrial Automotive' },
      { type: 'Auditoría', id: 'AUD-2026-089', label: 'Auditoría Primera Pieza Flexo' },
    ],
    originLink: {
      module: 'calidad',
      actionLabel: 'Ver en Trazabilidad 360°',
      query: 'OP-2026-95250',
    },
  },

  // 2. Producción - Reprogramación de OP por Nivelación
  {
    id: 'EVT-2026-0907-02',
    occurredAt: 'Hoy · 09:18',
    timestamp: 1788772680000,
    user: 'Planner RTM (Iván Ortega)',
    userRole: 'Planeación y Control de Piso',
    module: 'Producción',
    action: 'Reprogramó máquina asignada',
    reference: 'OP-2026-95252',
    referenceType: 'Orden de Producción',
    description: 'Cambio de línea productiva para balancear la carga de la planta y evitar saturación en prensa flexo 10”.',
    reason: 'Nivelación de carga en planta: Mark Andy 830 se proyectaba al 96% de capacidad esta semana.',
    severity: 'info',
    changes: [
      { label: 'Máquina Asignada', before: 'Mark Andy 830 10”', after: 'Mark Andy Scout 10”' },
      { label: 'Tiempo de Setup Estimado', before: '45 minutos', after: '35 minutos (servo-asistida)' },
      { label: 'Fecha de Entrega Prometida', before: '10 Sep 2026 18:00', after: '10 Sep 2026 14:00 (se adelanta 4h)' },
    ],
    related: [
      { type: 'OP', id: 'OP-2026-95252', label: 'OP-2026-95252 · Brady Corp' },
      { type: 'Máquina Origen', id: 'MA-830-10', label: 'Mark Andy 830 10”' },
      { type: 'Máquina Destino', id: 'MA-SCOUT-10', label: 'Mark Andy Scout 10”' },
    ],
    originLink: {
      module: 'produccion',
      actionLabel: 'Ver Orden en Producción',
      query: 'OP-2026-95252',
    },
  },

  // 3. Nómina - Reapertura de Periodo
  {
    id: 'EVT-2026-0907-03',
    occurredAt: 'Hoy · 08:54',
    timestamp: 1788771240000,
    user: 'Paola Jiménez',
    userRole: 'Recursos Humanos y Nómina',
    module: 'Nómina',
    action: 'Reabrió periodo de nómina semanal',
    reference: 'SEM-2026-36',
    referenceType: 'Periodo de Nómina',
    description: 'Apertura de ciclo para ajuste extraordinario solicitado por la supervisión de Flexografía.',
    reason: 'Corrección de 4.5 horas adicionales detectadas en checadas del Turno 2 (Carlos Mendoza y Roberto Garza).',
    severity: 'warning',
    changes: [
      { label: 'Estado del Ciclo', before: 'Cerrado / Autorizado', after: 'En Revisión (Reabierto)' },
      { label: 'Total Horas Adicionales', before: '18.5 horas', after: '23.0 horas (+4.5h)' },
      { label: 'Impacto Neto a Dispersar', before: '$198,420.00 MXN', after: '$201,150.00 MXN' },
    ],
    related: [
      { type: 'Periodo', id: 'SEM-2026-36', label: 'Semanal 31 ago – 06 sep 2026' },
      { type: 'Colaborador', id: 'RTM-001', label: 'Carlos Mendoza Ruiz' },
      { type: 'Colaborador', id: 'RTM-004', label: 'Roberto Garza Treviño' },
    ],
    originLink: {
      module: 'nomina',
      actionLabel: 'Ver Ciclos de Nómina',
    },
  },

  // 4. Calidad - Sincronización de PFMEA en PPAP
  {
    id: 'EVT-2026-0907-04',
    occurredAt: 'Hoy · 08:35',
    timestamp: 1788770100000,
    user: 'Alicia Ramírez',
    userRole: 'Aseguramiento de Calidad',
    module: 'Calidad',
    action: 'Sincronizó versión viva de PFMEA',
    reference: 'PPAP-2026-001',
    referenceType: 'Expediente PPAP',
    description: 'Actualización del elemento 6 (Análisis de Riesgos) para alinearlo al plano de ingeniería Rev H de Panasonic.',
    reason: 'El cliente liberó plano Rev H; el expediente mantenía versión Rev F con controles de rasqueta obsoletos.',
    severity: 'success',
    changes: [
      { label: 'Versión del PFMEA', before: 'Rev F (Desactualizado)', after: 'Rev H (Vigente)' },
      { label: 'Modo de Falla 03', before: 'Ajuste manual de presión', after: 'Calibración servo con registro continuo' },
      { label: 'NPR Resultante', before: '144 (Prioridad Media)', after: '72 (Prioridad Baja)' },
    ],
    related: [
      { type: 'PPAP', id: 'PPAP-2026-001', label: 'PPAP-2026-001 · Panasonic Industrial' },
      { type: 'Elemento AIAG', id: 'AIAG-06', label: 'Elemento 6: PFMEA de Proceso' },
    ],
    originLink: {
      module: 'calidad',
      actionLabel: 'Ver Expediente PPAP 360°',
      query: 'PPAP-2026-001',
    },
  },

  // 5. Compras - Generación de Requisición Precargada desde MRP
  {
    id: 'EVT-2026-0906-05',
    occurredAt: 'Ayer · 17:15',
    timestamp: 1788714900000,
    user: 'Planner RTM (Iván Ortega)',
    userRole: 'Planeación de Materiales',
    module: 'Compras',
    action: 'Generó requisición precargada desde MRP',
    reference: 'REQ-2026-018',
    referenceType: 'Requisición de Compra',
    description: 'Requisición preventiva de sustrato BOPP para cubrir orden OP-2026-95250 antes del desfase de la OC-0089.',
    reason: 'Desfase temporal detectado en MRP: OC-0089 arriba el 13 Sep pero piso requiere bobina el 11 Sep.',
    severity: 'warning',
    changes: [
      { label: 'Estado de Requisición', before: 'No existente (Alerta MRP)', after: 'Emitida / Pendiente de autorización' },
      { label: 'Material Requerido', before: 'Faltante neto: 1,200 m²', after: 'Requisición: 1,500 m² (Bobina estándar)' },
      { label: 'Proveedor Sugerido', before: 'Sin asignar', after: 'Avery Dennison Materials de México' },
    ],
    related: [
      { type: 'Requisición', id: 'REQ-2026-018', label: 'REQ-2026-018 · Sustrato BOPP 50 micras' },
      { type: 'OP Afectada', id: 'OP-2026-95250', label: 'OP-2026-95250 · Panasonic' },
      { type: 'Proveedor', id: 'PROV-AVERY', label: 'Avery Dennison' },
    ],
    originLink: {
      module: 'requisiciones',
      actionLabel: 'Ver Requisición en Compras',
    },
  },

  // 6. Calidad - Retención en HOLD de Barniz UV
  {
    id: 'EVT-2026-0906-06',
    occurredAt: 'Ayer · 15:40',
    timestamp: 1788709200000,
    user: 'Alicia Ramírez',
    userRole: 'Aseguramiento de Calidad',
    module: 'Calidad',
    action: 'Retuvo lote de insumo en HOLD / Cuarentena',
    reference: 'HOLD-2026-042',
    referenceType: 'Control de Material en HOLD',
    description: 'Bloqueo preventivo de 220 L de Barniz UV de Sobreimpresión por viscosidad fuera de especificación.',
    reason: 'Viscosidad medida en Copa Zahn #2 de 18s (nominal 24–28s). Riesgo de goteo en prensa flexo.',
    severity: 'danger',
    changes: [
      { label: 'Estatus del Lote LOT-2026-0891', before: 'Recibido en almacén', after: 'En Cuarentena / HOLD (Excluido de MRP)' },
      { label: 'Inventario Útil de Barniz', before: '450 Litros', after: '230 Litros disponibles' },
      { label: 'Etiqueta de Bloqueo', before: 'Sin etiqueta', after: 'Etiqueta Zebra Roja impresa y colocada' },
    ],
    related: [
      { type: 'Lote MP', id: 'LOT-2026-0891', label: 'Lote LOT-2026-0891 · Barniz UV' },
      { type: 'Insumo', id: 'MP-BARN-UV01', label: 'Barniz UV Flexo Alto Brillo' },
      { type: 'Proveedor', id: 'PROV-SIEGWERK', label: 'Siegwerk México' },
    ],
    originLink: {
      module: 'calidad',
      actionLabel: 'Ver Material en HOLD',
    },
  },

  // 7. Mantenimiento - Conclusión de Mantenimiento Preventivo
  {
    id: 'EVT-2026-0906-07',
    occurredAt: 'Ayer · 13:20',
    timestamp: 1788700800000,
    user: 'Tomás Castillo Peña',
    userRole: 'Técnico Mecánico de Planta',
    module: 'Mantenimiento',
    action: 'Completó orden de mantenimiento preventivo',
    reference: 'OT-2026-088',
    referenceType: 'Orden de Trabajo',
    description: 'Servicio quincenal de lubricación, cambio de rasquetas y calibración de rodillos tensores.',
    severity: 'success',
    changes: [
      { label: 'Estatus de Máquina Mark Andy Scout', before: 'En mantenimiento programado', after: 'Operativa al 100%' },
      { label: 'Refacciones Consumidas', before: 'Sin consumo', after: '2 juegos de rasquetas de acero suizo' },
      { label: 'Vibración de Rodillo', before: '1.4 mm/s (advertencia)', after: '0.4 mm/s (óptimo)' },
    ],
    related: [
      { type: 'OT', id: 'OT-2026-088', label: 'OT-2026-088 · Prensa Mark Andy Scout' },
      { type: 'Máquina', id: 'MA-SCOUT-10', label: 'Mark Andy Scout 10”' },
    ],
    originLink: {
      module: 'mantenimiento',
      actionLabel: 'Ver Mantenimiento',
    },
  },

  // 8. CRM / Ventas - Oportunidad Ganada
  {
    id: 'EVT-2026-0905-08',
    occurredAt: '05 Sep 2026 · 16:10',
    timestamp: 1788624600000,
    user: 'Marcela Vega',
    userRole: 'Ejecutiva Comercial Cuentas Clave',
    module: 'Comercial',
    action: 'Ganó oportunidad y convirtió a pedido',
    reference: 'OPP-2026-042',
    referenceType: 'Oportunidad Comercial',
    description: 'Cierre del contrato anual de etiquetas automotrices para TRICO Components.',
    severity: 'success',
    changes: [
      { label: 'Etapa en Pipeline', before: 'Negociación / Presentación PPAP', after: 'Cerrada Ganada' },
      { label: 'Pedido de Venta', before: 'No emitido', after: 'Generado: PED-2026-104 ($345,000 MXN)' },
      { label: 'Probabilidad de Cierre', before: '80%', after: '100% (Contrato firmado)' },
    ],
    related: [
      { type: 'Oportunidad', id: 'OPP-2026-042', label: 'TRICO · Fascia Trasera Antirrayaduras' },
      { type: 'Cliente', id: 'CLI-TRICO', label: 'TRICO Components México' },
      { type: 'Pedido', id: 'PED-2026-104', label: 'PED-2026-104' },
    ],
    originLink: {
      module: 'crm',
      actionLabel: 'Ver en CRM',
    },
  },

  // 9. Finanzas - Timbrado CFDI de Factura
  {
    id: 'EVT-2026-0905-09',
    occurredAt: '05 Sep 2026 · 14:05',
    timestamp: 1788617100000,
    user: 'Paola Jiménez',
    userRole: 'Finanzas y Tesorería',
    module: 'Finanzas',
    action: 'Timbró factura electrónica CFDI 4.0',
    reference: 'FAC-2026-0312',
    referenceType: 'Factura Electrónica',
    description: 'Emisión y timbrado de comprobante fiscal digital para Panasonic Industrial por entrega de lote 526412.',
    severity: 'success',
    changes: [
      { label: 'Estado Fiscal', before: 'Borrador / Pre-factura', after: 'Timbrada ante el SAT' },
      { label: 'UUID SAT', before: 'Pendiente', after: '4A12B90E-71FC-4912-9A88-F841C8921A55' },
      { label: 'Cuenta por Cobrar (CxC)', before: 'No registrada', after: 'Generada a 60 días de crédito' },
    ],
    related: [
      { type: 'Factura', id: 'FAC-2026-0312', label: 'Factura FAC-2026-0312 ($284,500 MXN)' },
      { type: 'Cliente', id: 'CLI-PANASONIC', label: 'Panasonic Industrial Automotive' },
      { type: 'OP Facturada', id: 'OP-2026-95250', label: 'OP-2026-95250' },
    ],
    originLink: {
      module: 'facturacion',
      actionLabel: 'Ver en Facturación',
    },
  },

  // 10. Nómina / RH - Dictamen de Competencia
  {
    id: 'EVT-2026-0904-10',
    occurredAt: '04 Sep 2026 · 11:30',
    timestamp: 1788522600000,
    user: 'Daniel Torres',
    userRole: 'Ingeniero de Procesos y Manufactura',
    module: 'Nómina',
    action: 'Emitió dictamen de autorización de máquina',
    reference: 'CAP-2026-015',
    referenceType: 'Programa de Capacitación',
    description: 'Evaluación práctica concluida para Brenda Luna Castillo en prensa de inspección Rotoflex I.',
    severity: 'success',
    changes: [
      { label: 'Nivel de Habilidad', before: 'En entrenamiento (4 actividades)', after: 'Autorizada (Operación autónoma)' },
      { label: 'Cobertura Turno 2', before: 'Sin operador titular', after: 'Turno 2 cubierto con respaldo local' },
      { label: 'Evaluador Responsable', before: 'En curso', after: 'Daniel Torres y Fernando Soto' },
    ],
    related: [
      { type: 'Colaborador', id: 'RTM-005', label: 'Brenda Luna Castillo' },
      { type: 'Máquina', id: 'ROTOFLEX-1', label: 'Rotoflex I / Inspección' },
      { type: 'Capacitación', id: 'CAP-2026-015', label: 'CAP-2026-015 · Rotoflex' },
    ],
    originLink: {
      module: 'nomina',
      actionLabel: 'Ver en Competencias',
    },
  },

  // 11. Producción - Cierre de Lote de Producto Terminado
  {
    id: 'EVT-2026-0904-11',
    occurredAt: '04 Sep 2026 · 09:45',
    timestamp: 1788516300000,
    user: 'Planner RTM (Iván Ortega)',
    userRole: 'Planeación de Producción',
    module: 'Producción',
    action: 'Liberó bache a producto terminado',
    reference: 'LOT-PT-2026-95249',
    referenceType: 'Lote de Producto Terminado',
    description: 'Cierre de producción de 45,000 etiquetas In-Mold DeWalt 20V Max para Black & Decker.',
    severity: 'success',
    changes: [
      { label: 'Estado de Producción', before: 'En bacheado final', after: 'Cerrada y liberada para Embarques' },
      { label: 'Ubicación Física', before: 'Piso de empaque Flexo', after: 'Almacén PT · Rack C-04' },
      { label: 'Certificado de Conformidad', before: 'En firma', after: 'CoA-95249 emitido formalmente' },
    ],
    related: [
      { type: 'OP', id: 'OP-2026-95249', label: 'OP-2026-95249 · Black & Decker' },
      { type: 'Cliente', id: 'CLI-BD', label: 'Stanley Black & Decker' },
    ],
    originLink: {
      module: 'produccion',
      actionLabel: 'Ver Orden en Producción',
      query: 'OP-2026-95249',
    },
  },

  // 12. Inventario - Despacho FIFO a Piso
  {
    id: 'EVT-2026-0903-12',
    occurredAt: '03 Sep 2026 · 14:15',
    timestamp: 1788446100000,
    user: 'Raúl Salinas Olvera',
    userRole: 'Almacenista Materia Prima',
    module: 'Inventario',
    action: 'Surtido de bobinas a línea de impresión',
    reference: 'SURT-2026-019',
    referenceType: 'Movimiento de Almacén',
    description: 'Entrega de bobinas de polipropileno blanco con validación de CoAs a la orden OP-2026-95250.',
    severity: 'info',
    changes: [
      { label: 'Estado del Sustrato', before: 'En cuarentena de recepción', after: 'Entregado a pie de máquina Scout' },
      { label: 'Control FIFO', before: 'Lote más antiguo en rack', after: 'Despachado correctamente conforme a norma' },
    ],
    related: [
      { type: 'OP', id: 'OP-2026-95250', label: 'OP-2026-95250 · Panasonic' },
      { type: 'Bobina', id: 'BOB-BOPP-089', label: 'Bobina BOPP 50 micras 7”' },
    ],
    originLink: {
      module: 'inventario',
      actionLabel: 'Ver en Almacén',
    },
  },
];

// =====================================================================
// SUGERENCIAS SMART DEL SISTEMA PARA BITÁCORA GLOBAL
// =====================================================================
export const AUDIT_SYSTEM_SUGGESTIONS: AuditSystemSuggestion[] = [
  {
    id: 'SUG-AUD-01',
    title: 'Frecuencia de reprogramación en prensas Flexo',
    badge: 'Patrón de Nivelación',
    description:
      'Se registraron 3 reprogramaciones de órdenes hacia Mark Andy Scout 10” durante los últimos 7 días. Conviene revisar la carga inicial de Mark Andy 830 10” para nivelar turnos desde la planeación.',
    actionLabel: 'Filtrar movimientos de Producción',
    targetModuleFilter: 'Producción',
    searchQuery: 'Reprogramó',
  },
  {
    id: 'SUG-AUD-02',
    title: 'Reaperturas de nómina para corrección de checadas',
    badge: 'Control Administrativo',
    description:
      'El ciclo SEM-2026-36 fue reabierto tras el cierre para incorporar horas adicionales no autorizadas a tiempo en Turno 2. Se sugiere revisar el corte de incidencias de los viernes con supervisión.',
    actionLabel: 'Ver eventos de Nómina',
    targetModuleFilter: 'Nómina',
    searchQuery: 'Reabrió',
  },
  {
    id: 'SUG-AUD-03',
    title: 'Trazabilidad de lotes en HOLD resueltos',
    badge: 'Aseguramiento de Calidad',
    description:
      'El lote de barniz UV LOT-2026-0891 fue retenido por viscosidad baja. El registro muestra la emisión de etiqueta roja Zebra y la notificación al proveedor para reemplazo.',
    actionLabel: 'Filtrar eventos de Calidad',
    targetModuleFilter: 'Calidad',
    searchQuery: 'HOLD',
  },
];
