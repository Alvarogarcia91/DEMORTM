import React, { useState } from 'react';
import { 
  useTheme, 
  THEME_PRESETS, 
  ThemePreset, 
  ThemeMode, 
  SidebarStyle, 
  ThemeDensity 
} from '../context/ThemeContext';
import { 
  useNavigationModules,
  ModuleDefinition 
} from '../context/NavigationModulesContext';
import { 
  Palette, 
  Sun, 
  Moon, 
  Laptop, 
  Check, 
  RotateCcw, 
  Building,
  Server,
  Layers,
  Eye,
  EyeOff,
  Lock,
  Package,
  Boxes,
  Scan,
  Truck,
  Store,
  ClipboardList,
  ShoppingCart,
  Building2,
  FileText,
  ShoppingBag,
  Users,
  LayoutDashboard,
  CheckCheck,
  ShieldCheck
} from 'lucide-react';
import { NavItemKey } from './Sidebar';

export const ConfiguracionView: React.FC = () => {
  const { 
    config, 
    setPreset, 
    setMode, 
    setSidebarStyle, 
    setDensity, 
    isDark 
  } = useTheme();

  const {
    modules,
    isModuleVisible,
    toggleModule,
    showAllModules,
    hideAllOptionalModules,
    resetToDefault,
    visibleCount,
    totalCount
  } = useNavigationModules();

  const [activeSubTab, setActiveSubTab] = useState<'apariencia' | 'modulos' | 'general' | 'terminales'>('apariencia');
  const [saveToast, setSaveToast] = useState<{ show: boolean; message: string }>({ show: false, message: '' });

  const showSavedFeedback = (message: string = 'Cambios aplicados en tiempo real') => {
    setSaveToast({ show: true, message });
    setTimeout(() => setSaveToast({ show: false, message: '' }), 2200);
  };

  const handleSelectPreset = (presetId: ThemePreset) => {
    setPreset(presetId);
    showSavedFeedback('Paleta de color actualizada');
  };

  const handleSelectMode = (mode: ThemeMode) => {
    setMode(mode);
    showSavedFeedback('Modo de visualización actualizado');
  };

  const handleSelectSidebarStyle = (style: SidebarStyle) => {
    setSidebarStyle(style);
    showSavedFeedback('Estilo de barra lateral actualizado');
  };

  const handleSelectDensity = (density: ThemeDensity) => {
    setDensity(density);
    showSavedFeedback('Densidad de interfaz actualizada');
  };

  const getModuleIcon = (key: NavItemKey) => {
    switch (key) {
      case 'inicio': return LayoutDashboard;
      case 'articulos': return Package;
      case 'inventario': return Boxes;
      case 'mesa-verificacion': return Scan;
      case 'logistica': return Truck;
      case 'showroom-expos': return Store;
      case 'requisiciones': return ClipboardList;
      case 'compras': return ShoppingCart;
      case 'proveedores': return Building2;
      case 'cotizaciones': return FileText;
      case 'pedidos': return ShoppingBag;
      case 'clientes': return Users;
      case 'configuracion': return Palette;
      default: return Layers;
    }
  };

  const categories = [
    { id: 'operaciones', label: 'Inventario y Operaciones', desc: 'Módulos de catálogo, almacén físico, control de calidad y logística' },
    { id: 'compras', label: 'Cadena de Suministro (Compras)', desc: 'Requisiciones internas, compras y directorio de proveedores' },
    { id: 'ventas', label: 'Gestión Comercial (Ventas)', desc: 'Cotizaciones, órdenes de venta y administración de clientes' },
    { id: 'sistema', label: 'Módulos Centrales del Sistema', desc: 'Accesos esenciales de administración y control general' },
  ];

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-theme-main tracking-tight">
            Configuración del Sistema
          </h1>
          <p className="text-xs sm:text-sm text-theme-muted mt-1">
            Personaliza la apariencia visual, visibilidad de módulos en la barra lateral y preferencias operativas.
          </p>
        </div>

        {/* Reset Button */}
        <button
          onClick={() => {
            setPreset('rtm');
            setMode('light');
            setSidebarStyle('default');
            setDensity('comfortable');
            resetToDefault();
            showSavedFeedback('Configuración oficial y módulos restablecidos');
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-theme-surface border border-theme-subtle text-xs font-semibold text-theme-main hover:bg-theme-muted transition-all cursor-pointer shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5 text-theme-muted" />
          <span>Restaurar todo por defecto</span>
        </button>
      </div>

      {/* Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-theme-subtle pb-px overflow-x-auto">
        {[
          { key: 'apariencia', label: 'Apariencia & Temas', icon: Palette },
          { key: 'modulos', label: 'Módulos & Navegación', icon: Layers, badge: `${visibleCount}/${totalCount}` },
          { key: 'general', label: 'Información de Empresa', icon: Building },
          { key: 'terminales', label: 'Terminales & Escáneres', icon: Server },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveSubTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'border-theme-primary text-theme-primary font-bold'
                  : 'border-transparent text-theme-muted hover:text-theme-main'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive 
                    ? 'bg-theme-primary/10 text-theme-primary' 
                    : 'bg-theme-muted text-theme-muted'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Toast Feedback */}
      {saveToast.show && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-zinc-900 text-white text-xs font-semibold shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{saveToast.message}</span>
        </div>
      )}

      {/* Tab Content: Apariencia */}
      {activeSubTab === 'apariencia' && (
        <div className="space-y-8">
          {/* Section 1: Palette Presets (4 Presets) */}
          <div className="bg-theme-surface border border-theme-subtle rounded-2xl p-6 shadow-xs space-y-4">
            <div>
              <h2 className="text-sm font-bold text-theme-main flex items-center gap-2">
                <Palette className="w-4 h-4 text-theme-primary" />
                Paleta de Color del ERP
              </h2>
              <p className="text-xs text-theme-muted mt-0.5">
                Selecciona una paleta de color adaptada a la identidad corporativa.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {(Object.keys(THEME_PRESETS) as ThemePreset[]).map((presetId) => {
                const preset = THEME_PRESETS[presetId];
                const isSelected = config.preset === presetId;

                return (
                  <div
                    key={presetId}
                    onClick={() => handleSelectPreset(presetId)}
                    className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-theme-primary bg-theme-muted shadow-md ring-2 ring-theme-primary/20'
                        : 'border-theme-subtle bg-theme-surface hover:border-theme-strong hover:shadow-xs'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-theme-primary text-white flex items-center justify-center text-xs shadow-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}

                    {/* Color Swatch Dots */}
                    <div className="flex items-center gap-1.5 mb-3">
                      <div className="w-6 h-6 rounded-full shadow-xs" style={{ backgroundColor: preset.colors.primary }} />
                      <div className="w-4 h-4 rounded-full border border-theme-subtle" style={{ backgroundColor: preset.colors.cardBg }} />
                      <div className="w-4 h-4 rounded-full border border-theme-subtle" style={{ backgroundColor: preset.colors.darkBg }} />
                    </div>

                    <h3 className="text-xs font-bold text-theme-main">{preset.name}</h3>
                    <p className="text-[11px] text-theme-muted mt-1 leading-relaxed">{preset.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Light / Dark Mode */}
          <div className="bg-theme-surface border border-theme-subtle rounded-2xl p-6 shadow-xs space-y-4">
            <div>
              <h2 className="text-sm font-bold text-theme-main flex items-center gap-2">
                <Sun className="w-4 h-4 text-theme-primary" />
                Modo de Visualización
              </h2>
              <p className="text-xs text-theme-muted mt-0.5">
                Ajusta el tema para trabajar en condiciones de luz de oficina o almacén.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {[
                { key: 'light', label: 'Modo Claro', icon: Sun, desc: 'Fondo blanco y superficies limpias' },
                { key: 'dark', label: 'Modo Oscuro', icon: Moon, desc: 'Fondo negro carbón de alto contraste' },
                { key: 'system', label: 'Sincronizar con Sistema', icon: Laptop, desc: 'Detecta la preferencia del SO' },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = config.mode === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => handleSelectMode(item.key as ThemeMode)}
                    className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-theme-primary bg-theme-muted shadow-xs'
                        : 'border-theme-subtle bg-theme-surface hover:border-theme-strong'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mt-0.5 ${isSelected ? 'text-theme-primary' : 'text-theme-muted'}`} />
                    <div>
                      <p className="text-xs font-bold text-theme-main">{item.label}</p>
                      <p className="text-[11px] text-theme-muted mt-0.5">{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Density */}
          <div className="bg-theme-surface border border-theme-subtle rounded-2xl p-6 shadow-xs space-y-4">
            <div>
              <h2 className="text-sm font-bold text-theme-main flex items-center gap-2">
                <Sun className="w-4 h-4 text-theme-primary" />
                Densidad de la Interfaz
              </h2>
              <p className="text-xs text-theme-muted mt-0.5">
                Espaciado entre tablas, botones y listas operativas.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                { key: 'comfortable', label: 'Cómoda (Estándar)', desc: 'Espaciado amplio para uso en monitores y tablets' },
                { key: 'compact', label: 'Compacta (Alta Densidad)', desc: 'Maximiza el espacio para listas grandes de inventario' },
              ].map((item) => {
                const isSelected = config.density === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => handleSelectDensity(item.key as ThemeDensity)}
                    className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-theme-primary bg-theme-muted shadow-xs'
                        : 'border-theme-subtle bg-theme-surface hover:border-theme-strong'
                    }`}
                  >
                    <p className="text-xs font-bold text-theme-main">{item.label}</p>
                    <p className="text-[11px] text-theme-muted mt-0.5">{item.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Módulos & Navegación */}
      {activeSubTab === 'modulos' && (
        <div className="space-y-6">
          {/* Header Action Banner */}
          <div className="bg-theme-surface border border-theme-subtle rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-theme-primary" />
                <h2 className="text-base font-bold text-theme-main">
                  Visibilidad de Módulos en la Barra Lateral
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-theme-primary/10 text-theme-primary border border-theme-primary/20">
                  {visibleCount} de {totalCount} activos
                </span>
              </div>
              <p className="text-xs text-theme-muted">
                Oculta o muestra secciones de la barra de navegación para enfocar la interfaz en los procesos de la demo. Los cambios se reflejan de inmediato y se guardan automáticamente.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  showAllModules();
                  showSavedFeedback('Todos los módulos activados');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-theme-muted text-theme-main hover:bg-theme-subtle border border-theme-subtle text-xs font-semibold transition-all cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5 text-theme-primary" />
                <span>Mostrar todos</span>
              </button>

              <button
                onClick={() => {
                  hideAllOptionalModules();
                  showSavedFeedback('Módulos opcionales ocultos');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-theme-muted text-theme-main hover:bg-theme-subtle border border-theme-subtle text-xs font-semibold transition-all cursor-pointer"
              >
                <EyeOff className="w-3.5 h-3.5 text-theme-muted" />
                <span>Solo esenciales</span>
              </button>
            </div>
          </div>

          {/* Module Categories Grid */}
          <div className="space-y-6">
            {categories.map((cat) => {
              const catModules = modules.filter((m) => m.category === cat.id);
              const catVisibleCount = catModules.filter((m) => isModuleVisible(m.key)).length;

              return (
                <div key={cat.id} className="bg-theme-surface border border-theme-subtle rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-theme-subtle pb-3">
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-theme-main">
                        {cat.label}
                      </h3>
                      <p className="text-[11px] text-theme-muted mt-0.5">{cat.desc}</p>
                    </div>
                    <span className="text-[11px] font-semibold text-theme-muted px-2 py-0.5 rounded-md bg-theme-muted border border-theme-subtle">
                      {catVisibleCount} de {catModules.length} visibles
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                    {catModules.map((module) => {
                      const Icon = getModuleIcon(module.key);
                      const isVisible = isModuleVisible(module.key);
                      const isLocked = module.isLocked;

                      return (
                        <div
                          key={module.key}
                          onClick={() => {
                            if (!isLocked) {
                              toggleModule(module.key);
                              showSavedFeedback(`Módulo ${module.label} ${isVisible ? 'ocultado' : 'activado'}`);
                            }
                          }}
                          className={`relative p-4 rounded-xl border transition-all select-none ${
                            isLocked
                              ? 'bg-theme-muted/50 border-theme-subtle opacity-90 cursor-default'
                              : isVisible
                              ? 'bg-theme-surface border-theme-subtle hover:border-theme-primary/50 shadow-xs cursor-pointer'
                              : 'bg-theme-muted/40 border-theme-subtle opacity-60 hover:opacity-80 cursor-pointer'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <div className={`p-2.5 rounded-xl shrink-0 transition-colors ${
                                isVisible 
                                  ? 'bg-theme-primary/10 text-theme-primary' 
                                  : 'bg-zinc-200 text-zinc-500'
                              }`}>
                                <Icon className="w-4 h-4" />
                              </div>

                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5">
                                  <h4 className="text-xs font-bold text-theme-main leading-snug">
                                    {module.label}
                                  </h4>
                                  {isLocked && (
                                    <span title="Módulo esencial de navegación" className="text-theme-muted">
                                      <Lock className="w-3 h-3" />
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-theme-muted leading-relaxed line-clamp-2">
                                  {module.description}
                                </p>
                              </div>
                            </div>

                            {/* Switch / Lock Control */}
                            <div className="shrink-0 pt-0.5">
                              {isLocked ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-theme-muted text-theme-muted border border-theme-subtle">
                                  <ShieldCheck className="w-3 h-3 text-theme-primary" />
                                  Fijo
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                    isVisible ? 'bg-theme-primary' : 'bg-zinc-300 dark:bg-zinc-700'
                                  }`}
                                >
                                  <span
                                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                      isVisible ? 'translate-x-4' : 'translate-x-0'
                                    }`}
                                  />
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-theme-subtle/60 flex items-center justify-between text-[10px]">
                            <span className="text-theme-muted font-medium">Estado en menú:</span>
                            {isLocked ? (
                              <span className="font-bold text-theme-primary">Siempre visible</span>
                            ) : isVisible ? (
                              <span className="font-bold text-emerald-600 flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                Visible en menú
                              </span>
                            ) : (
                              <span className="font-bold text-zinc-400 flex items-center gap-1">
                                <EyeOff className="w-3 h-3" />
                                Oculto
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: General */}
      {activeSubTab === 'general' && (
        <div className="bg-theme-surface border border-theme-subtle rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-theme-main">Datos Corporativos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-theme-muted border border-theme-subtle">
              <span className="text-theme-muted font-medium">Empresa</span>
              <p className="font-bold text-theme-main text-sm mt-0.5">Impresos RTM S.A. de C.V.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-theme-muted border border-theme-subtle">
              <span className="text-theme-muted font-medium">Plataforma ERP</span>
              <p className="font-bold text-theme-main text-sm mt-0.5">Nexora Enterprise v1.0.0 (Demo)</p>
            </div>
            <div className="p-3.5 rounded-xl bg-theme-muted border border-theme-subtle">
              <span className="text-theme-muted font-medium">Sede Principal</span>
              <p className="font-bold text-theme-main text-sm mt-0.5">Reynosa, Tamaulipas, México</p>
            </div>
            <div className="p-3.5 rounded-xl bg-theme-muted border border-theme-subtle">
              <span className="text-theme-muted font-medium">Desarrollo & Soporte</span>
              <p className="font-bold text-theme-main text-sm mt-0.5">Nexora IT LLC</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Terminales */}
      {activeSubTab === 'terminales' && (
        <div className="bg-theme-surface border border-theme-subtle rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-theme-main">Dispositivos de Escaneo / Terminales RF</h2>
          <p className="text-xs text-theme-muted">
            Lectores QR/código de barras para lotes, rollos, bobinas, tarimas, producto terminado y ubicaciones físicas.
          </p>
          <div className="p-4 rounded-xl bg-white border border-emerald-600 shadow-2xs text-xs text-zinc-900 flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Escáner activo en modo teclado HID y cámara web compatible.</span>
          </div>
        </div>
      )}
    </div>
  );
};
