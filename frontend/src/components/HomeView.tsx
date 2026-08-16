import React from 'react';
import { 
  TrendingUp, 
  Clock, 
  ShoppingCart, 
  Truck, 
  Package, 
  Activity, 
  AlertCircle, 
  AlertTriangle, 
  ChevronRight,
  ShieldCheck,
  Printer,
  Scissors
} from 'lucide-react';

interface HomeViewProps {
  user: { name: string; role: string; email: string };
  onNavigate: (tab: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ user, onNavigate }) => {
  const kpis = [
    {
      id: 'facturado',
      value: '$4.8M MXN facturado',
      subtext: 'Este mes — Impresos RTM',
      icon: TrendingUp,
      iconBg: '#ecfdf5',
      iconColor: '#059669',
    },
    {
      id: 'tiraje_offset',
      value: '142,000 pliegos tirados',
      subtext: 'Heidelberg CD 102 (Offset)',
      icon: Clock,
      iconBg: '#fffbeb',
      iconColor: '#d97706',
    },
    {
      id: 'ordenes_activas',
      value: '18 órdenes abiertas',
      subtext: '12 en prensa, 6 en CTP',
      icon: ShoppingCart,
      iconBg: '#eff6ff',
      iconColor: '#2563eb',
    },
    {
      id: 'remisiones_empaque',
      value: '7 entregas programadas',
      subtext: 'Listas en almacén de producto',
      icon: Truck,
      iconBg: '#fff7ed',
      iconColor: '#ea580c',
    },
    {
      id: 'suajes_taller',
      value: '34 suajes en taller',
      subtext: 'Rack A y B disponibles',
      icon: Scissors,
      iconBg: '#faf5ff',
      iconColor: '#9333ea',
    },
    {
      id: 'flexo_metros',
      value: '85,400 metros bobina',
      subtext: 'Mark Andy P7 (Flexo)',
      icon: Activity,
      iconBg: '#ecfeff',
      iconColor: '#0891b2',
    },
    {
      id: 'merma_planta',
      value: '2.85% merma global',
      subtext: 'Meta planta < 3.50%',
      icon: AlertCircle,
      iconBg: '#ecfdf5',
      iconColor: '#059669',
    },
    {
      id: 'lotes_qa',
      value: '14 lotes QA liberados',
      subtext: '0 no-conformidades hoy',
      icon: ShieldCheck,
      iconBg: '#fff1f2',
      iconColor: '#e11d48',
    }
  ];

  return (
    <div className="erp-content-area">
      {/* Welcome Header from Image 2 */}
      <div className="welcome-page-header">
        <h1>Buenos días, {user.name}</h1>
        <p>Estos son los puntos críticos de producción e impresión gráfica para agosto 2026.</p>
      </div>

      {/* 8 Clean KPI Cards Grid from Image 2 */}
      <div className="reference-kpi-grid">
        {kpis.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.id} className="clean-kpi-card">
              <div className="kpi-card-top-row">
                <div 
                  className="kpi-icon-pastel"
                  style={{ backgroundColor: card.iconBg, color: card.iconColor }}
                >
                  <Icon size={18} strokeWidth={2.4} />
                </div>
                <ChevronRight size={16} className="kpi-chevron" />
              </div>
              <div>
                <div className="kpi-value-text">{card.value}</div>
                <div className="kpi-subtext-gray">{card.subtext}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Split Section: Flujo Operativo (Left) & Radar Operativo (Right) from Image 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Left: Flujo Operativo del Mes */}
        <div className="flow-stepper-card">
          <div className="flow-card-title">FLUJO OPERATIVO DEL MES — AGOSTO 2026</div>

          <div className="stepper-badges-row">
            <div className="step-box-item">
              <div className="step-badge-number" style={{ backgroundColor: '#1e293b' }}>387</div>
              <span className="step-box-label">Cotizaciones</span>
            </div>

            <span className="stepper-arrow-sep">→</span>

            <div className="step-box-item">
              <div className="step-badge-number" style={{ backgroundColor: '#0284c7' }}>128</div>
              <span className="step-box-label">Órdenes OP</span>
            </div>

            <span className="stepper-arrow-sep">→</span>

            <div className="step-box-item">
              <div className="step-badge-number" style={{ backgroundColor: '#2563eb' }}>64</div>
              <span className="step-box-label">Placas CTP</span>
            </div>

            <span className="stepper-arrow-sep">→</span>

            <div className="step-box-item">
              <div className="step-badge-number" style={{ backgroundColor: '#4f46e5' }}>59</div>
              <span className="step-box-label">En Prensas</span>
            </div>

            <span className="stepper-arrow-sep">→</span>

            <div className="step-box-item">
              <div className="step-badge-number" style={{ backgroundColor: '#9333ea' }}>41</div>
              <span className="step-box-label">Suajado / QA</span>
            </div>

            <span className="stepper-arrow-sep">→</span>

            <div className="step-box-item">
              <div className="step-badge-number" style={{ backgroundColor: '#059669' }}>36</div>
              <span className="step-box-label">Entregados</span>
            </div>
          </div>

          <div className="closure-rate-row">
            <span className="closure-rate-label">Cumplimiento de entrega a tiempo (OTD)</span>
            <div className="closure-progress-track">
              <div className="closure-progress-fill" style={{ width: '96.4%' }}></div>
            </div>
            <span className="closure-rate-val">96.4%</span>
          </div>
        </div>

        {/* Right: Radar Operativo */}
        <div className="radar-operativo-card">
          <div className="radar-header">
            <span style={{ color: '#ef4444' }}>●</span>
            <span>RADAR OPERATIVO DE PLANTA</span>
          </div>

          <div className="radar-item-alert radar-alert-red">
            <div className="radar-item-title">
              <AlertCircle size={14} color="#ef4444" />
              <span>OP-2026-881 (Heidelberg)</span>
            </div>
            <div className="radar-item-desc">Ajuste de registro y densidad de color en tiro</div>
          </div>

          <div className="radar-item-alert radar-alert-amber">
            <div className="radar-item-title">
              <AlertTriangle size={14} color="#f59e0b" />
              <span>SUJ-MED-442 (Taller)</span>
            </div>
            <div className="radar-item-desc">Suaje requiere afilado de pleca en 25K golpes</div>
          </div>

          <div className="radar-item-alert radar-alert-amber">
            <div className="radar-item-title">
              <AlertTriangle size={14} color="#f59e0b" />
              <span>LOT-AGRO-902 (QA)</span>
            </div>
            <div className="radar-item-desc">Auditoría final lista para firma de liberación</div>
          </div>

          <div className="radar-item-alert radar-alert-orange">
            <div className="radar-item-title">
              <AlertTriangle size={14} color="#ea580c" />
              <span>CTP-FLX-088 (Pre-prensa)</span>
            </div>
            <div className="radar-item-desc">Juego de clichés flexo listo para montaje</div>
          </div>
        </div>
      </div>
    </div>
  );
};
