import { DashboardData, OrdenProduccion, SuajeItem, SuajeCalcParams, SuajeCalcResult, QAInspection, MuestraDiseno } from '../types';

const API_BASE = '/api';

export async function fetchDashboardMetrics(): Promise<DashboardData> {
  try {
    const res = await fetch(`${API_BASE}/dashboard/metrics`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API error, using fallback data', err);
    return {
      kpis: {
        oee_global: 89.8,
        oee_offset: 88.4,
        oee_flexo: 91.2,
        merma_promedio_pct: 2.85,
        cumplimiento_entregas_pct: 96.4,
        ordenes_activas: 18,
        suajes_en_taller: 34,
        lotes_qa_aprobados_hoy: 14,
        tiempo_promedio_preparacion_min: 32.5
      },
      resumen_maquinas: [
        { maquina: "Heidelberg CD 102 (Offset)", estado: "Operando", velocidad_actual: "9,800 pliegos/h", orden_actual: "OP-2026-881", eficiencia: "92%" },
        { maquina: "Komori Lithrone G40 (Offset)", estado: "Ajuste / CTP", velocidad_actual: "0 pliegos/h", orden_actual: "OP-2026-883", eficiencia: "78%" },
        { maquina: "Mark Andy P7 (Flexo)", estado: "Operando", velocidad_actual: "120 m/min", orden_actual: "OP-2026-882", eficiencia: "94%" },
        { maquina: "Nilpeter FA-Line (Flexo)", estado: "Lavado / Cambio", velocidad_actual: "0 m/min", orden_actual: "OP-2026-884", eficiencia: "88%" }
      ],
      produccion_por_turno: [
        { turno: "Turno 1 (Matutino)", offset_pliegos: 48200, flexo_metros: 35400, merma_pct: 2.4 },
        { turno: "Turno 2 (Vespertino)", offset_pliegos: 42100, flexo_metros: 31200, merma_pct: 2.9 },
        { turno: "Turno 3 (Nocturno)", offset_pliegos: 39500, flexo_metros: 28900, merma_pct: 3.2 }
      ]
    };
  }
}

export async function fetchOrdenes(): Promise<OrdenProduccion[]> {
  try {
    const res = await fetch(`${API_BASE}/produccion/ordenes`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return data.ordenes;
  } catch (err) {
    console.warn('API error, returning fallback ordenes', err);
    return [
      {
        id: "OP-2026-881",
        cliente: "Laboratorios Farmacéuticos San Rafael",
        producto: "Caja Jarabe Infantil 120ml (Barniz UV + Suaje)",
        tecnologia: "Offset",
        maquina: "Heidelberg Speedmaster CD 102 (6C + L)",
        tiraje_total: 85000,
        producido: 62000,
        pliegos_buenos: 60500,
        merma: 1500,
        estado: "En Producción",
        avance_pct: 73,
        operador: "Carlos Mendoza",
        suaje_codigo: "SUJ-MED-442",
        fecha_entrega: "2026-08-18"
      },
      {
        id: "OP-2026-882",
        cliente: "Bebidas & Jugos del Valle",
        producto: "Etiqueta Envolvente BOPP Néctar Mango 1L",
        tecnologia: "Flexo",
        maquina: "Mark Andy Performance Series P7 (8C)",
        tiraje_total: 250000,
        producido: 185000,
        pliegos_buenos: 182300,
        merma: 2700,
        estado: "En Producción",
        avance_pct: 74,
        operador: "Roberto Silva",
        suaje_codigo: "SUJ-ROT-109",
        fecha_entrega: "2026-08-19"
      }
    ];
  }
}

export async function fetchSuajes(): Promise<SuajeItem[]> {
  try {
    const res = await fetch(`${API_BASE}/suajes/lista`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return data.suajes;
  } catch (err) {
    console.warn('API error, fallback suajes', err);
    return [
      {
        id: "SUJ-MED-442",
        nombre: "Caja Plegadiza 120ml Fondo Automático",
        cliente: "Laboratorios Farmacéuticos San Rafael",
        poses_por_pliego: 6,
        disposicion: "2 filas x 3 columnas",
        pliego_sugerido_mm: "720 x 1020",
        aprovechamiento_pct: 86.4,
        tipo: "Plano Madera 18mm",
        estado: "En Uso - Máquina CD 102",
        golpes_acumulados: 142000,
        vida_util_estimada: 300000,
        ubicacion_rack: "Rack B-04"
      }
    ];
  }
}

export async function calcularSuajeAPI(params: SuajeCalcParams): Promise<SuajeCalcResult> {
  const res = await fetch(`${API_BASE}/suajes/calcular`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    // Local calculation fallback if server is unreachable
    const areaPliego = params.ancho_pliego_mm * params.largo_pliego_mm;
    const anchoUtil = params.ancho_pliego_mm - (params.margen_lateral_mm * 2);
    const largoUtil = params.largo_pliego_mm - params.margen_pinza_mm - 10;
    const px = Math.floor((anchoUtil + params.calle_entre_piezas_mm) / (params.ancho_desarrollo_mm + params.calle_entre_piezas_mm));
    const py = Math.floor((largoUtil + params.calle_entre_piezas_mm) / (params.largo_desarrollo_mm + params.calle_entre_piezas_mm));
    const total = Math.max(1, px * py);
    const areaUtil = total * (params.ancho_desarrollo_mm * params.largo_desarrollo_mm);
    const pct = Math.min(100, Math.round((areaUtil / areaPliego) * 10000) / 100);
    const pliegosNetos = Math.ceil(params.cantidad_piezas_orden / total);
    return {
      nombre_pieza: params.nombre_pieza,
      tipo_empaque: params.tipo_empaque,
      poses_totales_por_pliego: total,
      distribucion: `${px} col x ${py} filas`,
      mejor_orientacion: "Estándar (Ancho al Ancho)",
      aprovechamiento_pliego_pct: pct,
      area_desperdicio_pct: +(100 - pct).toFixed(2),
      pliegos_netos_requeridos: pliegosNetos,
      merma_estimada_pliegos: Math.ceil(pliegosNetos * 0.05) + 200,
      pliegos_brutos_compra: pliegosNetos + Math.ceil(pliegosNetos * 0.05) + 200,
      estimacion_tecnica_suaje: {
        metros_pleca_corte: +(total * 1.8).toFixed(2),
        metros_pleca_doblez: +(total * 1.2).toFixed(2),
        tipo_pleca_corte: params.tipo_pleca_corte,
        tipo_pleca_doblez: params.tipo_pleca_doblez,
        costo_estimado_fabricacion_mxn: 2500 + total * 180,
        tipo_madera: "Madera Abedul Laser 18mm"
      }
    };
  }
  return await res.json();
}

export async function fetchInspeccionesQA(): Promise<QAInspection[]> {
  try {
    const res = await fetch(`${API_BASE}/calidad/inspecciones`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return data.inspecciones;
  } catch (err) {
    console.warn('API error, fallback qa', err);
    return [];
  }
}

export async function postInspeccionQA(req: Partial<QAInspection>): Promise<any> {
  const res = await fetch(`${API_BASE}/calidad/inspecciones`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  return await res.json();
}

export async function fetchMuestras(): Promise<MuestraDiseno[]> {
  try {
    const res = await fetch(`${API_BASE}/diseno/muestras`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return data.muestras;
  } catch (err) {
    console.warn('API error, fallback muestras', err);
    return [];
  }
}

export async function postReporteOperador(data: any): Promise<any> {
  const res = await fetch(`${API_BASE}/produccion/reporte-operador`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return await res.json();
}
