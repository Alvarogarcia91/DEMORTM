import React, { createContext, useContext, useState, useEffect } from 'react';
import { NavItemKey } from '../components/Sidebar';

export interface ModuleDefinition {
  key: NavItemKey;
  label: string;
  category: 'operaciones' | 'compras' | 'comercial' | 'ventas' | 'finanzas' | 'nomina' | 'mantenimiento' | 'sistema';
  categoryLabel: string;
  description: string;
  isLocked?: boolean;
}

export const MODULE_DEFINITIONS: ModuleDefinition[] = [
  {
    key: 'presupuestos',
    label: 'Presupuestos',
    category: 'finanzas',
    categoryLabel: 'Finanzas & Facturación',
    description: 'Planeación, consumo y desviaciones presupuestales por centro de costo.',
  },
  {
    key: 'activos-fijos',
    label: 'Activos Fijos',
    category: 'finanzas',
    categoryLabel: 'Finanzas & Facturación',
    description: 'Control demo de activos, depreciación y movimientos financieros.',
  },
  {
    key: 'crm',
    label: 'CRM',
    category: 'comercial',
    categoryLabel: 'Comercial',
    description: 'Prospectos, oportunidades, actividades, pipeline y forecast comercial B2B.',
  },
  {
    key: 'inicio',
    label: 'Inicio (Dashboard)',
    category: 'sistema',
    categoryLabel: 'Sistema',
    description: 'Resumen gerencial de indicadores operativos, accesos rápidos y métricas en tiempo real.',
    isLocked: true,
  },
  {
    key: 'articulos',
    label: 'Artículos & Catálogo',
    category: 'operaciones',
    categoryLabel: 'Inventario y Operaciones',
    description: 'Catálogo maestro de sustratos, materias primas, productos terminados y especificaciones.',
  },
  {
    key: 'inventario',
    label: 'Inventario & Almacén',
    category: 'operaciones',
    categoryLabel: 'Inventario y Operaciones',
    description: 'Control de existencias, mapa 2D del almacén, conteos cíclicos y transferencias.',
  },
  {
    key: 'mesa-verificacion',
    label: 'Operaciones de Almacén',
    category: 'operaciones',
    categoryLabel: 'Inventario y Operaciones',
    description: 'Recepción de sustratos e insumos, acomodo, surtido a líneas Offset/Flexo y control de remanentes.',
  },
  {
    key: 'logistica',
    label: 'Órdenes de Salida',
    category: 'operaciones',
    categoryLabel: 'Inventario y Operaciones',
    description: 'Despacho de producto terminado liberado por QA, staging de tarimas y validación de carga para clientes industriales.',
  },
  {
    key: 'produccion',
    label: 'Producción',
    category: 'operaciones',
    categoryLabel: 'Producción & Planta',
    description: 'Planeación, órdenes de producción, piso, materiales e incidencias de planta.',
  },
  {
    key: 'mantenimiento',
    label: 'Mantenimiento & Equipos',
    category: 'mantenimiento',
    categoryLabel: 'Mantenimiento & Planta',
    description: 'Control de maquinaria y equipos, órdenes de trabajo (OT), refacciones y mantenimiento preventivo.',
  },
  {
    key: 'requisiciones',
    label: 'Requisiciones',
    category: 'compras',
    categoryLabel: 'Cadena de Compras',
    description: 'Solicitudes internas de abastecimiento de material y autorizaciones departamentales.',
  },
  {
    key: 'compras',
    label: 'Órdenes de Compra',
    category: 'compras',
    categoryLabel: 'Cadena de Compras',
    description: 'Emisión, seguimiento y recepción de pedidos a proveedores con control de costos.',
  },
  {
    key: 'proveedores',
    label: 'Directorio de Proveedores',
    category: 'compras',
    categoryLabel: 'Cadena de Compras',
    description: 'Catálogo de proveedores certificados, listas de precios y convenios de suministro.',
  },
  {
    key: 'cotizaciones',
    label: 'Cotizaciones',
    category: 'ventas',
    categoryLabel: 'Gestión Comercial',
    description: 'Generación de propuestas comerciales, cálculo de márgenes y autorizaciones de descuento.',
  },
  {
    key: 'pedidos',
    label: 'Pedidos de Venta',
    category: 'ventas',
    categoryLabel: 'Gestión Comercial',
    description: 'Órdenes de venta autorizadas, seguimiento a producción y programación de entrega.',
  },
  {
    key: 'clientes',
    label: 'Directorio de Clientes',
    category: 'ventas',
    categoryLabel: 'Gestión Comercial',
    description: 'Gestión de cartera de clientes, condiciones de crédito y contactos comerciales.',
  },
  {
    key: 'facturacion',
    label: 'Facturación (CFDI 4.0)',
    category: 'finanzas',
    categoryLabel: 'Finanzas & Facturación',
    description: 'Emisión y simulación fiscal de comprobantes CFDI 4.0 a partir de remisiones entregadas.',
  },
  {
    key: 'cxc',
    label: 'Cuentas por Cobrar (CxC)',
    category: 'finanzas',
    categoryLabel: 'Finanzas & Facturación',
    description: 'Control de cartera, vencimiento de facturas, abonos y antigüedad de saldos.',
  },
  {
    key: 'cxp',
    label: 'Cuentas por Pagar (CxP)',
    category: 'finanzas',
    categoryLabel: 'Finanzas & Facturación',
    description: 'Gestión de facturas de proveedores con validación contra compras y almacén.',
  },
  {
    key: 'nomina',
    label: 'Nómina & Asistencia',
    category: 'nomina',
    categoryLabel: 'Nómina & Recursos Humanos',
    description: 'Gestión de checadas de planta, incidencias con reposición, pre-nómina y timbrado fiscal CFDI 4.0.',
  },
  {
    key: 'configuracion',
    label: 'Configuración & Temas',
    category: 'sistema',
    categoryLabel: 'Sistema',
    description: 'Personalización de interfaz, paletas de color, empresa y administración de navegación.',
    isLocked: true,
  },
];

type VisibilityMap = Record<NavItemKey, boolean>;

const DEFAULT_VISIBILITY: VisibilityMap = {
  'inicio': true,
  'articulos': false,
  'inventario': true,
  'mesa-verificacion': true,
  'logistica': false,
  'produccion': true,
  'requisiciones': false,
  'compras': false,
  'proveedores': false,
  'crm': true,
  'cotizaciones': false,
  'pedidos': false,
  'clientes': false,
  'facturacion': true,
  'cxc': true,
  'cxp': true,
  'finanzas': true,
  'tesoreria': true,
  'contabilidad': true,
  'reportes-financieros': true,
  'presupuestos': true,
  'activos-fijos': true,
  'nomina': true,
  'mantenimiento': true,
  'centro-alertas': true,
  'configuracion': true,
};

const STORAGE_KEY = 'rtm_visible_navigation_modules_v6';

interface NavigationModulesContextType {
  visibleModules: VisibilityMap;
  isModuleVisible: (key: NavItemKey) => boolean;
  toggleModule: (key: NavItemKey) => void;
  setModuleVisibility: (key: NavItemKey, isVisible: boolean) => void;
  showAllModules: () => void;
  hideAllOptionalModules: () => void;
  resetToDefault: () => void;
  modules: ModuleDefinition[];
  visibleCount: number;
  totalCount: number;
}

const NavigationModulesContext = createContext<NavigationModulesContextType | undefined>(undefined);

export const NavigationModulesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visibleModules, setVisibleModules] = useState<VisibilityMap>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return {
            ...DEFAULT_VISIBILITY,
            ...parsed,
            'mantenimiento': parsed.mantenimiento !== undefined ? parsed.mantenimiento : true,
            'nomina': parsed.nomina !== undefined ? parsed.nomina : true,
            'centro-alertas': true,
          };
        } catch {
          return DEFAULT_VISIBILITY;
        }
      }
    }
    return DEFAULT_VISIBILITY;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visibleModules));
  }, [visibleModules]);

  const isModuleVisible = (key: NavItemKey): boolean => {
    // Locked items are always visible
    if (key === 'inicio' || key === 'configuracion' || key === 'centro-alertas') return true;
    if (visibleModules[key] === undefined) {
      return DEFAULT_VISIBILITY[key] ?? true;
    }
    return visibleModules[key] === true;
  };

  const toggleModule = (key: NavItemKey) => {
    if (key === 'inicio' || key === 'configuracion') return;
    setVisibleModules((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const setModuleVisibility = (key: NavItemKey, isVisible: boolean) => {
    if (key === 'inicio' || key === 'configuracion') return;
    setVisibleModules((prev) => ({
      ...prev,
      [key]: isVisible,
    }));
  };

  const showAllModules = () => {
    const all: VisibilityMap = {} as VisibilityMap;
    MODULE_DEFINITIONS.forEach((m) => {
      all[m.key] = true;
    });
    setVisibleModules(all);
  };

  const hideAllOptionalModules = () => {
    const minimal: VisibilityMap = { ...DEFAULT_VISIBILITY };
    Object.keys(minimal).forEach((k) => {
      const key = k as NavItemKey;
      if (key !== 'inicio' && key !== 'configuracion') {
        minimal[key] = false;
      }
    });
    setVisibleModules(minimal);
  };

  const resetToDefault = () => {
    setVisibleModules(DEFAULT_VISIBILITY);
    localStorage.removeItem(STORAGE_KEY);
  };

  const visibleCount = MODULE_DEFINITIONS.filter((m) => isModuleVisible(m.key)).length;
  const totalCount = MODULE_DEFINITIONS.length;

  return (
    <NavigationModulesContext.Provider
      value={{
        visibleModules,
        isModuleVisible,
        toggleModule,
        setModuleVisibility,
        showAllModules,
        hideAllOptionalModules,
        resetToDefault,
        modules: MODULE_DEFINITIONS,
        visibleCount,
        totalCount,
      }}
    >
      {children}
    </NavigationModulesContext.Provider>
  );
};

export const useNavigationModules = () => {
  const context = useContext(NavigationModulesContext);
  if (!context) {
    throw new Error('useNavigationModules must be used within a NavigationModulesProvider');
  }
  return context;
};
