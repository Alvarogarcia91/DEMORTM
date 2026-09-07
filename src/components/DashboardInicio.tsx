import React, { useState } from 'react';
import { 
  Scan, 
  PackageCheck, 
  Truck, 
  ArrowRight, 
  Package, 
  Boxes, 
  ShoppingCart, 
  ClipboardList, 
  FileText, 
  Building2, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  MapPin,
  Calendar, 
  ChevronRight, 
  Navigation, 
  TrendingUp, 
  Layers, 
  ShieldCheck, 
  Plus, 
  Search,
  Factory,
  Activity,
  Wrench
} from 'lucide-react';
import { NavItemKey } from './Sidebar';

interface DashboardInicioProps {
  onNavigate: (tab: NavItemKey) => void;
}

export const DashboardInicio: React.FC<DashboardInicioProps> = ({ onNavigate }) => {
  const [selectedFacility, setSelectedFacility] = useState<string>('ALL');
  const [selectedPeriod, setSelectedPeriod] = useState<'Hoy' | '7 días' | '30 días'>('Hoy');
  const [selectedMapFacility, setSelectedMapFacility] = useState<string | null>('alm-rtm-mp');

  // Facilities data for interactive map and operational network
  const facilities = [
    {
      id: 'alm-rtm-mp',
      code: 'ALM-MP',
      name: 'Almacén Materias Primas & Sustratos',
      type: 'Almacén Principal de Bobinas, Pliegos y Tintas',
      address: 'Av. Industrial del Norte #120, Parque Industrial del Norte, Reynosa, Tamps.',
      coordinates: { x: 220, y: 225, lat: 26.0450, lng: -98.2980 },
      unitsCount: '158,400 u.',
      rawStock: '158,400 pliegos / bobinas',
      pendingInbound: 3,
      activeRoutes: 2,
      pendingOrders: 4,
      openIncidents: 1,
      accentColor: 'border-theme-primary',
    },
    {
      id: 'alm-rtm-pt',
      code: 'ALM-PT',
      name: 'Almacén Producto Terminado & Embarques',
      type: 'Almacén de PT, Staging B2B y Andén EMB-01',
      address: 'Av. Industrial del Norte #124, Parque Industrial del Norte, Reynosa, Tamps.',
      coordinates: { x: 480, y: 225, lat: 26.0465, lng: -98.2950 },
      unitsCount: '12,800 u.',
      rawStock: '12,800 cajas / millares',
      pendingInbound: 2,
      activeRoutes: 4,
      pendingOrders: 6,
      openIncidents: 0,
      accentColor: 'border-emerald-600',
    },
  ];

  const activeSelectedFacility = facilities.find((f) => f.id === selectedMapFacility) || facilities[0];

  // Requiere tu atención list (6 industrial cases)
  const attentionItems = [
    {
      id: 'att-0',
      tag: 'Paro de Máquina',
      tagColor: 'border-rose-500 text-rose-700',
      reference: 'OT-MTTO-2026-0042',
      facility: 'Prensa Flexo 02 [PRE-FLX-02]',
      description: 'Prensa Flexo 02 detenida por vibración en estación 3. En espera de rodamiento SKF 6205.',
      actionLabel: 'Ver OT de Mantenimiento',
      targetTab: 'mantenimiento' as NavItemKey,
    },
    {
      id: 'att-1',
      tag: 'Conteo cíclico',
      tagColor: 'border-rose-500 text-rose-700',
      reference: 'CC-2026-W36-01',
      facility: 'ALM-MP — Pasillo A-B-03',
      description: 'Discrepancia de -19,500 pliegos en Couché 90g 70x100 cm. Auditoría física en curso.',
      actionLabel: 'Investigar',
      targetTab: 'inventario' as NavItemKey,
    },
    {
      id: 'att-2',
      tag: 'Retenido QA',
      tagColor: 'border-rose-500 text-rose-700',
      reference: 'LOT-BOPP-2026-03',
      facility: 'ALM-MP — Cuarentena QA',
      description: 'Lote de 3,200 m BOPP Blanco 50 micras retenido por espesor fuera de tolerancia.',
      actionLabel: 'Ver cuarentena',
      targetTab: 'inventario' as NavItemKey,
    },
    {
      id: 'att-3',
      tag: 'Reubicación',
      tagColor: 'border-amber-500 text-amber-700',
      reference: 'TRF-2026-0041',
      facility: 'ALM-MP — Pasillo B-02',
      description: 'Bobina devuelta con 680 m de BOPP Transparente. Pendiente de reubicación a rack de rotación.',
      actionLabel: 'Reubicar material',
      targetTab: 'inventario' as NavItemKey,
    },
    {
      id: 'att-4',
      tag: 'Entrega parcial',
      tagColor: 'border-amber-500 text-amber-700',
      reference: 'OC-2026-0082',
      facility: 'Andén MP — Sun Chemical',
      description: 'Recibidas 12 de 16 cubetas de Tinta Process Black. 4 cubetas amparadas en backorder.',
      actionLabel: 'Revisar andén',
      targetTab: 'mesa-verificacion' as NavItemKey,
    },
    {
      id: 'att-5',
      tag: 'Staging Embarque',
      tagColor: 'border-blue-500 text-blue-700',
      reference: 'REM-2026-0061',
      facility: 'ALM-PT — Andén EMB-01',
      description: '18 cajas de etiquetas farmacéuticas para Medifarma listas para carga y despacho.',
      actionLabel: 'Ver remisión',
      targetTab: 'logistica' as NavItemKey,
    },
    {
      id: 'att-6',
      tag: 'Reorden sugerido',
      tagColor: 'border-rose-500 text-rose-700',
      reference: 'MP-TER-001',
      facility: 'ALM-MP — Pasillo C-01',
      description: 'Papel Térmico Autoadherible 80g en 4 bobinas (cobertura 3.5 días). Reorden prioritario.',
      actionLabel: 'Ver existencias',
      targetTab: 'inventario' as NavItemKey,
    },
  ];

  // Timeline of 20 real recent industrial platform events
  const recentEvents = [
    { time: '14:48', title: 'Entrega B2B completada', ref: 'REM-2026-0061 · Medifarma (18 cajas)', user: 'Mesa de Embarques (Andén EMB-01)', icon: CheckCircle2, iconColor: 'text-emerald-600' },
    { time: '14:35', title: 'Transferencia interna completada', ref: 'TRF-2026-0882 · 3 bobinas BOPP Blanco', user: 'Juan Pablo Rangel (Montacargas 02)', icon: Scan, iconColor: 'text-blue-600' },
    { time: '14:15', title: 'Liberación de Calidad QA', ref: 'LOT-COUCH-90G-08 · Blancura y calibre OK', user: 'Ing. Elena Fuentes (Control de Calidad)', icon: ShieldCheck, iconColor: 'text-emerald-600' },
    { time: '13:50', title: 'Remisión emitida (Salida confirmada)', ref: 'REM-2026-0062 · Delphi Technologies', user: 'Valeria Torres (Mesa 02 ALM-PT)', icon: PackageCheck, iconColor: 'text-emerald-600' },
    { time: '13:30', title: 'Conteo cíclico registrado', ref: 'CC-2026-W36-01 · Discrepancia -19,500 pliegos', user: 'Auditoría Almacén MP (Pasillo A-B-03)', icon: AlertTriangle, iconColor: 'text-rose-600' },
    { time: '13:05', title: 'Reingreso a almacén registrado', ref: 'TRF-2026-0041 · 680 m BOPP Transparente', user: 'Operador Almacén MP (Pasillo B-02)', icon: Layers, iconColor: 'text-purple-600' },
    { time: '12:40', title: 'Acomodo en rack completado', ref: 'TAR-RTM-0004 · Posición MP-A01-N2', user: 'Carlos Medina (Montacargas 01)', icon: Boxes, iconColor: 'text-blue-600' },
    { time: '12:15', title: 'Recepción validada en andén', ref: 'OC-2026-0081 · Bio-Pappel (14 tarimas Couché)', user: 'Brenda Cavazos (Mesa 01 ALM-MP)', icon: CheckCircle2, iconColor: 'text-emerald-600' },
    { time: '11:50', title: 'Despacho industrial confirmado', ref: 'OS-2026-0014 · Salida en Andén EMB-01 para Parque Del Norte', user: 'Mesa de Despacho RTM', icon: Truck, iconColor: 'text-theme-primary' },
    { time: '11:20', title: 'Muestra QA tomada en andén', ref: 'OC-2026-0082 · Sun Chemical (Viscosidad Tintas)', user: 'Laboratorio de Tintas & Sustratos', icon: ShieldCheck, iconColor: 'text-emerald-600' },
    { time: '10:55', title: 'Orden de salida programada', ref: 'OS-2026-0891 · Folletos Industriales para despacho', user: 'Control de Almacén RTM', icon: ClipboardList, iconColor: 'text-blue-600' },
    { time: '10:30', title: 'Acomodo de pliegos completado', ref: 'LOT-SBS-2026 · 8,200 pliegos Caple SBS', user: 'Juan Pablo Rangel', icon: Boxes, iconColor: 'text-purple-600' },
    { time: '10:10', title: 'Entrada de transporte a patio', ref: 'Tráiler Bio-Pappel · Andén 01', user: 'Caseta de Control de Acceso', icon: MapPin, iconColor: 'text-zinc-700' },
    { time: '09:45', title: 'Reingreso a estantería de tintas', ref: 'REM-2026-0045 · Pantone 186 C (3.5 kg)', user: 'Almacén de Tintas y Solventes', icon: Layers, iconColor: 'text-purple-600' },
    { time: '09:15', title: 'Requisición de materia prima autorizada', ref: 'REQ-2026-0052 · Fasson Autoadherible', user: 'Compras Industriales RTM', icon: FileText, iconColor: 'text-zinc-700' },
    { time: '08:50', title: 'Tarima de PT ingresada a staging', ref: 'TAR-PT-0088 · 450 millares etiquetas pharma', user: 'Área de Staging y Verificación', icon: Package, iconColor: 'text-emerald-600' },
    { time: '08:20', title: 'Carga en andén EMB-01 completada', ref: 'OS-2026-0015 · 3 tarimas cajas corrugadas', user: 'Patio Embarques EMB-01', icon: Truck, iconColor: 'text-theme-primary' },
    { time: '07:55', title: 'Apertura de turno operativo', ref: 'ALM-MP y ALM-PT activos', user: 'Supervisión de Almacenes Reynosa', icon: ShieldCheck, iconColor: 'text-emerald-600' },
    { time: '07:40', title: 'Calibración de báscula de andén', ref: 'Báscula Toledo Andén MP verificada', user: 'Mantenimiento RTM', icon: Activity, iconColor: 'text-blue-600' },
    { time: '07:15', title: 'Asignación de montacargas', ref: 'Baterías y check-list unidades #01, #02, #03 OK', user: 'Turno Matutino Almacén', icon: Factory, iconColor: 'text-zinc-600' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. HEADER EJECUTIVO & CONTROLES */}
      <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-2xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white text-zinc-900 border border-theme-primary shadow-2xs">
                IMPRESOS RTM · PLANTA REYNOSA
              </span>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white border border-emerald-500 text-[10px] font-bold text-emerald-800 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Operación en planta estable</span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950">
              Centro de Control Operativo
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500">
              Control integral de materias primas, sustratos, inventario físico y despacho de producto terminado.
            </p>
          </div>

          {/* Filters & Actions */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Facility Filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <Building2 className="w-4 h-4 text-zinc-400" />
              <select
                value={selectedFacility}
                onChange={(e) => setSelectedFacility(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-zinc-300 bg-white text-xs font-semibold text-zinc-800 focus:outline-none focus:ring-2 focus:ring-theme-primary"
              >
                <option value="ALL">Todas las áreas de almacén</option>
                <option value="alm-rtm-mp">Almacén Materias Primas (ALM-MP)</option>
                <option value="alm-rtm-pt">Almacén Producto Terminado (ALM-PT / EMB-01)</option>
              </select>
            </div>

            {/* Period Toggle */}
            <div className="flex items-center rounded-xl border border-zinc-300 bg-zinc-50 p-0.5 text-xs font-bold text-zinc-600">
              {(['Hoy', '7 días', '30 días'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setSelectedPeriod(p)}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    selectedPeriod === p
                      ? 'bg-white text-zinc-950 shadow-2xs border border-zinc-200'
                      : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <span className="text-[11px] font-mono text-zinc-400 pl-1 hidden sm:inline">
              Actualizado: hace 1 min
            </span>
          </div>
        </div>

        {/* 2. ACCIONES RÁPIDAS (BARRA COMPACTA) */}
        <div className="pt-2 border-t border-zinc-100 flex items-center justify-between gap-3 flex-wrap">
          <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider">
            Accesos directos de almacén:
          </span>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => onNavigate('inventario')}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-zinc-50 text-zinc-900 font-bold text-xs border border-zinc-300 shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Boxes className="w-3.5 h-3.5 text-theme-primary" />
              <span>Inventario & Ubicaciones</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('mesa-verificacion')}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-zinc-50 text-zinc-900 font-bold text-xs border border-zinc-300 shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Scan className="w-3.5 h-3.5 text-blue-600" />
              <span>Recepción & Acomodo</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('mesa-verificacion')}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-zinc-50 text-zinc-900 font-bold text-xs border border-zinc-300 shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <PackageCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>Surtido Interno</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('mantenimiento')}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-zinc-50 text-zinc-900 font-bold text-xs border border-zinc-300 shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Wrench className="w-3.5 h-3.5 text-amber-600" />
              <span>Mantenimiento & Equipos</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('logistica')}
              className="px-4 py-1.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Producto Terminado & Embarques</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. KPIS PRINCIPALES (5 CARDS CLICKEABLES) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        
        {/* Existencias Activas */}
        <div
          onClick={() => onNavigate('inventario')}
          className="p-4 rounded-3xl bg-white border border-zinc-200 hover:border-zinc-300 hover:shadow-xs transition-all cursor-pointer group space-y-1"
        >
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            <span>Existencias Activas</span>
            <Boxes className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
          </div>
          <div className="text-2xl font-black font-mono text-zinc-950">
            158,400
          </div>
          <div className="flex items-center justify-between text-[11px] text-zinc-600 font-medium pt-0.5">
            <span>Disp: 124.6k · Res: 28.2k</span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Recepciones Pendientes */}
        <div
          onClick={() => onNavigate('mesa-verificacion')}
          className="p-4 rounded-3xl bg-white border border-zinc-200 hover:border-zinc-300 hover:shadow-xs transition-all cursor-pointer group space-y-1"
        >
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            <span>Recepciones MP</span>
            <Scan className="w-3.5 h-3.5 text-zinc-400 group-hover:text-blue-600 transition-colors" />
          </div>
          <div className="text-2xl font-black font-mono text-blue-700">
            3 órdenes
          </div>
          <div className="flex items-center justify-between text-[11px] text-zinc-600 pt-0.5">
            <span>35,000 unidades en andén</span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Surtido Interno */}
        <div
          onClick={() => onNavigate('mesa-verificacion')}
          className="p-4 rounded-3xl bg-white border border-zinc-200 hover:border-zinc-300 hover:shadow-xs transition-all cursor-pointer group space-y-1"
        >
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            <span>Surtido Interno</span>
            <PackageCheck className="w-3.5 h-3.5 text-zinc-400 group-hover:text-purple-600 transition-colors" />
          </div>
          <div className="text-2xl font-black font-mono text-purple-700">
            4 órdenes
          </div>
          <div className="flex items-center justify-between text-[11px] text-zinc-600 pt-0.5">
            <span>Bobinas y pliegos preparados</span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* PT en Embarque */}
        <div
          onClick={() => onNavigate('logistica')}
          className="p-4 rounded-3xl bg-white border border-zinc-200 hover:border-zinc-300 hover:shadow-xs transition-all cursor-pointer group space-y-1"
        >
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            <span>PT Liberado & Staging</span>
            <Truck className="w-3.5 h-3.5 text-zinc-400 group-hover:text-emerald-600 transition-colors" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-700">
            12,800
          </div>
          <div className="flex items-center justify-between text-[11px] text-zinc-600 pt-0.5">
            <span>4 órdenes listas en EMB-01</span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Cuarentena / QA */}
        <div
          onClick={() => onNavigate('inventario')}
          className="p-4 rounded-3xl bg-white border border-zinc-200 hover:border-zinc-300 hover:shadow-xs transition-all cursor-pointer group space-y-1"
        >
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            <span>Cuarentena QA</span>
            <AlertTriangle className="w-3.5 h-3.5 text-zinc-400 group-hover:text-rose-600 transition-colors" />
          </div>
          <div className="text-2xl font-black font-mono text-rose-700">
            5,600
          </div>
          <div className="flex items-center justify-between text-[11px] text-rose-700 font-semibold pt-0.5">
            <span>1 lote retenido (BOPP)</span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

      </div>

      {/* 4. OPERACIÓN EN VIVO (2/3 MAPA + 1/3 ATENCIÓN) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Izquierda: Mapa Operativo de la Planta Industrial Reynosa (8 cols) */}
        <div className="lg:col-span-8 p-5 rounded-3xl bg-white border border-zinc-200 shadow-2xs space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
            <div>
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-theme-primary" />
                <h3 className="font-black text-zinc-950 text-sm">
                  Complejo de Almacenes Impresos RTM — Reynosa
                </h3>
              </div>
              <p className="text-[11px] text-zinc-500">
                Interconexión operativa: Almacén Materias Primas (ALM-MP) y Almacén Producto Terminado (ALM-PT / EMB-01).
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('logistica')}
              className="text-theme-primary font-bold text-xs hover:underline cursor-pointer"
            >
              Ver andenes y despachos &rarr;
            </button>
          </div>

          {/* Cartographic SVG Plant Network Map */}
          <div className="relative rounded-2xl border border-zinc-200 bg-zinc-50 overflow-hidden h-[340px] flex items-center justify-center">
            <svg viewBox="0 0 700 450" className="w-full h-full">
              {/* Background Grid Lines */}
              <defs>
                <pattern id="grid-net" width="35" height="35" patternUnits="userSpaceOnUse">
                  <path d="M 35 0 L 0 0 0 35" fill="none" stroke="#E4E4E7" strokeWidth="0.6" strokeDasharray="2,2" />
                </pattern>
              </defs>
              <rect width="700" height="450" fill="url(#grid-net)" />

              {/* Plant Perimeter and Zones */}
              <rect x="50" y="40" width="600" height="360" rx="16" fill="#FFFFFF" fillOpacity="0.6" stroke="#E4E4E7" strokeWidth="1.5" strokeDasharray="6,4" />
              <text x="70" y="65" className="font-mono text-[9px] font-bold fill-zinc-400 uppercase tracking-widest">
                Parque Industrial del Norte · Impresos RTM S.A. de C.V.
              </text>

              {/* Material Transfer Arteries */}
              {/* Direct Link between ALM-MP and ALM-PT */}
              <path d="M 220 225 L 480 225" fill="none" stroke="#CBD5E1" strokeWidth="3" strokeDasharray="5,5" />
              {/* Dispatch Outflow to Staging / Andén */}
              <path d="M 480 225 L 610 225" fill="none" stroke="#059669" strokeWidth="2.5" strokeDasharray="4,4" />

              {/* Animated Flow Markers */}
              <circle cx="350" cy="225" r="4" fill="var(--color-primary)" className="animate-ping opacity-60" />
              <circle cx="350" cy="225" r="3" fill="var(--color-primary)" />

              <circle cx="550" cy="225" r="4" fill="#059669" className="animate-ping opacity-60" />
              <circle cx="550" cy="225" r="3" fill="#059669" />

              {/* Facility Nodes */}
              {facilities.map((fac) => {
                const isSelected = selectedMapFacility === fac.id;
                const isMP = fac.id === 'alm-rtm-mp';
                const isPT = fac.id === 'alm-rtm-pt';
                const colorHex = isMP ? 'var(--color-primary)' : isPT ? '#059669' : '#2563EB';

                return (
                  <g 
                    key={fac.id} 
                    className="cursor-pointer transition-transform"
                    onClick={() => setSelectedMapFacility(fac.id)}
                  >
                    {/* Outer selection ring */}
                    {isSelected && (
                      <circle
                        cx={fac.coordinates.x}
                        cy={fac.coordinates.y}
                        r="26"
                        fill="none"
                        stroke={colorHex}
                        strokeWidth="2"
                        strokeDasharray="4,4"
                        className="animate-spin"
                        style={{ transformOrigin: `${fac.coordinates.x}px ${fac.coordinates.y}px`, animationDuration: '8s' }}
                      />
                    )}

                    {/* Facility Bubble */}
                    <circle
                      cx={fac.coordinates.x}
                      cy={fac.coordinates.y}
                      r={18}
                      fill="#FFFFFF"
                      stroke={colorHex}
                      strokeWidth="2.5"
                      className="shadow-sm"
                    />

                    {/* Inner Pin Icon */}
                    <circle
                      cx={fac.coordinates.x}
                      cy={fac.coordinates.y}
                      r="6"
                      fill={colorHex}
                    />

                    {/* Label */}
                    <text
                      x={fac.coordinates.x}
                      y={fac.coordinates.y + 30}
                      textAnchor="middle"
                      className="font-bold text-[11px] fill-zinc-900"
                      style={{ textShadow: '0 1px 2px white' }}
                    >
                      {fac.code}
                    </text>

                    <text
                      x={fac.coordinates.x}
                      y={fac.coordinates.y + 42}
                      textAnchor="middle"
                      className="font-mono text-[9px] fill-zinc-600 font-semibold"
                    >
                      {fac.unitsCount}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Selected Facility Interactive Summary Strip */}
          <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl bg-white border flex items-center justify-center shrink-0 shadow-2xs ${
                activeSelectedFacility.id === 'alm-rtm-mp' ? 'border-theme-primary text-theme-primary' :
                activeSelectedFacility.id === 'alm-rtm-pt' ? 'border-emerald-500 text-emerald-600' :
                'border-blue-500 text-blue-600'
              }`}>
                <Factory className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <strong className="text-zinc-950 font-bold">{activeSelectedFacility.name}</strong>
                  <span className="text-[10px] text-zinc-500">({activeSelectedFacility.type})</span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-zinc-600 font-mono pt-0.5 flex-wrap">
                  <span><strong>{activeSelectedFacility.rawStock}</strong></span>
                  <span>&bull; <strong>{activeSelectedFacility.pendingInbound}</strong> recepciones / entradas</span>
                  <span>&bull; <strong>{activeSelectedFacility.activeRoutes}</strong> rutas de embarque</span>
                  {activeSelectedFacility.openIncidents > 0 && (
                    <span className="text-rose-700 font-bold">&bull; {activeSelectedFacility.openIncidents} discrepancia activa</span>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate(activeSelectedFacility.id === 'alm-rtm-pt' ? 'logistica' : 'inventario')}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-xs border border-zinc-300 shadow-2xs shrink-0 cursor-pointer"
            >
              Abrir área
            </button>
          </div>
        </div>

        {/* Derecha: Requiere tu atención (4 cols) */}
        <div className="lg:col-span-4 p-5 rounded-3xl bg-white border border-zinc-200 shadow-2xs space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
            <div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <h3 className="font-black text-zinc-950 text-sm">
                  Requiere tu atención
                </h3>
              </div>
              <p className="text-[11px] text-zinc-500">
                Casos operativos prioritarios en almacenes y líneas.
              </p>
            </div>

            <span className="px-2 py-0.5 rounded-full bg-white border border-rose-500 text-rose-700 font-bold font-mono text-[10px] shadow-2xs">
              6 alertas
            </span>
          </div>

          {/* Attention Stack (6 real industrial cases) */}
          <div className="space-y-2.5 overflow-y-auto max-h-[380px] pr-1">
            {attentionItems.map((it) => (
              <div
                key={it.id}
                className="p-3 rounded-2xl bg-white border border-zinc-200 hover:border-zinc-300 shadow-2xs space-y-1 text-xs transition-shadow"
              >
                <div className="flex items-center justify-between gap-1">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border shadow-2xs bg-white ${it.tagColor}`}>
                    {it.tag}
                  </span>
                  <span className="font-mono text-[10px] font-bold text-zinc-700">
                    {it.reference}
                  </span>
                </div>

                <div className="text-[11px] text-zinc-600 font-medium">
                  {it.facility}
                </div>

                <p className="text-[11px] text-zinc-500 leading-snug">
                  {it.description}
                </p>

                <div className="pt-1 text-right">
                  <button
                    type="button"
                    onClick={() => onNavigate(it.targetTab)}
                    className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-[10px] transition-colors shadow-2xs cursor-pointer inline-flex items-center gap-1"
                  >
                    <span>{it.actionLabel}</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-zinc-100 text-[11px] text-zinc-500 flex items-center justify-between">
            <span>Resolución en módulo operativo</span>
            <button
              type="button"
              onClick={() => onNavigate('mesa-verificacion')}
              className="text-theme-primary font-bold hover:underline"
            >
              Operaciones de almacén &rarr;
            </button>
          </div>
        </div>

      </div>

      {/* 5. OPERACIÓN DE HOY (PIPELINE INDUSTRIAL HORIZONTAL) */}
      <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-2">
          <div>
            <h3 className="font-black text-zinc-950 text-sm">
              Operación industrial de hoy
            </h3>
            <p className="text-[11px] text-zinc-500">
              Pipeline de avance físico de materiales desde recepción en andén hasta embarque de producto terminado.
            </p>
          </div>

          <span className="text-xs text-zinc-500 font-mono">
            Actualización en vivo de andenes y prensas
          </span>
        </div>

        {/* 6 Stage Pipeline */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          
          <div
            onClick={() => onNavigate('mesa-verificacion')}
            className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 hover:border-zinc-300 transition-all cursor-pointer group space-y-1"
          >
            <span className="text-[10px] font-bold uppercase text-zinc-500 block">1. Recepción MP</span>
            <div className="text-2xl font-black font-mono text-blue-700">3</div>
            <span className="text-[10px] text-zinc-500 block">35,000 u. en andén</span>
          </div>

          <div
            onClick={() => onNavigate('mesa-verificacion')}
            className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 hover:border-zinc-300 transition-all cursor-pointer group space-y-1"
          >
            <span className="text-[10px] font-bold uppercase text-zinc-500 block">2. Acomodo MP</span>
            <div className="text-2xl font-black font-mono text-zinc-950">6</div>
            <span className="text-[10px] text-zinc-500 block">Tarimas / bobinas</span>
          </div>

          <div
            onClick={() => onNavigate('mesa-verificacion')}
            className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 hover:border-zinc-300 transition-all cursor-pointer group space-y-1"
          >
            <span className="text-[10px] font-bold uppercase text-zinc-500 block">3. Surtido Interno</span>
            <div className="text-2xl font-black font-mono text-purple-700">4</div>
            <span className="text-[10px] text-zinc-500 block">Bobinas y pliegos</span>
          </div>

          <div
            onClick={() => onNavigate('mesa-verificacion')}
            className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 hover:border-zinc-300 transition-all cursor-pointer group space-y-1"
          >
            <span className="text-[10px] font-bold uppercase text-zinc-500 block">4. Control QA</span>
            <div className="text-2xl font-black font-mono text-zinc-950">5</div>
            <span className="text-[10px] text-zinc-500 block">Inspecciones</span>
          </div>

          <div
            onClick={() => onNavigate('logistica')}
            className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 hover:border-zinc-300 transition-all cursor-pointer group space-y-1"
          >
            <span className="text-[10px] font-bold uppercase text-zinc-500 block">5. Staging EMB-01</span>
            <div className="text-2xl font-black font-mono text-emerald-700">4</div>
            <span className="text-[10px] text-zinc-500 block">Órdenes preparadas</span>
          </div>

          <div
            onClick={() => onNavigate('logistica')}
            className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 hover:border-zinc-300 transition-all cursor-pointer group space-y-1"
          >
            <span className="text-[10px] font-bold uppercase text-zinc-500 block">6. Entregadas</span>
            <div className="text-2xl font-black font-mono text-zinc-950">18</div>
            <span className="text-[10px] text-zinc-500 block">Remisiones con acuse</span>
          </div>

        </div>
      </div>

      {/* 6. INVENTARIO QUE REQUIERE ATENCIÓN & ANTIGÜEDAD (2 COLS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Inventario que requiere atención (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-3xl bg-white border border-zinc-200 shadow-2xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
              <div>
                <h3 className="font-black text-zinc-950 text-sm">
                  Sustratos & Materiales que requieren atención
                </h3>
                <p className="text-[11px] text-zinc-500">
                  Lotes con discrepancia de conteo, cuarentena de calidad o stock de seguridad comprometido.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('inventario')}
                className="text-theme-primary font-bold text-xs hover:underline cursor-pointer"
              >
                Ver inventario &rarr;
              </button>
            </div>

            {/* Articles List */}
            <div className="space-y-2.5 pt-3">
              <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <strong className="text-zinc-950 font-bold block">Papel Couché 90g Brillante 70x100 cm</strong>
                  <span className="text-[11px] text-rose-700 font-semibold block">
                    Pasillo A-B-03 · Discrepancia física de -19,500 pliegos (Auditoría activa)
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => onNavigate('inventario')}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-zinc-100 text-zinc-800 font-bold text-[10px] border border-zinc-300 shadow-2xs"
                  >
                    Ver lote
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('inventario')}
                    className="px-2.5 py-1 rounded-lg bg-theme-primary hover:bg-theme-primary-hover text-white font-bold text-[10px] shadow-2xs"
                  >
                    Ajustar conteo
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <strong className="text-zinc-950 font-bold block">BOPP Blanco 50 micras Bobina 330mm</strong>
                  <span className="text-[11px] text-amber-700 font-semibold block">
                    LOT-BOPP-2026-03 · 3,200 m retenidos en Cuarentena QA (Calibre fuera de norma)
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => onNavigate('inventario')}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-zinc-100 text-zinc-800 font-bold text-[10px] border border-zinc-300 shadow-2xs"
                  >
                    Ver reporte QA
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <strong className="text-zinc-950 font-bold block">Papel Térmico Autoadherible 80g</strong>
                  <span className="text-[11px] text-zinc-600 block">
                    4 bobinas disponibles &bull; <span className="text-amber-700 font-semibold">Cobertura baja (3.5 días de flexo)</span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => onNavigate('inventario')}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-zinc-100 text-zinc-800 font-bold text-[10px] border border-zinc-300 shadow-2xs"
                  >
                    Ver existencias
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-zinc-500 pt-2 border-t border-zinc-100">
            Cálculo de consumo y reorden industrial basado en programas de órdenes de producción.
          </div>
        </div>

        {/* Antigüedad de inventario (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-3xl bg-white border border-zinc-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
              <div>
                <h3 className="font-black text-zinc-950 text-sm">
                  Antigüedad & Rotación de Sustratos
                </h3>
                <p className="text-[11px] text-zinc-500">
                  Control de estancia FIFO para bobinas, tintas y cartones caple.
                </p>
              </div>
              <Clock className="w-4 h-4 text-zinc-400" />
            </div>

            {/* Aging Bracket Histogram Bars */}
            <div className="space-y-2.5 pt-3 text-xs">
              <div>
                <div className="flex justify-between font-semibold text-zinc-800 mb-1">
                  <span>0–30 días (Rotación activa)</span>
                  <span className="font-mono font-bold">118,500 u. (75 %)</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-zinc-100 overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: '75%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-zinc-800 mb-1">
                  <span>31–60 días (Stock regular)</span>
                  <span className="font-mono font-bold">24,800 u. (16 %)</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-zinc-100 overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '16%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-zinc-800 mb-1">
                  <span>61–90 días (Baja rotación)</span>
                  <span className="font-mono font-bold">9,500 u. (6 %)</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-zinc-100 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '6%' }} />
                </div>
              </div>

              {/* +90 Days Highlight */}
              <div className="p-2.5 rounded-xl border border-rose-300 bg-white">
                <div className="flex justify-between font-bold text-rose-700 mb-1">
                  <span>+90 días (Revisión de merma/lote)</span>
                  <span className="font-mono">5,600 u. (3 %)</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-zinc-100 overflow-hidden">
                  <div className="h-full bg-rose-600 rounded-full" style={{ width: '3%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs space-y-2">
            <div className="flex items-center gap-1.5 text-zinc-700 text-[11px]">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span><strong>5,600 unidades</strong> en revisión técnica de humedad y envejecimiento.</span>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('inventario')}
              className="w-full py-1.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-xs border border-zinc-300 shadow-2xs transition-colors cursor-pointer"
            >
              Ver inventario por antigüedad
            </button>
          </div>
        </div>

      </div>

      {/* 7. ABASTECIMIENTO & DESPACHOS INDUSTRIALES (2 COLS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Abastecimiento & Proveedores Industriales (6 cols) */}
        <div className="lg:col-span-6 p-5 rounded-3xl bg-white border border-zinc-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
              <div>
                <h3 className="font-black text-zinc-950 text-sm">
                  Abastecimiento & Proveedores Industriales
                </h3>
                <p className="text-[11px] text-zinc-500">
                  Llegadas programadas de bobinas, tintas flexo y cartón microcorrugado.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('mesa-verificacion')}
                className="text-theme-primary font-bold text-xs hover:underline cursor-pointer"
              >
                Ver andenes &rarr;
              </button>
            </div>

            {/* 4 Mini KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 text-center">
              <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-0.5">
                <span className="text-[9px] font-bold uppercase text-zinc-500 block">Requisiciones</span>
                <strong className="text-lg font-black font-mono text-zinc-950 block">4</strong>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-0.5">
                <span className="text-[9px] font-bold uppercase text-zinc-500 block">En tránsito</span>
                <strong className="text-lg font-black font-mono text-blue-700 block">3</strong>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-0.5">
                <span className="text-[9px] font-bold uppercase text-zinc-500 block">En andén</span>
                <strong className="text-lg font-black font-mono text-purple-700 block">2</strong>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-50 border border-rose-300 space-y-0.5">
                <span className="text-[9px] font-bold uppercase text-rose-700 block">Discrepancias</span>
                <strong className="text-lg font-black font-mono text-rose-700 block">1</strong>
              </div>
            </div>

            {/* Próximas Recepciones */}
            <div className="space-y-2 pt-3">
              <span className="text-[10px] font-bold uppercase text-zinc-500 block">
                Próximas descargas en andén
              </span>

              <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs flex items-center justify-between">
                <div>
                  <strong className="text-zinc-900 font-mono">OC-2026-0081 &bull; Bio-Pappel</strong>
                  <span className="text-[11px] text-zinc-500 block">Papel Couché 90g (14 tarimas) &bull; Hoy &bull; Andén 01 Nave 1</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white text-emerald-800 border border-emerald-400">
                  En descarga
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs flex items-center justify-between">
                <div>
                  <strong className="text-zinc-900 font-mono">OC-2026-0082 &bull; Sun Chemical México</strong>
                  <span className="text-[11px] text-zinc-500 block">Tintas Flexo y Barniz UV (16 cubetas) &bull; Mañana &bull; Andén 02</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white text-blue-800 border border-blue-400">
                  Programada
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs flex items-center justify-between">
            <span className="text-zinc-600 text-[11px]">
              Inspección obligatoria de calibre y humedad en toda descarga
            </span>
            <button
              type="button"
              onClick={() => onNavigate('mesa-verificacion')}
              className="px-2.5 py-1 rounded-lg bg-theme-primary hover:bg-theme-primary-hover text-white font-bold text-[10px] shadow-2xs cursor-pointer"
            >
              Ir a recepción
            </button>
          </div>
        </div>

        {/* Despachos & Clientes Industriales (6 cols) */}
        <div className="lg:col-span-6 p-5 rounded-3xl bg-white border border-zinc-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
              <div>
                <h3 className="font-black text-zinc-950 text-sm">
                  Despachos B2B a Clientes Industriales
                </h3>
                <p className="text-[11px] text-zinc-500">
                  Volumen y pedidos terminados para maquilas y farmacéuticas ({selectedPeriod}).
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('logistica')}
                className="text-theme-primary font-bold text-xs hover:underline cursor-pointer"
              >
                Ver remisiones &rarr;
              </button>
            </div>

            {/* Volume Header */}
            <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-between mt-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-zinc-500 block">Valor despachado hoy</span>
                <strong className="text-xl font-black font-mono text-zinc-950 block">$485,200 MXN</strong>
              </div>
              <div className="text-right text-xs font-mono text-zinc-600 space-y-0.5">
                <span className="block font-bold text-zinc-900">6 remisiones &bull; 12,800 unidades</span>
                <span className="text-[11px] text-emerald-700 font-semibold block">100% acuses firmados en tiempo</span>
              </div>
            </div>

            {/* Top Solicitados */}
            <div className="space-y-2 pt-3">
              <span className="text-[10px] font-bold uppercase text-zinc-500 block">
                Principales entregas del día
              </span>

              <div className="space-y-1.5 text-xs">
                <div className="p-2 rounded-xl bg-white border border-zinc-200 flex items-center justify-between">
                  <span className="font-medium text-zinc-900">1. Medifarma — Etiquetas Autoadheribles 50x25mm</span>
                  <strong className="font-mono text-zinc-800">450 millares</strong>
                </div>

                <div className="p-2 rounded-xl bg-white border border-zinc-200 flex items-center justify-between">
                  <span className="font-medium text-zinc-900">2. Delphi Technologies — Cajas C5 Microcorrugado</span>
                  <strong className="font-mono text-zinc-800">8,200 piezas</strong>
                </div>

                <div className="p-2 rounded-xl bg-white border border-zinc-200 flex items-center justify-between">
                  <span className="font-medium text-zinc-900">3. Empacadora del Golfo — Folleto Farmacéutico 6 Páneles</span>
                  <strong className="font-mono text-zinc-800">32,000 piezas</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs flex items-center justify-between">
            <span className="text-zinc-600 text-[11px]">
              Entregas con trazabilidad por lote y acuse digital de recibo
            </span>
            <button
              type="button"
              onClick={() => onNavigate('logistica')}
              className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-[10px] shadow-2xs cursor-pointer"
            >
              Ver monitor de entregas
            </button>
          </div>
        </div>

      </div>

      {/* 8. EMBARQUES & ENTREGAS (MINI RESUMEN & PRÓXIMAS ENTREGAS) */}
      <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-2">
          <div>
            <h3 className="font-black text-zinc-950 text-sm">
              Producto Terminado & Embarques
            </h3>
            <p className="text-[11px] text-zinc-500">
              Operación de despacho B2B, asignación de transporte industrial y confirmación de entrega en planta cliente.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('logistica')}
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-zinc-50 text-theme-primary font-bold text-xs border border-theme-primary/40 shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <span>Abrir Producto Terminado & Embarques</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Summary Mini Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-center space-y-0.5">
            <span className="text-[10px] font-bold uppercase text-zinc-500 block">Listas para carga</span>
            <strong className="text-2xl font-black font-mono text-zinc-950 block">4 remisiones</strong>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-center space-y-0.5">
            <span className="text-[10px] font-bold uppercase text-zinc-500 block">Despachos en proceso</span>
            <strong className="text-2xl font-black font-mono text-emerald-700 block">4 órdenes</strong>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-center space-y-0.5">
            <span className="text-[10px] font-bold uppercase text-zinc-500 block">Entregas completadas</span>
            <strong className="text-2xl font-black font-mono text-blue-700 block">18 / 22</strong>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-center space-y-0.5">
            <span className="text-[10px] font-bold uppercase text-zinc-500 block">Acuses pendientes</span>
            <strong className="text-2xl font-black font-mono text-amber-600 block">1</strong>
          </div>
        </div>

        {/* Próximas entregas table */}
        <div className="overflow-x-auto pt-1">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-[10px] font-bold uppercase text-zinc-500">
                <th className="py-2 px-3">Hora</th>
                <th className="py-2 px-3">Cliente / Planta Destino</th>
                <th className="py-2 px-3">Orden de Salida / Andén</th>
                <th className="py-2 px-3 text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 text-[11px] font-sans">
              <tr>
                <td className="py-2.5 px-3 font-mono font-bold text-zinc-900">14:45</td>
                <td className="py-2.5 px-3 font-medium text-zinc-900">Medifarma Planta Reynosa (Parque Ind. Villa Florida)</td>
                <td className="py-2.5 px-3 font-mono text-zinc-700">OS-2026-0014 · Andén EMB-01</td>
                <td className="py-2.5 px-3 text-right">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white border border-blue-500 text-blue-800">
                    En descarga
                  </span>
                </td>
              </tr>

              <tr>
                <td className="py-2.5 px-3 font-mono font-bold text-zinc-900">15:15</td>
                <td className="py-2.5 px-3 font-medium text-zinc-900">Delphi Technologies Reynosa (Parque del Norte)</td>
                <td className="py-2.5 px-3 font-mono text-zinc-700">OS-2026-0015 · Andén EMB-02</td>
                <td className="py-2.5 px-3 text-right">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white border border-emerald-500 text-emerald-800">
                    En tiempo
                  </span>
                </td>
              </tr>

              <tr>
                <td className="py-2.5 px-3 font-mono font-bold text-zinc-900">15:40</td>
                <td className="py-2.5 px-3 font-medium text-zinc-900">Empacadora del Golfo (Matamoros)</td>
                <td className="py-2.5 px-3 font-mono text-zinc-700">OS-2026-0016 · Andén EMB-01</td>
                <td className="py-2.5 px-3 text-right">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white border border-amber-500 text-amber-800">
                    Retraso estimado: 25 min
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 9. RED OPERATIVA (2 CARDS DETALLADAS) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-black text-zinc-950 text-sm">
              Áreas Operativas de Planta
            </h3>
            <p className="text-[11px] text-zinc-500">
              Estado en tiempo real de naves de almacenamiento de materias primas y producto terminado.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('inventario')}
            className="text-theme-primary font-bold text-xs hover:underline cursor-pointer"
          >
            Ver áreas de almacén &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {facilities.map((fac) => (
            <div
              key={fac.id}
              onClick={() => onNavigate(fac.id === 'alm-rtm-pt' ? 'logistica' : 'inventario')}
              className="p-4 rounded-3xl bg-white border border-zinc-200 hover:border-zinc-300 hover:shadow-xs transition-all cursor-pointer group space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border shadow-2xs bg-white ${
                  fac.id === 'alm-rtm-mp' ? 'border-theme-primary text-theme-primary' :
                  'border-emerald-500 text-emerald-800'
                }`}>
                  {fac.code}
                </span>
                <span className="font-mono text-xs font-black text-zinc-950">{fac.unitsCount}</span>
              </div>

              <div>
                <strong className="text-xs font-bold text-zinc-900 block truncate">{fac.name}</strong>
                <p className="text-[10px] text-zinc-500 truncate">{fac.address}</p>
              </div>

              <div className="space-y-1 text-[11px] text-zinc-600 border-t border-zinc-100 pt-2 font-mono">
                <div className="flex justify-between">
                  <span className="font-sans">Entradas / Recepciones:</span>
                  <strong>{fac.pendingInbound}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="font-sans">Despachos / Salidas:</span>
                  <strong>{fac.activeRoutes}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="font-sans">Discrepancias:</span>
                  <strong className={fac.openIncidents > 0 ? 'text-rose-600' : 'text-zinc-500'}>
                    {fac.openIncidents}
                  </strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 10. ACTIVIDAD RECIENTE (TIMELINE DE 20 EVENTOS INDUSTRIALES) */}
      <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
          <div>
            <h3 className="font-black text-zinc-950 text-sm">
              Bitácora de Actividad en Planta
            </h3>
            <p className="text-[11px] text-zinc-500">
              Registro cronológico de movimientos de materia prima, surtido a prensas, inspección QA y embarque B2B.
            </p>
          </div>

          <span className="px-2.5 py-0.5 rounded-full bg-white border border-zinc-300 font-mono text-[10px] font-bold text-zinc-700 shadow-2xs">
            {recentEvents.length} eventos registrados hoy
          </span>
        </div>

        {/* Stepper Timeline List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 pt-1">
          {recentEvents.map((ev, idx) => {
            const Icon = ev.icon;

            return (
              <div key={idx} className="flex items-start gap-3 text-xs p-2 rounded-xl hover:bg-zinc-50/80 transition-colors">
                <span className="font-mono text-[10px] font-bold text-zinc-500 shrink-0 w-10 pt-0.5">
                  {ev.time}
                </span>

                <div className="w-6 h-6 rounded-lg bg-white border border-zinc-200 flex items-center justify-center shrink-0 shadow-2xs">
                  <Icon className={`w-3.5 h-3.5 ${ev.iconColor}`} />
                </div>

                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="flex items-center justify-between gap-1">
                    <strong className="text-zinc-900 font-bold text-[11px] truncate">{ev.title}</strong>
                  </div>
                  <p className="text-[10px] text-zinc-600 truncate font-mono">{ev.ref}</p>
                  <span className="text-[9px] text-zinc-400 block truncate">{ev.user}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
