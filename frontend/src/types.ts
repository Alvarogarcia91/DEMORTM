export interface KPIMetrics {
  oee_global: number;
  oee_offset: number;
  oee_flexo: number;
  merma_promedio_pct: number;
  cumplimiento_entregas_pct: number;
  ordenes_activas: number;
  suajes_en_taller: number;
  lotes_qa_aprobados_hoy: number;
  tiempo_promedio_preparacion_min: number;
}

export interface MaquinaEstado {
  maquina: string;
  estado: string;
  velocidad_actual: string;
  orden_actual: string;
  eficiencia: string;
}

export interface ProduccionTurno {
  turno: string;
  offset_pliegos: number;
  flexo_metros: number;
  merma_pct: number;
}

export interface DashboardData {
  kpis: KPIMetrics;
  resumen_maquinas: MaquinaEstado[];
  produccion_por_turno: ProduccionTurno[];
}

export interface OrdenProduccion {
  id: string;
  cliente: string;
  producto: string;
  tecnologia: 'Offset' | 'Flexo';
  maquina: string;
  tiraje_total: number;
  producido: number;
  pliegos_buenos: number;
  merma: number;
  estado: string;
  avance_pct: number;
  operador: string;
  suaje_codigo: string;
  fecha_entrega: string;
}

export interface SuajeItem {
  id: string;
  nombre: string;
  cliente: string;
  poses_por_pliego: number;
  disposicion: string;
  pliego_sugerido_mm: string;
  aprovechamiento_pct: number;
  tipo: string;
  estado: string;
  golpes_acumulados: number;
  vida_util_estimada: number;
  ubicacion_rack: string;
}

export interface SuajeCalcParams {
  nombre_pieza: string;
  tipo_empaque: string;
  ancho_desarrollo_mm: number;
  largo_desarrollo_mm: number;
  ancho_pliego_mm: number;
  largo_pliego_mm: number;
  margen_pinza_mm: number;
  margen_lateral_mm: number;
  calle_entre_piezas_mm: number;
  tipo_suaje: string;
  tipo_pleca_corte: string;
  tipo_pleca_doblez: string;
  cantidad_piezas_orden: number;
}

export interface SuajeCalcResult {
  nombre_pieza: string;
  tipo_empaque: string;
  poses_totales_por_pliego: number;
  distribucion: string;
  mejor_orientacion: string;
  aprovechamiento_pliego_pct: number;
  area_desperdicio_pct: number;
  pliegos_netos_requeridos: number;
  merma_estimada_pliegos: number;
  pliegos_brutos_compra: number;
  estimacion_tecnica_suaje: {
    metros_pleca_corte: number;
    metros_pleca_doblez: number;
    tipo_pleca_corte: string;
    tipo_pleca_doblez: string;
    costo_estimado_fabricacion_mxn: number;
    tipo_madera: string;
  };
}

export interface QAInspection {
  id: string;
  id_orden: string;
  lote: string;
  cliente: string;
  proceso: string;
  inspector: string;
  delta_e_promedio: number;
  registro_color: boolean;
  adherencia_tinta_cinta: boolean;
  lectura_codigo_barras: boolean;
  suajado_alineacion: boolean;
  barniz_homogeneo: boolean;
  resultado: 'Aprobado' | 'Aprobado con Observación' | 'Rechazado';
  fecha: string;
  notas?: string;
}

export interface MuestraDiseno {
  id: string;
  cliente: string;
  proyecto: string;
  tipo: string;
  material: string;
  disenador: string;
  estado: string;
  fecha_solicitud: string;
  fecha_entrega: string;
  tiempo_corte_plotter_min: number;
}
