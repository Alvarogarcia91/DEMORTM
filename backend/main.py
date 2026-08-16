from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, date
import math

app = FastAPI(
    title="Nexora - API Impresos RTM",
    description="Backend de gestión operativa y control de producción para Impresos RTM (Offset, Flexografía, Suajes, Calidad y Muestras)",
    version="1.0.0"
)

# CORS configuration to allow local development and container networks
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Data Models ---

class SuajeCalculationRequest(BaseModel):
    nombre_pieza: str = "Caja Autoarmable Médica"
    tipo_empaque: str = "Plegadiza"  # Plegadiza, Etiqueta Flexo, Microcorrugado, Display
    ancho_desarrollo_mm: float = Field(default=280.0, description="Ancho extendido de la pieza en mm")
    largo_desarrollo_mm: float = Field(default=390.0, description="Largo extendido de la pieza en mm")
    ancho_pliego_mm: float = Field(default=720.0, description="Ancho del pliego de papel/cartulina en mm")
    largo_pliego_mm: float = Field(default=1020.0, description="Largo del pliego de papel/cartulina en mm")
    margen_pinza_mm: float = Field(default=15.0, description="Margen de pinza de máquina en mm")
    margen_lateral_mm: float = Field(default=10.0, description="Márgenes laterales en mm")
    calle_entre_piezas_mm: float = Field(default=5.0, description="Espacio entre poses en mm")
    tipo_suaje: str = Field(default="Plano", description="Plano (Offset) o Rotativo (Flexo)")
    tipo_pleca_corte: str = Field(default="2pt 23.80mm", description="Calibre de pleca de corte")
    tipo_pleca_doblez: str = Field(default="2pt 23.30mm", description="Calibre de pleca de hendido")
    cantidad_piezas_orden: int = Field(default=50000, description="Tiraje requerido en unidades")

class OperadorReporteRequest(BaseModel):
    id_orden: str
    maquina: str
    tecnologia: str  # "Offset" o "Flexo"
    operador: str
    turno: str  # "Matutino", "Vespertino", "Nocturno"
    pliegos_impresos: int
    pliegos_buenos: int
    merma_hojas: int
    velocidad_promedio_rpm: int
    tiempo_tiro_min: int
    tiempo_preparacion_min: int
    paros_motivos: List[Dict[str, Any]] = []
    observaciones: Optional[str] = None

class QAInspectionRequest(BaseModel):
    id_orden: str
    lote: str
    proceso: str  # "Pre-impresión", "Pie de Máquina", "Terminado", "Empaque"
    inspector: str
    delta_e_promedio: float
    registro_color: bool
    adherencia_tinta_cinta: bool
    lectura_codigo_barras: bool
    suajado_alineacion: bool
    barniz_homogeneo: bool
    resultado: str  # "Aprobado", "Aprobado con Observación", "Rechazado"
    notas: Optional[str] = None

# --- In-Memory State for Demo Mockup Data ---

mock_kpis = {
    "oee_global": 89.8,
    "oee_offset": 88.4,
    "oee_flexo": 91.2,
    "merma_promedio_pct": 2.85,
    "cumplimiento_entregas_pct": 96.4,
    "ordenes_activas": 18,
    "suajes_en_taller": 34,
    "lotes_qa_aprobados_hoy": 14,
    "tiempo_promedio_preparacion_min": 32.5
}

mock_ordenes = [
    {
        "id": "OP-2026-881",
        "cliente": "Laboratorios Farmacéuticos San Rafael",
        "producto": "Caja Jarabe Infantil 120ml (Barniz UV + Suaje)",
        "tecnologia": "Offset",
        "maquina": "Heidelberg Speedmaster CD 102 (6C + L)",
        "tiraje_total": 85000,
        "producido": 62000,
        "pliegos_buenos": 60500,
        "merma": 1500,
        "estado": "En Producción",
        "avance_pct": 73,
        "operador": "Carlos Mendoza",
        "suaje_codigo": "SUJ-MED-442",
        "fecha_entrega": "2026-08-18"
    },
    {
        "id": "OP-2026-882",
        "cliente": "Bebidas & Jugos del Valle",
        "producto": "Etiqueta Envolvente BOPP Néctar Mango 1L",
        "tecnologia": "Flexo",
        "maquina": "Mark Andy Performance Series P7 (8C)",
        "tiraje_total": 250000,
        "producido": 185000,
        "pliegos_buenos": 182300,
        "merma": 2700,
        "estado": "En Producción",
        "avance_pct": 74,
        "operador": "Roberto Silva",
        "suaje_codigo": "SUJ-ROT-109",
        "fecha_entrega": "2026-08-19"
    },
    {
        "id": "OP-2026-883",
        "cliente": "Cosméticos Élite MX",
        "producto": "Estuche Labial Luxury (Hot Stamping Oro + Suaje c/Ventana)",
        "tecnologia": "Offset",
        "maquina": "Komori Lithrone G40",
        "tiraje_total": 30000,
        "producido": 0,
        "pliegos_buenos": 0,
        "merma": 0,
        "estado": "En Espera de Placas CTP",
        "avance_pct": 0,
        "operador": "Pendiente Asignar",
        "suaje_codigo": "SUJ-COS-889",
        "fecha_entrega": "2026-08-20"
    },
    {
        "id": "OP-2026-884",
        "cliente": "Agroindustrias del Norte",
        "producto": "Etiqueta Térmica Directa 4x6'' c/Adhesivo Acrílico",
        "tecnologia": "Flexo",
        "maquina": "Nilpeter FA-Line (6C)",
        "tiraje_total": 500000,
        "producido": 500000,
        "pliegos_buenos": 494200,
        "merma": 5800,
        "estado": "En Auditoría QA",
        "avance_pct": 100,
        "operador": "Jorge Velázquez",
        "suaje_codigo": "SUJ-ROT-054",
        "fecha_entrega": "2026-08-16"
    }
]

mock_suajes = [
    {
        "id": "SUJ-MED-442",
        "nombre": "Caja Plegadiza 120ml Fondo Automático",
        "cliente": "Laboratorios Farmacéuticos San Rafael",
        "poses_por_pliego": 6,
        "disposicion": "2 filas x 3 columnas",
        "pliego_sugerido_mm": "720 x 1020",
        "aprovechamiento_pct": 86.4,
        "tipo": "Plano Madera 18mm",
        "estado": "En Uso - Máquina CD 102",
        "golpes_acumulados": 142000,
        "vida_util_estimada": 300000,
        "ubicacion_rack": "Rack B-04"
    },
    {
        "id": "SUJ-ROT-109",
        "nombre": "Suaje Magnético Etiqueta 75x120mm c/Gaps 3mm",
        "cliente": "Bebidas & Jugos del Valle",
        "poses_por_pliego": 4,
        "disposicion": "4 pistas rotativas",
        "pliego_sugerido_mm": "Banda Ancho 330mm",
        "aprovechamiento_pct": 94.2,
        "tipo": "Cilindro Flexible Magnético",
        "estado": "En Uso - Mark Andy P7",
        "golpes_acumulados": 820000,
        "vida_util_estimada": 1500000,
        "ubicacion_rack": "Rack Flexo F-12"
    },
    {
        "id": "SUJ-COS-889",
        "nombre": "Estuche Labial c/Boca Doble y Ventana",
        "cliente": "Cosméticos Élite MX",
        "poses_por_pliego": 12,
        "disposicion": "3 filas x 4 columnas",
        "pliego_sugerido_mm": "600 x 900",
        "aprovechamiento_pct": 89.1,
        "tipo": "Plano Láser Madera Multicapa",
        "estado": "En Espera en Taller",
        "golpes_acumulados": 18000,
        "vida_util_estimada": 250000,
        "ubicacion_rack": "Rack A-09"
    }
]

mock_inspecciones_qa = [
    {
        "id": "QA-2026-104",
        "id_orden": "OP-2026-884",
        "lote": "LOT-AGRO-902",
        "cliente": "Agroindustrias del Norte",
        "proceso": "Auditoría Producto Terminado",
        "inspector": "Mariana Gómez (QA Lead)",
        "delta_e_promedio": 1.15,
        "registro_color": True,
        "adherencia_tinta_cinta": True,
        "lectura_codigo_barras": True,
        "suajado_alineacion": True,
        "barniz_homogeneo": True,
        "resultado": "Aprobado",
        "fecha": "2026-08-15 15:40"
    },
    {
        "id": "QA-2026-103",
        "id_orden": "OP-2026-881",
        "lote": "LOT-MED-441",
        "cliente": "Laboratorios Farmacéuticos San Rafael",
        "proceso": "Pie de Máquina (Arranque)",
        "inspector": "Fernando Rios (QA Inspector)",
        "delta_e_promedio": 1.42,
        "registro_color": True,
        "adherencia_tinta_cinta": True,
        "lectura_codigo_barras": True,
        "suajado_alineacion": True,
        "barniz_homogeneo": True,
        "resultado": "Aprobado con Observación",
        "fecha": "2026-08-15 11:20"
    }
]

mock_muestras_diseno = [
    {
        "id": "MUE-2026-045",
        "cliente": "Laboratorios Farmacéuticos San Rafael",
        "proyecto": "Prototipo Caja Jarabe 120ml c/Inserto Integrado",
        "tipo": "Corte y Hendido en Plotter Cama Plana",
        "material": "Caple Reverso Blanco 16 pts",
        "disenador": "Ana Luisa Morales",
        "estado": "Aprobada por Cliente",
        "fecha_solicitud": "2026-08-10",
        "fecha_entrega": "2026-08-12",
        "tiempo_corte_plotter_min": 14
    },
    {
        "id": "MUE-2026-046",
        "cliente": "Chocolates Gourmet Doña Rosa",
        "proyecto": "Display Mostrador 12 Cavidades c/Copete",
        "tipo": "Maqueta Estructural Plotter PE",
        "material": "Cartón Microcorrugado Flauta E Kraft",
        "disenador": "Héctor Valdés",
        "estado": "En Revisión Estructural",
        "fecha_solicitud": "2026-08-14",
        "fecha_entrega": "2026-08-16",
        "tiempo_corte_plotter_min": 28
    }
]

# --- API Endpoints ---

@app.get("/")
def read_root():
    return {
        "sistema": "Nexora - Sistema Operativo Impresos RTM",
        "estado": "Online",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat(),
        "cliente": "RTM Impresores"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "backend": "FastAPI (Python 3.11)",
        "database": "Ready",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/dashboard/metrics")
def get_dashboard_metrics():
    return {
        "kpis": mock_kpis,
        "resumen_maquinas": [
            {"maquina": "Heidelberg CD 102 (Offset)", "estado": "Operando", "velocidad_actual": "9,800 pliegos/h", "orden_actual": "OP-2026-881", "eficiencia": "92%"},
            {"maquina": "Komori Lithrone G40 (Offset)", "estado": "Ajuste / CTP", "velocidad_actual": "0 pliegos/h", "orden_actual": "OP-2026-883", "eficiencia": "78%"},
            {"maquina": "Mark Andy P7 (Flexo)", "estado": "Operando", "velocidad_actual": "120 m/min", "orden_actual": "OP-2026-882", "eficiencia": "94%"},
            {"maquina": "Nilpeter FA-Line (Flexo)", "estado": "Lavado / Cambio", "velocidad_actual": "0 m/min", "orden_actual": "OP-2026-884", "eficiencia": "88%"}
        ],
        "produccion_por_turno": [
            {"turno": "Turno 1 (Matutino)", "offset_pliegos": 48200, "flexo_metros": 35400, "merma_pct": 2.4},
            {"turno": "Turno 2 (Vespertino)", "offset_pliegos": 42100, "flexo_metros": 31200, "merma_pct": 2.9},
            {"turno": "Turno 3 (Nocturno)", "offset_pliegos": 39500, "flexo_metros": 28900, "merma_pct": 3.2}
        ]
    }

@app.get("/api/produccion/ordenes")
def get_ordenes():
    return {"ordenes": mock_ordenes}

@app.post("/api/produccion/reporte-operador")
def registrar_reporte_operador(reporte: OperadorReporteRequest):
    return {
        "mensaje": "Reporte de operador registrado exitosamente",
        "id_reporte": f"REP-{int(datetime.now().timestamp())}",
        "datos": reporte.dict(),
        "eficiencia_calculada_pct": round((reporte.pliegos_buenos / max(reporte.pliegos_impresos, 1)) * 100, 2)
    }

@app.get("/api/suajes/lista")
def get_suajes():
    return {"suajes": mock_suajes}

@app.post("/api/suajes/calcular")
def calcular_suaje(params: SuajeCalculationRequest):
    # Cálculo de área útil de pliego
    ancho_util_pliego = params.ancho_pliego_mm - (params.margen_lateral_mm * 2)
    largo_util_pliego = params.largo_pliego_mm - params.margen_pinza_mm - 10.0  # margen contrapinza

    # Orientación Normal: Ancho en ancho, Largo en largo
    poses_ancho_1 = math.floor((ancho_util_pliego + params.calle_entre_piezas_mm) / (params.ancho_desarrollo_mm + params.calle_entre_piezas_mm))
    poses_largo_1 = math.floor((largo_util_pliego + params.calle_entre_piezas_mm) / (params.largo_desarrollo_mm + params.calle_entre_piezas_mm))
    total_poses_1 = max(0, poses_ancho_1 * poses_largo_1)

    # Orientación Girada 90°: Largo en ancho, Ancho en largo
    poses_ancho_2 = math.floor((ancho_util_pliego + params.calle_entre_piezas_mm) / (params.largo_desarrollo_mm + params.calle_entre_piezas_mm))
    poses_largo_2 = math.floor((largo_util_pliego + params.calle_entre_piezas_mm) / (params.ancho_desarrollo_mm + params.calle_entre_piezas_mm))
    total_poses_2 = max(0, poses_ancho_2 * poses_largo_2)

    # Escoger mejor orientación
    if total_poses_2 > total_poses_1:
        mejor_orientacion = "Girada 90° (Largo al Ancho)"
        poses_x = poses_ancho_2
        poses_y = poses_largo_2
        total_poses = total_poses_2
    else:
        mejor_orientacion = "Estándar (Ancho al Ancho)"
        poses_x = poses_ancho_1
        poses_y = poses_largo_1
        total_poses = total_poses_1

    area_pliego_total = params.ancho_pliego_mm * params.largo_pliego_mm
    area_por_pieza = params.ancho_desarrollo_mm * params.largo_desarrollo_mm
    area_utilizada = total_poses * area_por_pieza
    aprovechamiento_pct = round((area_utilizada / area_pliego_total) * 100, 2) if area_pliego_total > 0 else 0

    # Estimación de pliegos necesarios
    pliegos_netos = math.ceil(params.cantidad_piezas_orden / max(total_poses, 1))
    merma_estimada_pliegos = math.ceil(pliegos_netos * 0.05) + 250  # 5% + 250 pliegos para puesta a punto
    pliegos_brutos_totales = pliegos_netos + merma_estimada_pliegos

    # Estimación de metros lineales de pleca de corte y doblez
    perimetro_pieza_m = ((params.ancho_desarrollo_mm * 2) + (params.largo_desarrollo_mm * 2)) / 1000.0
    metros_pleca_corte = round(perimetro_pieza_m * total_poses * 0.85, 2)
    metros_pleca_doblez = round(perimetro_pieza_m * total_poses * 0.55, 2)
    costo_estimado_suaje_mxn = round(1500 + (metros_pleca_corte * 95) + (metros_pleca_doblez * 75) + (total_poses * 120), 2)

    return {
        "nombre_pieza": params.nombre_pieza,
        "tipo_empaque": params.tipo_empaque,
        "poses_totales_por_pliego": total_poses,
        "distribucion": f"{poses_x} columnas x {poses_y} filas",
        "mejor_orientacion": mejor_orientacion,
        "aprovechamiento_pliego_pct": aprovechamiento_pct,
        "area_desperdicio_pct": round(100 - aprovechamiento_pct, 2),
        "pliegos_netos_requeridos": pliegos_netos,
        "merma_estimada_pliegos": merma_estimada_pliegos,
        "pliegos_brutos_compra": pliegos_brutos_totales,
        "estimacion_tecnica_suaje": {
            "metros_pleca_corte": metros_pleca_corte,
            "metros_pleca_doblez": metros_pleca_doblez,
            "tipo_pleca_corte": params.tipo_pleca_corte,
            "tipo_pleca_doblez": params.tipo_pleca_doblez,
            "costo_estimado_fabricacion_mxn": costo_estimado_suaje_mxn,
            "tipo_madera": "Madera Abedul Laser 18mm" if params.tipo_suaje == "Plano" else "Camisa Cilindro Magnético CNC"
        }
    }

@app.get("/api/calidad/inspecciones")
def get_inspecciones():
    return {"inspecciones": mock_inspecciones_qa}

@app.post("/api/calidad/inspecciones")
def registrar_inspeccion(req: QAInspectionRequest):
    nueva_inspeccion = {
        "id": f"QA-2026-{len(mock_inspecciones_qa) + 105}",
        "id_orden": req.id_orden,
        "lote": req.lote,
        "cliente": "RTM - Cliente Registrado",
        "proceso": req.proceso,
        "inspector": req.inspector,
        "delta_e_promedio": req.delta_e_promedio,
        "registro_color": req.registro_color,
        "adherencia_tinta_cinta": req.adherencia_tinta_cinta,
        "lectura_codigo_barras": req.lectura_codigo_barras,
        "suajado_alineacion": req.suajado_alineacion,
        "barniz_homogeneo": req.barniz_homogeneo,
        "resultado": req.resultado,
        "notas": req.notas,
        "fecha": datetime.now().strftime("%Y-%m-%d %H:%M")
    }
    mock_inspecciones_qa.insert(0, nueva_inspeccion)
    return {"mensaje": "Inspección QA guardada con éxito", "inspeccion": nueva_inspeccion}

@app.get("/api/diseno/muestras")
def get_muestras():
    return {"muestras": mock_muestras_diseno}
