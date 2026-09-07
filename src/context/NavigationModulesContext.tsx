import React, { createContext, useContext, useState, useEffect } from 'react';
import { NavItemKey } from '../components/Sidebar';

export interface ModuleDefinition {
  key: NavItemKey;
  label: string;
  category: 'operaciones' | 'compras' | 'ventas' | 'finanzas' | 'sistema';
  categoryLabel: string;
  description: string;
  isLocked?: boolean;
}

export const MODULE_DEFINITIONS: ModuleDefinition[] = [
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
    description: 'Gestión de facturas de proveedores con validación y conciliación 3-Way Match.',
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
  'showroom-expos': false,
  'requisiciones': false,
  'compras': false,
  'proveedores': false,
  'cotizaciones': false,
  'pedidos': false,
  'clientes': false,
  'facturacion': true,
  'cxc': true,
  'cxp': true,
  'configuracion': true,
};

const STORAGE_KEY = 'rtm_visible_navigation_modules_v3';

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
          return { ...DEFAULT_VISIBILITY, ...parsed, 'showroom-expos': false };
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
    // Showroom & Expos is disabled in RTM
    if (key === 'showroom-expos') return false;
    // Locked items are always visible
    if (key === 'inicio' || key === 'configuracion') return true;
    return visibleModules[key] !== false;
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
