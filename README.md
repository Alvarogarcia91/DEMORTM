# NEXORA OS — Impresos RTM (Demo Operativo)

Sistema integral de gestión de producción, control de calidad, cálculo de suajes y muestras desarrollado por **Nexora** para **Impresos RTM**.

---

## Arquitectura de la Solución (Contenerizada con Docker)

El proyecto está completamente contenerizado, eliminando la necesidad de tener Python o herramientas locales instaladas en la máquina host.

```
DEMO NEXORA/
├── docker-compose.yml       # Orquestador multi-contenedor (React + Python)
├── .env.example             # Variables de entorno de referencia
├── README.md                # Documentación de puesta en marcha
│
├── frontend/                # Aplicación Web React + TypeScript + Vite
│   ├── Dockerfile           # Contenedor Node.js Alpine
│   ├── package.json
│   ├── vite.config.ts
│   ├── index.html
│   └── src/
│       ├── components/      # Módulos: Dashboard, Producción, Suajes, Calidad, Diseño
│       ├── services/        # Cliente API con tolerancia y fallbacks
│       ├── types.ts         # Modelos de datos TypeScript
│       └── index.css        # Sistema de diseño industrial
│
└── backend/                 # API REST FastAPI + Python 3.11
    ├── Dockerfile           # Contenedor Python 3.11 Slim
    ├── requirements.txt     # FastAPI, Uvicorn, Pandas, Openpyxl
    └── main.py              # Endpoints y lógica de negocio RTM
```

---

## ¿Cómo levantar el proyecto con Docker?

Desde la terminal en el directorio `DEMO NEXORA`, ejecuta:

```bash
docker compose up --build
```

O si utilizas la sintaxis anterior:
```bash
docker-compose up --build
```

### URLs de Acceso:
- **Frontend (React + Vite)**: [http://localhost:3000](http://localhost:3000)
- **Backend API (FastAPI)**: [http://localhost:8000](http://localhost:8000)
- **Documentación Swagger / OpenAPI**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## Módulos Integrados para Impresos RTM

1. **Panel General (Dashboard)**:
   - Métricas OEE (Global, Offset, Flexografía), % de Merma y cumplimiento de entregas (OTD).
   - Monitoreo en vivo de prensas (Heidelberg CD 102, Komori Lithrone, Mark Andy P7, Nilpeter).
   - Producción acumulada por turnos (Matutino, Vespertino, Nocturno).

2. **Producción (Offset & Flexografía)**:
   - Programación Master de tirajes y balance de carga.
   - Filtros por tecnología: Pliegos (Offset) vs Bobinas (Flexo).
   - Captura y registro digital de Reportes de Operador y paros de máquina.

3. **Ingeniería de Suajes & Aprovechamiento de Pliego**:
   - Calculadora paramétrica de troqueles y desarrollo de piezas.
   - Cálculo automático de poses ($X \times Y$), margen de pinza y rendimiento del pliego.
   - Previsualizador 2D interactivo de imposición de suaje en pliego.
   - Estimación de metros lineales de pleca (corte y hendido) y costo de fabricación.
   - Inventario de suajes y vida útil en taller.

4. **Aseguramiento de Calidad (QA) & Liberación de Lotes**:
   - Puntos críticos: Espectrofotometría $\Delta E$, adherencia de tinta (cinta 3M), lectura de código de barras (Grado A/B ISO 15416) y registro de suaje.
   - Modal interactivo para registro de auditorías y liberación de lotes.

5. **Diseño, Muestras & Fotopolímeros**:
   - Control de maquetas y prototipos en Plotter de Cama Plana PE.
   - Registro de fotopolímeros flexográficos (lineaturas LPI, anilox BCM y juegos de clichés).
