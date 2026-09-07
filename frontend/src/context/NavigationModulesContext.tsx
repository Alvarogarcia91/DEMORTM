import React, { createContext, useContext, useState, useEffect } from 'react';
import { NavItemKey } from '../components/Sidebar';

export interface ModuleDefinition {
  key: NavItemKey;
  label: string;
  category: 'operaciones' | 'compras' | 'ventas' | 'sistema';
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
    label: 'Mesa de Verificación (Inbound/Outbound)',
    category: 'operaciones',
    categoryLabel: 'Inventario y Operaciones',
    description: 'Recepción con escáner, etiquetado de lotes, inspección de calidad y validación de salidas.',
  },
  {
    key: 'logistica',
    label: 'Embarques & Entregas',
    category: 'operaciones',
    categoryLabel: 'Inventario y Operaciones',
    description: 'Programación de rutas de distribución, control de transportistas y confirmación de entrega.',
  },
  {
    key: 'showroom-expos',
    label: 'Showroom & Expos',
    category: 'operaciones',
    categoryLabel: 'Inventario y Operaciones',
    description: 'Control de mercancía en exhibición, montaje de exposiciones y recolecciones temporales.',
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
  'articulos': true,
  'inventario': true,
  'mesa-verificacion': true,
  'logistica': true,
  'showroom-expos': true,
  'requisiciones': true,
  'compras': true,
  'proveedores': true,
  'cotizaciones': true,
  'pedidos': true,
  'clientes': true,
  'configuracion': true,
};

const STORAGE_KEY = 'rtm_visible_navigation_modules';

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
          return { ...DEFAULT_VISIBILITY, ...JSON.parse(saved) };
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
    setVisibleModules(DEFAULT_VISIBILITY);
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
