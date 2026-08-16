import React, { useState } from 'react';
import { OrdenProduccion } from '../types';
import { Printer, Filter, Plus, Calendar, AlertCircle, CheckCircle2, User } from 'lucide-react';

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
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '4px' }}>Programación Master & Producción</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Control de tirajes, balance de líneas Offset / Flexo y monitoreo de avance de órdenes RTM.
          </p>
        </div>
        <button className="btn btn-primary" onClick={onOpenReporteModal}>
          <Plus size={16} />
          <span>Capturar Reporte de Operador</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '16px', marginBottom: '20px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className={`btn btn-sm ${filterTech === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterTech('ALL')}
          >
            Todas las Tecnologías
          </button>
          <button 
            className={`btn btn-sm ${filterTech === 'Offset' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterTech('Offset')}
          >
            Offset (Pliegos)
          </button>
          <button 
            className={`btn btn-sm ${filterTech === 'Flexo' ? 'btn-primary' : 'btn-secondary'}`}
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
            className="form-input"
            style={{ padding: '8px 12px' }}
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="table-container">
        <table className="data-table">
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
                  <span className="mono-text" style={{ fontWeight: 700, color: '#60a5fa' }}>{ord.id}</span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Entrega: {ord.fecha_entrega}</div>
                </td>
                <td style={{ maxWidth: '280px' }}>
                  <div style={{ fontWeight: 600 }}>{ord.cliente}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {ord.producto}
                  </div>
                </td>
                <td>
                  <span className={`badge ${ord.tecnologia === 'Offset' ? 'badge-blue' : 'badge-cyan'}`} style={{ marginBottom: '4px' }}>
                    {ord.tecnologia}
                  </span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{ord.maquina}</div>
                </td>
                <td className="mono-text" style={{ fontWeight: 600 }}>
                  {ord.tiraje_total.toLocaleString()} {ord.tecnologia === 'Offset' ? 'pliegos' : 'unid.'}
                </td>
                <td style={{ minWidth: '160px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                    <span>{ord.avance_pct}%</span>
                    <span className="mono-text">{ord.pliegos_buenos.toLocaleString()} ok</span>
                  </div>
                  <div className="progress-track">
                    <div 
                      className="progress-bar" 
                      style={{ 
                        width: `${ord.avance_pct}%`,
                        backgroundColor: ord.avance_pct === 100 ? 'var(--status-success)' : 'var(--accent-blue)' 
                      }}
                    ></div>
                  </div>
                </td>
                <td className="mono-text" style={{ color: 'var(--status-warning)', fontSize: '0.8125rem' }}>
                  {ord.merma.toLocaleString()} ({((ord.merma / Math.max(ord.producido, 1)) * 100).toFixed(1)}%)
                </td>
                <td>
                  <span className="badge badge-secondary mono-text" style={{ background: 'rgba(255,255,255,0.05)', color: '#38bdf8' }}>
                    {ord.suaje_codigo}
                  </span>
                </td>
                <td style={{ fontSize: '0.8125rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <User size={14} color="var(--text-muted)" />
                    <span>{ord.operador}</span>
                  </div>
                </td>
                <td>
                  <span className={`badge ${
                    ord.estado === 'En Producción' ? 'badge-success' :
                    ord.estado.includes('Auditoría') ? 'badge-cyan' : 'badge-warning'
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
