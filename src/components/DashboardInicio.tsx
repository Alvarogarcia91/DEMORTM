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
  Users, 
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
  User, 
  AlertCircle, 
  Activity, 
  Plus, 
  ArrowUpRight, 
  Search, 
  ShieldCheck, 
  Eye, 
  Info,
  DollarSign
} from 'lucide-react';
import { NavItemKey } from './Sidebar';

interface DashboardInicioProps {
  onNavigate: (tab: NavItemKey) => void;
}

export const DashboardInicio: React.FC<DashboardInicioProps> = ({ onNavigate }) => {
  const [selectedFacility, setSelectedFacility] = useState<string>('ALL');
  const [selectedPeriod, setSelectedPeriod] = useState<'Hoy' | '7 días' | '30 días'>('Hoy');
  const [selectedMapFacility, setSelectedMapFacility] = useState<string | null>('wh-mty-norte');

  // Facilities data for interactive map and operational network
  const facilities = [
    {
      id: 'wh-mty-norte',
      code: 'CEDIS Norte',
      name: 'CEDIS Monterrey Norte',
      type: 'Centro de Distribución Principal',
      address: 'Av. Manuel L. Barragán 4850, San Nicolás, N.L.',
      coordinates: { x: 250, y: 80, lat: 25.7482, lng: -100.3120 },
      unitsCount: 742,
      displayUnits: 0,
      pendingInbound: 5,
      activeRoutes: 4,
      pendingOrders: 11,
      openIncidents: 1,
      accentColor: 'border-rose-500',
    },
    {
      id: 'wh-mty-sur',
      code: 'CEDIS Sur',
      name: 'CEDIS Monterrey Sur',
      type: 'Centro de Distribución Satélite',
      address: 'Av. Eugenio Garza Sada 3820, Monterrey, N.L.',
      coordinates: { x: 550, y: 400, lat: 25.6210, lng: -100.2830 },
      unitsCount: 360,
      displayUnits: 0,
      pendingInbound: 3,
      activeRoutes: 3,
      pendingOrders: 7,
      openIncidents: 1,
      accentColor: 'border-rose-500',
    },
    {
      id: 'suc-valle-oriente',
      code: 'Sucursal VO',
      name: 'Sucursal Valle Oriente',
      type: 'Showroom & Punto de Venta',
      address: 'Av. Lázaro Cárdenas 2400, San Pedro Garza García, N.L.',
      coordinates: { x: 440, y: 280, lat: 25.6480, lng: -100.3270 },
      unitsCount: 182,
      displayUnits: 6,
      pendingInbound: 14, // 14 u. en traspaso
      activeRoutes: 1,
      pendingOrders: 5,
      openIncidents: 1,
      accentColor: 'border-purple-500',
    },
    {
      id: 'suc-cumbres',
      code: 'Sucursal Cumbres',
      name: 'Sucursal Cumbres',
      type: 'Showroom & Punto de Venta',
      address: 'Av. Paseo de los Leones 1200, Monterrey, N.L.',
      coordinates: { x: 160, y: 200, lat: 25.7145, lng: -100.3872 },
      unitsCount: 146,
      displayUnits: 4,
      pendingInbound: 9, // 9 u. en traspaso
      activeRoutes: 1,
      pendingOrders: 4,
      openIncidents: 0,
      accentColor: 'border-purple-500',
    },
  ];

  const activeSelectedFacility = facilities.find((f) => f.id === selectedMapFacility) || facilities[0];

  // Requiere tu atención list (6 items)
  const attentionItems = [
    {
      id: 'att-1',
      tag: 'UID no localizada',
      tagColor: 'border-rose-500 text-rose-700',
      reference: 'SC-UID-2026-000084',
      facility: 'CEDIS Monterrey Norte',
      description: 'Diferencia de 1 bulto reportada durante la carga en andén 2.',
      actionLabel: 'Revisar',
      targetTab: 'mesa-verificacion' as NavItemKey,
    },
    {
      id: 'att-2',
      tag: 'Entrega parcial',
      tagColor: 'border-amber-500 text-amber-700',
      reference: 'REM-2026-0068',
      facility: 'San Pedro Garza García',
      description: 'Cliente recibió 3 de 4 colchones. Faltante pendiente de reprogramar.',
      actionLabel: 'Revisar',
      targetTab: 'logistica' as NavItemKey,
    },
    {
      id: 'att-3',
      tag: 'Cobertura insuficiente',
      tagColor: 'border-rose-500 text-rose-700',
      reference: 'Spring Air Recovery Mat.',
      facility: 'CEDIS Monterrey Norte',
      description: '7 unidades disponibles (cobertura estimada: 2.1 días). Reorden urgente.',
      actionLabel: 'Crear requisición',
      targetTab: 'requisiciones' as NavItemKey,
    },
    {
      id: 'att-4',
      tag: 'Orden atrasada',
      tagColor: 'border-amber-500 text-amber-700',
      reference: 'OC-2026-0038',
      facility: 'Restonic México',
      description: '2 días de retraso respecto a la fecha comprometida de entrega en andén.',
      actionLabel: 'Ver orden',
      targetTab: 'compras' as NavItemKey,
    },
    {
      id: 'att-5',
      tag: 'Pedido por autorizar',
      tagColor: 'border-blue-500 text-blue-700',
      reference: 'PED-2026-0105',
      facility: 'Desarrollos Residenciales',
      description: 'Descuento comercial de 12% sujeto a validación de gerencia.',
      actionLabel: 'Autorizar',
      targetTab: 'pedidos' as NavItemKey,
    },
    {
      id: 'att-6',
      tag: 'Incidencia de recepción',
      tagColor: 'border-rose-500 text-rose-700',
      reference: 'INC-2026-0012',
      facility: 'CEDIS Monterrey Sur',
      description: 'Empaque protector desgarrado en descarga de proveedor América.',
      actionLabel: 'Atender',
      targetTab: 'mesa-verificacion' as NavItemKey,
    },
  ];

  // Timeline of 20+ real recent platform events
  const recentEvents = [
    { time: '14:48', title: 'Entrega confirmada', ref: 'REM-2026-0061 · 4 unidades', user: 'Roberto Garza (Chofer)', icon: CheckCircle2, iconColor: 'text-emerald-600' },
    { time: '14:42', title: 'Llegada registrada GPS', ref: 'RT-2026-0031 · Parada 1', user: 'Roberto Garza', icon: MapPin, iconColor: 'text-blue-600' },
    { time: '14:20', title: 'Ruta iniciada en tránsito', ref: 'RT-2026-0031 · Camión #08', user: 'Roberto Garza', icon: Truck, iconColor: 'text-rose-600' },
    { time: '14:05', title: 'Carga secuenciada confirmada', ref: 'OS-2026-0048 · 14 unidades', user: 'Patio CEDIS Norte', icon: Layers, iconColor: 'text-purple-600' },
    { time: '13:45', title: 'Verificación de salida 100%', ref: 'OS-2026-0048 · Remisión emitida', user: 'Valeria Torres (Mesa 02)', icon: PackageCheck, iconColor: 'text-emerald-600' },
    { time: '13:20', title: 'Recolección completada', ref: 'OR-2026-0088 · 14 unidades', user: 'Juan Pablo Rangel', icon: Scan, iconColor: 'text-blue-600' },
    { time: '12:55', title: 'Traspaso entregado en andén', ref: 'REM-TR-2026-0019 · Suc. Valle Oriente', user: 'Carlos Medina', icon: Building2, iconColor: 'text-purple-600' },
    { time: '12:30', title: 'Pedido autorizado', ref: 'PED-2026-0103 · $92,400 MXN', user: 'Claudia Morales', icon: ShoppingCart, iconColor: 'text-zinc-900' },
    { time: '12:15', title: 'Acomodo completado', ref: 'OA-2026-0056 · Posición R02-B04', user: 'Héctor Garza', icon: Boxes, iconColor: 'text-blue-600' },
    { time: '11:50', title: 'Recepción validada 100%', ref: 'OC-2026-0041 · Nayt México (24 u.)', user: 'Brenda Cavazos (Mesa 01)', icon: CheckCircle2, iconColor: 'text-emerald-600' },
    { time: '11:25', title: 'Recepción en sucursal validada', ref: 'ENT-2026-0021 · 8 u. en stock disponible', user: 'Jorge Villarreal (MdeV Cumbres)', icon: ShieldCheck, iconColor: 'text-emerald-600' },
    { time: '11:00', title: 'Ruta iniciada en tránsito', ref: 'RT-2026-0036 · Unidad #15', user: 'Javier Salinas', icon: Truck, iconColor: 'text-rose-600' },
    { time: '10:42', title: 'Entrega completada', ref: 'REM-2026-0060 · 6 unidades', user: 'Javier Salinas', icon: CheckCircle2, iconColor: 'text-emerald-600' },
    { time: '10:15', title: 'Incidencia reportada en andén', ref: 'INC-2026-0012 · Empaque desgarrado', user: 'Mateo Sandoval', icon: AlertTriangle, iconColor: 'text-rose-600' },
    { time: '09:50', title: 'Requisición generada', ref: 'REQ-2026-0034 · Sealy Posturepedic', user: 'Sugerencia de Reorden Automática', icon: ClipboardList, iconColor: 'text-blue-600' },
    { time: '09:30', title: 'Cotización convertida en pedido', ref: 'COT-2026-0088 → PED-2026-0103', user: 'Claudia Morales', icon: FileText, iconColor: 'text-zinc-700' },
    { time: '09:05', title: 'Entrada iniciada en andén 1', ref: 'REC-2026-0044 · Spring Air (18 u.)', user: 'Valeria Torres', icon: Scan, iconColor: 'text-blue-600' },
    { time: '08:45', title: 'Salida de ruta despachada', ref: 'RT-2026-0030 · Sucursal Cumbres', user: 'Raúl Morales', icon: Truck, iconColor: 'text-rose-600' },
    { time: '08:15', title: 'Orden de traspaso autorizada', ref: 'OTP-2026-0044 · 14 colchones', user: 'Planeación de Inventarios', icon: Boxes, iconColor: 'text-purple-600' },
    { time: '07:50', title: 'Apertura de turno operativo', ref: 'Mesa 01 & Mesa 02 activas', user: 'Supervisión CEDIS Norte', icon: ShieldCheck, iconColor: 'text-emerald-600' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. HEADER EJECUTIVO & CONTROLES */}
      <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-2xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white text-zinc-900 border border-rose-500 shadow-2xs">
                IMPRESOS RTM
              </span>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white border border-emerald-500 text-[10px] font-bold text-emerald-800 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Operación estable</span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950">
              Centro de Operación
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500">
              Visión consolidada de inventario, abastecimiento, ventas y entregas.
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
                className="px-3 py-1.5 rounded-xl border border-zinc-300 bg-white text-xs font-semibold text-zinc-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="ALL">Todas las instalaciones</option>
                <option value="CEDIS Monterrey Norte">CEDIS Monterrey Norte</option>
                <option value="CEDIS Monterrey Sur">CEDIS Monterrey Sur</option>
                <option value="Sucursal Valle Oriente">Sucursal Valle Oriente</option>
                <option value="Sucursal Cumbres">Sucursal Cumbres</option>
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
            Accesos directos:
          </span>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => onNavigate('requisiciones')}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-zinc-50 text-zinc-900 font-bold text-xs border border-zinc-300 shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-blue-600" />
              <span>Nueva requisición</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('cotizaciones')}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-zinc-50 text-zinc-900 font-bold text-xs border border-zinc-300 shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-zinc-700" />
              <span>Nueva cotización</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('inventario')}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-zinc-50 text-zinc-900 font-bold text-xs border border-zinc-300 shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-purple-600" />
              <span>Nuevo traspaso</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('mesa-verificacion')}
              className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Scan className="w-3.5 h-3.5" />
              <span>Ir a Mesa de Verificación</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. KPIS PRINCIPALES (5 CARDS CLICKEABLES) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        
        {/* Inventario */}
        <div
          onClick={() => onNavigate('inventario')}
          className="p-4 rounded-3xl bg-white border border-zinc-200 hover:border-zinc-300 hover:shadow-xs transition-all cursor-pointer group space-y-1"
        >
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            <span>Inventario total</span>
            <Boxes className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
          </div>
          <div className="text-2xl font-black font-mono text-zinc-950">
            1,284
          </div>
          <div className="flex items-center justify-between text-[11px] text-amber-700 font-semibold pt-0.5">
            <span>47 requieren atención</span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Por recibir */}
        <div
          onClick={() => onNavigate('mesa-verificacion')}
          className="p-4 rounded-3xl bg-white border border-zinc-200 hover:border-zinc-300 hover:shadow-xs transition-all cursor-pointer group space-y-1"
        >
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            <span>Por recibir</span>
            <Scan className="w-3.5 h-3.5 text-zinc-400 group-hover:text-blue-600 transition-colors" />
          </div>
          <div className="text-2xl font-black font-mono text-blue-700">
            126
          </div>
          <div className="flex items-center justify-between text-[11px] text-zinc-600 pt-0.5">
            <span>8 entradas programadas</span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Por surtir */}
        <div
          onClick={() => onNavigate('mesa-verificacion')}
          className="p-4 rounded-3xl bg-white border border-zinc-200 hover:border-zinc-300 hover:shadow-xs transition-all cursor-pointer group space-y-1"
        >
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            <span>Por surtir</span>
            <PackageCheck className="w-3.5 h-3.5 text-zinc-400 group-hover:text-purple-600 transition-colors" />
          </div>
          <div className="text-2xl font-black font-mono text-purple-700">
            93
          </div>
          <div className="flex items-center justify-between text-[11px] text-zinc-600 pt-0.5">
            <span>11 órdenes de recolección</span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* En ruta */}
        <div
          onClick={() => onNavigate('logistica')}
          className="p-4 rounded-3xl bg-white border border-zinc-200 hover:border-zinc-300 hover:shadow-xs transition-all cursor-pointer group space-y-1"
        >
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            <span>En ruta</span>
            <Truck className="w-3.5 h-3.5 text-zinc-400 group-hover:text-emerald-600 transition-colors" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-700">
            7
          </div>
          <div className="flex items-center justify-between text-[11px] text-zinc-600 pt-0.5">
            <span>19 paradas pendientes</span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Ventas de hoy */}
        <div
          onClick={() => onNavigate('pedidos')}
          className="p-4 rounded-3xl bg-white border border-zinc-200 hover:border-zinc-300 hover:shadow-xs transition-all cursor-pointer group space-y-1"
        >
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            <span>Ventas de hoy</span>
            <TrendingUp className="w-3.5 h-3.5 text-zinc-400 group-hover:text-rose-600 transition-colors" />
          </div>
          <div className="text-xl sm:text-2xl font-black font-mono text-zinc-950 truncate">
            $307,330 MXN
          </div>
          <div className="flex items-center justify-between text-[11px] text-zinc-600 pt-0.5">
            <span>18 pedidos confirmados</span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

      </div>

      {/* 4. OPERACIÓN EN VIVO (2/3 MAPA + 1/3 ATENCIÓN) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Izquierda: Mapa Operativo de la Red (8 cols) */}
        <div className="lg:col-span-8 p-5 rounded-3xl bg-white border border-zinc-200 shadow-2xs space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
            <div>
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-rose-600" />
                <h3 className="font-black text-zinc-950 text-sm">
                  Operación en vivo
                </h3>
              </div>
              <p className="text-[11px] text-zinc-500">
                Red metropolitana: 2 CEDIS, 2 sucursales, 7 rutas activas y despachos programados.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('logistica')}
              className="text-rose-600 font-bold text-xs hover:underline cursor-pointer"
            >
              Ver rutas en curso &rarr;
            </button>
          </div>

          {/* Cartographic SVG Network Map */}
          <div className="relative rounded-2xl border border-zinc-200 bg-zinc-50 overflow-hidden h-[340px] flex items-center justify-center">
            <svg viewBox="0 0 700 450" className="w-full h-full">
              {/* Background Grid Lines */}
              <defs>
                <pattern id="grid-net" width="35" height="35" patternUnits="userSpaceOnUse">
                  <path d="M 35 0 L 0 0 0 35" fill="none" stroke="#E4E4E7" strokeWidth="0.6" strokeDasharray="2,2" />
                </pattern>
              </defs>
              <rect width="700" height="450" fill="url(#grid-net)" />

              {/* Transit Corridor Arteries */}
              <path d="M 250 80 Q 350 180 440 280" fill="none" stroke="#CBD5E1" strokeWidth="3" strokeDasharray="4,4" />
              <path d="M 250 80 Q 200 140 160 200" fill="none" stroke="#CBD5E1" strokeWidth="3" strokeDasharray="4,4" />
              <path d="M 440 280 Q 500 340 550 400" fill="none" stroke="#CBD5E1" strokeWidth="3" strokeDasharray="4,4" />
              <path d="M 160 200 Q 300 350 550 400" fill="none" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="3,3" />

              {/* Active Route Transit Pulses */}
              <circle cx="340" cy="180" r="4" fill="#E11D48" className="animate-ping opacity-60" />
              <circle cx="340" cy="180" r="3" fill="#E11D48" />

              <circle cx="490" cy="335" r="4" fill="#256B3A" className="animate-ping opacity-60" />
              <circle cx="490" cy="335" r="3" fill="#256B3A" />

              {/* Facility Nodes */}
              {facilities.map((fac) => {
                const isSelected = selectedMapFacility === fac.id;
                const isCedis = fac.id.includes('wh-');

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
                        r="24"
                        fill="none"
                        stroke={isCedis ? '#E11D48' : '#7E22CE'}
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
                      r={isCedis ? 16 : 14}
                      fill="#FFFFFF"
                      stroke={isCedis ? '#E11D48' : '#7E22CE'}
                      strokeWidth="2.5"
                      className="shadow-sm"
                    />

                    {/* Inner Pin Icon */}
                    <circle
                      cx={fac.coordinates.x}
                      cy={fac.coordinates.y}
                      r="5"
                      fill={isCedis ? '#E11D48' : '#7E22CE'}
                    />

                    {/* Label */}
                    <text
                      x={fac.coordinates.x}
                      y={fac.coordinates.y + (isCedis ? 28 : 26)}
                      textAnchor="middle"
                      className="font-bold text-[11px] fill-zinc-900"
                      style={{ textShadow: '0 1px 2px white' }}
                    >
                      {fac.code}
                    </text>

                    <text
                      x={fac.coordinates.x}
                      y={fac.coordinates.y + (isCedis ? 39 : 37)}
                      textAnchor="middle"
                      className="font-mono text-[9px] fill-zinc-600 font-semibold"
                    >
                      {fac.unitsCount} u.
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
                activeSelectedFacility.id.includes('wh-') ? 'border-rose-500 text-rose-600' : 'border-purple-500 text-purple-600'
              }`}>
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <strong className="text-zinc-950 font-bold">{activeSelectedFacility.name}</strong>
                  <span className="text-[10px] text-zinc-500">({activeSelectedFacility.type})</span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-zinc-600 font-mono pt-0.5 flex-wrap">
                  <span><strong>{activeSelectedFacility.unitsCount}</strong> unidades</span>
                  {activeSelectedFacility.displayUnits > 0 && (
                    <span>&bull; <strong>{activeSelectedFacility.displayUnits}</strong> en exhibición</span>
                  )}
                  <span>&bull; <strong>{activeSelectedFacility.pendingInbound}</strong> por recibir</span>
                  <span>&bull; <strong>{activeSelectedFacility.pendingOrders}</strong> pedidos</span>
                  {activeSelectedFacility.openIncidents > 0 && (
                    <span className="text-rose-700 font-bold">&bull; {activeSelectedFacility.openIncidents} incidencia</span>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('inventario')}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-xs border border-zinc-300 shadow-2xs shrink-0 cursor-pointer"
            >
              Abrir instalación
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
                Casos operativos prioritarios que requieren acción.
              </p>
            </div>

            <span className="px-2 py-0.5 rounded-full bg-white border border-rose-500 text-rose-700 font-bold font-mono text-[10px] shadow-2xs">
              6 eventos
            </span>
          </div>

          {/* Attention Stack (6 real cases) */}
          <div className="space-y-2.5 overflow-y-auto max-h-[380px] pr-1">
            {attentionItems.map((it) => (
              <div
                key={it.id}
                className="p-3 rounded-2xl bg-white border border-zinc-200 hover:border-zinc-300 shadow-2xs space-y-1 text-xs transition-shadow"
              >
                <div className="flex items-center justify-between gap-1">
                  <span className={`px-2 py-0.2 rounded-full text-[9px] font-bold uppercase border shadow-2xs bg-white ${it.tagColor}`}>
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
            <span>Resolución directa en módulo origen</span>
            <button
              type="button"
              onClick={() => onNavigate('mesa-verificacion')}
              className="text-rose-600 font-bold hover:underline"
            >
              Mesa de verificación &rarr;
            </button>
          </div>
        </div>

      </div>

      {/* 5. OPERACIÓN DE HOY (PIPELINE HORIZONTAL COMPLETO) */}
      <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-2">
          <div>
            <h3 className="font-black text-zinc-950 text-sm">
              Operación de hoy
            </h3>
            <p className="text-[11px] text-zinc-500">
              Pipeline de avance físico de inventario desde recepción hasta entrega final.
            </p>
          </div>

          <span className="text-xs text-zinc-500 font-mono">
            Actualización en vivo de andenes y rutas
          </span>
        </div>

        {/* 6 Stage Pipeline */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          
          <div
            onClick={() => onNavigate('mesa-verificacion')}
            className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 hover:border-zinc-300 transition-all cursor-pointer group space-y-1"
          >
            <span className="text-[10px] font-bold uppercase text-zinc-500 block">1. Entradas</span>
            <div className="text-2xl font-black font-mono text-blue-700">8</div>
            <span className="text-[10px] text-zinc-500 block">126 unidades</span>
          </div>

          <div
            onClick={() => onNavigate('mesa-verificacion')}
            className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 hover:border-zinc-300 transition-all cursor-pointer group space-y-1"
          >
            <span className="text-[10px] font-bold uppercase text-zinc-500 block">2. Acomodo</span>
            <div className="text-2xl font-black font-mono text-zinc-950">21</div>
            <span className="text-[10px] text-zinc-500 block">64 unidades ubicadas</span>
          </div>

          <div
            onClick={() => onNavigate('mesa-verificacion')}
            className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 hover:border-zinc-300 transition-all cursor-pointer group space-y-1"
          >
            <span className="text-[10px] font-bold uppercase text-zinc-500 block">3. Recolección</span>
            <div className="text-2xl font-black font-mono text-purple-700">17</div>
            <span className="text-[10px] text-zinc-500 block">93 unidades</span>
          </div>

          <div
            onClick={() => onNavigate('mesa-verificacion')}
            className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 hover:border-zinc-300 transition-all cursor-pointer group space-y-1"
          >
            <span className="text-[10px] font-bold uppercase text-zinc-500 block">4. Verificación</span>
            <div className="text-2xl font-black font-mono text-zinc-950">12</div>
            <span className="text-[10px] text-zinc-500 block">81 u. amparadas</span>
          </div>

          <div
            onClick={() => onNavigate('logistica')}
            className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 hover:border-zinc-300 transition-all cursor-pointer group space-y-1"
          >
            <span className="text-[10px] font-bold uppercase text-zinc-500 block">5. En ruta</span>
            <div className="text-2xl font-black font-mono text-emerald-700">7</div>
            <span className="text-[10px] text-zinc-500 block">68 unidades en viaje</span>
          </div>

          <div
            onClick={() => onNavigate('logistica')}
            className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 hover:border-zinc-300 transition-all cursor-pointer group space-y-1"
          >
            <span className="text-[10px] font-bold uppercase text-zinc-500 block">6. Entregadas</span>
            <div className="text-2xl font-black font-mono text-zinc-950">18</div>
            <span className="text-[10px] text-zinc-500 block">54 unidades con firma</span>
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
                  Inventario que requiere atención
                </h3>
                <p className="text-[11px] text-zinc-500">
                  Artículos con stock bajo, cobertura insuficiente o antigüedad elevada.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('inventario')}
                className="text-rose-600 font-bold text-xs hover:underline cursor-pointer"
              >
                Ver inventario &rarr;
              </button>
            </div>

            {/* Articles List */}
            <div className="space-y-2.5 pt-3">
              <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <strong className="text-zinc-950 font-bold block">Nayt Flow Basic Individual</strong>
                  <span className="text-[11px] text-amber-700 font-semibold block">
                    18 unidades disponibles &bull; Cobertura baja (3.2 días)
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => onNavigate('articulos')}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-zinc-100 text-zinc-800 font-bold text-[10px] border border-zinc-300 shadow-2xs"
                  >
                    Ver artículo
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('requisiciones')}
                    className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] shadow-2xs"
                  >
                    Crear requisición
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <strong className="text-zinc-950 font-bold block">Spring Air Recovery Matrimonial</strong>
                  <span className="text-[11px] text-rose-700 font-semibold block">
                    7 unidades disponibles &bull; Reorden urgente (cobertura 2.1 días)
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => onNavigate('articulos')}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-zinc-100 text-zinc-800 font-bold text-[10px] border border-zinc-300 shadow-2xs"
                  >
                    Ver artículo
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('requisiciones')}
                    className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] shadow-2xs"
                  >
                    Crear requisición
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <strong className="text-zinc-950 font-bold block">Sealy Club King Size</strong>
                  <span className="text-[11px] text-zinc-600 block">
                    23 unidades &bull; <span className="text-amber-700 font-semibold">5 unidades con antigüedad +90 días</span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => onNavigate('inventario')}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-zinc-100 text-zinc-800 font-bold text-[10px] border border-zinc-300 shadow-2xs"
                  >
                    Ver inventario
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-zinc-500 pt-2 border-t border-zinc-100">
            Cálculo de cobertura en tiempo real basado en ventas de los últimos 30 días.
          </div>
        </div>

        {/* Antigüedad de inventario (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-3xl bg-white border border-zinc-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
              <div>
                <h3 className="font-black text-zinc-950 text-sm">
                  Antigüedad de inventario
                </h3>
                <p className="text-[11px] text-zinc-500">
                  Monitoreo de rotación FIFO y lotes con estancia prolongada.
                </p>
              </div>
              <Clock className="w-4 h-4 text-zinc-400" />
            </div>

            {/* Aging Bracket Histogram Bars */}
            <div className="space-y-2.5 pt-3 text-xs">
              <div>
                <div className="flex justify-between font-semibold text-zinc-800 mb-1">
                  <span>0–30 días</span>
                  <span className="font-mono font-bold">824 unidades (64 %)</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-zinc-100 overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: '64%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-zinc-800 mb-1">
                  <span>31–60 días</span>
                  <span className="font-mono font-bold">283 unidades (22 %)</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-zinc-100 overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '22%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-zinc-800 mb-1">
                  <span>61–90 días</span>
                  <span className="font-mono font-bold">109 unidades (9 %)</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-zinc-100 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '9%' }} />
                </div>
              </div>

              {/* +90 Days Highlight */}
              <div className="p-2.5 rounded-xl border border-rose-300 bg-white">
                <div className="flex justify-between font-bold text-rose-700 mb-1">
                  <span>+90 días (Atención)</span>
                  <span className="font-mono">68 unidades (5 %)</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-zinc-100 overflow-hidden">
                  <div className="h-full bg-rose-600 rounded-full" style={{ width: '5%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs space-y-2">
            <div className="flex items-center gap-1.5 text-zinc-700 text-[11px]">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span><strong>68 unidades</strong> superan el umbral de antigüedad configurado.</span>
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

      {/* 7. COMPRAS & VENTAS (2 COLS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Compras & Abastecimiento (6 cols) */}
        <div className="lg:col-span-6 p-5 rounded-3xl bg-white border border-zinc-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
              <div>
                <h3 className="font-black text-zinc-950 text-sm">
                  Compras & abastecimiento
                </h3>
                <p className="text-[11px] text-zinc-500">
                  Control de requisiciones, órdenes de compra y recepciones.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('compras')}
                className="text-rose-600 font-bold text-xs hover:underline cursor-pointer"
              >
                Ver compras &rarr;
              </button>
            </div>

            {/* 4 Mini KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 text-center">
              <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-0.5">
                <span className="text-[9px] font-bold uppercase text-zinc-500 block">Requisiciones</span>
                <strong className="text-lg font-black font-mono text-zinc-950 block">7</strong>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-0.5">
                <span className="text-[9px] font-bold uppercase text-zinc-500 block">Por comprar</span>
                <strong className="text-lg font-black font-mono text-blue-700 block">12</strong>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-0.5">
                <span className="text-[9px] font-bold uppercase text-zinc-500 block">En tránsito</span>
                <strong className="text-lg font-black font-mono text-purple-700 block">8</strong>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-50 border border-rose-300 space-y-0.5">
                <span className="text-[9px] font-bold uppercase text-rose-700 block">Atrasadas</span>
                <strong className="text-lg font-black font-mono text-rose-700 block">2</strong>
              </div>
            </div>

            {/* Próximas Recepciones */}
            <div className="space-y-2 pt-3">
              <span className="text-[10px] font-bold uppercase text-zinc-500 block">
                Próximas recepciones
              </span>

              <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs flex items-center justify-between">
                <div>
                  <strong className="text-zinc-900 font-mono">OC-2026-0041 &bull; Nayt México</strong>
                  <span className="text-[11px] text-zinc-500 block">24 unidades &bull; Hoy &bull; CEDIS Monterrey Norte</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white text-emerald-800 border border-emerald-400">
                  En andén
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs flex items-center justify-between">
                <div>
                  <strong className="text-zinc-900 font-mono">OC-2026-0047 &bull; Spring Air México</strong>
                  <span className="text-[11px] text-zinc-500 block">18 unidades &bull; Mañana &bull; CEDIS Monterrey Sur</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white text-blue-800 border border-blue-400">
                  Programada
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs flex items-center justify-between">
            <span className="text-zinc-600 text-[11px]">
              Sugerencia: <strong>Spring Air Recovery Matrimonial</strong> (7 u. disponibles)
            </span>
            <button
              type="button"
              onClick={() => onNavigate('requisiciones')}
              className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] shadow-2xs cursor-pointer"
            >
              Crear requisición
            </button>
          </div>
        </div>

        {/* Ventas (6 cols) */}
        <div className="lg:col-span-6 p-5 rounded-3xl bg-white border border-zinc-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
              <div>
                <h3 className="font-black text-zinc-950 text-sm">
                  Ventas
                </h3>
                <p className="text-[11px] text-zinc-500">
                  Desempeño comercial y pedidos solicitados ({selectedPeriod}).
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('pedidos')}
                className="text-rose-600 font-bold text-xs hover:underline cursor-pointer"
              >
                Ver pedidos &rarr;
              </button>
            </div>

            {/* Financial & Volume Header */}
            <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-between mt-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-zinc-500 block">Venta de hoy</span>
                <strong className="text-xl font-black font-mono text-zinc-950 block">$307,330 MXN</strong>
              </div>
              <div className="text-right text-xs font-mono text-zinc-600 space-y-0.5">
                <span className="block font-bold text-zinc-900">18 pedidos &bull; 91 unidades</span>
                <span className="text-[11px] text-amber-700 font-semibold block">3 pendientes de autorización</span>
              </div>
            </div>

            {/* Top Solicitados */}
            <div className="space-y-2 pt-3">
              <span className="text-[10px] font-bold uppercase text-zinc-500 block">
                Más solicitados
              </span>

              <div className="space-y-1.5 text-xs">
                <div className="p-2 rounded-xl bg-white border border-zinc-200 flex items-center justify-between">
                  <span className="font-medium text-zinc-900">1. Spring Air Record King Size</span>
                  <strong className="font-mono text-zinc-800">28 unidades</strong>
                </div>

                <div className="p-2 rounded-xl bg-white border border-zinc-200 flex items-center justify-between">
                  <span className="font-medium text-zinc-900">2. Restonic Ortopedic Matrimonial</span>
                  <strong className="font-mono text-zinc-800">22 unidades</strong>
                </div>

                <div className="p-2 rounded-xl bg-white border border-zinc-200 flex items-center justify-between">
                  <span className="font-medium text-zinc-900">3. Nayt Flow Basic Individual</span>
                  <strong className="font-mono text-zinc-800">18 unidades</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs flex items-center justify-between">
            <span className="text-zinc-600 text-[11px]">
              3 pedidos con descuento especial pendientes de firma
            </span>
            <button
              type="button"
              onClick={() => onNavigate('pedidos')}
              className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-[10px] shadow-2xs cursor-pointer"
            >
              Revisar pedidos
            </button>
          </div>
        </div>

      </div>

      {/* 8. EMBARQUES & ENTREGAS (MINI RESUMEN & PRÓXIMAS ENTREGAS) */}
      <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-2">
          <div>
            <h3 className="font-black text-zinc-950 text-sm">
              Embarques & Entregas
            </h3>
            <p className="text-[11px] text-zinc-500">
              Operación de despacho, asignación de unidades y monitoreo en tránsito.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('logistica')}
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-zinc-50 text-rose-600 font-bold text-xs border border-rose-500/40 shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <span>Abrir Embarques & Entregas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Summary Mini Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-center space-y-0.5">
            <span className="text-[10px] font-bold uppercase text-zinc-500 block">Listas para carga</span>
            <strong className="text-2xl font-black font-mono text-zinc-950 block">12</strong>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-center space-y-0.5">
            <span className="text-[10px] font-bold uppercase text-zinc-500 block">Rutas activas</span>
            <strong className="text-2xl font-black font-mono text-emerald-700 block">7</strong>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-center space-y-0.5">
            <span className="text-[10px] font-bold uppercase text-zinc-500 block">Entregas completadas</span>
            <strong className="text-2xl font-black font-mono text-blue-700 block">18 / 23</strong>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-center space-y-0.5">
            <span className="text-[10px] font-bold uppercase text-zinc-500 block">Requieren atención</span>
            <strong className="text-2xl font-black font-mono text-rose-600 block">3</strong>
          </div>
        </div>

        {/* Próximas entregas table */}
        <div className="overflow-x-auto pt-1">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-[10px] font-bold uppercase text-zinc-500">
                <th className="py-2 px-3">Hora</th>
                <th className="py-2 px-3">Destino</th>
                <th className="py-2 px-3">Ruta</th>
                <th className="py-2 px-3 text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 text-[11px] font-sans">
              <tr>
                <td className="py-2.5 px-3 font-mono font-bold text-zinc-900">14:45</td>
                <td className="py-2.5 px-3 font-medium text-zinc-900">Roberto Cantú Garza (San Pedro)</td>
                <td className="py-2.5 px-3 font-mono text-zinc-700">RT-2026-0031</td>
                <td className="py-2.5 px-3 text-right">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white border border-blue-500 text-blue-800">
                    Próxima
                  </span>
                </td>
              </tr>

              <tr>
                <td className="py-2.5 px-3 font-mono font-bold text-zinc-900">15:10</td>
                <td className="py-2.5 px-3 font-medium text-zinc-900">Sucursal Cumbres (Traspaso)</td>
                <td className="py-2.5 px-3 font-mono text-zinc-700">RT-2026-0034</td>
                <td className="py-2.5 px-3 text-right">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white border border-emerald-500 text-emerald-800">
                    En tiempo
                  </span>
                </td>
              </tr>

              <tr>
                <td className="py-2.5 px-3 font-mono font-bold text-zinc-900">15:25</td>
                <td className="py-2.5 px-3 font-medium text-zinc-900">Hotel Boutique Las Lomas</td>
                <td className="py-2.5 px-3 font-mono text-zinc-700">RT-2026-0033</td>
                <td className="py-2.5 px-3 text-right">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white border border-amber-500 text-amber-800">
                    Retraso estimado: 18 min
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 9. RED OPERATIVA (4 CARDS DETALLADAS) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-black text-zinc-950 text-sm">
              Red operativa
            </h3>
            <p className="text-[11px] text-zinc-500">
              Estado de instalaciones, inventario alojado y flujo en curso.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('inventario')}
            className="text-rose-600 font-bold text-xs hover:underline cursor-pointer"
          >
            Ver almacenes &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {facilities.map((fac) => (
            <div
              key={fac.id}
              onClick={() => onNavigate('inventario')}
              className="p-4 rounded-3xl bg-white border border-zinc-200 hover:border-zinc-300 hover:shadow-xs transition-all cursor-pointer group space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border shadow-2xs bg-white ${
                  fac.id.includes('wh-') ? 'border-rose-500 text-rose-800' : 'border-purple-500 text-purple-800'
                }`}>
                  {fac.code}
                </span>
                <span className="font-mono text-xs font-black text-zinc-950">{fac.unitsCount} u.</span>
              </div>

              <div>
                <strong className="text-xs font-bold text-zinc-900 block truncate">{fac.name}</strong>
                <p className="text-[10px] text-zinc-500 truncate">{fac.address}</p>
              </div>

              <div className="space-y-1 text-[11px] text-zinc-600 border-t border-zinc-100 pt-2 font-mono">
                <div className="flex justify-between">
                  <span className="font-sans">Por recibir:</span>
                  <strong>{fac.pendingInbound}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="font-sans">Rutas activas:</span>
                  <strong>{fac.activeRoutes}</strong>
                </div>
                {fac.displayUnits > 0 && (
                  <div className="flex justify-between">
                    <span className="font-sans">En exhibición:</span>
                    <strong>{fac.displayUnits} u.</strong>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="font-sans">Incidencias:</span>
                  <strong className={fac.openIncidents > 0 ? 'text-rose-600' : 'text-zinc-500'}>
                    {fac.openIncidents}
                  </strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 10. ACTIVIDAD RECIENTE (TIMELINE DE 20+ EVENTOS) */}
      <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
          <div>
            <h3 className="font-black text-zinc-950 text-sm">
              Actividad reciente
            </h3>
            <p className="text-[11px] text-zinc-500">
              Registro cronológico de movimientos de inventario, compras, ventas y entregas.
            </p>
          </div>

          <span className="px-2.5 py-0.5 rounded-full bg-white border border-zinc-300 font-mono text-[10px] font-bold text-zinc-700 shadow-2xs">
            {recentEvents.length} eventos registrados
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
