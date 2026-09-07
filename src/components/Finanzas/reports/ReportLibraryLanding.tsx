import React, { useState, useMemo } from 'react';
import {
  Search,
  ArrowRight,
  TrendingUp,
  Users,
  Package,
  FileText,
  BarChart3,
  Scale,
  DollarSign,
  Clock,
  CreditCard,
  BookOpen,
  FileSpreadsheet,
  PieChart,
  ShoppingBag,
  Building,
  AlertTriangle,
  Archive,
  Shuffle,
  Repeat,
  GitMerge,
  Building2,
  Calculator,
  Coins,
  Wrench,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { REPORT_DEFINITIONS, ReportCategory, ReportDefinition } from '../../../data/mockAccountingReportsData';

interface ReportLibraryLandingProps {
  onSelectReport: (reportId: string) => void;
  selectedCategory?: ReportCategory | 'todas';
}

const ICON_MAP: Record<string, React.ElementType> = {
  TrendingUp,
  Users,
  Package,
  FileText,
  BarChart3,
  Scale,
  DollarSign,
  Clock,
  CreditCard,
  BookOpen,
  FileSpreadsheet,
  PieChart,
  ShoppingBag,
  Building,
  AlertTriangle,
  Archive,
  Shuffle,
  Repeat,
  GitMerge,
  Building2,
  Calculator,
  Coins,
  Wrench
};

const CATEGORIES: { key: ReportCategory | 'todas'; label: string; count: number }[] = [
  { key: 'todas', label: 'Todos los reportes', count: 20 },
  { key: 'finanzas', label: 'Finanzas & Contabilidad', count: 7 },
  { key: 'activos', label: 'Activos & CAPEX', count: 4 },
  { key: 'comercial', label: 'Comercial & Ventas', count: 4 },
  { key: 'compras', label: 'Compras & Proveedores', count: 3 },
  { key: 'inventarios', label: 'Inventarios & Operaciones', count: 4 }
];

export const ReportLibraryLanding: React.FC<ReportLibraryLandingProps> = ({
  onSelectReport,
  selectedCategory = 'todas'
}) => {
  const [activeCategory, setActiveCategory] = useState<ReportCategory | 'todas'>(selectedCategory);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReports = useMemo(() => {
    return REPORT_DEFINITIONS.filter((rep) => {
      const matchesCat = activeCategory === 'todas' || rep.category === activeCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        rep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rep.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rep.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Limpio e Inspirado en la Referencia */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-2 border-b border-theme-subtle">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-theme-primary/10 text-theme-primary">
              <Sparkles className="w-3 h-3" />
              Centro de Inteligencia Financiera
            </span>
            <span className="text-xs text-theme-muted">· RTM Manufactura</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-theme-main tracking-tight">
            Reportes
          </h1>
          <p className="text-sm text-theme-muted mt-1 max-w-2xl">
            Biblioteca de informes operativos, contables y financieros con trazabilidad documental de punta a punta.
          </p>
        </div>

        {/* Buscador Rápido */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
          <input
            type="text"
            placeholder="Buscar reporte o métrica..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-theme-subtle bg-theme-surface focus:outline-none focus:ring-2 focus:ring-theme-primary/30 transition-all placeholder:text-theme-muted"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-theme-muted hover:text-theme-main"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Categorías como Pills Limpios */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                isActive
                  ? 'bg-theme-main text-theme-surface shadow-xs'
                  : 'bg-theme-surface border border-theme-subtle text-theme-muted hover:text-theme-main hover:border-theme-primary/30'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? 'bg-theme-surface/20 text-theme-surface' : 'bg-theme-muted/20 text-theme-muted'
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid de Cards en 3 Columnas Desktop (Inspiración UI) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredReports.map((report) => {
          const Icon = ICON_MAP[report.iconName] || FileText;
          return (
            <div
              key={report.id}
              onClick={() => onSelectReport(report.id)}
              className="group relative flex flex-col justify-between p-6 rounded-2xl md:rounded-3xl border border-theme-subtle bg-theme-surface hover:border-theme-primary/40 hover:shadow-lg transition-all duration-200 cursor-pointer text-left"
            >
              {/* Badge de reporte clave cuando aplica */}
              {report.isKeyReport && (
                <span className="absolute top-5 right-5 inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                  <CheckCircle2 className="w-3 h-3" />
                  Oficial
                </span>
              )}

              <div>
                {/* Icono discreto en círculo suave */}
                <div className="w-11 h-11 rounded-2xl bg-theme-primary/10 text-theme-primary flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-200">
                  <Icon className="w-5 h-5" />
                </div>

                {/* Título y Categoría */}
                <span className="text-[10px] font-black uppercase tracking-wider text-theme-muted block mb-1">
                  {report.categoryLabel}
                </span>
                <h3 className="text-base font-bold text-theme-main group-hover:text-theme-primary transition-colors leading-snug">
                  {report.title}
                </h3>

                {/* Descripción concisa de una línea */}
                <p className="text-xs text-theme-muted mt-2 line-clamp-2 leading-relaxed">
                  {report.description}
                </p>
              </div>

              {/* Footer de la Card con CTA y Frecuencia */}
              <div className="mt-6 pt-4 border-t border-theme-subtle flex items-center justify-between text-xs">
                <span className="text-[11px] text-theme-muted font-medium">
                  {report.frequency} · {report.targetRole}
                </span>
                <span className="inline-flex items-center gap-1 font-bold text-theme-primary group-hover:translate-x-1 transition-transform">
                  Ver reporte
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredReports.length === 0 && (
        <div className="p-12 text-center rounded-3xl border border-dashed border-theme-subtle bg-theme-surface/50">
          <FileText className="w-8 h-8 text-theme-muted mx-auto mb-3" />
          <p className="text-sm font-bold text-theme-main">No se encontraron reportes con ese criterio</p>
          <p className="text-xs text-theme-muted mt-1">Intenta con otra palabra clave o selecciona otra categoría.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('todas');
            }}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-theme-primary text-white"
          >
            Restablecer filtros
          </button>
        </div>
      )}
    </div>
  );
};
