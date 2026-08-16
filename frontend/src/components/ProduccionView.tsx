import React, { useState } from 'react';
import { OrdenProduccion } from '../types';
import { Printer, Plus, Search, Filter } from 'lucide-react';

interface ProduccionViewProps {
  ordenes: OrdenProduccion[];
  onOpenReporteModal: () => void;
}

export const ProduccionView: React.FC<ProduccionViewProps> = ({ ordenes, onOpenReporteModal }) => {
  const [filterTech, setFilterTech] = useState<'ALL' | 'Offset' | 'Flexo'>('ALL');
  const [search, setSearch] = useState('');

  const filtered = ordenes.filter(o => {
    const matchesTech = filterTech === 'ALL' || o.tecnologia === filterTech;
    const matchesSearch = o.id.toLowerCase().includes(search.toLowerCase()) || 
                          o.cliente.toLowerCase().includes(search.toLowerCase()) ||
                          o.producto.toLowerCase().includes(search.toLowerCase());
    return matchesTech && matchesSearch;
  });

  return (
    <div className="erp-content-area">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>Programación Master & Producción</h1>
          <p style={{ fontSize: '0.9375rem', color: '#64748b' }}>Control de tirajes, balance de prensas Offset / Flexo y monitoreo de avance de órdenes RTM.</p>
        </div>

        <button className="btn-primary-blue" style={{ width: 'auto', padding: '10px 20px' }} onClick={onOpenReporteModal}>
          <Plus size={16} />
          <span>Capturar Reporte de Operador</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="clean-kpi-card" style={{ padding: '14px 20px', marginBottom: '20px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className={`filter-chip-btn ${filterTech === 'ALL' ? 'active' : ''}`}
            style={{ background: filterTech === 'ALL' ? '#0088cc' : '#f8fafc', color: filterTech === 'ALL' ? '#ffffff' : '#475569' }}
            onClick={() => setFilterTech('ALL')}
          >
            Todas las Tecnologías
          </button>
          <button 
            className={`filter-chip-btn ${filterTech === 'Offset' ? 'active' : ''}`}
            style={{ background: filterTech === 'Offset' ? '#0088cc' : '#f8fafc', color: filterTech === 'Offset' ? '#ffffff' : '#475569' }}
            onClick={() => setFilterTech('Offset')}
          >
            Offset (Pliegos)
          </button>
          <button 
            className={`filter-chip-btn ${filterTech === 'Flexo' ? 'active' : ''}`}
            style={{ background: filterTech === 'Flexo' ? '#0088cc' : '#f8fafc', color: filterTech === 'Flexo' ? '#ffffff' : '#475569' }}
            onClick={() => setFilterTech('Flexo')}
          >
            Flexo (Bobinas)
          </button>
        </div>

        <div style={{ flex: 1, minWidth: '240px' }}>
          <input 
            type="text" 
            placeholder="Buscar por OP, Cliente o Producto..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-clean"
            style={{ padding: '8px 14px' }}
          />
        </div>
      </div>

      {/* Clean Orders Table */}
      <div className="clean-table-card">
        <table className="clean-erp-table">
          <thead>
            <tr>
              <th>ID Orden</th>
              <th>Cliente / Producto</th>
              <th>Tecnología / Prensa</th>
              <th>Tiraje Meta</th>
              <th>Progreso / Buenos</th>
              <th>Merma</th>
              <th>Suaje / CTP</th>
              <th>Operador</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((ord) => (
              <tr key={ord.id}>
                <td>
                  <span className="mono-text" style={{ fontWeight: 800, color: '#0284c7' }}>{ord.id}</span>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Entrega: {ord.fecha_entrega}</div>
                </td>
                <td style={{ maxWidth: '280px' }}>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{ord.cliente}</div>
                  <div style={{ fontSize: '0.8125rem', color: '#64748b', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {ord.producto}
                  </div>
                </td>
                <td>
                  <span className={`badge-clean ${ord.tecnologia === 'Offset' ? 'badge-blue' : 'badge-green'}`} style={{ marginBottom: '2px' }}>
                    {ord.tecnologia}
                  </span>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{ord.maquina}</div>
                </td>
                <td className="mono-text" style={{ fontWeight: 700 }}>
                  {ord.tiraje_total.toLocaleString()} {ord.tecnologia === 'Offset' ? 'pliegos' : 'unid.'}
                </td>
                <td style={{ minWidth: '160px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 700 }}>{ord.avance_pct}%</span>
                    <span className="mono-text" style={{ color: '#64748b' }}>{ord.pliegos_buenos.toLocaleString()} ok</span>
                  </div>
                  <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        height: '100%',
                        width: `${ord.avance_pct}%`,
                        backgroundColor: ord.avance_pct === 100 ? '#059669' : '#0088cc' 
                      }}
                    ></div>
                  </div>
                </td>
                <td className="mono-text" style={{ color: '#ea580c', fontSize: '0.8125rem', fontWeight: 600 }}>
                  {ord.merma.toLocaleString()} ({((ord.merma / Math.max(ord.producido, 1)) * 100).toFixed(1)}%)
                </td>
                <td>
                  <span className="mono-text" style={{ background: '#f1f5f9', color: '#0284c7', padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                    {ord.suaje_codigo}
                  </span>
                </td>
                <td style={{ fontSize: '0.8125rem', color: '#475569' }}>
                  {ord.operador}
                </td>
                <td>
                  <span className={`badge-clean ${
                    ord.estado === 'En Producción' ? 'badge-green' :
                    ord.estado.includes('Auditoría') ? 'badge-blue' : 'badge-orange'
                  }`}>
                    {ord.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
