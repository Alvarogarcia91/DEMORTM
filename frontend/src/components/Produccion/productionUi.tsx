import React from 'react';

export const ProductionCard: React.FC<{children: React.ReactNode; className?: string}> = ({ children, className = '' }) => (
  <section className={`rounded-2xl border border-theme-subtle bg-theme-surface shadow-2xs ${className}`}>{children}</section>
);

export const StatusBadge: React.FC<{status: string}> = ({ status }) => {
  const tone = status === 'Detenida' ? 'border-rose-400 text-rose-700' : status === 'Pendiente de calidad' ? 'border-amber-400 text-amber-700' : status === 'En proceso' || status === 'En preparación' ? 'border-blue-400 text-blue-700' : 'border-emerald-400 text-emerald-700';
  return <span className={`inline-flex rounded-full border bg-theme-surface px-2 py-1 text-[10px] font-bold ${tone}`}>● {status}</span>;
};

export const ProgressBar: React.FC<{value: number; tone?: string}> = ({ value, tone = 'bg-theme-primary' }) => (
  <span className="block h-2 overflow-hidden rounded-full bg-theme-muted"><i className={`block h-full rounded-full ${tone}`} style={{ width: `${Math.min(100, value)}%` }} /></span>
);

export const formatNumber = (value: number) => value.toLocaleString('es-MX');
